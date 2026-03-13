import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "watch-archive-theme";

export type Theme = "light" | "dark" | "system";

export type MediaType = "movie" | "tv";

type AppState = {
  theme: Theme;
  mediaType: MediaType;
};

const initialState: AppState = {
  theme: "system",
  mediaType: "movie",
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
  },
});

export const { setTheme, setMediaType, hydrateTheme } = appSlice.actions;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}
