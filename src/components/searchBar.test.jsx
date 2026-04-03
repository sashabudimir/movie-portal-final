import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  test("renders input and buttons", () => {
    render(<SearchBar onSearch={() => {}} />);

    expect(screen.getByPlaceholderText(/search by movie title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("calls onSearch with typed value when search is clicked", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search by movie title/i), "Batman");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith("Batman");
  });

  test("clears input and calls onSearch with empty string", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search by movie title/i);
    await user.type(input, "Avatar");
    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(input).toHaveValue("");
    expect(onSearch).toHaveBeenCalledWith("");
  });
});