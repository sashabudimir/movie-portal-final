import {
  getImageUrl,
} from "./tmdb";

describe("tmdb helpers", () => {
  test("getImageUrl returns full image path", () => {
    expect(getImageUrl("/poster.jpg")).toBe(
      "https://image.tmdb.org/t/p/w500/poster.jpg"
    );
  });

  test("getImageUrl returns empty string when no path", () => {
    expect(getImageUrl("")).toBe("");
    expect(getImageUrl(null)).toBe("");
  });
});