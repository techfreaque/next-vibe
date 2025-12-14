"use client";

import { cn } from "next-vibe/shared/utils";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { CardDescription } from "next-vibe-ui/ui/card";
import { CardHeader } from "next-vibe-ui/ui/card";
import { CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractLinkCardData } from "../../../shared/widgets/logic/link-card";
import type { ValueOnlyReactWidgetProps } from "../../../shared/widgets/types";
import { isExternalUrl } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders a card with link information, ideal for search results.
 */
export function LinkCardWidget({
  value,
  context,
  className,
}: ValueOnlyReactWidgetProps<typeof WidgetType.LINK_CARD>): JSX.Element {
  // Extract data using shared logic
  const data = extractLinkCardData(value);

  // Handle null case
  if (!data) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <Span className="text-muted-foreground italic">—</Span>
        </CardContent>
      </Card>
    );
  }

  const {
    url,
    title,
    description,
    snippet,
    age,
    source,
    thumbnail,
    openInNewTab = true,
  } = data;

  const displayDescription = snippet ?? description;
  const isExternal = isExternalUrl(url);

  return (
    <Card
      className={cn(
        "group/card transition-all hover:shadow-md",
        !context.isInteractive && "opacity-75",
        className,
      )}
    >
      <Link
        href={url}
        target={openInNewTab ? "_blank" : undefined}
        rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
        className={cn(
          "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
          !context.isInteractive && "pointer-events-none",
        )}
      >
        <CardHeader className="pb-3">
          <Div className="flex items-start justify-between gap-2">
            <Div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Span className="truncate transition-colors group-hover/card:text-primary">
                  {title}
                </Span>
                <ExternalLink className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover/card:opacity-100" />
              </CardTitle>
              <Div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {source && <Span className="font-medium">{source}</Span>}
                {age && source && <Span>•</Span>}
                {age && <Span>{age}</Span>}
              </Div>
            </Div>
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded shrink-0"
              />
            )}
          </Div>
        </CardHeader>
        {displayDescription && (
          <CardContent className="pt-0">
            <CardDescription className="line-clamp-3 text-sm">
              {displayDescription}
            </CardDescription>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}

LinkCardWidget.displayName = "LinkCardWidget";
