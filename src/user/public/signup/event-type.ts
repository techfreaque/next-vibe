import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Dated steps of the signup confirmation flow (signup_events). One row per
 * occurrence; reports count distinct leads per step.
 */
export const {
  enum: SignupEventType,
  options: SignupEventTypeOptions,
  Value: SignupEventTypeValue,
} = createEnumOptions(scopedTranslation, {
  STARTED: "events.started",
  EMAIL_SENT: "events.emailSent",
  SEND_FAILED: "events.sendFailed",
  BOUNCED: "events.bounced",
  EXPIRED: "events.expired",
  CONFIRMED: "events.confirmed",
});

export const SignupEventTypeDB = [
  SignupEventType.STARTED,
  SignupEventType.EMAIL_SENT,
  SignupEventType.SEND_FAILED,
  SignupEventType.BOUNCED,
  SignupEventType.EXPIRED,
  SignupEventType.CONFIRMED,
] as const;
