/**
 * Import System Enums
 * Defines enums for CSV import operations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * CSV Import Job Status Enum
 * Defines the possible states of a CSV import job
 */
export const {
  enum: CsvImportJobStatus,
  options: CsvImportJobStatusOptions,
  Value: CsvImportJobStatusValue,
} = createEnumOptions({
  PENDING: "app.api.leads.import.enums.csvImportJobStatus.pending",
  PROCESSING: "app.api.leads.import.enums.csvImportJobStatus.processing",
  COMPLETED: "app.api.leads.import.enums.csvImportJobStatus.completed",
  FAILED: "app.api.leads.import.enums.csvImportJobStatus.failed",
});

export const {
  enum: CsvImportJobAction,
  options: CsvImportJobActionOptions,
  Value: CsvImportJobActionValue,
} = createEnumOptions({
  RETRY: "app.api.leads.import.enums.csvImportJobAction.retry",
  DELETE: "app.api.leads.import.enums.csvImportJobAction.delete",
  STOP: "app.api.leads.import.enums.csvImportJobAction.stop",
});

/**
 * Import Mode Enum
 * Defines how to handle existing records during import
 */
export const {
  enum: ImportMode,
  options: ImportModeOptions,
  Value: ImportModeValue,
} = createEnumOptions({
  CREATE_ONLY: "app.api.leads.import.enums.importMode.createOnly",
  UPDATE_ONLY: "app.api.leads.import.enums.importMode.updateOnly",
  CREATE_OR_UPDATE: "app.api.leads.import.enums.importMode.createOrUpdate",
  SKIP_DUPLICATES: "app.api.leads.import.enums.importMode.skipDuplicates",
});

/**
 * Import Format Enum
 * Defines supported import file formats
 */
export const {
  enum: ImportFormat,
  options: ImportFormatOptions,
  Value: ImportFormatValue,
} = createEnumOptions({
  CSV: "app.api.leads.import.enums.importFormat.csv",
  TSV: "app.api.leads.import.enums.importFormat.tsv",
  JSON: "app.api.leads.import.enums.importFormat.json",
});

/**
 * Import Processing Type Enum
 * Defines how the import should be processed
 */
export const {
  enum: ImportProcessingType,
  options: ImportProcessingTypeOptions,
  Value: ImportProcessingTypeValue,
} = createEnumOptions({
  IMMEDIATE: "app.api.leads.import.enums.importProcessingType.immediate",
  CHUNKED: "app.api.leads.import.enums.importProcessingType.chunked",
  SCHEDULED: "app.api.leads.import.enums.importProcessingType.scheduled",
});

/**
 * Import Error Type Enum
 * Defines types of errors that can occur during import
 */
export const {
  enum: ImportErrorType,
  options: ImportErrorTypeOptions,
  Value: ImportErrorTypeValue,
} = createEnumOptions({
  VALIDATION_ERROR: "app.api.leads.import.enums.importErrorType.validationError",
  DUPLICATE_EMAIL: "app.api.leads.import.enums.importErrorType.duplicateEmail",
  INVALID_FORMAT: "app.api.leads.import.enums.importErrorType.invalidFormat",
  MISSING_REQUIRED_FIELD: "app.api.leads.import.enums.importErrorType.missingRequiredField",
  PROCESSING_ERROR: "app.api.leads.import.enums.importErrorType.processingError",
  SYSTEM_ERROR: "app.api.leads.import.enums.importErrorType.systemError",
});

/**
 * Batch Processing Status Enum
 * Defines the status of individual batch processing
 */
export const {
  enum: BatchProcessingStatus,
  options: BatchProcessingStatusOptions,
  Value: BatchProcessingStatusValue,
} = createEnumOptions({
  PENDING: "app.api.leads.import.enums.batchProcessingStatus.pending",
  PROCESSING: "app.api.leads.import.enums.batchProcessingStatus.processing",
  COMPLETED: "app.api.leads.import.enums.batchProcessingStatus.completed",
  FAILED: "app.api.leads.import.enums.batchProcessingStatus.failed",
  RETRYING: "app.api.leads.import.enums.batchProcessingStatus.retrying",
});

/**
 * Import Priority Enum
 * Defines priority levels for import jobs
 */
export const {
  enum: ImportPriority,
  options: ImportPriorityOptions,
  Value: ImportPriorityValue,
} = createEnumOptions({
  LOW: "app.api.leads.import.enums.importPriority.low",
  NORMAL: "app.api.leads.import.enums.importPriority.normal",
  HIGH: "app.api.leads.import.enums.importPriority.high",
  URGENT: "app.api.leads.import.enums.importPriority.urgent",
});

/**
 * Import Source Enum
 * Defines where the import originated from
 */
export const {
  enum: ImportSource,
  options: ImportSourceOptions,
  Value: ImportSourceValue,
} = createEnumOptions({
  WEB_UPLOAD: "app.api.leads.import.enums.importSource.webUpload",
  API_UPLOAD: "app.api.leads.import.enums.importSource.apiUpload",
  SCHEDULED_IMPORT: "app.api.leads.import.enums.importSource.scheduledImport",
  BULK_OPERATION: "app.api.leads.import.enums.importSource.bulkOperation",
});

/**
 * CSV Delimiter Enum
 * Defines supported CSV delimiters
 */
export const {
  enum: CsvDelimiter,
  options: CsvDelimiterOptions,
  Value: CsvDelimiterValue,
} = createEnumOptions({
  COMMA: "app.api.leads.import.enums.csvDelimiter.comma",
  SEMICOLON: "app.api.leads.import.enums.csvDelimiter.semicolon",
  TAB: "app.api.leads.import.enums.csvDelimiter.tab",
  PIPE: "app.api.leads.import.enums.csvDelimiter.pipe",
});

/**
 * Import Validation Level Enum
 * Defines how strict validation should be
 */
export const {
  enum: ImportValidationLevel,
  options: ImportValidationLevelOptions,
  Value: ImportValidationLevelValue,
} = createEnumOptions({
  STRICT: "app.api.leads.import.enums.importValidationLevel.strict",
  MODERATE: "app.api.leads.import.enums.importValidationLevel.moderate",
  LENIENT: "app.api.leads.import.enums.importValidationLevel.lenient",
});

/**
 * Import Notification Type Enum
 * Defines types of notifications for import completion
 */
export const {
  enum: ImportNotificationType,
  options: ImportNotificationTypeOptions,
  Value: ImportNotificationTypeValue,
} = createEnumOptions({
  EMAIL: "app.api.leads.import.enums.importNotificationType.email",
  IN_APP: "app.api.leads.import.enums.importNotificationType.inApp",
  WEBHOOK: "app.api.leads.import.enums.importNotificationType.webhook",
  NONE: "app.api.leads.import.enums.importNotificationType.none",
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

export const ImportFormatDB = [ImportFormat.CSV, ImportFormat.TSV, ImportFormat.JSON] as const;

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
