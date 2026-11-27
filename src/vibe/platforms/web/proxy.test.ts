import { describe, expect, it } from "bun:test";

import { IOREDIS_WARM_STEPS } from "./proxy";

describe("IOREDIS_WARM_STEPS", () => {
  it("every warm-up path exists in the installed ioredis", () => {
    const missing = IOREDIS_WARM_STEPS.filter((step) => {
      try {
        Bun.resolveSync(step, import.meta.dir);
        return false;
      } catch {
        return true;
      }
    });
    expect(missing).toEqual([]);
  });
});
