import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./search/i18n";

export const {
  enum: AlarmStatus,
  options: AlarmStatusOptions,
  Value: AlarmStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "post.enums.alarmStatus.active" as const,
  NOT_ACTIVE: "post.enums.alarmStatus.notActive" as const,
});

export const {
  enum: AlarmAction,
  options: AlarmActionOptions,
  Value: AlarmActionValue,
} = createEnumOptions(scopedTranslation, {
  ACK: "post.enums.alarmAction.ack" as const,
  NO_ACK: "post.enums.alarmAction.noAck" as const,
});

export const {
  enum: AlarmActionType,
  options: AlarmActionTypeOptions,
  Value: AlarmActionTypeValue,
} = createEnumOptions(scopedTranslation, {
  ACK: "post.enums.alarmActionType.ack" as const,
  RESET: "post.enums.alarmActionType.reset" as const,
  CLEAR: "post.enums.alarmActionType.clear" as const,
});

export const {
  enum: BulkAlarmActionType,
  options: BulkAlarmActionTypeOptions,
  Value: BulkAlarmActionTypeValue,
} = createEnumOptions(scopedTranslation, {
  ACK_ALL: "post.enums.bulkAlarmActionType.ackAll" as const,
  RESET_ALL: "post.enums.bulkAlarmActionType.resetAll" as const,
  CLEAR_ALL: "post.enums.bulkAlarmActionType.clearAll" as const,
});

export const {
  enum: AlarmOrderBy,
  options: AlarmOrderByOptions,
  Value: AlarmOrderByValue,
} = createEnumOptions(scopedTranslation, {
  EVENT_TIMESTAMP: "post.enums.alarmOrderBy.eventTimestamp" as const,
  UPDATED_AT: "post.enums.alarmOrderBy.updatedAt" as const,
  SEVERITY: "post.enums.alarmOrderBy.severity" as const,
});

export const {
  enum: AlarmOrderDir,
  options: AlarmOrderDirOptions,
  Value: AlarmOrderDirValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "post.enums.alarmOrderDir.asc" as const,
  DESC: "post.enums.alarmOrderDir.desc" as const,
});
