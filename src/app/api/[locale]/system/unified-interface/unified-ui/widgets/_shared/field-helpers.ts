/**
 * Field Helper Functions
 *
 * Consolidated utilities for working with UnifiedField types:
 * - Usage detection (request, response, both)
 * - Translation context extraction
 * - Field filtering and validation
 * - Field extraction from endpoint definitions
 */

import type { z, ZodTypeAny } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type {
  InferSchemaFromField,
  UnifiedField,
} from "../../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../../shared/types/endpoint-base";
import type { FieldUsage } from "../../../shared/types/enums";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import { hasChildren } from "./type-guards";
import type {
  AnyChildrenConstrain,
  BaseWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  SchemaTypes,
} from "./types";

/**
 * Constrained field type for extractAllFields.
 * Children satisfy AnyChildrenConstrain by construction — they originate from
 * hasChildren-narrowed object fields whose children Record is typed against it.
 */
export type ExtractedField<TKey extends string> = UnifiedField<
  TKey,
  ZodTypeAny,
  FieldUsageConfig,
  AnyChildrenConstrain<TKey, ConstrainedChildUsage<FieldUsageConfig>>
>;

/**
 * Extract ALL fields from endpoint definition.
 * Flattens nested containers into a flat list of [path, field] pairs.
 *
 * Internal assembly uses `any` for the heterogeneous array — Object.entries loses
 * specific child types. Return is asserted to ExtractedField which is safe because
 * children originate from hasChildren-narrowed fields that structurally satisfy
 * AnyChildrenConstrain.
 */
export function extractAllFields<const TKey extends string>(
  fields: ExtractedField<TKey>,
  parentPath = "",
): Array<[string, ExtractedField<TKey>]> {
  if (!fields || typeof fields !== "object") {
    return [];
  }

  // Handle object-union fields — add as leaf (widget handles variant switching)
  // oxlint-disable-next-line typescript/no-unnecessary-condition -- `in` narrowing required: TS cannot distribute schemaType through nested union-of-unions
  if ("schemaType" in fields && fields.schemaType === "object-union") {
    const fullPath = parentPath ? `${parentPath}` : "";
    // oxlint-disable-next-line typescript/no-explicit-any
    return fullPath ? [[fullPath, fields as any]] : [];
  }

  // Only object fields with children can be flattened
  // Assign to structural variable: UnifiedField union is too wide (100+ members)
  // for direct constraint check, but all members carry schemaType
  // oxlint-disable-next-line typescript/no-explicit-any
  const structField = fields as any as { schemaType: SchemaTypes };
  if (!hasChildren(structField)) {
    return [];
  }

  // oxlint-disable-next-line typescript/no-explicit-any
  const result: Array<[string, any]> = [];

  for (const [fieldName, fieldDef] of Object.entries(structField.children)) {
    if (typeof fieldDef === "object" && fieldDef !== null) {
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      result.push([fullPath, fieldDef]);
    }
  }

  // Assert at return boundary — safe: children from hasChildren-narrowed fields
  // structurally satisfy AnyChildrenConstrain by construction.
  return result as Array<[string, ExtractedField<TKey>]>;
}

/**
 * Extract translation function from endpoint definition
 */
export function getTranslatorFromEndpoint<
  TEndpoint extends CreateApiEndpointAny,
>(
  endpoint: TEndpoint,
): (locale: CountryLanguage) => {
  t: <K extends string>(key: K, params?: TParams) => string;
} {
  return endpoint.scopedTranslation.scopedT as (locale: CountryLanguage) => {
    t: <K extends string>(key: K, params?: TParams) => string;
  };
}

/**
 * Generate indexed field path for array items.
 * e.g. arrayFieldPath("items", 2) → "items[2]"
 *      arrayFieldPath("", 0)      → "[0]"
 */
export function arrayFieldPath(
  parentPath: string,
  index: number,
  childPath: string,
): string {
  return `${parentPath}.${index}.${childPath}`;
}

/**
 * Extract a display label from a field definition.
 * Checks label → content → text → href, translating via `t` where applicable.
 * Falls back to `fallbackKey` (typically the raw field name).
 */
export function getFieldLabel(
  fieldDef: BaseWidgetConfig<FieldUsageConfig, SchemaTypes> | undefined,
  fallbackKey: string,
  t: (key: string) => string,
): string {
  if (!fieldDef) {
    return fallbackKey;
  }
  if ("label" in fieldDef && typeof fieldDef.label === "string") {
    return t(fieldDef.label);
  }
  if ("content" in fieldDef && typeof fieldDef.content === "string") {
    return t(fieldDef.content);
  }
  if ("text" in fieldDef && typeof fieldDef.text === "string") {
    return t(fieldDef.text);
  }
  if ("href" in fieldDef && typeof fieldDef.href === "string") {
    return fieldDef.href;
  }
  return fallbackKey;
}

/**
 * Augment a field with its runtime value - for internal widget rendering.
 * Used by built-in renderers where fields are passed generically.
 * The value type is preserved from the caller for type safety at call sites.
 */
export function withValueNonStrict<TField, TValue>(
  field: TField,
  value: TValue,
  parentValue: WidgetData | undefined | null,
): TField & {
  value: TValue;
  parentValue: WidgetData | undefined | null;
} {
  return { ...field, value, parentValue };
}

/**
 * Augment a field with its runtime value - for custom widget.ts files.
 * Enforces exact type matching: the value parameter must match the field's inferred output type.
 * Use this when you know the specific field type at compile time.
 */
export function withValue<
  TField extends
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | AnyChildrenConstrain<string, FieldUsageConfig>,
>(
  field: TField,
  value:
    | z.output<InferSchemaFromField<TField, FieldUsage.ResponseData>>
    | undefined,
  parentValue: WidgetData | undefined | null,
): TField & {
  value:
    | z.output<InferSchemaFromField<TField, FieldUsage.ResponseData>>
    | undefined;
  parentValue: WidgetData | undefined | null;
} {
  return { ...field, value, parentValue };
}

/**
 * Scan field tree for inline buttons (submitButton, backButton, formAlert)
 * Returns info about what buttons/alerts are already defined inline
 * This is used by EndpointRenderer to decide if auto-buttons should be added
 */
export interface InlineButtonInfo {
  hasSubmitButton: boolean;
  hasBackButton: boolean;
  hasFormAlert: boolean;
}

/**
 * Recursively scan a field and its children for inline buttons
 * Only scans fields that match the usage (request/response/both)
 */
export function scanForInlineButtons<const TKey extends string>(
  field: ExtractedField<TKey> | BaseWidgetConfig<FieldUsageConfig, SchemaTypes>,
): InlineButtonInfo {
  const result: InlineButtonInfo = {
    hasSubmitButton: false,
    hasBackButton: false,
    hasFormAlert: false,
  };

  if (!field || typeof field !== "object") {
    return result;
  }

  // Check if this field is a container with submitButton config
  if ("submitButton" in field && field.submitButton) {
    result.hasSubmitButton = true;
  }

  // Check if this field is a container with showFormAlert enabled (default true)
  if (
    "showFormAlert" in field &&
    (field.showFormAlert === true || field.showFormAlert === undefined)
  ) {
    result.hasFormAlert = true;
  }

  // Check children for inline buttons (recursive)
  // oxlint-disable-next-line typescript/no-explicit-any
  const structField = field as any as { schemaType: SchemaTypes };
  if (hasChildren(structField)) {
    for (const [fieldName, childField] of Object.entries(
      structField.children,
    )) {
      // Check if this child is a backButton field
      if (fieldName === "backButton") {
        result.hasBackButton = true;
      }

      // Recursively scan child
      if (typeof childField === "object" && childField !== null) {
        const childInfo = scanForInlineButtons(
          childField as BaseWidgetConfig<FieldUsageConfig, SchemaTypes>,
        );
        result.hasSubmitButton =
          result.hasSubmitButton || childInfo.hasSubmitButton;
        result.hasBackButton = result.hasBackButton || childInfo.hasBackButton;
        result.hasFormAlert = result.hasFormAlert || childInfo.hasFormAlert;
      }
    }
  }

  return result;
}
