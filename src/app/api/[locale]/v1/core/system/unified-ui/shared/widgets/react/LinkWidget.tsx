"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX, MouseEvent } from "react";

import type { LinkWidgetData, WidgetComponentProps } from "../types";

/**
 * Link Widget Component
 * Renders a clickable link with optional external link indicator
 */
export function LinkWidget({
  data,
  context,
  className,
  style,
}: WidgetComponentProps<LinkWidgetData>): JSX.Element {
  const { url, title, description, openInNewTab = true, rel } = data;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (context.onNavigate) {
      e.preventDefault();
      context.onNavigate(url);
    }
  };

  /* eslint-disable-next-line i18next/no-literal-string */
  const linkRel = rel ?? (openInNewTab ? "noopener noreferrer" : undefined);

  return (
    <a
      href={url}
      target={openInNewTab ? "_blank" : undefined}
      rel={linkRel}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-primary hover:underline transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        !context.isInteractive && "pointer-events-none",
        className,
      )}
      style={style}
      aria-label={title ?? url}
    >
      <span className="truncate">{title ?? url}</span>
      {openInNewTab && (
        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
      )}
      {description && <span className="sr-only">{description}</span>}
    </a>
  );
}

LinkWidget.displayName = "LinkWidget";
