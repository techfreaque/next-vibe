/**
 * Metadata Widget Types
 * Displays very small, muted supplementary text for timestamps and metadata
 */

import type { z } from "zod";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

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
  TSchemaType extends "primitive",
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.METADATA;

  /** Title for the metadata section */
  title?: TKey;

  /** Schema constraint for the field value */
  schema: TSchema;
}
