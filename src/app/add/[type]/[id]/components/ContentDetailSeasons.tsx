"use client";

import { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { formatRuntime } from "@/lib/utils";
import type { TVSeason } from "../types";
import type { TMDBDetail } from "../types";

interface ContentDetailSeasonsProps {
  seasons: TVSeason[];
  detail: TMDBDetail;
  expandedSeasons: Set<number>;
  onExpandedSeasonsChange: (fn: (prev: Set<number>) => Set<number>) => void;
}

export function ContentDetailSeasons({
  seasons,
  detail,
  expandedSeasons,
  onExpandedSeasonsChange,
}: ContentDetailSeasonsProps) {
  const seasonRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const [num] = Array.from(expandedSeasons);
    if (num != null && seasonRefs.current[num]) {
      seasonRefs.current[num]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expandedSeasons]);

  if (detail.type !== "tv" || seasons.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-3">Bölümler</h3>
      <div className="space-y-2">
        {seasons.map((season) => {
          const isExpanded = expandedSeasons.has(season.seasonNumber);
          return (
            <div
              key={season.seasonNumber}
              ref={(el) => {
                seasonRefs.current[season.seasonNumber] = el;
              }}
              className="rounded-lg border border-border/50 overflow-hidden scroll-mt-14"
            >
              <button
                type="button"
                onClick={() =>
                  onExpandedSeasonsChange((prev) => {
                    if (prev.has(season.seasonNumber)) {
                      const next = new Set(prev);
                      next.delete(season.seasonNumber);
                      return next;
                    }
                    return new Set([season.seasonNumber]);
                  })
                }
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <span className="text-sm font-medium">{season.name}</span>
                <span className="text-xs text-muted-foreground">
                  {season.episodeCount} bölüm
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
              {isExpanded && (
                <div className="divide-y divide-border/50">
                  {season.episodes.map((ep) => {
                    const key = `S${season.seasonNumber}E${ep.episodeNumber}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-muted/20"
                      >
                        <span className="text-xs font-mono text-muted-foreground">
                          S{season.seasonNumber}E{ep.episodeNumber}
                        </span>
                        {ep.runtime != null && ep.runtime > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatRuntime(ep.runtime)}
                          </span>
                        )}
                        <span className="text-sm line-clamp-1">{ep.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
