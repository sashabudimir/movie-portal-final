import { useEffect, useState } from "react";
import {
  getTopRatedMovies,
  searchMovies,
  getGenres,
  discoverMoviesByGenre,
} from "../api/tmdb";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import MovieList from "../components/MovieList";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getGenres();
        setGenres(data.genres || []);
      } catch (err) {
        setError("Failed to load genres.");
      }
    }

    loadGenres();
  }, []);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        let data;

        if (searchTerm.trim()) {
          data = await searchMovies(searchTerm, page);
        } else if (selectedGenre) {
          data = await discoverMoviesByGenre(selectedGenre, page);
        } else {
          data = await getTopRatedMovies(page);
        }

        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [searchTerm, selectedGenre, page]);

  function handleSearch(term) {
    setSearchTerm(term);
    setSelectedGenre("");
    setPage(1);
  }

  function handleGenreChange(genreId) {
    setSelectedGenre(genreId);
    setSearchTerm("");
    setPage(1);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Movie Portal</h1>
      <p className={styles.subtitle}>
        Browse top-rated movies, search by title, and filter by genre.
      </p>

      <div className={styles.controls}>
        <SearchBar onSearch={handleSearch} />
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onChange={handleGenreChange}
        />
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && <MovieList movies={movies} />}

      {!loading && !error && movies.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}