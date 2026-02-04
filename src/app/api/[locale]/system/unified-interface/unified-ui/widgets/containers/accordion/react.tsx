"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { getSpacingClassName } from "../../../../shared/widgets/utils/widget-helpers";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChild } from "../../_shared/type-guards";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import { useWidgetTranslation } from "../../_shared/use-widget-context";
import type { AccordionArrayWidgetConfig } from "./types";

/**
 * Accordion Widget - Displays collapsible accordion panels with expand/collapse
 *
 * Renders expandable/collapsible sections with:
 * - Multiple accordion items with titles and content
 * - Configurable default open state per item
 * - Optional icons for items
 * - Multiple visual variants (default, bordered, separated)
 * - Single or multiple items can be open simultaneously
 *
 * Features:
 * - Smooth expand/collapse animations
 * - Keyboard accessible (Space/Enter to toggle)
 * - Configurable to allow multiple open items
 * - Visual variants for different styling
 * - Automatic translation of titles and content
 *
 * UI Config Options:
 * - items: Array of { id, title, icon?, disabled? }
 * - defaultOpen: Array of item IDs to open by default
 * - allowMultiple: Allow multiple items open (default: false)
 * - collapsible: Allow all items to be collapsed (default: true)
 * - variant: "default" | "bordered" | "separated"
 *
 * Data Format:
 * - object: { items: Array<{ title: string, content: any, expanded?: boolean }>, variant?: string }
 *   - items: Array of accordion items
 *     - title: Item title (translated via t)
 *     - content: Item content (any widget data)
 *     - expanded: Whether item is initially expanded
 *   - variant: Visual variant style
 * - null/undefined: Shows empty state
 *
 * @param value - Accordion data with items
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */
export function AccordionWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends BaseObjectWidgetConfig<
    TKey,
    ConstrainedChildUsage<TUsage>,
    "object" | "object-optional" | "widget-object",
    ObjectChildrenConstraint<
      TKey,
      ConstrainedChildUsage<ConstrainedChildUsage<TUsage>>
    >
  >,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  AccordionArrayWidgetConfig<TKey, TUsage, "array" | "array-optional", TChild>
>): JSX.Element {
  const t = useWidgetTranslation();

  const {
    allowMultiple = false,
    collapsible = true,
    variant = "default",
    emptyPadding,
    titleGap,
    itemPadding,
    contentPadding,
  } = field;

  // Get classes from config (no hardcoding!)
  const emptyPaddingClass = getSpacingClassName("padding", emptyPadding);
  const titleGapClass = getSpacingClassName("gap", titleGap);
  const itemPaddingClass = getSpacingClassName("padding", itemPadding);
  const contentPaddingClass = getSpacingClassName("padding", contentPadding);

  if (!hasChild(field)) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          emptyPaddingClass || "py-8",
        )}
      >
        {t("system.ui.widgets.accordion.empty")}
      </Div>
    );
  }

  if (field.value.length === 0) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          emptyPaddingClass || "py-8",
        )}
      >
        {t("system.ui.widgets.accordion.empty")}
      </Div>
    );
  }

  // Get default open items
  const defaultValue = field.defaultOpen || [];

  return (
    <Accordion
      type={allowMultiple ? "multiple" : "single"}
      collapsible={collapsible}
      defaultValue={allowMultiple ? defaultValue : defaultValue[0]}
      className={cn(
        variant === "bordered" && "border rounded-lg",
        variant === "separated" && "space-y-2",
      )}
    >
      <MultiWidgetRenderer
        childrenSchema={hasChild(field) ? field.child : undefined}
        value={field.value}
        fieldName={fieldName}
        renderItem={({ itemData, index, itemFieldName, childSchema }) => {
          const itemId = `item-${index}`;

          // Get children from child schema if it has them
          const childrenSchema =
            "children" in childSchema ? childSchema.children : undefined;

          return (
            <AccordionItem
              key={itemId}
              value={itemId}
              className={cn(
                variant === "separated" && "border rounded-lg",
                variant === "separated" && itemPaddingClass,
                variant === "bordered" && index === 0 && "border-t-0",
              )}
            >
              <AccordionTrigger
                className={cn(
                  "hover:no-underline",
                  variant === "separated" && itemPaddingClass,
                )}
              >
                <Div
                  className={cn("flex items-center", titleGapClass || "gap-2")}
                >
                  <MultiWidgetRenderer
                    childrenSchema={
                      childrenSchema && "trigger" in childrenSchema
                        ? { trigger: childrenSchema.trigger }
                        : undefined
                    }
                    value={itemData}
                    fieldName={itemFieldName}
                  />
                </Div>
              </AccordionTrigger>
              <AccordionContent
                className={cn(variant === "separated" && contentPaddingClass)}
              >
                <MultiWidgetRenderer
                  childrenSchema={
                    childrenSchema && "content" in childrenSchema
                      ? { content: childrenSchema.content }
                      : undefined
                  }
                  value={itemData}
                  fieldName={itemFieldName}
                />
              </AccordionContent>
            </AccordionItem>
          );
        }}
      />
    </Accordion>
  );
}

AccordionWidget.displayName = "AccordionWidget";

export default AccordionWidget;
