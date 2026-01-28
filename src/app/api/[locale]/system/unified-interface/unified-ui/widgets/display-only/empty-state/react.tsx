"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getSpacingClassName,
  getTextSizeClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { Icon } from "../../form-fields/icon-field/icons";
import type { EmptyStateWidgetConfig } from "./types";

/**
 * Empty State Widget - Displays empty state messages with optional actions
 *
 * Renders centered empty state UI when no data is available, with:
 * - Optional icon for visual context
 * - Title message (translated via context.t)
 * - Optional description text (translated via context.t)
 * - Optional action button with callback
 *
 * Features:
 * - Centered layout with proper spacing
 * - Muted styling for non-intrusive display
 * - Icon support for visual context
 * - Action button with primary styling
 * - Responsive padding and sizing
 *
 * UI Config Options:
 * - title: Main empty state message (TKey - translated)
 * - message: Additional description text (TKey - translated)
 * - action: { text: TKey, onClick?: string } - Action button config
 *
 * Data Format:
 * - object: { title: string, description?: string, icon?: string, action?: { label: string, onClick?: string } }
 *   - title: Main message (translated via context.t)
 *   - description: Optional description (translated via context.t)
 *   - icon: Optional icon key for display
 *   - action: Optional action with label and handler
 * - null/undefined: Shows "—" placeholder
 *
 * @param value - Empty state data
 * @param field - Field definition with UI config
 * @param context - Rendering context with translator
 */
export default function EmptyStateWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  EmptyStateWidgetConfig<TKey, TUsage>
>): JSX.Element {
  const {
    title: titleKey,
    message: messageKey,
    action: actionConfig,
    padding,
    iconContainerSize,
    iconSize,
    iconSpacing,
    titleSize,
    titleSpacing,
    descriptionSize,
    descriptionSpacing,
    icon,
  } = field;

  // Get translated content from field config
  const title = context.t(titleKey);
  const description = messageKey ? context.t(messageKey) : undefined;

  // Get classes from config (no hardcoding!)
  const paddingClass = getSpacingClassName("padding", padding);
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);
  const titleSizeClass = getTextSizeClassName(titleSize);
  const titleSpacingClass = getSpacingClassName("margin", titleSpacing);
  const descriptionSizeClass = getTextSizeClassName(descriptionSize);
  const descriptionSpacingClass = getSpacingClassName(
    "margin",
    descriptionSpacing,
  );

  // Icon container size mapping
  const iconContainerSizeClass =
    iconContainerSize === "sm"
      ? "w-10 h-10"
      : iconContainerSize === "lg"
        ? "w-16 h-16"
        : "w-12 h-12";

  return (
    <Card className="border-dashed">
      <CardContent
        className={cn(
          "flex flex-col items-center justify-center text-center",
          paddingClass || "py-12 px-6",
        )}
      >
        {/* Icon */}
        {icon && (
          <Div
            className={cn(
              "flex items-center justify-center rounded-full bg-muted",
              iconContainerSizeClass,
              iconSpacingClass || "mb-4",
            )}
          >
            <Icon
              icon={icon}
              className={cn(
                "text-muted-foreground",
                iconSizeClass || "h-6 w-6",
              )}
            />
          </Div>
        )}

        {/* Title */}
        <P
          className={cn(
            "font-medium",
            titleSizeClass || "text-lg",
            titleSpacingClass || "mb-2",
          )}
        >
          {title}
        </P>

        {/* Description */}
        {description && (
          <P
            className={cn(
              "text-muted-foreground max-w-md",
              descriptionSizeClass || "text-sm",
              descriptionSpacingClass || "mb-6",
            )}
          >
            {description}
          </P>
        )}

        {/* Action */}
        {actionConfig && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              // Action handling would be passed from parent
              context.logger.debug("Empty state action:", actionConfig.text);
            }}
          >
            {context.t(actionConfig.text)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

EmptyStateWidget.displayName = "EmptyStateWidget";
