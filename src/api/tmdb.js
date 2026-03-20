const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

async function fetchFromTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data from TMDB.");
  }

  return response.json();
}

export function getTopRatedMovies(page = 1) {
  return fetchFromTMDB("/movie/top_rated", { page });
}

export function searchMovies(query, page = 1) {
  return fetchFromTMDB("/search/movie", { query, page });
}

export function getGenres() {
  return fetchFromTMDB("/genre/movie/list");
}

export function discoverMoviesByGenre(genreId, page = 1) {
  return fetchFromTMDB("/discover/movie", {
    with_genres: genreId,
    sort_by: "vote_average.desc",
    "vote_count.gte": 1000,
    page,
  });
}

export function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}`);
}

export function getMovieCredits(movieId) {
  return fetchFromTMDB(`/movie/${movieId}/credits`);
}

export function getImageUrl(path) {
  if (!path) return "";
  return `${IMAGE_BASE_URL}${path}`;
}