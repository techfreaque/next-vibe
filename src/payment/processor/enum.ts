import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: ProcessorView,
  options: ProcessorViewOptions,
  Value: ProcessorViewValue,
} = createEnumOptions(scopedTranslation, {
  TRANSACTIONS: "enums.view.transactions",
  WEBHOOKS: "enums.view.webhooks",
});

export const {
  enum: WebhookProcessing,
  options: WebhookProcessingOptions,
  Value: WebhookProcessingValue,
} = createEnumOptions(scopedTranslation, {
  PROCESSED: "enums.processing.processed",
  UNPROCESSED: "enums.processing.unprocessed",
});

/**
 * What a transaction paid for. Same keys as the revenue report's kinds so a
 * drill from the report lands on the same rows: pack = one-time checkout,
 * renewal = recurring invoice, new subscription = first subscription payment.
 */
export const {
  enum: ProcessorKind,
  options: ProcessorKindOptions,
  Value: ProcessorKindValue,
} = createEnumOptions(scopedTranslation, {
  PACK: "enums.kind.pack",
  SUBSCRIPTION: "enums.kind.subscription",
  NEW_SUBSCRIPTION: "enums.kind.newSubscription",
  RENEWAL: "enums.kind.renewal",
});

/** Why a settled payment cannot start a refund review here. */
export const {
  enum: RefundBlock,
  options: RefundBlockOptions,
  Value: RefundBlockValue,
} = createEnumOptions(scopedTranslation, {
  NOT_STRIPE: "enums.refundBlock.notStripe",
  NO_REFERENCE: "enums.refundBlock.noReference",
  ZERO_AMOUNT: "enums.refundBlock.zeroAmount",
  SETUP: "enums.refundBlock.setup",
});
