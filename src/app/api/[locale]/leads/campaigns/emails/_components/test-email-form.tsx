/**
 * Test Email Form Component
 * Client-side form for sending test emails with custom lead data
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Mail, Send } from "next-vibe-ui/ui/icons";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { CampaignType } from "@/app/api/[locale]/emails/smtp-client/enum";
import testEmailDefinitions from "@/app/api/[locale]/leads/campaigns/emails/test-mail/definition";
import { useTestEmailEndpoint } from "@/app/api/[locale]/leads/campaigns/emails/test-mail/hooks";
import {
  type EmailCampaignStageValues,
  type EmailJourneyVariantValues,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/leads/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
} from "@/i18n/core/language-utils";

interface TestEmailFormProps {
  user: JwtPayloadType;
  emailJourneyVariant: typeof EmailJourneyVariantValues;
  emailCampaignStage: typeof EmailCampaignStageValues;
  onClose?: () => void;
}

export function TestEmailForm({
  user,
  emailJourneyVariant,
  emailCampaignStage,
  onClose,
}: TestEmailFormProps): React.JSX.Element {
  const { t, locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Extract current country and language from locale
  const currentCountry = getCountryFromLocale(locale);
  const currentLanguage = getLanguageFromLocale(locale);

  const endpoint = useTestEmailEndpoint(user, logger, {
    create: {
      formOptions: {
        defaultValues: {
          testEmail: "test@example.com",
          // Prefill SMTP account criteria based on template context
          campaignType: CampaignType.LEAD_CAMPAIGN,
          emailJourneyVariant: emailJourneyVariant,
          emailCampaignStage: emailCampaignStage,
          leadData: {
            /* eslint-disable i18next/no-literal-string -- Mock data for email preview */
            businessName: "Acme Digital Solutions",
            contactName: "Jane Smith",
            website: "https://acme-digital.com",
            /* eslint-enable i18next/no-literal-string */
            country: currentCountry,
            language: currentLanguage,
            status: LeadStatus.NEW,
            source: LeadSource.WEBSITE,
            /* eslint-disable i18next/no-literal-string -- Mock data for email preview */
            notes:
              "Interested in premium social media management services. High potential client with established business.",
            /* eslint-enable i18next/no-literal-string */
          },
        },
      },
    },
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isSubmitting = endpoint.create.isSubmitting;
  const isSuccess = endpoint.create.response?.success === true;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center flex flex-row gap-2">
          <Mail className="h-5 w-5" />
          <Span>{t("app.admin.leads.leads.admin.emails.testEmail.title")}</Span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form
          form={endpoint.create.form}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Test Email Recipient */}
          <Div className="flex flex-col gap-4">
            <H3 className="text-lg font-medium">
              {t(
                "app.admin.leads.leads.admin.emails.testEmail.recipient.title",
              )}
            </H3>
            <EndpointFormField
              name="testEmail"
              control={endpoint.create.form.control}
              endpoint={testEmailDefinitions.POST}
              locale={locale}
            />
          </Div>

          <Separator />

          {/* SMTP Account Selection Criteria */}
          <Div className="flex flex-col gap-4">
            <H3 className="text-lg font-medium">
              {t("app.admin.emails.smtp.admin.form.selectionCriteria")}
            </H3>
            <P className="text-sm text-muted-foreground">
              {t(
                "app.admin.emails.smtp.admin.form.selectionCriteriaDescription",
              )}
            </P>

            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EndpointFormField
                name="campaignType"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />

              <EndpointFormField
                name="emailJourneyVariant"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />

              <EndpointFormField
                name="emailCampaignStage"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
            </Div>
          </Div>

          <Separator />

          {/* Lead Data for Template */}
          <Div className="flex flex-col gap-4">
            <H3 className="text-lg font-medium">
              {t("app.admin.leads.leads.admin.emails.testEmail.leadData.title")}
            </H3>
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EndpointFormField
                name="leadData.businessName"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
              <EndpointFormField
                name="leadData.contactName"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />

              <EndpointFormField
                name="leadData.website"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
              <EndpointFormField
                name="leadData.country"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
              <EndpointFormField
                name="leadData.language"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
              <EndpointFormField
                name="leadData.status"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
              <EndpointFormField
                name="leadData.source"
                control={endpoint.create.form.control}
                endpoint={testEmailDefinitions.POST}
                locale={locale}
              />
            </Div>
            <EndpointFormField
              name="leadData.notes"
              control={endpoint.create.form.control}
              endpoint={testEmailDefinitions.POST}
              locale={locale}
            />
          </Div>
          <FormAlert alert={endpoint.alert} />

          {/* Action Buttons */}
          <Div className="flex items-center justify-between pt-4">
            <Div className="flex items-center flex-row gap-2">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("app.common.cancel")}
                </Button>
              )}
            </Div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center flex-row gap-2"
            >
              <Send className="h-4 w-4" />
              <Span>
                {isSubmitting
                  ? t("app.admin.leads.leads.admin.emails.testEmail.sending")
                  : t("app.admin.leads.leads.admin.emails.testEmail.send")}
              </Span>
            </Button>
          </Div>

          {/* Success Message */}
          {isSuccess && (
            <Div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <P className="text-green-800">
                {t("app.admin.leads.leads.admin.emails.testEmail.success", {
                  email: endpoint.create.response?.success
                    ? endpoint.create.response.data.result.testEmail
                    : "",
                })}
              </P>
            </Div>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
