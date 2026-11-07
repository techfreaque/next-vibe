/**
 * Custom Widget for changing the account password
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

interface PasswordWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PasswordChangeContainer({
  field,
}: PasswordWidgetProps): JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const done =
    data !== undefined && "response" in data && data.response?.success === true;

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => {
        navigation.pop();
      }}
      className="-ml-2 w-fit gap-1.5 text-muted-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.back")}
    </Button>
  ) : null;

  if (done) {
    return (
      <WidgetShell className="gap-4">
        {back}
        <Div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center shadow-sm">
          <Span className="flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle className="h-5 w-5" />
          </Span>
          <H2 className="m-0 border-0 p-0 text-lg font-semibold tracking-tight">
            {t("success.title")}
          </H2>
          <P className="m-0 max-w-sm text-sm text-muted-foreground">
            {t("success.nextSteps.logoutOther")}
          </P>
        </Div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell className="gap-4">
      {back}
      <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Div className="flex items-start gap-3 border-b p-5 sm:p-6">
          <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-4 w-4" />
          </Span>
          <Div className="flex flex-col gap-0.5">
            <H2 className="m-0 border-0 p-0 text-lg font-semibold tracking-tight">
              {t("title")}
            </H2>
            <P className="m-0 text-sm text-muted-foreground">
              {t("description")}
            </P>
          </Div>
        </Div>
        <Div className="flex flex-col gap-5 p-5 sm:p-6">
          <PasswordFieldWidget
            fieldName="currentCredentials.currentPassword"
            field={children.currentCredentials.children.currentPassword}
          />
          <Div className="flex flex-col gap-5 border-t pt-5">
            <PasswordFieldWidget
              fieldName="newCredentials.newPassword"
              field={children.newCredentials.children.newPassword}
            />
            <PasswordFieldWidget
              fieldName="newCredentials.confirmPassword"
              field={children.newCredentials.children.confirmPassword}
            />
          </Div>
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "widget.submit",
              loadingText: "widget.submitting",
              icon: "lock",
              variant: "default",
              size: "default",
              className: "h-11 w-full",
            }}
          />
        </Div>
      </Div>
    </WidgetShell>
  );
}
