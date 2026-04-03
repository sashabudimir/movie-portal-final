import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination", () => {
  test("disables previous button on first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  test("disables next button on last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  test("calls onPageChange when next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});