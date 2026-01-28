/**
 * Link Card Widget - Type Definitions
 */

import type { WidgetType } from "../../../../shared/types/enums";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Helper to extract all valid field paths from children including nested paths
 */
type ExtractFieldPaths<
  TKey extends string,
  TChildren extends ObjectChildrenConstraint<TKey, FieldUsageConfig>,
  TPrefix extends string = "",
> = {
  [K in keyof TChildren]: K extends string
    ? TChildren[K] extends {
        schemaType: "object";
        children: infer TNestedChildren;
      }
      ? TNestedChildren extends ObjectChildrenConstraint<TKey, FieldUsageConfig>
        ?
            | `${TPrefix}${K}`
            | ExtractFieldPaths<TKey, TNestedChildren, `${TPrefix}${K}.`>
        : `${TPrefix}${K}`
      : `${TPrefix}${K}`
    : never;
}[keyof TChildren];

/**
 * Link Card Widget Configuration
 * Displays a clickable card with children fields rendered inside
 *
 * The linkKey prop specifies which field contains the URL (supports dot notation for nested fields)
 */
export interface LinkCardWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
> extends BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren> {
  type: WidgetType.LINK_CARD;

  /**
   * Typesafe key pointing to the field that contains the link URL
   * Supports dot notation for nested fields (e.g., "item.url")
   */
  linkKey: ExtractFieldPaths<TKey, TChildren>;

  /** Whether to open link in new tab (default: true) */
  openInNewTab?: boolean;

  /** Border style */
  border?: boolean;

  /** Show hover effect */
  hover?: boolean;

  /** Card background variant */
  variant?: "default" | "outline" | "ghost";
}
