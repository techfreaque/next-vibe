"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { H3 } from "next-vibe-ui/ui/typography";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
import { extractLinkListData } from "../../../shared/widgets/logic/link-list";
import { LinkCardWidget } from "./LinkCardWidget";
import { getGridClassName } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Link List Widget Component
 * Renders a list or grid of link cards
 */
export function LinkListWidget({
  value,
  field: _field,
  context,
  className,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Extract data using shared logic
  const data = extractLinkListData(value);

  // Handle null case
  if (!data) {
    return (
      <Div className={cn("py-8 text-center text-muted-foreground", className)}>
        <P>
          {t(
            "app.api.v1.core.system.unifiedInterface.react.widgets.linkList.noResults",
          )}
        </P>
      </Div>
    );
  }

  const { items, title, description, layout, columns } = data;
  const gridCols = layout === "grid" ? columns : 1;
  const gridClass = getGridClassName(gridCols as 1 | 2 | 3 | 4);

  return (
    <Div className={cn("flex flex-col gap-4", className)}>
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
        {items.map((item, index) => {
          return (
            <LinkCardWidget
              key={item.url ?? index}
              value={item}
              context={context}
              field={_field}
            />
          );
        })}
      </Div>
    </Div>
  );
}

LinkListWidget.displayName = "LinkListWidget";
