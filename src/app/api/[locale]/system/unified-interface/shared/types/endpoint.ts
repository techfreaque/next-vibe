/**
 * Core Types for Endpoint Types System
 *
 * Fundamental type definitions used throughout the endpoint types system.
 */

import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconKey } from "../../react/icons";
import type { CreateApiEndpoint } from "../endpoints/definition/create";
import type {
  DisplayOnlyWidgetConfig,
  ObjectWidgetConfig,
  ResponseWidgetConfig,
  WidgetConfig,
} from "../widgets/configs";
import type { WidgetData } from "../widgets/types";
import type { Methods } from "./enums";
import type { FieldUsage } from "./enums";

// ============================================================================
// ENDPOINT REGISTRY TYPES
// ============================================================================

/**
 * Type alias for CreateApiEndpoint - accepts any generic parameters
 * This is a branded type that any CreateApiEndpoint can be assigned to
 * Uses string for TScopedTranslationKey to accept any translation key type
 * Explicitly provides any for computed type parameters to accept any specific computed types
 */
export type CreateApiEndpointAny = CreateApiEndpoint<
  Methods,
  readonly UserRoleValue[],
  string,
  UnifiedField<string, z.ZodTypeAny>,
  // oxlint-disable-next-line no-explicit-any
  any, // RequestInput
  // oxlint-disable-next-line no-explicit-any
  any, // RequestOutput
  // oxlint-disable-next-line no-explicit-any
  any, // ResponseInput
  // oxlint-disable-next-line no-explicit-any
  any, // ResponseOutput
  // oxlint-disable-next-line no-explicit-any
  any, // UrlVariablesInput
  // oxlint-disable-next-line no-explicit-any
  any // UrlVariablesOutput
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
 * USAGE MATCHING: Fixed to work correctly with method-specific patterns
 * This now properly handles the case where method-specific usage should be filtered
 */
type MatchesUsage<
  TUsage,
  TTargetUsage extends FieldUsage,
> = TTargetUsage extends FieldUsage.RequestData
  ? TUsage extends { request: "data" | "data&urlPathParams" }
    ? true
    : false
  : TTargetUsage extends FieldUsage.RequestUrlParams
    ? TUsage extends { request: "urlPathParams" | "data&urlPathParams" }
      ? true
      : false
    : TTargetUsage extends FieldUsage.ResponseData
      ? TUsage extends { response: true }
        ? true
        : false
      : false;

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
    WidgetConfig<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      Record<string, UnifiedField<string, z.ZodTypeAny>>
    >
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Head extends ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string,
      WidgetConfig<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        Record<string, UnifiedField<string, z.ZodTypeAny>>
      >
    >
    ? Tail extends readonly ObjectField<
        Record<string, UnifiedField<string, z.ZodTypeAny>>,
        FieldUsageConfig,
        string,
        WidgetConfig<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          Record<string, UnifiedField<string, z.ZodTypeAny>>
        >
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
  F extends PrimitiveField<infer TSchemaInferred, FieldUsageConfig, string>
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
          z.ZodTypeAny
        >
      ? F extends { usage: infer TUsage }
        ? MatchesUsage<TUsage, Usage> extends true
          ? TVariants extends readonly [
              ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<
                  string,
                  z.ZodTypeAny,
                  FieldUsageConfig,
                  Record<string, UnifiedField<string, z.ZodTypeAny>>
                >
              >,
              ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<
                  string,
                  z.ZodTypeAny,
                  FieldUsageConfig,
                  Record<string, UnifiedField<string, z.ZodTypeAny>>
                >
              >,
              ...ObjectField<
                Record<string, UnifiedField<string, z.ZodTypeAny>>,
                FieldUsageConfig,
                string,
                WidgetConfig<
                  string,
                  z.ZodTypeAny,
                  FieldUsageConfig,
                  Record<string, UnifiedField<string, z.ZodTypeAny>>
                >
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
            WidgetConfig<
              string,
              z.ZodTypeAny,
              FieldUsageConfig,
              Record<string, UnifiedField<string, z.ZodTypeAny>>
            >
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
              z.ZodTypeAny,
              WidgetConfig<
                string,
                z.ZodTypeAny,
                FieldUsageConfig,
                Record<string, UnifiedField<string, z.ZodTypeAny>>
              >
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
                z.ZodTypeAny,
                WidgetConfig<
                  string,
                  z.ZodTypeAny,
                  FieldUsageConfig,
                  UnifiedField<string, z.ZodTypeAny>
                >
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
                  z.ZodTypeAny,
                  WidgetConfig<
                    string,
                    z.ZodTypeAny,
                    FieldUsageConfig,
                    UnifiedField<string, z.ZodTypeAny>
                  >
                >
              ? F extends { usage: infer TUsage }
                ? MatchesUsage<TUsage, Usage> extends true
                  ? z.ZodOptional<
                      z.ZodNullable<
                        z.ZodArray<
                          TChild extends UnifiedField<string, z.ZodTypeAny>
                            ? InferSchemaFromField<TChild, Usage>
                            : TChild extends z.ZodTypeAny
                              ? TChild
                              : z.ZodNever
                        >
                      >
                    >
                  : z.ZodNever
                : z.ZodNever
              : // Fallback: If F is not a UnifiedField but is a ZodTypeAny, return it directly
                F extends z.ZodTypeAny
                ? F
                : z.ZodNever;

// ============================================================================
// NAVIGATION TYPE SYSTEM
// ============================================================================

/**
 * Type-safe navigation button configuration
 * Enforces type safety at the definition level
 *
 * @template TTargetEndpoint - The target endpoint to navigate to
 * @template TGetEndpoint - Optional GET endpoint for prefilling data
 * @template TKey - Translation key type
 */
export interface NavigateButtonConfig<
  TTargetEndpoint extends CreateApiEndpointAny,
  TGetEndpoint extends CreateApiEndpointAny | undefined = undefined,
  TKey extends string = string,
> {
  /** Target endpoint to navigate to */
  targetEndpoint: TTargetEndpoint;
  /**
   * Extract parameters from source data
   * Source: Row data from parent (WidgetData values - allows strings, numbers, booleans, etc.)
   * Return: Partial urlPathParams (for navigation) and partial data (for prefilling)
   */
  extractParams: TTargetEndpoint extends CreateApiEndpointAny
    ? (source: Record<string, WidgetData>) => {
        urlPathParams?: Partial<TTargetEndpoint["types"]["UrlVariablesOutput"]>;
        data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
      }
    : never;
  /** Prefetch GET data before showing PATCH/PUT form */
  prefillFromGet?: boolean;
  /** Optional GET endpoint for prefilling */
  getEndpoint?: TGetEndpoint;
  /** Button label translation key */
  label?: NoInfer<TKey>;
  /** Button icon */
  icon?: IconKey;
  /** Button variant */
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Optional CSS class name */
  className?: string;
  /** Render target endpoint in a popover modal instead of pushing to navigation stack */
  renderInModal?: boolean;
  /** How many times to pop navigation stack after successful deletion (only used with renderInModal) */
  popNavigationOnSuccess?: number;
}

/**
 * Navigation stack entry
 */
export interface NavigationStackEntry<
  TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny,
> {
  endpoint: TEndpoint;
  params: {
    urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
    data?: Partial<TEndpoint["types"]["RequestOutput"]>;
  };
  timestamp: number;
  getEndpoint?: CreateApiEndpointAny;
  prefillFromGet?: boolean;
  renderInModal?: boolean;
  popNavigationOnSuccess?: number;
  modalPosition?: { x: number; y: number };
}

// ============================================================================
// BASIC TYPE UTILITIES
// ============================================================================

/**
 * Field usage configuration
 * Supports both current format (backward compatible) and method-specific configuration
 */
export type FieldUsageConfig =
  | { request: "data"; response?: never }
  | { request: "urlPathParams"; response?: never }
  | { request: "data&urlPathParams"; response?: never }
  | { request?: never; response: true }
  | { request: "data"; response: true }
  | { request: "urlPathParams"; response: true }
  | { request: "data&urlPathParams"; response: true };

/**
 * Examples list using mapped type
 * TypeScript infers covariance naturally for mapped types in readonly positions
 */
export type ExamplesList<out T, TExampleKey extends string> = {
  readonly [K in TExampleKey]: T;
};

/**
 * Examples container that enforces consistent keys across all example types
 * TExampleKey ensures all three objects (requests, urlPathParams, responses) use the same keys
 * Fields are required if type is not never, can be omitted if never
 * Uses [T] extends [never] pattern to properly check for never type
 */
export type EndpointExamples<
  TRequest,
  TUrlParams,
  TResponse,
  TExampleKey extends string,
> = ([TRequest] extends [never] | [undefined]
  ? { requests?: never }
  : { requests: ExamplesList<TRequest, TExampleKey> }) &
  ([TUrlParams] extends [never] | [undefined]
    ? { urlPathParams?: never }
    : { urlPathParams: ExamplesList<TUrlParams, TExampleKey> }) &
  ([TResponse] extends [never] | [undefined]
    ? { responses?: never }
    : { responses: ExamplesList<TResponse, TExampleKey> });

// ============================================================================
// FIELD SYSTEM TYPES
// ============================================================================

/**
 * Primitive field type
 */
export interface PrimitiveField<
  out TSchema extends z.ZodTypeAny,
  out TUsage extends FieldUsageConfig,
  out TKey extends string = TranslationKey,
  out TUIConfig extends ResponseWidgetConfig<TKey, TSchema> =
    ResponseWidgetConfig<TKey, TSchema>,
> {
  type: "primitive";
  schema: TSchema;
  usage: TUsage;

  ui: TUIConfig;
  apiKey?: string;
  uiKey?: string;
}

/**
 * Object field type with children
 */
export interface ObjectField<
  out TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>,
  out TUsage extends FieldUsageConfig,
  out TKey extends string = TranslationKey,
  TUIConfig extends WidgetConfig<string, z.ZodTypeAny, TUsage, TChildren> =
    WidgetConfig<TKey, z.ZodTypeAny, TUsage, TChildren>,
> {
  type: "object";
  usage: TUsage;

  ui: TUIConfig;
  children: TChildren;
}

/**
 * Optional object field type
 */
export interface ObjectOptionalField<
  out TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>,
  out TUsage extends FieldUsageConfig,
  out TKey extends string,
  out TSchema extends z.ZodTypeAny,
  out TUIConfig extends WidgetConfig<string, z.ZodTypeAny, TUsage, TChildren> =
    WidgetConfig<TKey, TSchema, TUsage, TChildren>,
> {
  type: "object-optional";
  usage: TUsage;

  ui: TUIConfig;
  children: TChildren;
}

/**
 * Object union field type for discriminated unions
 */
export interface ObjectUnionField<
  out TDiscriminator extends string,
  out TKey extends string,
  out TVariants extends readonly [
    ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string
    >,
    ...ObjectField<
      Record<string, UnifiedField<string, z.ZodTypeAny>>,
      FieldUsageConfig,
      string
    >[],
  ],
  out TUsage extends FieldUsageConfig,
  out TSchema extends z.ZodTypeAny,
  out TUIConfig extends WidgetConfig<string, z.ZodTypeAny, TUsage, TVariants> =
    WidgetConfig<TKey, TSchema, TUsage, TVariants>,
> {
  type: "object-union";
  discriminator: TDiscriminator;
  variants: TVariants;
  usage: TUsage;

  ui: TUIConfig;
}

/**
 * Array field type
 */
export interface ArrayField<
  out TChild extends UnifiedField<string, z.ZodTypeAny>,
  out TUsage extends FieldUsageConfig,
  out TKey extends string,
  out TSchema extends z.ZodTypeAny,
  out TUIConfig extends WidgetConfig<string, z.ZodTypeAny, TUsage, TChild> =
    WidgetConfig<TKey, TSchema, TUsage, TChild>,
> {
  type: "array";
  usage: TUsage;

  ui: TUIConfig;
  child: TChild;
}

/**
 * Optional array field type
 */
export interface ArrayOptionalField<
  out TChild extends UnifiedField<string, z.ZodTypeAny>,
  out TUsage extends FieldUsageConfig,
  out TKey extends string,
  out TSchema extends z.ZodTypeAny,
  out TUIConfig extends WidgetConfig<string, z.ZodTypeAny, TUsage, TChild> =
    WidgetConfig<TKey, TSchema, TUsage, TChild>,
> {
  type: "array-optional";
  usage: TUsage;

  ui: TUIConfig;
  child: TChild;
}

/**
 * Widget field (UI-only, no schema)
 */
export interface WidgetField<
  out TUsage extends FieldUsageConfig,
  out TKey extends string,
  out TUIConfig extends Omit<DisplayOnlyWidgetConfig<string>, "schema"> = Omit<
    DisplayOnlyWidgetConfig<TKey>,
    "schema"
  >,
> {
  type: "widget";
  usage: TUsage;
  ui: TUIConfig;
}

export interface WidgetObjectField<
  out TChildren extends Record<string, UnifiedField<string, z.ZodTypeAny>>,
  out TUsage extends FieldUsageConfig,
  out TKey extends string,
  out TUIConfig extends ObjectWidgetConfig<string, TUsage, TChildren> =
    ObjectWidgetConfig<TKey, TUsage, TChildren>,
> {
  type: "widget-object";
  usage: TUsage;
  ui: TUIConfig;
  children: TChildren;
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
export type UnifiedField<TKey extends string, TSchema extends z.ZodTypeAny> =
  | PrimitiveField<TSchema, FieldUsageConfig, TKey>
  | ObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey
    >
  | ObjectOptionalField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey,
      TSchema
    >
  | ObjectUnionField<
      string,
      TKey,
      readonly [
        ObjectField<
          Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
          FieldUsageConfig,
          TKey
        >,
        ...ObjectField<
          Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
          FieldUsageConfig,
          TKey
        >[],
      ],
      FieldUsageConfig,
      TSchema
    >
  | ArrayField<
      UnifiedField<TKey, z.ZodTypeAny>,
      FieldUsageConfig,
      TKey,
      TSchema
    >
  | ArrayOptionalField<
      UnifiedField<TKey, z.ZodTypeAny>,
      FieldUsageConfig,
      TKey,
      TSchema
    >
  | WidgetField<FieldUsageConfig, TKey>
  | WidgetObjectField<
      Record<string, UnifiedField<TKey, z.ZodTypeAny>>,
      FieldUsageConfig,
      TKey
    >;
