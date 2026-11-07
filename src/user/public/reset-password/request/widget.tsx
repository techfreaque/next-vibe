/**
 * Custom Widget for the Password Reset Request form
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { Div } from "next-vibe/ui/components/div";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import AlertWidget from "next-vibe/unified-ui/widgets/display-only/alert/widget";
import { LinkWidget } from "next-vibe/unified-ui/widgets/display-only/link/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ResetPasswordRequestContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="items-center gap-1.5 p-6 pb-2 text-center sm:p-8 sm:pb-2">
        <Span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </Span>
        <CardTitle className="text-2xl tracking-tight">
          {t("request.ui.title")}
        </CardTitle>
        <CardDescription>{t("request.ui.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-6 pt-4 sm:p-8 sm:pt-4">
        <EmailFieldWidget fieldName="email" field={children.email} />

        <FormAlertWidget field={children.formAlert} />

        {data?.message && (
          <AlertWidget
            fieldName="message"
            field={withValue(children.message, data.message, null)}
          />
        )}

        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />

        <Div className="flex justify-center border-t pt-4 text-sm">
          <LinkWidget
            field={children.alreadyHaveAccount}
            fieldName="alreadyHaveAccount"
          />
        </Div>
      </CardContent>
    </Card>
  );
}
