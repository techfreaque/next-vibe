"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe-ui/ui/accordion";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractAccordionData } from "../../../shared/widgets/logic/accordion";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

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
export function AccordionWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.ACCORDION, TKey>): JSX.Element {
  const {
    allowMultiple = false,
    collapsible = true,
    variant = "default",
    emptyPadding,
    titleGap,
    iconSize,
    contentTextSize,
    itemPadding,
    contentPadding,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const emptyPaddingClass = getSpacingClassName("padding", emptyPadding);
  const titleGapClass = getSpacingClassName("gap", titleGap);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const contentTextSizeClass = getTextSizeClassName(contentTextSize);
  const itemPaddingClass = getSpacingClassName("padding", itemPadding);
  const contentPaddingClass = getSpacingClassName("padding", contentPadding);

  // Extract data using shared logic
  const data = extractAccordionData(value);

  if (!data || !data.items || data.items.length === 0) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          emptyPaddingClass || "py-8",
          className,
        )}
      >
        {context.t("system.ui.widgets.accordion.empty")}
      </Div>
    );
  }

  const { items } = data;

  // Get default open items
  const defaultValue = items
    .filter((item) => item.expanded)
    .map((item) => item.id || item.title);

  return (
    <Accordion
      type={allowMultiple ? "multiple" : "single"}
      collapsible={collapsible}
      defaultValue={allowMultiple ? defaultValue : defaultValue[0]}
      className={cn(
        variant === "bordered" && "border rounded-lg",
        variant === "separated" && "space-y-2",
        className,
      )}
    >
      {items.map((item, index) => {
        const itemId = item.id || item.title || `item-${index}`;

        // Get icon from config if available
        const configItem = field.ui.items?.[index];
        const itemIcon = configItem?.icon;

        return (
          <AccordionItem
            key={itemId}
            value={itemId}
            disabled={item.disabled}
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
                item.disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              <Div
                className={cn("flex items-center", titleGapClass || "gap-2")}
              >
                {itemIcon && (
                  <Span className={iconSizeClass || "text-lg"}>{itemIcon}</Span>
                )}
                <Span className="font-medium">{item.title}</Span>
              </Div>
            </AccordionTrigger>
            <AccordionContent
              className={cn(variant === "separated" && contentPaddingClass)}
            >
              {typeof item.content === "string" ? (
                <Div
                  className={cn(
                    "text-muted-foreground",
                    contentTextSizeClass || "text-sm",
                  )}
                >
                  {item.content}
                </Div>
              ) : (
                <Div className={contentTextSizeClass || "text-sm"}>
                  {JSON.stringify(item.content, null, 2)}
                </Div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

AccordionWidget.displayName = "AccordionWidget";
