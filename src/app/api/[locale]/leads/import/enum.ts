/**
 * Import System Enums
 * Defines enums for CSV import operations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * CSV Import Job Status Enum
 * Defines the possible states of a CSV import job
 */
export const {
  enum: CsvImportJobStatus,
  options: CsvImportJobStatusOptions,
  Value: CsvImportJobStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.csvImportJobStatus.pending",
  PROCESSING: "enums.csvImportJobStatus.processing",
  COMPLETED: "enums.csvImportJobStatus.completed",
  FAILED: "enums.csvImportJobStatus.failed",
});

export const {
  enum: CsvImportJobAction,
  options: CsvImportJobActionOptions,
  Value: CsvImportJobActionValue,
} = createEnumOptions(scopedTranslation, {
  RETRY: "enums.csvImportJobAction.retry",
  DELETE: "enums.csvImportJobAction.delete",
  STOP: "enums.csvImportJobAction.stop",
});

/**
 * Import Mode Enum
 * Defines how to handle existing records during import
 */
export const {
  enum: ImportMode,
  options: ImportModeOptions,
  Value: ImportModeValue,
} = createEnumOptions(scopedTranslation, {
  CREATE_ONLY: "enums.importMode.createOnly",
  UPDATE_ONLY: "enums.importMode.updateOnly",
  CREATE_OR_UPDATE: "enums.importMode.createOrUpdate",
  SKIP_DUPLICATES: "enums.importMode.skipDuplicates",
});

/**
 * Import Format Enum
 * Defines supported import file formats
 */
export const {
  enum: ImportFormat,
  options: ImportFormatOptions,
  Value: ImportFormatValue,
} = createEnumOptions(scopedTranslation, {
  CSV: "enums.importFormat.csv",
  TSV: "enums.importFormat.tsv",
  JSON: "enums.importFormat.json",
});

/**
 * Import Processing Type Enum
 * Defines how the import should be processed
 */
export const {
  enum: ImportProcessingType,
  options: ImportProcessingTypeOptions,
  Value: ImportProcessingTypeValue,
} = createEnumOptions(scopedTranslation, {
  IMMEDIATE: "enums.importProcessingType.immediate",
  CHUNKED: "enums.importProcessingType.chunked",
  SCHEDULED: "enums.importProcessingType.scheduled",
});

/**
 * Import Error Type Enum
 * Defines types of errors that can occur during import
 */
export const {
  enum: ImportErrorType,
  options: ImportErrorTypeOptions,
  Value: ImportErrorTypeValue,
} = createEnumOptions(scopedTranslation, {
  VALIDATION_ERROR: "enums.importErrorType.validationError",
  DUPLICATE_EMAIL: "enums.importErrorType.duplicateEmail",
  INVALID_FORMAT: "enums.importErrorType.invalidFormat",
  MISSING_REQUIRED_FIELD: "enums.importErrorType.missingRequiredField",
  PROCESSING_ERROR: "enums.importErrorType.processingError",
  SYSTEM_ERROR: "enums.importErrorType.systemError",
});

/**
 * Batch Processing Status Enum
 * Defines the status of individual batch processing
 */
export const {
  enum: BatchProcessingStatus,
  options: BatchProcessingStatusOptions,
  Value: BatchProcessingStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.batchProcessingStatus.pending",
  PROCESSING: "enums.batchProcessingStatus.processing",
  COMPLETED: "enums.batchProcessingStatus.completed",
  FAILED: "enums.batchProcessingStatus.failed",
  RETRYING: "enums.batchProcessingStatus.retrying",
});

/**
 * Import Priority Enum
 * Defines priority levels for import jobs
 */
export const {
  enum: ImportPriority,
  options: ImportPriorityOptions,
  Value: ImportPriorityValue,
} = createEnumOptions(scopedTranslation, {
  LOW: "enums.importPriority.low",
  NORMAL: "enums.importPriority.normal",
  HIGH: "enums.importPriority.high",
  URGENT: "enums.importPriority.urgent",
});

/**
 * Import Source Enum
 * Defines where the import originated from
 */
export const {
  enum: ImportSource,
  options: ImportSourceOptions,
  Value: ImportSourceValue,
} = createEnumOptions(scopedTranslation, {
  WEB_UPLOAD: "enums.importSource.webUpload",
  API_UPLOAD: "enums.importSource.apiUpload",
  SCHEDULED_IMPORT: "enums.importSource.scheduledImport",
  BULK_OPERATION: "enums.importSource.bulkOperation",
});

/**
 * CSV Delimiter Enum
 * Defines supported CSV delimiters
 */
export const {
  enum: CsvDelimiter,
  options: CsvDelimiterOptions,
  Value: CsvDelimiterValue,
} = createEnumOptions(scopedTranslation, {
  COMMA: "enums.csvDelimiter.comma",
  SEMICOLON: "enums.csvDelimiter.semicolon",
  TAB: "enums.csvDelimiter.tab",
  PIPE: "enums.csvDelimiter.pipe",
});

/**
 * Import Validation Level Enum
 * Defines how strict validation should be
 */
export const {
  enum: ImportValidationLevel,
  options: ImportValidationLevelOptions,
  Value: ImportValidationLevelValue,
} = createEnumOptions(scopedTranslation, {
  STRICT: "enums.importValidationLevel.strict",
  MODERATE: "enums.importValidationLevel.moderate",
  LENIENT: "enums.importValidationLevel.lenient",
});

/**
 * Import Notification Type Enum
 * Defines types of notifications for import completion
 */
export const {
  enum: ImportNotificationType,
  options: ImportNotificationTypeOptions,
  Value: ImportNotificationTypeValue,
} = createEnumOptions(scopedTranslation, {
  EMAIL: "enums.importNotificationType.email",
  IN_APP: "enums.importNotificationType.inApp",
  WEBHOOK: "enums.importNotificationType.webhook",
  NONE: "enums.importNotificationType.none",
});

/**
 * Database Enum Arrays
 * Dedicated arrays for pgEnum usage with translation keys
 * Following established pattern for database compatibility
 */

export const CsvImportJobStatusDB = [
  CsvImportJobStatus.PENDING,
  CsvImportJobStatus.PROCESSING,
  CsvImportJobStatus.COMPLETED,
  CsvImportJobStatus.FAILED,
] as const;

export const CsvImportJobActionDB = [
  CsvImportJobAction.RETRY,
  CsvImportJobAction.DELETE,
  CsvImportJobAction.STOP,
] as const;

export const ImportModeDB = [
  ImportMode.CREATE_ONLY,
  ImportMode.UPDATE_ONLY,
  ImportMode.CREATE_OR_UPDATE,
  ImportMode.SKIP_DUPLICATES,
] as const;

export const ImportFormatDB = [
  ImportFormat.CSV,
  ImportFormat.TSV,
  ImportFormat.JSON,
] as const;

export const ImportProcessingTypeDB = [
  ImportProcessingType.IMMEDIATE,
  ImportProcessingType.CHUNKED,
  ImportProcessingType.SCHEDULED,
] as const;

export const ImportErrorTypeDB = [
  ImportErrorType.VALIDATION_ERROR,
  ImportErrorType.DUPLICATE_EMAIL,
  ImportErrorType.INVALID_FORMAT,
  ImportErrorType.MISSING_REQUIRED_FIELD,
  ImportErrorType.PROCESSING_ERROR,
  ImportErrorType.SYSTEM_ERROR,
] as const;

export const BatchProcessingStatusDB = [
  BatchProcessingStatus.PENDING,
  BatchProcessingStatus.PROCESSING,
  BatchProcessingStatus.COMPLETED,
  BatchProcessingStatus.FAILED,
  BatchProcessingStatus.RETRYING,
] as const;

export const ImportPriorityDB = [
  ImportPriority.LOW,
  ImportPriority.NORMAL,
  ImportPriority.HIGH,
  ImportPriority.URGENT,
] as const;

export const ImportSourceDB = [
  ImportSource.WEB_UPLOAD,
  ImportSource.API_UPLOAD,
  ImportSource.SCHEDULED_IMPORT,
  ImportSource.BULK_OPERATION,
] as const;

export const CsvDelimiterDB = [
  CsvDelimiter.COMMA,
  CsvDelimiter.SEMICOLON,
  CsvDelimiter.TAB,
  CsvDelimiter.PIPE,
] as const;

export const ImportValidationLevelDB = [
  ImportValidationLevel.STRICT,
  ImportValidationLevel.MODERATE,
  ImportValidationLevel.LENIENT,
] as const;

export const ImportNotificationTypeDB = [
  ImportNotificationType.EMAIL,
  ImportNotificationType.IN_APP,
  ImportNotificationType.WEBHOOK,
  ImportNotificationType.NONE,
] as const;
