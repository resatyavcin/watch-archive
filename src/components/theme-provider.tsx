"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoredTheme, hydrateTheme } from "@/store";
import type { RootState } from "@/store";

function useResolvedDark() {
  const theme = useSelector((state: RootState) => state.app.theme);
  const [resolvedDark, setResolvedDark] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setResolvedDark(true);
      return;
    }
    if (theme === "light") {
      setResolvedDark(false);
      return;
    }
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedDark(m.matches);
    const fn = () => setResolvedDark(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, [theme]);

  return resolvedDark;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const resolvedDark = useResolvedDark();

  useEffect(() => {
    dispatch(hydrateTheme(getStoredTheme()));
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedDark]);

  return <>{children}</>;
}
