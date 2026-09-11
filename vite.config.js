import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { exchangeSpotifyCode, getRecentlyPlayed, getSpotifyAuthorizationUrl } from './server/spotify.js';

const resultPage = (success, message) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Spotify setup</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#201f1c;color:#f0eee8;font-family:system-ui,sans-serif}.card{width:min(520px,calc(100vw - 40px));padding:34px;border:1px solid #65615b;border-radius:18px;background:#2c2a27}small{letter-spacing:.12em;color:#1ed760}h1{font:48px Georgia,serif;margin:18px 0 12px}p{line-height:1.5;color:#c9c5be}a{display:inline-block;margin-top:18px;color:inherit;text-underline-offset:5px}</style></head><body><main class="card"><small>${success ? 'CONNECTED' : 'SETUP NEEDED'}</small><h1>${success ? 'Spotify is live.' : 'Spotify could not connect.'}</h1><p>${message}</p><a href="/">Return to portfolio →</a></main></body></html>`;

const createState = (secret) => {
  const payload = `${Date.now()}.${randomBytes(18).toString('hex')}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
};

const verifyState = (state, secret) => {
  const [timestamp, nonce, signature] = state?.split('.') ?? [];
  if (!timestamp || !nonce || !signature || Date.now() - Number(timestamp) > 10 * 60 * 1000) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${nonce}`).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
};

export default defineConfig(({ mode }) => {
  const runtimeEnv = { ...process.env, ...loadEnv(mode, process.cwd(), 'SPOTIFY_') };
  const redirectUri = runtimeEnv.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5174/callback';
  return {
    plugins: [react(), {
      name: 'spotify-development-api',
      configureServer(server) {
        server.middlewares.use((_request, response, next) => {
          if (!_request.url?.startsWith('/api/spotify/login')) return next();
          if (!runtimeEnv.SPOTIFY_CLIENT_ID || !runtimeEnv.SPOTIFY_CLIENT_SECRET) {
            response.statusCode = 503;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(resultPage(false, 'Add your new client ID and rotated client secret to .env.local, restart the server, then try again.'));
            return;
          }
          const state = createState(runtimeEnv.SPOTIFY_CLIENT_SECRET);
          response.statusCode = 302;
          response.setHeader('Location', getSpotifyAuthorizationUrl({ clientId: runtimeEnv.SPOTIFY_CLIENT_ID, redirectUri, state }));
          response.end();
        });

        server.middlewares.use(async (request, response, next) => {
          if (!request.url?.startsWith('/callback') && !request.url?.startsWith('/api/spotify/callback')) return next();
          const url = new URL(request.url, redirectUri);
          const state = url.searchParams.get('state');
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          if (!verifyState(state, runtimeEnv.SPOTIFY_CLIENT_SECRET) || !url.searchParams.get('code')) {
            response.statusCode = 400;
            response.end(resultPage(false, 'The authorization response was missing or could not be verified. Return to the portfolio and try again.'));
            return;
          }
          try {
            const tokens = await exchangeSpotifyCode({ clientId: runtimeEnv.SPOTIFY_CLIENT_ID, clientSecret: runtimeEnv.SPOTIFY_CLIENT_SECRET, code: url.searchParams.get('code'), redirectUri });
            if (!tokens.refresh_token) throw new Error('Spotify did not return a refresh token.');
            runtimeEnv.SPOTIFY_REFRESH_TOKEN = tokens.refresh_token;
            const envPath = resolve(process.cwd(), '.env.local');
            let contents = '';
            try { contents = await readFile(envPath, 'utf8'); } catch {}
            const line = `SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`;
            contents = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(contents) ? contents.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line) : `${contents.trimEnd()}${contents.trim() ? '\n' : ''}${line}\n`;
            await writeFile(envPath, contents, { mode: 0o600 });
            response.end(resultPage(true, 'Your refresh token was saved privately to .env.local. The listening widget can now fetch your latest track.'));
          } catch {
            response.statusCode = 502;
            response.end(resultPage(false, 'Spotify rejected the authorization exchange. Confirm that the redirect URI exactly matches the one in your Spotify dashboard.'));
          }
        });

        server.middlewares.use(async (_request, response, next) => {
          if (_request.url?.split('?')[0] !== '/api/spotify') return next();
          response.setHeader('Content-Type', 'application/json');
          try {
            const track = await getRecentlyPlayed(runtimeEnv);
            response.statusCode = 200;
            response.end(JSON.stringify({ track }));
          } catch (error) {
            response.statusCode = error.code === 'SPOTIFY_NOT_CONFIGURED' ? 503 : 502;
            response.end(JSON.stringify({ error: error.code ?? 'SPOTIFY_UNAVAILABLE' }));
          }
        });
      },
    }],
  };
});
