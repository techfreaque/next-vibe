/**
 * Subscription Update Widget
 * Form to update an existing subscription
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.PUT)["fields"];
}

/**
 * Subscription Update Container Widget
 */
export function SubscriptionUpdateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.PUT>();
  const children = field.children;
  const value = useWidgetValue<typeof definition.PUT>();
  const { pop, canGoBack } = useWidgetNavigation();

  if (value?.id) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              {t("put.success.title")}
            </Span>
            <Span className="text-sm text-emerald-700 dark:text-emerald-300">
              {t("put.success.description")}
            </Span>
          </Div>
        </Div>
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              pop();
            }}
            className="self-start gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* Form Fields */}
      <SelectFieldWidget
        fieldName="plan"
        field={withValue(children.plan, undefined, null)}
      />
      <SelectFieldWidget
        fieldName="billingInterval"
        field={withValue(children.billingInterval, undefined, null)}
      />

      {/* Submit Button */}
      <SubmitButtonWidget<typeof definition.PUT>
        field={{
          text: "put.submit.label",
          loadingText: "put.submit.loading",
          icon: "package-check",
          variant: "primary",
        }}
      />
    </Div>
  );
}
