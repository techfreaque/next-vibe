import { describe, expect, test } from "bun:test";

import { chatModelOptionsPool } from "../ai-stream/models";
import { ContentLevel, IntelligenceLevel, PriceLevel } from "../skills/enum";
import { modelMeetsFilterRanges } from "./models";

describe("modelMeetsFilterRanges", () => {
  test("no ranges matches every model", () => {
    expect(chatModelOptionsPool.every((m) => modelMeetsFilterRanges(m, {}))).toBe(
      true,
    );
  });

  test("content range narrows to exactly the tier", () => {
    for (const level of Object.values(ContentLevel)) {
      const hits = chatModelOptionsPool.filter((m) =>
        modelMeetsFilterRanges(m, { contentRange: { min: level, max: level } }),
      );
      expect(hits.length).toBeGreaterThan(0);
      expect(hits.every((m) => m.content === level)).toBe(true);
    }
  });

  test("content max=mainstream excludes open and uncensored", () => {
    const hits = chatModelOptionsPool.filter((m) =>
      modelMeetsFilterRanges(m, {
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
      }),
    );
    expect(hits.some((m) => m.content !== ContentLevel.MAINSTREAM)).toBe(false);
  });

  test("intelligence min=brilliant keeps only brilliant models", () => {
    const hits = chatModelOptionsPool.filter((m) =>
      modelMeetsFilterRanges(m, {
        intelligenceRange: { min: IntelligenceLevel.BRILLIANT },
      }),
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((m) => m.intelligence === IntelligenceLevel.BRILLIANT)).toBe(
      true,
    );
  });

  test("price max=cheap excludes premium models", () => {
    const all = chatModelOptionsPool.length;
    const hits = chatModelOptionsPool.filter((m) =>
      modelMeetsFilterRanges(m, { priceRange: { max: PriceLevel.CHEAP } }),
    );
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.length).toBeLessThan(all);
  });
});
