# Spotify Now Playing Integration Notes

## Authorization strategy
- Endpoints such as `/me/player/currently-playing` require a user token; the Client Credentials flow (the tutorial you pasted) cannot access personal listening data.
- Generate a long-lived refresh token once via the Authorization Code + PKCE flow, keep it in server-side storage, and use it to mint short-lived access tokens.
- Expose the resulting now-playing data to the frontend through a serverless endpoint; do **not** ship your client secret or refresh token to the browser.

## One-time token bootstrap
1. Register an app in the [Spotify Dashboard](https://developer.spotify.com/dashboard).
2. Add your callback URL (e.g. `http://localhost:5173/callback/spotify`) to **Redirect URIs**.
3. Visit `https://accounts.spotify.com/authorize?response_type=code&client_id=YOUR_CLIENT_ID&scope=user-read-currently-playing%20user-read-playback-state%20user-read-recently-played&redirect_uri=YOUR_ENCODED_REDIRECT_URI&code_challenge=CHALLENGE&code_challenge_method=S256&state=xyz`.
4. Capture the `code` parameter from the redirected URL and exchange it for tokens:
   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "grant_type=authorization_code" \
     -d "code=THE_CODE_FROM_STEP_3" \
     -d "code_verifier=THE_VERIFIER_FROM_STEP_3" \
     -d "redirect_uri=YOUR_REDIRECT_URI"
   ```
5. Persist the returned `refresh_token` in backend-only storage (e.g. Vercel/Netlify environment variables).

## Serverless endpoint
- Use `api/spotify-now-playing.ts` (added in this repo) as a Vercel-ready handler.
- Required env vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`.
- The handler refreshes the access token, resolves the current track (with a recently-played fallback), and responds with:
  ```json
  {
    "track": {
      "title": "…",
      "subtitle": "…",
      "coverUrl": "…",
      "type": "track|episode",
      "isPlaying": true,
      "previewUrl": "…"
    },
    "fetchedAt": 1700000000000
  }
  ```

## Frontend configuration
- For a public, read-only widget set `VITE_SPOTIFY_PUBLIC_STATUS_URL=/api/spotify-now-playing` in `.env.local` (or the deployed equivalent).
- Optional: keep `VITE_SPOTIFY_CLIENT_ID` defined if you still want the owner-only connect button locally; when the public URL is set the UI hides the manual connect prompt.
- Without either env var the widget falls back to the static `src/configs/music.ts` entry.
