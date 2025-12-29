"use client";

import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  getIconComponent,
  type IconValue,
} from "@/app/api/[locale]/agent/chat/model-access/icons";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

/**
 * Renders an action button widget.
 * Used for actions like Edit, Delete, etc. within data cards.
 */
export function ButtonWidget<const TKey extends string>({
  field,
  context,
  className,
  value,
}: ReactWidgetProps<typeof WidgetType.BUTTON, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const {
    text: textKey,
    icon,
    variant = "default",
    size = "default",
    onClick: actionId,
  } = field.ui;

  const ButtonIcon = icon ? getIconComponent(icon as IconValue) : undefined;
  const buttonText = textKey ? t(textKey) : "Action";

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
      {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
      {buttonText}
    </Button>
  );
}

ButtonWidget.displayName = "ButtonWidget";
