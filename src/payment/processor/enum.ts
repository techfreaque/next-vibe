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
