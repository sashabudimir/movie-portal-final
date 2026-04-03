import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieCard from "./MovieCard";

describe("MovieCard", () => {
  const movie = {
    id: 1,
    title: "Inception",
    release_date: "2010-07-16",
    vote_average: 8.8,
    poster_path: "/test.jpg",
  };

  test("renders movie title, year, and rating", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={movie} />
      </BrowserRouter>
    );

    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/release year:/i)).toBeInTheDocument();
    expect(screen.getByText(/2010/i)).toBeInTheDocument();
    expect(screen.getByText(/average rating:/i)).toBeInTheDocument();
    expect(screen.getByText(/8.8/i)).toBeInTheDocument();
  });

  test("renders link to movie details page", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={movie} />
      </BrowserRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movie/1");
  });

  test("renders image with alt text", () => {
    render(
      <BrowserRouter>
        <MovieCard movie={movie} />
      </BrowserRouter>
    );

    expect(screen.getByAltText(/inception/i)).toBeInTheDocument();
  });
});