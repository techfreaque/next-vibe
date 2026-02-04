"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
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
import {
  useWidgetIsInteractive,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
  TUsage extends FieldUsageConfig,
>(
  props:
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        LinkWidgetConfig<TKey, never, TUsage, "widget">
      >
    | ReactWidgetProps<
        TEndpoint,
        TUsage,
        LinkWidgetConfig<TKey, LinkWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field } = props;
  const t = useWidgetTranslation();
  const isInteractive = useWidgetIsInteractive();
  const { size, gap, iconSize, href, text, external, textAlign, className } =
    field;

  // Get classes from config
  const sizeClass = getTextSizeClassName(size);
  const gapClass = getSpacingClassName("gap", gap);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const containerClass =
    textAlign === "center"
      ? "flex justify-center w-full"
      : textAlign === "right"
        ? "flex justify-end w-full"
        : undefined;

  // Priority 1: Dynamic value from field.value
  if (field.value !== null && field.value !== undefined && field.value !== "") {
    const data = extractLinkData(field.value);

    if (data) {
      const { url, text: dataText, openInNewTab } = data;
      const translatedText = t(dataText);
      const isExternal = isExternalUrl(url);

      return (
        <Div className={containerClass}>
          <Link
            href={url}
            className={cn(
              "inline-flex items-center text-primary hover:underline transition-colors",
              gapClass || "gap-1.5",
              sizeClass,
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
              !isInteractive && "pointer-events-none",
              className,
            )}
            target={openInNewTab ? "_blank" : undefined}
            rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
          >
            <Span className="truncate">{translatedText}</Span>
            {openInNewTab && (
              <ExternalLink
                className={cn(iconSizeClass, "shrink-0 opacity-70")}
              />
            )}
          </Link>
        </Div>
      );
    }
  }

  // Priority 2: Static text and href props
  if (text && href) {
    const translatedText = t(text);
    const openInNewTab = external === true; // only true if explicitly true
    const isExternal = isExternalUrl(href);

    return (
      <Div className={containerClass}>
        <Link
          href={href}
          className={cn(
            "inline-flex items-center text-primary hover:underline transition-colors",
            gapClass || "gap-1.5",
            sizeClass,
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
            !isInteractive && "pointer-events-none",
            className,
          )}
          target={openInNewTab ? "_blank" : undefined}
          rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
        >
          <Span className="truncate">{translatedText}</Span>
          {openInNewTab && (
            <ExternalLink
              className={cn(iconSizeClass, "shrink-0 opacity-70")}
            />
          )}
        </Link>
      </Div>
    );
  }

  // Priority 3: Just show a dash if nothing is available
  return <Span className="text-muted-foreground">—</Span>;
}

LinkWidget.displayName = "LinkWidget";

export default LinkWidget;
