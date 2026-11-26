import { describe, expect, it } from "vitest";

import { serializeGetQuery } from "./call-api";

describe("GET query serialization", () => {
  it("preserves date-only strings and encodes Date values as wire-safe ISO timestamps", () => {
    const day = "2026-11-25";
    const date = new Date(`${day}T00:00:00.000Z`);
    const params = new URLSearchParams(
      serializeGetQuery({
        dateFrom: date,
        dateTo: day,
        dates: [date, day],
        filters: [{ timestamp: date, active: false }],
        absent: null,
      }),
    );
    expect(params.get("dateFrom")).toBe("2026-11-25T00:00:00.000Z");
    expect(params.get("dateTo")).toBe(day);
    expect(params.get("dates[0]")).toBe("2026-11-25T00:00:00.000Z");
    expect(params.get("dates[1]")).toBe(day);
    expect(params.get("filters[0].timestamp")).toBe("2026-11-25T00:00:00.000Z");
    expect(params.get("filters[0].active")).toBe("false");
    expect(params.has("absent")).toBe(false);
  });

  it("keeps an invalid date available for request validation", () => {
    const params = new URLSearchParams(
      serializeGetQuery({ date: new Date(Number.NaN) }),
    );
    expect(params.get("date")).toBe("Invalid Date");
  });
});
