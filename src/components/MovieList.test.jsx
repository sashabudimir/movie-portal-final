import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MovieList from "./MovieList";

describe("MovieList", () => {
  test("shows empty message when there are no movies", () => {
    render(
      <BrowserRouter>
        <MovieList movies={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText(/no movies found/i)).toBeInTheDocument();
  });

  test("renders movie cards when movies exist", () => {
    const movies = [
      {
        id: 1,
        title: "Inception",
        release_date: "2010-07-16",
        vote_average: 8.8,
        poster_path: "/test.jpg",
      },
      {
        id: 2,
        title: "Interstellar",
        release_date: "2014-11-07",
        vote_average: 8.6,
        poster_path: "/test2.jpg",
      },
    ];

    render(
      <BrowserRouter>
        <MovieList movies={movies} />
      </BrowserRouter>
    );

    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/interstellar/i)).toBeInTheDocument();
  });
});