import { describe, expect, it } from "vitest";

import { evidenceAmounts, evidenceDay, parseEvidenceAmount } from "./rules";

describe("supplier evidence exact amounts and days", () => {
  it("converts known amounts without rounding estimates", () => {
    expect(parseEvidenceAmount("30.0009")).toBe(300_009);
    expect(parseEvidenceAmount("99999999.9999")).toBe(999_999_999_999);
    for (const invalid of ["1.00001", "-1", "2e1", "5,01", "100000000"]) {
      expect(parseEvidenceAmount(invalid)).toBeNull();
    }
  });

  it("enforces the confirmed tax split and a positive net", () => {
    expect(evidenceAmounts("120", "20", true)).toEqual({
      gross: 120,
      tax: 20,
      net: 100,
    });
    expect(evidenceAmounts("120", "20", false)).toBeNull();
    expect(evidenceAmounts("120", "120", true)).toBeNull();
    expect(evidenceAmounts("120", "", true)).toBeNull();
  });

  it("keeps verified calendar dates in their original UTC day", () => {
    expect(evidenceDay("2024-02-29")?.toISOString()).toBe(
      "2024-02-29T00:00:00.000Z",
    );
    expect(evidenceDay("2026-02-29")).toBeNull();
    expect(evidenceDay("2026-01-01T00:00:00-05:00")).toBeNull();
  });
});
