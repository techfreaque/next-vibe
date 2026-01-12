"use client";

import { cn } from "next-vibe/shared/utils";
import { Card } from "next-vibe-ui/ui/card";
import { CardContent } from "next-vibe-ui/ui/card";
import { CardDescription } from "next-vibe-ui/ui/card";
import { CardHeader } from "next-vibe-ui/ui/card";
import { CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink } from "next-vibe-ui/ui/icons";
import { Image } from "next-vibe-ui/ui/image";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import { extractLinkCardData } from "../../../shared/widgets/logic/link-card";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { isWidgetDataString } from "../../../shared/widgets/utils/field-type-guards";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
  getThumbnailSizeClassName,
  isExternalUrl,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Link Card Widget - Displays a link in a rich card format with metadata
 *
 * Renders a clickable card with URL, title, description/snippet, optional thumbnail,
 * source attribution, and age timestamp. Ideal for search results, article previews,
 * or any content that links to external resources. Automatically translates all text
 * content and handles external link security.
 *
 * Features:
 * - Rich card layout with thumbnail support
 * - External link indicator icon with hover effect
 * - Source attribution and age display
 * - Truncated description (line-clamp-3) with snippet fallback
 * - Hover shadow transition effect
 * - Security attributes for external links (noopener noreferrer)
 * - Interactive state handling with pointer events control
 * - Focus ring for keyboard navigation
 * - Responsive thumbnail display (64x64)
 * - Dark mode support
 *
 * Security:
 * - Automatically detects external URLs
 * - Adds rel="noopener noreferrer" for external links
 * - Opens in new tab by default (configurable)
 *
 * Data Format:
 * - object: {
 *     url: string - Target URL for the link
 *     title: string - Card title/headline (translated via context.t)
 *     description?: string - Full description text (translated)
 *     snippet?: string - Short excerpt text (takes precedence, translated)
 *     age?: string - Time since publication (e.g., "2 hours ago", translated)
 *     source?: string - Source name/domain (translated)
 *     thumbnail?: string - Image URL for preview thumbnail
 *     openInNewTab?: boolean - Whether to open in new tab (default: true)
 *   }
 * - null/undefined: Shows "—" placeholder in card
 *
 * @param value - Link card data with URL, title, and metadata
 * @param context - Rendering context with locale and translator
 * @param className - Optional CSS classes
 */
export function LinkCardWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.LINK_CARD, TKey>): JSX.Element {
  const {
    padding,
    titleGap,
    metaGap,
    titleSize,
    metaSize,
    descriptionSize,
    iconSize,
    thumbnailSize,
    spacing,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const paddingClass = getSpacingClassName("padding", padding);
  const titleGapClass = getSpacingClassName("gap", titleGap);
  const metaGapClass = getSpacingClassName("gap", metaGap);
  const titleSizeClass = getTextSizeClassName(titleSize);
  const metaSizeClass = getTextSizeClassName(metaSize);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const thumbnailSizeClass = getThumbnailSizeClassName(thumbnailSize);
  const spacingClass = getSpacingClassName("margin", spacing);

  const data = extractLinkCardData(value);

  if (!data) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className={cn(paddingClass || "p-4")}>
          <Span className="text-muted-foreground italic">—</Span>
        </CardContent>
      </Card>
    );
  }

  const {
    url,
    title,
    description,
    snippet,
    age,
    source,
    thumbnail,
    openInNewTab = true,
  } = data;

  const translatedTitle = isWidgetDataString(title, context);
  const translatedDescription = isWidgetDataString(description, context);
  const translatedSnippet = isWidgetDataString(snippet, context);
  const translatedAge = isWidgetDataString(age, context);
  const translatedSource = isWidgetDataString(source, context);

  const displayDescription = translatedSnippet ?? translatedDescription;
  const isExternal = isExternalUrl(url);

  return (
    <Card
      className={cn(
        "group/card transition-all hover:shadow-md",
        !context.isInteractive && "opacity-75",
        className,
      )}
    >
      <Link
        href={url}
        target={openInNewTab ? "_blank" : undefined}
        rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
        className={cn(
          "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
          !context.isInteractive && "pointer-events-none",
        )}
      >
        <CardHeader className="pb-3">
          <Div
            className={cn(
              "flex items-start justify-between",
              titleGapClass || "gap-2",
            )}
          >
            <Div className="min-w-0 flex-1">
              <CardTitle
                className={cn(
                  "flex items-center font-semibold",
                  titleGapClass || "gap-2",
                  titleSizeClass || "text-base",
                )}
              >
                <Span className="truncate transition-colors group-hover/card:text-primary">
                  {translatedTitle}
                </Span>
                <ExternalLink
                  className={cn(
                    iconSizeClass,
                    "shrink-0 opacity-50 transition-opacity group-hover/card:opacity-100",
                  )}
                />
              </CardTitle>
              <Div
                className={cn(
                  "flex items-center text-muted-foreground",
                  spacingClass || "mt-1",
                  metaGapClass || "gap-2",
                  metaSizeClass || "text-xs",
                )}
              >
                {translatedSource && (
                  <Span className="font-medium">{translatedSource}</Span>
                )}
                {translatedAge && translatedSource && <Span>•</Span>}
                {translatedAge && <Span>{translatedAge}</Span>}
              </Div>
            </Div>
            {thumbnail && (
              <Image
                src={thumbnail}
                alt={translatedTitle || ""}
                width={64}
                height={64}
                className={cn(
                  thumbnailSizeClass,
                  "object-cover rounded shrink-0",
                )}
              />
            )}
          </Div>
        </CardHeader>
        {displayDescription && (
          <CardContent className="pt-0">
            <CardDescription
              className={cn("line-clamp-3", descriptionSizeClass || "text-sm")}
            >
              {displayDescription}
            </CardDescription>
          </CardContent>
        )}
      </Link>
    </Card>
  );
}

LinkCardWidget.displayName = "LinkCardWidget";
