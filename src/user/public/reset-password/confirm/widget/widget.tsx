/**
 * Custom Widget for Reset Password Confirm Form
 */

"use client";

import { Button } from "next-vibe/ui/components/button";
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
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import AlertWidget from "next-vibe/unified-ui/widgets/display-only/alert/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { useState } from "react";

import { PasswordStrengthIndicator } from "@/user/public/signup/widget/password-strength-indicator";

import type definition from "../definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

/**
 * Custom container widget for reset password confirm form
 */
export function ResetPasswordConfirmContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  // Arrived via the emailed link: the token is already in the form — don't
  // show the customer a raw JWT. Only the bare tool page asks for it.
  const [tokenFromLink] = useState(() => Boolean(form.getValues("token")));

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="gap-1.5 p-6 pb-2 text-center sm:p-8 sm:pb-2">
        <CardTitle className="text-2xl tracking-tight">
          {t("confirm.title")}
        </CardTitle>
        <CardDescription>{t("confirm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-6 pt-4 sm:p-8 sm:pt-4">
        {/* Verification Section */}
        <Div className="flex flex-col gap-4">
          <Div className={tokenFromLink ? "hidden" : undefined}>
            <TextFieldWidget fieldName="token" field={children.token} />
          </Div>
          <EmailFieldWidget fieldName="email" field={children.email} />
        </Div>

        {/* New Password Section */}
        <Div className="flex flex-col gap-4">
          <PasswordFieldWidget fieldName="password" field={children.password} />

          {/* Password Strength Indicator - Inline after password field */}
          <PasswordStrengthIndicator />

          <PasswordFieldWidget
            fieldName="confirmPassword"
            field={children.confirmPassword}
          />
        </Div>

        <AlertWidget
          fieldName="message"
          field={withValue(children.message, data?.message, null)}
        />

        <FormAlertWidget field={{}} />

        {/* Action Buttons */}
        <Div className="flex flex-col-reverse gap-2 sm:flex-row [&>*]:flex-1">
          {navigation?.canGoBack && (
            <Button
              type="button"
              onClick={(): void => {
                navigation.pop();
              }}
              variant="outline"
            >
              <Icon icon="arrow-left" className="h-4 w-4 mr-2" />
              {t("actions.back")}
            </Button>
          )}
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "actions.submit",
              loadingText: "actions.submitting",
              icon: "lock",
              variant: "default",
              size: "default",
            }}
          />
        </Div>
      </CardContent>
    </Card>
  );
}
