/**
 * Subscription Cancel Widget
 * Form to cancel an existing subscription with two-step destructive confirmation
 */

"use client";

import { Alert, AlertDescription } from "next-vibe/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useState } from "react";

import type definition from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.DELETE)["fields"];
}

/**
 * Subscription Cancel Container Widget
 * Two-step destructive confirmation before canceling subscription
 */
export function SubscriptionCancelContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const children = field.children;
  const value = useWidgetValue<typeof definition.DELETE>();
  const { pop, canGoBack } = useWidgetNavigation();
  const onSubmit = useWidgetOnSubmit();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCancelClick = (): void => {
    setConfirmOpen(true);
  };

  const handleConfirm = (): void => {
    setConfirmOpen(false);
    onSubmit?.();
  };

  if (value?.success) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              {t("delete.success.title")}
            </Span>
            {value.message ? (
              <Span className="text-sm text-emerald-700 dark:text-emerald-300">
                {value.message}
              </Span>
            ) : null}
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

      {/* Warning Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{t("delete.warning")}</AlertDescription>
      </Alert>

      <FormAlertWidget field={{}} />

      {/* Form Fields */}
      <BooleanFieldWidget
        fieldName="cancelAtPeriodEnd"
        field={withValue(children.cancelAtPeriodEnd, undefined, null)}
      />
      <TextFieldWidget
        fieldName="reason"
        field={withValue(children.reason, undefined, null)}
      />

      {/* Submit Button — opens confirmation dialog */}
      <Button
        type="button"
        variant="destructive"
        onClick={handleCancelClick}
        className="w-full"
      >
        {t("delete.submit.label")}
      </Button>

      {/* Two-step confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("widget.confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.confirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("widget.confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("widget.confirm.proceed")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Div>
  );
}
