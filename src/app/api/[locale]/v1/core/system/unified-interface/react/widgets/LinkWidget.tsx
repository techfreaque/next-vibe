"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui//ui/span";
import { Link } from "next-vibe-ui//ui/link";
import type { JSX, MouseEvent } from "react";

import { simpleT } from "@/i18n/core/shared";

import type {
  LinkWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";

/**
 * Type guard for LinkWidgetData
 */
function isLinkWidgetData(data: RenderableValue): data is LinkWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "url" in data &&
    typeof data.url === "string"
  );
}

/**
 * Link Widget Component
 * Renders a clickable link with optional external link indicator
 */
export function LinkWidget({
  data,
  context,
  className,
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element {
  const { t } = simpleT(context.locale);

  if (!isLinkWidgetData(data)) {
    return (
      <Span
        className={cn("text-muted-foreground italic", className)}
        style={style}
      >
        {t("app.api.v1.core.system.unifiedInterface.react.widgets.link.invalidData")}
      </Span>
    );
  }

  const { url, title, description, openInNewTab = true, rel } = data;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (context.onNavigate) {
      e.preventDefault();
      context.onNavigate(url);
    }
  };

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
          onClick={handleClick}
          className={commonClassName}
          style={style}
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
        onClick={handleClick}
        className={commonClassName}
        style={style}
        aria-label={title ?? url}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link
      href={url}
      onClick={handleClick}
      className={commonClassName}
      style={style}
      aria-label={title ?? url}
    >
      {linkContent}
    </Link>
  );
}

LinkWidget.displayName = "LinkWidget";
