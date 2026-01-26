"use client";

import { cn } from "next-vibe/shared/utils";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { isWidgetDataObject } from "../../../../shared/widgets/utils/field-type-guards";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { NavigateButtonWidgetConfig } from "./types";

/**
 * Renders a navigation button widget for cross-definition navigation.
 * Handles type-safe navigation to other endpoint definitions.
 *
 * The navigation config is stored in field.metadata:
 * - targetEndpoint: The endpoint to navigate to (null for back navigation)
 * - extractParams: Function to extract params from source data
 * - prefillFromGet: Whether to fetch GET data before showing form
 * - renderInModal: If true, render in popover instead of pushing to navigation stack
 * - popNavigationOnSuccess: How many times to pop navigation stack after success
 */
export function NavigateButtonWidget<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
>({
  field,
  context,
  value,
}: ReactWidgetProps<
  NavigateButtonWidgetConfig<TKey, TUsage, TTargetEndpoint>
>): JSX.Element {
  const {
    label,
    icon,
    variant = "default",
    metadata,
    iconSize,
    iconSpacing,
    className,
  } = field;

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

    const handleClick = (e: ButtonMouseEvent): void => {
      e.stopPropagation();
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
            className={cn(
              iconSizeClass || "h-4 w-4",
              buttonText ? iconSpacingClass || "mr-2" : "",
            )}
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

  // Check if user has permission to access the target endpoint
  const targetEndpoint = metadata.targetEndpoint;
  if (!targetEndpoint) {
    return <></>;
  }

  const userRoles = context.user.roles;
  const allowedRoles = targetEndpoint.allowedRoles;

  // If target endpoint has role restrictions, check if user has any of the allowed roles
  if (allowedRoles.length > 0) {
    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasPermission) {
      // User doesn't have permission - don't render the button
      return <></>;
    }
  }

  // Forward navigation (push to stack)
  const handleClick = (e: ButtonMouseEvent): void => {
    e.stopPropagation();

    if (
      !context.navigation ||
      !metadata.extractParams ||
      metadata.targetEndpoint === null
    ) {
      context.logger.warn(
        "NavigateButtonWidget: No navigation context, extractParams, or targetEndpoint",
      );
      return;
    }

    // Extract params - use response.data as fallback if local value is empty (nested buttons)
    let sourceData = isWidgetDataObject(value)
      ? (value as Record<string, WidgetData>)
      : {};

    // If sourceData is empty and we have response data in context, use response.data
    // This handles nested buttons that don't have access to their parent data
    if (
      Object.keys(sourceData).length === 0 &&
      context.response?.success &&
      context.response.data
    ) {
      sourceData = isWidgetDataObject(context.response.data)
        ? (context.response.data as Record<string, WidgetData>)
        : {};
    }

    const params = metadata.extractParams(sourceData);
    context.logger.debug("NavigateButtonWidget: extracted params", {
      sourceData,
      params,
    });

    // If prefillFromGet is true but no getEndpoint provided, use current endpoint if it's a GET
    let effectiveGetEndpoint = metadata.getEndpoint;
    if (
      metadata.prefillFromGet &&
      !effectiveGetEndpoint &&
      context.currentEndpoint
    ) {
      // Check if current endpoint is a GET endpoint
      if (context.currentEndpoint.method === "GET") {
        effectiveGetEndpoint = context.currentEndpoint;
        context.logger.debug(
          "NavigateButtonWidget: Using current GET endpoint for prefill",
        );
      }
    }

    // Capture click position for modal positioning
    const clickX = e.clientX ?? 0;
    const clickY = e.clientY ?? 0;

    context.navigation.push(
      targetEndpoint,
      params,
      metadata.prefillFromGet,
      effectiveGetEndpoint,
      metadata.renderInModal,
      metadata.popNavigationOnSuccess,
      { x: clickX, y: clickY },
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
          className={cn(
            iconSizeClass || "h-4 w-4",
            buttonText ? iconSpacingClass || "mr-2" : "",
          )}
        />
      )}
      {buttonText}
    </Button>
  );
}

NavigateButtonWidget.displayName = "NavigateButtonWidget";

export default NavigateButtonWidget;
