import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: SignupBounceReason,
  options: SignupBounceReasonOptions,
  Value: SignupBounceReasonValue,
} = createEnumOptions(scopedTranslation, {
  POLICY: "confirmation.bouncePolicy",
  MAILBOX_MISSING: "confirmation.bounceMailboxMissing",
  MAILBOX_FULL: "confirmation.bounceMailboxFull",
  OTHER: "confirmation.bounce",
});

export const SignupBounceReasonDB = [
  SignupBounceReason.POLICY,
  SignupBounceReason.MAILBOX_MISSING,
  SignupBounceReason.MAILBOX_FULL,
  SignupBounceReason.OTHER,
] as const;
