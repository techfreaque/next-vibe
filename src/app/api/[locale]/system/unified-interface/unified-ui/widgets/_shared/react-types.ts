import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";

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
  FieldUsageConfig,
} from "./types";

/**
 * React-specific widget context
 * Extends base context with React-specific form handlers
 */
export type ReactWidgetContext<TEndpoint extends CreateApiEndpointAny> =
  BaseWidgetContext<TEndpoint> & {
    form?: UseFormReturn<TEndpoint["types"]["RequestOutput"]>;
    onSubmit?: () => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    submitButton?: SubmitButtonConfig;
    cancelButton?: CancelButtonConfig;
  };

/**
 * React-specific widget props. Uses BaseWidgetProps with ReactWidgetContext.
 * TWidgetConfig constraint is inherited from BaseWidgetProps.
 */
export interface ReactWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    ZodType,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
> extends BaseWidgetProps<TEndpoint, TWidgetConfig> {
  context: ReactWidgetContext<TEndpoint>;
}

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  locale: CountryLanguage;
  fallback?: React.ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
