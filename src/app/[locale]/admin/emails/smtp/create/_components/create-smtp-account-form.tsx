/**
 * Create SMTP Account Form Component
 * Form for creating new SMTP accounts
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
import React from "react";

import { useSmtpAccountCreateEndpoint } from "@/app/api/[locale]/v1/core/emails/smtp-client/create/hooks";
import {
  CampaignType,
  SmtpSecurityType,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { createSmtpAccountSchema } from "@/app/api/[locale]/v1/core/emails/smtp-client/schema";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/v1/core/leads/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries, Languages } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

interface CreateSmtpAccountFormProps {
  locale: CountryLanguage;
}

export function CreateSmtpAccountForm({
  locale,
}: CreateSmtpAccountFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  const endpoint = useSmtpAccountCreateEndpoint({
    enabled: true,
  });

  const isLoading = endpoint.create.isSubmitting;

  // Security type options for select field
  const securityTypeOptions = [
    {
      value: SmtpSecurityType.NONE,
      label:
        "admin.dashboard.smtp.securityType.none" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.TLS,
      label:
        "admin.dashboard.smtp.securityType.tls" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.SSL,
      label:
        "admin.dashboard.smtp.securityType.ssl" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.STARTTLS,
      label:
        "admin.dashboard.smtp.securityType.starttls" as const satisfies TranslationKey,
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

  const isSuccess = endpoint.create.response?.success;

  // Handle successful submission
  React.useEffect(() => {
    if (isSuccess) {
      // Redirect to the accounts list page
      router.push(`/${locale}/admin/emails/smtp`);
    }
  }, [isSuccess, router, locale]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/admin/emails/smtp`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {"admin.dashboard.smtp.actions.back"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{"admin.dashboard.smtp.pages.create"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={endpoint.create.form} onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.basicInformation"}
                description={
                  "admin.dashboard.smtp.form.basicInformationDescription"
                }
              >
                <EndpointFormField
                  name="name"
                  config={{
                    type: "text",
                    label: "admin.dashboard.smtp.fields.name",
                    placeholder: "admin.dashboard.smtp.fields.namePlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={createSmtpAccountSchema}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />

                <EndpointFormField
                  name="description"
                  config={{
                    type: "textarea",
                    label: "admin.dashboard.smtp.fields.description",
                    placeholder:
                      "admin.dashboard.smtp.fields.descriptionPlaceholder",

                    rows: 2,
                  }}
                  control={endpoint.create.form.control}
                  schema={createSmtpAccountSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              {/* Selection Criteria */}
              <FormFieldGroup
                title={"smtp.admin.form.selectionCriteria"}
                description={"smtp.admin.form.selectionCriteriaDescription"}
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
                    schema={createSmtpAccountSchema}
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
                    schema={createSmtpAccountSchema}
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
                    schema={createSmtpAccountSchema}
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
                    schema={createSmtpAccountSchema}
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
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>
              </FormFieldGroup>

              {/* Server Configuration */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.serverConfiguration"}
                description={
                  "admin.dashboard.smtp.form.serverConfigurationDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="host"
                    config={{
                      type: "text",
                      label: "admin.dashboard.smtp.fields.host",
                      placeholder:
                        "admin.dashboard.smtp.fields.hostPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="port"
                    config={{
                      type: "number",
                      label: "admin.dashboard.smtp.fields.port",
                      placeholder:
                        "admin.dashboard.smtp.fields.portPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="securityType"
                    config={{
                      type: "select",
                      label: "admin.dashboard.smtp.fields.securityType",
                      placeholder:
                        "admin.dashboard.smtp.fields.securityTypePlaceholder",
                      options: securityTypeOptions,
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </div>
              </FormFieldGroup>

              {/* Authentication */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.authentication"}
                description={
                  "admin.dashboard.smtp.form.authenticationDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="username"
                    config={{
                      type: "text",
                      label: "admin.dashboard.smtp.fields.username",
                      placeholder:
                        "admin.dashboard.smtp.fields.usernamePlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="password"
                    config={{
                      type: "password",
                      label: "admin.dashboard.smtp.fields.password",
                      placeholder:
                        "admin.dashboard.smtp.fields.passwordPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </div>
              </FormFieldGroup>

              {/* Email Settings */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.emailSettings"}
                description={
                  "admin.dashboard.smtp.form.emailSettingsDescription"
                }
              >
                <EndpointFormField
                  name="fromEmail"
                  config={{
                    type: "email",
                    label: "admin.dashboard.smtp.fields.fromEmail",
                    placeholder:
                      "admin.dashboard.smtp.fields.fromEmailPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  schema={createSmtpAccountSchema}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />
              </FormFieldGroup>

              {/* Advanced Settings */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.advancedSettings"}
                description={
                  "admin.dashboard.smtp.form.advancedSettingsDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="connectionTimeout"
                    config={{
                      type: "number",
                      label: "admin.dashboard.smtp.fields.connectionTimeout",
                      placeholder:
                        "admin.dashboard.smtp.fields.connectionTimeoutPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="maxConnections"
                    config={{
                      type: "number",
                      label: "admin.dashboard.smtp.fields.maxConnections",
                      placeholder:
                        "admin.dashboard.smtp.fields.maxConnectionsPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="rateLimitPerHour"
                    config={{
                      type: "number",
                      label: "admin.dashboard.smtp.fields.rateLimitPerHour",
                      placeholder:
                        "admin.dashboard.smtp.fields.rateLimitPerHourPlaceholder",
                      min: 1,
                      max: 36000,
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
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
                      label: "admin.dashboard.smtp.fields.isDefault",
                      description:
                        "admin.dashboard.smtp.fields.isDefaultDescription",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="priority"
                    config={{
                      type: "number",
                      label: "admin.dashboard.smtp.fields.priority",
                      placeholder:
                        "admin.dashboard.smtp.fields.priorityPlaceholder",
                    }}
                    control={endpoint.create.form.control}
                    schema={createSmtpAccountSchema}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>
              </FormFieldGroup>

              {/* Selection Criteria */}
              <FormFieldGroup
                title={"admin.dashboard.smtp.form.advancedSettings" as const}
                description={
                  "admin.dashboard.smtp.form.advancedSettingsDescription" as const
                }
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EndpointFormField
                      name="weight"
                      config={{
                        type: "number",
                        label: "smtp.admin.fields.weight" as const,
                        placeholder:
                          "smtp.admin.fields.weightPlaceholder" as const,
                        min: 1,
                        max: 100,
                      }}
                      control={endpoint.create.form.control}
                      schema={createSmtpAccountSchema}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />

                    <EndpointFormField
                      name="failoverPriority"
                      config={{
                        type: "number",
                        label: "smtp.admin.fields.failoverPriority" as const,
                        placeholder:
                          "smtp.admin.fields.failoverPriorityPlaceholder" as const,
                        min: 0,
                        max: 100,
                      }}
                      control={endpoint.create.form.control}
                      schema={createSmtpAccountSchema}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EndpointFormField
                      name="isExactMatch"
                      config={{
                        type: "switch",
                        label: "smtp.admin.fields.isExactMatch" as const,
                        description:
                          "smtp.admin.fields.isExactMatchDescription" as const,
                      }}
                      control={endpoint.create.form.control}
                      schema={createSmtpAccountSchema}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />

                    <EndpointFormField
                      name="isFailover"
                      config={{
                        type: "switch",
                        label: "smtp.admin.fields.isFailover" as const,
                        description:
                          "smtp.admin.fields.isFailoverDescription" as const,
                      }}
                      control={endpoint.create.form.control}
                      schema={createSmtpAccountSchema}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />
                  </div>
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
                  disabled={isLoading}
                >
                  {t("admin.dashboard.smtp.actions.cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? t("admin.dashboard.smtp.actions.creating")
                    : t("admin.dashboard.smtp.actions.create")}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
