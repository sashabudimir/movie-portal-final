import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";
import * as tmdb from "../api/tmdb";

vi.mock("../api/tmdb", () => ({
  getTopRatedMovies: vi.fn(),
  searchMovies: vi.fn(),
  getGenres: vi.fn(),
  discoverMoviesByGenre: vi.fn(),
  getImageUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
}));

function renderHomePage() {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads top rated movies on first render", async () => {
    tmdb.getGenres.mockResolvedValue({
      genres: [{ id: 28, name: "Action" }],
    });

    tmdb.getTopRatedMovies.mockResolvedValue({
      results: [
        {
          id: 1,
          title: "Inception",
          release_date: "2010-07-16",
          vote_average: 8.8,
          poster_path: "/test.jpg",
        },
      ],
      total_pages: 1,
    });

    renderHomePage();

    expect(await screen.findByText(/inception/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(tmdb.getTopRatedMovies).toHaveBeenCalled();
    });
  });

  test("loads genres on render", async () => {
    tmdb.getGenres.mockResolvedValue({
      genres: [
        { id: 28, name: "Action" },
        { id: 35, name: "Comedy" },
      ],
    });

    tmdb.getTopRatedMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
    });

    renderHomePage();

    expect(await screen.findByRole("option", { name: /action/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /comedy/i })).toBeInTheDocument();
  });

  test("searches movies when user submits a search", async () => {
    const user = userEvent.setup();

    tmdb.getGenres.mockResolvedValue({ genres: [] });
    tmdb.getTopRatedMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
    });

    tmdb.searchMovies.mockResolvedValue({
      results: [
        {
          id: 2,
          title: "Batman Begins",
          release_date: "2005-06-15",
          vote_average: 8.2,
          poster_path: "/batman.jpg",
        },
      ],
      total_pages: 1,
    });

    renderHomePage();

    await user.type(
      screen.getByPlaceholderText(/search by movie title/i),
      "Batman"
    );
    await user.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(tmdb.searchMovies).toHaveBeenCalled();
    });

    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
  });

  test("filters movies by genre", async () => {
    const user = userEvent.setup();

    tmdb.getGenres.mockResolvedValue({
      genres: [{ id: 28, name: "Action" }],
    });

    tmdb.getTopRatedMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
    });

    tmdb.discoverMoviesByGenre.mockResolvedValue({
      results: [
        {
          id: 3,
          title: "Mad Max: Fury Road",
          release_date: "2015-05-15",
          vote_average: 8.1,
          poster_path: "/madmax.jpg",
        },
      ],
      total_pages: 1,
    });

    renderHomePage();

    await screen.findByRole("option", { name: /action/i });

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "28");

    await waitFor(() => {
      expect(tmdb.discoverMoviesByGenre).toHaveBeenCalled();
    });

    expect(await screen.findByText(/mad max/i)).toBeInTheDocument();
  });

  test("shows error message when genres fail to load", async () => {
    tmdb.getGenres.mockRejectedValue(new Error("API error"));
    tmdb.getTopRatedMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
    });

    renderHomePage();

    expect(await screen.findByText(/failed to load genres/i)).toBeInTheDocument();
  });

  test("shows error message when movies fail to load", async () => {
    tmdb.getGenres.mockResolvedValue({ genres: [] });
    tmdb.getTopRatedMovies.mockRejectedValue(new Error("API error"));

    renderHomePage();

    expect(await screen.findByText(/failed to load movies/i)).toBeInTheDocument();
  });
});