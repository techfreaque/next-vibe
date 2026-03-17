"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { type JSX } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
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
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
} from "../../_shared/use-widget-context";
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

  const buttonIcon = icon ? (icon as IconKey) : undefined;

  const buttonText = textKey
    ? tField(textKey)
    : globalT("react.widgets.endpointRenderer.submit");

  const loadingText = loadingTextKey
    ? tField(loadingTextKey)
    : globalT("react.widgets.endpointRenderer.submitting");

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
      {buttonIcon && (
        <Icon
          icon={buttonIcon}
          className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
        />
      )}
      {isSubmitting ? loadingText : buttonText}
    </Button>
  );
}

SubmitButtonWidget.displayName = "SubmitButtonWidget";

export default SubmitButtonWidget;
