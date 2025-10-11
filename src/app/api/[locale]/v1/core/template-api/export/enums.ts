/**
 * Template Export Enums
 * Defines enums for template export operations
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Export format enum
 */
export const { enum: ExportFormat, options: ExportFormatOptions } =
  createEnumOptions({
    JSON: "app.api.v1.core.templateApi.export.enums.exportFormat.json",
    CSV: "app.api.v1.core.templateApi.export.enums.exportFormat.csv",
    XML: "app.api.v1.core.templateApi.export.enums.exportFormat.xml",
  });

/**
 * Import mode enum (for future import functionality)
 */
export const { enum: ImportMode, options: ImportModeOptions } =
  createEnumOptions({
    CREATE_ONLY: "app.api.v1.core.templateApi.export.enums.importMode.createOnly",
    UPDATE_ONLY: "app.api.v1.core.templateApi.export.enums.importMode.updateOnly",
    CREATE_OR_UPDATE:
      "app.api.v1.core.templateApi.export.enums.importMode.createOrUpdate",
  });

/**
 * Export status enum
 */
export const { enum: ExportStatus, options: ExportStatusOptions } =
  createEnumOptions({
    PENDING: "app.api.v1.core.templateApi.export.enums.exportStatus.pending",
    PROCESSING: "app.api.v1.core.templateApi.export.enums.exportStatus.processing",
    COMPLETED: "app.api.v1.core.templateApi.export.enums.exportStatus.completed",
    FAILED: "app.api.v1.core.templateApi.export.enums.exportStatus.failed",
  });
