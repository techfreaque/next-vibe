"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractTabsData } from "../../../shared/widgets/logic/tabs";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getBorderRadiusClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Tabs Widget - Displays tabbed navigation with switchable content panels
 *
 * Renders tab navigation with:
 * - Multiple tabs with labels and optional icons
 * - Configurable active/default tab
 * - Disabled tab states
 * - Tab content panels that switch on selection
 * - Keyboard accessible (Arrow keys, Home/End)
 *
 * Features:
 * - Smooth tab switching with content transitions
 * - Keyboard navigation support
 * - Disabled tab state with visual feedback
 * - Optional icon support for tabs
 * - Automatic translation of labels and content
 * - Responsive layout
 *
 * UI Config Options:
 * - tabs: Array of { id, label, icon?, disabled? }
 * - defaultTab: ID of initially active tab
 *
 * Data Format:
 * - object: { tabs: Array<{ id: string, label: string, content: any, disabled?: boolean }>, activeTab?: string }
 *   - tabs: Array of tab definitions
 *     - id: Unique tab identifier
 *     - label: Tab label text (translated via context.t)
 *     - content: Tab content (any widget data)
 *     - disabled: Whether tab is disabled
 *   - activeTab: ID of currently active tab
 * - null/undefined: Shows empty state
 *
 * @param value - Tabs data with tabs array
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 * @param className - Optional CSS classes
 */
export function TabsWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.TABS, TKey>): JSX.Element {
  const {
    emptyPadding,
    triggerGap,
    iconSize,
    contentMargin,
    contentTextSize,
    prePadding,
    preBorderRadius,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const emptyPaddingClass = getSpacingClassName("padding", emptyPadding);
  const triggerGapClass = getSpacingClassName("gap", triggerGap);
  const contentMarginClass = getSpacingClassName("margin", contentMargin);
  const contentTextSizeClass = getTextSizeClassName(contentTextSize);
  const prePaddingClass = getSpacingClassName("padding", prePadding);

  // Get classes from helper functions (no hardcoding!)
  const iconSizeClass = getTextSizeClassName(iconSize);
  const preBorderRadiusClass = getBorderRadiusClassName(preBorderRadius || "lg");

  // Extract data using shared logic
  const data = extractTabsData(value);

  if (!data || !data.tabs || data.tabs.length === 0) {
    return (
      <Div
        className={cn("text-center text-muted-foreground", emptyPaddingClass || "py-8", className)}
      >
        {context.t("system.ui.widgets.tabs.empty")}
      </Div>
    );
  }

  const { tabs, activeTab } = data;
  const defaultTab = activeTab || tabs[0]?.id;

  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList className="w-full justify-start">
        {tabs.map((tab, index) => {
          // Get icon from config if available
          const configTab = field.ui.tabs?.[index];
          const tabIcon = configTab?.icon;

          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn("flex items-center", triggerGapClass || "gap-2")}
            >
              {tabIcon && <Span className={iconSizeClass}>{tabIcon}</Span>}
              <Span>{tab.label}</Span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className={contentMarginClass || "mt-4"}>
          {tab.content !== null && tab.content !== undefined ? (
            typeof tab.content === "string" ? (
              <Div className={contentTextSizeClass || "text-sm"}>{tab.content}</Div>
            ) : (
              <Div className={contentTextSizeClass || "text-sm"}>
                <Pre
                  className={cn(
                    "bg-muted overflow-x-auto",
                    prePaddingClass || "p-4",
                    preBorderRadiusClass,
                  )}
                >
                  {JSON.stringify(tab.content, null, 2)}
                </Pre>
              </Div>
            )
          ) : (
            <Div
              className={cn(
                "text-center text-muted-foreground italic",
                emptyPaddingClass || "py-8",
              )}
            >
              {context.t("system.ui.widgets.tabs.noContent")}
            </Div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

TabsWidget.displayName = "TabsWidget";
