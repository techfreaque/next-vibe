import { describe, expect, it } from "bun:test";

import { reverseChargeDecision } from "./reverse-charge";

describe("explicit reverse-charge inputs", () => {
  it("leaves an unclassified foreign bill untouched and refuses incomplete decisions", () => {
    expect(reverseChargeDecision(undefined, undefined, 100)).toBeNull();
    expect(reverseChargeDecision(100, undefined, 100)).toBe(false);
    expect(reverseChargeDecision(undefined, 19, 100)).toBe(false);
    expect(reverseChargeDecision(101, 19, 100)).toBe(false);
    expect(reverseChargeDecision(100, 0, 100)).toBe(false);
    expect(reverseChargeDecision(10.125, 19, 100)).toBe(false);
  });

  it("rounds the taxable amount once to the nearest cent", () => {
    expect(reverseChargeDecision(99.99, 19, 120)).toEqual({
      base: 99.99,
      ratePercent: 19,
      amount: 19,
    });
    expect(reverseChargeDecision(0.5, 5, 1)).toEqual({
      base: 0.5,
      ratePercent: 5,
      amount: 0.03,
    });
  });
});
