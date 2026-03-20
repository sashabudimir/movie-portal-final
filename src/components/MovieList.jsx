import MovieCard from "./MovieCard";
import styles from "../styles/MovieList.module.css";

export default function MovieList({ movies }) {
  if (!movies.length) {
    return <p className={styles.empty}>No movies found.</p>;
  }

  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}