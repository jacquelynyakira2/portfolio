import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const noop = () => {};

interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SpotifyTrackInfo {
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

export type SpotifyMode = "public" | "client" | "disabled";

export type SpotifyStatus =
  | "missing-config"
  | "idle"
  | "authorizing"
  | "refreshing"
  | "ready"
  | "error";

interface SpotifyState {
  status: SpotifyStatus;
  track: SpotifyTrackInfo | null;
  error?: string;
}

interface PublicNowPlayingPayload {
  track?: SpotifyTrackInfo | null;
  error?: string;
  fetchedAt?: number;
}

const TOKEN_STORAGE_KEY = "spotify:tokens";
const CODE_VERIFIER_KEY = "spotify:code_verifier";
const STATE_STORAGE_KEY = "spotify:auth_state";
const DEFAULT_SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played"
];

const isBrowser = typeof window !== "undefined";

const loadStoredTokens = (): SpotifyTokens | null => {
  if (!isBrowser) return null;

  const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SpotifyTokens;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.expiresAt) return null;
    return parsed;
  } catch (error) {
    console.warn("Failed to parse stored Spotify tokens", error);
    return null;
  }
};

const persistTokens = (tokens: SpotifyTokens | null) => {
  if (!isBrowser) return;

  if (tokens) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const clearAuthArtifacts = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(CODE_VERIFIER_KEY);
  window.localStorage.removeItem(STATE_STORAGE_KEY);
};

const base64UrlEncode = (buffer: ArrayBuffer): string => {
  let string = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i += 1) {
    string += String.fromCharCode(bytes[i]);
  }

  return btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const generateRandomString = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (num) => num % 36)
    .map((num) => num.toString(36))
    .join("");
};

const createCodeChallenge = async (verifier: string): Promise<string> => {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
};

const getRedirectUri = (): string => {
  if (!isBrowser) return "";
  const envValue = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string | undefined;
  if (envValue) return envValue;
  return `${window.location.origin}${window.location.pathname}`;
};

interface FetchOptions {
  accessToken: string;
  retryOnUnauthorized?: boolean;
}

export function useSpotifyNowPlaying(pollInterval = 30_000) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;
  const publicStatusUrl = import.meta.env.VITE_SPOTIFY_PUBLIC_STATUS_URL as
    | string
    | undefined;

  const mode: SpotifyMode = publicStatusUrl ? "public" : clientId ? "client" : "disabled";

  const scopes = useMemo(() => {
    if (mode !== "client") return DEFAULT_SCOPES;
    const raw = import.meta.env.VITE_SPOTIFY_SCOPES as string | undefined;
    if (!raw) return DEFAULT_SCOPES;
    return raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }, [mode]);

  const [tokens, setTokens] = useState<SpotifyTokens | null>(() =>
    mode === "client" ? loadStoredTokens() : null
  );
  const tokensRef = useRef(tokens);
  const [state, setState] = useState<SpotifyState>(() => ({
    status: mode === "disabled" ? "missing-config" : "idle",
    track: null
  }));

  const refreshPromise = useRef<Promise<SpotifyTokens> | null>(null);
  const pollerRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== "client") {
      tokensRef.current = null;
      persistTokens(null);
      return;
    }

    tokensRef.current = tokens;
    persistTokens(tokens);
  }, [mode, tokens]);

  useEffect(() => {
    if (mode !== "disabled") return;

    setState({
      status: "missing-config",
      track: null,
      error:
        "Spotify integration is not configured. Set VITE_SPOTIFY_PUBLIC_STATUS_URL for public display or VITE_SPOTIFY_CLIENT_ID to enable PKCE auth."
    });
  }, [mode]);

  const setErrorState = useCallback((message: string) => {
    setState({ status: "error", track: null, error: message });
  }, []);

  const fetchPublicStatus = useCallback(async () => {
    if (mode !== "public" || !publicStatusUrl) return;

    setState((prev) => ({
      ...prev,
      status: prev.status === "ready" ? "refreshing" : prev.status
    }));

    try {
      const response = await fetch(publicStatusUrl, {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Spotify status endpoint returned ${response.status}`);
      }

      const payload = (await response.json()) as PublicNowPlayingPayload;

      if (payload?.track) {
        setState({ status: "ready", track: payload.track, error: undefined });
      } else if (payload?.error) {
        setState({ status: "error", track: null, error: payload.error });
      } else {
        setState({ status: "ready", track: null, error: undefined });
      }
    } catch (error) {
      setState((prev) => ({
        status: "error",
        track: prev.track,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Spotify status payload"
      }));
    }
  }, [mode, publicStatusUrl]);

  useEffect(() => {
    if (mode !== "public") return;

    fetchPublicStatus();
    const id = window.setInterval(fetchPublicStatus, pollInterval);
    return () => {
      window.clearInterval(id);
    };
  }, [mode, fetchPublicStatus, pollInterval]);

  if (mode === "public") {
    return {
      track: state.track,
      status: state.status,
      error: state.error,
      isConfigured: true,
      isAuthenticated: true,
      authorize: noop,
      disconnect: noop,
      refresh: fetchPublicStatus,
      mode
    } as const;
  }

  if (mode === "disabled") {
    return {
      track: state.track,
      status: state.status,
      error: state.error,
      isConfigured: false,
      isAuthenticated: false,
      authorize: noop,
      disconnect: noop,
      refresh: noop,
      mode
    } as const;
  }

  const exchangeCodeForToken = useCallback(
    async (code: string, verifier: string): Promise<SpotifyTokens> => {
      if (!clientId) throw new Error("Spotify client ID missing");

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: getRedirectUri(),
        code_verifier: verifier
      });

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error_description || "Failed to exchange Spotify authorization code"
        );
      }

      const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt
      };
    },
    [clientId]
  );

  const refreshAccessToken = useCallback(
    async (currentTokens?: SpotifyTokens): Promise<SpotifyTokens> => {
      if (!clientId) throw new Error("Spotify client ID missing");

      const baseTokens = currentTokens ?? tokensRef.current;
      if (!baseTokens?.refreshToken) throw new Error("Missing Spotify refresh token");

      if (!refreshPromise.current) {
        const body = new URLSearchParams({
          client_id: clientId,
          grant_type: "refresh_token",
          refresh_token: baseTokens.refreshToken
        });

        refreshPromise.current = fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        })
          .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
              throw new Error(
                data.error_description || "Failed to refresh Spotify session"
              );
            }

            return {
              accessToken: data.access_token,
              refreshToken: data.refresh_token ?? baseTokens.refreshToken,
              expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000
            } satisfies SpotifyTokens;
          })
          .finally(() => {
            refreshPromise.current = null;
          });
      }

      const updated = await refreshPromise.current;
      setTokens(updated);
      return updated;
    },
    [clientId]
  );

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    const stored = tokensRef.current;
    if (!stored) return null;

    const needsRefresh = stored.expiresAt - Date.now() < 60_000;
    if (!needsRefresh) return stored.accessToken;

    try {
      const updated = await refreshAccessToken(stored);
      return updated.accessToken;
    } catch (error) {
      setErrorState(
        error instanceof Error ? error.message : "Unable to refresh Spotify session"
      );
      setTokens(null);
      return null;
    }
  }, [refreshAccessToken, setErrorState]);

  const fetchWithAccessToken = useCallback(
    async (url: string, options: FetchOptions): Promise<Response | null> => {
      const { accessToken, retryOnUnauthorized = true } = options;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401 && retryOnUnauthorized) {
        try {
          const refreshed = await refreshAccessToken();
          return fetchWithAccessToken(url, {
            accessToken: refreshed.accessToken,
            retryOnUnauthorized: false
          });
        } catch (error) {
          setErrorState(
            error instanceof Error
              ? error.message
              : "Spotify session expired. Please reconnect."
          );
          setTokens(null);
          return null;
        }
      }

      return response;
    },
    [refreshAccessToken, setErrorState]
  );

  const parseTrack = useCallback(
    (payload: any, isPlaying: boolean): SpotifyTrackInfo | null => {
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
    },
    []
  );

  const fetchRecentlyPlayed = useCallback(
    async (accessToken: string) => {
      const response = await fetchWithAccessToken(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        { accessToken }
      );

      if (!response || !response.ok) return null;

      const payload = await response.json();
      const recentItem = payload.items?.[0];
      if (!recentItem) return null;

      return parseTrack(recentItem.track, false);
    },
    [fetchWithAccessToken, parseTrack]
  );

  const fetchNowPlaying = useCallback(async () => {
    if (!tokensRef.current) return;

    const accessToken = await getValidAccessToken();
    if (!accessToken) return;

    setState((prev) => ({
      ...prev,
      status: prev.status === "ready" ? "refreshing" : prev.status
    }));

    const response = await fetchWithAccessToken(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { accessToken }
    );

    if (!response) return;

    if (response.status === 204) {
      const recent = await fetchRecentlyPlayed(accessToken);
      setState({ status: "ready", track: recent, error: undefined });
      return;
    }

    if (!response.ok) {
      if (response.status === 429) {
        setErrorState("Spotify rate limit hit. Please wait a moment.");
      } else {
        setErrorState(`Unable to fetch Spotify playback (status ${response.status})`);
      }
      return;
    }

    const payload = await response.json();
    const track = parseTrack(payload.item, payload.is_playing);

    if (track) {
      setState({ status: "ready", track, error: undefined });
    } else {
      const recent = await fetchRecentlyPlayed(accessToken);
      setState({ status: "ready", track: recent, error: undefined });
    }
  }, [
    fetchRecentlyPlayed,
    fetchWithAccessToken,
    getValidAccessToken,
    parseTrack,
    setErrorState
  ]);

  const authorize = useCallback(async () => {
    if (!isBrowser) return;
    if (!clientId) {
      setErrorState("Spotify client ID is not configured");
      return;
    }

    try {
      setState((prev) => ({ ...prev, status: "authorizing", error: undefined }));

      const codeVerifier = generateRandomString(64);
      const codeChallenge = await createCodeChallenge(codeVerifier);
      const authState = generateRandomString(16);

      window.localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
      window.localStorage.setItem(STATE_STORAGE_KEY, authState);

      const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scopes.join(" "),
        redirect_uri: getRedirectUri(),
        state: authState,
        code_challenge_method: "S256",
        code_challenge: codeChallenge
      });

      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    } catch (error) {
      console.error("Spotify authorization failed", error);
      setErrorState("Spotify authorization failed");
      clearAuthArtifacts();
    }
  }, [clientId, scopes, setErrorState]);

  const disconnect = useCallback(() => {
    clearAuthArtifacts();
    setTokens(null);
    setState({
      status: clientId ? "idle" : "missing-config",
      track: null,
      error: undefined
    });
  }, [clientId]);

  useEffect(() => {
    if (!isBrowser || !clientId) return;

    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get("error");
    const code = url.searchParams.get("code");
    const stateParam = url.searchParams.get("state");

    if (errorParam) {
      setErrorState(
        errorParam === "access_denied" ? "Spotify access was denied" : errorParam
      );
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
      clearAuthArtifacts();
      return;
    }

    if (!code) return;

    const storedState = window.localStorage.getItem(STATE_STORAGE_KEY);
    if (!stateParam || stateParam !== storedState) {
      setErrorState("Spotify authorization state mismatch");
      clearAuthArtifacts();
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
      return;
    }

    const verifier = window.localStorage.getItem(CODE_VERIFIER_KEY);
    if (!verifier) {
      setErrorState("Spotify authorization code verifier missing");
      clearAuthArtifacts();
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
      return;
    }

    setState((prev) => ({ ...prev, status: "authorizing", error: undefined }));

    exchangeCodeForToken(code, verifier)
      .then((newTokens) => {
        setTokens(newTokens);
        setState({ status: "ready", track: null });
      })
      .catch((error) => {
        console.error("Failed to exchange Spotify code", error);
        setErrorState(
          error instanceof Error
            ? error.message
            : "Failed to exchange Spotify authorization code"
        );
      })
      .finally(() => {
        clearAuthArtifacts();
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
      });
  }, [clientId, exchangeCodeForToken, setErrorState]);

  useEffect(() => {
    if (!tokens) {
      if (pollerRef.current) {
        window.clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
      return;
    }

    fetchNowPlaying();
    pollerRef.current = window.setInterval(fetchNowPlaying, pollInterval);

    return () => {
      if (pollerRef.current) {
        window.clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, [fetchNowPlaying, pollInterval, tokens]);

  return {
    track: state.track,
    status: state.status,
    error: state.error,
    isConfigured: Boolean(clientId),
    isAuthenticated: Boolean(tokens),
    authorize,
    disconnect,
    refresh: fetchNowPlaying,
    mode
  };
}
