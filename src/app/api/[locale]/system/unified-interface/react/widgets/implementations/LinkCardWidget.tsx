"use client";

import { ExternalLink } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils";
import { Image } from "next-vibe-ui/ui/image";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { CardDescription } from "next-vibe-ui/ui/card";
import { CardHeader } from "next-vibe-ui/ui/card";
import { CardTitle } from "next-vibe-ui/ui/card";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";
import { type WidgetComponentProps } from "../../../shared/widgets/types";
import { extractLinkCardData } from "../../../shared/widgets/logic/link-card";
import { isExternalUrl } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Link Card Widget Component
 * Renders a card with link information, perfect for search results
 */
export function LinkCardWidget({
  value,
  field: _field,
  context,
  className,
}: WidgetComponentProps): JSX.Element {
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
