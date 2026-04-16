/**
 * Unified Messenger Account Edit Widget
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/widget";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import {
  CHANNEL_TO_PROVIDERS,
  MessageChannel,
  MessengerProviderOptions,
} from "../../enum";
import type definition from "./definition";
import type { MessengerAccountEditPUTResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: MessengerAccountEditPUTResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      <Div className="flex flex-col gap-0.5">
        <Span className="text-sm font-semibold">{title}</Span>
        {subtitle && (
          <Span className="text-xs text-muted-foreground">{subtitle}</Span>
        )}
      </Div>
      {children}
    </Div>
  );
}

function CollapsibleSection({
  title,
  subtitle,
  toggleShow,
  toggleHide,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  toggleShow: string;
  toggleHide: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Div className="rounded-lg border border-border bg-card flex flex-col">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between p-4 h-auto text-left hover:bg-accent/50 transition-colors rounded-lg w-full"
      >
        <Div className="flex flex-col gap-0.5 items-start">
          <Span className="text-sm font-semibold">{title}</Span>
          {subtitle && (
            <Span className="text-xs text-muted-foreground">{subtitle}</Span>
          )}
        </Div>
        <Span className="text-muted-foreground text-xs ml-4">
          {open ? toggleHide : toggleShow}
        </Span>
      </Button>
      {open && (
        <Div className="px-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
          {children}
        </Div>
      )}
    </Div>
  );
}

export function MessengerAccountEditContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm();

  const channel = form.watch("channel") ?? "";
  const provider = form.watch("provider") ?? "";
  const isEmail = channel === MessageChannel.EMAIL;
  const isSms = channel === MessageChannel.SMS;
  const isWhatsapp = channel === MessageChannel.WHATSAPP;
  const isTelegram = channel === MessageChannel.TELEGRAM;
  const isSmtp = isEmail && provider === "enums.provider.smtp";
  const isApiProvider = channel !== "" && !isSmtp;
  const hasImapConfig = !!(form.watch("imapHost") as string | undefined);

  const validProviders = channel ? CHANNEL_TO_PROVIDERS[channel] : undefined;
  const filteredProviderOptions = validProviders
    ? MessengerProviderOptions.filter((opt) =>
        (validProviders as readonly string[]).includes(String(opt.value)),
      )
    : MessengerProviderOptions;

  // Per-channel section labels via i18n
  const apiSectionTitle = isTelegram
    ? t("sections.apiTitleTelegram")
    : isWhatsapp
      ? t("sections.apiTitleWhatsapp")
      : isSms
        ? t("sections.apiTitleSms")
        : t("sections.api");
  const apiSectionSubtitle = isTelegram
    ? t("sections.apiSubtitleTelegram")
    : isWhatsapp
      ? t("sections.apiSubtitleWhatsapp")
      : isSms
        ? t("sections.apiSubtitleSms")
        : t("sections.apiSubtitle");

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">{t("put.title")}</Span>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        {/* Identity */}
        <SectionCard
          title={t("sections.identity")}
          subtitle={t("sections.identitySubtitle")}
        >
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
            <Div className="flex items-end pb-1">
              <BooleanFieldWidget
                fieldName={"isDefault"}
                field={children.isDefault}
              />
            </Div>
          </Div>
        </SectionCard>

        {/* SMTP credentials */}
        {isSmtp && (
          <SectionCard
            title={t("sections.smtp")}
            subtitle={t("sections.smtpSubtitle")}
          >
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
          </SectionCard>
        )}

        {/* API credentials (non-SMTP) */}
        {isApiProvider && (
          <SectionCard title={apiSectionTitle} subtitle={apiSectionSubtitle}>
            {!isTelegram && (
              <PasswordFieldWidget
                fieldName={"apiKey"}
                field={children.apiKey}
              />
            )}
            <Div className="grid grid-cols-2 gap-3">
              <PasswordFieldWidget
                fieldName={"apiToken"}
                field={children.apiToken}
              />
              {!isTelegram && (
                <PasswordFieldWidget
                  fieldName={"apiSecret"}
                  field={children.apiSecret}
                />
              )}
            </Div>
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget fieldName={"fromId"} field={children.fromId} />
              <TextFieldWidget
                fieldName={"webhookUrl"}
                field={children.webhookUrl}
              />
            </Div>
          </SectionCard>
        )}

        {/* IMAP inbound - open by default if already configured */}
        {isSmtp && (
          <CollapsibleSection
            title={t("sections.imap")}
            subtitle={t("sections.imapSubtitle")}
            toggleShow={t("sections.toggleShow")}
            toggleHide={t("sections.toggleHide")}
            defaultOpen={hasImapConfig}
          >
            <TextFieldWidget fieldName={"imapHost"} field={children.imapHost} />
            <Div className="grid grid-cols-2 gap-3">
              <NumberFieldWidget
                fieldName={"imapPort"}
                field={children.imapPort}
              />
              <Div className="flex items-end pb-1">
                <BooleanFieldWidget
                  fieldName={"imapSecure"}
                  field={children.imapSecure}
                />
              </Div>
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
          </CollapsibleSection>
        )}

        {/* Email routing - open by default */}
        {isEmail && (
          <CollapsibleSection
            title={t("sections.routing")}
            subtitle={t("sections.routingSubtitle")}
            toggleShow={t("sections.toggleShow")}
            toggleHide={t("sections.toggleHide")}
            defaultOpen={true}
          >
            <MultiSelectFieldWidget
              fieldName={"campaignTypes"}
              field={children.campaignTypes}
            />
            <Div className="grid grid-cols-2 gap-3">
              <MultiSelectFieldWidget
                fieldName={"emailJourneyVariants"}
                field={children.emailJourneyVariants}
              />
              <MultiSelectFieldWidget
                fieldName={"emailCampaignStages"}
                field={children.emailCampaignStages}
              />
            </Div>
            <Div className="grid grid-cols-2 gap-3">
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
          </CollapsibleSection>
        )}

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget<typeof definition.PUT>
            field={{
              text: "put.title",
              loadingText: "put.title",
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
