import { createEnumOptions } from "../../../unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

/**
 * Task Operation Types
 */
export const { enum: TaskOperationType, options: TaskOperationTypeOptions } =
  createEnumOptions(scopedTranslation, {
    RUN_SAFETY_CHECK: "operations.runSafetyCheck",
    START_AUTO_RESET: "operations.startAutoReset",
    START_BACKUP_VERIFICATION: "operations.startBackupVerification",
    STOP_AUTO_RESET: "operations.stopAutoReset",
    STOP_BACKUP_VERIFICATION: "operations.stopBackupVerification",
    GET_STATUS: "operations.getStatus",
    LIST_TASKS: "operations.listTasks",
  } as const);

/**
 * Task Priority Types
 */
export const { enum: TaskPriority, options: TaskPriorityOptions } =
  createEnumOptions(scopedTranslation, {
    LOW: "priority.low",
    MEDIUM: "priority.medium",
    HIGH: "priority.high",
  } as const);
