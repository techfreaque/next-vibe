"use client";

import { cn } from "next-vibe/shared/utils";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../../shared/widgets/utils/widget-helpers";
import type { ReactStaticWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
} from "../../_shared/use-widget-context";
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
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TKey extends string,
  TSchemaType extends "widget",
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
  TGetEndpoint extends CreateApiEndpointAny | undefined,
>({
  field,
}: ReactStaticWidgetProps<
  TEndpoint,
  TUsage,
  NavigateButtonWidgetConfig<
    TKey,
    TUsage,
    TSchemaType,
    TTargetEndpoint,
    TGetEndpoint
  >
>): JSX.Element {
  const t = useWidgetTranslation();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const endpoint = useWidgetEndpoint<TEndpoint>();
  const form = useWidgetForm();
  const {
    label,
    icon,
    variant = "default",
    iconSize,
    iconSpacing,
    className,
    targetEndpoint,
    extractParams,
    prefillFromGet,
    getEndpoint,
    renderInModal,
    popNavigationOnSuccess,
  } = field;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonIcon = icon ? (icon as IconKey) : undefined;
  const buttonText = label ? t(label) : undefined;

  // Back navigation
  if (targetEndpoint === null || targetEndpoint === undefined) {
    // Don't render back button if there's nothing to navigate back to
    if (!navigation || !navigation.canGoBack) {
      return <></>;
    }

    const handleClick = (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      navigation?.pop();
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

  // Forward navigation - check if extractParams exists and targetEndpoint is not null/undefined
  if (
    !extractParams ||
    targetEndpoint === null ||
    targetEndpoint === undefined
  ) {
    logger.error(
      "NavigateButtonWidget: Forward navigation without extractParams or targetEndpoint",
    );
    return <></>;
  }

  // Check if user has permission to access the target endpoint
  if (!targetEndpoint) {
    return <></>;
  }

  const userRoles = user.roles;
  const allowedRoles = targetEndpoint.allowedRoles || [];
  const allowedClientRoles = targetEndpoint.allowedClientRoles || [];

  // Combine both server and client roles for permission check
  const allAllowedRoles = [...allowedRoles, ...allowedClientRoles];

  // If there are any role restrictions, check if user has permission
  if (allAllowedRoles.length > 0) {
    const hasPermission = userRoles.some((role) =>
      allAllowedRoles.includes(role),
    );
    if (!hasPermission) {
      // User doesn't have permission - don't render the button
      return <></>;
    }
  }

  // Forward navigation (push to stack)
  const handleClick = (e: ButtonMouseEvent): void => {
    e.stopPropagation();

    if (!navigation || !extractParams || targetEndpoint === null) {
      logger.warn(
        "NavigateButtonWidget: No navigation context, extractParams, or targetEndpoint",
      );
      return;
    }

    // Build structured source data for extractParams
    // requestData: current form values
    // urlPathParams: URL path params from current navigation entry
    // responseData: response data from GET request (for PATCH forms)
    // itemData: parent array item data (if inside array)
    const requestData = form?.getValues() ?? {};
    const responseData =
      response?.success && response.data ? response.data : {};
    const urlPathParams = navigation?.current?.params?.urlPathParams ?? {};
    const itemData = field.parentValue; // For array items

    const source = {
      itemData,
      requestData,
      urlPathParams,
      responseData,
    };

    // Build context for extractParams
    const context = {
      logger,
      user,
      locale,
    };

    // Handle both sync and async extractParams
    const paramsOrPromise = extractParams(source, context);

    if (paramsOrPromise instanceof Promise) {
      // Async extractParams - wrap in async IIFE
      void (async (): Promise<void> => {
        try {
          const params = await paramsOrPromise;

          // If prefillFromGet is true but no getEndpoint provided, use current endpoint if it's a GET
          let effectiveGetEndpoint: CreateApiEndpointAny | undefined =
            getEndpoint;
          if (prefillFromGet && !effectiveGetEndpoint && endpoint) {
            // Check if current endpoint is a GET endpoint
            if (endpoint.method === "GET") {
              effectiveGetEndpoint = endpoint;
            }
          }

          // Capture click position for modal positioning
          const clickX = e.clientX ?? 0;
          const clickY = e.clientY ?? 0;

          navigation.push(
            targetEndpoint,
            params,
            prefillFromGet,
            effectiveGetEndpoint,
            renderInModal,
            popNavigationOnSuccess,
            { x: clickX, y: clickY },
          );
        } catch (error) {
          logger.error("NavigateButtonWidget: Failed to extract params", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    } else {
      // Sync extractParams
      const params = paramsOrPromise;

      // If prefillFromGet is true but no getEndpoint provided, use current endpoint if it's a GET
      let effectiveGetEndpoint: CreateApiEndpointAny | undefined = getEndpoint;
      if (prefillFromGet && !effectiveGetEndpoint && endpoint) {
        // Check if current endpoint is a GET endpoint
        if (endpoint.method === "GET") {
          effectiveGetEndpoint = endpoint;
        }
      }

      // Capture click position for modal positioning
      const clickX = e.clientX ?? 0;
      const clickY = e.clientY ?? 0;

      navigation.push(
        targetEndpoint,
        params,
        prefillFromGet,
        effectiveGetEndpoint,
        renderInModal,
        popNavigationOnSuccess,
        { x: clickX, y: clickY },
      );
    }
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
