import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./pages/HomePage", () => ({
  default: () => <div>Home Page Mock</div>,
}));

vi.mock("./pages/MovieDetailsPage", () => ({
  default: () => <div>Movie Details Mock</div>,
}));

describe("App", () => {
  test("renders home page on root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/home page mock/i)).toBeInTheDocument();
  });

  test("renders movie details page on movie route", () => {
    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/movie details mock/i)).toBeInTheDocument();
  });
});