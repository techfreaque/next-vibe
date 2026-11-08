/**
 * Notification enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * What produced the notification. Drives the icon, the copy template
 * (`templates.<type>`) and the dedupe scope.
 */
export const {
  enum: NotificationType,
  options: NotificationTypeOptions,
  Value: NotificationTypeValue,
} = createEnumOptions(scopedTranslation, {
  TASK_COMPLETE: "enums.type.taskComplete",
  TASK_FAILED: "enums.type.taskFailed",
  EARNING: "enums.type.earning",
  DREAMER_RESULT: "enums.type.dreamerResult",
  CREDIT_LOW: "enums.type.creditLow",
  SYSTEM: "enums.type.system",
});

export const NotificationTypeDB = [
  NotificationType.TASK_COMPLETE,
  NotificationType.TASK_FAILED,
  NotificationType.EARNING,
  NotificationType.DREAMER_RESULT,
  NotificationType.CREDIT_LOW,
  NotificationType.SYSTEM,
] as const;
