const API_KEY = import.meta.env.VITE_TMDB_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const OMDB_BASE_URL = "https://www.omdbapi.com";

export const IMG_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const withApiKey = (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const request = async (path, params = {}) => {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Check VITE_TMDB_KEY in .env");
  }

  const res = await fetch(withApiKey(path, params));

  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status})`);
  }

  return res.json();
};

const requestOmdb = async (params = {}) => {
  if (!OMDB_API_KEY) return null;

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", OMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`OMDb request failed (${res.status})`);
  }

  const data = await res.json();
  if (data.Response !== "True") return null;
  return data;
};

const toPagedResult = (payload) => ({
  page: payload?.page ?? 1,
  results: payload?.results ?? [],
  totalPages: payload?.total_pages ?? 1,
  totalResults: payload?.total_results ?? 0,
});

export const getTrending = async (page = 1) => {
  const data = await request("/trending/movie/week", { page });
  return toPagedResult(data);
};

export const getPopular = async (page = 1) => {
  const data = await request("/movie/popular", { page });
  return toPagedResult(data);
};

export const searchMulti = async (query, page = 1) => {
  const data = await request("/search/multi", { query, page, include_adult: false });
  return toPagedResult(data);
};

export const getMovieDetails = async (id) => {
  return request(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });
};

export const getSimilarMovies = async (id, page = 1) => {
  const data = await request(`/movie/${id}/similar`, { page });
  return toPagedResult(data);
};

export const getByGenre = async (genreId, page = 1) => {
  const data = await request("/discover/movie", { with_genres: genreId, page });
  return toPagedResult(data);
};

export const getGenres = async (type = "movie") => {
  return request(`/genre/${type}/list`);
};

export const getTopRatedMovies = async (page = 1) => {
  const data = await request("/movie/top_rated", { page });
  return toPagedResult(data);
};

export const getTopRatedTV = async (page = 1) => {
  const data = await request("/tv/top_rated", { page });
  return toPagedResult(data);
};

export const getTVDetails = async (id) => {
  return request(`/tv/${id}`, {
    append_to_response: "credits,videos,similar,content_ratings",
  });
};

export const getTVSeason = async (tvId, seasonNumber) => {
  return request(`/tv/${tvId}/season/${seasonNumber}`);
};

export const getByGenreByType = async (type = "movie", genreId, page = 1) => {
  const data = await request(`/discover/${type}`, { with_genres: genreId, page });
  return toPagedResult(data);
};

export const getRandomMovie = async () => {
  const randomPage = Math.floor(Math.random() * 25) + 1;
  const pageData = await request("/movie/top_rated", { page: randomPage });
  const results = pageData?.results ?? [];
  if (!results.length) {
    throw new Error("No top-rated movies available.");
  }
  const pick = results[Math.floor(Math.random() * results.length)];
  return { ...pick, media_type: "movie" };
};

export const getRandomTV = async () => {
  const randomPage = Math.floor(Math.random() * 25) + 1;
  const pageData = await request("/tv/top_rated", { page: randomPage });
  const results = pageData?.results ?? [];
  if (!results.length) {
    throw new Error("No top-rated series available.");
  }
  const pick = results[Math.floor(Math.random() * results.length)];
  return { ...pick, media_type: "tv" };
};

export const getTranslations = async (type = "movie", id) => {
  return request(`/${type}/${id}/translations`);
};

export const getExternalIds = async (type = "movie", id) => {
  return request(`/${type}/${id}/external_ids`);
};

export const getImdbRating = async (imdbId) => {
  if (!imdbId) return null;
  const data = await requestOmdb({ i: imdbId });
  if (!data) return null;

  return {
    imdbRating: data.imdbRating,
    imdbVotes: data.imdbVotes,
    imdbUrl: `https://www.imdb.com/title/${imdbId}/`,
  };
};

export const getDiscoverByRegion = async (region = "US", page = 1) => {
  const data = await request("/discover/movie", {
    page,
    region,
    with_origin_country: region,
    sort_by: "popularity.desc",
    include_adult: false,
    "vote_count.gte": 10,
  });
  return toPagedResult(data);
};
