/**
 * Import System Enums
 * User-friendly enum definitions for import operations with UI display options
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * CSV Import Job Status
 * Represents the current state of an import job
 */
export const {
  enum: CsvImportJobStatus,
  options: CsvImportJobStatusOptions,
  Value: CsvImportJobStatusValues,
} = createEnumOptions({
  PENDING: "app.api.import.enum.status.pending.label",
  PROCESSING: "app.api.import.enum.status.processing.label",
  COMPLETED: "app.api.import.enum.status.completed.label",
  FAILED: "app.api.import.enum.status.failed.label",
  CANCELLED: "app.api.import.enum.status.cancelled.label",
  PAUSED: "app.api.import.enum.status.paused.label",
});

/**
 * Database enum array for Drizzle ORM
 */
export const CsvImportJobStatusDB = [
  CsvImportJobStatus.PENDING,
  CsvImportJobStatus.PROCESSING,
  CsvImportJobStatus.COMPLETED,
  CsvImportJobStatus.FAILED,
  CsvImportJobStatus.CANCELLED,
  CsvImportJobStatus.PAUSED,
] as const;

/**
 * Import Domain Types
 * Specifies which domain the import operation targets
 */
export const {
  enum: ImportDomain,
  options: ImportDomainOptions,
  Value: ImportDomainValues,
} = createEnumOptions({
  LEADS: "app.api.import.enum.domain.leads.label",
  CONTACTS: "app.api.import.enum.domain.contacts.label",
  BUSINESS_DATA: "app.api.import.enum.domain.businessData.label",
  EMAILS: "app.api.import.enum.domain.emails.label",
  USERS: "app.api.import.enum.domain.users.label",
  TEMPLATES: "app.api.import.enum.domain.templates.label",
});

/**
 * Database enum array for Drizzle ORM
 */
export const ImportDomainDB = [
  ImportDomain.LEADS,
  ImportDomain.CONTACTS,
  ImportDomain.BUSINESS_DATA,
  ImportDomain.EMAILS,
  ImportDomain.USERS,
  ImportDomain.TEMPLATES,
] as const;

/**
 * Import File Format Types
 * Supported file formats for import operations
 */
export const {
  enum: ImportFileFormat,
  options: ImportFileFormatOptions,
  Value: ImportFileFormatValues,
} = createEnumOptions({
  CSV: "app.api.import.enum.format.csv.label",
  XLSX: "app.api.import.enum.format.xlsx.label",
  JSON: "app.api.import.enum.format.json.label",
  TSV: "app.api.import.enum.format.tsv.label",
});

/**
 * Import Processing Mode
 * How the import should be processed
 */
export const {
  enum: ImportProcessingMode,
  options: ImportProcessingModeOptions,
  Value: ImportProcessingModeValues,
} = createEnumOptions({
  IMMEDIATE: "app.api.import.enum.processing.immediate.label",
  BACKGROUND: "app.api.import.enum.processing.background.label",
  SCHEDULED: "app.api.import.enum.processing.scheduled.label",
});

/**
 * Import Error Types
 * Categories of errors that can occur during import
 */
export const {
  enum: ImportErrorType,
  options: ImportErrorTypeOptions,
  Value: ImportErrorTypeValues,
} = createEnumOptions({
  VALIDATION_ERROR: "app.api.import.enum.errorType.validation.label",
  DUPLICATE_ERROR: "app.api.import.enum.errorType.duplicate.label",
  FORMAT_ERROR: "app.api.import.enum.errorType.format.label",
  PROCESSING_ERROR: "app.api.import.enum.errorType.processing.label",
  SYSTEM_ERROR: "app.api.import.enum.errorType.system.label",
});

/**
 * Batch Size Presets
 * Common batch sizes with descriptions for user guidance
 */
export const {
  enum: BatchSize,
  options: BatchSizeOptions,
  Value: BatchSizeValues,
} = createEnumOptions({
  SMALL: "app.api.import.enum.batchSize.small.label",
  MEDIUM: "app.api.import.enum.batchSize.medium.label",
  LARGE: "app.api.import.enum.batchSize.large.label",
  XLARGE: "app.api.import.enum.batchSize.xlarge.label",
});

// Numeric values for batch sizes
export const BatchSizeNumericValues = {
  [BatchSize.SMALL]: 50,
  [BatchSize.MEDIUM]: 100,
  [BatchSize.LARGE]: 250,
  [BatchSize.XLARGE]: 500,
} as const;

/**
 * Helper functions for enum handling
 */

/**
 * Get display label for CSV Import Job Status
 */
export const getCsvImportJobStatusLabel = (
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus],
): string => {
  const option = CsvImportJobStatusOptions.find((opt) => opt.value === status);
  return option?.label || status;
};

/**
 * Get display label for Import Domain
 */
export const getImportDomainLabel = (
  domain: (typeof ImportDomain)[keyof typeof ImportDomain],
): string => {
  const option = ImportDomainOptions.find((opt) => opt.value === domain);
  return option?.label || domain;
};

/**
 * Check if status indicates job is in progress
 */
export const isJobInProgress = (
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus],
): boolean => {
  const inProgressStatuses = [CsvImportJobStatus.PENDING, CsvImportJobStatus.PROCESSING] as const;
  return (inProgressStatuses as readonly string[]).includes(status);
};

/**
 * Check if status indicates job is complete (success or failure)
 */
export const isJobComplete = (
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus],
): boolean => {
  const completeStatuses = [
    CsvImportJobStatus.COMPLETED,
    CsvImportJobStatus.FAILED,
    CsvImportJobStatus.CANCELLED,
  ] as const;
  return (completeStatuses as readonly string[]).includes(status);
};

/**
 * Get recommended batch size for file size
 */
export const getRecommendedBatchSize = (fileSize: number): number => {
  if (fileSize < 1000) {
    return 50;
  } // Small files
  if (fileSize < 10000) {
    return 100;
  } // Medium files
  if (fileSize < 50000) {
    return 250;
  } // Large files
  return 500; // Very large files
};
