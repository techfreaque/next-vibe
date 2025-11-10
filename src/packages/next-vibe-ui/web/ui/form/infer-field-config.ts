/**
 * Field Config Inference from Endpoint Definitions
 *
 * This module provides runtime inference of FieldConfig from endpoint field definitions.
 * It extracts the WidgetConfig from UnifiedField and converts it to FieldConfig.
 */

import {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import type { FieldConfig } from "./endpoint-form-field-types";
import {
  type EndpointFieldStructure,
  getFieldStructureByPath,
} from "./endpoint-field-types";

// Re-export for external use
export type { EndpointFieldStructure };

/**
 * Navigate through nested field structure to find a field by path
 * Handles dot notation like "credentials.email"
 *
 * @deprecated Use getFieldStructureByPath from endpoint-field-types.ts instead
 */
export function getFieldByPath(
  fields: EndpointFieldStructure,
  path: string,
): EndpointFieldStructure | null {
  return getFieldStructureByPath(fields, path);
}

/**
 * Extract FieldConfig from a UnifiedField's WidgetConfig
 * Converts FieldDataType to the appropriate FieldConfig type
 */
export function extractFieldConfig(
  field: EndpointFieldStructure,
): FieldConfig | null {
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
    label: widget.label as FieldConfig["label"],
    placeholder: widget.placeholder as FieldConfig["placeholder"],
    description: widget.description as FieldConfig["description"],
    disabled: widget.disabled,
    className: widget.className,
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
            label: opt.label as FieldConfig["label"],
            labelParams: opt.labelParams,
            disabled: opt.disabled,
          })) || [],
      } as FieldConfig;

    case FieldDataType.MULTISELECT:
      return {
        ...baseConfig,
        type: "multiselect" as const,
        options:
          widget.options?.map((opt) => ({
            value: String(opt.value),
            label: opt.label as FieldConfig["label"],
            disabled: opt.disabled,
            icon: opt.icon,
          })) || [],
      } as FieldConfig;

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

    default:
      // Fallback to text field
      return { ...baseConfig, type: "text" as const };
  }
}

/**
 * Get FieldConfig for a specific field path in endpoint fields
 * This is the main function used by EndpointFormField
 */
export function getFieldConfig(
  fields: EndpointFieldStructure,
  path: string,
): FieldConfig | null {
  const field = getFieldByPath(fields, path);
  if (!field) {
    return null;
  }
  return extractFieldConfig(field);
}
