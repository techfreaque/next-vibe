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

  // Extract navigation config from metadata (already properly typed in field.ui)
  const targetEndpoint = metadata?.targetEndpoint ?? null;
  const extractParams = metadata?.extractParams;
  const prefillFromGet = Boolean(metadata?.prefillFromGet);
  const getEndpoint = metadata?.getEndpoint;

  // Don't render back button if there's nothing to navigate back to
  if (targetEndpoint === null && (!context.navigation || !context.navigation.canGoBack)) {
    return <></>;
  }

  const handleClick = (): void => {
    if (!context.navigation) {
      // eslint-disable-next-line no-console
      console.warn("NavigateButtonWidget: No navigation context available");
      return;
    }

    // Back navigation (targetEndpoint is null)
    if (targetEndpoint === null) {
      context.navigation.pop();
      return;
    }

    // Forward navigation to target endpoint
    if (!targetEndpoint) {
      // eslint-disable-next-line no-console
      console.warn("NavigateButtonWidget: No target endpoint specified");
      return;
    }

    if (!extractParams) {
      // eslint-disable-next-line no-console
      console.warn("NavigateButtonWidget: No extractParams function specified");
      return;
    }

    // Extract params from source data (value contains the item data)
    // For global buttons (not in list context), value may be null/undefined
    // extractParams should handle this case (e.g., () => ({}) for buttons without params)
    const sourceData = isWidgetDataObject(value) ? (value as Record<string, WidgetData>) : {};
    const params = extractParams(sourceData);

    // Navigate to target endpoint with extracted params
    context.navigation.push(targetEndpoint, params, prefillFromGet, getEndpoint);
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
