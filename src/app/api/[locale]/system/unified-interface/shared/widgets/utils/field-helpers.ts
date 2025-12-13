import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";

/**
 * Check if field is used for request (form input)
 */
export function isRequestField(field: UnifiedField): boolean {
  if ('usage' in field && field.usage && typeof field.usage === 'object') {
    return 'request' in field.usage && field.usage.request !== undefined;
  }
  return false;
}

/**
 * Check if field is an actual form input field (FORM_FIELD widget with request usage)
 * Used to determine if a container should show auto submit buttons
 */
export function isFormInputField(field: UnifiedField): boolean {
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
export function isResponseField(field: UnifiedField): boolean {
  if ('usage' in field && field.usage && typeof field.usage === 'object') {
    return 'response' in field.usage && field.usage.response === true;
  }
  return false;
}

/**
 * Get field name for form binding
 */
export function getFieldName(field: UnifiedField): string {
  if ('name' in field && typeof field.name === 'string') {
    return field.name;
  }
  if ('apiKey' in field && typeof field.apiKey === 'string') {
    return field.apiKey;
  }
  if ('uiKey' in field && typeof field.uiKey === 'string') {
    return field.uiKey;
  }
  return 'value';
}

/**
 * Get field placeholder text
 */
export function getFieldPlaceholder(field: UnifiedField): string | undefined {
  if ('ui' in field && field.ui && typeof field.ui === 'object' && 'placeholder' in field.ui && typeof field.ui.placeholder === 'string') {
    return field.ui.placeholder;
  }
  return undefined;
}

/**
 * Check if field is required
 */
export function isFieldRequired(field: UnifiedField): boolean {
  if ('required' in field && typeof field.required === 'boolean') {
    return field.required;
  }
  return false;
}
