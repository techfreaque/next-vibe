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

import { useSmtpAccountById } from "@/app/api/[locale]/v1/core/emails/smtp-client/edit/[id]/hooks";
import { SmtpSecurityType } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { CountryLanguage } from "@/i18n/core/config";
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

  // Security type options for select field
  const securityTypeOptions = [
    {
      value: SmtpSecurityType.NONE,
      label:
        "app.admin.emails.smtp.admin.security.none" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.TLS,
      label:
        "app.admin.emails.smtp.admin.security.tls" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.SSL,
      label:
        "app.admin.emails.smtp.admin.security.ssl" as const satisfies TranslationKey,
    },
    {
      value: SmtpSecurityType.STARTTLS,
      label:
        "app.admin.emails.smtp.admin.security.starttls" as const satisfies TranslationKey,
    },
  ];

  const handleSubmit = endpoint.create.onSubmit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">{t("app.admin.common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {t("app.admin.emails.smtp.pages.edit.notFound")}
          </p>
          <Button asChild>
            <Link href={`/${locale}/admin/emails/smtp`}>
              {t("app.admin.common.actions.back")}
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
            {t("app.admin.emails.smtp.pages.edit.actions.back")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("app.admin.emails.smtp.admin.edit.title")}:{" "}
            {account?.account.name}
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
              title="app.admin.emails.smtp.admin.form.basicInfo"
              description="app.admin.emails.smtp.admin.form.basicInfoDescription"
            >
              <EndpointFormField
                name="updates.name"
                config={{
                  type: "text",
                  label: "app.admin.emails.smtp.admin.fields.name",
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.namePlaceholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.description"
                config={{
                  type: "textarea",
                  label: "app.admin.emails.smtp.admin.fields.description",
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.descriptionPlaceholder",
                  rows: 2,
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Selection Criteria - Fields removed as they don't exist in definition.ts */}

            {/* Server Configuration */}
            <FormFieldGroup
              title="app.admin.emails.smtp.admin.form.connectionSettings"
              description="app.admin.emails.smtp.admin.form.connectionSettingsDescription"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="updates.host"
                  config={{
                    type: "text",
                    label: "app.admin.emails.smtp.admin.fields.host",
                    placeholder:
                      "app.admin.emails.smtp.admin.fields.hostPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="updates.port"
                  config={{
                    type: "number",
                    label: "app.admin.emails.smtp.admin.fields.port",
                    placeholder:
                      "app.admin.emails.smtp.admin.fields.portPlaceholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="updates.securityType"
                  config={{
                    type: "select",
                    label: "app.admin.emails.smtp.admin.fields.securityType",
                    placeholder:
                      "app.admin.emails.smtp.admin.fields.securityTypePlaceholder",
                    options: securityTypeOptions,
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
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
                name="updates.username"
                config={{
                  type: "text",
                  label: "app.admin.emails.smtp.admin.fields.username" as const,
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.usernamePlaceholder" as const,
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
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
                name="updates.fromEmail"
                config={{
                  type: "email",
                  label: "app.admin.emails.smtp.admin.fields.fromEmail",
                  placeholder:
                    "app.admin.emails.smtp.admin.fields.fromEmailPlaceholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Advanced Settings */}
            <FormFieldGroup
              title="app.admin.emails.smtp.admin.form.advancedSettings"
              description="app.admin.emails.smtp.admin.form.advancedSettingsDescription"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* connectionTimeout, maxConnections, rateLimitPerHour, isDefault removed - not in definition.ts */}

                <EndpointFormField
                  name="updates.priority"
                  config={{
                    type: "number",
                    label: "app.admin.emails.smtp.admin.fields.priority",
                    placeholder:
                      "app.admin.emails.smtp.admin.fields.priorityPlaceholder",
                  }}
                  control={endpoint.create.form.control}
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
                {t("app.admin.emails.smtp.pages.edit.actions.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("app.admin.emails.smtp.admin.edit.submitting")
                  : t("app.admin.emails.smtp.admin.edit.submit")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
