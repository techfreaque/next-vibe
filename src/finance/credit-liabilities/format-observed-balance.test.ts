import { describe, expect, it } from "vitest";

import { formatObservedProviderBalance } from "./format-observed-balance";

describe("Saved provider balance display", () => {
  it("preserves the native units when a snapshot also has a USD conversion", () => {
    expect(
      formatObservedProviderBalance(
        {
          balanceNative: 240,
          balanceUsd: 2.4,
          unit: "provider credits",
        },
        "en-US",
      ),
    ).toBe("240 provider credits");
  });

  it("formats the native denomination and uses USD only when native is absent", () => {
    expect(
      formatObservedProviderBalance(
        {
          balanceNative: 12.3,
          balanceUsd: 14,
          unit: "eur",
        },
        "en-US",
      ),
    ).toBe("€12.30");
    expect(
      formatObservedProviderBalance(
        {
          balanceNative: null,
          balanceUsd: 14,
          unit: null,
        },
        "en-US",
      ),
    ).toBe("$14.00");
    expect(
      formatObservedProviderBalance(
        {
          balanceNative: null,
          balanceUsd: null,
          unit: null,
        },
        "en-US",
      ),
    ).toBeNull();
  });
});
