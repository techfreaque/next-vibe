"use client";

import { cn } from "next-vibe/shared/utils";
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractLinkData } from "../../../shared/widgets/logic/link";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
  isExternalUrl,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Link Widget - Renders clickable hyperlinks with external link indicators
 *
 * Displays links with automatic detection of external URLs and configurable
 * tab behavior. Automatically translates link text values.
 *
 * Features:
 * - External link detection with visual indicator (ExternalLink icon)
 * - Configurable target (_blank for new tab)
 * - Security: noopener noreferrer for external links
 * - Keyboard accessible with focus ring
 * - Truncated text for long URLs
 *
 * Data Format:
 * - string: Simple URL (translated via context.t), opens in new tab by default
 * - object: { url: string, text?: string, openInNewTab?: boolean }
 *   - url: Required destination URL (not translated)
 *   - text: Optional display text (translated via context.t, defaults to url)
 *   - openInNewTab: Whether to open in new tab (default: true)
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Link data (string URL or link object)
 * @param context - Rendering context with locale, translator, and interactivity flag
 * @param className - Optional CSS classes
 */
export function LinkWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.LINK, TKey>): JSX.Element {
  const { size, gap, iconSize } = field.ui;

  // Get classes from config (no hardcoding!)
  const sizeClass = getTextSizeClassName(size);
  const gapClass = getSpacingClassName("gap", gap);
  const iconSizeClass = getIconSizeClassName(iconSize);

  // Handle null/undefined/empty - just show dash for empty values
  if (value === null || value === undefined || value === "") {
    return <Span className="text-muted-foreground">—</Span>;
  }

  const data = extractLinkData(value);

  // If we have a value but can't extract link data, show the translated raw value
  if (!data) {
    const displayValue =
      typeof value === "string" ? context.t(value) : String(value);
    return <Span className={className}>{displayValue}</Span>;
  }

  const { url, text, openInNewTab } = data;
  const translatedText = context.t(text);
  const isExternal = isExternalUrl(url);

  return (
    <Link
      href={url}
      className={cn(
        "inline-flex items-center text-primary hover:underline transition-colors",
        gapClass || "gap-1.5",
        sizeClass,
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        !context.isInteractive && "pointer-events-none",
        className,
      )}
      target={openInNewTab ? "_blank" : undefined}
      rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
    >
      <Span className="truncate">{translatedText}</Span>
      {openInNewTab && (
        <ExternalLink className={cn(iconSizeClass, "shrink-0 opacity-70")} />
      )}
    </Link>
  );
}

LinkWidget.displayName = "LinkWidget";
