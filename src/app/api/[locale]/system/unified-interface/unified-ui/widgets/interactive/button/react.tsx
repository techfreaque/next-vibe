"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
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
import type { ReactDisplayWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import {
  useWidgetContext,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import type { ButtonWidgetConfig } from "./types";

/**
 * Renders an action button widget.
 * Used for actions like Edit, Delete, etc. within data cards.
 */
export function ButtonWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
>({
  field,
}: ReactDisplayWidgetProps<
  TEndpoint,
  TUsage,
  ButtonWidgetConfig<TKey, TUsage, TSchemaType>
>): JSX.Element {
  const t = useWidgetTranslation();
  const context = useWidgetContext();

  const {
    text: textKey,
    icon,
    variant = "default",
    size = "default",
    iconSize,
    iconSpacing,
    className,
    hidden,
  } = field;

  // Check if button should be hidden
  if (hidden) {
    const itemData = field.parentValue ?? field.value;
    const shouldHide = typeof hidden === "function" ? hidden(itemData) : hidden;
    if (shouldHide) {
      return <></>;
    }
  }

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonIcon = icon ? (icon as IconKey) : undefined;
  const buttonText = textKey ? t(textKey) : undefined;

  const handleClick = (e: { stopPropagation: () => void }): void => {
    e.stopPropagation(); // Prevent card click when clicking action buttons
    if (field.onClick) {
      // Use parentValue if available (from actions container), otherwise field.value
      const itemData = field.parentValue ?? field.value;
      field.onClick(itemData, context);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant === "primary" ? "default" : variant}
      size={size}
      className={className}
    >
      {buttonIcon && (
        <Icon
          icon={buttonIcon}
          className={cn(
            iconSizeClass || "h-4 w-4",
            buttonText && (iconSpacingClass || "mr-2"),
          )}
        />
      )}
      {buttonText}
    </Button>
  );
}

ButtonWidget.displayName = "ButtonWidget";

export default ButtonWidget;
