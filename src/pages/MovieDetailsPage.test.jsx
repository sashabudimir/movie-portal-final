import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import MovieDetailsPage from "./MovieDetailsPage";
import * as tmdb from "../api/tmdb";

vi.mock("../api/tmdb", () => ({
  getMovieDetails: vi.fn(),
  getMovieCredits: vi.fn(),
  getImageUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
}));

describe("MovieDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("renders loading state first", async () => {
    tmdb.getMovieDetails.mockResolvedValue({
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      vote_average: 8.8,
      overview: "A mind-bending movie.",
      poster_path: "/test.jpg",
    });

    tmdb.getMovieCredits.mockResolvedValue({
      cast: [],
    });

    renderPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/inception/i)).toBeInTheDocument();
    });
  });

  test("renders movie details and cast", async () => {
    tmdb.getMovieDetails.mockResolvedValue({
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      vote_average: 8.8,
      overview: "A mind-bending movie.",
      poster_path: "/test.jpg",
    });

    tmdb.getMovieCredits.mockResolvedValue({
      cast: [
        { credit_id: "a1", name: "Leonardo DiCaprio", character: "Cobb" },
        { credit_id: "a2", name: "Joseph Gordon-Levitt", character: "Arthur" },
      ],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/inception/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/2010/i)).toBeInTheDocument();
    expect(screen.getByText(/a mind-bending movie/i)).toBeInTheDocument();
    expect(screen.getByText(/leonardo dicaprio as cobb/i)).toBeInTheDocument();
    expect(screen.getByText(/joseph gordon-levitt as arthur/i)).toBeInTheDocument();
  });

  test("shows error message if movie details fail", async () => {
    tmdb.getMovieDetails.mockRejectedValue(new Error("API error"));
    tmdb.getMovieCredits.mockRejectedValue(new Error("API error"));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/failed to load movie details/i)).toBeInTheDocument();
    });
  });

  test("back button navigates to home page", async () => {
    const user = userEvent.setup();

    tmdb.getMovieDetails.mockResolvedValue({
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      vote_average: 8.8,
      overview: "A mind-bending movie.",
      poster_path: "/test.jpg",
    });

    tmdb.getMovieCredits.mockResolvedValue({
      cast: [],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/inception/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /back to home/i }));

    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });
});