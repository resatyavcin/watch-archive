"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Film, Tv, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWatch } from "@/components/watch-provider";

type SearchResultItem = {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  director: string | null;
  type: string;
};

function PickContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") === "tv" ? "tv" : "movie") as "movie" | "tv";
  const position = Math.min(4, Math.max(1, Number(searchParams.get("position")) || 1));

  const { items } = useWatch();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const queryRef = useRef("");

  const [profileFavorites, setProfileFavorites] = useState<{ movies: number[]; tv: number[] }>({
    movies: [],
    tv: [],
  });

  useEffect(() => {
    fetch("/api/profile-favorites")
      .then((r) => r.ok ? r.json() : { movies: [], tv: [] })
      .then((data) => {
        const movies = (data.movies || [])
          .filter(Boolean)
          .map((m: { tmdbId: number }) => m.tmdbId);
        const tv = (data.tv || []).filter(Boolean).map((t: { tmdbId: number }) => t.tmdbId);
        setProfileFavorites({ movies, tv });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const queryAtStart = query;
    queryRef.current = query;
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(queryAtStart)}&type=${type}`
        );
        const data = await res.json();
        if (queryRef.current === queryAtStart && data.results) {
          setSearchResults(data.results);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query, type]);

  const currentIds = type === "movie" ? profileFavorites.movies : profileFavorites.tv;
  const watchedList = items.filter(
    (i) => i.type === type && !currentIds.includes(i.tmdbId)
  );

  const addToSlot = async (item: {
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseYear?: string;
  }) => {
    setAdding(true);
    try {
      const res = await fetch("/api/profile-favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          position,
          tmdbId: item.tmdbId,
          title: item.title,
          posterPath: item.posterPath ?? null,
          releaseYear: item.releaseYear ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push("/profile");
        return;
      }
      const message = data?.error ?? res.statusText ?? "Eklenemedi";
      toast.error("Hata", { description: message });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Bir hata oluştu";
      toast.error("Hata", { description: message });
    } finally {
      setAdding(false);
    }
  };

  const showSearch = query.trim().length > 0;
  const list = showSearch ? searchResults : watchedList;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
              <Link href="/profile" aria-label="Geri">
                <span className="text-lg font-medium">←</span>
              </Link>
            </Button>
            <h1 className="text-sm sm:text-base font-semibold truncate flex-1">
              {type === "movie" ? "Film seç" : "Dizi seç"}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              type === "movie" ? "Film adı yaz..." : "Dizi adı yaz..."
            }
            className="pl-9 pr-9 h-10"
            autoFocus
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {searchLoading && list.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {showSearch
              ? "Sonuç yok."
              : type === "movie"
                ? "İzlediğin film yok veya hepsi eklendi. Yukarıdan arama yap."
                : "İzlediğin dizi yok veya hepsi eklendi. Yukarıdan arama yap."}
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
            {list.map((item) => {
              const isWatched = "tmdbId" in item;
              const tmdbId = isWatched ? item.tmdbId : (item as SearchResultItem).id;
              const title = item.title;
              const posterPath = item.posterPath ?? null;
              const releaseYear = "releaseYear" in item ? item.releaseYear : (item as SearchResultItem).releaseYear;
              return (
                <li key={isWatched ? item.id : `${(item as SearchResultItem).type}-${tmdbId}`}>
                  <button
                    type="button"
                    disabled={adding}
                    onClick={() =>
                      addToSlot({
                        tmdbId,
                        title,
                        posterPath,
                        releaseYear,
                      })
                    }
                    className="group flex w-full items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    <div className="relative h-14 w-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {posterPath ? (
                        <Image
                          src={posterPath}
                          alt={title}
                          width={40}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          {type === "movie" ? (
                            <Film className="h-6 w-6 text-muted-foreground/50" />
                          ) : (
                            <Tv className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {showSearch && "director" in item
                          ? [releaseYear, (item as SearchResultItem).director]
                              .filter(Boolean)
                              .join(" · ")
                          : releaseYear ?? ""}
                      </p>
                    </div>
                    {adding ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

export default function PickPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <PickContent />
    </Suspense>
  );
}
