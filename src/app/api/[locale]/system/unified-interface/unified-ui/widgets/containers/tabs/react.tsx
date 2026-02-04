"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import { useWidgetTranslation } from "../../_shared/use-widget-context";
import type { TabsWidgetConfig } from "./types";

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
export function TabsWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget-object" | "object" | "object-optional",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  TabsWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const t = useWidgetTranslation();
  const {
    emptyPadding,
    triggerGap,
    iconSize,
    contentMargin,
    contentTextSize,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const emptyPaddingClass = getSpacingClassName("padding", emptyPadding);
  const triggerGapClass = getSpacingClassName("gap", triggerGap);
  const contentMarginClass = getSpacingClassName("margin", contentMargin);
  const contentTextSizeClass = getTextSizeClassName(contentTextSize);

  // Get classes from helper functions (no hardcoding!)
  const iconSizeClass = getTextSizeClassName(iconSize);

  const tabs = Array.isArray(field.value?.tabs) ? field.value.tabs : [];
  const activeTab = field.value?.activeTab;

  if (tabs.length === 0) {
    return (
      <Div
        className={cn(
          "text-center text-muted-foreground",
          emptyPaddingClass || "py-8",
          className,
        )}
      >
        {t("system.ui.widgets.tabs.empty")}
      </Div>
    );
  }

  const defaultTab = activeTab || tabs[0]?.id;

  return (
    <Tabs defaultValue={defaultTab} className={className}>
      <TabsList className="w-full justify-start">
        {tabs.map(
          (
            tab: { id: string; label: string; disabled?: boolean },
            index: number,
          ) => {
            // Get icon from config if available
            const configTab = field.tabs?.[index];
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
          },
        )}
      </TabsList>

      <MultiWidgetRenderer
        childrenSchema={field.children}
        value={tabs}
        fieldName={fieldName}
        renderItem={({ itemData, itemFieldName, childSchema }) => {
          // itemData should be an object with id and optional content
          if (
            typeof itemData !== "object" ||
            itemData === null ||
            Array.isArray(itemData)
          ) {
            return <></>;
          }

          const tabId =
            typeof itemData["id"] === "string"
              ? itemData["id"]
              : String(itemData["id"] || "");
          const tabContent = itemData["content"];

          const childrenSchema =
            "children" in childSchema ? childSchema.children : undefined;

          return (
            <TabsContent
              key={tabId}
              value={tabId}
              className={contentMarginClass || "mt-4"}
            >
              {tabContent !== null && tabContent !== undefined ? (
                <Div className={contentTextSizeClass || "text-sm"}>
                  <MultiWidgetRenderer
                    childrenSchema={
                      childrenSchema && "content" in childrenSchema
                        ? { content: childrenSchema.content }
                        : undefined
                    }
                    value={itemData}
                    fieldName={itemFieldName}
                  />
                </Div>
              ) : (
                <Div
                  className={cn(
                    "text-center text-muted-foreground italic",
                    emptyPaddingClass || "py-8",
                  )}
                >
                  {t("system.ui.widgets.tabs.noContent")}
                </Div>
              )}
            </TabsContent>
          );
        }}
      />
    </Tabs>
  );
}

TabsWidget.displayName = "TabsWidget";

export default TabsWidget;
