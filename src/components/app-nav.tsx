"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";

const navLinkDesktopClass =
  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AppNav() {
  const pathname = usePathname();
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const isHome = pathname === "/";
  const isSettings = pathname === "/settings";

  const activeTheme =
    mediaType === "movie"
      ? "text-[#e67e22] [&_svg]:text-[#e67e22]"
      : "text-emerald-600 [&_svg]:text-emerald-600 dark:text-emerald-400 dark:[&_svg]:text-emerald-400";

  const activeBg =
    mediaType === "movie"
      ? "bg-background shadow-md shadow-black/5 dark:shadow-black/20"
      : "bg-background shadow-md shadow-black/5 dark:shadow-black/20";

  return (
    <>
      {/* Desktop: Top navbar below header */}
      <nav
        className="hidden md:flex items-center justify-start gap-1 border-b border-border bg-background/95 py-2 pl-2"
        aria-label="Ana navigasyon"
      >
        <Link
          href="/"
          className={cn(
            navLinkDesktopClass,
            isHome
              ? activeTheme
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Home className="size-4 shrink-0" />
          Ana Sayfa
        </Link>
        <Link
          href="/settings"
          className={cn(
            navLinkDesktopClass,
            isSettings
              ? activeTheme
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Avatar size="sm" className="size-5 shrink-0">
            <AvatarFallback>
              <Settings className="size-2.5" />
            </AvatarFallback>
          </Avatar>
          Ayarlar
        </Link>
      </nav>

      {/* Mobile: Segmented control style bottom nav */}
      <nav
        className="fixed bottom-5 left-4 right-4 z-50 md:hidden"
        aria-label="Mobil navigasyon"
      >
        <div className="flex w-full rounded-full border border-border/60 bg-muted/40 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-muted/20 dark:shadow-black/30">
          <Link
            href="/"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition-all duration-200",
              isHome
                ? cn(activeTheme, activeBg)
                : "text-muted-foreground hover:text-foreground/80 active:bg-muted/60",
            )}
          >
            <Home className="size-4 shrink-0" strokeWidth={2.5} />
            <span>Ana Sayfa</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold transition-all duration-200",
              isSettings
                ? cn(activeTheme, activeBg)
                : "text-muted-foreground hover:text-foreground/80 active:bg-muted/60",
            )}
          >
            <Settings className="size-4 shrink-0" strokeWidth={2.5} />
            <span>Ayarlar</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
