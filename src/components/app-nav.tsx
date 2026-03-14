"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
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

  return (
    <>
      {/* Desktop: Top navbar below header */}
      <nav
        className="hidden md:flex items-center justify-end gap-1 border-b border-border bg-background/95 py-2 pr-2"
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
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback>
              <User className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          Profilim
        </Link>
      </nav>

      {/* Mobile: Bottom nav - edge to edge, no gaps */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobil navigasyon"
      >
        <div className="flex w-full border-t border-border/60 bg-white px-2 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-background dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
          <Link
            href="/"
            className={cn(
              "flex flex-1 items-center justify-center rounded-full py-3 text-xs font-semibold transition-all duration-200",
              isHome
                ? activeTheme
                : "text-muted-foreground hover:text-foreground/80 active:bg-muted/60",
            )}
            aria-label="Ana Sayfa"
          >
            <Home className="size-6 shrink-0" strokeWidth={2.5} />
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex flex-1 items-center justify-center rounded-full py-3 text-xs font-semibold transition-all duration-200",
              isSettings
                ? activeTheme
                : "text-muted-foreground hover:text-foreground/80 active:bg-muted/60",
            )}
            aria-label="Profilim"
          >
            <Avatar size="lg" className="shrink-0">
              <AvatarFallback>
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </nav>
    </>
  );
}
