/**
 * Metadata Widget Types
 * Displays very small, muted supplementary text for timestamps and metadata
 */

import type { WidgetType } from "../../../../core/definition/enums";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";
import type { z } from "zod";

/**
 * Metadata widget schema - must be a string
 */
export type MetadataWidgetSchema =
  | StringWidgetSchema
  | z.ZodType<Record<string, string | number>>;

/**
 * Metadata Widget Configuration
 * Displays very small, muted text for metadata, timestamps, or secondary info
 */
export interface MetadataWidgetConfig<
  out TKey extends string,
  TSchema extends MetadataWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.METADATA;

  /** Title for the metadata section */
  title?: TKey;

  /** Schema constraint for the field value */
  schema: TSchema;
}
