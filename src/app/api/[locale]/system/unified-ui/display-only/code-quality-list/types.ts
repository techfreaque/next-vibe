/**
 * Code Quality List Widget Type Definitions
 */

import type { WidgetType } from "next-vibe/core/definition/enums";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "next-vibe/unified-ui/_shared/types";
import type { z } from "zod";

/**
 * Exact schema for code quality list data (array of issue objects)
 */
export type CodeQualityListSchema = z.ZodArray<
  z.ZodObject<{
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
    rule: z.ZodOptional<z.ZodString>;
    severity: z.ZodUnion<
      [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"info">]
    >;
    message: z.ZodString;
  }>
>;

/**
 * Code Quality List Widget Configuration
 */
export interface CodeQualityListWidgetConfig<
  TSchema extends CodeQualityListSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.CODE_QUALITY_LIST;
  /**
   * Field key to look up the editor URI scheme from response data
   * If not provided, defaults to "vscode://file/"
   */
  editorUriSchemaFieldKey?: string;
}
