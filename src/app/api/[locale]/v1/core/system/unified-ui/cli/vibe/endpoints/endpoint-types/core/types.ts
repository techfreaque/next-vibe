/**
 * Core Types for Endpoint Types System
 *
 * Fundamental type definitions used throughout the endpoint types system.
 */

import type { Route } from "next";
import type { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { WidgetConfig } from "../types";
import type {
  ActionTiming,
  ActionType,
  CacheStrategy,
  ComponentSize,
  ComponentVariant,
  FieldUsage,
  InterfaceContext,
  Methods,
} from "./enums";

// Re-export for convenience
export { EndpointErrorTypes, FieldUsage } from "./enums";

// ============================================================================
// ENDPOINT REGISTRY TYPES
// ============================================================================

/**
 * Endpoint definition type for CLI and generated files
 */
export interface EndpointDefinition {
  title?: string;
  description?: string;
  requestSchema?: Record<string, string | number | boolean>;
  requestUrlParamsSchema?: Record<string, string | number | boolean>;
  responseSchema?: Record<string, string | number | boolean>;
  fields?: Record<string, string | number | boolean>;
}

/**
 * API section type for nested endpoint structure
 * Used in generated endpoints.ts file
 */
export type ApiSection = Record<string, EndpointDefinition | ApiSection>;

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
  request?: "data" | "urlParams" | "data&urlParams";
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
      TUsage extends { POST: { request: "data" | "data&urlParams" } }
      ? true
      : TUsage extends { PUT: { request: "data" | "data&urlParams" } }
        ? true
        : TUsage extends { PATCH: { request: "data" | "data&urlParams" } }
          ? true
          : // Computed property syntax (fallback)
            TUsage extends {
                [Methods.POST]: { request: "data" | "data&urlParams" };
              }
            ? true
            : TUsage extends {
                  [Methods.PUT]: { request: "data" | "data&urlParams" };
                }
              ? true
              : TUsage extends {
                    [Methods.PATCH]: { request: "data" | "data&urlParams" };
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
      ? TUsage extends { request: "data" | "data&urlParams" }
        ? true
        : false
      : TTargetUsage extends FieldUsage.RequestUrlParams
        ? TUsage extends { request: "urlParams" | "data&urlParams" }
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
export type InferSchemaFromField<F, Usage extends FieldUsage> =
  // Handle PrimitiveField
  F extends PrimitiveField<infer TSchemaInferred, FieldUsageConfig>
    ? F extends { usage: infer TUsage }
      ? MatchesUsage<TUsage, Usage> extends true
        ? TSchemaInferred
        : z.ZodNever
      : z.ZodNever
    : // Handle ObjectField
      F extends ObjectField<infer TChildren, FieldUsageConfig>
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
      : // Handle ArrayField
        F extends ArrayField<infer TChild, FieldUsageConfig>
        ? F extends { usage: infer TUsage }
          ? MatchesUsage<TUsage, Usage> extends true
            ? z.ZodArray<
                TChild extends UnifiedField<z.ZodTypeAny>
                  ? InferSchemaFromField<TChild, Usage>
                  : TChild extends z.ZodTypeAny
                    ? TChild
                    : z.ZodNever
              >
            : z.ZodNever
          : z.ZodNever
        : // Fallback: If F is not a UnifiedField but is a ZodTypeAny, return it directly
          F extends z.ZodTypeAny
          ? F
          : z.ZodNever;

/**
 * Infer the exact input type from a field structure for a specific usage
 * This back-propagates the input types through the entire field tree
 */
export type InferInputFromField<
  F extends UnifiedField<TSchema>,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractInput<InferSchemaFromField<F, Usage>>;

/**
 * Infer the exact output type from a field structure for a specific usage
 * This back-propagates the output types through the entire field tree
 */
export type InferOutputFromField<
  F extends UnifiedField<TSchema>,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractOutput<InferSchemaFromField<F, Usage>>;

/**
 * METHOD-SPECIFIC USAGE MATCHING: Check if usage matches for a specific method
 * This is the core logic that enables method-specific type inference
 * ✅ VERIFIED: Working correctly for message field filtering
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
        ? TMethodUsage extends { request: "data" | "data&urlParams" }
          ? true
          : false
        : TTargetUsage extends FieldUsage.RequestUrlParams
          ? TMethodUsage extends { request: "urlParams" | "data&urlParams" }
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
      ? TUsage extends { request: "data" | "data&urlParams" }
        ? true
        : false
      : TTargetUsage extends FieldUsage.RequestUrlParams
        ? TUsage extends { request: "urlParams" | "data&urlParams" }
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
export type InferSchemaFromFieldForMethod<
  F extends UnifiedField<TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> =
  // Handle PrimitiveField
  F extends PrimitiveField<infer TFieldSchema, FieldUsageConfig>
    ? F extends { usage: infer TUsage }
      ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
        ? TFieldSchema
        : z.ZodNever
      : z.ZodNever
    : // Handle ObjectField
      F extends ObjectField<infer TChildren, FieldUsageConfig>
      ? F extends { usage: infer TUsage }
        ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
          ? z.ZodObject<{
              [K in keyof TChildren as TChildren[K] extends UnifiedField<z.ZodTypeAny>
                ? InferSchemaFromFieldForMethod<
                    TChildren[K],
                    Method,
                    Usage,
                    z.ZodTypeAny
                  > extends z.ZodNever
                  ? never
                  : K
                : never]: TChildren[K] extends UnifiedField<z.ZodTypeAny>
                ? InferSchemaFromFieldForMethod<
                    TChildren[K],
                    Method,
                    Usage,
                    z.ZodTypeAny
                  >
                : never;
            }>
          : z.ZodNever
        : z.ZodNever
      : // Handle ArrayField
        F extends ArrayField<infer TChild, FieldUsageConfig>
        ? F extends { usage: infer TUsage }
          ? MatchesUsageForMethod<TUsage, Method, Usage> extends true
            ? z.ZodArray<
                TChild extends UnifiedField<z.ZodTypeAny>
                  ? InferSchemaFromFieldForMethod<
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
        : z.ZodNever;

/**
 * METHOD-SPECIFIC INPUT TYPE INFERENCE
 */
export type InferInputFromFieldForMethod<
  F extends UnifiedField<TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractInput<InferSchemaFromFieldForMethod<F, Method, Usage, TSchema>>;

/**
 * METHOD-SPECIFIC OUTPUT TYPE INFERENCE
 */
export type InferOutputFromFieldForMethod<
  F extends UnifiedField<TSchema>,
  Method extends Methods,
  Usage extends FieldUsage,
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> = ExtractOutput<InferSchemaFromFieldForMethod<F, Method, Usage, TSchema>>;

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
  // Current format (backward compatible) - applies to all methods
  | { request: "data"; response?: never }
  | { request: "urlParams"; response?: never }
  | { request: "data&urlParams"; response?: never }
  | { request?: never; response: true }
  | { request: "data"; response: true }
  | { request: "urlParams"; response: true }
  | { request: "data&urlParams"; response: true }
  // New method-specific format - data request type
  | {
      [Methods.GET]?: { request?: "data"; response?: true };
      [Methods.POST]?: { request?: "data"; response?: true };
      [Methods.PUT]?: { request?: "data"; response?: true };
      [Methods.PATCH]?: { request?: "data"; response?: true };
      [Methods.DELETE]?: { request?: "data"; response?: true };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: { request?: "data"; response?: never };
      [Methods.POST]?: { request?: "data"; response?: never };
      [Methods.PUT]?: { request?: "data"; response?: never };
      [Methods.PATCH]?: { request?: "data"; response?: never };
      [Methods.DELETE]?: { request?: "data"; response?: never };
      request?: never;
      response?: never;
    }
  // New method-specific format - urlParams request type
  | {
      [Methods.GET]?: { request?: "urlParams"; response?: true };
      [Methods.POST]?: { request?: "urlParams"; response?: true };
      [Methods.PUT]?: { request?: "urlParams"; response?: true };
      [Methods.PATCH]?: { request?: "urlParams"; response?: true };
      [Methods.DELETE]?: { request?: "urlParams"; response?: true };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: { request?: "urlParams"; response?: never };
      [Methods.POST]?: { request?: "urlParams"; response?: never };
      [Methods.PUT]?: { request?: "urlParams"; response?: never };
      [Methods.PATCH]?: { request?: "urlParams"; response?: never };
      [Methods.DELETE]?: { request?: "urlParams"; response?: never };
      request?: never;
      response?: never;
    }
  // New method-specific format - data&urlParams request type
  | {
      [Methods.GET]?: { request?: "data&urlParams"; response?: true };
      [Methods.POST]?: { request?: "data&urlParams"; response?: true };
      [Methods.PUT]?: { request?: "data&urlParams"; response?: true };
      [Methods.PATCH]?: { request?: "data&urlParams"; response?: true };
      [Methods.DELETE]?: { request?: "data&urlParams"; response?: true };
      request?: never;
      response?: never;
    }
  | {
      [Methods.GET]?: { request?: "data&urlParams"; response?: never };
      [Methods.POST]?: { request?: "data&urlParams"; response?: never };
      [Methods.PUT]?: { request?: "data&urlParams"; response?: never };
      [Methods.PATCH]?: { request?: "data&urlParams"; response?: never };
      [Methods.DELETE]?: { request?: "data&urlParams"; response?: never };
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
  user?: {
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
 * Primitive field type with complete schema type preservation
 * Uses ExtractInputOutput to preserve Input, Output, and ZodType information
 */
export interface PrimitiveField<
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
> {
  type: "primitive";
  schema: TSchema;
  usage: TUsage;
  cache?: CacheStrategy;
  ui: WidgetConfig;
  apiKey?: string;
  uiKey?: string;
}

/**
 * Object field type with children preservation
 * TChildren can be any object-like structure where all values are UnifiedFields
 * The constraint is checked at the value level, not the type level
 */
export interface ObjectField<TChildren, TUsage extends FieldUsageConfig> {
  type: "object";
  schema?: z.ZodObject<Record<string, z.ZodTypeAny>>;
  usage: TUsage;
  cache?: CacheStrategy;
  ui: WidgetConfig;
  children: TChildren;
}

/**
 * Array field type with child preservation
 */
export interface ArrayField<TChild, TUsage extends FieldUsageConfig> {
  type: "array";
  schema?: z.ZodArray<z.ZodTypeAny>;
  usage: TUsage;
  cache?: CacheStrategy;
  ui: WidgetConfig;
  child: TChild;
}

/**
 * Unified field type that supports all field configurations with enhanced type preservation
 * The union accepts any ObjectField or ArrayField regardless of their type parameters
 * Type inference is preserved through the actual field definitions, not through constraints
 */
export type UnifiedField<TSchema extends z.ZodTypeAny = z.ZodTypeAny> =
  | PrimitiveField<TSchema, FieldUsageConfig>
  | ObjectField<Record<string, UnifiedField<z.ZodTypeAny>>, FieldUsageConfig>
  | ArrayField<UnifiedField<z.ZodTypeAny> | z.ZodTypeAny, FieldUsageConfig>;
