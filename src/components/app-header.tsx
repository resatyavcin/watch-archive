"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Film, Moon, Sun, Tv } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "@/components/ui/logo";
import { setMediaType, setTheme, store } from "@/store";
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
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:text-muted-foreground dark:hover:bg-white/10 dark:hover:text-foreground";

const filmColor = "text-[#e67e22]";
const filmBg = "bg-[#e67e22]/15";
const diziColor = "text-emerald-600 dark:text-emerald-400";
const diziBg = "bg-emerald-500/15 dark:bg-emerald-400/15";

export function AppHeader() {
  const dispatch = useDispatch();
  const resolvedDark = useResolvedDark();
  const mediaType = useSelector((state: RootState) => state.app.mediaType);

  const toggleTheme = () => {
    dispatch(setTheme(resolvedDark ? "light" : "dark"));
  };

  return (
    <header className="flex w-full shrink-0 flex-col gap-1 pt-2 pb-1">
      <div className="flex h-12 items-center">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-1">
          <button
            type="button"
            onClick={() => {
              const current = store.getState().app.mediaType;
              dispatch(setMediaType(current === "movie" ? "tv" : "movie"));
            }}
            className={`${iconButtonClass} ${ICON_SIZE} ${mediaType === "movie" ? `${filmBg} ${filmColor}` : `${diziBg} ${diziColor}`}`}
            aria-label={mediaType === "movie" ? "Switch to TV" : "Switch to Movies"}
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
    </header>
  );
}
