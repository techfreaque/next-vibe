import { describe, expect, it } from "bun:test";

import { BillingInterval, SubscriptionStatus } from "../enum";
import { OldPlanCancelMode, SwitchCarryOver } from "./enum";
import {
  intervalMs,
  resolveBillingStartAt,
  resolveOldPlanCancelMode,
  resolveSwitchDeadline,
  resolveSwitchedPeriod,
} from "./rules";

const now = new Date("2026-11-28T12:00:00.000Z");
const periodEnd = new Date("2026-12-15T00:00:00.000Z");
const base = {
  currentPeriodEnd: periodEnd,
  trialEnd: null,
  gracePeriodEndsAt: null,
};

describe("resolveBillingStartAt", () => {
  it("starts new billing when the paid period ends", () => {
    expect(
      resolveBillingStartAt({ ...base, status: SubscriptionStatus.ACTIVE }, now),
    ).toEqual(periodEnd);
  });

  it("starts now for a past-due plan (nothing paid to carry)", () => {
    expect(
      resolveBillingStartAt(
        { ...base, status: SubscriptionStatus.PAST_DUE },
        now,
      ),
    ).toEqual(now);
  });

  it("uses the trial end while trialing", () => {
    const trialEnd = new Date("2026-12-01T00:00:00.000Z");
    expect(
      resolveBillingStartAt(
        { ...base, trialEnd, status: SubscriptionStatus.TRIALING },
        now,
      ),
    ).toEqual(trialEnd);
  });

  it("never starts in the past", () => {
    expect(
      resolveBillingStartAt(
        {
          ...base,
          currentPeriodEnd: new Date("2026-11-01T00:00:00.000Z"),
          status: SubscriptionStatus.ACTIVE,
        },
        now,
      ),
    ).toEqual(now);
  });
});

describe("resolveSwitchDeadline", () => {
  it("is the grace period end for past due plans", () => {
    const grace = new Date("2026-12-02T00:00:00.000Z");
    expect(
      resolveSwitchDeadline({
        ...base,
        gracePeriodEndsAt: grace,
        status: SubscriptionStatus.PAST_DUE,
      }),
    ).toEqual(grace);
  });

  it("is the period end for active plans", () => {
    expect(
      resolveSwitchDeadline({ ...base, status: SubscriptionStatus.ACTIVE }),
    ).toEqual(periodEnd);
  });
});

describe("resolveOldPlanCancelMode", () => {
  it("cancels at period end while the old processor still charges", () => {
    expect(resolveOldPlanCancelMode(SubscriptionStatus.ACTIVE, false)).toBe(
      OldPlanCancelMode.AT_PERIOD_END,
    );
  });

  it("cancels immediately when charges are paused or the plan is past due", () => {
    expect(resolveOldPlanCancelMode(SubscriptionStatus.ACTIVE, true)).toBe(
      OldPlanCancelMode.IMMEDIATE,
    );
    expect(resolveOldPlanCancelMode(SubscriptionStatus.PAST_DUE, false)).toBe(
      OldPlanCancelMode.IMMEDIATE,
    );
  });
});

describe("resolveSwitchedPeriod", () => {
  it("extends the first period by the remaining paid time (no double charge)", () => {
    const period = resolveSwitchedPeriod({
      carryOver: SwitchCarryOver.EXTEND_FIRST_PERIOD,
      billingStartAt: periodEnd,
      billingInterval: BillingInterval.MONTHLY,
      now,
    });
    expect(period.periodStart).toEqual(now);
    expect(period.periodEnd.getTime()).toBe(
      periodEnd.getTime() + intervalMs(BillingInterval.MONTHLY),
    );
    expect(period.grantCreditsNow).toBe(true);
  });

  it("defers billing and grants nothing at checkout", () => {
    const period = resolveSwitchedPeriod({
      carryOver: SwitchCarryOver.DEFERRED_START,
      billingStartAt: periodEnd,
      billingInterval: BillingInterval.YEARLY,
      now,
    });
    expect(period.periodEnd).toEqual(periodEnd);
    expect(period.grantCreditsNow).toBe(false);
  });

  it("charges now with a full period when nothing was paid ahead", () => {
    const period = resolveSwitchedPeriod({
      carryOver: SwitchCarryOver.DEFERRED_START,
      billingStartAt: now,
      billingInterval: BillingInterval.YEARLY,
      now,
    });
    expect(period.periodEnd.getTime()).toBe(
      now.getTime() + intervalMs(BillingInterval.YEARLY),
    );
    expect(period.grantCreditsNow).toBe(true);
  });
});
