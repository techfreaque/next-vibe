/**
 * Template Import Enums
 * Defines enums for template import operations
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Import format enum
 */
export const {
  enum: ImportFormat,
  options: ImportFormatOptions,
  Value: ImportFormatValue,
} = createEnumOptions({
  CSV: "app.api.v1.core.templateApi.import.enums.importFormat.csv",
  JSON: "app.api.v1.core.templateApi.import.enums.importFormat.json",
  XML: "app.api.v1.core.templateApi.import.enums.importFormat.xml",
});

/**
 * Import mode enum
 */
export const {
  enum: ImportMode,
  options: ImportModeOptions,
  Value: ImportModeValue,
} = createEnumOptions({
  CREATE_ONLY: "app.api.v1.core.templateApi.import.enums.importMode.createOnly",
  UPDATE_ONLY: "app.api.v1.core.templateApi.import.enums.importMode.updateOnly",
  CREATE_OR_UPDATE:
    "app.api.v1.core.templateApi.import.enums.importMode.createOrUpdate",
});

/**
 * Import status enum
 */
export const {
  enum: ImportStatus,
  options: ImportStatusOptions,
  Value: ImportStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.templateApi.import.enums.importStatus.pending",
  PROCESSING: "app.api.v1.core.templateApi.import.enums.importStatus.processing",
  COMPLETED: "app.api.v1.core.templateApi.import.enums.importStatus.completed",
  FAILED: "app.api.v1.core.templateApi.import.enums.importStatus.failed",
});
