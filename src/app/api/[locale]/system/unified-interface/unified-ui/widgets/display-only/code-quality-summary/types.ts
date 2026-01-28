/**
 * Code Quality Summary Widget Type Definitions
 */

import type { z } from "zod";

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Exact schema for code quality summary data
 */
export type CodeQualitySummarySchema = z.ZodObject<{
  totalIssues: z.ZodNumber;
  totalFiles: z.ZodNumber;
  totalErrors: z.ZodNumber;
  displayedIssues: z.ZodNumber;
  displayedFiles: z.ZodNumber;
  truncatedMessage: z.ZodOptional<z.ZodString>;
  currentPage: z.ZodNumber;
  totalPages: z.ZodNumber;
}>;

/**
 * Code Quality Summary Widget Configuration
 */
export interface CodeQualitySummaryWidgetConfig<
  TSchema extends CodeQualitySummarySchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CODE_QUALITY_SUMMARY;
}
