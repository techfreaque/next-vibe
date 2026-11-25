import { describe, expect, it } from "bun:test";

import { sumGroupCreditCost } from "./message-grouping";

describe("sumGroupCreditCost", () => {
  it("counts a settled multi-step turn once and includes other settled charges", () => {
    expect(
      sumGroupCreditCost([
        { metadata: { stepCreditCost: 6.5 } },
        { metadata: null },
        { metadata: { creditCost: 19.5, stepCreditCost: 6.5 } },
        { metadata: { creditCost: 1.25 } },
      ]),
    ).toBe(20.75);
  });

  it("distinguishes a free turn from a turn with no settled cost", () => {
    expect(
      sumGroupCreditCost([{}, { metadata: { stepCreditCost: 6.5 } }]),
    ).toBeNull();
    expect(sumGroupCreditCost([{ metadata: { creditCost: 0 } }])).toBe(0);
  });
});
