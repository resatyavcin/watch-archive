"use client";

import { useSelector } from "react-redux";
import { useGetPopularTitlesQuery } from "@/api/titlesApi";
import { ScrollRow } from "@/components/scroll-row";
import { TitleCard } from "@/components/title-card";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";
import type { RootState } from "@/store";

const SKELETON_COUNT = 10;

export default function Home() {
  const type = useSelector((state: RootState) => state.app.mediaType);
  const { data: titles = [], isLoading } = useGetPopularTitlesQuery(type);

  return (
    <main className="py-8">
      <ScrollRow
        title={
          <h1 className="text-base font-bold text-foreground">
            Popular this week
          </h1>
        }
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TitleCardSkeleton key={i} />
            ))
          : titles.map((item) => (
              <TitleCard
                key={item.id}
                poster={item.poster}
                title={item.title}
                year={item.year}
                type={type}
              />
            ))}
      </ScrollRow>
    </main>
  );
}
