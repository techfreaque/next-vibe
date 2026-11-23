/**
 * Campaign Queue Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Which campaign emails a lead must have to be listed. Time-based states
 * (sent, opened, ...) use eventFrom/eventTo; queue states use "now".
 */
export const {
  enum: QueueDelivery,
  options: QueueDeliveryOptions,
  Value: QueueDeliveryValue,
} = createEnumOptions(scopedTranslation, {
  DUE_NOW: "enums.delivery.dueNow",
  OVERDUE: "enums.delivery.overdue",
  SCHEDULED: "enums.delivery.scheduled",
  STUCK: "enums.delivery.stuck",
  FAILED: "enums.delivery.failed",
  SENT: "enums.delivery.sent",
  OPENED: "enums.delivery.opened",
  CLICKED: "enums.delivery.clicked",
  UNSUBSCRIBED: "enums.delivery.unsubscribed",
  BOUNCED: "enums.delivery.bounced",
});
