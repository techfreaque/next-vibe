/**
 * Test Email Widget
 */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, Mail, Send, Settings } from "next-vibe-ui/ui/icons";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function TestEmailContainer({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();
  const navigation = useWidgetNavigation();

  const sentAtFormatted = data?.result?.sentAt
    ? new Date(String(data.result.sentAt)).toLocaleString()
    : null;

  const handleGoToConfig = (): void => {
    void (async (): Promise<void> => {
      const configDefs =
        await import("../../campaign-starter/campaign-starter-config/definition");
      navigation.push(configDefs.default.PUT, {});
    })();
  };

  const handleSendAnother = (): void => {
    void (async (): Promise<void> => {
      const selfDefs = await import("./definition");
      navigation.push(selfDefs.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col gap-4">
      {/* Header: Title + Submit */}
      <Div className="flex flex-row items-center gap-2">
        <Div className="flex items-center gap-2 flex-1">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.campaigns.emails.testMail.post.widget.title")}
          </Span>
        </Div>
        <SubmitButtonWidget
          field={{
            text: "app.api.leads.campaigns.emails.testMail.post.widget.send",
            loadingText:
              "app.api.leads.campaigns.emails.testMail.post.widget.sending",
            icon: "send",
            variant: "primary",
          }}
        />
      </Div>

      <Div className="flex flex-col gap-4">
        <FormAlertWidget field={{}} />

        {/* Success response */}
        {data?.result?.success && (
          <>
            <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex flex-col gap-2">
              <Div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <Span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t(
                    "app.api.leads.campaigns.emails.testMail.post.widget.successMessage",
                  )}
                </Span>
              </Div>
              {data.result.testEmail && (
                <Span className="text-xs text-muted-foreground pl-8">
                  {t(
                    "app.api.leads.campaigns.emails.testMail.post.widget.sentTo",
                  )}
                  {data.result.testEmail}
                </Span>
              )}
              {data.result.subject && (
                <Span className="text-xs text-muted-foreground pl-8">
                  {t(
                    "app.api.leads.campaigns.emails.testMail.post.widget.subject",
                  )}
                  {data.result.subject}
                </Span>
              )}
              {sentAtFormatted && (
                <Span className="text-xs text-muted-foreground pl-8">
                  {t(
                    "app.api.leads.campaigns.emails.testMail.post.widget.sentAt",
                  )}
                  {sentAtFormatted}
                </Span>
              )}
            </Div>
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGoToConfig}
                className="flex items-center gap-1.5"
              >
                <Settings className="h-4 w-4" />
                {t(
                  "app.api.leads.campaigns.emails.testMail.post.widget.campaignConfig",
                )}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSendAnother}
                className="flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                {t(
                  "app.api.leads.campaigns.emails.testMail.post.widget.sendAnother",
                )}
              </Button>
            </Div>
            <Separator />
          </>
        )}

        {/* Recipient */}
        <EmailFieldWidget fieldName="testEmail" field={children.testEmail} />

        <Separator />

        {/* SMTP selection criteria */}
        <H3 className="text-sm font-medium text-muted-foreground">
          {t("app.admin.emails.smtp.admin.form.selectionCriteria")}
        </H3>
        <Div className="flex flex-col gap-4">
          <SelectFieldWidget
            fieldName="campaignType"
            field={children.campaignType}
          />
          <SelectFieldWidget
            fieldName="emailJourneyVariant"
            field={children.emailJourneyVariant}
          />
          <SelectFieldWidget
            fieldName="emailCampaignStage"
            field={children.emailCampaignStage}
          />
        </Div>

        <Separator />

        {/* Lead data */}
        <H3 className="text-sm font-medium text-muted-foreground">
          {t("app.api.leads.campaigns.emails.testMail.post.leadData.title")}
        </H3>
        <Div className="flex flex-col gap-4">
          <TextFieldWidget
            fieldName="leadData.businessName"
            field={children.leadData.children.businessName}
          />
          <TextFieldWidget
            fieldName="leadData.contactName"
            field={children.leadData.children.contactName}
          />
          <UrlFieldWidget
            fieldName="leadData.website"
            field={children.leadData.children.website}
          />
          <SelectFieldWidget
            fieldName="leadData.country"
            field={children.leadData.children.country}
          />
          <SelectFieldWidget
            fieldName="leadData.language"
            field={children.leadData.children.language}
          />
          <SelectFieldWidget
            fieldName="leadData.status"
            field={children.leadData.children.status}
          />
          <SelectFieldWidget
            fieldName="leadData.source"
            field={children.leadData.children.source}
          />
        </Div>
        <TextareaFieldWidget
          fieldName="leadData.notes"
          field={children.leadData.children.notes}
        />
      </Div>
    </Div>
  );
}
