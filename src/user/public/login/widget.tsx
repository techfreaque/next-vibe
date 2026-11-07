/**
 * Custom Widget for Login Form
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

import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import AlertWidget from "next-vibe/unified-ui/widgets/display-only/alert/widget";
import { LinkWidget } from "next-vibe/unified-ui/widgets/display-only/link/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function LoginFormContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="gap-1.5 p-6 pb-2 text-center sm:p-8 sm:pb-2">
        <CardTitle className="text-2xl tracking-tight">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-6 pt-4 sm:p-8 sm:pt-4">
        <EmailFieldWidget fieldName="email" field={children.email} />
        <PasswordFieldWidget fieldName="password" field={children.password} />
        <BooleanFieldWidget
          fieldName="rememberMe"
          field={children.rememberMe}
        />

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

        <Div className="flex flex-col items-center gap-1 border-t pt-4 text-sm">
          <LinkWidget
            field={children.forgotPassword}
            fieldName="forgotPassword"
          />
          <LinkWidget
            field={children.createAccount}
            fieldName="createAccount"
          />
        </Div>
      </CardContent>
    </Card>
  );
}
