import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type { CreateApiEndpointAny, UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";

/**
 * Check if field is used for request (form input)
 */
export function isRequestField<TKey extends string>(field: UnifiedField<TKey>): boolean {
  if ("usage" in field && field.usage && typeof field.usage === "object") {
    return "request" in field.usage && field.usage.request !== undefined;
  }
  return false;
}

/**
 * Check if field is an actual form input field (FORM_FIELD widget with request usage)
 * Used to determine if a container should show auto submit buttons
 */
export function isFormInputField<TKey extends string>(field: UnifiedField<TKey>): boolean {
  // Must be a FORM_FIELD widget type
  if (field.ui?.type !== WidgetType.FORM_FIELD) {
    return false;
  }
  // Must have request usage
  return isRequestField(field);
}

/**
 * Check if field is used for response (display output)
 */
export function isResponseField<TKey extends string>(field: UnifiedField<TKey>): boolean {
  if ("usage" in field && field.usage && typeof field.usage === "object") {
    return "response" in field.usage && field.usage.response === true;
  }
  return false;
}

/**
 * Get field name for form binding
 */
export function getFieldName<TKey extends string>(field: UnifiedField<TKey>): string {
  if ("name" in field && typeof field.name === "string") {
    return field.name;
  }
  if ("apiKey" in field && typeof field.apiKey === "string") {
    return field.apiKey;
  }
  if ("uiKey" in field && typeof field.uiKey === "string") {
    return field.uiKey;
  }
  return "value";
}

/**
 * Get field placeholder text
 */
export function getFieldPlaceholder<TKey extends string>(
  field: UnifiedField<TKey>,
): string | undefined {
  if (
    "ui" in field &&
    field.ui &&
    typeof field.ui === "object" &&
    "placeholder" in field.ui &&
    typeof field.ui.placeholder === "string"
  ) {
    return field.ui.placeholder;
  }
  return undefined;
}

/**
 * Check if field is required
 */
export function isFieldRequired<TKey extends string>(field: UnifiedField<TKey>): boolean {
  if ("required" in field && typeof field.required === "boolean") {
    return field.required;
  }
  return false;
}

export function getTranslatorFromEndpoint<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
): (locale: CountryLanguage) => {
  t: <K extends string>(key: K, params?: TParams) => string;
} {
  return endpoint.scopedTranslation.scopedT as (locale: CountryLanguage) => {
    t: <K extends string>(key: K, params?: TParams) => string;
  };
}
