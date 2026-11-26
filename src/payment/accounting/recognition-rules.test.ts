import { expect, test } from "bun:test";

import { creditAtoms, recognitionMinor } from "./recognition-rules";

test("cent allocations telescope to the original net including expiry", () => {
  const grant = BigInt(3_000_000);
  const movement = BigInt(1_000_000);
  const first = recognitionMinor(100, grant, BigInt(0), 0, movement);
  expect(first).toBe(33);
  expect(recognitionMinor(100, grant, movement, 33, movement)).toBe(34);
  expect(recognitionMinor(100, grant, movement * BigInt(2), 67, movement)).toBe(
    33,
  );
  expect(recognitionMinor(100, grant, grant, 100, movement)).toBeUndefined();
});

test("parses stored credits without float conversion", () => {
  expect(creditAtoms("1.000001")).toBe(BigInt(1_000_001));
  expect(creditAtoms("9999999999.999999")).toBe(BigInt("9999999999999999"));
  expect(creditAtoms("1.0000001")).toBeUndefined();
  expect(creditAtoms("1e3")).toBeUndefined();
});
