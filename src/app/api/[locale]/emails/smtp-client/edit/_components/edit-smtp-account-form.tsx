/**
 * Edit SMTP Account Form Component
 * Form for editing existing SMTP accounts
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
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";

import editDefinition from "@/app/api/[locale]/emails/smtp-client/edit/[id]/definition";
import { useSmtpAccountById } from "@/app/api/[locale]/emails/smtp-client/edit/[id]/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useSmtpAccountById(
    {
      accountId,
      enabled: true,
    },
    logger,
  );

  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;
  const account = endpoint.read.data;

  const handleSubmit = endpoint.create.onSubmit;

  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="text-center">
          <Div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <P className="text-gray-500">{t("app.admin.common.loading")}</P>
        </Div>
      </Div>
    );
  }

  if (!account) {
    return (
      <Div className="flex items-center justify-center h-64">
        <Div className="text-center">
          <P className="text-gray-500 mb-4">
            {t("app.admin.emails.smtp.pages.edit.notFound")}
          </P>
          <Button asChild>
            <Link href={`/${locale}/admin/emails/smtp`}>
              {t("app.admin.common.actions.back")}
            </Link>
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-6">
      {/* Back Button */}
      <Div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/admin/emails/smtp`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("app.admin.emails.smtp.pages.edit.actions.back")}
          </Link>
        </Button>
      </Div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("app.admin.emails.smtp.admin.edit.title")}: {account?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create.form}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {/* Basic Information */}
            <FormFieldGroup
              title="app.admin.emails.smtp.admin.form.basicInfo"
              description="app.admin.emails.smtp.admin.form.basicInfoDescription"
            >
              <EndpointFormField
                name="name"
                endpoint={editDefinition.PUT}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="description"
                endpoint={editDefinition.PUT}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />
            </FormFieldGroup>

            {/* Selection Criteria - Fields removed as they don't exist in definition.ts */}

            {/* Server Configuration */}
            <FormFieldGroup
              title="app.admin.emails.smtp.admin.form.connectionSettings"
              description="app.admin.emails.smtp.admin.form.connectionSettingsDescription"
            >
              <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="host"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="port"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="securityType"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />
              </Div>
            </FormFieldGroup>

            {/* Authentication */}
            <FormFieldGroup
              title={
                "app.admin.emails.smtp.admin.form.connectionSettings" as const
              }
              description={
                "app.admin.emails.smtp.admin.form.connectionSettingsDescription" as const
              }
            >
              <EndpointFormField
                name="username"
                endpoint={editDefinition.PUT}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="password"
                endpoint={editDefinition.PUT}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />
            </FormFieldGroup>

            {/* Email Settings */}
            <FormFieldGroup
              title={"app.admin.emails.smtp.admin.form.emailSettings" as const}
              description={
                "app.admin.emails.smtp.admin.form.emailSettingsDescription" as const
              }
            >
              <EndpointFormField
                name="fromEmail"
                endpoint={editDefinition.PUT}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="campaignTypes"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="emailJourneyVariants"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="emailCampaignStages"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="countries"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />

                <EndpointFormField
                  name="languages"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />
              </Div>
            </FormFieldGroup>

            {/* Advanced Settings */}
            <FormFieldGroup
              title="app.admin.emails.smtp.admin.form.advancedSettings"
              description="app.admin.emails.smtp.admin.form.advancedSettingsDescription"
            >
              <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* connectionTimeout, maxConnections, rateLimitPerHour, isDefault removed - not in definition.ts */}

                <EndpointFormField
                  name="priority"
                  endpoint={editDefinition.PUT}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                  locale={locale}
                />
              </Div>
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <Div className="flex justify-end flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/admin/emails/smtp`)}
                disabled={isSaving}
              >
                {t("app.admin.emails.smtp.pages.edit.actions.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("app.admin.emails.smtp.admin.edit.submitting")
                  : t("app.admin.emails.smtp.admin.edit.submit")}
              </Button>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </Div>
  );
}
