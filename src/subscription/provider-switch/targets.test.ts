import { describe, expect, it } from "bun:test";

import { PaymentProvider } from "../../payment/enum";
import { ProductIds } from "../../products/repository-client";
import { SwitchCarryOver } from "./enum";
import { registerSwitchTarget, resolveSwitchTarget } from "./targets";

describe("resolveSwitchTarget", () => {
  it("offers nothing while the switch is disabled or unconfigured", () => {
    expect(
      resolveSwitchTarget({ enabled: false, providerKey: "NOWPAYMENTS" }),
    ).toBeNull();
    expect(
      resolveSwitchTarget({ enabled: true, providerKey: undefined }),
    ).toBeNull();
  });

  it("never targets the paused processor", () => {
    expect(
      resolveSwitchTarget({ enabled: true, providerKey: "STRIPE" }),
    ).toBeNull();
  });

  it("returns a ready target and skips one that is not ready", () => {
    let ready = false;
    registerSwitchTarget("NOWPAYMENTS", {
      provider: PaymentProvider.NOWPAYMENTS,
      carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
      isReady: () => ready,
      supportsPlan: (productId) => productId !== ProductIds.SUBSCRIPTION,
    });
    expect(
      resolveSwitchTarget({ enabled: true, providerKey: "NOWPAYMENTS" }),
    ).toBeNull();
    ready = true;
    const target = resolveSwitchTarget({
      enabled: true,
      providerKey: "NOWPAYMENTS",
    });
    expect(target?.provider).toBe(PaymentProvider.NOWPAYMENTS);
    expect(target?.supportsPlan(ProductIds.SUBSCRIPTION_PLUS, "month")).toBe(
      true,
    );
  });
});
