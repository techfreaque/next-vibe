/**
 * ChildrenDataRenderer - Core data extraction and processing
 *
 * Pure data operations: extracting children, filtering, sorting, grouping.
 * No HTML structure, no rendering. Returns structured data ready for rendering.
 *
 * Handles:
 * - Filtering (hidden, response-only, widget-only detection)
 * - Sorting by order property
 * - Inline field grouping
 * - Parent value passing for special fields (NAVIGATE_BUTTON)
 * - Union variant selection and discriminator extraction
 */

import type z from "zod";

import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/widgets/configs";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";

import {
  isRequestField,
  isResponseField,
} from "../../widgets/_shared/type-guards";
import type {
  AnyChildrenConstrain,
  BaseWidgetConfig,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  SchemaTypes,
} from "../../widgets/_shared/types";

/**
 * Type guard to check if a variant has object-like children that can be indexed
 */
function hasIndexableChildren(
  variant: UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >,
): variant is UnifiedField<
  string,
  z.ZodTypeAny,
  FieldUsageConfig,
  AnyChildrenConstrain<string, FieldUsageConfig>
> & {
  schemaType: "object" | "object-optional" | "widget-object";
  children: ObjectChildrenConstraint<string, FieldUsageConfig>;
} {
  return (
    "children" in variant &&
    variant.children !== undefined &&
    typeof variant.children === "object" &&
    "schemaType" in variant &&
    (variant.schemaType === "object" ||
      variant.schemaType === "object-optional" ||
      variant.schemaType === "widget-object")
  );
}

/**
 * A single child ready to render with its data
 * Already has parent value resolved (for NAVIGATE_BUTTON, etc.)
 * Uses UnifiedField to preserve discriminated union type information for proper narrowing
 */
export interface ProcessedChild {
  name: string;
  field: UnifiedField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, FieldUsageConfig>
  >;
  data: WidgetData; // Already resolved (parent value for NAVIGATE_BUTTON, or actual child data)
  columns?: number;
  inline?: boolean;
  order?: number;
}

/**
 * A group of consecutive inline fields
 */
export interface InlineFieldGroup {
  fields: ProcessedChild[];
  totalColumns: number;
}

/**
 * Result of processing children - ready for rendering
 * All data extraction, filtering, sorting, and grouping is complete
 */
export interface ProcessedChildren {
  /** All children to render in order, with data resolved */
  children: ProcessedChild[];
  /** Inline field groups (consecutive inline fields grouped together) */
  inlineGroups: Map<string, InlineFieldGroup>;
  /** Which children are part of inline groups */
  inlineGroupMembers: Set<string>;
}

/**
 * Configuration for filtering children
 */
export interface ChildrenFilterConfig {
  /** Hide fields with hidden: true */
  hideHidden?: boolean;
  /** Only include response fields (for display-only mode) */
  responseOnly?: boolean;
  /** Only include request fields (for form mode) */
  requestOnly?: boolean;
  /** Whether the context has actual response data (from context.response.success) */
  hasResponseData?: boolean;
  /** Custom predicate to filter children */
  predicate?: (
    name: string,
    field:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | AnyChildrenConstrain<string, FieldUsageConfig>,
    data: WidgetData,
  ) => boolean;
}

/**
 * Core children data processor
 * Extracts all data operations without any rendering
 */
export class ChildrenDataRenderer {
  /**
   * Check if field is widget-only object (all children are schemaType: "widget")
   */
  private static isWidgetOnlyObject(
    field:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | AnyChildrenConstrain<string, FieldUsageConfig>,
  ): boolean {
    if (!("schemaType" in field) || field.schemaType !== "widget-object") {
      return false;
    }
    if (!("children" in field) || !field.children) {
      return false;
    }
    const children = field.children as Record<
      string,
      BaseWidgetConfig<FieldUsageConfig, SchemaTypes> | undefined
    >;
    return Object.values(children).every(
      (child) =>
        child &&
        typeof child === "object" &&
        "schemaType" in child &&
        child.schemaType === "widget",
    );
  }

  /**
   * Extract and filter children, resolving parent value for special fields
   * Accepts both UnifiedField (from endpoints) and AnyChildrenConstrain (from container children)
   */
  static extractChildren<TValue extends WidgetData>(
    childrenSchema:
      | Record<
          string,
          | UnifiedField<
              string,
              z.ZodTypeAny,
              FieldUsageConfig,
              AnyChildrenConstrain<string, FieldUsageConfig>
            >
          | AnyChildrenConstrain<string, FieldUsageConfig>
          | undefined
        >
      | undefined,
    value: TValue | undefined | null,
    config: ChildrenFilterConfig = {},
  ): ProcessedChild[] {
    if (!childrenSchema) {
      return [];
    }

    const result: ProcessedChild[] = [];

    for (const [name, field] of Object.entries(childrenSchema)) {
      // Skip undefined fields
      if (!field) {
        continue;
      }

      // Check hidden
      if (
        config.hideHidden !== false &&
        (("hidden" in field && field.hidden === true) ||
          ("hidden" in field &&
            typeof field.hidden === "function" &&
            field.hidden(value)))
      ) {
        continue;
      }

      // Check response/request only modes
      if (config.responseOnly) {
        if (!isResponseField(field)) {
          continue;
        }
      } else if (config.requestOnly) {
        if (!isRequestField(field)) {
          continue;
        }
      }

      // Extract data
      const data =
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
          ? value[name]
          : null;

      // Determine if this is a widget-only object or widget field (before we use it)
      const isWidgetOnly = this.isWidgetOnlyObject(field);
      const isWidgetField =
        "schemaType" in field && field.schemaType === "widget";

      // Check data existence for response-only fields
      // Widget-only fields should always render (they have static content)
      // Regular response fields need their own field-specific data
      if (config.responseOnly && !isWidgetField && !isWidgetOnly) {
        // Regular response field: check if field data exists
        if (data === null || data === undefined) {
          continue;
        }
      }

      // Custom predicate
      if (config.predicate && !config.predicate(name, field, data)) {
        continue;
      }

      // Resolve data: NAVIGATE_BUTTON gets parent value, others get their own data
      const isNavigateButton =
        "type" in field &&
        (field as { type?: WidgetType }).type === WidgetType.NAVIGATE_BUTTON;
      const resolvedData = isNavigateButton ? value : data;

      result.push({
        name,
        // Safe cast: AnyChildrenConstrain is structurally compatible with UnifiedField
        // Both extend BaseWidgetConfig and preserve discriminated union properties
        field: field as UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >,
        data: resolvedData,
        columns:
          "columns" in field && typeof field.columns === "number"
            ? field.columns
            : undefined,
        inline: "inline" in field && field.inline === true,
        order:
          "order" in field && typeof field.order === "number"
            ? field.order
            : undefined,
      });
    }

    return result;
  }

  /**
   * Sort children by order property
   */
  static sortChildren(children: ProcessedChild[]): ProcessedChild[] {
    return [...children].toSorted((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      return orderA - orderB;
    });
  }

  /**
   * Group consecutive inline fields together
   * Returns map of group key -> group data, and set of children that are in groups
   */
  static groupInlineFields(children: ProcessedChild[]): {
    groups: Map<string, InlineFieldGroup>;
    members: Set<string>;
  } {
    const groups = new Map<string, InlineFieldGroup>();
    const members = new Set<string>();

    let currentGroup: ProcessedChild[] | null = null;
    let groupStartName: string | null = null;

    for (const child of children) {
      if (child.inline) {
        if (!currentGroup) {
          currentGroup = [];
          groupStartName = child.name;
        }
        currentGroup.push(child);
        members.add(child.name);
      } else {
        // Non-inline field ends the group
        if (currentGroup && currentGroup.length > 0) {
          const totalColumns = currentGroup.reduce(
            (sum, field) => sum + (field.columns ?? 1),
            0,
          );
          groups.set(groupStartName!, {
            fields: currentGroup,
            totalColumns,
          });
          currentGroup = null;
          groupStartName = null;
        }
      }
    }

    // Don't forget the last group
    if (currentGroup && currentGroup.length > 0) {
      const totalColumns = currentGroup.reduce(
        (sum, field) => sum + (field.columns ?? 1),
        0,
      );
      groups.set(groupStartName!, {
        fields: currentGroup,
        totalColumns,
      });
    }

    return { groups, members };
  }

  /**
   * Process children: extract, sort, and group inline fields
   * Accepts both UnifiedField (from endpoints) and AnyChildrenConstrain (from container children)
   */
  static processChildren(
    childrenSchema:
      | Record<
          string,
          | UnifiedField<
              string,
              z.ZodTypeAny,
              FieldUsageConfig,
              AnyChildrenConstrain<string, FieldUsageConfig>
            >
          | AnyChildrenConstrain<string, FieldUsageConfig>
          | undefined
        >
      | undefined,
    value: Record<string, WidgetData> | undefined | null,
    config: ChildrenFilterConfig = {},
  ): ProcessedChildren {
    // Extract and filter
    const extracted = this.extractChildren(childrenSchema, value, config);

    // Sort
    const sorted = this.sortChildren(extracted);

    // Group inline fields
    const { groups, members } = this.groupInlineFields(sorted);

    return {
      children: sorted,
      inlineGroups: groups,
      inlineGroupMembers: members,
    };
  }

  /**
   * For array children, extract items and their data
   */
  static extractArrayItems(
    childSchema:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | undefined,
    items: WidgetData[] | undefined | null,
  ): Array<{ item: WidgetData; index: number }> {
    if (!childSchema || !Array.isArray(items)) {
      return [];
    }

    return items.map((item, index) => ({ item, index }));
  }

  /**
   * Extract discriminator value from field and find matching variant
   */
  static extractDiscriminatorValue(
    value: Record<string, WidgetData> | undefined | null,
    discriminatorPath: string,
  ): string | undefined {
    if (!value || typeof discriminatorPath !== "string") {
      return undefined;
    }

    // Handle simple case (no nested paths yet)
    if (!discriminatorPath.includes(".")) {
      const val = value[discriminatorPath];
      return typeof val === "string" || typeof val === "number"
        ? String(val)
        : undefined;
    }

    // For nested paths, we'd need to traverse
    // For now just handle simple case
    return undefined;
  }

  /**
   * Extract literal value from Zod schema (for discriminator matching)
   * Handles z.literal() and z.enum() values
   */
  static extractZodLiteralValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
  ): string | number | undefined {
    if (!schema || typeof schema !== "object") {
      return undefined;
    }

    // Check for z.literal() - stores in _def.values array
    if ("_def" in schema && "values" in schema._def) {
      const values = schema._def.values as Array<
        string | number | bigint | boolean | null | undefined
      >;
      if (values && values.length > 0) {
        const val = values[0];
        if (typeof val === "string" || typeof val === "number") {
          return val;
        }
      }
    }

    return undefined;
  }

  /**
   * Find matching variant for discriminator value from union variants
   */
  static findMatchingVariant(
    variants:
      | Array<
          UnifiedField<
            string,
            z.ZodTypeAny,
            FieldUsageConfig,
            AnyChildrenConstrain<string, FieldUsageConfig>
          >
        >
      | undefined,
    discriminator: string | undefined,
    discriminatorValue: string | undefined,
  ):
    | UnifiedField<
        string,
        z.ZodTypeAny,
        FieldUsageConfig,
        AnyChildrenConstrain<string, FieldUsageConfig>
      >
    | undefined {
    if (!variants || !Array.isArray(variants) || !discriminator) {
      return undefined;
    }

    for (const variant of variants) {
      if (!hasIndexableChildren(variant)) {
        continue;
      }

      const variantChildren = variant.children;
      const discriminatorField = variantChildren[discriminator];

      if (!discriminatorField) {
        continue;
      }

      // Extract literal value from schema
      if (
        "schemaType" in discriminatorField &&
        discriminatorField.schemaType === "primitive" &&
        "schema" in discriminatorField
      ) {
        const literalValue = this.extractZodLiteralValue(
          discriminatorField.schema,
        );
        if (
          literalValue !== undefined &&
          String(literalValue) === discriminatorValue
        ) {
          return variant;
        }
      }
    }

    // Return first variant as fallback
    return variants[0];
  }

  /**
   * Build children Record from union variant
   * Merges discriminator field with variant-specific fields
   */
  static buildUnionVariantChildren(
    selectedVariant:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | undefined,
    referenceVariant:
      | UnifiedField<
          string,
          z.ZodTypeAny,
          FieldUsageConfig,
          AnyChildrenConstrain<string, FieldUsageConfig>
        >
      | undefined,
    discriminator: string | undefined,
  ): Record<string, AnyChildrenConstrain<string, FieldUsageConfig>> {
    const result: Record<
      string,
      AnyChildrenConstrain<string, FieldUsageConfig>
    > = {};

    // Get discriminator field from reference variant
    if (
      referenceVariant &&
      discriminator &&
      hasIndexableChildren(referenceVariant)
    ) {
      const refChildren = referenceVariant.children;
      if (discriminator in refChildren && refChildren[discriminator]) {
        result[discriminator] = refChildren[discriminator]!;
      }

      // Add variant-specific fields
      if (
        selectedVariant &&
        selectedVariant !== referenceVariant &&
        hasIndexableChildren(selectedVariant)
      ) {
        const selectedChildren = selectedVariant.children;
        for (const key in selectedChildren) {
          if (
            Object.prototype.hasOwnProperty.call(selectedChildren, key) &&
            key !== discriminator &&
            selectedChildren[key]
          ) {
            result[key] = selectedChildren[key]!;
          }
        }
      }
    }

    return result;
  }

  /**
   * Utility: get column span for a number of columns
   * Returns 1-12 for standard grid, or any number for custom grids
   */
  static getColumnSpan(columns: number | undefined): number {
    return columns && columns > 0 ? Math.min(columns, 12) : 1;
  }
}
