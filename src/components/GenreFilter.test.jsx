import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenreFilter from "./GenreFilter";

describe("GenreFilter", () => {
  test("renders all genres option and passed genres", () => {
    render(
      <GenreFilter
        genres={[
          { id: 28, name: "Action" },
          { id: 35, name: "Comedy" },
        ]}
        selectedGenre=""
        onChange={() => {}}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(/all genres/i)).toBeInTheDocument();
    expect(screen.getByText(/action/i)).toBeInTheDocument();
    expect(screen.getByText(/comedy/i)).toBeInTheDocument();
  });

  test("calls onChange when user selects genre", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <GenreFilter
        genres={[{ id: 28, name: "Action" }]}
        selectedGenre=""
        onChange={onChange}
      />
    );

    await user.selectOptions(screen.getByRole("combobox"), "28");

    expect(onChange).toHaveBeenCalledWith("28");
  });
});