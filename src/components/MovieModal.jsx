import { createPortal } from "react-dom";
import styles from "../styles/MovieModal.module.css";

export default function MovieModal({ children, onClose }) {
  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}