/**
 * Import System Enums
 * User-friendly enum definitions for import operations with UI display options
 */

/**
 * SelectOption interface for UI components
 * Used for dropdown selections, radio buttons, and other option-based inputs
 */
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  disabled?: boolean;
  category?: string;
  accept?: string;
  recommended?: boolean | string;
  limits?: string;
}

/**
 * CSV Import Job Status
 * Represents the current state of an import job
 */
export enum CsvImportJobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  PAUSED = "paused",
}

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
 * UI-optimized options for CSV Import Job Status
 * Human-readable labels with descriptions for better UX
 */
export const CsvImportJobStatusOptions: SelectOption[] = [
  {
    label: "app.api.v1.core.import.enum.status.pending.label",
    value: CsvImportJobStatus.PENDING,
    description: "app.api.v1.core.import.enum.status.pending.description",
    color: "orange",
    icon: "clock",
  },
  {
    label: "app.api.v1.core.import.enum.status.processing.label",
    value: CsvImportJobStatus.PROCESSING,
    description: "app.api.v1.core.import.enum.status.processing.description",
    color: "blue",
    icon: "spinner",
  },
  {
    label: "app.api.v1.core.import.enum.status.completed.label",
    value: CsvImportJobStatus.COMPLETED,
    description: "app.api.v1.core.import.enum.status.completed.description",
    color: "green",
    icon: "check-circle",
  },
  {
    label: "app.api.v1.core.import.enum.status.failed.label",
    value: CsvImportJobStatus.FAILED,
    description: "app.api.v1.core.import.enum.status.failed.description",
    color: "red",
    icon: "x-circle",
  },
  {
    label: "app.api.v1.core.import.enum.status.cancelled.label",
    value: CsvImportJobStatus.CANCELLED,
    description: "app.api.v1.core.import.enum.status.cancelled.description",
    color: "gray",
    icon: "ban",
  },
  {
    label: "app.api.v1.core.import.enum.status.paused.label",
    value: CsvImportJobStatus.PAUSED,
    description: "app.api.v1.core.import.enum.status.paused.description",
    color: "yellow",
    icon: "pause",
  },
];

/**
 * Import Domain Types
 * Specifies which domain the import operation targets
 */
export enum ImportDomain {
  LEADS = "leads",
  CONTACTS = "contacts",
  BUSINESS_DATA = "business-data",
  EMAILS = "emails",
  USERS = "users",
  TEMPLATES = "templates",
}

/**
 * UI-optimized options for Import Domain
 * Clear labels with helpful descriptions for each domain
 */
export const ImportDomainOptions = [
  {
    label: "app.api.v1.core.import.enum.domain.leads.label",
    value: ImportDomain.LEADS,
    description: "app.api.v1.core.import.enum.domain.leads.description",
    icon: "users",
    category: "app.api.v1.core.import.enum.category.customerData",
  },
  {
    label: "app.api.v1.core.import.enum.domain.contacts.label",
    value: ImportDomain.CONTACTS,
    description: "app.api.v1.core.import.enum.domain.contacts.description",
    icon: "contact",
    category: "app.api.v1.core.import.enum.category.customerData",
  },
  {
    label: "app.api.v1.core.import.enum.domain.businessData.label",
    value: ImportDomain.BUSINESS_DATA,
    description: "app.api.v1.core.import.enum.domain.businessData.description",
    icon: "briefcase",
    category: "app.api.v1.core.import.enum.category.businessInformation",
  },
  {
    label: "app.api.v1.core.import.enum.domain.emails.label",
    value: ImportDomain.EMAILS,
    description: "app.api.v1.core.import.enum.domain.emails.description",
    icon: "mail",
    category: "app.api.v1.core.import.enum.category.communication",
  },
  {
    label: "app.api.v1.core.import.enum.domain.users.label",
    value: ImportDomain.USERS,
    description: "app.api.v1.core.import.enum.domain.users.description",
    icon: "user",
    category: "app.api.v1.core.import.enum.category.userManagement",
  },
  {
    label: "app.api.v1.core.import.enum.domain.templates.label",
    value: ImportDomain.TEMPLATES,
    description: "app.api.v1.core.import.enum.domain.templates.description",
    icon: "template",
    category: "app.api.v1.core.import.enum.category.content",
  },
];

/**
 * Import File Format Types
 * Supported file formats for import operations
 */
export enum ImportFileFormat {
  CSV = "csv",
  XLSX = "xlsx",
  JSON = "json",
  TSV = "tsv",
}

/**
 * UI-optimized options for Import File Format
 */
export const ImportFileFormatOptions: SelectOption[] = [
  {
    label: "app.api.v1.core.import.enum.format.csv.label",
    value: ImportFileFormat.CSV,
    description: "app.api.v1.core.import.enum.format.csv.description",
    icon: "file-text",
    accept: ".csv,text/csv",
  },
  {
    label: "app.api.v1.core.import.enum.format.xlsx.label",
    value: ImportFileFormat.XLSX,
    description: "app.api.v1.core.import.enum.format.xlsx.description",
    icon: "file-spreadsheet",
    accept:
      ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  {
    label: "app.api.v1.core.import.enum.format.json.label",
    value: ImportFileFormat.JSON,
    description: "app.api.v1.core.import.enum.format.json.description",
    icon: "file-code",
    accept: ".json,application/json",
  },
  {
    label: "app.api.v1.core.import.enum.format.tsv.label",
    value: ImportFileFormat.TSV,
    description: "app.api.v1.core.import.enum.format.tsv.description",
    icon: "file-text",
    accept: ".tsv,text/tab-separated-values",
  },
];

/**
 * Import Processing Mode
 * How the import should be processed
 */
export enum ImportProcessingMode {
  IMMEDIATE = "immediate",
  BACKGROUND = "background",
  SCHEDULED = "scheduled",
}

/**
 * UI-optimized options for Import Processing Mode
 */
export const ImportProcessingModeOptions: SelectOption[] = [
  {
    label: "app.api.v1.core.import.enum.processing.immediate.label",
    value: ImportProcessingMode.IMMEDIATE,
    description: "app.api.v1.core.import.enum.processing.immediate.description",
    icon: "zap",
    recommended: true,
    limits: "app.api.v1.core.import.enum.processing.immediate.limits",
  },
  {
    label: "app.api.v1.core.import.enum.processing.background.label",
    value: ImportProcessingMode.BACKGROUND,
    description:
      "app.api.v1.core.import.enum.processing.background.description",
    icon: "background",
    limits: "app.api.v1.core.import.enum.processing.background.limits",
  },
  {
    label: "app.api.v1.core.import.enum.processing.scheduled.label",
    value: ImportProcessingMode.SCHEDULED,
    description: "app.api.v1.core.import.enum.processing.scheduled.description",
    icon: "calendar",
    limits: "app.api.v1.core.import.enum.processing.scheduled.limits",
  },
];

/**
 * Import Error Types
 * Categories of errors that can occur during import
 */
export enum ImportErrorType {
  VALIDATION_ERROR = "validation_error",
  DUPLICATE_ERROR = "duplicate_error",
  FORMAT_ERROR = "format_error",
  PROCESSING_ERROR = "processing_error",
  SYSTEM_ERROR = "system_error",
}

/**
 * UI-optimized options for Import Error Type
 */
export const ImportErrorTypeOptions: SelectOption[] = [
  {
    label: "app.api.v1.core.import.enum.errorType.validation.label",
    value: ImportErrorType.VALIDATION_ERROR,
    description: "app.api.v1.core.import.enum.errorType.validation.description",
    color: "orange",
    icon: "alert-triangle",
  },
  {
    label: "app.api.v1.core.import.enum.errorType.duplicate.label",
    value: ImportErrorType.DUPLICATE_ERROR,
    description: "app.api.v1.core.import.enum.errorType.duplicate.description",
    color: "yellow",
    icon: "copy",
  },
  {
    label: "app.api.v1.core.import.enum.errorType.format.label",
    value: ImportErrorType.FORMAT_ERROR,
    description: "app.api.v1.core.import.enum.errorType.format.description",
    color: "red",
    icon: "file-x",
  },
  {
    label: "app.api.v1.core.import.enum.errorType.processing.label",
    value: ImportErrorType.PROCESSING_ERROR,
    description: "app.api.v1.core.import.enum.errorType.processing.description",
    color: "red",
    icon: "cpu",
  },
  {
    label: "app.api.v1.core.import.enum.errorType.system.label",
    value: ImportErrorType.SYSTEM_ERROR,
    description: "app.api.v1.core.import.enum.errorType.system.description",
    color: "red",
    icon: "server",
  },
];

/**
 * Batch Size Presets
 * Common batch sizes with descriptions for user guidance
 */
export const BatchSizePresets: SelectOption[] = [
  {
    label: "app.api.v1.core.import.enum.batchSize.small.label",
    value: "50",
    description: "app.api.v1.core.import.enum.batchSize.small.description",
    recommended: "app.api.v1.core.import.enum.batchSize.small.recommended",
  },
  {
    label: "app.api.v1.core.import.enum.batchSize.medium.label",
    value: "100",
    description: "app.api.v1.core.import.enum.batchSize.medium.description",
    recommended: "app.api.v1.core.import.enum.batchSize.medium.recommended",
  },
  {
    label: "app.api.v1.core.import.enum.batchSize.large.label",
    value: "250",
    description: "app.api.v1.core.import.enum.batchSize.large.description",
    recommended: "app.api.v1.core.import.enum.batchSize.large.recommended",
  },
  {
    label: "app.api.v1.core.import.enum.batchSize.xlarge.label",
    value: "500",
    description: "app.api.v1.core.import.enum.batchSize.xlarge.description",
    recommended: "app.api.v1.core.import.enum.batchSize.xlarge.recommended",
  },
];

/**
 * Helper functions for enum handling
 */

/**
 * Get display label for CSV Import Job Status
 */
export const getCsvImportJobStatusLabel = (
  status: CsvImportJobStatus,
): string => {
  const option = CsvImportJobStatusOptions.find(
    (opt) => opt.value === (status as string),
  );
  return option?.label || status;
};

/**
 * Get display label for Import Domain
 */
export const getImportDomainLabel = (domain: ImportDomain): string => {
  const option = ImportDomainOptions.find(
    (opt) => opt.value === (domain as string),
  );
  return option?.label || domain;
};

/**
 * Get icon for CSV Import Job Status
 */
export const getCsvImportJobStatusIcon = (
  status: CsvImportJobStatus,
): string => {
  const option = CsvImportJobStatusOptions.find(
    (opt) => opt.value === (status as string),
  );
  return option?.icon || "circle";
};

/**
 * Get color for CSV Import Job Status
 */
export const getCsvImportJobStatusColor = (
  status: CsvImportJobStatus,
): string => {
  const option = CsvImportJobStatusOptions.find(
    (opt) => opt.value === (status as string),
  );
  return option?.color || "gray";
};

/**
 * Check if status indicates job is in progress
 */
export const isJobInProgress = (status: CsvImportJobStatus): boolean => {
  return [CsvImportJobStatus.PENDING, CsvImportJobStatus.PROCESSING].includes(
    status,
  );
};

/**
 * Check if status indicates job is complete (success or failure)
 */
export const isJobComplete = (status: CsvImportJobStatus): boolean => {
  return [
    CsvImportJobStatus.COMPLETED,
    CsvImportJobStatus.FAILED,
    CsvImportJobStatus.CANCELLED,
  ].includes(status);
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
