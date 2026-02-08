/**
 * Custom Widget for Reset Password Confirm Form
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";

import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { PasswordStrengthIndicator } from "@/app/api/[locale]/user/public/signup/_components/password-strength-indicator";

import type definition from "./definition";
import type { ResetPasswordConfirmPostResponseOutput } from "./definition";
import AlertWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: ResetPasswordConfirmPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for reset password confirm form
 */
export function ResetPasswordConfirmContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("app.api.user.public.resetPassword.confirm.title")}
        </CardTitle>
        <CardDescription>
          {t("app.api.user.public.resetPassword.confirm.description")}
        </CardDescription>
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

        {/* Submit Button */}
        <SubmitButtonWidget
          field={{
            text: "app.api.user.public.resetPassword.confirm.actions.submit",
            loadingText:
              "app.api.user.public.resetPassword.confirm.actions.submitting",
            icon: "lock",
            variant: "default",
            size: "default",
          }}
        />

        <AlertWidget
          fieldName="message"
          field={withValue(children.message, field.value?.message, null)}
        />
      </CardContent>
    </Card>
  );
}
