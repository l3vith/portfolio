# Spotify widget setup

The widget reads the most recent track through Spotify's Web API. Credentials stay on the server and are never included in the browser bundle.

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. In the app settings, add `http://127.0.0.1:5174/callback` as a Redirect URI.
3. Copy `.env.example` to `.env.local` and add the app's client ID and rotated client secret. Leave the refresh-token value empty.
4. Restart the development server and click **Connect Spotify** inside the listening widget.
5. Approve the `user-read-recently-played` permission. The local callback validates the response and saves the refresh token privately into `.env.local`.
6. For deployment, add the same three credentials as server-side environment variables.

The browser requests `/api/spotify`; the server refreshes the short-lived access token and asks Spotify for one recently played item. Responses are cached briefly to avoid unnecessary API calls.
