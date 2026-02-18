/**
 * Custom Widget for SMTP Account Edit Form
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
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
import type { SmtpAccountEditPUTResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: SmtpAccountEditPUTResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

export function SmtpEditContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation();
  const isLoading = field.value === null || field.value === undefined;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.smtpClient.edit.id.put.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-6">
          <FormAlertWidget field={{}} />

          {/* Account Information */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.emails.smtpClient.edit.id.put.container.title")}
            </Span>
            <TextFieldWidget
              fieldName={`${fieldName}.name`}
              field={children.name}
            />
            <TextareaFieldWidget
              fieldName={`${fieldName}.description`}
              field={children.description}
            />
          </Div>

          {/* Server Configuration */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.emails.smtpClient.edit.id.fields.host.label")}
            </Span>
            <TextFieldWidget
              fieldName={`${fieldName}.host`}
              field={children.host}
            />
            <Div className="grid grid-cols-2 gap-3">
              <NumberFieldWidget
                fieldName={`${fieldName}.port`}
                field={children.port}
              />
              <SelectFieldWidget
                fieldName={`${fieldName}.securityType`}
                field={children.securityType}
              />
            </Div>
          </Div>

          {/* Authentication */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.emails.smtpClient.edit.id.fields.username.label")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget
                fieldName={`${fieldName}.username`}
                field={children.username}
              />
              <PasswordFieldWidget
                fieldName={`${fieldName}.password`}
                field={children.password}
              />
            </Div>
          </Div>

          {/* Email + Priority */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.emails.smtpClient.edit.id.fields.fromEmail.label")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <EmailFieldWidget
                fieldName={`${fieldName}.fromEmail`}
                field={children.fromEmail}
              />
              <NumberFieldWidget
                fieldName={`${fieldName}.priority`}
                field={children.priority}
              />
            </Div>
          </Div>

          {/* Targeting */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t(
                "app.api.emails.smtpClient.edit.id.fields.campaignTypes.label",
              )}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <MultiSelectFieldWidget
                fieldName={`${fieldName}.campaignTypes`}
                field={children.campaignTypes}
              />
              <MultiSelectFieldWidget
                fieldName={`${fieldName}.emailJourneyVariants`}
                field={children.emailJourneyVariants}
              />
              <MultiSelectFieldWidget
                fieldName={`${fieldName}.emailCampaignStages`}
                field={children.emailCampaignStages}
              />
              <MultiSelectFieldWidget
                fieldName={`${fieldName}.countries`}
                field={children.countries}
              />
              <MultiSelectFieldWidget
                fieldName={`${fieldName}.languages`}
                field={children.languages}
              />
            </Div>
          </Div>

          {/* Submit */}
          <Div className="flex items-center justify-end pt-2">
            <SubmitButtonWidget
              field={{
                text: "app.api.emails.smtpClient.edit.id.put.title",
                loadingText: "app.api.emails.smtpClient.edit.id.put.title",
                icon: "save",
                variant: "primary",
                size: "sm",
              }}
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}
