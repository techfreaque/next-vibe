/**
 * Code Quality Files Widget Type Definitions
 */

import type { z } from "zod";

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Exact schema for code quality files data (array of file summaries)
 * Both errors and warnings are required fields (always present, may be 0)
 */
export type CodeQualityFilesSchema = z.ZodArray<
  z.ZodObject<{
    file: z.ZodString;
    errors: z.ZodNumber;
    warnings: z.ZodNumber;
    total: z.ZodNumber;
  }>
>;

/**
 * Code Quality Files Widget Configuration
 */
export interface CodeQualityFilesWidgetConfig<
  TSchema extends
    | CodeQualityFilesSchema
    | z.ZodOptional<CodeQualityFilesSchema>,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CODE_QUALITY_FILES;
}
