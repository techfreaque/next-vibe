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
import type { JSX } from "react";
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import { extractSectionData } from "../../../shared/widgets/logic/section";
import {
  type WidgetComponentProps,
  type WidgetData,
} from "../../../shared/widgets/types";
import { WidgetType } from "../../../shared/types/enums";
import type { UnifiedField } from "../../../shared/types/endpoint";
import { WidgetRenderer } from "../renderers/WidgetRenderer";

/**
 * Type guard to check if an object is a UnifiedField
 */
function isUnifiedField(obj: unknown): obj is UnifiedField {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "ui" in obj &&
    typeof obj.ui === "object"
  );
}

/**
 * Section Widget Component
 * Displays titled content sections with optional collapsible behavior
 */
export function SectionWidget({
  value,
  field,
  context,
  className,
  form,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Extract data using shared logic
  const data = extractSectionData(value);

  // Handle null case
  if (!data) {
    return (
      <Card className={className}>
        <CardContent>
          <Div className="text-muted-foreground italic">
            {t("app.api.system.unifiedInterface.react.widgets.section.noData")}
          </Div>
        </CardContent>
      </Card>
    );
  }

  const { title, content, description, collapsible, defaultExpanded } = data;

  // State for collapsible sections
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? true);

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

      const contentField =
        "field" in content && isUnifiedField(content.field)
          ? content.field
          : field;

      return (
        <WidgetRenderer
          widgetType={contentType}
          data={contentData}
          field={contentField}
          context={context}
          form={form}
        />
      );
    }

    // Fallback: render as text
    return (
      <WidgetRenderer
        widgetType={WidgetType.TEXT}
        data={content}
        field={field}
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
                className="h-8 w-8 p-0"
                type="button"
              >
                <svg
                  className={cn(
                    "h-5 w-5 text-gray-500 transition-transform",
                    isExpanded && "rotate-180",
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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
