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
import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
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
  context,
}: ReactWidgetProps<
  TEndpoint,
  ButtonWidgetConfig<TKey, TUsage, TSchemaType>
>): JSX.Element {
  const {
    text: textKey,
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
  const buttonText = textKey ? context.t(textKey) : "Action";

  const handleClick = (): void => {
    if (field.onClick) {
      field.onClick();
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
          className={cn(iconSizeClass || "h-4 w-4", iconSpacingClass || "mr-2")}
        />
      )}
      {buttonText}
    </Button>
  );
}

ButtonWidget.displayName = "ButtonWidget";

export default ButtonWidget;
