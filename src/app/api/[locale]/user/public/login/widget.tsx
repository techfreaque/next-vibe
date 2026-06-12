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
} from "next-vibe-ui/ui/card";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import AlertWidget from "next-vibe-ui/unified/display-only/alert/widget";
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe-ui/unified/form-fields/password-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { LinkWidget } from "next-vibe-ui/unified/display-only/link/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

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
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
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

        <LinkWidget
          field={children.forgotPassword}
          fieldName="forgotPassword"
        />
        <LinkWidget field={children.createAccount} fieldName="createAccount" />
      </CardContent>
    </Card>
  );
}
