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
      ? "bg-[#e67e22]/15"
      : "bg-emerald-500/15 dark:bg-emerald-400/15";

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
            isHome ? activeTheme : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="size-4 shrink-0" />
          Ana Sayfa
        </Link>
        <Link
          href="/settings"
          className={cn(
            navLinkDesktopClass,
            isSettings ? activeTheme : "text-muted-foreground hover:text-foreground"
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

      {/* Mobile: Bottom nav */}
      <nav
        className="fixed bottom-4 left-4 right-4 z-50 flex md:hidden items-center justify-center gap-1 rounded-xl border border-border/80 bg-background/80 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:shadow-black/20"
        aria-label="Mobil navigasyon"
      >
        <Link
          href="/"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 text-[11px] font-medium transition-all duration-200",
            isHome
              ? cn(activeTheme, activeBg)
              : "text-muted-foreground active:bg-muted/50"
          )}
        >
          <Home className="size-4 shrink-0" strokeWidth={2} />
          <span>Ana Sayfa</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 text-[11px] font-medium transition-all duration-200",
            isSettings
              ? cn(activeTheme, activeBg)
              : "text-muted-foreground active:bg-muted/50"
          )}
        >
          <Settings className="size-4 shrink-0" strokeWidth={2} />
          <span>Ayarlar</span>
        </Link>
      </nav>
    </>
  );
}
