/**
 * Shared validation utilities for form field widgets
 */

import type { FieldValidationState } from "@/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types";

/**
 * Form field error interface
 */
export interface FormFieldError {
  message?: string;
  type?: string;
}

/**
 * Get field validation state from value and error
 * Determines if field has value, error, and is required
 */
export function getFieldValidationState<T>(
  fieldValue: T,
  error: FormFieldError | undefined,
  isRequired: boolean,
): FieldValidationState {
  const hasValue = Boolean(
    fieldValue !== undefined &&
    fieldValue !== null &&
    fieldValue !== "" &&
    (Array.isArray(fieldValue) ? fieldValue.length > 0 : true),
  );

  return {
    hasError: Boolean(error),
    hasValue,
    isRequired,
    errorMessage: error?.message,
  };
}
