"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Loader2,
  Film,
  Tv,
  ChevronRight,
  Clapperboard,
  Heart,
  BookmarkCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { cachedFetch, CACHE_TTL } from "@/lib/api-cache";

import { useWatch } from "@/components/watch-provider";

interface SearchResult {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  director: string | null;
  type: string;
}

export default function AddPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const { items, isInWatchlist } = useWatch();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"movie" | "tv">(
    typeParam === "tv" ? "tv" : "movie"
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const { data, ok } = await cachedFetch<{ results: SearchResult[] }>(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`,
        CACHE_TTL.search
      );
      if (!ok) {
        setResults([]);
        return;
      }
      setResults(data?.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  // Yazarken arama (debounce)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const t = setTimeout(() => search(), 350);
    return () => clearTimeout(t);
  }, [query, type, search]);

  const handleVazgec = useCallback(() => {
    inputRef.current?.blur();
    setIsInputFocused(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }, []);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="space-y-6 mb-8">
          <div className="flex flex-col gap-4">
            {!isInputFocused && (
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant={type === "movie" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType("movie")}
                  className={
                    type === "movie" ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400" : ""
                  }
                >
                  <Film className="h-4 w-4" />
                  Film
                </Button>
                <Button
                  variant={type === "tv" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType("tv")}
                  className={
                    type === "tv" ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400" : ""
                  }
                >
                  <Tv className="h-4 w-4" />
                  Dizi
                </Button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onKeyDown={(e) => e.key === "Enter" && query.trim() && search()}
                  placeholder={
                    type === "movie"
                      ? "Film adı yaz..."
                      : "Dizi adı yaz..."
                  }
                  className="pl-9 pr-10 h-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : null}
                </div>
              </div>
              {isInputFocused && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVazgec}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  Vazgeç
                </Button>
              )}
            </div>
          </div>
        </div>
        {loading && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Aranıyor...</p>
          </div>
        ) : results.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
            {results.map((r) => {
              const saved = items.find(
                (s) => s.tmdbId === r.id && s.type === r.type
              );
              const isFavorite = saved?.isFavorite ?? false;
              return (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    href={`/add/${r.type}/${r.id}`}
                    className="group flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative h-14 w-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {r.posterPath ? (
                        <Image
                          src={r.posterPath}
                          alt={r.title}
                          width={40}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          {r.type === "movie" ? (
                            <Film className="h-6 w-6 text-muted-foreground/50" />
                          ) : (
                            <Tv className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                      )}
                      {(isFavorite || isInWatchlist(r.id, r.type)) && (
                        <div className="absolute top-0.5 left-0.5 flex gap-0.5">
                          {isFavorite && (
                            <Heart className="h-3 w-3 fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" />
                          )}
                          {isInWatchlist(r.id, r.type) && (
                            <BookmarkCheck className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate group-hover:text-primary transition-colors">
                        {r.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {[r.releaseYear, r.director].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty className="border-0 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {hasSearched ? (
                  <Search className="h-6 w-6" />
                ) : (
                  <Clapperboard className="h-6 w-6" />
                )}
              </EmptyMedia>
              <EmptyTitle>
                {hasSearched ? "Sonuç bulunamadı" : "Ne izlemek istersin?"}
              </EmptyTitle>
              <EmptyDescription>
                {hasSearched
                  ? "Başka bir anahtar kelime veya farklı bir tür deneyebilirsin."
                  : "Yukarıdaki arama kutusuna film veya dizi adı yazıp ara."}
              </EmptyDescription>
            </EmptyHeader>
            {hasSearched && (
              <EmptyContent>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setHasSearched(false);
                  }}
                >
                  Aramayı temizle
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </main>
    </div>
  );
}
