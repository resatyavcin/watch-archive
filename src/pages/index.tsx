"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useGetPopularTitlesQuery } from "@/api/titlesApi";
import { AdSlot } from "@/components/ad-slot";
import { ProBanner } from "@/components/pro-banner";
import { ScrollRow } from "@/components/scroll-row";
import { TitleCard } from "@/components/title-card";
import { TitleCardSkeleton } from "@/components/title-card-skeleton";
import type { RootState } from "@/store";

const AD_SLOT_INDEX = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INDEX ?? "";

const SKELETON_COUNT = 10;

export default function Home() {
  const type = useSelector((state: RootState) => state.app.mediaType);
  const { data: titles = [], isLoading } = useGetPopularTitlesQuery(type);
  const pathType = type === "tv" ? "series" : "movie";

  return (
    <main className="py-8">
      <div className="space-y-4">
        <ProBanner />
        {AD_SLOT_INDEX && (
          <AdSlot slot={AD_SLOT_INDEX} className="min-h-[90px] sm:min-h-[120px]" />
        )}
        <ScrollRow
        title={
          <h1 className="text-base font-bold text-foreground">
            Popular this week
          </h1>
        }
      >
        {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <TitleCardSkeleton key={i} size="lg" />
            ))
          : titles.map((item) => (
              <Link
                key={item.id}
                href={`/${pathType}/${item.id}`}
                className="block"
              >
                <TitleCard
                  poster={item.poster}
                  title={item.title}
                  year={item.year}
                  type={type}
                  size="lg"
                />
              </Link>
            ))}
      </ScrollRow>
      </div>
    </main>
  );
}
