/**
 * Pagination Widget Type Definitions
 */

import z from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { SpacingSize } from "../../../../shared/types/enums";
import { FieldDataType, WidgetType } from "../../../../shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";
import type { TextWidgetConfig } from "../../display-only/text/types";
import type { NumberFieldWidgetConfig } from "../../form-fields/number-field/types";

export function paginationField(config?: {
  order?: number;
}): PaginationWidgetConfig {
  return {
    type: WidgetType.PAGINATION,
    schemaType: "object" as const,
    order: config?.order,
    usage: { request: "data", response: true },
    children: {
      page: {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        schema: pageSchema,
        usage: { request: "data" },
        schemaType: "primitive" as const,
      },
      limit: {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        schema: limitSchema,
        usage: { request: "data" },
        schemaType: "primitive" as const,
      },
      totalCount: {
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.credits.history.get.paginationInfo.total" as const,
        schema: totalCountSchema,
        usage: { response: true },
        schemaType: "primitive" as const,
      },
      pageCount: {
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.credits.history.get.paginationInfo.totalPages" as const,
        schema: pageCountSchema,
        usage: { response: true },
        schemaType: "primitive" as const,
      },
    },
  };
}

const pageSchema = z.coerce.number().optional().default(1);
const limitSchema = z.coerce.number().optional().default(50);
const totalCountSchema = z.coerce.number();
const pageCountSchema = z.coerce.number();

/**
 * Pagination Widget Config
 *
 * Enforces that pagination must have specific fields with correct types.
 * This enables full type safety from config -> children -> field.value.
 *
 * Required children:
 * - page: Current page number
 * - limit: Items per page
 * - totalCount: Total number of items
 *
 * Optional children:
 * - pageCount: Total number of pages
 * - offset: Current offset
 */
export interface PaginationWidgetConfig<
  TUsage extends FieldUsageConfig = { request: "data"; response: true },
> extends BaseObjectWidgetConfig<
  TranslationKey,
  TUsage,
  "object",
  {
    page: NumberFieldWidgetConfig<
      TranslationKey,
      typeof pageSchema,
      { request: "data"; response?: never }
    >;
    limit: NumberFieldWidgetConfig<
      TranslationKey,
      typeof limitSchema,
      { request: "data"; response?: never }
    >;
    totalCount: TextWidgetConfig<
      TranslationKey,
      typeof totalCountSchema,
      { request?: undefined; response: true },
      "primitive"
    >;
    pageCount: TextWidgetConfig<
      TranslationKey,
      typeof pageCountSchema,
      { request?: undefined; response: true },
      "primitive"
    >;
  }
> {
  type: WidgetType.PAGINATION;
  /** Top border */
  showBorder?: boolean;
  /** Container padding */
  padding?: SpacingSize;
  /** Container margin */
  margin?: SpacingSize;
  /** Gap between info and controls */
  controlsGap?: SpacingSize;
  /** Gap between elements */
  elementGap?: SpacingSize;
  /** Text size */
  textSize?: "xs" | "sm" | "base";
  /** Select width */
  selectWidth?: "sm" | "base" | "lg";
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
}
