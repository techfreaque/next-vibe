/**
 * Lifecycle journey enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** The lifecycle journeys. One contact is in at most one at a time. */
export const {
  enum: LifecycleJourney,
  options: LifecycleJourneyOptions,
  Value: LifecycleJourneyValue,
} = createEnumOptions(scopedTranslation, {
  INACTIVE_USER: "enums.journey.inactiveUser",
  ENGAGED_FREE: "enums.journey.engagedFree",
  NEWSLETTER_INVITE: "enums.journey.newsletterInvite",
});

export const LifecycleJourneyDB = [
  LifecycleJourney.INACTIVE_USER,
  LifecycleJourney.ENGAGED_FREE,
  LifecycleJourney.NEWSLETTER_INVITE,
] as const;

export const {
  enum: LifecycleEnrollmentStatus,
  options: LifecycleEnrollmentStatusOptions,
  Value: LifecycleEnrollmentStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.enrollmentStatus.active",
  COMPLETED: "enums.enrollmentStatus.completed",
  EXITED: "enums.enrollmentStatus.exited",
});

export const LifecycleEnrollmentStatusDB = [
  LifecycleEnrollmentStatus.ACTIVE,
  LifecycleEnrollmentStatus.COMPLETED,
  LifecycleEnrollmentStatus.EXITED,
] as const;

/** Why an enrollment ended early. */
export const {
  enum: LifecycleExitReason,
  options: LifecycleExitReasonOptions,
  Value: LifecycleExitReasonValue,
} = createEnumOptions(scopedTranslation, {
  GOAL_MET: "enums.exitReason.goalMet",
  UNSUBSCRIBED: "enums.exitReason.unsubscribed",
  SUPPRESSED: "enums.exitReason.suppressed",
  INELIGIBLE: "enums.exitReason.ineligible",
  SEND_FAILED: "enums.exitReason.sendFailed",
});

export const LifecycleExitReasonDB = [
  LifecycleExitReason.GOAL_MET,
  LifecycleExitReason.UNSUBSCRIBED,
  LifecycleExitReason.SUPPRESSED,
  LifecycleExitReason.INELIGIBLE,
  LifecycleExitReason.SEND_FAILED,
] as const;

export const {
  enum: LifecycleSendStatus,
  options: LifecycleSendStatusOptions,
  Value: LifecycleSendStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.sendStatus.pending",
  SENT: "enums.sendStatus.sent",
});

export const LifecycleSendStatusDB = [
  LifecycleSendStatus.PENDING,
  LifecycleSendStatus.SENT,
] as const;

/** Email templates, one per journey step. */
export const {
  enum: LifecycleTemplate,
  options: LifecycleTemplateOptions,
  Value: LifecycleTemplateValue,
} = createEnumOptions(scopedTranslation, {
  INACTIVE_NUDGE: "enums.template.inactiveNudge",
  INACTIVE_MODELS: "enums.template.inactiveModels",
  INACTIVE_UPGRADE: "enums.template.inactiveUpgrade",
  ENGAGED_VALUE: "enums.template.engagedValue",
  ENGAGED_UPGRADE: "enums.template.engagedUpgrade",
  ENGAGED_LAST: "enums.template.engagedLast",
  INVITE_SIGNUP: "enums.template.inviteSignup",
  INVITE_REMINDER: "enums.template.inviteReminder",
});
