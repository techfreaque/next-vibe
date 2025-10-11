/**
 * Edit SMTP Account Form Component
 * Form for editing existing SMTP accounts
 */

"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import { useSmtpAccountByIdEndpoint } from "@/app/api/[locale]/v1/core/emails/smtp-client/edit/[id]/hooks";
import {
  CampaignType,
  SmtpSecurityType,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { updateSmtpAccountSchema } from "@/app/api/[locale]/v1/core/emails/smtp-client/schema";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries, Languages } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface EditSmtpAccountFormProps {
  locale: CountryLanguage;
  accountId: string;
}

export function EditSmtpAccountForm({
  locale,
  accountId,
}: EditSmtpAccountFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  const endpoint = useSmtpAccountByIdEndpoint({
    accountId,
    enabled: true,
  });

  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const account = endpoint.read.data;

  // Security type options for select field
  const securityTypeOptions = [
    {
      value: SmtpSecurityType.NONE,
      label: "smtp.admin.security.none" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.TLS,
      label: "smtp.admin.security.tls" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.SSL,
      label: "smtp.admin.security.ssl" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.STARTTLS,
      label: "smtp.admin.security.starttls" as const satisfies TranslationKey,
    },
  ];

  // Campaign type options for multi-select field
  const campaignTypeOptions = [
    {
      value: CampaignType.LEAD_CAMPAIGN,
      label:
        "smtp.admin.campaignTypes.leadCampaign" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.NEWSLETTER,
      label:
        "smtp.admin.campaignTypes.newsletter" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.TRANSACTIONAL,
      label:
        "smtp.admin.campaignTypes.transactional" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.NOTIFICATION,
      label:
        "smtp.admin.campaignTypes.notification" as const satisfies TranslationKey,
    },
    {
      value: CampaignType.SYSTEM,
      label:
        "smtp.admin.campaignTypes.system" as const satisfies TranslationKey,
    },
  ];

  // Email journey variant options for multi-select field
  const emailJourneyVariantOptions = [
    {
      value: EmailJourneyVariant.PERSONAL_APPROACH,
      label:
        "smtp.admin.emailJourneyVariants.personalApproach" as const satisfies TranslationKey,
    },
    {
      value: EmailJourneyVariant.RESULTS_FOCUSED,
      label:
        "smtp.admin.emailJourneyVariants.resultsFocused" as const satisfies TranslationKey,
    },
    {
      value: EmailJourneyVariant.PERSONAL_RESULTS,
      label:
        "smtp.admin.emailJourneyVariants.personalResults" as const satisfies TranslationKey,
    },
  ];

  // Email campaign stage options for multi-select field
  const emailCampaignStageOptions = [
    {
      value: EmailCampaignStage.NOT_STARTED,
      label:
        "smtp.admin.emailCampaignStages.notStarted" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.INITIAL,
      label:
        "smtp.admin.emailCampaignStages.initial" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_1,
      label:
        "smtp.admin.emailCampaignStages.followup1" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_2,
      label:
        "smtp.admin.emailCampaignStages.followup2" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.FOLLOWUP_3,
      label:
        "smtp.admin.emailCampaignStages.followup3" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.NURTURE,
      label:
        "smtp.admin.emailCampaignStages.nurture" as const satisfies TranslationKey,
    },
    {
      value: EmailCampaignStage.REACTIVATION,
      label:
        "smtp.admin.emailCampaignStages.reactivation" as const satisfies TranslationKey,
    },
  ];

  // Country options for multi-select field
  const countryOptions = [
    {
      value: Countries.GLOBAL,
      label: "common.countries.global" as const satisfies TranslationKey,
    },
    {
      value: Countries.DE,
      label: "common.countries.de" as const satisfies TranslationKey,
    },
    {
      value: Countries.PL,
      label: "common.countries.pl" as const satisfies TranslationKey,
    },
  ];

  // Language options for multi-select field
  const languageOptions = [
    {
      value: Languages.EN,
      label: "common.languages.en" as const satisfies TranslationKey,
    },
    {
      value: Languages.DE,
      label: "common.languages.de" as const satisfies TranslationKey,
    },
    {
      value: Languages.PL,
      label: "common.languages.pl" as const satisfies TranslationKey,
    },
  ];

  const handleSubmit = endpoint.create.onSubmit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">{t("smtp.list.loading")}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("smtp.list.noResults")}</p>
          <Button asChild>
            <Link href={`/${locale}/admin/emails/smtp`}>
              {t("smtp.list.actions.back")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/admin/emails/smtp`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("smtp.list.actions.back")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("smtp.admin.edit.title")}: {account.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create.form}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic Information */}
            <FormFieldGroup
              title="smtp.admin.form.basicInfo"
              description="smtp.admin.form.basicInfoDescription"
            >
              <EndpointFormField
                name="name"
                config={{
                  type: "text",
                  label: "smtp.admin.fields.name",
                  placeholder: "smtp.admin.fields.namePlaceholder",
                }}
                control={endpoint.create.form.control}
                schema={updateSmtpAccountSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="description"
                config={{
                  type: "textarea",
                  label: "smtp.admin.fields.description",
                  placeholder: "smtp.admin.fields.descriptionPlaceholder",
                  rows: 2,
                }}
                control={endpoint.create.form.control}
                schema={updateSmtpAccountSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Selection Criteria */}
            <FormFieldGroup
              title="smtp.admin.form.selectionCriteria"
              description="smtp.admin.form.selectionCriteriaDescription"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="campaignTypes"
                  config={{
                    type: "multiselect",
                    label: "smtp.admin.fields.campaignTypes",
                    placeholder: "smtp.admin.fields.campaignTypesPlaceholder",
                    options: campaignTypeOptions,
                    maxSelections: 5,
                    searchable: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="emailJourneyVariants"
                  config={{
                    type: "multiselect",
                    label: "smtp.admin.fields.emailJourneyVariants",
                    placeholder:
                      "smtp.admin.fields.emailJourneyVariantsPlaceholder",
                    options: emailJourneyVariantOptions,
                    maxSelections: 3,
                    searchable: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="emailCampaignStages"
                  config={{
                    type: "multiselect",
                    label: "smtp.admin.fields.emailCampaignStages",
                    placeholder:
                      "smtp.admin.fields.emailCampaignStagesPlaceholder",
                    options: emailCampaignStageOptions,
                    maxSelections: 7,
                    searchable: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="countries"
                  config={{
                    type: "multiselect",
                    label: "smtp.admin.fields.countries",
                    placeholder: "smtp.admin.fields.countriesPlaceholder",
                    options: countryOptions,
                    maxSelections: 3,
                    searchable: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="languages"
                  config={{
                    type: "multiselect",
                    label: "smtp.admin.fields.languages",
                    placeholder: "smtp.admin.fields.languagesPlaceholder",
                    options: languageOptions,
                    maxSelections: 3,
                    searchable: true,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            {/* Server Configuration */}
            <FormFieldGroup
              title="smtp.admin.form.connectionSettings"
              description="smtp.admin.form.connectionSettingsDescription"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="host"
                  config={{
                    type: "text",
                    label: "smtp.admin.fields.host",
                    placeholder: "smtp.admin.fields.hostPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="port"
                  config={{
                    type: "number",
                    label: "smtp.admin.fields.port",
                    placeholder: "smtp.admin.fields.portPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="securityType"
                  config={{
                    type: "select",
                    label: "smtp.admin.fields.securityType",
                    placeholder: "smtp.admin.fields.securityTypePlaceholder",
                    options: securityTypeOptions,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            {/* Authentication */}
            <FormFieldGroup
              title={"admin.dashboard.smtp.form.authentication" as const}
              description={
                "admin.dashboard.smtp.form.authenticationDescription" as const
              }
            >
              <EndpointFormField
                name="username"
                config={{
                  type: "text",
                  label: "admin.dashboard.smtp.fields.username" as const,
                  placeholder:
                    "admin.dashboard.smtp.fields.usernamePlaceholder" as const,
                }}
                control={endpoint.create.form.control}
                schema={updateSmtpAccountSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Email Settings */}
            <FormFieldGroup
              title={"admin.dashboard.smtp.form.emailSettings" as const}
              description={
                "admin.dashboard.smtp.form.emailSettingsDescription" as const
              }
            >
              <EndpointFormField
                name="fromEmail"
                config={{
                  type: "email",
                  label: "smtp.admin.fields.fromEmail",
                  placeholder: "smtp.admin.fields.fromEmailPlaceholder",
                }}
                control={endpoint.create.form.control}
                schema={updateSmtpAccountSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Advanced Settings */}
            <FormFieldGroup
              title="smtp.admin.form.advancedSettings"
              description="smtp.admin.form.advancedSettingsDescription"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="connectionTimeout"
                  config={{
                    type: "number",
                    label: "smtp.admin.fields.connectionTimeout",
                    placeholder:
                      "smtp.admin.fields.connectionTimeoutPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="maxConnections"
                  config={{
                    type: "number",
                    label: "smtp.admin.fields.maxConnections",
                    placeholder: "smtp.admin.fields.maxConnectionsPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="rateLimitPerHour"
                  config={{
                    type: "number",
                    label: "smtp.admin.fields.rateLimitPerHour",
                    placeholder:
                      "smtp.admin.fields.rateLimitPerHourPlaceholder",
                    min: 1,
                    max: 36000,
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="isDefault"
                  config={{
                    type: "switch",
                    label: "smtp.admin.fields.isDefault",
                    description: "smtp.admin.fields.isDefaultDescription",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="priority"
                  config={{
                    type: "number",
                    label: "smtp.admin.fields.priority",
                    placeholder: "smtp.admin.fields.priorityPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={updateSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/admin/emails/smtp`)}
                disabled={isSaving}
              >
                {t("admin.dashboard.smtp.actions.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("smtp.admin.edit.submitting")
                  : t("smtp.admin.edit.submit")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
