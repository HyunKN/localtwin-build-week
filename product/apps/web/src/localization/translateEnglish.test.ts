import { describe, expect, it } from "vitest";

import { translateEnglishText } from "./translateEnglish";

describe("translateEnglishText", () => {
  it("translates core market-analysis labels and dynamic periods", () => {
    expect(translateEnglishText("연남 · 카페 · 2025년 1분기 기준")).toBe(
      "Yeonnam · Cafe · 2025 Q1",
    );
  });

  it("translates public-data metrics without changing the numeric value", () => {
    expect(translateEnglishText("유동 1,013,523명/분기 · 순증 +2")).toBe(
      "Foot traffic 1,013,523 people/quarter · Net change +2",
    );
  });
});
