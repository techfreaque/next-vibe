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

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import AlertWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { LinkWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/link/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { LoginPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: LoginPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function LoginFormContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();

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

        {field.value?.message && (
          <AlertWidget
            fieldName="message"
            field={withValue(children.message, field.value.message, null)}
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
