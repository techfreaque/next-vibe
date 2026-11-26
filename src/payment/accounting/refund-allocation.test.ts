import { expect, test } from "bun:test";

import { allocateVerifiedRefund } from "./refund-allocation";

const unused = { grossMinor: 0, taxMinor: 0 };

test("caps successive exempt partial refunds at the original native gross", () => {
  const original = { grossMinor: 900, taxMinor: 0 };
  const first = allocateVerifiedRefund(original, unused, 320, null);
  expect(first).toEqual({ grossMinor: 320, taxMinor: 0 });
  expect(
    allocateVerifiedRefund(
      original,
      { grossMinor: 320, taxMinor: 0 },
      581,
      null,
    ),
  ).toBeUndefined();
});

test("requires explicit tax allocation for a taxable partial refund", () => {
  const original = { grossMinor: 1200, taxMinor: 200 };
  expect(allocateVerifiedRefund(original, unused, 600, null)).toBeUndefined();
  expect(allocateVerifiedRefund(original, unused, 600, 100)).toEqual({
    grossMinor: 600,
    taxMinor: 100,
  });
  expect(
    allocateVerifiedRefund(
      original,
      { grossMinor: 600, taxMinor: 100 },
      600,
      99,
    ),
  ).toBeUndefined();
  expect(
    allocateVerifiedRefund(
      original,
      { grossMinor: 600, taxMinor: 100 },
      600,
      null,
    ),
  ).toEqual({
    grossMinor: 600,
    taxMinor: 100,
  });
});
