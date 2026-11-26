import { describe, expect, it } from "bun:test";

import { lazyWidget, preloadAllLazyWidgets } from "./lazy-widget";

describe("Widget registry warmup", () => {
  it("keeps a removed development widget from blocking its peers and retries a restored module", async () => {
    let restored = false;
    let calls = 0;
    const Fixture = (): null => null;
    const changing = lazyWidget(async () => {
      calls++;
      return restored
        ? { default: Fixture }
        : Promise.reject(new Error("Fixture module unavailable"));
    });
    let availableLoads = 0;
    lazyWidget(async () => {
      availableLoads++;
      return { default: Fixture };
    });
    await preloadAllLazyWidgets(true);
    expect(availableLoads).toBe(1);
    expect(calls).toBe(1);
    await expect(changing.preload()).rejects.toMatchObject({
      message: "Fixture module unavailable",
    });
    await expect(preloadAllLazyWidgets(false)).rejects.toMatchObject({
      message: "Fixture module unavailable",
    });
    restored = true;
    await preloadAllLazyWidgets(true);
    const recoveredCalls = calls;
    await preloadAllLazyWidgets(false);
    expect(calls).toBe(recoveredCalls);
    expect(availableLoads).toBe(1);
  });
});
