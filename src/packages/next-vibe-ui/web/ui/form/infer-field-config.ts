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
import type { Countries } from "@/i18n/core/config";

import type { FieldConfig } from "./endpoint-form-field-types";

/**
 * Navigate through nested field structure to find a field by path
 * Handles dot notation like "credentials.email"
 */
export function getFieldByPath(fields: any, path: string): any | null {
  const parts = path.split(".");
  let current = fields;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return null;
    }

    // Navigate through object children
    if (current.type === "object" && current.children) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Extract FieldConfig from a UnifiedField's WidgetConfig
 * Converts FieldDataType to the appropriate FieldConfig type
 */
export function extractFieldConfig(field: any): FieldConfig | null {
  if (!field?.ui) {
    return null;
  }

  const widget = field.ui;

  // Only process FORM_FIELD widgets
  if (widget.type !== WidgetType.FORM_FIELD) {
    return null;
  }

  const baseConfig = {
    label: widget.label,
    placeholder: widget.placeholder,
    description: widget.description,
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
        defaultCountry: widget.defaultCountry || ("GLOBAL" as Countries),
        preferredCountries:
          widget.preferredCountries || (["GLOBAL"] as Countries[]),
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
          widget.options?.map((opt: any) => ({
            value: String(opt.value),
            label: opt.label,
            disabled: opt.disabled,
          })) || [],
      };

    case FieldDataType.MULTISELECT:
      return {
        ...baseConfig,
        type: "multiselect" as const,
        options:
          widget.options?.map((opt: any) => ({
            value: String(opt.value),
            label: opt.label,
            disabled: opt.disabled,
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

    default:
      // Fallback to text field
      return { ...baseConfig, type: "text" as const };
  }
}

/**
 * Get FieldConfig for a specific field path in endpoint fields
 * This is the main function used by EndpointFormField
 */
export function getFieldConfig(fields: any, path: string): FieldConfig | null {
  const field = getFieldByPath(fields, path);
  if (!field) {
    return null;
  }
  return extractFieldConfig(field);
}
