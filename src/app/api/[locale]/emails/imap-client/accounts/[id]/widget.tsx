/**
 * Custom Widget for IMAP Account Edit Form
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
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { ImapAccountPutResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapAccountPutResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

export function ImapAccountEditContainer({
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
          {t("app.api.emails.imapClient.accounts.id.put.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Basic Info */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.id.put.basicInfo")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.name`}
            field={children.name}
          />
          <EmailFieldWidget
            fieldName={`${fieldName}.email`}
            field={children.email}
          />
        </Div>

        {/* Server */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.id.put.server")}
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
            <BooleanFieldWidget
              fieldName={`${fieldName}.secure`}
              field={children.secure}
            />
          </Div>
        </Div>

        {/* Auth */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.id.put.auth")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.username`}
            field={children.username}
          />
          <Div className="grid grid-cols-2 gap-3">
            <PasswordFieldWidget
              fieldName={`${fieldName}.password`}
              field={children.password}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.authMethod`}
              field={children.authMethod}
            />
          </Div>
        </Div>

        {/* Sync */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.accounts.id.put.sync")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.enabled`}
              field={children.enabled}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.keepAlive`}
              field={children.keepAlive}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.syncInterval`}
              field={children.syncInterval}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.maxMessages`}
              field={children.maxMessages}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.connectionTimeout`}
              field={children.connectionTimeout}
            />
          </Div>
          <TextareaFieldWidget
            fieldName={`${fieldName}.syncFolders`}
            field={children.syncFolders.child}
          />
        </Div>

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.imapClient.accounts.id.put.submit",
              loadingText:
                "app.api.emails.imapClient.accounts.id.put.submitting",
              icon: "save",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
