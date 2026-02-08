/**
 * Custom Widget for Signup Form
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

import { PasswordStrengthIndicator } from "@/app/api/[locale]/user/public/signup/_components/password-strength-indicator";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { LinkWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { SignupPostResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: SignupPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for signup form
 * Renders all fields with password strength indicator inline
 */
export function SignupFormContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("app.api.user.public.signup.form.title")}</CardTitle>
        <CardDescription>
          {t("app.api.user.public.signup.form.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Name Fields - Grid 2 columns */}
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextFieldWidget
            fieldName="privateName"
            field={children.privateName}
          />
          <TextFieldWidget fieldName="publicName" field={children.publicName} />
        </Div>

        {/* Email Field */}
        <EmailFieldWidget fieldName="email" field={children.email} />

        {/* Password Fields */}
        <PasswordFieldWidget fieldName="password" field={children.password} />

        {/* Password Strength Indicator - Inline after password field */}
        <PasswordStrengthIndicator />

        <PasswordFieldWidget
          fieldName="confirmPassword"
          field={children.confirmPassword}
        />

        {/* Checkboxes */}
        <BooleanFieldWidget
          fieldName="subscribeToNewsletter"
          field={children.subscribeToNewsletter}
        />
        <BooleanFieldWidget
          fieldName="acceptTerms"
          field={children.acceptTerms}
        />

        {/* Referral Code */}
        <TextFieldWidget
          fieldName="referralCode"
          field={children.referralCode}
        />

        {/* Form Alert */}
        <FormAlertWidget field={children.formAlert} />

        {/* Response Message (if any) */}
        {field.value?.message && (
          <AlertWidget
            fieldName="message"
            field={withValue(children.message, field.value.message, null)}
          />
        )}

        {/* Submit Button */}
        <SubmitButtonWidget field={children.submitButton} />

        {/* Footer Link */}
        <LinkWidget
          field={children.alreadyHaveAccount}
          fieldName="alreadyHaveAccount"
        />
      </CardContent>
    </Card>
  );
}
