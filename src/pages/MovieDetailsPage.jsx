import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getMovieDetails, getMovieCredits, getImageUrl } from "../api/tmdb";
import MovieModal from "../components/MovieModal";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/MovieDetailsPage.module.css";

export default function MovieDetailsPage({ isModal = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      setError("");

      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
        ]);

        setMovie(movieData);
        setCast((creditsData.cast || []).slice(0, 8));
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  function handleBack() {
    navigate("/");
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return <ErrorMessage message="Movie not found." />;

  const posterUrl = movie.poster_path ? getImageUrl(movie.poster_path) : "";
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  const content = (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={handleBack}>
        Back to Home
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {posterUrl ? (
            <img src={posterUrl} alt={movie.title} className={styles.poster} />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p><strong>Release Year:</strong> {releaseYear}</p>
          <p><strong>Average Rating:</strong> {movie.vote_average?.toFixed(1) || "N/A"}</p>
          <p><strong>Plot Summary:</strong> {movie.overview || "No summary available."}</p>

          <div className={styles.castSection}>
            <h3>Cast</h3>
            {cast.length > 0 ? (
              <ul className={styles.castList}>
                {cast.map((actor) => (
                  <li key={actor.credit_id}>
                    {actor.name} as {actor.character}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No cast information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return isModal ? (
    <MovieModal onClose={handleBack}>{content}</MovieModal>
  ) : (
    <div className={styles.pageContainer}>{content}</div>
  );
}