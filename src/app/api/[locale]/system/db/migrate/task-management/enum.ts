import { createEnumOptions } from "../../../unified-interface/shared/field/enum";
import { scopedTranslation } from "./i18n";

/**
 * Migration Task Operation Types
 */
export const {
  enum: MigrationTaskOperationType,
  options: MigrationTaskOperationTypeOptions,
} = createEnumOptions(scopedTranslation, {
  RUN_HEALTH_CHECK: "operations.runHealthCheck",
  START_AUTO_MIGRATION: "operations.startAutoMigration",
  START_BACKUP_MONITOR: "operations.startBackupMonitor",
  STOP_AUTO_MIGRATION: "operations.stopAutoMigration",
  STOP_BACKUP_MONITOR: "operations.stopBackupMonitor",
  GET_MIGRATION_STATUS: "operations.getMigrationStatus",
  LIST_MIGRATION_TASKS: "operations.listMigrationTasks",
} as const);

/**
 * Migration Task Priority Types
 */
export const {
  enum: MigrationTaskPriority,
  options: MigrationTaskPriorityOptions,
} = createEnumOptions(scopedTranslation, {
  LOW: "priority.low",
  MEDIUM: "priority.medium",
  HIGH: "priority.high",
} as const);
