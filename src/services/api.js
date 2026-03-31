const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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

const toPagedResult = (payload) => ({
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

export const searchMovies = async (query, page = 1) => {
  const data = await request("/search/movie", { query, page, include_adult: false });
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
