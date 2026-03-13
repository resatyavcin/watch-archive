import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "watch-archive-theme";

export type Theme = "light" | "dark" | "system";

type AppState = {
  theme: Theme;
};

const initialState: AppState = {
  theme: "system",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
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

export const { setTheme, hydrateTheme } = appSlice.actions;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}
