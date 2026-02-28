import { useEffect, useState } from "react";
import type { WatchedItem } from "@/types/watch";
import type { TMDBDetail } from "../types";

export function useContentForm(
  detail: TMDBDetail | null,
  items: WatchedItem[] | undefined,
  tmdbId: string,
) {
  const [watchedAt, setWatchedAt] = useState<Date>(() => new Date());
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchedProgressMinutes, setWatchedProgressMinutes] = useState<number | "">("");
  const [watchedProgressSeconds, setWatchedProgressSeconds] = useState<number | "">("");
  const [asDropped, setAsDropped] = useState(false);
  const [existingItem, setExistingItem] = useState<WatchedItem | null>(null);

  useEffect(() => {
    if (!detail || !items) return;
    const existing = items.find((i) => i.tmdbId === Number(tmdbId) && i.type === detail.type);
    if (existing) {
      setExistingItem(existing);
      setWatchedAt(new Date(existing.watchedAt));
      setNotes(existing.notes ?? "");
      setRating(
        existing.rating != null && existing.rating > 5
          ? Math.round(existing.rating / 2)
          : existing.rating ?? undefined,
      );
      setIsFavorite(existing.isFavorite ?? false);
      const ps = existing.watchedProgressSeconds ?? 0;
      setWatchedProgressMinutes(ps > 0 ? Math.floor(ps / 60) : "");
      setWatchedProgressSeconds(ps > 0 ? ps % 60 : "");
      setAsDropped(existing.watchingStatus === "dropped");
    } else {
      setExistingItem(null);
      setWatchedProgressMinutes("");
      setWatchedProgressSeconds("");
      setAsDropped(false);
    }
  }, [detail, tmdbId, items]);

  const resetForm = () => {
    setNotes("");
    setRating(undefined);
    setIsFavorite(false);
    setWatchedProgressMinutes("");
    setWatchedProgressSeconds("");
    setAsDropped(false);
    setExistingItem(null);
    setWatchedAt(new Date());
  };

  return {
    watchedAt,
    setWatchedAt,
    notes,
    setNotes,
    rating,
    setRating,
    isFavorite,
    setIsFavorite,
    watchedProgressMinutes,
    setWatchedProgressMinutes,
    watchedProgressSeconds,
    setWatchedProgressSeconds,
    asDropped,
    setAsDropped,
    existingItem,
    setExistingItem,
    resetForm,
  };
}
