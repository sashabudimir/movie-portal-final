import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

export default function App() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailsPage isModal={true} />} />
        </Routes>
      )}
    </>
  );
}