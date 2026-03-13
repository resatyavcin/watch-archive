import { configureStore } from "@reduxjs/toolkit";
import { titlesApi } from "@/api/titlesApi";
import { appSlice } from "./appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [titlesApi.reducerPath]: titlesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(titlesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { setTheme, setMediaType, hydrateTheme, getStoredTheme } from "./appSlice";
export type { Theme, MediaType } from "./appSlice";
