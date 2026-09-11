import { getRecentlyPlayed } from '../server/spotify.js';

export default async function handler(request, response) {
  try {
    const track = await getRecentlyPlayed();
    response.setHeader('Cache-Control', 's-maxage=45, stale-while-revalidate=120');
    return response.status(200).json({ track });
  } catch (error) {
    const status = error.code === 'SPOTIFY_NOT_CONFIGURED' ? 503 : 502;
    return response.status(status).json({ error: error.code ?? 'SPOTIFY_UNAVAILABLE' });
  }
}
