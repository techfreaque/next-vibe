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
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { isArrayValue, isObjectWidget } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../_shared/types";
import type { AccordionWidgetConfig } from "./types";

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
 *     - title: Item title (translated via context.t)
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
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  context,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  AccordionWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
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

  // Runtime guard: verify value is an array and child is an object widget
  if (!isArrayValue(field.value)) {
    return (
      <Div className="text-center text-muted-foreground py-8">
        {context.t("system.ui.widgets.accordion.error-type")}
      </Div>
    );
  }

  if (!isObjectWidget(field.child)) {
    return (
      <Div className="text-center text-muted-foreground py-8">
        {context.t("system.ui.widgets.accordion.error-child")}
      </Div>
    );
  }

  // Now TypeScript narrows field.value to array and field.child to object widget
  if (field.value.length === 0) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          emptyPaddingClass || "py-8",
        )}
      >
        {context.t("system.ui.widgets.accordion.empty")}
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
      {(() => {
        // Type guard narrows field.value to array and field.child to object widget
        if (!isArrayValue(field.value) || !isObjectWidget(field.child)) {
          return null;
        }

        // Now we know field.value is array and field.child.children exists
        const items = field.value;
        const { trigger: triggerField, content: contentField } =
          field.child.children;

        return items.map((itemData, index) => {
          // Runtime guard: verify item is object with trigger/content
          if (
            itemData === null ||
            typeof itemData !== "object" ||
            !("trigger" in itemData) ||
            !("content" in itemData)
          ) {
            return null;
          }

          const triggerData = itemData.trigger;
          const contentData = itemData.content;

          const itemId = `item-${index}`;
          const baseFieldName = fieldName || "";
          const triggerFieldName = baseFieldName
            ? `${baseFieldName}.${index}.trigger`
            : `${index}.trigger`;
          const contentFieldName = baseFieldName
            ? `${baseFieldName}.${index}.content`
            : `${index}.content`;

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
                  <WidgetRenderer
                    fieldName={triggerFieldName}
                    field={{ ...triggerField, value: triggerData }}
                    context={context}
                  />
                </Div>
              </AccordionTrigger>
              <AccordionContent
                className={cn(variant === "separated" && contentPaddingClass)}
              >
                <WidgetRenderer
                  fieldName={contentFieldName}
                  field={{ ...contentField, value: contentData }}
                  context={context}
                />
              </AccordionContent>
            </AccordionItem>
          );
        });
      })()}
    </Accordion>
  );
}

AccordionWidget.displayName = "AccordionWidget";
