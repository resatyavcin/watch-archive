"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, Moon, Sun, Tv } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "@/components/ui/logo";
import { ProBanner } from "@/components/pro-banner";
import { setMediaType, setTheme, store } from "@/store";
import type { RootState } from "@/store";

const MEDIA_TOGGLE_HINT_SESSION = "watcharchive-media-toggle-hint-session";

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
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground";

const mediaToggleBase =
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors";

const filmStyles = "bg-[#e67e22]/15 text-[#e67e22] hover:bg-[#e67e22]/25 dark:hover:bg-[#e67e22]/25";
const diziStyles = "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-600 dark:hover:bg-emerald-400/25 dark:hover:text-emerald-400";

type AppHeaderProps = { leftPadding?: boolean };

export function AppHeader({ leftPadding }: AppHeaderProps = {}) {
  const dispatch = useDispatch();
  const resolvedDark = useResolvedDark();
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(MEDIA_TOGGLE_HINT_SESSION);
    if (seen) return;

    const startId = setTimeout(() => setShowHint(true), 100);
    const stopId = setTimeout(() => {
      setShowHint(false);
      sessionStorage.setItem(MEDIA_TOGGLE_HINT_SESSION, "1");
    }, 3100);

    return () => {
      clearTimeout(startId);
      clearTimeout(stopId);
    };
  }, []);

  const handleMediaToggle = () => {
    const current = store.getState().app.mediaType;
    dispatch(setMediaType(current === "movie" ? "tv" : "movie"));
    setShowHint(false);
    sessionStorage.setItem(MEDIA_TOGGLE_HINT_SESSION, "1");
  };

  const toggleTheme = () => {
    dispatch(setTheme(resolvedDark ? "light" : "dark"));
  };

  return (
    <header className="flex w-full shrink-0 flex-col gap-0 pt-2 pb-1">
      <div className={`flex h-12 items-center ${leftPadding ? "pl-14" : ""}`}>
        <div className="flex min-w-0 flex-1 items-center justify-start gap-1">
          <button
            type="button"
            onClick={handleMediaToggle}
            className={`${mediaToggleBase} ${ICON_SIZE} ${mediaType === "movie" ? filmStyles : diziStyles} ${showHint ? `animate-media-toggle-hint ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background ${mediaType === "movie" ? "ring-[#e67e22]/50" : "ring-emerald-500/50"}` : ""}`}
            style={showHint ? { "--hint-color": mediaType === "movie" ? "rgba(230, 126, 34, 0.35)" : "rgba(16, 185, 129, 0.35)" } as React.CSSProperties : undefined}
            aria-label={mediaType === "movie" ? "Dizilere geç (tıkla)" : "Filmlere geç (tıkla)"}
            title={mediaType === "movie" ? "Dizilere geç" : "Filmlere geç"}
          >
            {mediaType === "movie" ? (
              <Film className="size-5 text-[#e67e22]" />
            ) : (
              <Tv className="size-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
        </div>
        <div className="flex shrink-0 flex-col items-center">
          <Link
            href="/"
            className="outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Go to home"
          >
            <Logo className="shrink-0" mediaType={mediaType} />
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className={`${iconButtonClass} ${ICON_SIZE}`}
            aria-label={resolvedDark ? "Light theme" : "Dark theme"}
          >
            {resolvedDark ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>
        </div>
      </div>
      <ProBanner />
    </header>
  );
}
