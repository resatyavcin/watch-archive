"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Film, Tv, Star, ArrowLeft } from "lucide-react";
import { useGetTitleByTmdbQuery } from "@/api/titlesApi";
import { AdSlot } from "@/components/ad-slot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AD_SLOT_DETAIL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DETAIL ?? "";

const iconButtonClass =
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/90 text-muted-foreground transition-colors hover:bg-white hover:text-foreground dark:bg-white/20 dark:text-foreground dark:hover:bg-white/30 dark:hover:text-foreground size-10";

/** TMDB backdrop için daha yüksek çözünürlük (w300/w500/w780 → w1280) */
function upgradeBackdropUrl(url: string): string {
  return url.replace(/\/t\/p\/w\d+\//, "/t/p/w1280/");
}

const starFilled = {
  movie: "fill-[#e67e22] text-[#e67e22]",
  tv: "fill-emerald-500 text-emerald-500 dark:fill-emerald-400 dark:text-emerald-400",
} as const;

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}s ${m}dk`;
  if (h > 0) return `${h}s`;
  return `${m}dk`;
}

function OverviewSection({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showExpand, setShowExpand] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;

  useLayoutEffect(() => {
    const checkOverflow = () => {
      const el = ref.current;
      if (!el) return;
      const overflow = el.scrollHeight > el.clientHeight;
      setShowExpand(expandedRef.current || overflow);
    };

    checkOverflow();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expanded]);

  const handleToggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (willExpand) {
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  return (
    <div ref={containerRef} className="mt-6 mb-8 w-full scroll-mt-20">
      <div className="relative">
        <p
          ref={ref}
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            !expanded && "overflow-hidden"
          )}
          style={
            !expanded
              ? { maxHeight: "4.5rem" }
              : undefined
          }
        >
          {text}
        </p>
        {!expanded && showExpand && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent"
            aria-hidden
          />
        )}
      </div>
      {(showExpand || expanded) && (
        <button
          type="button"
          onClick={handleToggle}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Daha az" : "Devamını oku"}
        </button>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="-mx-4 -mt-8 h-48 bg-muted sm:-mx-6 sm:-mt-8 md:-mx-8 md:-mt-8 lg:h-64" />
      <div className="mt-4 flex gap-4">
        <div className="h-40 w-28 shrink-0 rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function TitleDetailPage() {
  const router = useRouter();
  const { type, tmdbId } = router.query;

  const pageType = typeof type === "string" ? type : "";
  const pageTmdbId = typeof tmdbId === "string" ? tmdbId : "";

  const isValidType = pageType === "movie" || pageType === "series";
  const apiType = pageType === "movie" ? "MOVIE" : "SERIES";

  const { data, isLoading, isError, error } = useGetTitleByTmdbQuery(
    { tmdbId: pageTmdbId, type: apiType },
    { skip: !pageTmdbId || !isValidType }
  );

  const [scrollOpacity, setScrollOpacity] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const opacity = Math.min(1, Math.max(0, (y - 60) / 80));
      setScrollOpacity(opacity);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!router.isReady) {
    return (
      <main className="py-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (!isValidType) {
    return (
      <main className="py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Geçersiz sayfa</p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="py-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            {isError && "error" in error
              ? String((error as { error?: string }).error ?? "Yüklenemedi")
              : "İçerik bulunamadı"}
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const isMovie = data.contentType === "MOVIE";
  const typeKey = isMovie ? "movie" : "tv";
  const year = data.releaseDate
    ? parseInt(data.releaseDate.slice(0, 4), 10)
    : null;

  return (
    <main className="pt-8 pb-16">
      {/* Back button: always visible, no scroll needed */}
      <Link
        href="/"
        className={`fixed left-4 top-2 z-50 ${iconButtonClass}`}
        aria-label="Ana Sayfaya Dön"
      >
        <ArrowLeft className="size-5" />
      </Link>

      {/* Header with title: only appears on scroll */}
      <header
        className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-center px-4 transition-opacity duration-200 md:h-12"
        style={{ opacity: scrollOpacity }}
        aria-hidden={scrollOpacity < 0.5}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        <h1 className="relative z-10 max-w-[70%] truncate text-center text-base font-semibold text-foreground sm:text-lg">
          {data.name}
        </h1>
      </header>

      {/* Hero with backdrop */}
      <div className="-mx-4 -mt-8 relative h-48 overflow-hidden sm:-mx-6 sm:-mt-8 md:-mx-8 md:-mt-8 lg:h-64">
        {data.backdropUrl ? (
          <Image
            src={upgradeBackdropUrl(data.backdropUrl)}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div
          className="absolute inset-0 bg-linear-to-t from-background via-black/10 to-transparent dark:via-black/30"
          aria-hidden
        />
      </div>

      {/* Content - overlaps hero, higher z-index, pt for scroll header */}
      <div className="relative z-10 -mt-24 flex flex-row gap-4 pt-14 sm:-mt-28 sm:gap-6 md:pt-12 lg:-mt-32">
        {/* Poster */}
        <div className="shrink-0">
          <div className="relative aspect-2/3 w-28 overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-600 bg-muted sm:w-36">
            {data.posterUrl ? (
              <Image
                src={data.posterUrl}
                alt={data.name}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {isMovie ? (
                  <Film className="h-12 w-12 text-muted-foreground/50" />
                ) : (
                  <Tv className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            {data.name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {year && <span>{year}</span>}
            {data.voteAverage > 0 && (
              <span className="flex items-center gap-1">
                <Star
                  className={`size-4 ${starFilled[typeKey]}`}
                  aria-hidden
                />
                {data.voteAverage.toFixed(1)}
                {data.voteCount > 0 && (
                  <span className="text-muted-foreground/80">
                    ({data.voteCount})
                  </span>
                )}
              </span>
            )}
            {isMovie && data.runtime != null && data.runtime > 0 && (
              <span>{formatRuntime(data.runtime)}</span>
            )}
            {!isMovie &&
              data.numberOfSeasons != null &&
              data.numberOfEpisodes != null && (
                <span>
                  {data.numberOfSeasons} sezon, {data.numberOfEpisodes} bölüm
                </span>
              )}
          </div>

          {/* Genres */}
          {data.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.genres.map((genre) => (
                <span
                  key={genre}
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-medium",
                    isMovie
                      ? "border border-[#e67e22]/30 bg-[#e67e22]/10 text-[#c0392b] dark:border-[#e67e22]/40 dark:bg-[#e67e22]/15 dark:text-[#e67e22]"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-400"
                  )}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview - full width, line-clamp with expand */}
      {data.overview && (
        <OverviewSection text={data.overview} />
      )}

      {AD_SLOT_DETAIL && (
        <AdSlot slot={AD_SLOT_DETAIL} className="mt-8 min-h-[90px] sm:min-h-[120px]" />
      )}
    </main>
  );
}
