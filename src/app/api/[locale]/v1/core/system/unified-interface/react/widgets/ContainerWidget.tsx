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
  type ContainerWidgetData,
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Type guard for ContainerWidgetData
 */
function isContainerWidgetData(
  data: RenderableValue | ContainerWidgetData,
): data is ContainerWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "children" in data &&
    Array.isArray(data.children)
  );
}

/**
 * Container Widget Component
 * Renders a container with child widgets
 */
export function ContainerWidget({
  data,
  context,
  className,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!isContainerWidgetData(data)) {
    return (
      <Div
        className={cn("text-muted-foreground italic", className)}
        
      >
        —
      </Div>
    );
  }

  const { children, title, description, layout = { type: "stack" } } = data;

  if (!children || children.length === 0) {
    return (
      <Card className={className} >
        {(title ?? description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <P className="italic text-muted-foreground">
            {t(
              "app.api.v1.core.system.unifiedInterface.react.widgets.container.noContent",
            )}
          </P>
        </CardContent>
      </Card>
    );
  }

  /* eslint-disable i18next/no-literal-string */
  const layoutClass =
    {
      grid: `grid gap-${layout.gap ?? "4"} ${layout.columns ? `grid-cols-${layout.columns}` : "grid-cols-1"}`,
      flex: `flex flex-wrap gap-${layout.gap ?? "4"}`,
      stack: `flex flex-col gap-${layout.gap ?? "4"}`,
    }[layout.type] ?? "flex flex-col gap-4";
  /* eslint-enable i18next/no-literal-string */

  return (
    <Card className={className} >
      {(title ?? description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <Div className={cn(layoutClass)}>
          {children.map((child, index) => (
            <WidgetRenderer
              key={index}
              widgetType={child.type}
              data={child.data}
              metadata={child.metadata}
              context={context}
            />
          ))}
        </Div>
      </CardContent>
    </Card>
  );
}

ContainerWidget.displayName = "ContainerWidget";
