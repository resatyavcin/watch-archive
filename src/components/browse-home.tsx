"use client";

import Link from "next/link";
import { useGetPopularTitlesQuery } from "@/api/titlesApi";
import { ScrollRow } from "@/components/scroll-row";
import { TitleCard } from "@/components/title-card";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function BrowseHome() {
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const { data: titles, isLoading } = useGetPopularTitlesQuery(mediaType);

  if (isLoading) {
    return (
      <main className="pt-4 pb-16">
        <ScrollRow title={<h2 className="text-lg font-semibold">Yükleniyor...</h2>}>
          {Array.from({ length: 8 }).map((_, i) => (
            <TitleCardSkeleton key={i} size="default" />
          ))}
        </ScrollRow>
      </main>
    );
  }

  if (!titles?.length) {
    return (
      <main className="flex flex-1 items-center justify-center py-16">
        <p className="text-muted-foreground">İçerik bulunamadı.</p>
      </main>
    );
  }

  const typePath = mediaType === "movie" ? "movie" : "series";

  return (
    <main className="pt-4 pb-16">
      <ScrollRow
        title={
          <h2 className="text-lg font-semibold">
            {mediaType === "movie" ? "Popüler Filmler" : "Popüler Diziler"}
          </h2>
        }
      >
        {titles.map((t) => (
          <Link
            key={t.id}
            href={`/${typePath}/${t.id}`}
            className="block transition-opacity hover:opacity-90"
          >
            <TitleCard
              poster={t.poster}
              title={t.title}
              year={t.year}
              type={t.type}
              size="lg"
            />
          </Link>
        ))}
      </ScrollRow>
    </main>
  );
}
