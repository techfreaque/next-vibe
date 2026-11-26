"use client";

import { Button } from "next-vibe/ui/components/button";
import { type JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import { Platform } from "../../../../platforms/platforms";
import { cn } from "../../../_shared/cn";
import type { ReactStaticWidgetProps } from "../../../_shared/react-types";
import type { FieldUsageConfig } from "../../../_shared/types";
import {
  useWidgetContext,
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
} from "../../../_shared/use-widget-context";
import {
  getIconSizeClassName,
  getSpacingClassName,
} from "../../../_shared/widget-helpers";
import { scopedTranslation as unifiedInterfaceScopedTranslation } from "../../../hooks/i18n";
import { Icon } from "../../form-fields/icon-field/icon-component";
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
  label: labelOverride,
  variant: variantOverride,
}: ReactStaticWidgetProps<
  TEndpoint,
  TUsage,
  SubmitButtonWidgetConfig<
    TEndpoint["scopedTranslation"]["ScopedTranslationKey"],
    TUsage,
    TSchemaType
  >
> & {
  /**
   * Translated label for the action this submit performs right now, e.g.
   * "Reject payout" when the form's action field is "reject". Wins over the
   * definition's text, so one dialog can say what it does instead of a
   * generic "Confirm".
   */
  label?: string;
  /** Per-render variant, e.g. "destructive" while a reject/delete is chosen. */
  variant?: SubmitButtonWidgetConfig<string, TUsage, TSchemaType>["variant"];
}): JSX.Element | null {
  const locale = useWidgetLocale();
  const { t: tField, endpoint } = useWidgetContext();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  const { t: globalT } = unifiedInterfaceScopedTranslation.scopedT(locale);
  const {
    text: textKey,
    loadingText: loadingTextKey,
    icon,
    variant: configVariant,
    size = "default",
    iconSize,
    iconSpacing,
    className,
  } = field;

  // Get classes from config (no hardcoding!)
  const iconSizeClass = getIconSizeClassName(iconSize);
  const iconSpacingClass = getSpacingClassName("margin", iconSpacing);

  // Without configured text, say the action instead of a bare "Submit".
  const isSave = endpoint.method === "PUT" || endpoint.method === "PATCH";
  const isDelete = endpoint.method === "DELETE";
  // A delete endpoint's submit is destructive unless the definition says
  // otherwise ("default" is the builder's fallback, not a choice).
  const variant =
    variantOverride ??
    (configVariant && configVariant !== "default"
      ? configVariant
      : isDelete
        ? "destructive"
        : "default");
  const buttonText = labelOverride
    ? labelOverride
    : textKey
      ? tField(textKey)
      : endpoint.method === "GET"
        ? globalT("widgets.endpointRenderer.showResults")
        : isSave
          ? globalT("widgets.endpointRenderer.saveChanges")
          : tField(endpoint.titleShort ?? endpoint.title);

  const loadingText = loadingTextKey
    ? tField(loadingTextKey)
    : globalT(
        isSave
          ? "widgets.endpointRenderer.saving"
          : "widgets.endpointRenderer.submitting",
      );

  // Hide submit button when form is undefined (e.g., when data is already loaded)
  if (!form || !onSubmit || isDisabled) {
    return null;
  }

  return (
    <Button
      type="submit"
      data-testid="endpoint-submit"
      disabled={isSubmitting}
      variant={variant === "primary" ? "default" : variant}
      size={size}
      className={className}
      // CLI has no form submit event; wire onClick explicitly
      onClick={
        isCli && onSubmit
          ? () => {
              onSubmit();
            }
          : undefined
      }
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
