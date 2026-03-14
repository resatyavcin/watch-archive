export type MediaType = "movie" | "tv";

export type Title = {
  id: number;
  poster: string | null;
  title: string;
  year: number;
  type: MediaType;
  rating?: number;
};

export type PopularBrowseItem = {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  sortOrder: number;
};

export type PopularBrowseResponse = {
  popular: PopularBrowseItem[];
};

export type TitleDetail = {
  id: number;
  tmdbId: number;
  contentType: "MOVIE" | "SERIES";
  name: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  runtime: number | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  genres: string[];
};
