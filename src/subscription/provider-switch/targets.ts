/**
 * Switch target providers
 *
 * A target is the provider card subscribers move to. Add one entry per
 * provider here; checkout, webhooks and renewals stay on the regular
 * PaymentProvider adapter (`src/payment/providers`). The target only states
 * what the switch needs to know on top of that:
 * - carryOver: how the remaining paid time moves over (see rules.ts).
 *   DEFERRED_START adapters read `metadata.switchBillingStartAt` (ISO) in
 *   createCheckoutSession and start billing then (trial / billing anchor).
 * - isReady: credentials present and live payments switched on.
 * - supportsPlan: plan + interval the provider can sell (same plan, same
 *   interval; never a silent change).
 *
 * The active target comes from SUBSCRIPTION_SWITCH_PROVIDER and only while
 * SUBSCRIPTION_SWITCH_ENABLED=true. No target = no switch UI and no notice.
 */

import "server-only";

import { PaymentProvider, type PaymentProviderValue } from "../../payment/enum";
import { paymentEnv } from "../../payment/env";
import {
  isWhopCheckoutAvailable,
  nowPaymentsAcceptsCards,
} from "../../payment/providers/availability";
import { ProductIds } from "../../products/repository-client";
import { SwitchCarryOver, type SwitchCarryOverValue } from "./enum";
import { providerSwitchEnv } from "./env";

export type SwitchInterval = "month" | "year";

export interface SubscriptionSwitchTarget {
  provider: typeof PaymentProviderValue;
  carryOver: typeof SwitchCarryOverValue;
  isReady: () => boolean;
  supportsPlan: (productId: ProductIds, interval: SwitchInterval) => boolean;
}

/** NOWPayments with fiat operations on: card checkout, one-off invoices. */
const nowPaymentsCardTarget: SubscriptionSwitchTarget = {
  provider: PaymentProvider.NOWPAYMENTS,
  carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
  isReady: () =>
    Boolean(paymentEnv.NOWPAYMENTS_API_KEY) && nowPaymentsAcceptsCards(),
  // Starter monthly is below the NOWPayments minimum (same rule as checkout).
  supportsPlan: (productId, interval) =>
    !(interval === "month" && productId === ProductIds.SUBSCRIPTION),
};

/**
 * Whop card: a real renewal membership, charged at checkout. The first
 * period carries the remaining paid time over (EXTEND_FIRST_PERIOD) and the
 * Whop renewal date is moved to that period end
 * (WhopProvider.moveRenewalDate), so no day is billed twice. Every plan and
 * interval sells (Whop minimum is 1.00).
 */
const whopCardTarget: SubscriptionSwitchTarget = {
  provider: PaymentProvider.WHOP,
  carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
  isReady: isWhopCheckoutAvailable,
  supportsPlan: () => true,
};

const targets = new Map<keyof typeof PaymentProvider, SubscriptionSwitchTarget>(
  [
    ["NOWPAYMENTS", nowPaymentsCardTarget],
    ["WHOP", whopCardTarget],
  ],
);

/** Plug in a new provider (Verotel, CCBill, Paddle...). */
export function registerSwitchTarget(
  key: keyof typeof PaymentProvider,
  target: SubscriptionSwitchTarget,
): void {
  if (key === "STRIPE") {
    return;
  }
  targets.set(key, target);
}

export interface SwitchTargetConfig {
  enabled: boolean;
  providerKey: keyof typeof PaymentProvider | undefined;
}

/** Pure lookup, exported for tests. */
export function resolveSwitchTarget(
  config: SwitchTargetConfig,
): SubscriptionSwitchTarget | null {
  if (
    !config.enabled ||
    !config.providerKey ||
    config.providerKey === "STRIPE"
  ) {
    return null;
  }
  const target = targets.get(config.providerKey);
  return target && target.isReady() ? target : null;
}

/** The configured, enabled and ready target, or null. */
export function getActiveSwitchTarget(): SubscriptionSwitchTarget | null {
  return resolveSwitchTarget({
    enabled: providerSwitchEnv.SUBSCRIPTION_SWITCH_ENABLED === "true",
    providerKey: providerSwitchEnv.SUBSCRIPTION_SWITCH_PROVIDER,
  });
}
