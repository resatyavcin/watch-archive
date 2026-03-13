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
