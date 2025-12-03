"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import {
  type WidgetComponentProps,
  type WidgetData,
} from "../../../shared/widgets/types";
import { extractContainerData } from "../../../shared/widgets/logic/container";
import { WidgetType } from "../../../shared/types/enums";
import type { UnifiedField } from "../../../shared/types/endpoint";
import { WidgetRenderer } from "../renderers/WidgetRenderer";
import {
  extractLayoutConfig,
  getLayoutClassName,
  extractContainerDescription,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Container Widget Component
 * Displays container layouts with nested fields
 */
export function ContainerWidget({
  value,
  field: _field,
  context,
  className,
  form,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Extract data using shared logic
  const data = extractContainerData(value);

  // Handle null case
  if (!data) {
    return (
      <Card className={className}>
        <CardContent>
          <P className="italic text-muted-foreground">
            {t(
              "app.api.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </P>
        </CardContent>
      </Card>
    );
  }

  const { children, title } = data;

  // Extract layout configuration using shared logic
  const layoutConfig = extractLayoutConfig(value);
  const layoutClass = getLayoutClassName(layoutConfig);
  const description = extractContainerDescription(value);

  return (
    <Card className={className}>
      {(title ?? description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <Div className={cn(layoutClass)}>
          {children.map((child: unknown, index: number) => {
            // Type narrow each child
            if (typeof child !== "object" || child === null) {
              return null;
            }
            const childType =
              "type" in child && typeof child.type === "string"
                ? (child.type as WidgetType)
                : WidgetType.TEXT;
            const childData =
              "data" in child ? (child.data as WidgetData) : null;
            const childField =
              "field" in child && typeof child.field === "object"
                ? (child.field as UnifiedField)
                : _field;

            return (
              <WidgetRenderer
                key={index}
                widgetType={childType}
                data={childData}
                field={childField}
                context={context}
                form={form}
              />
            );
          })}
        </Div>
      </CardContent>
    </Card>
  );
}

ContainerWidget.displayName = "ContainerWidget";
