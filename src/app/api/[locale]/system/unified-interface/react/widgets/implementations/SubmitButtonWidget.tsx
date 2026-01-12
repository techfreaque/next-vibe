"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/react/icons";
import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders a submit button for forms with loading state support.
 */
export function SubmitButtonWidget<const TKey extends string>({
  field,
  context,
  className,
  form,
  onSubmit,
  isSubmitting,
}: ReactWidgetProps<typeof WidgetType.SUBMIT_BUTTON, TKey>): JSX.Element {
  const { t: globalT } = simpleT(context.locale);
  const {
    text: textKey,
    loadingText: loadingTextKey,
    icon,
    variant = "default",
    size = "default",
    iconSize,
    iconSpacing,
  } = field.ui;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonIcon = icon ? (icon as IconKey) : undefined;

  const buttonText = textKey
    ? context.t(textKey)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
      );

  const loadingText = loadingTextKey
    ? context.t(loadingTextKey)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
      );

  return (
    <Button
      type="submit"
      onClick={(): void => {
        if (form && onSubmit) {
          void form.handleSubmit(onSubmit)();
        }
      }}
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
