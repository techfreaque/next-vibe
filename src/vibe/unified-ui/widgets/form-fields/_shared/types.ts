/**
 * Shared types for form field widgets
 */

import type { WidgetType } from "../../../../core/definition/enums";
import type { RequiredFieldTheme } from "../../../_shared/field-config-types";
import type {
  BasePrimitiveWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";
import type { IconKey } from "../icon-field/icons";
import type { z } from "zod";

/**
 * Common properties for form field widgets
 * TKey allows scoped translation keys
 * TKey is inferred from label/description values, then validated against expected type
 */
export interface BaseFormFieldWidgetConfig<
  out TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive",
  TSchema extends z.ZodTypeAny,
> extends BasePrimitiveWidgetConfig<TUsage, TSchemaType, TSchema> {
  type: WidgetType.FORM_FIELD;
  label?: NoInfer<TKey>;
  description?: NoInfer<TKey>;
  placeholder?: NoInfer<TKey>;
  helpText?: NoInfer<TKey>;
  required?: boolean;
  disabled?: boolean;
  columns?: number;
  /**
   * Make field readonly - displays value but cannot be edited
   * Use with prefillDisplay to show special styling for server-provided values
   */
  readonly?: boolean;
  /**
   * Configure how prefilled values are displayed when readonly
   * Only applies when field has a prefilled value
   */
  prefillDisplay?: PrefillDisplayConfig<TKey>;
  /**
   * Theme for required field styling
   */
  theme?: Partial<RequiredFieldTheme>;
  /**
   * Include this field's value in the React Query cache key.
   * Use for GET request fields that scope the response (e.g. subFolderId, page).
   * Defaults to false. When true, different values produce separate cache entries.
   */
  includeInCacheKey?: boolean;
  /**
   * Input size variant. Defaults to "default" (h-10).
   * "sm" renders a compact input, "lg" renders a larger input suitable for prominent search bars.
   */
  size?: "sm" | "default" | "lg";
}

/**
 * Prefill display configuration for form fields
 * When a field has a prefilled value from server/URL params, this controls how it's displayed
 */
export interface PrefillDisplayConfig<TKey extends string> {
  /** Display variant when field is prefilled */
  variant: "badge" | "highlight" | "card";
  /** Translation key for the label shown with prefilled value */
  labelKey?: NoInfer<TKey>;
  /** Icon to show with prefilled value */
  icon?: IconKey;
}
