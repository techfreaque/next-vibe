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
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import { getDisplayUrl } from "../../../shared/widgets/logic/link-card";
import { extractLinkListData } from "../../../shared/widgets/logic/link-list";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getGridClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders a list or grid of link cards.
 */
export function LinkListWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.LINK_LIST, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
  const { containerGap, headerGap, gridGap, titleSize, descriptionSize } =
    field.ui;

  // Get classes from config (no hardcoding!)
  const containerGapClass = getSpacingClassName("gap", containerGap);
  const headerGapClass = getSpacingClassName("gap", headerGap);
  const gridGapClass = getSpacingClassName("gap", gridGap);
  const titleSizeClass = getTextSizeClassName(titleSize);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);

  // Extract data using shared logic
  const data = extractLinkListData(value);

  // Handle null case
  if (!data) {
    return (
      <Div className={cn("py-8 text-center text-muted-foreground", className)}>
        <P>
          {t(
            "app.api.system.unifiedInterface.react.widgets.linkList.noResults",
          )}
        </P>
      </Div>
    );
  }

  const { items, title, description, layout, columns } = data;
  const gridCols = layout === "grid" ? columns : 1;
  const gridClass = getGridClassName(gridCols as 1 | 2 | 3 | 4);

  return (
    <Div
      className={cn("flex flex-col", containerGapClass || "gap-4", className)}
    >
      {title && (
        <Div className={cn("flex flex-col", headerGapClass || "gap-1")}>
          <H3 className={cn("font-semibold", titleSizeClass || "text-lg")}>
            {title}
          </H3>
          {description && (
            <P
              className={cn(
                "text-muted-foreground",
                descriptionSizeClass || "text-sm",
              )}
            >
              {description}
            </P>
          )}
        </Div>
      )}
      <Div
        className={cn(
          "grid",
          gridGapClass || "gap-4",
          layout === "grid" ? gridClass : "grid-cols-1",
        )}
      >
        {items.map((item, index) => {
          const displayUrl = getDisplayUrl(item.url);
          const openInNewTab = item.openInNewTab !== false;
          const snippetText =
            typeof item.snippet === "string" ? item.snippet : undefined;

          return (
            <Card
              key={item.url ?? index}
              className="hover:bg-accent/50 transition-colors"
            >
              <Link
                href={item.url}
                target={openInNewTab ? "_blank" : undefined}
                rel={openInNewTab ? "noopener noreferrer" : undefined}
                className="block no-underline"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Span>{item.title || displayUrl}</Span>
                    {openInNewTab && <ExternalLink className="h-4 w-4" />}
                  </CardTitle>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                </CardHeader>
                {(snippetText || displayUrl) && (
                  <CardContent>
                    {snippetText && (
                      <P className="text-sm text-muted-foreground">
                        {snippetText}
                      </P>
                    )}
                    <P className="text-xs text-muted-foreground mt-1">
                      {displayUrl}
                    </P>
                  </CardContent>
                )}
              </Link>
            </Card>
          );
        })}
      </Div>
    </Div>
  );
}

LinkListWidget.displayName = "LinkListWidget";
