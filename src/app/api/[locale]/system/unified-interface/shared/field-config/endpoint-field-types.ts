/**
 * Type utilities for extracting field names and types from endpoint definitions
 * Provides full type inference from definition.POST.fields to form components
 */

import type { IconKey } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { Countries } from "@/i18n/core/config";

import type { FieldConfig, PrefillDisplayConfig } from "./field-config-types";

/**
 * Type for endpoint field structure from unified interface
 * This matches the structure created by objectField() in endpoint definitions
 */

export interface EndpointFieldStructure {
  type?: string;
  children?: Record<string, EndpointFieldStructure>;
  // Union-specific fields
  discriminator?: string;
  variants?: readonly EndpointFieldStructure[];
  ui?: {
    type: string;
    fieldType?: string;
    label?: string;
    placeholder?: string;
    description?: string;
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
      label: string;
      labelParams?: Record<string, string | number>;
      disabled?: boolean;
      icon?: IconKey;
    }>;
    maxTags?: number;
    // Readonly and prefill display options
    readonly?: boolean;
    prefillDisplay?: PrefillDisplayConfig;
  };
}

/**
 * Extract all valid field paths from an endpoint field structure
 * Handles nested objects and generates dot-notation paths
 *
 * Example:
 * For structure: { type: "object", children: { personalInfo: { children: { email: ... } } } }
 * Returns: "personalInfo.email" | "personalInfo.privateName" | etc.
 */
export type ExtractFieldPaths<T> = T extends {
  type: "object";
  children: infer C;
}
  ? C extends Record<string, EndpointFieldStructure>
    ? {
        [K in keyof C]: C[K] extends {
          type: "object";
          children: Record<string, EndpointFieldStructure>;
        }
          ? `${K & string}.${ExtractFieldPaths<C[K]>}`
          : K & string;
      }[keyof C]
    : never
  : never;

/**
 * Extract field structure by path (supports dot notation)
 * Navigates through nested objects to find the field
 */
export type GetFieldByPath<
  T,
  P extends string,
> = P extends `${infer First}.${infer Rest}`
  ? T extends { type: "object"; children: infer C }
    ? C extends Record<string, EndpointFieldStructure>
      ? First extends keyof C
        ? GetFieldByPath<C[First], Rest>
        : never
      : never
    : never
  : T extends { type: "object"; children: infer C }
    ? C extends Record<string, EndpointFieldStructure>
      ? P extends keyof C
        ? C[P]
        : never
      : never
    : never;

/**
 * Map of field paths to their FieldConfig types
 * Used to provide autocomplete and type safety for field names
 */
export type FieldConfigMap<TFields> = TFields extends {
  type: "object";
  children: infer C;
}
  ? C extends Record<string, EndpointFieldStructure>
    ? {
        [K in keyof C]: C[K] extends {
          type: "object";
          children: infer SC;
        }
          ? SC extends Record<string, EndpointFieldStructure>
            ? {
                [SK in keyof SC as `${K & string}.${SK & string}`]: FieldConfig;
              }
            : never
          : { [P in K]: FieldConfig };
      }[keyof C]
    : never
  : never;

/**
 * Extract all valid field names from endpoint fields
 * This type is used for autocomplete and validation
 */
export type EndpointFieldName<TFields> = ExtractFieldPaths<TFields>;

/**
 * Type-safe wrapper for endpoint fields
 * Ensures that only valid field names can be used
 */
export interface TypedEndpointFields<TFields> {
  readonly fields: TFields;
  // Helper to get valid field names (for autocomplete)
  readonly validFieldNames: EndpointFieldName<TFields>;
}

/**
 * Get FieldConfig type for a specific field path
 * Used for type-safe field configuration
 */
export type GetFieldConfig<TFields, TPath extends EndpointFieldName<TFields>> =
  GetFieldByPath<TFields, TPath & string> extends {
    ui: EndpointFieldStructure["ui"];
  }
    ? FieldConfig
    : never;

/**
 * Infer form values type from endpoint fields
 * This creates the shape that react-hook-form expects
 */
export type InferFormValues<TFields> = TFields extends {
  type: "object";
  children: infer C;
}
  ? C extends Record<string, EndpointFieldStructure>
    ? {
        [K in keyof C]: C[K] extends {
          type: "object";
          children: infer SC;
        }
          ? SC extends Record<string, EndpointFieldStructure>
            ? { [SK in keyof SC]: string | number | boolean | Date | null }
            : string | number | boolean | Date | null
          : string | number | boolean | Date | null;
      }
    : never
  : never;

/**
 * Runtime type guard to check if a field path is valid
 * Supports object, object-optional, and object-union types
 */
export function isValidFieldPath<TFields>(
  fields: TFields,
  path: string,
): path is EndpointFieldName<TFields> {
  const parts = path.split(".");
  let current: EndpointFieldStructure | null = fields as EndpointFieldStructure;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !("type" in current)) {
      return false;
    }

    // Handle union types
    if (current.type === "object-union") {
      const variants = (
        current as EndpointFieldStructure & {
          variants?: readonly EndpointFieldStructure[];
        }
      ).variants;
      if (!variants || !Array.isArray(variants)) {
        return false;
      }

      // Check if the field exists in any variant
      let found = false;
      for (const variant of variants) {
        if (
          (variant.type === "object" || variant.type === "object-optional") &&
          variant.children
        ) {
          const variantChildren = variant.children as Record<
            string,
            EndpointFieldStructure
          >;
          if (part in variantChildren) {
            current = variantChildren[part];
            found = true;
            break;
          }
        }
      }
      if (!found) {
        return false;
      }
    }
    // Handle regular object types
    else if (
      (current.type === "object" || current.type === "object-optional") &&
      current.children
    ) {
      const children = current.children as Record<
        string,
        EndpointFieldStructure
      >;
      if (!(part in children)) {
        return false;
      }
      current = children[part];
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Get runtime field structure by path
 * Supports object, object-optional, and object-union types
 */
export function getFieldStructureByPath(
  fields: EndpointFieldStructure,
  path: string,
): EndpointFieldStructure | null {
  const parts = path.split(".");
  let current = fields;

  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return null;
    }

    // Handle object-union types
    if (current.type === "object-union") {
      const unionField = current as EndpointFieldStructure & {
        variants?: readonly EndpointFieldStructure[];
      };

      // Look for the field in any variant (all variants should have the discriminator field)
      // For other fields, we return the first match (assuming variants have consistent field definitions)
      if (unionField.variants && Array.isArray(unionField.variants)) {
        for (const variant of unionField.variants) {
          if (variant.type === "object" || variant.type === "object-optional") {
            const variantChildren = variant.children as
              | Record<string, EndpointFieldStructure>
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
