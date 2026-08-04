/**
 * Scoped-Translation Field Utilities
 *
 * i18n-aware field creators. Each takes a `scopedTranslation` as its first
 * argument purely for type inference: it constrains label/description/placeholder
 * to that scope's translation keys. Nothing here uses translations at runtime.
 *
 * The i18n-free counterparts (which take literal strings instead of keys) live in
 * `./utils`, alongside the schema utilities shared by both modules.
 */

import type { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import { type SpacingSize, WidgetType } from "../../core/definition/enums";
import type { IconKey } from "../widgets/form-fields/icon-field/icons";
import type { NavigateButtonWidgetConfig } from "../widgets/interactive/navigate-button/types";
import type { SearchBarWidgetConfig } from "../widgets/interactive/search-bar/types";
import type { SubmitButtonWidgetConfig } from "../widgets/interactive/submit-button/types";
import type {
  ArrayWidgetConfig,
  DisplayOnlyWidgetConfig,
  FormFieldWidgetConfig,
  ObjectUnionWidgetConfig,
  ObjectWidgetConfig,
  RequestResponseWidgetConfig,
} from "./configs";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "./types";
import type { DistributiveOmit } from "./utils";

/**
 * Scoped translation object type for type inference
 */
interface ScopedTranslationType<TKey extends string = string> {
  ScopedTranslationKey: TKey;
}

/**
 * Create a widget-only field for scoped translations
 */
export function widgetField<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
  const TUIConfig extends DistributiveOmit<
    DisplayOnlyWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TUsage,
      "widget"
    >,
    "schemaType" | "schema"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
): TUIConfig & { schemaType: "widget"; schema: never } {
  return {
    schemaType: "widget" as const,
    schema: undefined as never,
    ...ui,
  };
}

/**
 * Create an array field for scoped translations
 */
export function arrayField<
  TScopedTranslation extends ScopedTranslationType,
  TChild extends AnyChildrenConstrain<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<TUsage>
  >,
  TUsage extends FieldUsageConfig,
  const TUIConfig extends ArrayWidgetConfig<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    TUsage,
    "array",
    TChild
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  usage: TUsage,
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array";
  child: TChild;
  usage: TUsage;
} {
  return {
    ...ui,
    schemaType: "array" as const,
    child,
    usage,
  };
}

/**
 * Create an optional object field for scoped translations
 */
export function objectOptionalField<
  TScopedTranslation extends ScopedTranslationType,
  TFieldUsageConfig extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<TFieldUsageConfig>
  >,
  const TUIConfig extends DistributiveOmit<
    ObjectWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TFieldUsageConfig,
      "object-optional",
      TChildren
    >,
    "schemaType"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TUIConfig,
): TUIConfig & {
  schemaType: "object-optional";
} {
  return {
    schemaType: "object-optional" as const,
    ...config,
  };
}

/**
 * Create a discriminated union object field for scoped translations
 */
export function objectUnionField<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
  TDiscriminator extends string,
  const TVariants extends UnionObjectWidgetConfigConstrain<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<TUsage>
  >,
  const TUIConfig extends DistributiveOmit<
    ObjectUnionWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TUsage,
      TVariants
    >,
    "usage" | "discriminator" | "variants" | "schemaType"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  usage: TUsage,
  discriminator: TDiscriminator,
  variants: TVariants,
): TUIConfig & {
  schemaType: "object-union";
  discriminator: TDiscriminator;
  variants: TVariants;
  usage: TUsage;
} {
  return {
    schemaType: "object-union" as const,
    discriminator,
    variants,
    usage,
    ...ui,
  };
}

/**
 * Create an optional request array field for scoped translations
 */
export function requestDataArrayOptionalField<
  TScopedTranslation extends ScopedTranslationType,
  TChild extends ArrayChildConstraint<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >,
  const TUIConfig extends DistributiveOmit<
    ArrayWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      { request: "data"; response?: never },
      "array-optional",
      TChild
    >,
    "child" | "schemaType" | "usage"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  ui: TUIConfig,
  child: TChild,
): TUIConfig & {
  schemaType: "array-optional";
  child: TChild;
  usage: { request: "data"; response?: never };
} {
  return {
    ...ui,
    schemaType: "array-optional" as const,
    child,
    usage: { request: "data" },
  };
}

/**
 * Scoped request field creator
 * Used with scoped translations for type-safe translation keys
 * Accepts all form field widgets - type safety is enforced by individual widget configs
 */
export function requestField<
  TScopedTranslation extends ScopedTranslationType,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    FormFieldWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
 * Scoped search bar field creator
 * Creates a SEARCH_BAR widget field with schema validation.
 * Use size "xl" for hero/start-page search, "default" for results-page compact bar.
 */
export function searchBarField<
  TScopedTranslation extends ScopedTranslationType,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    SearchBarWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TSchema,
      { request: "data"; response?: never },
      "primitive"
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
export function responseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    RequestResponseWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
export function requestResponseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    FormFieldWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TSchema,
      { request: "data" }
    >,
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
export function requestUrlPathParamsField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    FormFieldWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
export function requestUrlPathParamsResponseField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TSchema extends z.ZodTypeAny,
  const TConfig extends DistributiveOmit<
    FormFieldWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TSchema,
      { request: "urlPathParams" }
    >,
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
 * Scoped response array optional field creator (NEW FLAT API)
 * Creates optional array fields with scoped translation keys
 * Config includes usage and child directly
 */
export function responseArrayOptionalField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends DistributiveOmit<
    ArrayWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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

/**
 * Scoped object field creator (NEW FLAT API)
 * Single config param includes usage + children. First param is scopedTranslation for type inference.
 */
export function objectField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TUsage extends FieldUsageConfig,
  const TConfig extends DistributiveOmit<
    ObjectWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
      TUsage,
      "object",
      ObjectChildrenConstraint<
        NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
 * Scoped response array field (NEW FLAT API)
 */
export function responseArrayField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<{ request?: never; response: true }>
  >,
  const TConfig extends DistributiveOmit<
    ArrayWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
 * Scoped request data array field (NEW FLAT API)
 */
export function requestDataArrayField<
  TScopedTranslation extends ScopedTranslationType<string>,
  TChild extends ArrayChildConstraint<
    NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
    ConstrainedChildUsage<{ request: "data"; response?: never }>
  >,
  const TConfig extends DistributiveOmit<
    ArrayWidgetConfig<
      NoInfer<TScopedTranslation["ScopedTranslationKey"]>,
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
 * `customWidgetObject` infers its key type from the config and never took a
 * scopedTranslation, so it serves scoped and literal callers identically.
 * Re-exported here rather than duplicated, so definitions that use it alongside
 * the scoped creators can keep a single import.
 */
export { customWidgetObject } from "./utils";

// ============================================================================
// NAVIGATION BUTTON FIELD HELPERS
// ============================================================================

/**
 * Scoped navigate button field for cross-definition navigation with scoped translations
 */
export function navigateButtonField<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny,
  TGetEndpoint extends CreateApiEndpointAny | undefined = undefined,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: Omit<
    NavigateButtonWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "widget",
      TTargetEndpoint,
      TGetEndpoint
    >,
    "schemaType" | "type"
  >,
): NavigateButtonWidgetConfig<
  TScopedTranslation["ScopedTranslationKey"],
  TUsage,
  "widget",
  TTargetEndpoint,
  TGetEndpoint
> {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.NAVIGATE_BUTTON,
    label: config.label,
    icon: config.icon,
    variant: config.variant ?? "outline",
    size: config.size,
    className: config.className,
    inline: config.inline,
    hidden: config.hidden,
    order: config.order,
    columns: config.columns,
    targetEndpoint: config.targetEndpoint,
    extractParams: config.extractParams,
    prefillFromGet: config.prefillFromGet,
    getEndpoint: config.getEndpoint,
    renderInModal: config.renderInModal,
    popNavigationOnSuccess: config.popNavigationOnSuccess,
  };
}

/**
 * Scoped delete button for scoped translations
 */
export function deleteButton<
  TScopedTranslation extends ScopedTranslationType,
  TTargetEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>(
  _scopedTranslation: TScopedTranslation,
  config: Omit<
    NavigateButtonWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "widget",
      TTargetEndpoint,
      undefined
    >,
    "schemaType" | "type" | "getEndpoint" | "prefillFromGet"
  >,
): NavigateButtonWidgetConfig<
  TScopedTranslation["ScopedTranslationKey"],
  TUsage,
  "widget",
  TTargetEndpoint,
  undefined
> {
  return navigateButtonField<
    TScopedTranslation,
    TUsage,
    TTargetEndpoint,
    undefined
  >(_scopedTranslation, {
    ...config,
    renderInModal: true,
    icon: config.icon ?? "trash",
    variant: config.variant ?? "destructive",
    popNavigationOnSuccess: config.popNavigationOnSuccess,
  });
}

/**
 * Scoped back button for scoped translations
 */
export function backButton<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
  const TConfig extends Omit<
    NavigateButtonWidgetConfig<
      TScopedTranslation["ScopedTranslationKey"],
      TUsage,
      "widget",
      undefined,
      undefined
    >,
    "schemaType" | "type" | "targetEndpoint" | "getEndpoint" | "prefillFromGet"
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: TConfig,
): TConfig & {
  schemaType: "widget";
  type: WidgetType.NAVIGATE_BUTTON;
  targetEndpoint: undefined;
  getEndpoint: undefined;
  prefillFromGet: false;
} {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.NAVIGATE_BUTTON,
    label: config?.label,
    icon: config?.icon ?? ("arrow-left" as const),
    variant: config?.variant ?? ("outline" as const),
    size: config?.size,
    className: config?.className,
    inline: config?.inline,
    hidden: config?.hidden,
    order: config?.order,
    columns: config?.columns,
    targetEndpoint: undefined,
    extractParams: undefined,
    prefillFromGet: false,
    getEndpoint: undefined,
    renderInModal: false,
    popNavigationOnSuccess: undefined,
  } as TConfig & {
    schemaType: "widget";
    type: WidgetType.NAVIGATE_BUTTON;
    targetEndpoint: undefined;
    getEndpoint: undefined;
    prefillFromGet: false;
  };
}

/**
 * Scoped submit button for scoped translations
 */
export function submitButton<
  TScopedTranslation extends ScopedTranslationType,
  TUsage extends FieldUsageConfig,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used for type inference only
  _scopedTranslation: TScopedTranslation,
  config: {
    label?: TScopedTranslation["ScopedTranslationKey"];
    loadingText?: TScopedTranslation["ScopedTranslationKey"];
    icon?: IconKey;
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "destructive"
      | "ghost"
      | "outline"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
    iconSize?: "xs" | "sm" | "base" | "lg";
    iconSpacing?: SpacingSize;
    usage: TUsage;
    className?: string;
    inline?: boolean;
  },
): SubmitButtonWidgetConfig<
  TScopedTranslation["ScopedTranslationKey"],
  TUsage,
  "widget"
> {
  return {
    schemaType: "widget" as const,
    usage: config.usage,
    type: WidgetType.SUBMIT_BUTTON,
    text: config.label,
    loadingText: config.loadingText,
    icon: config.icon,
    variant: config.variant ?? "default",
    size: config.size ?? "default",
    iconSize: config.iconSize,
    iconSpacing: config.iconSpacing,
    className: config.className,
    inline: config.inline,
  };
}
