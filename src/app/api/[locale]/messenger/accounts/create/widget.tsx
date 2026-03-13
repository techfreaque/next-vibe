/**
 * Unified Messenger Account Create Widget
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { CHANNEL_TO_PROVIDERS, MessengerProviderOptions } from "../enum";
import messengerAccountsListDefinition from "../list/definition";
import type definition from "./definition";
import type { MessengerAccountCreatePOSTResponseOutput } from "./definition";
import { MessageChannel } from "../enum";

interface CustomWidgetProps {
  field: {
    value: MessengerAccountCreatePOSTResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function MessengerAccountCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm();
  const { push: navigate } = useWidgetNavigation();

  const createdId = field.value?.account?.id;
  React.useEffect(() => {
    if (createdId) {
      navigate(messengerAccountsListDefinition.GET);
    }
  }, [createdId, navigate]);

  const channel: string = form?.watch("channel") ?? "";
  const isEmail = channel === MessageChannel.EMAIL;
  const isSmtp = isEmail && form?.watch("provider") === "enums.provider.smtp";
  const isApiProvider = !isSmtp && channel !== "";

  const validProviders = channel ? CHANNEL_TO_PROVIDERS[channel] : undefined;
  const filteredProviderOptions = validProviders
    ? MessengerProviderOptions.filter((opt) =>
        (validProviders as readonly string[]).includes(String(opt.value)),
      )
    : MessengerProviderOptions;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <Span className="font-semibold text-base">{t("title")}</Span>
      </Div>

      {/* Form body */}
      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Identity */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("sections.identity")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <TextFieldWidget fieldName={"name"} field={children.name} />
            <SelectFieldWidget fieldName={"status"} field={children.status} />
          </Div>
          <TextareaFieldWidget
            fieldName={"description"}
            field={children.description}
          />
          <Div className="grid grid-cols-2 gap-3">
            <SelectFieldWidget fieldName={"channel"} field={children.channel} />
            <SelectFieldWidget
              fieldName={"provider"}
              field={{ ...children.provider, options: filteredProviderOptions }}
            />
          </Div>
          <Div className="grid grid-cols-2 gap-3">
            <NumberFieldWidget
              fieldName={"priority"}
              field={children.priority}
            />
            <BooleanFieldWidget
              fieldName={"isDefault"}
              field={children.isDefault}
            />
          </Div>
        </Div>

        {/* SMTP credentials (EMAIL + SMTP provider) */}
        {isSmtp && (
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("sections.smtp")}
            </Span>
            <TextFieldWidget fieldName={"smtpHost"} field={children.smtpHost} />
            <Div className="grid grid-cols-2 gap-3">
              <NumberFieldWidget
                fieldName={"smtpPort"}
                field={children.smtpPort}
              />
              <SelectFieldWidget
                fieldName={"smtpSecurityType"}
                field={children.smtpSecurityType}
              />
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget
                fieldName={"smtpUsername"}
                field={children.smtpUsername}
              />
              <PasswordFieldWidget
                fieldName={"smtpPassword"}
                field={children.smtpPassword}
              />
            </Div>
            <EmailFieldWidget
              fieldName={"smtpFromEmail"}
              field={children.smtpFromEmail}
            />
            <Div className="grid grid-cols-3 gap-3">
              <NumberFieldWidget
                fieldName={"smtpConnectionTimeout"}
                field={children.smtpConnectionTimeout}
              />
              <NumberFieldWidget
                fieldName={"smtpMaxConnections"}
                field={children.smtpMaxConnections}
              />
              <NumberFieldWidget
                fieldName={"smtpRateLimitPerHour"}
                field={children.smtpRateLimitPerHour}
              />
            </Div>
          </Div>
        )}

        {/* API credentials (non-SMTP providers) */}
        {isApiProvider && (
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("sections.api")}
            </Span>
            <PasswordFieldWidget fieldName={"apiKey"} field={children.apiKey} />
            <Div className="grid grid-cols-2 gap-3">
              <PasswordFieldWidget
                fieldName={"apiToken"}
                field={children.apiToken}
              />
              <PasswordFieldWidget
                fieldName={"apiSecret"}
                field={children.apiSecret}
              />
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget fieldName={"fromId"} field={children.fromId} />
              <TextFieldWidget
                fieldName={"webhookUrl"}
                field={children.webhookUrl}
              />
            </Div>
          </Div>
        )}

        {/* IMAP inbound (EMAIL channel only) */}
        {isEmail && (
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("sections.imap")}
            </Span>
            <TextFieldWidget fieldName={"imapHost"} field={children.imapHost} />
            <Div className="grid grid-cols-2 gap-3">
              <NumberFieldWidget
                fieldName={"imapPort"}
                field={children.imapPort}
              />
              <BooleanFieldWidget
                fieldName={"imapSecure"}
                field={children.imapSecure}
              />
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget
                fieldName={"imapUsername"}
                field={children.imapUsername}
              />
              <PasswordFieldWidget
                fieldName={"imapPassword"}
                field={children.imapPassword}
              />
            </Div>
            <Div className="grid grid-cols-3 gap-3">
              <SelectFieldWidget
                fieldName={"imapAuthMethod"}
                field={children.imapAuthMethod}
              />
              <BooleanFieldWidget
                fieldName={"imapSyncEnabled"}
                field={children.imapSyncEnabled}
              />
              <NumberFieldWidget
                fieldName={"imapSyncInterval"}
                field={children.imapSyncInterval}
              />
            </Div>
            <NumberFieldWidget
              fieldName={"imapMaxMessages"}
              field={children.imapMaxMessages}
            />
          </Div>
        )}

        {/* Email routing (EMAIL channel only) */}
        {isEmail && (
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("sections.routing")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <MultiSelectFieldWidget
                fieldName={"campaignTypes"}
                field={children.campaignTypes}
              />
              <MultiSelectFieldWidget
                fieldName={"emailJourneyVariants"}
                field={children.emailJourneyVariants}
              />
              <MultiSelectFieldWidget
                fieldName={"emailCampaignStages"}
                field={children.emailCampaignStages}
              />
              <MultiSelectFieldWidget
                fieldName={"countries"}
                field={children.countries}
              />
              <MultiSelectFieldWidget
                fieldName={"languages"}
                field={children.languages}
              />
            </Div>
            <Div className="grid grid-cols-3 gap-3">
              <BooleanFieldWidget
                fieldName={"isExactMatch"}
                field={children.isExactMatch}
              />
              <NumberFieldWidget fieldName={"weight"} field={children.weight} />
              <BooleanFieldWidget
                fieldName={"isFailover"}
                field={children.isFailover}
              />
            </Div>
            <NumberFieldWidget
              fieldName={"failoverPriority"}
              field={children.failoverPriority}
            />
          </Div>
        )}

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "title",
              loadingText: "title",
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
