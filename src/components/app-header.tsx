"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "@/components/ui/logo";
import { setTheme } from "@/store";
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

const ICON_SIZE = "size-10";

const iconButtonClass =
  "flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground";

export function AppHeader() {
  const dispatch = useDispatch();
  const resolvedDark = useResolvedDark();

  const toggleTheme = () => {
    dispatch(setTheme(resolvedDark ? "light" : "dark"));
  };

  return (
    <header className="flex h-12 w-full shrink-0 items-center pt-2">
      <div className="flex min-w-0 flex-1 items-center justify-start" />
      <Link
        href="/"
        className="flex shrink-0 items-center justify-center outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Ana sayfaya git"
      >
        <Logo className="shrink-0" />
      </Link>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          className={`${iconButtonClass} ${ICON_SIZE}`}
          aria-label={resolvedDark ? "Açık tema" : "Koyu tema"}
        >
          {resolvedDark ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>
      </div>
    </header>
  );
}
