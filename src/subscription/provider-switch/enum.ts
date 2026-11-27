/**
 * Subscription provider switch enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * How the paid time left on the old plan carries over to the new provider.
 * - EXTEND_FIRST_PERIOD: the new provider charges now; its first period runs
 *   until the old period end plus one interval (NOWPayments one-off invoices).
 * - DEFERRED_START: the new provider starts billing at the old period end
 *   (trial or billing anchor); no charge and no credit grant at checkout.
 */
export const {
  enum: SwitchCarryOver,
  options: SwitchCarryOverOptions,
  Value: SwitchCarryOverValue,
} = createEnumOptions(scopedTranslation, {
  EXTEND_FIRST_PERIOD: "enums.carryOver.extendFirstPeriod",
  DEFERRED_START: "enums.carryOver.deferredStart",
});

export const SwitchCarryOverDB = [
  SwitchCarryOver.EXTEND_FIRST_PERIOD,
  SwitchCarryOver.DEFERRED_START,
] as const;

/** Lifecycle of one switch attempt. */
export const {
  enum: SwitchStatus,
  options: SwitchStatusOptions,
  Value: SwitchStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.status.pending",
  COMPLETED: "enums.status.completed",
  CANCEL_FAILED: "enums.status.cancelFailed",
});

export const SwitchStatusDB = [
  SwitchStatus.PENDING,
  SwitchStatus.COMPLETED,
  SwitchStatus.CANCEL_FAILED,
] as const;

/** How the old card subscription is stopped once the new one is paid. */
export const {
  enum: OldPlanCancelMode,
  options: OldPlanCancelModeOptions,
  Value: OldPlanCancelModeValue,
} = createEnumOptions(scopedTranslation, {
  AT_PERIOD_END: "enums.cancelMode.atPeriodEnd",
  IMMEDIATE: "enums.cancelMode.immediate",
});

export const OldPlanCancelModeDB = [
  OldPlanCancelMode.AT_PERIOD_END,
  OldPlanCancelMode.IMMEDIATE,
] as const;

/** What the subscription page offers the viewer. */
export const {
  enum: SwitchOfferState,
  options: SwitchOfferStateOptions,
  Value: SwitchOfferStateValue,
} = createEnumOptions(scopedTranslation, {
  AVAILABLE: "enums.offer.available",
  PLAN_NOT_SUPPORTED: "enums.offer.planNotSupported",
  NOT_ELIGIBLE: "enums.offer.notEligible",
});

/** One-time switch notice delivery state (one row per user). */
export const {
  enum: SwitchNoticeStatus,
  options: SwitchNoticeStatusOptions,
  Value: SwitchNoticeStatusValue,
} = createEnumOptions(scopedTranslation, {
  SENDING: "enums.notice.sending",
  SENT: "enums.notice.sent",
  FAILED: "enums.notice.failed",
});

export const SwitchNoticeStatusDB = [
  SwitchNoticeStatus.SENDING,
  SwitchNoticeStatus.SENT,
  SwitchNoticeStatus.FAILED,
] as const;
