/**
 * Ink Widget Types
 *
 * Type definitions for Ink-based terminal UI widgets.
 * Mirrors React widget architecture for consistency.
 */

import type { MutableRefObject } from "react";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { BaseWidgetContext } from "./types";

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
    /** Currently focused field name - only this field should accept input */
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
