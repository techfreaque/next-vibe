/**
 * Ink Widget Types
 *
 * Type definitions for Ink-based terminal UI widgets.
 * Mirrors React widget architecture for consistency.
 */

import type { MutableRefObject } from "react";
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
    /** Currently focused field name — only this field should accept input */
    focusedField?: string;
    /** Move focus to the next/previous field */
    moveFocus?: (direction: "next" | "prev") => void;
    /**
     * Async hook called before submit. If set, the renderer awaits this
     * before calling onSubmit. Widget.cli.tsx uses this to e.g. do a
     * remote login and inject a token before validation runs.
     * Return false to abort the submit.
     */
    preSubmitRef?: MutableRefObject<(() => Promise<boolean>) | undefined>;
  };

/**
 * Props for InkWidgetRenderer component.
 * Receives fields WITH values already added by the endpoint renderer.
 * field is DispatchField — UnifiedField union + value for switch-based dispatch.
 * fieldName is `string` (not Path) — CLI forms use plain string keys, not
 * react-hook-form branded paths.
 */
export interface InkWidgetRendererProps {
  fieldName: string;
  // TKey is string at the dispatch boundary — individual widgets narrow to ScopedKey
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
 * Distributive conditional to allow any UnifiedField member while preserving types
 */
export type InkWidgetProps<
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
