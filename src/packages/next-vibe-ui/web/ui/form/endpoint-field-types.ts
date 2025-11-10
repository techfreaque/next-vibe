/**
 * Type utilities for extracting field names and types from endpoint definitions
 * Provides full type inference from definition.POST.fields to form components
 */

import type { FieldConfig } from "./endpoint-form-field-types";
import { type Countries } from "@/i18n/core/config";

/**
 * Type for endpoint field structure from unified interface
 * This matches the structure created by objectField() in endpoint definitions
 */
export interface EndpointFieldStructure {
  type?: string;
  children?: Record<string, EndpointFieldStructure>;
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
      icon?: string;
    }>;
    maxTags?: number;
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
 */
export function isValidFieldPath<TFields>(
  fields: TFields,
  path: string,
): path is EndpointFieldName<TFields> {
  const parts = path.split(".");
  let current: EndpointFieldStructure | null = fields as EndpointFieldStructure;

  for (const part of parts) {
    if (
      !current ||
      typeof current !== "object" ||
      !("type" in current) ||
      current.type !== "object" ||
      !("children" in current)
    ) {
      return false;
    }

    const children = current.children as Record<string, EndpointFieldStructure>;
    if (!(part in children)) {
      return false;
    }

    current = children[part];
  }

  return true;
}

/**
 * Get runtime field structure by path
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

    // Navigate through object children
    if (current.type === "object" && current.children) {
      current = current.children[part];
    } else {
      return null;
    }
  }

  return current;
}
