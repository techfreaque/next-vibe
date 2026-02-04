/**
 * Ink Widget Types
 *
 * Type definitions for Ink-based terminal UI widgets.
 * Mirrors React widget architecture for consistency.
 */

import type { FieldValues, UseFormReturn } from "react-hook-form";
import type z from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { UnifiedField } from "../../../shared/widgets/configs";
import type {
  AnyChildrenConstrain,
  BaseWidgetContext,
  BaseWidgetProps,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "./types";

// Re-export for convenience
export type { FieldUsageConfig };

/**
 * Ink form state management (simplified version of UseFormReturn)
 * Unlike React Hook Form which uses Path<T> branded types, this accepts plain strings
 * for field names to keep CLI implementation simple.
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
 * Props for InkWidgetRenderer component.
 * Receives fields WITH values already added by the endpoint renderer.
 * field is DispatchField — UnifiedField union + value for switch-based dispatch.
 * fieldName is `string` (not Path) — CLI forms use plain string keys, not
 * react-hook-form branded paths.
 */
export interface InkWidgetRendererProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TEndpoint needed for generic constraint
  TEndpoint extends CreateApiEndpointAny,
> {
  fieldName: string;
  field: DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >;
}

/**
 * Ink-specific widget props. Uses BaseWidgetProps with InkWidgetContext.
 * Receives fields WITH values from the renderer
 */
export type InkWidgetProps<
  TEndpoint extends CreateApiEndpointAny,
  TWidgetConfig extends UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >,
> = BaseWidgetProps<TEndpoint, TWidgetConfig>;

/**
 * Type guard to check if a form is InkFormState
 */
export function isInkFormState<TFormData extends FieldValues>(
  form: InkFormState<TFormData> | UseFormReturn<TFormData> | null | undefined,
): form is InkFormState<TFormData> {
  return (
    form !== null &&
    form !== undefined &&
    typeof form === "object" &&
    "values" in form &&
    "setValue" in form &&
    "getValue" in form &&
    "errors" in form &&
    !("formState" in form)
  );
}
