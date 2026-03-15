import { createSlice } from "@reduxjs/toolkit";
import type { UserDto } from "@/types/auth";

const STORAGE_KEY = "watch-archive-theme";
const ADULT_PREFERENCE_KEY = "watch-archive-allow-adult";
const AUTH_STORAGE_KEY = "watch-archive-auth";
const MEDIA_TOGGLE_HINT_SESSION = "watcharchive-media-toggle-hint-session";

export type Theme = "light" | "dark" | "system";

export type MediaType = "movie" | "tv";

export type AuthState = {
  accessToken: string | null;
  user: UserDto | null;
  expiresAt: number | null;
};

type AppState = {
  theme: Theme;
  mediaType: MediaType;
  allowAdult: boolean;
  auth: AuthState;
  authHydrated: boolean;
};

const initialState: AppState = {
  theme: "system",
  mediaType: "movie",
  allowAdult: false,
  auth: {
    accessToken: null,
    user: null,
    expiresAt: null,
  },
  authHydrated: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMediaType: (state, action: { payload: MediaType }) => {
      state.mediaType = action.payload;
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    hydrateTheme: (state, action: { payload: Theme }) => {
      state.theme = action.payload;
    },
    setAllowAdult: (state, action: { payload: boolean }) => {
      state.allowAdult = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(ADULT_PREFERENCE_KEY, String(action.payload));
      }
    },
    hydrateAllowAdult: (state, action: { payload: boolean }) => {
      state.allowAdult = action.payload;
    },
    setAuth: (
      state,
      action: {
        payload: {
          accessToken: string;
          user: UserDto;
          expiresIn: number;
        };
      }
    ) => {
      const { accessToken, user, expiresIn } = action.payload;
      state.auth = {
        accessToken,
        user,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            accessToken,
            user,
            expiresAt: Date.now() + expiresIn * 1000,
          })
        );
        sessionStorage.removeItem(MEDIA_TOGGLE_HINT_SESSION);
      }
    },
    clearAuth: (state) => {
      state.auth = { accessToken: null, user: null, expiresAt: null };
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    hydrateAuth: (state, action: { payload: AuthState }) => {
      state.auth = action.payload;
    },
    setAuthHydrated: (state) => {
      state.authHydrated = true;
    },
  },
});

export const {
  setTheme,
  setMediaType,
  hydrateTheme,
  setAllowAdult,
  hydrateAllowAdult,
  setAuth,
  clearAuth,
  hydrateAuth,
  setAuthHydrated,
} = appSlice.actions;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function getStoredAllowAdult(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADULT_PREFERENCE_KEY) === "true";
}

export function getStoredAuth(): AuthState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AuthState;
    if (data.expiresAt && data.expiresAt < Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
