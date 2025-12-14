"use client";

import { cn } from "next-vibe/shared/utils";
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractLinkData } from "../../../shared/widgets/logic/link";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { isExternalUrl } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders a clickable link with optional external link indicator.
 */
export function LinkWidget({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.LINK>): JSX.Element {
  // Handle null/undefined/empty - just show dash for empty values
  if (value === null || value === undefined || value === "") {
    return <Span className="text-muted-foreground">—</Span>;
  }

  const data = extractLinkData(value);

  // If we have a value but can't extract link data, show the raw value
  if (!data) {
    return <Span className={className}>{String(value)}</Span>;
  }

  const { url, text, openInNewTab } = data;
  const isExternal = isExternalUrl(url);

  return (
    <Link
      href={url}
      className={cn(
        "inline-flex items-center gap-1.5 text-primary hover:underline transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        !context.isInteractive && "pointer-events-none",
        className,
      )}
      target={openInNewTab ? "_blank" : undefined}
      rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
    >
      <Span className="truncate">{text}</Span>
      {openInNewTab && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
      )}
    </Link>
  );
}

LinkWidget.displayName = "LinkWidget";
