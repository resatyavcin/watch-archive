"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const backButtonClass =
  "fixed left-4 top-2 z-50 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 text-muted-foreground transition-colors hover:bg-white hover:text-foreground dark:bg-white/20 dark:text-foreground dark:hover:bg-white/30 dark:hover:text-foreground size-10";

export interface ScrollHeaderProps {
  title: string;
  backHref?: string;
  /** When true, back button is always visible (e.g. detail page) */
  backAlwaysVisible?: boolean;
}

export function ScrollHeader({
  title,
  backHref = "/",
  backAlwaysVisible = false,
}: ScrollHeaderProps) {
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0;

    const onScroll = () => {
      const y = getScrollY();
      const opacity = Math.min(1, Math.max(0, (y - 20) / 50));
      setScrollOpacity(opacity);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrollOpacity >= 0.5;
  const backVisible = backAlwaysVisible || visible;

  return (
    <>
      {/* Back button - appears on scroll, or always when backAlwaysVisible */}
      <Link
        href={backHref}
        className={backButtonClass}
        aria-label="Ana sayfaya dön"
        style={{
          opacity: backAlwaysVisible ? 1 : scrollOpacity,
          pointerEvents: backVisible ? "auto" : "none",
        }}
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* Header bar - appears on scroll */}
      <header
        className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center gap-2 px-4 transition-opacity duration-200 md:h-12"
        style={{
          opacity: scrollOpacity,
          pointerEvents: visible ? "auto" : "none",
        }}
        aria-hidden={!visible}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        <div className="w-10 shrink-0" aria-hidden />
        <h1 className="relative z-10 min-w-0 flex-1 truncate text-center text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h1>
        <div className="w-10 shrink-0" aria-hidden />
      </header>
    </>
  );
}
