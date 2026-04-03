import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getImageUrl } from "../api/tmdb";
import styles from "../styles/MovieCard.module.css";

function MovieCard({ movie }) {
  const location = useLocation();

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  const posterUrl = movie.poster_path
    ? getImageUrl(movie.poster_path)
    : "";

  return (
    <Link
      to={`/movie/${movie.id}`}
      state={{ backgroundLocation: location }}
      className={styles.cardLink}
    >
      <div className={styles.card}>
        <div className={styles.posterWrapper}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className={styles.poster}
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>
          <p>
            <strong>Release Year:</strong> {releaseYear}
          </p>
          <p>
            <strong>Average Rating:</strong>{" "}
            {movie.vote_average?.toFixed(1) || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default memo(MovieCard);