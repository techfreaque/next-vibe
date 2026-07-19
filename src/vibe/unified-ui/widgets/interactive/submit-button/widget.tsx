"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Button } from "next-vibe/ui/ui/button";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { ReactStaticWidgetProps } from "next-vibe/unified-ui/_shared/react-types";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "next-vibe/unified-ui/_shared/widget-helpers";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "next-vibe/unified-ui/hooks/i18n";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import { type JSX } from "react";

import type { SubmitButtonWidgetConfig } from "./types";

/**
 * Renders a submit button for forms with loading state support.
 */
export function SubmitButtonWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig = FieldUsageConfig,
  TSchemaType extends "widget" = "widget",
>({
  field,
}: ReactStaticWidgetProps<
  TEndpoint,
  TUsage,
  SubmitButtonWidgetConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"],
    TUsage,
    TSchemaType
  >
>): JSX.Element | null {
  const locale = useWidgetLocale();
  const { t: tField } = useWidgetContext();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const { t: globalT } = unifiedInterfaceScopedTranslation.scopedT(locale);
  const {
    text: textKey,
    loadingText: loadingTextKey,
    icon,
    variant = "default",
    size = "default",
    iconSize,
    iconSpacing,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonText = textKey
    ? tField(textKey)
    : globalT("widgets.endpointRenderer.submit");

  const loadingText = loadingTextKey
    ? tField(loadingTextKey)
    : globalT("widgets.endpointRenderer.submitting");

  // Hide submit button when form is undefined (e.g., when data is already loaded)
  if (!form || !onSubmit || isDisabled) {
    return null;
  }

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant={variant === "primary" ? "default" : variant}
      size={size}
      className={className}
    >
      {icon && (
        <Icon
          icon={icon}
          className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
        />
      )}
      {isSubmitting ? loadingText : buttonText}
    </Button>
  );
}

SubmitButtonWidget.displayName = "SubmitButtonWidget";

export default SubmitButtonWidget;
