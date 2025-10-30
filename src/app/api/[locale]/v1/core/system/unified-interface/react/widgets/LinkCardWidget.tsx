"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
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
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  if (!isLinkCardData(data)) {
    return (
      <Card className={cn("overflow-hidden", className)} style={style}>
        <CardContent className="p-4">
          <span className="text-muted-foreground italic">—</span>
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
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="group flex items-center gap-2 text-base font-semibold">
              <span className="truncate transition-colors group-hover:text-primary">
                {title}
              </span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
            </CardTitle>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {source && <span className="font-medium">{source}</span>}
              {age && source && <span>•</span>}
              {age && <span>{age}</span>}
            </div>
          </div>
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded flex-shrink-0"
            />
          )}
        </div>
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
