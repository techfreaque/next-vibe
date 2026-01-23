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
import { hasChildren } from "../../../shared/widgets/utils/field-type-guards";
import {
  getIconSizeClassName,
  getLayoutClassName,
  getTextSizeClassName,
  type LayoutConfig,
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
  fieldName,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButton,
  cancelButton,
}: ReactWidgetProps<typeof WidgetType.SECTION, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
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
  } = field.ui;

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

  // Check if this is a form section (has children) or display section (has content in data)
  const isFormSection = hasChildren(field);

  // State for collapsible sections - must be called before any early returns
  const [isExpanded, setIsExpanded] = useState(!uiDefaultCollapsed);

  // For form sections, render children
  if (isFormSection && hasChildren(field)) {
    const title = titleKey ? context.t(titleKey) : undefined;
    const description = descriptionKey ? context.t(descriptionKey) : undefined;

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

    // Get child data from value
    const getChildData = (childName: string): WidgetData => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        childName in value
      ) {
        const valueObj = value as Record<string, WidgetData>;
        return valueObj[childName];
      }
      return null;
    };

    // Render children
    const childrenElements = Object.entries(field.children).map(
      ([childName, childField]) => {
        const childData = getChildData(childName);
        const childColumns =
          (childField.ui as { columns?: number }).columns || 12;

        // Construct nested field name for proper field config resolution
        // e.g., if section is "contactInfo" and child is "email", pass "contactInfo.email"
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
                    [`col-span-${childColumns}`]: layoutConfig.type === "grid",
                  }),
                })}
          >
            <WidgetRenderer
              widgetType={childField.ui.type}
              fieldName={childFieldName}
              data={childData}
              field={childField}
              context={context}
              form={form}
              onSubmit={onSubmit}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              endpoint={endpoint}
              submitButton={submitButton}
              cancelButton={cancelButton}
            />
          </Div>
        );
      },
    );

    // Render non-collapsible form section
    if (!uiCollapsible) {
      return (
        <Card className={className}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>
            <Div className={layoutClass}>{childrenElements}</Div>
          </CardContent>
        </Card>
      );
    }

    // Render collapsible form section
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

  // Display section (legacy format with content in data)
  const data = extractSectionData(value);

  // Extract values with defaults for hooks (hooks must be called unconditionally)
  const { title, content, description, collapsible } = data ?? {
    title: "",
    content: null,
    description: undefined,
    collapsible: false,
  };

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
