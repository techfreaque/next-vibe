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
import { Div } from "next-vibe-ui/ui";
import React from "react";

import { useSmtpAccountCreateEndpoint } from "@/app/api/[locale]/v1/core/emails/smtp-client/create/hooks";
import { SmtpSecurityTypeOptions } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
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
    <Div className="space-y-6">
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
            <Div className="space-y-6">
              {/* Basic Information */}
              <FormFieldGroup
                title="app.admin.emails.smtp.admin.form.basicInfo"
                description="app.admin.emails.smtp.admin.form.basicInfoDescription"
              >
                <EndpointFormField
                  name="accountInfo.name"
                  config={{
                    type: "text",
                    label:
                      "app.api.v1.core.emails.smtpClient.create.name.label",
                    description:
                      "app.api.v1.core.emails.smtpClient.create.name.description",
                    placeholder:
                      "app.api.v1.core.emails.smtpClient.create.name.placeholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />

                <EndpointFormField
                  name="accountInfo.description"
                  config={{
                    type: "textarea",
                    label:
                      "app.api.v1.core.emails.smtpClient.create.accountDescription.label",
                    description:
                      "app.api.v1.core.emails.smtpClient.create.accountDescription.description",
                    placeholder:
                      "app.api.v1.core.emails.smtpClient.create.accountDescription.placeholder",
                    rows: 2,
                  }}
                  control={endpoint.create.form.control}
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
                    config={{
                      type: "text",
                      label:
                        "app.api.v1.core.emails.smtpClient.create.host.label",
                      description:
                        "app.api.v1.core.emails.smtpClient.create.host.description",
                      placeholder:
                        "app.api.v1.core.emails.smtpClient.create.host.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="serverConfig.port"
                    config={{
                      type: "number",
                      label:
                        "app.api.v1.core.emails.smtpClient.create.port.label",
                      description:
                        "app.api.v1.core.emails.smtpClient.create.port.description",
                      placeholder:
                        "app.api.v1.core.emails.smtpClient.create.port.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="serverConfig.securityType"
                    config={{
                      type: "select",
                      label:
                        "app.api.v1.core.emails.smtpClient.create.securityType.label",
                      description:
                        "app.api.v1.core.emails.smtpClient.create.securityType.description",
                      placeholder:
                        "app.api.v1.core.emails.smtpClient.create.securityType.placeholder",
                      options: SmtpSecurityTypeOptions,
                    }}
                    control={endpoint.create.form.control}
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
                    config={{
                      type: "text",
                      label:
                        "app.api.v1.core.emails.smtpClient.create.username.label",
                      description:
                        "app.api.v1.core.emails.smtpClient.create.username.description",
                      placeholder:
                        "app.api.v1.core.emails.smtpClient.create.username.placeholder",
                    }}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "asterisk",
                      showAllRequired: true,
                      requiredColor: "red",
                    }}
                  />

                  <EndpointFormField
                    name="authentication.password"
                    config={{
                      type: "password",
                      label:
                        "app.api.v1.core.emails.smtpClient.create.password.label",
                      description:
                        "app.api.v1.core.emails.smtpClient.create.password.description",
                      placeholder:
                        "app.api.v1.core.emails.smtpClient.create.password.placeholder",
                    }}
                    control={endpoint.create.form.control}
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
                  config={{
                    type: "email",
                    label:
                      "app.api.v1.core.emails.smtpClient.create.fromEmail.label",
                    description:
                      "app.api.v1.core.emails.smtpClient.create.fromEmail.description",
                    placeholder:
                      "app.api.v1.core.emails.smtpClient.create.fromEmail.placeholder",
                  }}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "asterisk",
                    showAllRequired: true,
                    requiredColor: "red",
                  }}
                />
              </FormFieldGroup>

              {/* Form Alert for errors and success */}
              <FormAlert alert={endpoint.alert} />

              {/* Submit Button */}
              <Div className="flex justify-end space-x-2">
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
