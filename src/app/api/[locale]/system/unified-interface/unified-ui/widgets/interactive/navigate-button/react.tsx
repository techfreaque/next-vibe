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
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
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
  const tField = useWidgetTranslation<TEndpoint>();
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
  const buttonText = label ? tField(label) : undefined;

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
  // For async resolvers (functions), permission is checked on click
  if (typeof targetEndpoint !== "function") {
    const userRoles = user.roles;
    const allowedRoles = targetEndpoint.allowedRoles || [];
    const allowedClientRoles = targetEndpoint.allowedClientRoles || [];
    const allAllowedRoles = [...allowedRoles, ...allowedClientRoles];

    if (allAllowedRoles.length > 0) {
      const hasPermission = userRoles.some((role) =>
        allAllowedRoles.includes(role),
      );
      if (!hasPermission) {
        return <></>;
      }
    }
  }

  // Forward navigation (push to stack) — always async to support resolver + async extractParams
  const handleClick = (e: ButtonMouseEvent): void => {
    e.stopPropagation();

    if (!navigation || !extractParams) {
      logger.warn(
        "NavigateButtonWidget: No navigation context or extractParams",
      );
      return;
    }

    void (async (): Promise<void> => {
      try {
        // Resolve endpoint (may be direct ref or async () => import())
        const resolvedEndpoint: CreateApiEndpointAny =
          typeof targetEndpoint === "function"
            ? await targetEndpoint()
            : targetEndpoint;

        // Permission check for lazily-resolved endpoints
        if (typeof targetEndpoint === "function") {
          const userRoles = user.roles;
          const allowedRoles = resolvedEndpoint.allowedRoles || [];
          const allowedClientRoles = resolvedEndpoint.allowedClientRoles || [];
          const allAllowedRoles = [...allowedRoles, ...allowedClientRoles];

          if (allAllowedRoles.length > 0) {
            const hasPermission = userRoles.some((role) =>
              allAllowedRoles.includes(role),
            );
            if (!hasPermission) {
              return;
            }
          }
        }

        // Build structured source data for extractParams
        const requestData = form?.getValues() ?? {};
        const responseData =
          response?.success && response.data ? response.data : {};
        const urlPathParams = navigation?.current?.params?.urlPathParams ?? {};
        const itemData = field.parentValue;

        const source = {
          itemData,
          requestData,
          urlPathParams,
          responseData,
        };

        const context = { logger, user, locale };

        // Resolve params (may be sync or async)
        const paramsOrPromise = extractParams(source, context);
        const params =
          paramsOrPromise instanceof Promise
            ? await paramsOrPromise
            : paramsOrPromise;

        // Determine getEndpoint for prefill
        let effectiveGetEndpoint: CreateApiEndpointAny | undefined =
          getEndpoint;
        if (prefillFromGet && !effectiveGetEndpoint && endpoint) {
          if (endpoint.method === "GET") {
            effectiveGetEndpoint = endpoint;
          }
        }

        const clickX = e.clientX ?? 0;
        const clickY = e.clientY ?? 0;

        navigation.push(resolvedEndpoint, {
          urlPathParams: params.urlPathParams,
          data: params.data,
          prefillFromGet,
          getEndpoint: effectiveGetEndpoint,
          renderInModal,
          popNavigationOnSuccess,
          modalPosition: { x: clickX, y: clickY },
        });
      } catch (error) {
        logger.error("NavigateButtonWidget: Failed to navigate", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    })();
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
