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

import { WidgetType } from "../../../shared/types/enums";
import { extractSectionData } from "../../../shared/widgets/logic/section";
import type {
  ReactWidgetProps,
  WidgetData,
} from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

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
export function SectionWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
  form,
  endpoint,
}: ReactWidgetProps<typeof WidgetType.SECTION, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
  const { emptyTextSize, chevronIconSize, chevronButtonSize } = field.ui;

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

  // Extract data using shared logic
  const data = extractSectionData(value);

  // Extract values with defaults for hooks (hooks must be called unconditionally)
  const { title, content, description, collapsible, defaultExpanded } =
    data ?? {
      title: "",
      content: null,
      description: undefined,
      collapsible: false,
      defaultExpanded: true,
    };

  // State for collapsible sections - must be called before any early returns
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? true);

  // Handle null case
  if (!data) {
    return (
      <Card className={className}>
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

  // Render content - can be a widget config or raw data
  const renderContent = (): JSX.Element => {
    // Check if content is a widget configuration
    if (
      typeof content === "object" &&
      content !== null &&
      !Array.isArray(content)
    ) {
      const contentType =
        "type" in content && typeof content.type === "string"
          ? (content.type as WidgetType)
          : WidgetType.TEXT;
      const contentData =
        "data" in content ? (content.data as WidgetData) : content;

      // Always use parent field - field definitions come from schema, not data
      const contentField = field;

      return (
        <WidgetRenderer
          widgetType={contentType}
          data={contentData}
          field={contentField}
          context={context}
          form={form}
          endpoint={endpoint}
        />
      );
    }

    // Fallback: render as text
    return (
      <WidgetRenderer
        widgetType={WidgetType.TEXT}
        data={content}
        field={field}
        endpoint={endpoint}
        context={context}
        form={form}
      />
    );
  };

  // Render non-collapsible section
  if (!collapsible) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    );
  }

  // Render collapsible section
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={className}
    >
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <Div className="flex items-center justify-between">
              <Div className="flex-1">
                <CardTitle>{title}</CardTitle>
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
          <CardContent>{renderContent()}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

SectionWidget.displayName = "SectionWidget";
