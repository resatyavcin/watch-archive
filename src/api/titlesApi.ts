import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PopularBrowseResponse, Title } from "@/types/title";

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
  }),
});

export const { useGetPopularTitlesQuery } = titlesApi;
