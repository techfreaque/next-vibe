/**
 * Accordion Widget Type Definitions
 */

import type { z } from "zod";

import type { UnifiedField } from "../../../../shared/types/endpoint";
import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  ArrayChildConstraint,
  BaseArrayWidgetConfig,
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";

/**
 * Accordion item structure - each accordion item must have trigger and content fields
 */
export type AccordionItemChildren = Record<
  "trigger" | "content",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any>
>;

/**
 * Common properties for both array and object accordion configurations
 */
interface BaseAccordionProps<TKey extends string> {
  title?: NoInfer<TKey>;
  defaultOpen?: string[];
  allowMultiple?: boolean;
  collapsible?: boolean;
  variant?: "default" | "bordered" | "separated";
  /** Empty state padding */
  emptyPadding?: SpacingSize;
  /** Gap between icon and title */
  titleGap?: SpacingSize;
  /** Item padding for separated variant */
  itemPadding?: SpacingSize;
  /** Content padding */
  contentPadding?: SpacingSize;
}

/**
 * Accordion Array Widget Configuration
 * Array of accordion items
 */
export interface AccordionArrayWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>
  extends
    BaseArrayWidgetConfig<TKey, TUsage, TSchemaType, TChild>,
    BaseAccordionProps<TKey> {
  type: WidgetType.ACCORDION;
}

/**
 * Accordion Object Widget Configuration
 * Object with accordion item children
 */
export interface AccordionObjectWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>
  extends
    BaseObjectWidgetConfig<TKey, TUsage, TSchemaType, TChildren>,
    BaseAccordionProps<TKey> {
  type: WidgetType.ACCORDION;
}

/**
 * Accordion Widget Configuration (union of array and object variants)
 *
 * Uses distribution to properly narrow union types:
 * - When TSchemaType is "array" | "array-optional", only ArrayConfig is valid
 * - When TSchemaType is "object" | "object-optional" | "widget-object", only ObjectConfig is valid
 * - TChildOrChildren must match the respective constraint
 */
export type AccordionWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "array-optional"
    | "object"
    | "object-optional"
    | "widget-object",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
> =
  | AccordionArrayWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; array variant resolves only when "array"|"array-optional" is passed
      TSchemaType,
      TChildOrChildren
    >
  | AccordionObjectWidgetConfig<
      TKey,
      TUsage,
      // @ts-expect-error -- TSchemaType is the full union; object variant resolves only when "object"|"object-optional"|"widget-object" is passed
      TSchemaType,
      TChildOrChildren
    >;
