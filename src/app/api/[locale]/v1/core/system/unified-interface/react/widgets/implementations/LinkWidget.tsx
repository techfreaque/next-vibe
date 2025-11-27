"use client";

import { ExternalLink } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import { type WidgetComponentProps } from "../../../shared/widgets/types";
import { extractLinkData } from "../../../shared/widgets/logic/link";
import { isExternalUrl } from "../../../shared/widgets/utils/widget-helpers";

/**
 * Link Widget Component
 * Renders a clickable link with optional external link indicator
 */
export function LinkWidget({
  value,
  field: _field,
  context,
  className,
}: WidgetComponentProps): JSX.Element {
  const { t } = simpleT(context.locale);

  // Extract data using shared logic
  const data = extractLinkData(value);

  // Handle null case
  if (!data) {
    return (
      <Span className={cn("text-muted-foreground italic", className)}>
        {t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.link.invalidData",
        )}
      </Span>
    );
  }

  const { url, text, openInNewTab } = data;

  const isExternal = isExternalUrl(url);

  const linkContent = (
    <>
      <Span className="truncate">{text}</Span>
      {openInNewTab && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
      )}
    </>
  );

  const commonClassName = cn(
    "inline-flex items-center gap-1.5 text-primary hover:underline transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
    !context.isInteractive && "pointer-events-none",
    className,
  );

  // For external links, we must use <a> tag with proper security attributes
  // Next.js Link component doesn't support external URLs properly
  if (isExternal) {
    // For target="_blank", always use "noopener noreferrer" for security
    if (openInNewTab) {
      return (
        // External link with target="_blank" - safe to use <a> tag
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClassName}
          aria-label={text}
        >
          {linkContent}
        </a>
      );
    }

    // External link without target="_blank"
    return (
      // External link - safe to use <a> tag
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href={url} className={commonClassName} aria-label={text}>
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={url} className={commonClassName}>
      {linkContent}
    </Link>
  );
}

LinkWidget.displayName = "LinkWidget";
