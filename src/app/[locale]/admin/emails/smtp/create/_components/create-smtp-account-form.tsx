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
        "app.admin.emails.smtp.securityType.none" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.TLS,
      label:
        "app.admin.emails.smtp.securityType.tls" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.SSL,
      label:
        "app.admin.emails.smtp.securityType.ssl" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.STARTTLS,
      label:
        "app.admin.emails.smtp.securityType.starttls" as const satisfies TranslationKey,
    },
  ];

  // Campaign type options for multi-select field
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

  // Email journey variant options for multi-select field
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

  // Email campaign stage options for multi-select field
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
            {"app.admin.emails.smtp.actions.back"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{"app.admin.emails.smtp.pages.create"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={endpoint.create.form} onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <FormFieldGroup
                title={"app.admin.emails.smtp.form.basicInformation"}
                description={
                  "app.admin.emails.smtp.form.basicInformationDescription"
                }
              >
                <EndpointFormField
                  name="name"
                  config={{
                    type: "text",
                    label: "app.admin.emails.smtp.fields.name",
                    placeholder: "app.admin.emails.smtp.fields.namePlaceholder",
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
                    label: "app.admin.emails.smtp.fields.description",
                    placeholder:
                      "app.admin.emails.smtp.fields.descriptionPlaceholder",

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
                title={"app.admin.emails.smtp.admin.form.selectionCriteria"}
                description={
                  "app.admin.emails.smtp.admin.form.selectionCriteriaDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="campaignTypes"
                    config={{
                      type: "multiselect",
                      label: "app.admin.emails.smtp.admin.fields.campaignTypes",
                      placeholder:
                        "app.admin.emails.smtp.admin.fields.campaignTypesPlaceholder",
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
                      label:
                        "app.admin.emails.smtp.admin.fields.emailJourneyVariants",
                      placeholder:
                        "app.admin.emails.smtp.admin.fields.emailJourneyVariantsPlaceholder",
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
                      label:
                        "app.admin.emails.smtp.admin.fields.emailCampaignStages",
                      placeholder:
                        "app.admin.emails.smtp.admin.fields.emailCampaignStagesPlaceholder",
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
                      label: "app.admin.emails.smtp.admin.fields.countries",
                      placeholder:
                        "app.admin.emails.smtp.admin.fields.countriesPlaceholder",
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
                      label: "app.admin.emails.smtp.admin.fields.languages",
                      placeholder:
                        "app.admin.emails.smtp.admin.fields.languagesPlaceholder",
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
                title={"app.admin.emails.smtp.form.serverConfiguration"}
                description={
                  "app.admin.emails.smtp.form.serverConfigurationDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="host"
                    config={{
                      type: "text",
                      label: "app.admin.emails.smtp.fields.host",
                      placeholder:
                        "app.admin.emails.smtp.fields.hostPlaceholder",
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
                      label: "app.admin.emails.smtp.fields.port",
                      placeholder:
                        "app.admin.emails.smtp.fields.portPlaceholder",
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
                      label: "app.admin.emails.smtp.fields.securityType",
                      placeholder:
                        "app.admin.emails.smtp.fields.securityTypePlaceholder",
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
                title={"app.admin.emails.smtp.form.authentication"}
                description={
                  "app.admin.emails.smtp.form.authenticationDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="username"
                    config={{
                      type: "text",
                      label: "app.admin.emails.smtp.fields.username",
                      placeholder:
                        "app.admin.emails.smtp.fields.usernamePlaceholder",
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
                      label: "app.admin.emails.smtp.fields.password",
                      placeholder:
                        "app.admin.emails.smtp.fields.passwordPlaceholder",
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
                title={"app.admin.emails.smtp.form.emailSettings"}
                description={
                  "app.admin.emails.smtp.form.emailSettingsDescription"
                }
              >
                <EndpointFormField
                  name="fromEmail"
                  config={{
                    type: "email",
                    label: "app.admin.emails.smtp.fields.fromEmail",
                    placeholder:
                      "app.admin.emails.smtp.fields.fromEmailPlaceholder",
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
                title={"app.admin.emails.smtp.form.advancedSettings"}
                description={
                  "app.admin.emails.smtp.form.advancedSettingsDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="connectionTimeout"
                    config={{
                      type: "number",
                      label: "app.admin.emails.smtp.fields.connectionTimeout",
                      placeholder:
                        "app.admin.emails.smtp.fields.connectionTimeoutPlaceholder",
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
                      label: "app.admin.emails.smtp.fields.maxConnections",
                      placeholder:
                        "app.admin.emails.smtp.fields.maxConnectionsPlaceholder",
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
                      label: "app.admin.emails.smtp.fields.rateLimitPerHour",
                      placeholder:
                        "app.admin.emails.smtp.fields.rateLimitPerHourPlaceholder",
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
                      label: "app.admin.emails.smtp.fields.isDefault",
                      description:
                        "app.admin.emails.smtp.fields.isDefaultDescription",
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
                      label: "app.admin.emails.smtp.fields.priority",
                      placeholder:
                        "app.admin.emails.smtp.fields.priorityPlaceholder",
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
                title={"app.admin.emails.smtp.form.advancedSettings" as const}
                description={
                  "app.admin.emails.smtp.form.advancedSettingsDescription" as const
                }
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EndpointFormField
                      name="weight"
                      config={{
                        type: "number",
                        label:
                          "app.admin.emails.smtp.admin.fields.weight" as const,
                        placeholder:
                          "app.admin.emails.smtp.admin.fields.weightPlaceholder" as const,
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
                        label:
                          "app.admin.emails.smtp.admin.fields.failoverPriority" as const,
                        placeholder:
                          "app.admin.emails.smtp.admin.fields.failoverPriorityPlaceholder" as const,
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
                        label:
                          "app.admin.emails.smtp.admin.fields.isExactMatch" as const,
                        description:
                          "app.admin.emails.smtp.admin.fields.isExactMatchDescription" as const,
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
                        label:
                          "app.admin.emails.smtp.admin.fields.isFailover" as const,
                        description:
                          "app.admin.emails.smtp.admin.fields.isFailoverDescription" as const,
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
                  {t("app.admin.emails.smtp.actions.cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? t("app.admin.emails.smtp.actions.creating")
                    : t("app.admin.emails.smtp.actions.create")}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
