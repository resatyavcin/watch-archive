import type { TitleDetail } from "@/types/title";

export type FetchTitleParams = {
  tmdbId: string;
  type: "MOVIE" | "SERIES";
};

/**
 * Sunucu tarafında (getServerSideProps vb.) title verisi çeker.
 * API_URL env değişkeni gerekir.
 */
export async function fetchTitleByTmdb(
  params: FetchTitleParams
): Promise<TitleDetail | null> {
  const { tmdbId, type } = params;
  const apiBase = process.env.API_URL;

  if (!apiBase || !tmdbId || (type !== "MOVIE" && type !== "SERIES")) {
    return null;
  }

  try {
    const res = await fetch(
      `${apiBase}/api/v0/titles/by-tmdb/${tmdbId}?type=${type}`
    );
    const data = await res.json();
    if (!res.ok || !data?.name) return null;
    return data as TitleDetail;
  } catch {
    return null;
  }
}
