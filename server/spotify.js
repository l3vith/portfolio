export async function getRecentlyPlayed(env = process.env) {
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const error = new Error('Spotify credentials are not configured.');
    error.code = 'SPOTIFY_NOT_CONFIGURED';
    throw error;
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });

  if (!tokenResponse.ok) throw new Error(`Spotify token refresh failed (${tokenResponse.status}).`);
  const { access_token: accessToken } = await tokenResponse.json();
  const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!recentResponse.ok) throw new Error(`Spotify recently played request failed (${recentResponse.status}).`);
  const recent = await recentResponse.json();
  const item = recent.items?.[0];
  if (!item?.track) return null;

  return {
    title: item.track.name,
    artists: item.track.artists.map((artist) => artist.name).join(', '),
    album: item.track.album.name,
    image: item.track.album.images?.[0]?.url ?? null,
    url: item.track.external_urls?.spotify ?? null,
    playedAt: item.played_at,
  };
}

export function getSpotifyAuthorizationUrl({ clientId, redirectUri, state }) {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'user-read-recently-played',
    state,
    show_dialog: 'true',
  });
  return `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeSpotifyCode({ clientId, clientSecret, code, redirectUri }) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
  });
  if (!response.ok) throw new Error(`Spotify authorization failed (${response.status}).`);
  return response.json();
}
