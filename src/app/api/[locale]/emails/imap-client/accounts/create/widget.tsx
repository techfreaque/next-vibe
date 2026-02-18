/**
 * Custom Widget for IMAP Account Create Form
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { ImapAccountCreatePostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapAccountCreatePostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImapAccountCreateContainer({
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
          {t("app.api.emails.imapClient.accounts.create.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Basic Info */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.create.basicInfo")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.basicInfo.name`}
            field={children.basicInfo.children.name}
          />
          <EmailFieldWidget
            fieldName={`${fieldName}.basicInfo.email`}
            field={children.basicInfo.children.email}
          />
        </Div>

        {/* Server */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.create.serverConnection")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.serverConnection.host`}
            field={children.serverConnection.children.host}
          />
          <Div className="grid grid-cols-2 gap-3">
            <NumberFieldWidget
              fieldName={`${fieldName}.serverConnection.port`}
              field={children.serverConnection.children.port}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.serverConnection.secure`}
              field={children.serverConnection.children.secure}
            />
          </Div>
        </Div>

        {/* Auth */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.create.authentication")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.authentication.username`}
            field={children.authentication.children.username}
          />
          <Div className="grid grid-cols-2 gap-3">
            <PasswordFieldWidget
              fieldName={`${fieldName}.authentication.password`}
              field={children.authentication.children.password}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.authentication.authMethod`}
              field={children.authentication.children.authMethod}
            />
          </Div>
        </Div>

        {/* Sync config */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.create.syncConfiguration")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.syncConfiguration.enabled`}
              field={children.syncConfiguration.children.enabled}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.syncConfiguration.syncInterval`}
              field={children.syncConfiguration.children.syncInterval}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.syncConfiguration.maxMessages`}
              field={children.syncConfiguration.children.maxMessages}
            />
          </Div>
        </Div>

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.imapClient.accounts.create.submit",
              loadingText:
                "app.api.emails.imapClient.accounts.create.submitting",
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
