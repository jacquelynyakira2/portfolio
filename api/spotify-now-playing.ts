interface SpotifyTrackInfo {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  externalUrl?: string;
  previewUrl?: string;
  type: "track" | "episode" | "unknown";
  isPlaying: boolean;
  lastUpdated: number;
}

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const basicAuthHeader =
  clientId && clientSecret
    ? Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    : null;

async function refreshAccessToken(): Promise<string> {
  if (!clientId || !clientSecret || !refreshToken || !basicAuthHeader) {
    throw new Error("Spotify server credentials are not configured.");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuthHeader}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      payload.error_description || "Unable to refresh Spotify access token"
    );
  }

  return payload.access_token as string;
}

async function fetchSpotify<T>(endpoint: string, accessToken: string): Promise<T | null> {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status === 204) return null;
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("spotify-unauthorized");
    }

    const message = await response.text();
    throw new Error(`Spotify API error ${response.status}: ${message}`);
  }

  return (await response.json()) as T;
}

function mapTrack(payload: any, isPlaying: boolean): SpotifyTrackInfo | null {
  if (!payload) return null;

  if (payload.type === "episode" || payload.show) {
    const images = payload.images ?? payload.show?.images ?? [];
    return {
      id: payload.id,
      title: payload.name,
      subtitle: payload.show?.publisher || payload.show?.name || "Podcast",
      coverUrl: images[0]?.url ?? "",
      externalUrl: payload.external_urls?.spotify,
      previewUrl: payload.audio_preview_url ?? undefined,
      type: "episode",
      isPlaying,
      lastUpdated: Date.now()
    } satisfies SpotifyTrackInfo;
  }

  if (payload.type === "track" || payload.album) {
    const artistNames = Array.isArray(payload.artists)
      ? payload.artists
          .map((artist: any) => artist.name)
          .filter(Boolean)
          .join(", ")
      : payload.artist || "";
    const albumImages = payload.album?.images ?? [];

    return {
      id: payload.id,
      title: payload.name,
      subtitle: artistNames,
      coverUrl: albumImages[0]?.url ?? "",
      externalUrl: payload.external_urls?.spotify,
      previewUrl: payload.preview_url ?? undefined,
      type: "track",
      isPlaying,
      lastUpdated: Date.now()
    } satisfies SpotifyTrackInfo;
  }

  return null;
}

async function resolveTrack(accessToken: string): Promise<SpotifyTrackInfo | null> {
  const nowPlaying = await fetchSpotify<any>("/me/player/currently-playing", accessToken);

  if (nowPlaying?.item) {
    const track = mapTrack(nowPlaying.item, Boolean(nowPlaying.is_playing));
    if (track) return track;
  }

  const recent = await fetchSpotify<any>(
    "/me/player/recently-played?limit=1",
    accessToken
  );
  const lastItem = recent?.items?.[0]?.track;
  return mapTrack(lastItem, false);
}

export default async function handler(request: any, response: any) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let accessToken = await refreshAccessToken();
    let track: SpotifyTrackInfo | null = null;

    try {
      track = await resolveTrack(accessToken);
    } catch (error) {
      if (error instanceof Error && error.message === "spotify-unauthorized") {
        accessToken = await refreshAccessToken();
        track = await resolveTrack(accessToken);
      } else {
        throw error;
      }
    }

    response.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=30");
    return response.status(200).json({
      track,
      fetchedAt: Date.now()
    });
  } catch (error) {
    console.error("Spotify now-playing endpoint failed", error);
    return response.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve Spotify now playing information"
    });
  }
}
