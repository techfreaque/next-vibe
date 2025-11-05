"use client";

import { ExternalLink } from 'next-vibe-ui/ui/icons';
import Image from "next/image";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui//ui/div";
import { Span } from "next-vibe-ui//ui/span";
import { Card } from "next-vibe-ui//ui/card";
import { CardContent } from "next-vibe-ui//ui/card";
import { CardDescription } from "next-vibe-ui//ui/card";
import { CardHeader } from "next-vibe-ui//ui/card";
import { CardTitle } from "next-vibe-ui//ui/card";
import { Link } from "next-vibe-ui//ui/link";
import type { JSX, MouseEvent } from "react";

import type { RenderableValue, WidgetComponentProps } from "../types";

/**
 * Link Card Data Interface
 */
export interface LinkCardData extends Record<string, RenderableValue> {
  url: string;
  title: string;
  snippet?: string;
  description?: string;
  age?: string;
  source?: string;
  thumbnail?: string;
  openInNewTab?: boolean;
}

/**
 * Type guard for LinkCardData
 */
function isLinkCardData(data: RenderableValue): data is LinkCardData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "url" in data &&
    typeof data.url === "string" &&
    "title" in data &&
    typeof data.title === "string"
  );
}

/**
 * Link Card Widget Component
 * Renders a card with link information, perfect for search results
 */
export function LinkCardWidget({
  data,
  metadata: _metadata,
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isLinkCardData(data)) {
    return (
      <Card className={cn("overflow-hidden", className)} style={style}>
        <CardContent className="p-4">
          <Span className="text-muted-foreground italic">—</Span>
        </CardContent>
      </Card>
    );
  }
  const {
    url,
    title,
    snippet,
    description,
    age,
    source,
    thumbnail,
    openInNewTab = true,
  } = data;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (context.onNavigate) {
      e.preventDefault();
      context.onNavigate(url);
    }
  };

  const displayDescription = snippet ?? description;
  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  // Always use external links for openInNewTab to avoid eslint errors
  const shouldUseExternalLink = isExternal || openInNewTab;

  const linkContent = (
    <>
      <CardHeader className="pb-3">
        <Div className="flex items-start justify-between gap-2">
          <Div className="min-w-0 flex-1">
            <CardTitle className="group flex items-center gap-2 text-base font-semibold">
              <Span className="truncate transition-colors group-hover:text-primary">
                {title}
              </Span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
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
              className="w-16 h-16 object-cover rounded flex-shrink-0"
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
    </>
  );

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        !context.isInteractive && "opacity-75",
        className,
      )}
      style={style}
    >
      {shouldUseExternalLink ? (
        // External link or new tab - safe to use <a> tag
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href={url}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          className={cn(
            "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
            !context.isInteractive && "pointer-events-none",
          )}
        >
          {linkContent}
        </a>
      ) : (
        <Link
          href={url}
          onClick={handleClick}
          className={cn(
            "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
            !context.isInteractive && "pointer-events-none",
          )}
        >
          {linkContent}
        </Link>
      )}
    </Card>
  );
}

LinkCardWidget.displayName = "LinkCardWidget";
