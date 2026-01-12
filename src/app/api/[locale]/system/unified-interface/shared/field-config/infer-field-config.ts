/**
 * Field Config Inference from Endpoint Definitions
 *
 * This module provides runtime inference of FieldConfig from endpoint field definitions.
 * It extracts the WidgetConfig from UnifiedField and converts it to FieldConfig.
 */

import { FieldDataType, WidgetType } from "../types/enums";
import {
  type EndpointFieldStructure,
  getFieldStructureByPath,
} from "./endpoint-field-types";
import type { FieldConfig } from "./field-config-types";

/**
 * Extract FieldConfig from a UnifiedField's WidgetConfig
 * Converts FieldDataType to the appropriate FieldConfig type
 */
function extractFieldConfig<TKey extends string>(
  field: EndpointFieldStructure<TKey>,
): FieldConfig<TKey> | null {
  if (!field?.ui) {
    return null;
  }

  const widget = field.ui;

  // Only process FORM_FIELD widgets
  if (widget.type !== WidgetType.FORM_FIELD) {
    return null;
  }

  // Type assertion: widget properties are TranslationKeys at runtime
  // but typed as string due to the generic nature of EndpointFieldStructure
  const baseConfig = {
    label: widget.label,
    placeholder: widget.placeholder,
    description: widget.description,
    disabled: widget.disabled,
    className: widget.className,
    // Readonly and prefill display options
    readonly: widget.readonly,
    prefillDisplay: widget.prefillDisplay,
  };

  // Map FieldDataType to FieldConfig
  switch (widget.fieldType) {
    case FieldDataType.TEXT:
      return { ...baseConfig, type: "text" as const };

    case FieldDataType.EMAIL:
      return { ...baseConfig, type: "email" as const };

    case FieldDataType.PHONE:
      return {
        ...baseConfig,
        type: "phone" as const,
        defaultCountry: widget.defaultCountry || "GLOBAL",
        preferredCountries: widget.preferredCountries || ["GLOBAL"],
      };

    case FieldDataType.URL:
      return { ...baseConfig, type: "url" as const };

    case FieldDataType.PASSWORD:
      return { ...baseConfig, type: "password" as const };

    case FieldDataType.NUMBER:
    case FieldDataType.INT:
      return {
        ...baseConfig,
        type: "number" as const,
        min: widget.min,
        max: widget.max,
        step: widget.step,
      };

    case FieldDataType.BOOLEAN:
      return { ...baseConfig, type: "checkbox" as const };

    case FieldDataType.DATE:
    case FieldDataType.DATETIME:
      return {
        ...baseConfig,
        type: "date" as const,
        minDate: widget.minDate,
        maxDate: widget.maxDate,
      };

    case FieldDataType.TEXTAREA:
      return {
        ...baseConfig,
        type: "textarea" as const,
        rows: widget.rows,
        maxLength: widget.maxLength,
      };

    case FieldDataType.SELECT:
    case FieldDataType.CURRENCY_SELECT:
    case FieldDataType.LANGUAGE_SELECT:
    case FieldDataType.COUNTRY_SELECT:
    case FieldDataType.TIMEZONE:
      return {
        ...baseConfig,
        type: "select" as const,
        options:
          widget.options?.map((opt) => ({
            value: String(opt.value),
            label: opt.label,
            labelParams: opt.labelParams,
            disabled: opt.disabled,
          })) || [],
      };

    case FieldDataType.MULTISELECT:
      return {
        ...baseConfig,
        type: "multiselect" as const,
        options:
          widget.options?.map((opt) => ({
            value: String(opt.value),
            label: opt.label,
            disabled: opt.disabled,
            icon: opt.icon,
          })) || [],
      };

    case FieldDataType.COLOR:
      return { ...baseConfig, type: "color" as const };

    case FieldDataType.SLIDER:
      return {
        ...baseConfig,
        type: "slider" as const,
        min: widget.min || 0,
        max: widget.max || 100,
        step: widget.step || 1,
      };

    case FieldDataType.TAGS:
      return {
        ...baseConfig,
        type: "tags" as const,
        maxTags: widget.maxTags,
      };

    case FieldDataType.ICON:
      return { ...baseConfig, type: "icon" as const };

    case FieldDataType.FILTER_PILLS:
      return {
        ...baseConfig,
        type: "filter_pills" as const,
        options:
          widget.options?.map((opt) => ({
            value: String(opt.value),
            label: opt.label,
            icon: opt.icon,
            disabled: opt.disabled,
          })) || [],
      };

    case FieldDataType.RANGE_SLIDER:
      return {
        ...baseConfig,
        type: "range_slider" as const,
        options: widget.options,
        minLabel: widget.minLabel,
        maxLabel: widget.maxLabel,
        minDefault: widget.minDefault,
        maxDefault: widget.maxDefault,
      };

    default:
      // Fallback to text field
      return { ...baseConfig, type: "text" as const };
  }
}

/**
 * Get FieldConfig for a specific field path in endpoint fields
 * This is the main function used by EndpointFormField
 */
export function getFieldConfig<TKey extends string>(
  fields: EndpointFieldStructure<TKey>,
  path: string,
): FieldConfig<TKey> | null {
  const field = getFieldStructureByPath(fields, path);
  if (!field) {
    return null;
  }
  return extractFieldConfig(field);
}
