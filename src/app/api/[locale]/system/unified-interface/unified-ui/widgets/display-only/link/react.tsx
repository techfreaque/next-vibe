"use client";

import { cn } from "next-vibe/shared/utils";
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
  isExternalUrl,
} from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import { extractLinkData } from "./shared";
import type { LinkWidgetConfig, LinkWidgetSchema } from "./types";

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
 * @param value - Link data (properly typed from schema)
 * @param field - Field definition with UI config
 * @param context - Rendering context with locale, translator, and interactivity flag
 */
export function LinkWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends LinkWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  LinkWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const { size, gap, iconSize, href, className } = field;
  const hrefValue = field.value || href;

  // Get classes from config
  const sizeClass = getTextSizeClassName(size);
  const gapClass = getSpacingClassName("gap", gap);
  const iconSizeClass = getIconSizeClassName(iconSize);

  // Handle null/undefined/empty - just show dash for empty values
  if (hrefValue === null || hrefValue === undefined || hrefValue === "") {
    return <Span className="text-muted-foreground">—</Span>;
  }

  // value is properly typed from schema - no assertions needed
  const data = extractLinkData(hrefValue);

  // If we have a value but can't extract link data, show the translated raw value
  if (!data) {
    return <Span className={className}>{context.t(hrefValue)}</Span>;
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

export default LinkWidget;
