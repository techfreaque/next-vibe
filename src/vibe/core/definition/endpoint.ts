/**
 * Core Types for Endpoint Types System
 *
 * Fundamental type definitions used throughout the endpoint types system.
 */

import type { WidgetData } from "../utils/json";
import type { ObjectWidgetConfig } from "../../unified-ui/_shared/configs";
import type {
  ArrayChildConstraint,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../unified-ui/_shared/types";
import type { z } from "zod";

// Re-export UnifiedField from configs.ts where it's now defined
export type { UnifiedField } from "../../unified-ui/_shared/configs";

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

// "Does this field's usage config include the target usage?" Uses Extract — a
// non-distributive "any member matches" test — instead of a bare
// `TUsage extends {...}` conditional. For a concrete field (exactly one usage
// object) the two are identical. They differ only when TUsage is a union: a bare
// conditional distributes and yields `boolean` (some members match, some don't),
// whereas the correct answer for "is this field usable for the target" is "yes
// if any member is" → Extract. This matters for the abstract UnifiedField in
// CreateApiEndpointAny, whose usage is the full FieldUsageConfig union: with the
// bare conditional its inferred schema collapsed to z.ZodNever (boolean ⊄ true);
// with Extract it correctly infers the wide schema, so a concrete endpoint's
// precise schema is naturally assignable to the placeholder's.
type MatchesUsage<
  TUsage,
  TTargetUsage extends FieldUsage,
> = TTargetUsage extends FieldUsage.RequestData
  ? [Extract<TUsage, { request: "data" | "data&urlPathParams" }>] extends [
      never,
    ]
    ? false
    : true
  : TTargetUsage extends FieldUsage.RequestUrlParams
    ? [
        Extract<TUsage, { request: "urlPathParams" | "data&urlPathParams" }>,
      ] extends [never]
      ? false
      : true
    : TTargetUsage extends FieldUsage.ResponseData
      ? [Extract<TUsage, { response: true }>] extends [never]
        ? false
        : true
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

// Detects ONLY the abstract UnifiedField placeholder used by CreateApiEndpointAny
// — `UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, …>`. It is the single
// field whose `usage` is the WHOLE FieldUsageConfig union AND whose `schema` is
// exactly z.ZodTypeAny. Concrete widgets carry one usage object and/or a specific
// schema, so they never match (verified: text/chart/avatar/pagination widgets,
// whose schemas are specific, are unaffected). For the placeholder, schema
// inference must collapse to the top schema z.ZodTypeAny for every usage —
// distributing _InferSchemaFromFieldImpl over the abstract field-union instead
// yields a mixed union whose z.input/z.output is not a clean `any`, so the
// downstream examples/options members can't recognise the indeterminate
// placeholder.
// The abstract UnifiedField is the only field that is a UNION spanning MULTIPLE
// schemaType kinds at once — it contains both a "primitive" arm and an "object"
// arm. Every concrete field (including generic widget configs whose unbound
// TSchema/TUsage resolve to their constraints) has exactly ONE schemaType, so it
// can never satisfy both Extracts. This distinguishes the placeholder without
// being fooled by generic-but-single widget configs.
type HasArm<F, TSchemaType extends string> = [
  Extract<F, { schemaType: TSchemaType }>,
] extends [never]
  ? false
  : true;
type IsAbstractField<F> =
  HasArm<F, "primitive"> extends true
    ? HasArm<F, "object"> extends true
      ? true
      : false
    : false;

export type InferSchemaFromField<F, Usage extends FieldUsage> =
  IsAbstractField<F> extends true
    ? z.ZodTypeAny
    : _InferSchemaFromFieldImpl<Normalize<F>, Usage>;

// ── Form schema (request-data ∪ url-path-params) ───────────────────────────
// A form widget can belong to request-data (`request: "data"`), url-path-params
// (`request: "urlPathParams"`), or both (`request: "data&urlPathParams"`). The
// form must validate and collect the union of both sets, not just request data.
// So we merge the two per-usage object schemas into a single z.ZodObject.
//
// CRITICAL: the result must be a concrete z.ZodObject<…> for BOTH the concrete
// and the abstract (CreateApiEndpointAny) case — @hookform/resolvers@5's
// zodResolver overloads key on the Zod-4 core $ZodType internals that only
// concrete schema classes carry, so a bare z.ZodTypeAny (the InferSchemaFromField
// abstract branch) does NOT satisfy them. A z.ZodObject does.
//
// For the abstract placeholder we use z.ZodObject<z.ZodRawShape> (the widest
// object schema): it satisfies the resolver AND every concrete endpoint's
// precise z.ZodObject<…> is assignable to it (its shape extends the
// Record<string, ZodType> index signature) — so concrete endpoints stay
// assignable to CreateApiEndpointAny. A narrow empty shape would NOT accept
// concrete shapes and would break that assignability.

// An empty Zod shape — a concrete usage that contributes no fields resolves to
// z.ZodNever (not a z.ZodObject). Spelled as a Record so it satisfies
// z.ZodRawShape and intersects cleanly without tripping the empty-object lint.
type EmptyZodShape = Record<never, z.ZodTypeAny>;
// Extract a z.ZodObject's shape, defaulting to the empty shape for a non-object
// (z.ZodNever for an absent usage on a concrete endpoint).
type ShapeOfSchema<S> =
  S extends z.ZodObject<infer TShape> ? TShape : EmptyZodShape;
// The merged form schema type. Overlap on data&urlPathParams fields is
// consistent: the same field carries the same schema in both usages, so the
// shape intersection collapses to that single member.
export type InferFormSchema<TFields> =
  IsAbstractField<TFields> extends true
    ? z.ZodObject<z.ZodRawShape>
    : z.ZodObject<
        ShapeOfSchema<
          _InferSchemaFromFieldImpl<Normalize<TFields>, FieldUsage.RequestData>
        > &
          ShapeOfSchema<
            _InferSchemaFromFieldImpl<
              Normalize<TFields>,
              FieldUsage.RequestUrlParams
            >
          >
      >;

// The flat form VALUE type: request-data output ∪ url-path-params output. A pure
// url-path-param field still has a form widget, so the form holds (and the
// resolver validates) both; on submit the values split back into
// { data, urlPathParams }. `never` (an absent usage) is dropped from the union
// rather than intersected to `never`. This is the single source of truth for
// EndpointFormValues and CreateApiEndpoint["types"]["FormValues"].
export type MergeFormValues<TRequestOutput, TUrlVariablesOutput> = [
  TRequestOutput,
] extends [never]
  ? [TUrlVariablesOutput] extends [never]
    ? Record<string, never>
    : TUrlVariablesOutput
  : [TUrlVariablesOutput] extends [never]
    ? TRequestOutput
    : TRequestOutput & TUrlVariablesOutput;

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
          ? keyof TShape extends never
            ? z.ZodNever // All children resolved to never (e.g., widget-only children like submit buttons)
            : z.ZodObject<TShape>
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
              ? keyof TShape extends never
                ? z.ZodNever // All children resolved to never (widget-only children)
                : z.ZodOptional<z.ZodNullable<z.ZodObject<TShape>>>
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

// /**
//  * Type-safe navigation button configuration
//  * Enforces type safety at the definition level
//  *
//  * @template TTargetEndpoint - The target endpoint to navigate to
//  * @template TGetEndpoint - Optional GET endpoint for prefilling data
//  * @template TKey - Translation key type
//  */
// export interface NavigateButtonConfig<
//   TTargetEndpoint extends CreateApiEndpointAny,
//   TGetEndpoint extends CreateApiEndpointAny | undefined,
//   TKey extends string,
//   TUsage extends FieldUsageConfig,
//   TSchemaType extends "widget",
// > extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
//   /** Target endpoint to navigate to */
//   targetEndpoint: TTargetEndpoint;
//   /**
//    * Extract parameters from source data
//    * Source: Row data from parent (WidgetData values - allows strings, numbers, booleans, etc.)
//    * Return: Partial urlPathParams (for navigation) and partial data (for prefilling)
//    */
//   extractParams: TTargetEndpoint extends CreateApiEndpointAny
//     ? (
//         source: {
//           // The parent item of an array (if any)
//           // oxlint-disable-next-line typescript/no-explicit-any
//           itemData: any | undefined;
//           // oxlint-disable-next-line typescript/no-explicit-any
//           requestData: any;
//           // oxlint-disable-next-line typescript/no-explicit-any
//           urlPathParams: any;
//           // oxlint-disable-next-line typescript/no-explicit-any
//           responseData: any;
//         },
//         context: {
//           logger: EndpointLogger;
//           user: JwtPayloadType;
//           locale: CountryLanguage;
//         },
//       ) =>
//         | {
//             urlPathParams?: Partial<
//               TTargetEndpoint["types"]["UrlVariablesOutput"]
//             >;
//             data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
//             response?: Partial<TTargetEndpoint["types"]["ResponseOutput"]>;
//           }
//         | Promise<{
//             urlPathParams?: Partial<
//               TTargetEndpoint["types"]["UrlVariablesOutput"]
//             >;
//             data?: Partial<TTargetEndpoint["types"]["RequestOutput"]>;
//             response?: Partial<TTargetEndpoint["types"]["ResponseOutput"]>;
//           }>
//     : never;
//   /** Prefetch GET data before showing PATCH/PUT form */
//   prefillFromGet?: boolean;
//   /** Optional GET endpoint for prefilling */
//   getEndpoint?: TGetEndpoint;
//   /** Button label translation key */
//   label?: NoInfer<TKey>;
//   /** Button icon */
//   icon?: IconKey;
//   /** Button variant */
//   variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
//   /** Button size */
//   size?: "default" | "sm" | "lg" | "icon";
//   /** Optional CSS class name */
//   className?: string;
//   /** Render target endpoint in a popover modal instead of pushing to navigation stack */
//   renderInModal?: boolean;
//   /** How many times to pop navigation stack after successful deletion (only used with renderInModal) */
//   popNavigationOnSuccess?: number;
// }

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
  /** Called after popNavigationOnSuccess completes (e.g. to trigger parent refetch) */
  onSuccessCallback?: () => void;
  /**
   * Picker callback — when set, the pushed widget is in "picker mode".
   * The widget should call this with the selected value instead of navigating deeper.
   * Type is WidgetData at the stack level; type safety is enforced at the EntityPickerField call site.
   */
  pickerCallback?: (value: WidgetData) => void;
  /**
   * For CLI picker mode: the field name in each list item to use as the display label.
   * e.g. "name" or "title". The framework uses this to render a Select when platform=CLI.
   * Falls back to "name", "title", "label", "id" heuristic if not set.
   */
  pickerLabelField?: string;
  replaceOnSuccess?: {
    endpoint: CreateApiEndpointAny;
    getUrlPathParams?: (
      responseData: TEndpoint["types"]["ResponseOutput"],
    ) => Record<string, string> | undefined;
    prefillFromGet?: boolean;
    getEndpoint?: CreateApiEndpointAny;
  };
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
 * True ONLY for `any` — the example inputs of the abstract CreateApiEndpointAny
 * placeholder. `T extends never` distributes to `boolean` for `any`, `true` for
 * `never`, `false` for any concrete type; only `any` makes the outer
 * `boolean extends …` hold. Variance-safe (no `1 & T` intersection) and avoids
 * the `unknown` keyword (forbidden by lint).
 */
type IsIndeterminateInput<T> = boolean extends (T extends never ? true : false)
  ? true
  : false;

/**
 * Per-group example field.
 * - input is `never`/`undefined` (group not used by this endpoint) → omit
 * - input is `any` (the abstract CreateApiEndpointAny placeholder, whose example
 *   inputs are indeterminate) → OPTIONAL group, so every concrete endpoint's
 *   examples (which declares only the groups it actually has) is naturally
 *   assignable to the placeholder's.
 * - input is a concrete type → REQUIRED group (authoring enforcement intact)
 */
type ExampleGroup<TKey extends string, T, TExampleKey extends string> =
  // `any` first — the abstract placeholder. Must precede the `[T] extends [never]`
  // check, which `any` also partially satisfies (any is assignable to never).
  IsIndeterminateInput<T> extends true
    ? { [P in TKey]?: ExamplesList<T, TExampleKey> }
    : [T] extends [never] | [undefined]
      ? { [P in TKey]?: never }
      : { [P in TKey]: ExamplesList<T, TExampleKey> };

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
> = ExampleGroup<"requests", TRequest, TExampleKey> &
  ExampleGroup<"urlPathParams", TUrlParams, TExampleKey> &
  ExampleGroup<"responses", TResponse, TExampleKey>;
