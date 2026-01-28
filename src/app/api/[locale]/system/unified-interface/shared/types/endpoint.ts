/**
 * Core Types for Endpoint Types System
 *
 * Fundamental type definitions used throughout the endpoint types system.
 */

import type { z } from "zod";

import type {
  ArrayChildConstraint,
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../unified-ui/widgets/_shared/types";
import type { IconKey } from "../../unified-ui/widgets/form-fields/icon-field/icons";
import type { ObjectWidgetConfig } from "../widgets/configs";

// Re-export UnifiedField from configs.ts where it's now defined
export type { UnifiedField } from "../widgets/configs";
import type { WidgetData } from "../widgets/widget-data";
import type { CreateApiEndpointAny } from "./endpoint-base";
import type { FieldUsage } from "./enums";

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
 * Uses simplified constraint checking for better recursion
 */
type InferVariantSchemas<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for API compatibility
  _TTranslationKey extends string,
  TVariants extends readonly ObjectWidgetConfig<
    string,
    FieldUsageConfig,
    "object",
    ObjectChildrenConstraint<string, FieldUsageConfig>
  >[],
  Usage extends FieldUsage,
> = TVariants extends readonly [infer Head, ...infer Tail]
  ? Tail extends readonly ObjectWidgetConfig<
      string,
      FieldUsageConfig,
      "object",
      ObjectChildrenConstraint<string, FieldUsageConfig>
    >[]
    ? [
        _InferSchemaFromFieldImpl<Normalize<Head>, Usage>,
        ...InferVariantSchemas<string, Tail, Usage>,
      ]
    : [_InferSchemaFromFieldImpl<Normalize<Head>, Usage>]
  : [];

// Normalize intersection types to simple object types for pattern matching
type Normalize<T> = { [K in keyof T]: T[K] };

export type InferSchemaFromField<
  F,
  Usage extends FieldUsage,
> = _InferSchemaFromFieldImpl<Normalize<F>, Usage>;

type _InferSchemaFromFieldImpl<F, Usage extends FieldUsage> =
  // Handle PrimitiveField - extract schema directly from the config
  F extends {
    schema: infer TSchema;
    usage: infer TUsage;
    schemaType: "primitive";
  }
    ? MatchesUsage<TUsage, Usage> extends true
      ? TSchema
      : z.ZodNever
    : // Handle ObjectField - check for object schemaType with children
      F extends {
          schemaType: "object";
          children: infer TChildren;
          usage: infer TUsage;
        }
      ? MatchesUsage<TUsage, Usage> extends true
        ? {
            [K in keyof TChildren as _InferSchemaFromFieldImpl<
              Normalize<TChildren[K]>,
              Usage
            > extends z.ZodNever
              ? never
              : K]: _InferSchemaFromFieldImpl<Normalize<TChildren[K]>, Usage>;
          } extends infer TShape extends z.ZodRawShape
          ? z.ZodObject<TShape>
          : z.ZodNever
        : z.ZodNever
      : // Handle ObjectUnionField - use string for pattern matching
        F extends {
            schemaType: "object-union";
            discriminator: infer TDiscriminator extends string;
            variants: infer TVariants extends readonly ObjectWidgetConfig<
              string,
              FieldUsageConfig,
              "object",
              ObjectChildrenConstraint<string, FieldUsageConfig>
            >[];
            usage: infer TUsage;
          }
        ? MatchesUsage<TUsage, Usage> extends true
          ? InferVariantSchemas<
              string,
              TVariants,
              Usage
            > extends infer TSchemas extends readonly [
              z.ZodObject<z.ZodRawShape>,
              z.ZodObject<z.ZodRawShape>,
              ...z.ZodObject<z.ZodRawShape>[],
            ]
            ? z.ZodDiscriminatedUnion<TSchemas, TDiscriminator>
            : z.ZodNever
          : z.ZodNever
        : // Handle ObjectOptionalField - match on widget config structure directly
          F extends {
              schemaType: "object-optional";
              children: infer TChildren;
              usage: infer TUsage;
            }
          ? MatchesUsage<TUsage, Usage> extends true
            ? {
                [K in keyof TChildren as _InferSchemaFromFieldImpl<
                  Normalize<TChildren[K]>,
                  Usage
                > extends z.ZodNever
                  ? never
                  : K]: _InferSchemaFromFieldImpl<
                  Normalize<TChildren[K]>,
                  Usage
                >;
              } extends infer TShape extends z.ZodRawShape
              ? z.ZodOptional<z.ZodNullable<z.ZodObject<TShape>>>
              : z.ZodNever
            : z.ZodNever
          : // Handle ArrayField - match on widget config structure directly
            F extends {
                schemaType: "array";
                child: infer TChild;
                usage: infer TUsageArray;
              }
            ? MatchesUsage<TUsageArray, Usage> extends true
              ? TChild extends ArrayChildConstraint<string, FieldUsageConfig>
                ? _InferSchemaFromFieldImpl<
                    Normalize<TChild>,
                    Usage
                  > extends infer TSchema extends z.ZodTypeAny
                  ? z.ZodArray<TSchema>
                  : z.ZodNever
                : TChild extends z.ZodTypeAny
                  ? z.ZodArray<TChild>
                  : z.ZodNever
              : z.ZodNever
            : // Handle ArrayOptionalField - match on widget config structure directly
              F extends {
                  schemaType: "array-optional";
                  child: infer TChild;
                  usage: infer TUsageArray;
                }
              ? MatchesUsage<TUsageArray, Usage> extends true
                ? TChild extends ArrayChildConstraint<string, FieldUsageConfig>
                  ? _InferSchemaFromFieldImpl<
                      Normalize<TChild>,
                      Usage
                    > extends infer TSchema extends z.ZodTypeAny
                    ? z.ZodOptional<z.ZodNullable<z.ZodArray<TSchema>>>
                    : z.ZodNever
                  : TChild extends z.ZodTypeAny
                    ? z.ZodOptional<z.ZodNullable<z.ZodArray<TChild>>>
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
  TGetEndpoint extends CreateApiEndpointAny | undefined,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
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
