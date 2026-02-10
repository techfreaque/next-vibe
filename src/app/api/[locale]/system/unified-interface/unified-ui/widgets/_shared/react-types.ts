import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import type { UnifiedField } from "../../../shared/widgets/configs";
import type {
  CancelButtonConfig,
  SubmitButtonConfig,
} from "../../renderers/react/EndpointRenderer";
import type {
  AnyChildrenConstrain,
  BaseWidgetContext,
  BaseWidgetProps,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "./types";

/**
 * React-specific widget context
 * Extends base context with React-specific form handlers
 */
export type ReactWidgetContext<TEndpoint extends CreateApiEndpointAny> =
  BaseWidgetContext<TEndpoint> & {
    form: UseFormReturn<
      TEndpoint["types"]["RequestOutput"] extends never
        ? TEndpoint["types"]["UrlVariablesOutput"] extends never
          ? // oxlint-disable-next-line typescript/no-empty-object-type
            {}
          : TEndpoint["types"]["UrlVariablesOutput"]
        : TEndpoint["types"]["UrlVariablesOutput"] extends never
          ? TEndpoint["types"]["RequestOutput"]
          : TEndpoint["types"]["RequestOutput"] &
              TEndpoint["types"]["UrlVariablesOutput"]
    >;
    onSubmit?: () => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    submitButton?: SubmitButtonConfig;
    cancelButton?: CancelButtonConfig;
  };

/**
 * React-specific widget props. Uses BaseWidgetProps with ReactWidgetContext.
 * Distributive conditional to allow any UnifiedField member while preserving types
 */
export type ReactWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> = BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>;

/**
 * React widget props for form fields and static widgets that don't need value
 * Used for widgets that use react-hook-form or don't have dynamic values
 */
export interface ReactWidgetPropsNoValue<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  fieldName: BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["fieldName"];
  field: Omit<
    BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["field"],
    "value" | "type" | "schemaType" | "usage"
  >;
  inlineButtonInfo?: BaseWidgetProps<
    TEndpoint,
    TUsage,
    TWidgetConfig
  >["inlineButtonInfo"];
}

/**
 * Clean field type for form fields (with fieldName, no value, type, schemaType, usage)
 * Used in widget implementations that are called directly (not through switches)
 */
export interface ReactFormFieldProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  fieldName: BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["fieldName"];
  field: Omit<
    BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["field"],
    "value" | "type" | "schemaType" | "usage" | "fieldType"
  >;
  inlineButtonInfo?: BaseWidgetProps<
    TEndpoint,
    TUsage,
    TWidgetConfig
  >["inlineButtonInfo"];
}

/**

 */
export interface ReactRequestResponseWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  fieldName: BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["fieldName"];
  field: Omit<
    BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["field"],
    "type" | "schemaType"
  >;
  inlineButtonInfo?: BaseWidgetProps<
    TEndpoint,
    TUsage,
    TWidgetConfig
  >["inlineButtonInfo"];
}

/**
 * Clean field type for display widgets (no fieldName, no type, schemaType, usage)
 * Used in widget implementations that are called directly (not through switches)
 */
export interface ReactDisplayWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  field: Omit<
    BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["field"],
    "type" | "schemaType" | "usage"
  >;
  inlineButtonInfo?: BaseWidgetProps<
    TEndpoint,
    TUsage,
    TWidgetConfig
  >["inlineButtonInfo"];
}

/**
 * Clean field type for static widgets (no fieldName, no value, no type, schemaType, usage)
 * Used for widgets like FormAlertWidget that don't need any of these properties
 */
export interface ReactStaticWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    TUsage,
    AnyChildrenConstrain<string, ConstrainedChildUsage<TUsage>>
  >,
> {
  field: Omit<
    BaseWidgetProps<TEndpoint, TUsage, TWidgetConfig>["field"],
    "value" | "type" | "schemaType" | "usage"
  >;
  inlineButtonInfo?: BaseWidgetProps<
    TEndpoint,
    TUsage,
    TWidgetConfig
  >["inlineButtonInfo"];
}

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  locale: CountryLanguage;
  fallback?: React.ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
