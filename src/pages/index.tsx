"use client";

import { useEffect, useState } from "react";
import { MediaTypeToggle } from "@/components/media-type-toggle";
import { ScrollRow } from "@/components/scroll-row";
import { TitleCard } from "@/components/title-card";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";

const FILMS = [
  { id: 1, poster: "https://picsum.photos/seed/f1/200/300", title: "Dune: Part Two", year: 2024, rating: 5 },
  { id: 2, poster: "https://picsum.photos/seed/f2/200/300", title: "Oppenheimer", year: 2023, rating: 4 },
  { id: 3, poster: "https://picsum.photos/seed/f3/200/300", title: "Poor Things", year: 2023, rating: 3 },
  { id: 4, poster: "https://picsum.photos/seed/f4/200/300", title: "The Batman", year: 2022 },
  { id: 5, poster: "https://picsum.photos/seed/f5/200/300", title: "Everything Everywhere", year: 2022, rating: 5 },
  { id: 6, poster: "https://picsum.photos/seed/f6/200/300", title: "Past Lives", year: 2023, rating: 4 },
  { id: 7, poster: "https://picsum.photos/seed/f7/200/300", title: "Killers of the Flower Moon", year: 2023 },
  { id: 8, poster: "https://picsum.photos/seed/f8/200/300", title: "The Holdovers", year: 2023, rating: 2 },
  { id: 9, poster: "https://picsum.photos/seed/f9/200/300", title: "Barbie", year: 2023, rating: 4 },
  { id: 10, poster: "https://picsum.photos/seed/f10/200/300", title: "Spider-Man: Across the Spider-Verse", year: 2023, rating: 5 },
  { id: 11, poster: "https://picsum.photos/seed/f11/200/300", title: "Top Gun: Maverick", year: 2022 },
  { id: 12, poster: "https://picsum.photos/seed/f12/200/300", title: "The Banshees of Inisherin", year: 2022, rating: 3 },
  { id: 13, poster: "https://picsum.photos/seed/f13/200/300", title: "Nope", year: 2022 },
  { id: 14, poster: "https://picsum.photos/seed/f14/200/300", title: "Dune", year: 2021, rating: 4 },
  { id: 15, poster: "https://picsum.photos/seed/f15/200/300", title: "Nomadland", year: 2020 },
];

const SERIES = [
  { id: 101, poster: "https://picsum.photos/seed/s1/200/300", title: "The Last of Us", year: 2023, rating: 5 },
  { id: 102, poster: "https://picsum.photos/seed/s2/200/300", title: "Succession", year: 2023, rating: 5 },
  { id: 103, poster: "https://picsum.photos/seed/s3/200/300", title: "The Bear", year: 2023, rating: 4 },
  { id: 104, poster: "https://picsum.photos/seed/s4/200/300", title: "Squid Game", year: 2021, rating: 5 },
  { id: 105, poster: "https://picsum.photos/seed/s5/200/300", title: "Severance", year: 2022, rating: 4 },
  { id: 106, poster: "https://picsum.photos/seed/s6/200/300", title: "White Lotus", year: 2022, rating: 4 },
  { id: 107, poster: "https://picsum.photos/seed/s7/200/300", title: "House of the Dragon", year: 2022 },
  { id: 108, poster: "https://picsum.photos/seed/s8/200/300", title: "Wednesday", year: 2022, rating: 3 },
];

const SKELETON_COUNT = 10;

async function fetchTitles(type: "movie" | "tv") {
  await new Promise((r) => setTimeout(r, 1200));
  return type === "movie" ? FILMS : SERIES;
}

export default function Home() {
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchTitles(type).then(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [type]);

  const handleTypeChange = (newType: "movie" | "tv") => {
    if (newType === type) return;
    setType(newType);
  };

  return (
    <main className="py-8">
      <MediaTypeToggle
        value={type}
        onChange={handleTypeChange}
        isLoading={isLoading}
        className="mb-4"
      />

      <ScrollRow
        title={
          <h1 className="text-base font-bold text-foreground">
            Popüler this week
          </h1>
        }
      >
        {isLoading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <TitleCardSkeleton key={i} />
          ))
        ) : (
          (type === "movie" ? FILMS : SERIES).map((item) => (
            <TitleCard
              key={item.id}
              poster={item.poster}
              title={item.title}
              year={item.year}
              type={type}
            />
          ))
        )}
      </ScrollRow>
    </main>
  );
}
