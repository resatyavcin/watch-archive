import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "watch-archive-theme";
const ADULT_PREFERENCE_KEY = "watch-archive-allow-adult";

export type Theme = "light" | "dark" | "system";

export type MediaType = "movie" | "tv";

type AppState = {
  theme: Theme;
  mediaType: MediaType;
  allowAdult: boolean;
};

const initialState: AppState = {
  theme: "system",
  mediaType: "movie",
  allowAdult: false,
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
  },
});

export const { setTheme, setMediaType, hydrateTheme, setAllowAdult, hydrateAllowAdult } = appSlice.actions;

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
