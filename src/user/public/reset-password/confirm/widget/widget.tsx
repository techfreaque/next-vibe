/**
 * Custom Widget for Reset Password Confirm Form
 */

"use client";

import { Button } from "next-vibe/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";

import { PasswordStrengthIndicator } from "@/user/public/signup/widget/password-strength-indicator";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/form-fields/email-field/widget";
import { Icon } from "next-vibe/unified-ui/form-fields/icon-field/icons";
import { PasswordFieldWidget } from "next-vibe/unified-ui/form-fields/password-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";

import AlertWidget from "next-vibe/unified-ui/display-only/alert/widget";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("confirm.title")}</CardTitle>
        <CardDescription>{t("confirm.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Verification Section */}
        <Div className="flex flex-col gap-4">
          <TextFieldWidget fieldName="token" field={children.token} />
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
        <Div className="flex gap-2">
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
