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

import { WidgetType } from "../../../core/definition/enums";
import type { WidgetData } from "../../../core/utils/json";
import type { UserPermissionRoleValue } from "../../../identity/roles/enum";
import type { UnifiedField } from "../../_shared/configs";
import { isRequestField, isResponseField } from "../../_shared/type-guards";
import type {
  AnyChildrenConstrain,
  BaseWidgetConfig,
  FieldUsageConfig,
  SchemaTypes,
} from "../../_shared/types";
import type z from "zod";

/**
 * A single child ready to render with its data
 * Already has parent value resolved (for NAVIGATE_BUTTON, etc.)
 * Uses UnifiedField to preserve discriminated union type information for proper narrowing
 */
interface ProcessedChild {
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
interface InlineFieldGroup {
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
interface ChildrenFilterConfig {
  /** Hide fields with hidden: true */
  hideHidden?: boolean;
  /** Only include response fields (for display-only mode) */
  responseOnly?: boolean;
  /** Only include request fields (for form mode) */
  requestOnly?: boolean;
  /** Whether the context has actual response data (from context.response.success) */
  hasResponseData?: boolean;
  /** User's permission roles - used to enforce visibleFor field-level role whitelist */
  userRoles?: readonly (typeof UserPermissionRoleValue)[];
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

      // Check visibleFor role whitelist
      if ("visibleFor" in field && field.visibleFor !== undefined) {
        const visibleFor =
          field.visibleFor as readonly (typeof UserPermissionRoleValue)[];
        const userRoles = config.userRoles ?? [];
        const hasRole = visibleFor.some((role) => userRoles.includes(role));
        if (!hasRole) {
          continue;
        }
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

      // Hide response-only fields that have no data.
      // Widget-only fields always render (static content, no data dependency).
      // This applies universally - not just in responseOnly mode - so that
      // response fields inside mixed containers don't render empty labels.
      const isResponseOnly = isResponseField(field) && !isRequestField(field);
      if (isResponseOnly && !isWidgetField && !isWidgetOnly) {
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
}
