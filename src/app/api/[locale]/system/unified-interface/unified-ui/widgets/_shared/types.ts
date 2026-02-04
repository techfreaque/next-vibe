import type { Path } from "react-hook-form";
import type z from "zod";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import type { UseNavigationStackReturn } from "../../../react/hooks/use-navigation-stack";
import type { EndpointLogger } from "../../../shared/logger/endpoint";
import type { InferSchemaFromField } from "../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import type { FieldUsage, WidgetType } from "../../../shared/types/enums";
import type { Platform } from "../../../shared/types/platform";
import type {
  DisplayOnlyWidgetConfig,
  ObjectWidgetConfig,
  UnifiedField,
} from "../../../shared/widgets/configs";
import type { WidgetData } from "../../../shared/widgets/widget-data";

/**
 * Base widget renderer props (before value is added to field)
 * Renderers receive fields without values and augment them internally
 */
export interface BaseWidgetRendererProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
> {
  fieldName: string;
  field: UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >;
  context: BaseWidgetContext<TEndpoint>;
}

/**
 * Base widget props shared across all platforms.
 * The `widgetType` field acts as the discriminator for the union.
 * Value type is inferred from the field's schema for type safety.
 */
export interface BaseWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  fieldName: Path<TEndpoint["types"]["RequestOutput"]>;
  field: BaseWidgetFieldProps<TUsage, TWidgetConfig>;
  /**
   * Inline button info (only set on ROOT container by EndpointRenderer)
   * Indicates if buttons/alerts are already defined inline in the field tree
   * Used by root container to decide if auto-buttons should be rendered
   */
  inlineButtonInfo?: {
    hasSubmitButton: boolean;
    hasBackButton: boolean;
    hasFormAlert: boolean;
  };
}

/**
 * Base widget props shared across all platforms.
 * The `widgetType` field acts as the discriminator for the union.
 * Value type is inferred from the field's schema for type safety.
 */
/**
 * Distributive conditional — each union member of TWidgetConfig
 * gets its own value type, enabling schemaType-based narrowing
 * via hasChild/hasChildren guards.
 */
export type BaseWidgetFieldProps<
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> = TWidgetConfig &
  BaseWidgetConfig<TUsage, SchemaTypes> & {
    value: TWidgetConfig extends { schema: z.ZodTypeAny }
      ? z.output<TWidgetConfig["schema"]>
      : TWidgetConfig extends { children: infer TChildren }
        ? InferChildrenOutput<TChildren>
        : TWidgetConfig extends { child: infer TChild }
          ? InferChildOutput<TChild>[]
          : TWidgetConfig extends {
                variants: infer TVariants;
              }
            ? InferUnionType<TVariants>
            : undefined;
    parentValue?: WidgetData;
  };

/**
 * Dispatch-level field type for renderer entry points.
 * Distributive conditional that maps each UnifiedField member to itself + value/parentValue.
 * This preserves discriminated union narrowing in switch statements.
 */
export type DispatchField<
  TKey extends string,
  TSchema extends z.ZodTypeAny,
  TUsage extends FieldUsageConfig,
  TChildren extends AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>,
> =
  UnifiedField<TKey, TSchema, TUsage, TChildren> extends infer UF extends
    UnifiedField<
      string,
      z.ZodTypeAny,
      TUsage,
      AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
    >
    ? BaseWidgetFieldProps<TUsage, UF>
    : never;

export interface BaseWidgetContext<TEndpoint extends CreateApiEndpointAny> {
  locale: CountryLanguage;
  isInteractive: boolean;
  user: JwtPayloadType;
  logger: EndpointLogger;

  platform:
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI
    | typeof Platform.CLI_PACKAGE
    | typeof Platform.MCP;
  endpointFields: TEndpoint["fields"]; // Original endpoint fields for nested path lookup
  disabled: boolean; // Disable all form inputs
  response: ResponseType<TEndpoint["types"]["ResponseOutput"]> | undefined; // Full ResponseType from endpoint (includes success/error state)
  /**
   * Navigation context for cross-definition navigation
   * Provides type-safe navigation methods (push/pop) for endpoint navigation
   */
  navigation: UseNavigationStackReturn;
  /**
   * Current endpoint being rendered (for self-referencing navigation)
   */
  endpoint: TEndpoint;
  /**
   * Translation function for widgets to use directly
   * This is the scoped translation from the endpoint definition
   * Automatically falls back to global translation if no scoped translation is defined
   * Widgets should ALWAYS use context.t for all translations
   */
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType;
  /**
   * Endpoint mutations available for widgets to trigger directly
   * Widgets can call these methods to perform CRUD operations
   * This enables definition-driven interactions without custom handlers
   */
  endpointMutations?: {
    create?: {
      submit: (data: TEndpoint["types"]["RequestOutput"]) => Promise<void>;
      isSubmitting?: boolean;
    };
    update?: {
      submit: (data: TEndpoint["types"]["RequestOutput"]) => Promise<void>;
      isSubmitting?: boolean;
    };
    delete?: {
      submit: (data: TEndpoint["types"]["RequestOutput"]) => Promise<void>;
      isSubmitting?: boolean;
    };
    read?: {
      refetch: () => Promise<void>;
      isLoading?: boolean;
    };
  };
  /**
   * Whether to render only response fields (for CLI result-formatter mode)
   * When true, container widgets should filter out request fields
   */
  responseOnly?: boolean;
  /**
   * Button rendering state - tracks if submit/back buttons have been rendered
   * Used to prevent duplicate buttons in nested containers
   * Containers check and set these flags to coordinate button rendering
   */
  buttonState?: {
    hasRenderedSubmitButton: boolean;
    hasRenderedBackButton: boolean;
  };
}

export type SchemaTypes =
  | "primitive"
  | "object"
  | "object-optional"
  | "object-union"
  | "array"
  | "array-optional"
  | "widget"
  | "widget-object";

/**
 * Field usage configuration
 * Specifies whether a field is used in request, response, or both
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
 * Common widget properties
 * TKey allows using either global TranslationKey or scoped translation keys
 */

export interface BaseWidgetConfig<
  out TUsage extends FieldUsageConfig,
  TSchemaType extends SchemaTypes,
> {
  type: WidgetType;
  className?: string;
  order?: number;
  /** Hide this field from rendering */
  hidden?: boolean | ((data: WidgetData) => boolean);
  /** Render inline with next sibling that also has inline: true */
  inline?: boolean;
  /** Number of columns for grid layout */
  columns?: number;
  schemaType: TSchemaType;
  usage: TUsage;
}

export interface BasePrimitiveWidgetConfig<
  out TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
  TSchema extends z.ZodTypeAny,
> extends BaseWidgetConfig<TUsage, TSchemaType> {
  schema: TSchema;
}

export type BasePrimitiveDisplayOnlyWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> = BaseWidgetConfig<TUsage, TSchemaType> & {
  schema?: never;
};

/**
 * Base config for object widgets (containers with children)
 * TChildren is a Record mapping field names to their field definitions
 */
export type BaseObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> = BaseWidgetConfig<TUsage, TSchemaType> & {
  children: TChildren;
  schemaType: "object" | "object-optional" | "widget-object";
};

/**
 * Extract all keys from variant children
 */
type ExtractVariantKeys<TVariants> = TVariants extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends ObjectWidgetConfig<
      string,
      FieldUsageConfig,
      "object",
      infer TChildren
    >
    ? keyof TChildren | ExtractVariantKeys<Rest>
    : never
  : never;

/**
 * Base config for object-union widgets (discriminated unions)
 * TVariants is a readonly tuple of ObjectField variants
 */
export type BaseObjectUnionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends SchemaTypes,
  TVariants extends UnionObjectWidgetConfigConstrain<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> = BaseWidgetConfig<TUsage, TSchemaType> & {
  discriminator: ExtractVariantKeys<TVariants> extends never
    ? string
    : ExtractVariantKeys<TVariants>;
  variants: TVariants;
  schemaType: "object-union";
};

/**
 * Base config for array widgets (lists with a single child type)
 * TChild is the field definition for array items
 */
export type BaseArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends AnyChildrenConstrain<TKey, ConstrainedChildUsage<TUsage>>,
> = BaseWidgetConfig<TUsage, TSchemaType> & {
  child: TChild;
  schemaType: "array" | "array-optional";
};

// ============================================================================
// CONSTRAINTS
// ============================================================================

/**
 * Constrain child usage based on parent usage
 * Children can be more specific than parent but must be compatible
 */
export type ConstrainedChildUsage<TUsage extends FieldUsageConfig> =
  TUsage extends {
    request: "data&urlPathParams";
    response: true;
  }
    ?
        | { request: "data"; response?: never }
        | { request: "urlPathParams"; response?: never }
        | { request: "data&urlPathParams"; response?: never }
        | { request?: never; response: true }
        | { request: "data"; response: true }
        | { request: "urlPathParams"; response: true }
        | { request: "data&urlPathParams"; response: true }
    : TUsage extends { request: "data"; response: true }
      ?
          | { request: "data"; response?: never }
          | { request?: never; response: true }
          | { request: "data"; response: true }
      : TUsage extends { request: "urlPathParams"; response: true }
        ?
            | { request: "urlPathParams"; response?: never }
            | { request?: never; response: true }
            | { request: "urlPathParams"; response: true }
        : TUsage extends { request: "data"; response?: never }
          ? { request: "data"; response?: never }
          : TUsage extends { request: "urlPathParams"; response?: never }
            ? { request: "urlPathParams"; response?: never }
            : TUsage extends { request: "data&urlPathParams"; response?: never }
              ?
                  | { request: "data"; response?: never }
                  | { request: "urlPathParams"; response?: never }
                  | { request: "data&urlPathParams"; response?: never }
              : TUsage extends { request?: never; response: true }
                ? { request?: never; response: true }
                : TUsage;

export type AnyChildrenConstrain<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for schema covariance
  | BasePrimitiveWidgetConfig<TUsage, "primitive", z.ZodTypeAny>
  | BasePrimitiveDisplayOnlyWidgetConfig<TUsage, "widget">
  | DisplayOnlyWidgetConfig<TKey, TUsage, "widget">
  | BaseArrayWidgetConfig<
      TKey,
      TUsage,
      "array" | "array-optional",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for children covariance
      any
    >
  | BaseObjectWidgetConfig<
      TKey,
      TUsage,
      "object" | "object-optional" | "widget-object",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for children covariance
      any
    >
  | BaseObjectUnionWidgetConfig<
      TKey,
      TUsage,
      SchemaTypes,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for variants covariance
      any
    >
  | never;

/**
 * Constraint for simple object children without recursion
 * Used when object fields contain primitive fields only
 */
export type ObjectChildrenConstraint<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> = Record<string, AnyChildrenConstrain<TKey, TUsage>>;

/**
 * Constraint for array child elements
 * Used to define the type of elements in array fields
 */
export type ArrayChildConstraint<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> = AnyChildrenConstrain<TKey, TUsage>;

/**
 * Single variant in a discriminated union
 * Each variant is an object widget with constrained children
 */
export type ObjectUnionVariant<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> = ObjectWidgetConfig<
  TKey,
  TUsage,
  "object",
  ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
>;

/**
 * Constraint for object union variant arrays
 * Defines the shape for discriminated union variants
 */
export type UnionObjectWidgetConfigConstrain<
  TKey extends string,
  TUsage extends FieldUsageConfig,
> = readonly [
  ObjectUnionVariant<TKey, TUsage>,
  ...ObjectUnionVariant<TKey, TUsage>[],
];

/**
 * Infer output type from a UnifiedField based on usage
 */
type InferFieldOutput<
  TField extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >,
  TUsage extends FieldUsage = FieldUsage.ResponseData,
> = z.output<InferSchemaFromField<TField, TUsage>>;

/**
 * Infer output type from children field
 * Returns WidgetData-compatible object type
 */
export type InferChildrenOutput<TChildren> =
  // For Record of fields -> object output (structural: any value with BaseWidgetConfig shape)
  TChildren extends Record<
    string,
    BaseWidgetConfig<FieldUsageConfig, SchemaTypes>
  >
    ? {
        [K in keyof TChildren]: InferChildOutput<TChildren[K]>;
      }
    : never;

/**
 * Infer output type from single child field (structural matching)
 * Returns WidgetData-compatible types
 */
export type InferChildOutput<TChild> =
  // Primitive field with schema
  TChild extends { schema: infer TSchema extends z.ZodTypeAny }
    ? z.output<TSchema>
    : // Object field with children
      TChild extends { children: infer TChildren }
      ? InferChildrenOutput<TChildren>
      : // Array field with child
        TChild extends { child: infer TGrandChild }
        ? Array<InferChildOutput<TGrandChild>>
        : never;

/**
 * Infer output type from union/variant field
 */
type InferUnionType<TVariants> =
  TVariants extends Record<
    string,
    UnifiedField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >
    ? InferFieldOutput<TVariants[keyof TVariants]>
    : never;
