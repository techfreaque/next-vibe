"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { RenderableValue, WidgetComponentProps } from "../types";
import type { LinkCardData } from "./LinkCardWidget";
import { LinkCardWidget } from "./LinkCardWidget";

/**
 * Link List Data Interface
 */
export interface LinkListData extends Record<string, RenderableValue> {
  items: LinkCardData[];
  title?: string;
  description?: string;
  layout?: "grid" | "list";
  columns?: number;
}

/**
 * Type guard for LinkListData
 */
function isLinkListData(data: RenderableValue): data is LinkListData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "items" in data &&
    Array.isArray(data.items)
  );
}

/**
 * Link List Widget Component
 * Renders a list or grid of link cards
 */
export function LinkListWidget({
  data,
  metadata,
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isLinkListData(data)) {
    return (
      <div
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        —
      </div>
    );
  }
  const { items, title, description, layout = "list", columns = 1 } = data;

  if (!items || items.length === 0) {
    return (
      <div
        className={cn("py-8 text-center text-muted-foreground", className)}
        style={style}
      >
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <p>No results found</p>
      </div>
    );
  }

  const gridCols = layout === "grid" ? columns : 1;
  /* eslint-disable i18next/no-literal-string */
  const gridClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[gridCols] ?? "grid-cols-1";
  /* eslint-enable i18next/no-literal-string */

  return (
    <div className={cn("space-y-4", className)} style={style}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid gap-4",
          layout === "grid" ? gridClass : "grid-cols-1",
        )}
      >
        {items.map((item, index) => (
          <LinkCardWidget
            key={item.url ?? index}
            data={item}
            metadata={metadata}
            context={context}
          />
        ))}
      </div>
    </div>
  );
}

LinkListWidget.displayName = "LinkListWidget";
