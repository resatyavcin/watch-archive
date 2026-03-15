import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  PopularBrowseResponse,
  SearchResponse,
  Title,
  TitleDetail,
} from "@/types/title";

function toTitle(
  item: PopularBrowseResponse["popular"][number],
  type: "movie" | "tv"
): Title {
  const year = item.releaseDate
    ? parseInt(item.releaseDate.slice(0, 4), 10)
    : 0;
  const rating =
    item.voteAverage > 0 ? Math.round(item.voteAverage / 2) : undefined;
  return {
    id: item.tmdbId,
    poster: item.posterPath,
    title: item.title,
    year,
    type,
    rating,
  };
}

export const titlesApi = createApi({
  reducerPath: "titlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPopularTitles: builder.query<Title[], "movie" | "tv">({
      query: (type) =>
        `/api/browse/popular?type=${type === "tv" ? "SERIES" : "MOVIE"}`,
      transformResponse: (response: PopularBrowseResponse, _meta, type) =>
        response.popular.map((item) => toTitle(item, type)),
    }),
    getPopularBrowse: builder.query<PopularBrowseResponse, "movie" | "tv">({
      query: (type) =>
        `/api/browse/popular?type=${type === "tv" ? "SERIES" : "MOVIE"}`,
    }),
    getTitleByTmdb: builder.query<
      TitleDetail,
      { tmdbId: string; type: "MOVIE" | "SERIES" }
    >({
      query: ({ tmdbId, type }) =>
        `/api/titles/by-tmdb/${tmdbId}?type=${type}`,
    }),
    searchTitles: builder.query<
      Title[],
      { q: string; limit?: number }
    >({
      query: ({ q, limit = 15 }) => {
        const params = new URLSearchParams({ q });
        if (limit > 0) params.set("limit", String(limit));
        return `/api/search?${params.toString()}`;
      },
      transformResponse: (response: SearchResponse): Title[] => {
        const items = response.results ?? response.items ?? [];
        return items.map((item) => ({
          id: item.tmdbId,
          poster: item.posterUrl ?? item.posterPath ?? null,
          title: item.title,
          year: item.releaseDate
            ? parseInt(item.releaseDate.slice(0, 4), 10)
            : 0,
          type: item.contentType === "MOVIE" ? "movie" : "tv",
          rating:
            item.voteAverage && item.voteAverage > 0
              ? Math.round(item.voteAverage / 2)
              : undefined,
        }));
      },
    }),
  }),
});

export const {
  useGetPopularTitlesQuery,
  useGetPopularBrowseQuery,
  useGetTitleByTmdbQuery,
  useSearchTitlesQuery,
} = titlesApi;
