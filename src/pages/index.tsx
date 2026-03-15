"use client";

import { useSelector } from "react-redux";
import { useGetPopularTitlesQuery } from "@/api/titlesApi";
import { BrowseHome } from "@/components/browse-home";
import { ScrollRow } from "@/components/scroll-row";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";
import type { RootState } from "@/store";

function LoadingSkeleton({ mediaType }: { mediaType: "movie" | "tv" }) {
  const title = mediaType === "movie" ? "Popüler Filmler" : "Popüler Diziler";
  return (
    <main className="pt-4 pb-16">
      <ScrollRow title={<h2 className="text-lg font-semibold">{title}</h2>}>
        {Array.from({ length: 8 }).map((_, i) => (
          <TitleCardSkeleton key={i} size="lg" />
        ))}
      </ScrollRow>
    </main>
  );
}

export default function Home() {
  const mediaType = useSelector((state: RootState) => state.app.mediaType);
  const { isLoading: browseLoading } = useGetPopularTitlesQuery(mediaType);

  if (browseLoading) {
    return <LoadingSkeleton mediaType={mediaType} />;
  }

  return <BrowseHome />;
}
