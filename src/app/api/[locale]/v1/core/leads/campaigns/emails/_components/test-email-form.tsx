/**
 * Test Email Form Component
 * Client-side form for sending test emails with custom lead data
 */

"use client";

import { Mail, Send } from "next-vibe-ui/ui/icons";

import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { H3, P } from "next-vibe-ui/ui/typography";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { Separator } from "next-vibe-ui/ui/separator";
import type React from "react";

import { CampaignType } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import definitions from "@/app/api/[locale]/v1/core/leads/campaigns/emails/test-mail/definition";
import { useTestEmailEndpoint } from "@/app/api/[locale]/v1/core/leads/campaigns/emails/test-mail/hooks";
import {
  EmailCampaignStage,
  type EmailCampaignStageValues,
  EmailJourneyVariant,
  type EmailJourneyVariantValues,
  LeadSource,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import { CountriesOptions, LanguagesOptions } from "@/i18n/core/config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
} from "@/i18n/core/language-utils";
import type { TranslationKey } from "@/i18n/core/static-types";

interface TestEmailFormProps {
  emailJourneyVariant: typeof EmailJourneyVariantValues;
  emailCampaignStage: typeof EmailCampaignStageValues;
  onClose?: () => void;
}

export function TestEmailForm({
  emailJourneyVariant,
  emailCampaignStage,
  onClose,
}: TestEmailFormProps): React.JSX.Element {
  const { t, locale } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Extract current country and language from locale
  const currentCountry = getCountryFromLocale(locale);
  const currentLanguage = getLanguageFromLocale(locale);

  // Create options for multiselect fields
  const campaignTypeOptions = [
    {
      value: CampaignType.LEAD_CAMPAIGN,
      label:
        "app.admin.emails.smtp.admin.campaignTypes.leadCampaign" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.NEWSLETTER,
      label:
        "app.admin.emails.smtp.admin.campaignTypes.newsletter" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.TRANSACTIONAL,
      label:
        "app.admin.emails.smtp.admin.campaignTypes.transactional" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.NOTIFICATION,
      label:
        "app.admin.emails.smtp.admin.campaignTypes.notification" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.SYSTEM,
      label:
        "app.admin.emails.smtp.admin.campaignTypes.system" as const satisfies TranslationKey,
    },
  ];

  const emailJourneyVariantOptions = [
    {
      value: EmailJourneyVariant.PERSONAL_APPROACH,
      label:
        "app.admin.emails.smtp.admin.emailJourneyVariants.personalApproach" as const satisfies TranslationKey,
    },
    {
      value: EmailJourneyVariant.RESULTS_FOCUSED,
      label:
        "app.admin.emails.smtp.admin.emailJourneyVariants.resultsFocused" as const satisfies TranslationKey,
    },
    {
      value: EmailJourneyVariant.PERSONAL_RESULTS,
      label:
        "app.admin.emails.smtp.admin.emailJourneyVariants.personalResults" as const satisfies TranslationKey,
    },
  ];

  const emailCampaignStageOptions = [
    {
      value: EmailCampaignStage.NOT_STARTED,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.notStarted" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.INITIAL,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.initial" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_1,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.followup1" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_2,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.followup2" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_3,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.followup3" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.NURTURE,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.nurture" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.REACTIVATION,
      label:
        "app.admin.emails.smtp.admin.emailCampaignStages.reactivation" as const satisfies TranslationKey,
    },
  ];

  const endpoint = useTestEmailEndpoint(logger, {
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
  });

  const schema = definitions.POST.requestSchema;
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
              config={{
                type: "email",
                label:
                  "app.admin.leads.leads.admin.emails.testEmail.recipient.email.label" as const,
                placeholder:
                  "app.admin.leads.leads.admin.emails.testEmail.recipient.email.placeholder" as const,
                description:
                  "app.admin.leads.leads.admin.emails.testEmail.recipient.email.description" as const,
              }}
              control={endpoint.create.form.control}
              schema={schema}
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
                config={{
                  type: "select",
                  label:
                    "app.admin.emails.smtp.admin.fields.campaignTypes" as const,
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.campaignTypesPlaceholder" as const,
                  options: campaignTypeOptions,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />

              <EndpointFormField
                name="emailJourneyVariant"
                config={{
                  type: "select",
                  label:
                    "app.admin.emails.smtp.admin.fields.emailJourneyVariants" as const,
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.emailJourneyVariantsPlaceholder" as const,
                  options: emailJourneyVariantOptions,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />

              <EndpointFormField
                name="emailCampaignStage"
                config={{
                  type: "select",
                  label:
                    "app.admin.emails.smtp.admin.fields.emailCampaignStages" as const,
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.emailCampaignStagesPlaceholder" as const,
                  options: emailCampaignStageOptions,
                }}
                control={endpoint.create.form.control}
                schema={schema}
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
                config={{
                  type: "text",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.businessName.label" as const,
                  placeholder:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.businessName.placeholder" as const,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
              <EndpointFormField
                name="leadData.contactName"
                config={{
                  type: "text",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.contactName.label" as const,
                  placeholder:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.contactName.placeholder" as const,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />

              <EndpointFormField
                name="leadData.website"
                config={{
                  type: "url",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.website.label" as const,
                  placeholder:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.website.placeholder" as const,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
              <EndpointFormField
                name="leadData.country"
                config={{
                  type: "select",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.country.label" as const,
                  options: CountriesOptions,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
              <EndpointFormField
                name="leadData.language"
                config={{
                  type: "select",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.language.label" as const,
                  options: LanguagesOptions,
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
              <EndpointFormField
                name="leadData.status"
                config={{
                  type: "select",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.status.label" as const,
                  options: [
                    {
                      value: LeadStatus.NEW,
                      label: "app.admin.leads.leads.admin.status.new" as const,
                    },
                    {
                      value: LeadStatus.PENDING,
                      label:
                        "app.admin.leads.leads.admin.status.pending" as const,
                    },
                    {
                      value: LeadStatus.CAMPAIGN_RUNNING,
                      label:
                        "app.admin.leads.leads.admin.status.campaign_running" as const,
                    },
                    {
                      value: LeadStatus.WEBSITE_USER,
                      label:
                        "app.admin.leads.leads.admin.status.website_user" as const,
                    },
                    {
                      value: LeadStatus.NEWSLETTER_SUBSCRIBER,
                      label:
                        "app.admin.leads.leads.admin.status.newsletter_subscriber" as const,
                    },
                    {
                      value: LeadStatus.IN_CONTACT,
                      label:
                        "app.admin.leads.leads.admin.status.in_contact" as const,
                    },
                  ],
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
              <EndpointFormField
                name="leadData.source"
                config={{
                  type: "select",
                  label:
                    "app.admin.leads.leads.admin.emails.testEmail.leadData.source.label" as const,
                  options: [
                    {
                      value: LeadSource.WEBSITE,
                      label:
                        "app.admin.leads.leads.admin.source.website" as const,
                    },
                    {
                      value: LeadSource.SOCIAL_MEDIA,
                      label:
                        "app.admin.leads.leads.admin.source.social_media" as const,
                    },
                    {
                      value: LeadSource.EMAIL_CAMPAIGN,
                      label:
                        "app.admin.leads.leads.admin.source.email_campaign" as const,
                    },
                    {
                      value: LeadSource.REFERRAL,
                      label:
                        "app.admin.leads.leads.admin.source.referral" as const,
                    },
                    {
                      value: LeadSource.CSV_IMPORT,
                      label:
                        "app.admin.leads.leads.admin.source.csv_import" as const,
                    },
                    {
                      value: LeadSource.API,
                      label: "app.admin.leads.leads.admin.source.api" as const,
                    },
                  ],
                }}
                control={endpoint.create.form.control}
                schema={schema}
              />
            </Div>
            <EndpointFormField
              name="leadData.notes"
              config={{
                type: "textarea",
                label:
                  "app.admin.leads.leads.admin.emails.testEmail.leadData.notes.label" as const,
                placeholder:
                  "app.admin.leads.leads.admin.emails.testEmail.leadData.notes.placeholder" as const,
                rows: 3,
              }}
              control={endpoint.create.form.control}
              schema={schema}
            />
          </Div>
          <FormAlert alert={endpoint.alert} />

          {/* Action Buttons */}
          <Div className="flex items-center justify-between pt-4">
            <Div className="flex items-center flex flex-row gap-2">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("app.common.cancel")}
                </Button>
              )}
            </Div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center flex flex-row gap-2"
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
