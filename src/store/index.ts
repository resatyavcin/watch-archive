import { configureStore } from "@reduxjs/toolkit";
import { appSlice } from "./appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { setTheme, hydrateTheme, getStoredTheme } from "./appSlice";
export type { Theme } from "./appSlice";
