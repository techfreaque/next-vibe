"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

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
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
  value,
}: ReactWidgetProps<ButtonWidgetConfig<TKey, TUsage>>): JSX.Element {
  const {
    text: textKey,
    icon,
    variant = "default",
    size = "default",
    onClick: actionId,
    iconSize,
    iconSpacing,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  const buttonIcon = icon ? (icon as IconKey) : undefined;
  const buttonText = textKey ? context.t(textKey) : "Action";

  const handleClick = async (): Promise<void> => {
    if (!actionId) {
      // eslint-disable-next-line no-console
      console.warn(
        "ButtonWidget: No actionId specified in button configuration",
      );
      return;
    }

    // The value contains the entity ID (e.g., link ID) to act upon
    const entityId = typeof value === "string" ? value : String(value);

    // Handle delete action by calling endpoint mutation directly
    if (actionId === "delete") {
      if (!context.endpointMutations?.delete) {
        // eslint-disable-next-line no-console
        console.warn(
          "ButtonWidget: Delete action requested but no delete endpoint available",
        );
        return;
      }

      // Call DELETE endpoint with the entity ID
      await context.endpointMutations.delete.submit({ linkId: entityId });
      return;
    }

    // Handle edit action by calling endpoint mutation directly
    if (actionId === "edit") {
      if (!context.endpointMutations?.update) {
        // eslint-disable-next-line no-console
        console.warn(
          "ButtonWidget: Edit action requested but no update endpoint available",
        );
        return;
      }

      // For edit, we would typically need to open a form or navigate
      // This is a placeholder for now - actual implementation depends on UX requirements
      // eslint-disable-next-line no-console
      console.log("Edit action triggered for entity:", entityId);
    }
  };

  return (
    <Button
      type="button"
      onClick={(): void => {
        void handleClick();
      }}
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
