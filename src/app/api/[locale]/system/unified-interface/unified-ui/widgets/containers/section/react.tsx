"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getLayoutClassName,
  getTextSizeClassName,
  type LayoutConfig,
} from "../../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import { withValue } from "../../_shared/field-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChildren } from "../../_shared/type-guards";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import type { SectionWidgetConfig } from "./types";

/**
 * Section Widget - Displays titled content sections with optional collapsible behavior
 *
 * Renders organized content sections with customizable headers and collapse functionality.
 * Automatically detects and renders nested widget configurations or displays raw content as text.
 *
 * Data Format:
 * ```json
 * {
 *   "title": "Section Title",
 *   "content": {...},           // Widget config or raw data
 *   "description": "Optional description",
 *   "collapsible": true,        // Enable collapse/expand
 *   "defaultExpanded": true     // Initial collapsed state
 * }
 * ```
 *
 * Content Structure:
 * - Simple data: Rendered as text widget
 * - Widget config: `{ type: "...", data: {...}, field: {...} }`
 * - Nested fields: Automatically rendered with appropriate widget type
 *
 * UI Config options:
 * - title: Translation key for section title
 * - description: Translation key for section description
 * - collapsible: Whether section can be collapsed (default: false)
 * - defaultExpanded: Initial expanded state for collapsible sections (default: true)
 */
export function SectionWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  SectionWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const locale = useWidgetLocale();
  const widgetT = useWidgetTranslation();
  const { t } = simpleT(locale);
  const {
    emptyTextSize,
    chevronIconSize,
    chevronButtonSize,
    title: titleKey,
    description: descriptionKey,
    layoutType: layoutTypeRaw = "stacked",
    spacing = "normal",
    collapsible: uiCollapsible,
    defaultCollapsed: uiDefaultCollapsed = false,
  } = field;

  // Get classes from config (no hardcoding!)
  const emptyTextSizeClass = getTextSizeClassName(emptyTextSize);
  const chevronIconSizeClass = getIconSizeClassName(chevronIconSize);

  // Button size mapping
  const chevronButtonSizeClass =
    chevronButtonSize === "xs"
      ? "h-6 w-6"
      : chevronButtonSize === "sm"
        ? "h-8 w-8"
        : chevronButtonSize === "lg"
          ? "h-10 w-10"
          : "h-8 w-8";

  // State for collapsible sections - must be called before any early returns
  const [isExpanded, setIsExpanded] = useState(!uiDefaultCollapsed);

  // Section widget always has children (extends BaseObjectWidgetConfig)
  if (!hasChildren(field)) {
    // This should never happen - section widget requires object schema with children
    return (
      <Card className={field.className}>
        <CardContent>
          <Div
            className={cn("text-muted-foreground italic", emptyTextSizeClass)}
          >
            {t("app.api.system.unifiedInterface.react.widgets.section.noData")}
          </Div>
        </CardContent>
      </Card>
    );
  }

  // Render children
  {
    const title = titleKey ? widgetT(titleKey) : undefined;
    const description = descriptionKey ? widgetT(descriptionKey) : undefined;

    // Map spacing to gap value
    const gapValue =
      spacing === "compact" ? "2" : spacing === "relaxed" ? "6" : "4";

    // Get layout configuration
    const layoutConfig: LayoutConfig = {
      type: layoutTypeRaw === "grid" ? "grid" : "stack",
      columns: layoutTypeRaw === "grid" ? 12 : undefined,
      gap: gapValue,
    };
    const layoutClass = getLayoutClassName(layoutConfig);

    // Render children - delegate to MultiWidgetRenderer for proper type handling
    let childrenElements: JSX.Element | undefined;
    if ("children" in field && "value" in field) {
      const childrenEntries = Object.entries(field.children);
      childrenElements = (
        <Div className={layoutClass}>
          {childrenEntries.map(([childName, childField]) => {
            const childData =
              "value" in field ? field.value[childName] : undefined;
            const childColumns = childField.columns || 12;

            const childFieldName = fieldName
              ? `${fieldName}.${childName}`
              : childName;

            const gridStyle =
              layoutConfig.type === "grid"
                ? { gridColumn: `span ${childColumns} / span ${childColumns}` }
                : undefined;

            return (
              <Div
                key={childName}
                {...(gridStyle
                  ? { style: gridStyle }
                  : {
                      className: cn({
                        [`col-span-${childColumns}`]:
                          layoutConfig.type === "grid",
                      }),
                    })}
              >
                <WidgetRenderer
                  fieldName={childFieldName}
                  field={withValue(
                    childField,
                    childData,
                    "value" in field ? field.value : undefined,
                  )}
                />
              </Div>
            );
          })}
        </Div>
      );
    }

    // Render non-collapsible form section
    if (!uiCollapsible) {
      return (
        <Card className={"className" in field ? field.className : ""}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>{childrenElements}</CardContent>
        </Card>
      );
    }

    // Render collapsible form section
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={"className" in field ? field.className : ""}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
              <Div className="flex items-center justify-between">
                <Div className="flex-1">
                  {title && <CardTitle>{title}</CardTitle>}
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
                </Div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(chevronButtonSizeClass, "p-0")}
                  type="button"
                >
                  <ChevronDown
                    className={cn(
                      "text-gray-500 transition-transform",
                      chevronIconSizeClass || "h-5 w-5",
                      isExpanded && "rotate-180",
                    )}
                  />
                </Button>
              </Div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent>
              <Div className={layoutClass}>{childrenElements}</Div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }
}

SectionWidget.displayName = "SectionWidget";

export default SectionWidget;
