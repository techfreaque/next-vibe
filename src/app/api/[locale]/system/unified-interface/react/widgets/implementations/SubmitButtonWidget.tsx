"use client";

import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import {
  getIconComponent,
  type IconValue,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

/**
 * Renders a submit button for forms with loading state support.
 */
export function SubmitButtonWidget<TKey extends string>({
  field,
  context,
  className,
  form,
  onSubmit,
  isSubmitting,
}: ReactWidgetProps<typeof WidgetType.SUBMIT_BUTTON, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const { t: globalT } = simpleT(context.locale);
  const {
    text: textKey,
    loadingText: loadingTextKey,
    icon,
    variant = "default",
    size = "default",
  } = field.ui;

  const ButtonIcon = icon ? getIconComponent(icon as IconValue) : undefined;

  const buttonText = textKey
    ? t(textKey)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submit",
      );

  const loadingText = loadingTextKey
    ? t(loadingTextKey)
    : globalT(
        "app.api.system.unifiedInterface.react.widgets.endpointRenderer.submitting",
      );

  return (
    <Button
      type="button"
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
      {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
      {isSubmitting ? loadingText : buttonText}
    </Button>
  );
}

SubmitButtonWidget.displayName = "SubmitButtonWidget";
