"use client";

import { ExternalLink } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import {
  type LinkWidgetData,
  type WidgetComponentProps,
  type RenderableValue,
} from "../../shared/ui/types";
import { isPlainObject, hasStringProperty } from "../../shared/utils/type-guards";

/**
 * Type guard for LinkWidgetData
 */
function isLinkWidgetData(data: RenderableValue): data is LinkWidgetData {
  return isPlainObject(data) && hasStringProperty(data, "url");
}

/**
 * Link Widget Component
 * Renders a clickable link with optional external link indicator
 */
export function LinkWidget({
  data,
  context,
  className,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!isLinkWidgetData(data)) {
    return (
      <Span className={cn("text-muted-foreground italic", className)}>
        {t(
          "app.api.v1.core.system.unifiedInterface.react.widgets.link.invalidData",
        )}
      </Span>
    );
  }

  const { url, title, description, openInNewTab = true, rel } = data;

  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  const linkContent = (
    <>
      <Span className="truncate">{title ?? url}</Span>
      {openInNewTab && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
      )}
      {description && <Span className="sr-only">{description}</Span>}
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
    // Note: We ignore custom rel prop when opening in new tab to ensure security
    if (openInNewTab) {
      return (
        // External link with target="_blank" - safe to use <a> tag
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClassName}
          aria-label={title ?? url}
        >
          {linkContent}
        </a>
      );
    }

    // External link without target="_blank"
    return (
      // External link - safe to use <a> tag
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a
        href={url}
        rel={rel}
        className={commonClassName}
        aria-label={title ?? url}
      >
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
