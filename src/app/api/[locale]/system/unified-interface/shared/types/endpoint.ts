/**
 * Core Types for Endpoint Types System
 *
 * Fundamental type definitions used throughout the endpoint types system.
 */

import type { Route } from "next";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpoint } from "../endpoints/definition/create";
import type { WidgetConfig } from "../widgets/configs";
import type {
  ActionTiming,
  ActionType,
  CacheStrategy,
  ComponentSize,
  ComponentVariant,
  InterfaceContext,
  Methods,
} from "./enums";
import type { FieldUsage } from "./enums";

// ============================================================================
// ENDPOINT REGISTRY TYPES
// ============================================================================

/**
 * Type alias for CreateApiEndpoint - accepts any generic parameters
 * This is a branded type that any CreateApiEndpoint can be assigned to
 */
export type CreateApiEndpointAny = CreateApiEndpoint<
  string,
  Methods,
  readonly UserRoleValue[],
  string,
  // oxlint-disable-next-line no-explicit-any
  any
>;

/**
 * API section type for nested endpoint structure
 * Used in generated endpoints.ts file
 * Accepts CreateApiEndpoint with any type parameters or CreateEndpointReturnInMethod
 */
export interface ApiSection {
  readonly GET?: CreateApiEndpointAny;
  readonly POST?: CreateApiEndpointAny;
  readonly PUT?: CreateApiEndpointAny;
  readonly PATCH?: CreateApiEndpointAny;
  readonly DELETE?: CreateApiEndpointAny;
  readonly [key: string]: CreateApiEndpointAny | ApiSection | undefined;
}

// ============================================================================
// SCHEMA TYPE PRESERVATION AND BACK-PROPAGATION SYSTEM
// ============================================================================

/**
 * Extract the Output type using Zod's built-in z.output<T>
 * This ensures compatibility with the current Zod version
 */
export type ExtractOutput<T> = z.output<T>;

/**
 * Extract the Input type using Zod's built-in z.input<T>
 * This ensures compatibility with the current Zod version
 */
export type ExtractInput<T> = z.input<T>;

/**
 * Extract Input, Output, and ZodType definition from z.ZodType<Output, ZodTypeDef, Input>
 * This preserves complete type information for full type safety
 */
export type ExtractInputOutput<T> =
  T extends z.ZodType<infer Output, infer ZodType, infer Input>
    ? { Input: Input; Output: Output; ZodType: ZodType }
    : never;

/**
 * Method usage structure
 */
interface MethodUsageStructure {
  request?: "data" | "urlPathParams" | "data&urlPathParams";
  response?: boolean;
}

/**
 * Check if usage object has method-specific structure
 * Uses MethodUsageStructure for proper type checking
 */
type IsMethodSpecificUsage<TUsage> =
  // FIXED: Check for string key syntax first (this works reliably)
  TUsage extends { GET: MethodUsageStructure }
    ? true
    : TUsage extends { POST: MethodUsageStructure }
      ? true
      : TUsage extends { PUT: MethodUsageStructure }
        ? true
        : TUsage extends { DELETE: MethodUsageStructure }
          ? true
          : TUsage extends { PATCH: MethodUsageStructure }
            ? true
            : // Fallback: Check for computed property syntax [Methods.X] (unreliable)
              TUsage extends { [Methods.GET]: MethodUsageStructure }
              ? true
              : TUsage extends { [Methods.POST]: MethodUsageStructure }
                ? true
                : TUsage extends { [Methods.PUT]: MethodUsageStructure }
                  ? true
                  : TUsage extends { [Methods.DELETE]: MethodUsageStructure }
                    ? true
                    : TUsage extends { [Methods.PATCH]: MethodUsageStructure }
                      ? true
                      : false;

/**
 * Check if any method in method-specific usage supports the target usage
 * More flexible version that checks method usage properties
 */
type AnyMethodSupportsUsage<
  TUsage,
  TTargetUsage extends FieldUsage,
> = TTargetUsage extends FieldUsage.Response
  ? // Use union types to check all possibilities in parallel
    // String key syntax (primary)
    TUsage extends { POST: { response: true } }
    ? true
    : TUsage extends { GET: { response: true } }
      ? true
      : TUsage extends { PUT: { response: true } }
        ? true
        : TUsage extends { PATCH: { response: true } }
          ? true
          : TUsage extends { DELETE: { response: true } }
            ? true
            : // Computed property syntax (fallback)
              TUsage extends { [Methods.POST]: { response: true } }
              ? true
              : TUsage extends { [Methods.GET]: { response: true } }
                ? true
                : TUsage extends { [Methods.PUT]: { response: true } }
                  ? true
                  : TUsage extends { [Methods.PATCH]: { response: true } }
                    ? true
                    : TUsage extends { [Methods.DELETE]: { response: true } }
                      ? true
                      : false
  : TTargetUsage extends FieldUsage.RequestData
    ? // Use union types to check all possibilities in parallel
      // String key syntax (primary)
      TUsage extends { POST: { request: "data" | "data&urlPathParams" } }
      ? true
      : TUsage extends { PUT: { request: "data" | "data&urlPathParams" } }
        ? true
        : TUsage extends { PATCH: { request: "data" | "data&urlPathParams" } }
          ? true
          : // Computed property syntax (fallback)
            TUsage extends {
                [Methods.POST]: { request: "data" | "data&urlPathParams" };
              }
            ? true
            : TUsage extends {
                  [Methods.PUT]: { request: "data" | "data&urlPathParams" };
                }
              ? true
              : TUsage extends {
                    [Methods.PATCH]: { request: "data" | "data&urlPathParams" };
                  }
                ? true
                : false
    : false;

/**
 * USAGE MATCHING: Fixed to work correctly with method-specific patterns
 * This now properly handles the case where method-specific usage should be filtered
 */
type MatchesUsage<TUsage, TTargetUsage extends FieldUsage> =
  // Check if it's method-specific usage
  IsMethodSpecificUsage<TUsage> extends true
    ? // For method-specific usage, check if ANY method supports the target usage
      // This is correct for field inclusion - if any method needs the field, include it
      AnyMethodSupportsUsage<TUsage, TTargetUsage>
    : // Original simple usage matching for backward compatibility
      TTargetUsage extends FieldUsage.RequestData
      ? TUsage extends { request: "data" | "data&urlPathParams" }
        ? true
        : false
      : TTargetUsage extends FieldUsage.RequestUrlParams
        ? TUsage extends { request: "urlPathParams" | "data&urlPathParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.Response
          ? TUsage extends { response: true }
            ? true
            : false
          : false;

// Removed duplicate MatchesUsageForMethod - using the one defined later

/**
 * COMPREHENSIVE SCHEMA INFERENCE: The complete type system
 * Back-propagates all 3 type parameters (Output, ZodType, Input) through the entire chain
 */
/**
 * Helper type to convert variant fields to Zod object schemas
 * Uses string for pattern matching since fields have TKey=string
 */
type InferVariantSchemas<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for API compatibility
  _TTranslationKey extends string,
  TVariants extends readonly ObjectField<
    Record<string, UnifiedField<string, z.ZodTypeAny>>,
    FieldUsageConfig,
    string,
    WidgetConfig<string>
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Head extends ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string,
      WidgetConfig<string>
    >
    ? Tail extends readonly ObjectField<
        Record<string, UnifiedField<string, z.ZodTypeAny>>,
        FieldUsageConfig,
        string,
        WidgetConfig<string>
      >[]
      ? [
          InferSchemaFromField<Head, Usage>,
          ...InferVariantSchemas<string, Tail, Usage>,
        ]
      : [InferSchemaFromField<Head, Usage>]
    : []
  : [];

export type InferSchemaFromField<F, Usage extends FieldUsage> =
  // Handle PrimitiveField - use string for pattern matching
  F extends PrimitiveField<
    infer TSchemaInferred,
    FieldUsageConfig,
    string,
    WidgetConfig<string>
  >
    ? F extends { usage: infer TUsage }
      ? MatchesUsage<TUsage, Usage> extends true
        ? TSchemaInferred
        : z.ZodNever
      : z.ZodNever
    : // Handle ObjectUnionField - use string for pattern matching
      F extends ObjectUnionField<
          infer TDiscriminator extends string,
          string,
          infer TVariants,
          FieldUsageConfig,
          WidgetConfig<string>
        >
      ? F extends { usage: infer TUsage }
        ? MatchesUsage<TUsage, Usage> extends true
          ? TVariants extends readonly [
              ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<string>
              >,
              ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<string>
              >,
              ...ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<string>
              >[],
            ]
            ? z.ZodDiscriminatedUnion<
                InferVariantSchemas<string, TVariants, Usage> extends infer T
                  ? T extends readonly [
                      z.ZodObject<z.ZodRawShape>,
                      z.ZodObject<z.ZodRawShape>,
                      ...z.ZodObject<z.ZodRawShape>[],
                    ]
                    ? T
                    : readonly [
                        z.ZodObject<z.ZodRawShape>,
                        z.ZodObject<z.ZodRawShape>,
                      ]
                  : readonly [
                      z.ZodObject<z.ZodRawShape>,
                      z.ZodObject<z.ZodRawShape>,
                    ],
                TDiscriminator
              >
            : z.ZodNever
          : z.ZodNever
        : z.ZodNever
      : // Handle ObjectField - use string for pattern matching
        F extends ObjectField<
            infer TChildren,
            FieldUsageConfig,
            string,
            WidgetConfig<string>
          >
        ? F extends { usage: infer TUsage }
          ? MatchesUsage<TUsage, Usage> extends true
            ? z.ZodObject<{
                [K in keyof TChildren as InferSchemaFromField<
                  TChildren[K],
                  Usage
                > extends z.ZodNever
                  ? never
                  : K]: InferSchemaFromField<TChildren[K], Usage>;
              }>
            : z.ZodNever
          : z.ZodNever
        : // Handle ObjectOptionalField - use string for pattern matching
          F extends ObjectOptionalField<
              infer TChildren,
              FieldUsageConfig,
              string,
              WidgetConfig<string>
            >
          ? F extends { usage: infer TUsage }
            ? MatchesUsage<TUsage, Usage> extends true
              ? z.ZodOptional<
                  z.ZodNullable<
                    z.ZodObject<{
                      [K in keyof TChildren as InferSchemaFromField<
                        TChildren[K],
                        Usage
                      > extends z.ZodNever
                        ? never
                        : K]: InferSchemaFromField<TChildren[K], Usage>;
                    }>
                  >
                >
              : z.ZodNever
            : z.ZodNever
          : // Handle ArrayField - use string for pattern matching
            F extends ArrayField<
                infer TChild,
                FieldUsageConfig,
                string,
                WidgetConfig<string>
              >
            ? F extends { usage: infer TUsage }
              ? MatchesUsage<TUsage, Usage> extends true
                ? z.ZodArray<
                    TChild extends UnifiedField<string, z.ZodTypeAny>
                      ? InferSchemaFromField<TChild, Usage>
                      : TChild extends z.ZodTypeAny
                        ? TChild
                        : z.ZodNever
                  >
                : z.ZodNever
              : z.ZodNever
            : // Handle ArrayOptionalField - use string for pattern matching
              F extends ArrayOptionalField<
                  infer TChild,
                  FieldUsageConfig,
                  string,
                  WidgetConfig<string>
                >
              ? F extends { usage: infer TUsage }
                ? MatchesUsage<TUsage, Usage> extends true
                  ? z.ZodNullable<
                      z.ZodArray<
                        TChild extends UnifiedField<string, z.ZodTypeAny>
                          ? InferSchemaFromField<TChild, Usage>
                          : TChild extends z.ZodTypeAny
                            ? TChild
                            : z.ZodNever
                      >
                    >
                  : z.ZodNever
                : z.ZodNever
              : // Fallback: If F is not a UnifiedField but is a ZodTypeAny, return it directly
                F extends z.ZodTypeAny
                ? F
                : z.ZodNever;

/**
 * Infer the exact input type from a field structure for a specific usage
 */
export type InferInputFromField<
  TTranslationKey extends string,
  F extends UnifiedField<TTranslationKey, TSchema>,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractInput<InferSchemaFromField<F, Usage>>;

/**
 * Infer the exact output type from a field structure for a specific usage
 */
export type InferOutputFromField<
  TTranslationKey extends string,
  F extends UnifiedField<TTranslationKey, TSchema>,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractOutput<InferSchemaFromField<F, Usage>>;

/**
 * METHOD-SPECIFIC USAGE MATCHING: Check if usage matches for a specific method
 * This is the core logic that enables method-specific type inference
 */
type MatchesUsageForMethod<
  TUsage,
  TMethod extends Methods,
  TTargetUsage extends FieldUsage,
> =
  // Check if it's method-specific format first
  TMethod extends keyof TUsage
    ? TUsage[TMethod] extends infer TMethodUsage
      ? TTargetUsage extends FieldUsage.RequestData
        ? TMethodUsage extends { request: "data" | "data&urlPathParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.RequestUrlParams
          ? TMethodUsage extends {
              request: "urlPathParams" | "data&urlPathParams";
            }
            ? true
            : false
          : TTargetUsage extends FieldUsage.Response
            ? TMethodUsage extends { response: true }
              ? true
              : false
            : false
      : false
    : // Fall back to original logic for backward compatibility
      TTargetUsage extends FieldUsage.RequestData
      ? TUsage extends { request: "data" | "data&urlPathParams" }
        ? true
        : false
      : TTargetUsage extends FieldUsage.RequestUrlParams
        ? TUsage extends { request: "urlPathParams" | "data&urlPathParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.Response
          ? TUsage extends { response: true }
            ? true
            : false
          : false;

/**
 * METHOD-SPECIFIC SCHEMA INFERENCE: Infer schema for a specific HTTP method and usage
 * This is the key missing piece that enables proper method-specific type inference
 */
/**
 * Helper type to compute schemas for children once
 * Avoids double evaluation that causes deep recursion
 */
type ComputeChildSchemas<
  TTranslationKey extends string,
  TChildren,
  Method extends Methods,
  Usage extends FieldUsage,
> = {
  [K in keyof TChildren]: TChildren[K] extends UnifiedField<
    TTranslationKey,
    z.ZodTypeAny
  >
    ? InferSchemaFromFieldForMethod<
        TTranslationKey,
        TChildren[K],
        Method,
        Usage,
        z.ZodTypeAny
      >
    : never;
};

/**
 * Filter out never schemas from computed children
 */
type FilterNeverSchemas<TSchemas> = {
  [K in keyof TSchemas as TSchemas[K] extends z.ZodNever
    ? never
    : K]: TSchemas[K];
};

export type InferSchemaFromFieldForMethod<
  TTranslationKey extends string,
  F extends UnifiedField<TTranslationKey, TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> =
  // Handle PrimitiveField
  F extends PrimitiveField<
    infer TFieldSchema,
    FieldUsageConfig,
    TTranslationKey,
    WidgetConfig<TTranslationKey>
  >
    ? F extends { usage: infer TUsage }
      ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
        ? TFieldSchema
        : z.ZodNever
      : z.ZodNever
    : // Handle ObjectField - process children based on their own usage
      F extends ObjectField<
          infer TChildren,
          FieldUsageConfig,
          TTranslationKey,
          WidgetConfig<TTranslationKey>
        >
      ? z.ZodObject<
          FilterNeverSchemas<
            ComputeChildSchemas<TTranslationKey, TChildren, Method, Usage>
          >
        >
      : // Handle ObjectOptionalField - process children based on their own usage
        F extends ObjectOptionalField<
            infer TChildren,
            FieldUsageConfig,
            TTranslationKey,
            WidgetConfig<TTranslationKey>
          >
        ? z.ZodOptional<
            z.ZodNullable<
              z.ZodObject<
                FilterNeverSchemas<
                  ComputeChildSchemas<TTranslationKey, TChildren, Method, Usage>
                >
              >
            >
          >
        : // Handle ArrayField
          F extends ArrayField<
              infer TChild,
              FieldUsageConfig,
              TTranslationKey,
              WidgetConfig<TTranslationKey>
            >
          ? F extends { usage: infer TUsage }
            ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
              ? z.ZodArray<
                  TChild extends UnifiedField<TTranslationKey, z.ZodTypeAny>
                    ? InferSchemaFromFieldForMethod<
                        TTranslationKey,
                        TChild,
                        Method,
                        Usage,
                        z.ZodTypeAny
                      >
                    : TChild extends z.ZodTypeAny
                      ? TChild
                      : z.ZodNever
                >
              : z.ZodNever
            : z.ZodNever
          : // Handle ArrayOptionalField
            F extends ArrayOptionalField<
                infer TChild,
                FieldUsageConfig,
                TTranslationKey,
                WidgetConfig<TTranslationKey>
              >
            ? F extends { usage: infer TUsage }
              ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
                ? z.ZodNullable<
                    z.ZodArray<
                      TChild extends UnifiedField<TTranslationKey, z.ZodTypeAny>
                        ? InferSchemaFromFieldForMethod<
                            TTranslationKey,
                            TChild,
                            Method,
                            Usage,
                            z.ZodTypeAny
                          >
                        : TChild extends z.ZodTypeAny
                          ? TChild
                          : z.ZodNever
                    >
                  >
                : z.ZodNever
              : z.ZodNever
            : z.ZodNever;

/**
 * METHOD-SPECIFIC INPUT TYPE INFERENCE
 */
export type InferInputFromFieldForMethod<
  TTranslationKey extends string,
  F extends UnifiedField<TTranslationKey, TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractInput<
  InferSchemaFromFieldForMethod<TTranslationKey, F, Method, Usage, TSchema>
>;

/**
 * METHOD-SPECIFIC OUTPUT TYPE INFERENCE
 */
export type InferOutputFromFieldForMethod<
  TTranslationKey extends string,
  F extends UnifiedField<TTranslationKey, TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractOutput<
  InferSchemaFromFieldForMethod<TTranslationKey, F, Method, Usage, TSchema>
>;

// ============================================================================
// BASIC TYPE UTILITIES
// ============================================================================

/**
 * Field value types that can be handled by the system
 */
export type FieldValue = string | number | boolean | Date | null | undefined;

/**
 * Field usage configuration
 * Supports both current format (backward compatible) and method-specific configuration
 */
export type FieldUsageConfig =
  // applies to all methods
  | { request: "data"; response?: never }
  | { request: "urlPathParams"; response?: never }
  | { request: "data&urlPathParams"; response?: never }
  | { request?: never; response: true }
  | { request: "data"; response: true }
  | { request: "urlPathParams"; response: true }
  | { request: "data&urlPathParams"; response: true }
  // method-specific format
  | {
      [Methods.GET]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: true;
      };
      [Methods.POST]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: true;
      };
      [Methods.PUT]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: true;
      };
      [Methods.PATCH]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: true;
      };
      [Methods.DELETE]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: true;
      };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: never;
      };
      [Methods.POST]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: never;
      };
      [Methods.PUT]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: never;
      };
      [Methods.PATCH]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: never;
      };
      [Methods.DELETE]?: {
        request?: "data" | "urlPathParams" | "data&urlPathParams";
        response?: never;
      };
      request?: never;
      response?: never;
    }
  // New method-specific format - urlPathParams request type
  | {
      [Methods.GET]?: { request?: "urlPathParams"; response?: true };
      [Methods.POST]?: { request?: "urlPathParams"; response?: true };
      [Methods.PUT]?: { request?: "urlPathParams"; response?: true };
      [Methods.PATCH]?: { request?: "urlPathParams"; response?: true };
      [Methods.DELETE]?: { request?: "urlPathParams"; response?: true };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: { request?: "urlPathParams"; response?: never };
      [Methods.POST]?: { request?: "urlPathParams"; response?: never };
      [Methods.PUT]?: { request?: "urlPathParams"; response?: never };
      [Methods.PATCH]?: { request?: "urlPathParams"; response?: never };
      [Methods.DELETE]?: { request?: "urlPathParams"; response?: never };
      request?: never;
      response?: never;
    }
  // New method-specific format - data&urlPathParams request type
  | {
      [Methods.GET]?: { request?: "data&urlPathParams"; response?: true };
      [Methods.POST]?: { request?: "data&urlPathParams"; response?: true };
      [Methods.PUT]?: { request?: "data&urlPathParams"; response?: true };
      [Methods.PATCH]?: { request?: "data&urlPathParams"; response?: true };
      [Methods.DELETE]?: { request?: "data&urlPathParams"; response?: true };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: { request?: "data&urlPathParams"; response?: never };
      [Methods.POST]?: { request?: "data&urlPathParams"; response?: never };
      [Methods.PUT]?: { request?: "data&urlPathParams"; response?: never };
      [Methods.PATCH]?: { request?: "data&urlPathParams"; response?: never };
      [Methods.DELETE]?: { request?: "data&urlPathParams"; response?: never };
      request?: never;
      response?: never;
    }
  // New method-specific format - response only
  | {
      [Methods.GET]?: { request?: never; response: true };
      [Methods.POST]?: { request?: never; response: true };
      [Methods.PUT]?: { request?: never; response: true };
      [Methods.PATCH]?: { request?: never; response: true };
      [Methods.DELETE]?: { request?: never; response: true };
      request?: never;
      response?: never;
    };

export type ExamplesList<T, TExampleKey extends string> = {
  [exampleKey in TExampleKey]: T; // & { id?: string };
};

// ============================================================================
// ACTION SYSTEM TYPES
// ============================================================================

/**
 * Action condition for conditional execution
 */
export interface ActionCondition {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "exists"
    | "not_exists"
    | "greater_than"
    | "less_than";
  value?: FieldValue;
}

/**
 * Base action configuration
 */
export interface BaseActionConfig {
  type: ActionType;
  timing?: ActionTiming;
  delay?: number;
  conditions?: ActionCondition[];
  contexts?: InterfaceContext[];
}

/**
 * Toast/Notification action
 */
export interface ToastActionConfig extends BaseActionConfig {
  type: ActionType.TOAST | ActionType.NOTIFICATION | ActionType.ALERT;
  message: TranslationKey;
  variant?: ComponentVariant;
  duration?: number;
  title?: TranslationKey;
  description?: TranslationKey;
}

/**
 * Navigation action
 */
export interface NavigationActionConfig extends BaseActionConfig {
  type:
    | ActionType.ROUTER_PUSH
    | ActionType.ROUTER_REPLACE
    | ActionType.ROUTER_BACK
    | ActionType.REDIRECT;
  path?: string;
  route?: Route;
  params?: Record<string, string>;
  query?: Record<string, string>;
  replace?: boolean;
  external?: boolean;
}

/**
 * Data/Cache action
 */
export interface RefetchActionConfig extends BaseActionConfig {
  type:
    | ActionType.REFETCH
    | ActionType.INVALIDATE_CACHE
    | ActionType.UPDATE_CACHE
    | ActionType.CLEAR_CACHE;
  queryKeys?: string[][];
  exact?: boolean;
  data?: Record<string, FieldValue>;
}

/**
 * Form action
 */
export interface FormActionConfig extends BaseActionConfig {
  type:
    | ActionType.RESET_FORM
    | ActionType.CLEAR_FORM
    | ActionType.SET_FORM_VALUES
    | ActionType.FOCUS_FIELD;
  formId?: string;
  values?: Record<string, FieldValue>;
  fieldName?: string;
  resetToDefaults?: boolean;
}

/**
 * State action
 */
export interface StateActionConfig extends BaseActionConfig {
  type:
    | ActionType.SET_STATE
    | ActionType.TOGGLE_STATE
    | ActionType.UPDATE_STATE;
  key: string;
  value?: FieldValue;
  updater?: (current: FieldValue) => FieldValue;
}

/**
 * Custom action
 */
export interface CustomActionConfig extends BaseActionConfig {
  type: ActionType.CUSTOM;
  handler: string | ((context: ActionContext) => Promise<ActionResult>);
  payload?: Record<string, FieldValue>;
}

/**
 * Union type for all action configurations
 */
export type ActionConfig =
  | ToastActionConfig
  | NavigationActionConfig
  | RefetchActionConfig
  | FormActionConfig
  | StateActionConfig
  | CustomActionConfig;

/**
 * Action execution context
 */
export interface ActionContext {
  context: InterfaceContext;
  data?: Record<string, FieldValue>;
  error?: Error;
  endpoint?: Record<string, FieldValue>;
  timestamp: string;
  user: {
    id: string;
    roles: string[];
  };
  metadata?: Record<string, FieldValue>;
  formValues?: Record<string, FieldValue>;
  fieldValue?: FieldValue;
}

/**
 * Action execution result
 */
export interface ActionResult {
  success: boolean;
  data?: Record<string, FieldValue>;
  error?: string;
  metadata?: Record<string, FieldValue>;
}

/**
 * Lifecycle actions
 */
export interface LifecycleActions {
  onSuccess?: ActionConfig[];
  onError?: ActionConfig[];
  onLoading?: ActionConfig[];
  onComplete?: ActionConfig[];
  onMount?: ActionConfig[];
  onUnmount?: ActionConfig[];
}

/**
 * Interactive actions
 */
export interface InteractiveActions {
  onClick?: ActionConfig[];
  onDoubleClick?: ActionConfig[];
  onHover?: ActionConfig[];
  onFocus?: ActionConfig[];
  onBlur?: ActionConfig[];
}

/**
 * Form field actions
 */
export interface FieldActions {
  onChange?: ActionConfig[];
  onValidation?: ActionConfig[];
  onError?: ActionConfig[];
  onClear?: ActionConfig[];
}

/**
 * Button action configuration
 */
export interface ButtonAction {
  label: TranslationKey;
  icon?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  actions: ActionConfig[];
  conditions?: ActionCondition[];
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Context menu action
 */
export interface ContextMenuAction {
  label: TranslationKey;
  icon?: string;
  actions: ActionConfig[];
  separator?: boolean;
  disabled?: boolean;
  dangerous?: boolean;
}

/**
 * Bulk action for data tables
 */
export interface BulkAction {
  label: TranslationKey;
  icon?: string;
  variant?: ComponentVariant;
  actions: ActionConfig[];
  confirmationMessage?: TranslationKey;
  requiresSelection?: boolean;
  maxSelection?: number;
}

// ============================================================================
// FIELD SYSTEM TYPES
// ============================================================================

/**
 * Primitive field type
 */
export interface PrimitiveField<
  out TSchema extends z.ZodTypeAny,
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "primitive";
  schema: TSchema;
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
  apiKey?: string;
  uiKey?: string;
}

/**
 * Object field type with children
 */
export interface ObjectField<
  out TChildren,
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "object";
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
  children: TChildren;
}

/**
 * Optional object field type
 */
export interface ObjectOptionalField<
  out TChildren,
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "object-optional";
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
  children: TChildren;
}

/**
 * Object union field type for discriminated unions
 */
export interface ObjectUnionField<
  out TDiscriminator extends string,
  TKey extends string,
  out TVariants extends readonly [
    ObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >,
    ...ObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >[],
  ],
  out TUsage extends FieldUsageConfig,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "object-union";
  discriminator: TDiscriminator;
  variants: TVariants;
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
}

/**
 * Array field type
 */
export interface ArrayField<
  out TChild,
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "array";
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
  child: TChild;
}

/**
 * Optional array field type
 */
export interface ArrayOptionalField<
  out TChild,
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "array-optional";
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
  child: TChild;
}

/**
 * Widget field (UI-only, no schema)
 */
export interface WidgetField<
  out TUsage extends FieldUsageConfig,
  TKey extends string,
  out TUIConfig extends WidgetConfig<TKey>,
> {
  type: "widget";
  usage: TUsage;
  cache?: CacheStrategy;
  ui: TUIConfig;
}

/**
 * Unified field type that supports all field configurations with enhanced type preservation
 *
 * TSchema: The Zod schema type for primitive fields
 * TKey: The translation key type - can be global TranslationKey or scoped translation keys
 *
 * When using scoped translations, pass the scoped key type:
 * UnifiedField<z.ZodTypeAny, ContactTranslationKey>
 *
 * This ensures all widget configs in the field tree use the correct translation key type.
 *
 */
export type UnifiedField<
  TKey extends string,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> =
  | PrimitiveField<TSchema, FieldUsageConfig, TKey, WidgetConfig<TKey>>
  | ObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >
  | ObjectOptionalField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >
  | ObjectUnionField<
      string,
      TKey,
      readonly [
        ObjectField<
          Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
          FieldUsageConfig,
          TKey,
          WidgetConfig<TKey>
        >,
        ...ObjectField<
          Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
          FieldUsageConfig,
          TKey,
          WidgetConfig<TKey>
        >[],
      ],
      FieldUsageConfig,
      WidgetConfig<TKey>
    >
  | ArrayField<
      UnifiedField<TKey, z.ZodTypeAny> | z.ZodTypeAny,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >
  | ArrayOptionalField<
      UnifiedField<TKey, z.ZodTypeAny> | z.ZodTypeAny,
      FieldUsageConfig,
      TKey,
      WidgetConfig<TKey>
    >
  | WidgetField<FieldUsageConfig, TKey, WidgetConfig<TKey>>;
