import styles from "../styles/GenreFilter.module.css";

export default function GenreFilter({ genres, selectedGenre, onChange }) {
  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={selectedGenre}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}