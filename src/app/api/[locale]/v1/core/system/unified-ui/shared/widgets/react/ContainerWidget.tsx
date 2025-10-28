"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import type { JSX } from "react";

import type {
  ContainerWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";
import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Type guard for ContainerWidgetData
 */
function isContainerWidgetData(
  data: RenderableValue,
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
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isContainerWidgetData(data)) {
    return (
      <div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        —
      </div>
    );
  }

  const { children, title, description, layout = { type: "stack" } } = data;

  if (!children || children.length === 0) {
    return (
      <Card className={className} style={style}>
        {(title ?? description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <p className="italic text-muted-foreground">No content</p>
        </CardContent>
      </Card>
    );
  }

  /* eslint-disable i18next/no-literal-string */
  const layoutClass =
    {
      grid: `grid gap-${layout.gap ?? "4"} ${layout.columns ? `grid-cols-${layout.columns}` : "grid-cols-1"}`,
      flex: `flex flex-wrap gap-${layout.gap ?? "4"}`,
      stack: `space-y-${layout.gap ?? "4"}`,
    }[layout.type] ?? "space-y-4";
  /* eslint-enable i18next/no-literal-string */

  return (
    <Card className={className} style={style}>
      {(title ?? description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div className={cn(layoutClass)}>
          {children.map((child, index) => (
            <WidgetRenderer
              key={index}
              widgetType={child.type}
              data={child.data}
              metadata={child.metadata}
              context={context}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

ContainerWidget.displayName = "ContainerWidget";
