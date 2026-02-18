/**
 * Custom Widget for SMTP Account Create Form
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { SmtpAccountCreateResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: SmtpAccountCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function SmtpCreateContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.smtpClient.create.title")}
        </Span>
      </Div>

      {/* Scrollable form */}
      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Account Information */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.smtpClient.create.container.title")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.accountInfo.name`}
            field={children.accountInfo.children.name}
          />
          <TextareaFieldWidget
            fieldName={`${fieldName}.accountInfo.description`}
            field={children.accountInfo.children.description}
          />
        </Div>

        {/* Server Configuration */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.smtpClient.create.host.label")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.serverConfig.host`}
            field={children.serverConfig.children.host}
          />
          <Div className="grid grid-cols-2 gap-3">
            <NumberFieldWidget
              fieldName={`${fieldName}.serverConfig.port`}
              field={children.serverConfig.children.port}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.serverConfig.securityType`}
              field={children.serverConfig.children.securityType}
            />
          </Div>
        </Div>

        {/* Authentication */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.smtpClient.create.username.label")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <TextFieldWidget
              fieldName={`${fieldName}.authentication.username`}
              field={children.authentication.children.username}
            />
            <PasswordFieldWidget
              fieldName={`${fieldName}.authentication.password`}
              field={children.authentication.children.password}
            />
          </Div>
        </Div>

        {/* Email Configuration */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.smtpClient.create.fromEmail.label")}
          </Span>
          <EmailFieldWidget
            fieldName={`${fieldName}.emailConfig.fromEmail`}
            field={children.emailConfig.children.fromEmail}
          />
          <Div className="grid grid-cols-2 gap-3">
            <MultiSelectFieldWidget
              fieldName={`${fieldName}.emailConfig.campaignTypes`}
              field={children.emailConfig.children.campaignTypes}
            />
            <MultiSelectFieldWidget
              fieldName={`${fieldName}.emailConfig.emailJourneyVariants`}
              field={children.emailConfig.children.emailJourneyVariants}
            />
            <MultiSelectFieldWidget
              fieldName={`${fieldName}.emailConfig.emailCampaignStages`}
              field={children.emailConfig.children.emailCampaignStages}
            />
            <MultiSelectFieldWidget
              fieldName={`${fieldName}.emailConfig.countries`}
              field={children.emailConfig.children.countries}
            />
            <MultiSelectFieldWidget
              fieldName={`${fieldName}.emailConfig.languages`}
              field={children.emailConfig.children.languages}
            />
          </Div>
        </Div>

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.smtpClient.create.title",
              loadingText: "app.api.emails.smtpClient.create.title",
              icon: "plus",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
