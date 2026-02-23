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
import type {
  CustomWidgetObjectConfig,
  CustomWidgetPrimitiveConfig,
} from "../../unified-ui/widgets/containers/custom/types";
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
  const TConfig extends Omit<
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
  const TConfig extends Omit<
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
  const TConfig extends Omit<
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
  const TConfig extends Omit<
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
  const TConfig extends Omit<
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
 * Scoped request+response field creator for scoped translations
 */
export function scopedRequestResponseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    FormFieldWidgetConfig<string, TSchema, { request: "data" }>,
    "usage" | "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request: "data"; response: true };
  schemaType: "primitive";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { request: "data", response: true },
    schemaType: "primitive" as const,
  };
}

/**
 * Scoped request URL path params field creator for scoped translations
 */
export function scopedRequestUrlPathParamsField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    FormFieldWidgetConfig<
      string,
      TSchema,
      { request: "urlPathParams"; response?: never }
    >,
    "usage" | "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request: "urlPathParams"; response?: never };
  schemaType: "primitive";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { request: "urlPathParams" },
    schemaType: "primitive" as const,
  };
}

/**
 * Scoped request URL path params + response field creator for scoped translations
 */
export function scopedRequestUrlPathParamsResponseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    FormFieldWidgetConfig<string, TSchema, { request: "urlPathParams" }>,
    "usage" | "schemaType"
  >,
>(
  scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  usage: { request: "urlPathParams"; response: true };
  schemaType: "primitive";
} {
  // scopedTranslation is only used for type inference
  void scopedTranslation;
  return {
    ...config,
    usage: { request: "urlPathParams", response: true },
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
  const TConfig extends Omit<
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
 * Single config param includes usage + children — the preferred new pattern.
 * Use scopedObjectFieldNew for scoped translations.
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
 * Scoped object field creator (NEW FLAT API)
 * Single config param includes usage + children. First param is scopedTranslation for type inference.
 */
export function scopedObjectFieldNew<
  TScopedTranslation extends ScopedTranslationType<string>,
  TUsage extends FieldUsageConfig,
  const TConfig extends Omit<
    ObjectWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "object",
      ObjectChildrenConstraint<
        TScopedTranslation["ScopedTranslationKey"],
        FieldUsageConfig
      >
    >,
    "schemaType"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & { schemaType: "object" } {
  return {
    ...config,
    schemaType: "object" as const,
  };
}

/**
 * Response array field (NEW FLAT API)
 * Single config param includes child. Usage is fixed to response-only.
 */
export function responseArrayFieldNew<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request?: never; response: true },
      "array",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  config: TConfig,
): TConfig & {
  schemaType: "array";
  usage: { request?: never; response: true };
} {
  return {
    ...config,
    schemaType: "array" as const,
    usage: { response: true },
  };
}

/**
 * Scoped response array field (NEW FLAT API)
 */
export function scopedResponseArrayFieldNew<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      { request?: never; response: true },
      "array",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  schemaType: "array";
  usage: { request?: never; response: true };
} {
  return {
    ...config,
    schemaType: "array" as const,
    usage: { response: true },
  };
}

/**
 * Request data array field (NEW FLAT API)
 * Single config param includes child. Usage is fixed to request-data-only.
 */
export function requestDataArrayFieldNew<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request: "data"; response?: never },
      "array",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  config: TConfig,
): TConfig & {
  schemaType: "array";
  usage: { request: "data"; response?: never };
} {
  return {
    ...config,
    schemaType: "array" as const,
    usage: { request: "data" },
  };
}

/**
 * Scoped request data array field (NEW FLAT API)
 */
export function scopedRequestDataArrayFieldNew<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      { request: "data"; response?: never },
      "array",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  schemaType: "array";
  usage: { request: "data"; response?: never };
} {
  return {
    ...config,
    schemaType: "array" as const,
    usage: { request: "data" },
  };
}

/**
 * Response array optional field (NEW FLAT API)
 */
export function responseArrayOptionalFieldNew<
  TKey extends string,
  TChild extends ArrayChildConstraint<
    TKey,
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TKey,
      { request?: never; response: true },
      "array-optional",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  config: TConfig,
): TConfig & {
  schemaType: "array-optional";
  usage: { request?: never; response: true };
} {
  return {
    ...config,
    schemaType: "array-optional" as const,
    usage: { response: true },
  };
}

/**
 * Scoped response array optional field (NEW FLAT API)
 */
export function scopedResponseArrayOptionalFieldNew<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    TScopedTranslation["ScopedTranslationKey"],
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends Omit<
    ArrayWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      { request?: never; response: true },
      "array-optional",
      TChild
    >,
    "schemaType" | "usage"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  schemaType: "array-optional";
  usage: { request?: never; response: true };
} {
  return {
    ...config,
    schemaType: "array-optional" as const,
    usage: { response: true },
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

export function customResponseField<
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    CustomWidgetPrimitiveConfig<
      { request?: never; response: true },
      "primitive",
      TSchema
    >,
    "schemaType" | "type" | "usage"
  >,
>(
  config: TConfig,
): TConfig & {
  type: WidgetType.CUSTOM_WIDGET;
  schemaType: "primitive";
  usage: { request?: never; response: true };
} {
  return {
    ...config,
    type: WidgetType.CUSTOM_WIDGET,
    usage: { response: true },
    schemaType: "primitive" as const,
  };
}

export function customRequestField<
  TSchema extends z.ZodTypeAny,
  const TConfig extends Omit<
    CustomWidgetPrimitiveConfig<
      { request: "data"; response?: never },
      "primitive",
      TSchema
    >,
    "schemaType" | "type" | "usage"
  >,
>(
  config: TConfig,
): TConfig & {
  type: WidgetType.CUSTOM_WIDGET;
  schemaType: "primitive";
  usage: { request: "data"; response?: never };
} {
  return {
    ...config,
    type: WidgetType.CUSTOM_WIDGET,
    usage: { request: "data" },
    schemaType: "primitive" as const,
  };
}

export {
  arrayField,
  arrayOptionalField,
  backButton,
  deleteButton,
  editButton,
  navigateButtonField,
  objectField,
  objectOptionalField,
  objectUnionField,
  requestDataArrayField,
  requestDataArrayOptionalField,
  requestDataRangeField,
  responseArrayField,
  responseArrayOptionalField,
  scopedArrayField,
  scopedBackButton,
  scopedDeleteButton,
  scopedEditButton,
  scopedNavigateButtonField,
  scopedObjectOptionalField,
  scopedObjectUnionField,
  scopedRequestDataArrayField,
  scopedRequestDataArrayOptionalField,
  scopedResponseArrayField,
  scopedSubmitButton,
  scopedWidgetField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "./utils";

export { scopedObjectFieldNew as scopedWidgetObjectField };
