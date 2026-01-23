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
  ArrayOptionalField,
  FieldUsageConfig,
  ObjectField,
  PrimitiveField,
  UnifiedField,
} from "../types/endpoint";
import type {
  ArrayWidgetConfig,
  FormFieldWidgetConfig,
  ObjectWidgetConfig,
  ResponseWidgetConfig,
} from "../widgets/configs";


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
  TConfig extends FormFieldWidgetConfig<string, z.ZodTypeAny> =
    FormFieldWidgetConfig<TranslationKey, TSchema>,
>(
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { request: "data" },
  TranslationKey,
  TConfig
> {
  return {
    type: "primitive",
    schema: config.schema,
    usage: { request: "data" },
    ui: config,
  };
}

/**
 * Generic response field creator - works with any widget type
 * Schema is included in the config for type safety
 * Accepts all widgets - type safety is enforced by individual widget configs
 */
export function responseField<
  TSchema extends z.ZodTypeAny,
  TConfig extends ResponseWidgetConfig<string, z.ZodTypeAny> =
    ResponseWidgetConfig<TranslationKey, TSchema>,
>(
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { response: true },
  TranslationKey,
  TConfig
> {
  return {
    type: "primitive",
    schema: config.schema,
    usage: { response: true },
    ui: config,
  };
}

/**
 * Generic request+response field creator - works with any widget type
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestResponseField<
  TSchema extends z.ZodTypeAny,
  TConfig extends FormFieldWidgetConfig<string, z.ZodTypeAny> =
    FormFieldWidgetConfig<TranslationKey, TSchema>,
>(
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { request: "data"; response: true },
  TranslationKey,
  TConfig
> {
  return {
    type: "primitive",
    schema: config.schema,
    usage: { request: "data", response: true },
    ui: config,
  };
}

/**
 * Generic request URL path params field creator
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestUrlPathParamsField<
  TSchema extends z.ZodTypeAny,
  TConfig extends FormFieldWidgetConfig<string, z.ZodTypeAny> =
    FormFieldWidgetConfig<TranslationKey, TSchema>,
>(
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { request: "urlPathParams" },
  TranslationKey,
  TConfig
> {
  return {
    type: "primitive",
    schema: config.schema,
    usage: { request: "urlPathParams" },
    ui: config,
  };
}

/**
 * Generic request URL path params + response field creator
 * Schema is included in the config for type safety
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestUrlPathParamsResponseField<
  TSchema extends z.ZodTypeAny,
  TConfig extends FormFieldWidgetConfig<string, z.ZodTypeAny> =
    FormFieldWidgetConfig<TranslationKey, TSchema>,
>(
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { request: "urlPathParams"; response: true },
  TranslationKey,
  TConfig
> {
  return {
    type: "primitive",
    schema: config.schema,
    usage: { request: "urlPathParams", response: true },
    ui: config,
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
  TConfig extends FormFieldWidgetConfig<string, z.ZodTypeAny> =
    FormFieldWidgetConfig<TScopedTranslation["ScopedTranslationKey"], TSchema>,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { request: "data" },
  TScopedTranslation["ScopedTranslationKey"],
  TConfig
> {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    type: "primitive",
    schema: config.schema,
    usage: { request: "data" },
    ui: config,
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
  TConfig extends ResponseWidgetConfig<string, z.ZodTypeAny> =
    ResponseWidgetConfig<TScopedTranslation["ScopedTranslationKey"], TSchema>,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): PrimitiveField<
  TConfig["schema"],
  { response: true },
  TScopedTranslation["ScopedTranslationKey"],
  TConfig
> {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    type: "primitive",
    schema: config.schema,
    usage: { response: true },
    ui: config,
  };
}

/**
 * Scoped object field creator
 * Creates object fields with scoped translation keys
 */
export function scopedObjectField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TUsage extends FieldUsageConfig,
  TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>> = Record<
    string,
    UnifiedField<TScopedTranslation["ScopedTranslationKey"], TSchema>
  >,
  const TUIConfig extends ObjectWidgetConfig<string, TUsage, TChildren> =
    ObjectWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      TChildren
    >,
>(
  scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  usage: TUsage,
  children: TChildren,
): ObjectField<
  TChildren,
  TUsage,
  TScopedTranslation["ScopedTranslationKey"],
  TUIConfig
> {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    type: "object" as const,
    children,
    usage,
    ui,
  };
}

/**
 * Scoped response array optional field creator
 * Creates optional array fields with scoped translation keys
 */
export function scopedResponseArrayOptionalField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  TChild extends UnifiedField<string, z.ZodTypeAny> = UnifiedField<
    TScopedTranslation["ScopedTranslationKey"],
    TSchema
  >,
  const TUIConfig extends ArrayWidgetConfig<
    string,
    { response: true },
    TChild
  > = ArrayWidgetConfig<
    TScopedTranslation["ScopedTranslationKey"],
    { response: true },
    TChild
  >,
>(
  scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  child: TChild,
): ArrayOptionalField<
  TChild,
  { response: true },
  TScopedTranslation["ScopedTranslationKey"],
  TSchema,
  TUIConfig
> {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    type: "array-optional" as const,
    child,
    usage: { response: true },
    ui,
  };
}
