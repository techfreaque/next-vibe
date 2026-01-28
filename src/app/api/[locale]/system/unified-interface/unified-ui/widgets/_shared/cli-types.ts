/**
 * Ink Widget Types
 *
 * Type definitions for Ink-based terminal UI widgets.
 * Mirrors React widget architecture for consistency.
 */

import type { z } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { UnifiedField } from "../../../shared/widgets/configs";
import type {
  BaseWidgetContext,
  BaseWidgetProps,
  FieldUsageConfig,
} from "./types";

// Re-export for convenience
export type { FieldUsageConfig };

/**
 * Ink form state management (simplified version of UseFormReturn)
 */
export interface InkFormState<TFormData> {
  values: Partial<TFormData>;
  setValue: <TValue>(name: string, value: TValue) => void;
  getValue: <TValue>(name: string) => TValue | undefined;
  errors: Record<string, string | undefined>;
}

/**
 * CLI/Ink-specific widget context
 * Extends base context with CLI-specific form implementation
 */
export type InkWidgetContext<TEndpoint extends CreateApiEndpointAny> =
  BaseWidgetContext<TEndpoint> & {
    form?: InkFormState<TEndpoint["types"]["RequestOutput"]>;
    onSubmit?: () => void;
    isSubmitting?: boolean;
  };

/**
 * Props for InkWidgetRenderer component
 * Receives fields WITHOUT values, will augment them internally
 */
export interface InkWidgetRendererProps<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    // oxlint-disable-next-line typescript/no-explicit-any
    any
  >,
> {
  fieldName: string;
  field: TWidgetConfig;
  context: InkWidgetContext<TEndpoint>;
}

/**
 * Ink-specific widget props. Uses BaseWidgetProps with InkWidgetContext.
 * Receives fields WITH values from the renderer
 */
export interface InkWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    // oxlint-disable-next-line typescript/no-explicit-any
    any
  >,
> extends BaseWidgetProps<TEndpoint, TWidgetConfig> {
  context: InkWidgetContext<TEndpoint>;
}
