import { describe, expect, it } from "bun:test";

import { installArrayPolyfills } from "./array-polyfills";

describe("installArrayPolyfills", () => {
  it("is a no-op where the methods are native", () => {
    const before = Array.prototype.toSorted;
    installArrayPolyfills();
    expect(Array.prototype.toSorted).toBe(before);
    expect([3, 1, 2].toSorted()).toEqual([1, 2, 3]);
  });
});
