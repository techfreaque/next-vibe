"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import { Icon, type IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps, WidgetData } from "../../../shared/widgets/types";
import { isWidgetDataObject } from "../../../shared/widgets/utils/field-type-guards";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders a navigation button widget for cross-definition navigation.
 * Handles type-safe navigation to other endpoint definitions.
 *
 * The navigation config is stored in field.ui.metadata:
 * - targetEndpoint: The endpoint to navigate to (null for back navigation)
 * - extractParams: Function to extract params from source data
 * - prefillFromGet: Whether to fetch GET data before showing form
 */
export function NavigateButtonWidget<const TKey extends string>({
  field,
  context,
  className,
  value,
}: ReactWidgetProps<typeof WidgetType.NAVIGATE_BUTTON, TKey>): JSX.Element {
  const { label, icon, variant = "default", metadata, iconSize, iconSpacing } = field.ui;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonIcon = icon ? (icon as IconKey) : undefined;
  const buttonText = label ? context.t(label) : undefined;

  // Don't render if no metadata
  if (!metadata) {
    return <></>;
  }

  // Back navigation
  if (metadata.targetEndpoint === null) {
    // Don't render back button if there's nothing to navigate back to
    if (!context.navigation || !context.navigation.canGoBack) {
      return <></>;
    }

    const handleClick = (): void => {
      context.navigation?.pop();
    };

    return (
      <Button
        type="button"
        onClick={handleClick}
        variant={variant === "primary" ? "default" : variant}
        className={className}
      >
        {buttonIcon && (
          <Icon
            icon={buttonIcon}
            className={cn(iconSizeClass || "h-4 w-4", buttonText ? iconSpacingClass || "mr-2" : "")}
          />
        )}
        {buttonText}
      </Button>
    );
  }

  // Forward navigation - check if extractParams exists and targetEndpoint is not null
  if (!metadata.extractParams || metadata.targetEndpoint === null) {
    context.logger.error(
      "NavigateButtonWidget: Forward navigation without extractParams or targetEndpoint",
    );
    return <></>;
  }

  const handleClick = (): void => {
    if (!context.navigation || !metadata.extractParams || metadata.targetEndpoint === null) {
      context.logger.warn(
        "NavigateButtonWidget: No navigation context, extractParams, or targetEndpoint",
      );
      return;
    }

    // Extract params and navigate
    const sourceData = isWidgetDataObject(value) ? (value as Record<string, WidgetData>) : {};
    const params = metadata.extractParams(sourceData);
    context.navigation.push(
      metadata.targetEndpoint,
      params,
      metadata.prefillFromGet,
      metadata.getEndpoint,
    );
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant === "primary" ? "default" : variant}
      className={className}
    >
      {buttonIcon && (
        <Icon
          icon={buttonIcon}
          className={cn(iconSizeClass || "h-4 w-4", buttonText ? iconSpacingClass || "mr-2" : "")}
        />
      )}
      {buttonText}
    </Button>
  );
}

NavigateButtonWidget.displayName = "NavigateButtonWidget";
