"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, ArrowLeft, Loader2 } from "lucide-react";
import { useSearchTitlesQuery } from "@/api/titlesApi";
import { TitleCard } from "@/components/title-card";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";
import { TitleListRow } from "@/components/title-list-row";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const DEBOUNCE_MS = 300;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const mediaType = useSelector((state: RootState) => state.app.mediaType);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const { data: allTitles, isLoading, isFetching } = useSearchTitlesQuery(
    { q: debouncedQuery, limit: 30 },
    { skip: debouncedQuery.length < 2 }
  );

  const titles = allTitles?.filter((t) => t.type === mediaType) ?? [];

  const showResults = debouncedQuery.length >= 2;
  const hasResults = titles.length > 0;
  const noResults = showResults && !isLoading && !isFetching && titles.length === 0;

  return (
    <main className="pt-8 pb-16">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center rounded-full bg-muted p-2.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          aria-label="Ana sayfaya dön"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="relative min-w-0 flex-1">
          <SearchIcon
            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          {(isLoading || isFetching) && (
            <Loader2
              className="absolute right-3 top-1/2 size-5 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden
            />
          )}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mediaType === "movie" ? "Film ara..." : "Dizi ara..."}
            className={`w-full rounded-lg border border-input bg-background py-3 pl-10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${isLoading || isFetching ? "pr-10" : "pr-4"}`}
            autoFocus
            aria-label="Arama"
          />
        </div>
      </div>

      {!showResults && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          En az 2 karakter girin
        </p>
      )}

      {showResults && (isLoading || isFetching) && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Aranıyor...</h2>
          <div className="md:hidden space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg py-2">
                <div className="size-14 shrink-0 rounded-md bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-[repeat(auto-fill,minmax(140px,200px))] md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <TitleCardSkeleton key={i} size="grid" />
            ))}
          </div>
        </div>
      )}

      {noResults && (
        <p className="mt-8 text-center text-muted-foreground">
          &quot;{debouncedQuery}&quot; için sonuç bulunamadı
        </p>
      )}

      {showResults && hasResults && !isLoading && (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">{titles.length} sonuç</h2>
          <div className="md:hidden space-y-1">
            {titles.map((t) => (
              <Link
                key={t.id}
                href={`/${t.type === "movie" ? "movie" : "series"}/${t.id}`}
                className="block -mx-2 px-2"
              >
                <TitleListRow
                  poster={t.poster}
                  title={t.title}
                  year={t.year}
                  type={t.type}
                />
              </Link>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-[repeat(auto-fill,minmax(140px,200px))] md:gap-4">
            {titles.map((t) => (
              <Link
                key={t.id}
                href={`/${t.type === "movie" ? "movie" : "series"}/${t.id}`}
                className="block transition-opacity hover:opacity-90"
              >
                <TitleCard
                  poster={t.poster}
                  title={t.title}
                  year={t.year}
                  type={t.type}
                  size="grid"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export function getStaticProps() {
  return {
    props: {
      scrollHeader: {
        title: "Ara",
        backHref: "/",
        backAlwaysVisible: true,
        hideBackButton: true,
      },
    },
  };
}
