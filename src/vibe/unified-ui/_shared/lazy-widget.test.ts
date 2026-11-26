import { describe, expect, it } from "bun:test";

import {
  type CliComponent,
  getLazyWidgetRegistrySize,
  lazyWidget,
  preloadAllLazyWidgets,
} from "./lazy-widget";

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
    const peer = lazyWidget(async () => {
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
    expect(peer.cliWidget).toBe(true);
  });

  it("releases evicted lazy widgets for GC instead of pinning every HMR generation", async () => {
    const baseline = getLazyWidgetRegistrySize();
    const refs: Array<WeakRef<CliComponent>> = [];

    function registerEphemeralBatch(): void {
      for (let i = 0; i < 40; i++) {
        const HeavyWidget = (): null => null;
        const w = lazyWidget(async () => ({ default: HeavyWidget }));
        refs.push(new WeakRef(w));
      }
    }

    registerEphemeralBatch();
    await preloadAllLazyWidgets(true);

    // Yield a macrotask so JSC leaves the registration turn, then force GC.
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 10);
    });
    if (typeof Bun !== "undefined") {
      Bun.gc(true);
      Bun.gc(true);
    }

    const surviving = refs.filter((r) => r.deref() !== undefined).length;
    expect(surviving).toBeLessThan(refs.length);
    expect(getLazyWidgetRegistrySize()).toBeLessThanOrEqual(
      baseline + surviving,
    );
  });
});
