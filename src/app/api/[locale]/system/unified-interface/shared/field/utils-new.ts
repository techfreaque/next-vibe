/**
 * Type-Safe Field Utilities (New System)
 *
 * Flat, type-safe field creation functions.
 * Config includes schema directly - no separate parameters.
 *
 * Usage:
 * ```typescript
 * requestField({
 *   type: WidgetType.FORM_FIELD,
 *   fieldType: FieldDataType.EMAIL,
 *   schema: z.string().email(), // ✅ Type-safe! Schema validated based on fieldType
 *   label: "Email"
 * })
 * ```
 */

import type { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../unified-ui/widgets/_shared/types";
import type { CustomWidgetObjectConfig } from "../../unified-ui/widgets/containers/custom/types";
import { WidgetType } from "../types/enums";
import type {
  ArrayWidgetConfig,
  FormFieldWidgetConfig,
  ObjectWidgetConfig,
  RequestResponseWidgetConfig,
} from "../widgets/configs";

/**
 * Scoped translation object type for type inference
 */
interface ScopedTranslationType<TKey extends string> {
  ScopedTranslationKey: TKey;
}

// ============================================================================
// GENERIC FIELD FUNCTIONS (NEW SYSTEM)
// ============================================================================

/**
 * Generic request field creator - works with any field type
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestField<
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    RequestResponseWidgetConfig<
      TranslationKey,
      TSchema,
      { request: "data"; response?: never },
      "primitive"
    >,
    "usage" | "schemaType"
  >,
>(
  config: TConfig,
): TConfig & {
  usage: { request: "data"; response?: never };
  schemaType: "primitive";
} {
  return {
    ...config,
    usage: { request: "data" },
    schemaType: "primitive" as const,
  };
}

/**
 * Generic response field creator - works with any widget type
 * Schema is included in the config for type safety
 * Accepts all widgets - type safety is enforced by individual widget configs
 */
export function responseField<
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    RequestResponseWidgetConfig<
      TranslationKey,
      TSchema,
      { response: true },
      "primitive"
    >,
    "usage" | "schemaType"
  >,
>(
  config: TConfig,
): TConfig & {
  usage: { request?: never; response: true };
  schemaType: "primitive";
} {
  return {
    ...config,
    usage: { response: true },
    schemaType: "primitive" as const,
  };
}

/**
 * Generic request+response field creator - works with any widget type
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestResponseField<
  TSchema extends z.ZodTypeAny,
  TConfig extends Omit<
    FormFieldWidgetConfig<TranslationKey, TSchema, { request: "data" }>,
    "usage" | "schemaType"
  >,
>(
  config: TConfig,
): TConfig & {
  usage: { request: "data"; response: true };
  schemaType: "primitive";
} {
  return {
    ...config,
    usage: { request: "data", response: true },
    schemaType: "primitive" as const,
  };
}

/**
 * Generic request URL path params field creator
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestUrlPathParamsField<
  TSchema extends z.ZodTypeAny,
  TConfig extends Omit<
    FormFieldWidgetConfig<
      TranslationKey,
      TSchema,
      { request: "urlPathParams"; response?: never }
    >,
    "usage" | "schemaType"
  >,
>(
  config: TConfig,
): TConfig & {
  usage: { request: "urlPathParams"; response?: never };
  schemaType: "primitive";
} {
  return {
    ...config,
    usage: { request: "urlPathParams" },
    schemaType: "primitive" as const,
  };
}

/**
 * Generic request URL path params + response field creator
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestUrlPathParamsResponseField<
  TSchema extends z.ZodTypeAny,
  TConfig extends Omit<
    FormFieldWidgetConfig<
      TranslationKey,
      TSchema,
      { request: "urlPathParams" }
    >,
    "usage" | "schemaType"
  >,
>(
  config: TConfig,
): TConfig & {
  usage: { request: "urlPathParams"; response: true };
  schemaType: "primitive";
} {
  return {
    ...config,
    usage: { request: "urlPathParams", response: true },
    schemaType: "primitive" as const,
  };
}

// ============================================================================
// SCOPED FIELD FUNCTIONS (For scoped translations)
// ============================================================================

/**
 * Scoped request field creator
 * Used with scoped translations for type-safe translation keys
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function scopedRequestField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  TConfig extends Omit<
    FormFieldWidgetConfig<
      string,
      TSchema,
      { request: "data"; response?: never }
    >,
    "usage" | "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request: "data"; response?: never };
  schemaType: "primitive";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { request: "data" },
    schemaType: "primitive" as const,
  };
}

/**
 * Scoped response field creator
 * Used with scoped translations for type-safe translation keys
 * Accepts all widgets - type safety is enforced by individual widget configs
 */
export function scopedResponseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  TConfig extends Omit<
    RequestResponseWidgetConfig<
      string,
      TSchema,
      { request?: never; response: true },
      "primitive"
    >,
    "usage" | "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request?: never; response: true };
  schemaType: "primitive";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { response: true },
    schemaType: "primitive" as const,
  };
}

/**
 * Scoped object field creator
 * Creates object fields with scoped translation keys
 */
export function scopedObjectField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends Omit<
    ObjectWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "object",
      TChildren
    >,
    "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
): TUIConfig & {
  schemaType: "object";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...ui,
    schemaType: "object" as const,
  };
}

/**
 * Scoped response array optional field creator (NEW FLAT API)
 * Creates optional array fields with scoped translation keys
 * Config includes usage and child directly
 */
export function scopedResponseArrayOptionalField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  TConfig extends Omit<
    ArrayWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      { request?: never; response: true },
      "array-optional",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request?: never; response: true };
  schemaType: "array-optional";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { response: true },
    schemaType: "array-optional" as const,
  };
}

// ============================================================================
// OBJECT FIELD FUNCTIONS (NEW SYSTEM - Fully Typed)
// ============================================================================

/**
 * Type-safe object field creator with child constraints (NEW FLAT API)
 *
 * This is the new version where the config includes everything (usage + children),
 * similar to how primitive fields include schema in their config.
 *
 * Each ObjectWidgetConfig variant can specify what children it expects, and the value type is fully
 * inferred from the children (similar to how primitive fields work with schemas).
 *
 * Key differences from old objectField:
 * - Flat API: single config parameter includes usage and children
 * - Widget configs can enforce child field names and types via their own type definitions
 * - Value type is inferred from children, not WidgetData (any)
 * - Full type safety from config -> children -> value
 *
 */
export function objectFieldNew<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  const TConfig extends Omit<
    ObjectWidgetConfig<
      TKey,
      TUsage,
      "object",
      ObjectChildrenConstraint<TKey, FieldUsageConfig>
    >,
    "schemaType"
  >,
>(config: TConfig): TConfig & { schemaType: "object" } {
  return {
    ...config,
    schemaType: "object" as const,
  };
}

/**
 * Custom widget field creator - wraps children with custom render component
 */
export function customWidgetObject<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  const TConfig extends Omit<
    CustomWidgetObjectConfig<
      TKey,
      TUsage,
      "object",
      ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    >,
    "schemaType" | "type"
  >,
>(
  config: TConfig,
): TConfig & {
  type: WidgetType.CUSTOM_WIDGET;
  schemaType: "object";
} {
  return {
    ...config,
    type: WidgetType.CUSTOM_WIDGET,
    schemaType: "object" as const,
  };
}

export {
  backButton,
  deleteButton,
  navigateButtonField,
  objectField,
  objectOptionalField,
  objectUnionField,
  requestDataArrayField,
  requestDataArrayOptionalField,
  requestDataRangeField,
  responseArrayField,
  responseArrayOptionalField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "./utils";
