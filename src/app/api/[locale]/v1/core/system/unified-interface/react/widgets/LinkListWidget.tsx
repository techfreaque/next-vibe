"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import {
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
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
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!isLinkListData(data)) {
    return (
      <Div
        className={cn("text-muted-foreground italic", className)}
        
      >
        —
      </Div>
    );
  }
  const { items, title, description, layout = "list", columns = 1 } = data;

  if (!items || items.length === 0) {
    return (
      <Div
        className={cn("py-8 text-center text-muted-foreground", className)}
        
      >
        <P>
          {t(
            "app.api.v1.core.system.unifiedInterface.react.widgets.linkList.noResults",
          )}
        </P>
      </Div>
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
    <Div className={cn("flex flex-col gap-4", className)} >
      {title && (
        <Div className="flex flex-col gap-1">
          <H3 className="text-lg font-semibold">{title}</H3>
          {description && (
            <P className="text-sm text-muted-foreground">{description}</P>
          )}
        </Div>
      )}
      <Div
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
      </Div>
    </Div>
  );
}

LinkListWidget.displayName = "LinkListWidget";
