/**
 * Type utilities for extracting field names and types from endpoint definitions
 * Provides full type inference from definition.POST.fields to form components
 */

import type { Countries } from "@/i18n/core/config";

import type { PrefillDisplayConfig } from "./field-config-types";

/**
 * Type for endpoint field structure from unified interface
 * This matches the structure created by objectField() in endpoint definitions
 */

export interface EndpointFieldStructure<TKey extends string> {
  type?: string;
  children?: Record<string, EndpointFieldStructure<TKey>>;
  // Union-specific fields
  discriminator?: string;
  variants?: readonly EndpointFieldStructure<TKey>[];
  ui?: {
    type: string;
    fieldType?: string;
    label?: TKey;
    placeholder?: TKey;
    description?: TKey;
    disabled?: boolean;
    className?: string;
    defaultCountry?: Countries;
    preferredCountries?: Countries[];
    min?: number;
    max?: number;
    step?: number;
    minDate?: Date;
    maxDate?: Date;
    rows?: number;
    maxLength?: number;
    options?: Array<{
      value: string | number;
      label: TKey;
      labelParams?: Record<string, string | number>;
      disabled?: boolean;
      icon?: string;
    }>;
    maxTags?: number;
    // Readonly and prefill display options
    readonly?: boolean;
    prefillDisplay?: PrefillDisplayConfig<TKey>;
  };
}
/**
 * Get runtime field structure by path
 * Supports object, object-optional, and object-union types
 */
export function getFieldStructureByPath<TKey extends string>(
  fields: EndpointFieldStructure<TKey>,
  path: string,
): EndpointFieldStructure<TKey> | null {
  const parts = path.split(".");
  let current = fields;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return null;
    }

    // Handle object-union types
    if (current.type === "object-union") {
      const unionField = current as EndpointFieldStructure<TKey> & {
        variants?: readonly EndpointFieldStructure<TKey>[];
      };

      // Look for the field in any variant (all variants should have the discriminator field)
      // For other fields, we return the first match (assuming variants have consistent field definitions)
      if (unionField.variants && Array.isArray(unionField.variants)) {
        for (const variant of unionField.variants) {
          if (variant.type === "object" || variant.type === "object-optional") {
            const variantChildren = variant.children as
              | Record<string, EndpointFieldStructure<TKey>>
              | undefined;
            if (variantChildren && part in variantChildren) {
              current = variantChildren[part];
              break; // Found in this variant, continue with next part
            }
          }
        }
        // If not found in any variant, return null
        if (!current || current === fields) {
          return null;
        }
      } else {
        return null;
      }
    }
    // Navigate through object children (both object and object-optional)
    else if (
      (current.type === "object" || current.type === "object-optional") &&
      current.children
    ) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  return current;
}
