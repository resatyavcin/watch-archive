"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  User,
  Settings,
  Film,
  Tv,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const FAVORITE_LIMIT = 4;

export type ProfileFavoriteItem = {
  type: "movie" | "tv";
  position: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseYear: string | null;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<(ProfileFavoriteItem | null)[]>(
    () => [null, null, null, null]
  );
  const [tv, setTv] = useState<(ProfileFavoriteItem | null)[]>(
    () => [null, null, null, null]
  );
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<"movie" | "tv" | null>(null);
  const [editMovies, setEditMovies] = useState<(ProfileFavoriteItem | null)[]>(() => [null, null, null, null]);
  const [editTv, setEditTv] = useState<(ProfileFavoriteItem | null)[]>(() => [null, null, null, null]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch("/api/profile-favorites");
      if (!res.ok) return;
      const data = await res.json();
      const fill = (arr: (ProfileFavoriteItem | null)[]) => {
        const out = [null, null, null, null] as (ProfileFavoriteItem | null)[];
        (arr || []).forEach((item, i) => {
          if (item && item.position >= 1 && item.position <= 4)
            out[item.position - 1] = item;
        });
        return out;
      };
      setMovies(fill(data.movies || []));
      setTv(fill(data.tv || []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) fetchFavorites();
  }, [session?.user, fetchFavorites]);

  const clearSlot = async (type: "movie" | "tv", position: number) => {
    const res = await fetch(
      `/api/profile-favorites?type=${type}&position=${position}`,
      { method: "DELETE" }
    );
    if (!res.ok) return;
    fetchFavorites();
  };

  const startEditing = (section: "movie" | "tv") => {
    setEditingSection(section);
    setEditMovies([...movies]);
    setEditTv([...tv]);
  };

  const editList = editingSection === "movie" ? editMovies : editTv;
  const setEditList = editingSection === "movie" ? setEditMovies : setEditTv;
  const editType = editingSection ?? "movie";

  const moveEditItem = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex > 3) return;
    setEditList((prev) => {
      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
  };

  const removeEditItem = (index: number) => {
    setEditList((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const saveEdit = async () => {
    if (!editingSection) return;
    const list = editingSection === "movie" ? editMovies : editTv;
    for (let pos = 1; pos <= 4; pos++) {
      const item = list[pos - 1];
      if (item) {
        await fetch("/api/profile-favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: editingSection,
            position: pos,
            tmdbId: item.tmdbId,
            title: item.title,
            posterPath: item.posterPath,
            releaseYear: item.releaseYear,
          }),
        });
      } else {
        await fetch(
          `/api/profile-favorites?type=${editingSection}&position=${pos}`,
          { method: "DELETE" }
        );
      }
    }
    setEditingSection(null);
    fetchFavorites();
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                <Link href="/" aria-label="Geri">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">
                Profilim
              </h1>
            </div>
            <Button variant="ghost" size="icon" asChild className="flex-shrink-0" aria-label="Ayarlar">
              <Link href="/settings">
                <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-xl">
        {status === "loading" ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded mt-4 animate-pulse" />
            <div className="h-3 w-48 bg-muted rounded mt-2 animate-pulse" />
          </div>
        ) : session?.user ? (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Profil"}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h2 className="text-base font-semibold truncate">
                {session.user.name ?? "Kullanıcı"}
              </h2>
            </div>
          </div>
        ) : null}

        {session?.user && (
          <div className="mt-6 space-y-6">
            <section>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <h2 className="text-sm font-semibold">Film vitrinim</h2>
                </div>
                {movies.some(Boolean) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing("movie")}
                    className="text-muted-foreground hover:text-foreground gap-1 h-8"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </Button>
                )}
              </div>
              {editingSection === "movie" ? (
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <ul className="divide-y divide-border">
                    {editMovies.map((item, i) => (
                      <li key={item ? `movie-${i}-${item.tmdbId}` : `movie-empty-${i}`} className="flex items-center gap-2 p-2">
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveEditItem(i, "up")} disabled={i === 0} aria-label="Yukarı">
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveEditItem(i, "down")} disabled={i === 3} aria-label="Aşağı">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        {item ? (
                          <>
                            <div className="relative h-12 w-8 shrink-0 rounded overflow-hidden bg-muted">
                              {item.posterPath ? (
                                <Image src={item.posterPath} alt={item.title} width={32} height={48} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Film className="h-4 w-4 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium truncate flex-1 min-w-0">{item.title}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeEditItem(i)} aria-label="Kaldır">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Link
                            href={`/profile/favorites/pick?type=movie&position=${i + 1}`}
                            className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-2 px-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm"
                          >
                            <Plus className="h-4 w-4 shrink-0" />
                            Ekle
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-border flex justify-end">
                    <Button size="sm" onClick={saveEdit}>
                      Bitti
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
                      ))
                    : movies.map((item, i) =>
                        item ? (
                          <Link key={`movie-${i}`} href={`/add/movie/${item.tmdbId}`} className="block">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted border border-border">
                              {item.posterPath ? (
                                <Image src={item.posterPath} alt={item.title} width={80} height={120} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Film className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] font-medium truncate mt-0.5">{item.title}</p>
                          </Link>
                        ) : (
                          <Link
                            key={`movie-empty-${i}`}
                            href={`/profile/favorites/pick?type=movie&position=${i + 1}`}
                            className="flex aspect-[2/3] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                          >
                            <Plus className="h-6 w-6" />
                          </Link>
                        )
                      )}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <h2 className="text-sm font-semibold">Dizi vitrinim</h2>
                </div>
                {tv.some(Boolean) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing("tv")}
                    className="text-muted-foreground hover:text-foreground gap-1 h-8"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </Button>
                )}
              </div>
              {editingSection === "tv" ? (
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <ul className="divide-y divide-border">
                    {editTv.map((item, i) => (
                      <li key={item ? `tv-${i}-${item.tmdbId}` : `tv-empty-${i}`} className="flex items-center gap-2 p-2">
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveEditItem(i, "up")} disabled={i === 0} aria-label="Yukarı">
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveEditItem(i, "down")} disabled={i === 3} aria-label="Aşağı">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        {item ? (
                          <>
                            <div className="relative h-12 w-8 shrink-0 rounded overflow-hidden bg-muted">
                              {item.posterPath ? (
                                <Image src={item.posterPath} alt={item.title} width={32} height={48} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Tv className="h-4 w-4 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium truncate flex-1 min-w-0">{item.title}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeEditItem(i)} aria-label="Kaldır">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Link
                            href={`/profile/favorites/pick?type=tv&position=${i + 1}`}
                            className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-2 px-3 text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm"
                          >
                            <Plus className="h-4 w-4 shrink-0" />
                            Ekle
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-border flex justify-end">
                    <Button size="sm" onClick={saveEdit}>
                      Bitti
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
                      ))
                    : tv.map((item, i) =>
                        item ? (
                          <Link key={`tv-${i}`} href={`/add/tv/${item.tmdbId}`} className="block">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted border border-border">
                              {item.posterPath ? (
                                <Image src={item.posterPath} alt={item.title} width={80} height={120} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Tv className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] font-medium truncate mt-0.5">{item.title}</p>
                          </Link>
                        ) : (
                          <Link
                            key={`tv-empty-${i}`}
                            href={`/profile/favorites/pick?type=tv&position=${i + 1}`}
                            className="flex aspect-[2/3] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                          >
                            <Plus className="h-6 w-6" />
                          </Link>
                        )
                      )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
