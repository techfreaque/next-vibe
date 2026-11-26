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

import { WidgetType } from "../../../core/definition/enums";
import type { WidgetData } from "../../../core/utils/json";
import type { UserPermissionRoleValue } from "../../../identity/roles/enum";
import type { UnifiedField } from "../../_shared/configs";
import { isRequestField, isResponseField } from "../../_shared/type-guards";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  BaseWidgetConfig,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  SchemaTypes,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";

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

/**
 * Which part of a form template a child belongs to:
 * - fields: inputs and static content inside the section card
 * - actions: submit buttons, rendered in the template footer
 * - response: response-only data, rendered after a successful submit
 */
export type ChildSlot =
  | "fields"
  | "actions"
  | "response"
  /** response-only primitives worth a fact tile (no raw ids) */
  | "facts"
  /** response-only lists and nested objects */
  | "sections";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Raw identifiers belong in "Technical details", never in facts. */
export function isRawIdentifier(value: WidgetData): boolean {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function matchesSlot(
  slot: ChildSlot,
  field: SlotField,
  data: WidgetData,
): boolean {
  const own = getChildSlot(field);
  if (slot === "facts" || slot === "sections") {
    if (own !== "response") {
      return false;
    }
    const primitive = "schemaType" in field && field.schemaType === "primitive";
    if (slot === "facts") {
      return primitive && !isRawIdentifier(data);
    }
    // An empty list is not worth an empty card.
    return !primitive && !(Array.isArray(data) && data.length === 0);
  }
  return own === slot;
}

export type SlotField = ProcessedChildren["children"][number]["field"];

function getChildSlot(field: SlotField): ChildSlot | "alert" {
  const type = "type" in field ? field.type : undefined;
  if (type === WidgetType.SUBMIT_BUTTON) {
    return "actions";
  }
  if (type === WidgetType.FORM_ALERT) {
    return "alert";
  }
  if (isResponseField(field) && !isRequestField(field)) {
    return "response";
  }
  return "fields";
}

/**
 * True when an object's children contain something visible for `slot`
 * (e.g. response data worth a "Result" section after a submit).
 */
export function hasSlotContent<
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  childrenSchema:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
  value: WidgetData | undefined,
  slot: ChildSlot,
  userRoles: NonNullable<
    Parameters<typeof ChildrenDataRenderer.extractChildren>[2]
  >["userRoles"],
): boolean {
  if (
    !childrenSchema ||
    isUnionVariants<TKey, TUsage>(childrenSchema) ||
    isArrayChild<TKey, TUsage>(childrenSchema) ||
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }
  const objectChildren: ObjectChildrenConstraint<TKey, TUsage> = childrenSchema;
  return ChildrenDataRenderer.extractChildren(objectChildren, value, {
    userRoles,
  }).some(
    (child) =>
      matchesSlot(slot, child.field, child.data) &&
      child.data !== null &&
      child.data !== undefined,
  );
}

/** True when at least one child renders in `slot` (data not required). */
export function hasSlotChildren<
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  childrenSchema:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
  value: WidgetData | undefined,
  slot: ChildSlot,
  userRoles: NonNullable<
    Parameters<typeof ChildrenDataRenderer.extractChildren>[2]
  >["userRoles"],
): boolean {
  if (!childrenSchema || isArrayChild<TKey, TUsage>(childrenSchema)) {
    return false;
  }
  if (isUnionVariants<TKey, TUsage>(childrenSchema)) {
    return true;
  }
  const objectChildren: ObjectChildrenConstraint<TKey, TUsage> = childrenSchema;
  const objectValue =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : undefined;
  return ChildrenDataRenderer.extractChildren(objectChildren, objectValue, {
    userRoles,
  }).some((child) => matchesSlot(slot, child.field, child.data));
}

/**
 * Type guard to check if children is a union of variants
 */
export function isUnionVariants<TKey extends string, TUsage extends FieldUsageConfig>(
  children:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
): children is UnionObjectWidgetConfigConstrain<TKey, TUsage> {
  return (
    Array.isArray(children) &&
    children.length > 0 &&
    children[0] &&
    "children" in children[0]
  );
}

/**
 * Type guard to check if children is a single child constraint (array element)
 */
export function isArrayChild<TKey extends string, TUsage extends FieldUsageConfig>(
  children:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
): children is ArrayChildConstraint<TKey, TUsage> {
  return (
    children !== undefined &&
    !Array.isArray(children) &&
    children !== null &&
    "type" in children
  );
}
