/**
 * Create SMTP Account Form Component
 * Form for creating new SMTP accounts
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { ArrowLeft, Save } from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import React from "react";

import createDefinition from "@/app/api/[locale]/emails/smtp-client/create/definition";
import { useSmtpAccountCreateEndpoint } from "@/app/api/[locale]/emails/smtp-client/create/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CreateSmtpAccountFormProps {
  locale: CountryLanguage;
}

export function CreateSmtpAccountForm({
  locale,
}: CreateSmtpAccountFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Create logger and endpoint
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useSmtpAccountCreateEndpoint(logger);

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.create.isSubmitting;

  // Handle successful submission
  React.useEffect(() => {
    if (endpoint.create.response?.success) {
      // Redirect to the accounts list page
      router.push(`/${locale}/admin/emails/smtp`);
    }
  }, [endpoint.create.response?.success, router, locale]);

  return (
    <Div className="flex flex-col gap-6">
      {/* Back Button */}
      <Div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/admin/emails/smtp`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("app.admin.emails.smtp.list.actions.back")}
          </Link>
        </Button>
      </Div>

      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.emails.smtp.admin.create.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={endpoint.create.form} onSubmit={handleSubmit}>
            <Div className="flex flex-col gap-6">
              {/* Basic Information */}
              <FormFieldGroup
                title="app.admin.emails.smtp.admin.form.basicInfo"
                description="app.admin.emails.smtp.admin.form.basicInfoDescription"
              >
                <EndpointFormField
                  name="accountInfo.name"
                  endpoint={createDefinition.POST}
                  control={endpoint.create.form.control}
                  locale={locale}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />

                <EndpointFormField
                  name="accountInfo.description"
                  endpoint={createDefinition.POST}
                  control={endpoint.create.form.control}
                  locale={locale}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>

              {/* Server Configuration */}
              <FormFieldGroup
                title="app.admin.emails.smtp.admin.form.connectionSettings"
                description="app.admin.emails.smtp.admin.form.connectionSettingsDescription"
              >
                <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EndpointFormField
                    name="serverConfig.host"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="serverConfig.port"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="serverConfig.securityType"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </Div>
              </FormFieldGroup>

              {/* Authentication */}
              <FormFieldGroup
                title="app.admin.emails.smtp.admin.form.connectionSettings"
                description="app.admin.emails.smtp.admin.form.connectionSettingsDescription"
              >
                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="authentication.username"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="authentication.password"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />
                </Div>
              </FormFieldGroup>

              {/* Email Settings */}
              <FormFieldGroup
                title="app.admin.emails.smtp.admin.form.emailSettings"
                description="app.admin.emails.smtp.admin.form.emailSettingsDescription"
              >
                <EndpointFormField
                  name="emailConfig.fromEmail"
                  endpoint={createDefinition.POST}
                  control={endpoint.create.form.control}
                  locale={locale}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />

                <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="emailConfig.campaignTypes"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="emailConfig.emailJourneyVariants"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="emailConfig.emailCampaignStages"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="emailConfig.countries"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="emailConfig.languages"
                    endpoint={createDefinition.POST}
                    control={endpoint.create.form.control}
                    locale={locale}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </Div>
              </FormFieldGroup>

              {/* Form Alert for errors and success */}
              <FormAlert alert={endpoint.alert} />

              {/* Submit Button */}
              <Div className="flex justify-end flex flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${locale}/admin/emails/smtp`)}
                  disabled={isLoading}
                >
                  {t("app.admin.emails.smtp.list.actions.cancel")}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? t("app.admin.emails.smtp.list.actions.creating")
                    : t("app.admin.emails.smtp.list.actions.create")}
                </Button>
              </Div>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </Div>
  );
}
