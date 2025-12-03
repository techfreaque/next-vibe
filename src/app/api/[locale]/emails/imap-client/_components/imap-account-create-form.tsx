/**
 * IMAP Account Create Form Component
 * Handles creation of new IMAP accounts with proper type safety
 */

"use client";

import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { useImapAccountCreateEndpoint } from "@/app/api/[locale]/emails/imap-client/accounts/create/hooks";
import { ImapAuthMethod } from "@/app/api/[locale]/emails/imap-client/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapAccountCreateFormProps {
  locale: CountryLanguage;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * IMAP Account Create Form Component
 * Uses useEndpoint for all form state management following leads/cron patterns
 */
export function ImapAccountCreateForm({
  locale,
  onSuccess,
  onCancel,
}: ImapAccountCreateFormProps): JSX.Element {
  const { t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useImapAccountCreateEndpoint(logger);

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    await endpoint.create.onSubmit();
    if (endpoint.create.response?.success) {
      onSuccess();
    }
  };
  return (
    <Form
      form={endpoint.create.form}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Div className="flex flex-col gap-4">
          <EndpointFormField
            name="basicInfo.name"
            config={{
              type: "text",
              label: "app.admin.emails.imap.account.fields.name",
              placeholder: "app.admin.emails.imap.account.placeholders.name",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="basicInfo.email"
            config={{
              type: "email",
              label: "app.admin.emails.imap.account.fields.email",
              placeholder: "app.admin.emails.imap.account.placeholders.email",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="serverConnection.host"
            config={{
              type: "text",
              label: "app.admin.emails.imap.account.fields.host",
              placeholder: "app.admin.emails.imap.account.fields.host",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="serverConnection.port"
            config={{
              type: "number",
              label: "app.admin.emails.imap.account.fields.port",
              placeholder: "app.admin.emails.imap.account.fields.port",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>

        {/* Authentication */}
        <Div className="flex flex-col gap-4">
          <EndpointFormField
            name="authentication.username"
            config={{
              type: "text",
              label: "app.admin.emails.imap.account.fields.username",
              placeholder: "app.admin.emails.imap.account.fields.username",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="authentication.password"
            config={{
              type: "password",
              label: "app.admin.emails.imap.account.fields.password",
              placeholder: "app.admin.emails.imap.account.fields.password",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="authentication.authMethod"
            config={{
              type: "select",
              label: "app.admin.emails.imap.account.fields.authMethod",
              placeholder: "app.admin.emails.imap.account.fields.authMethod",
              options: [
                {
                  value: ImapAuthMethod.PLAIN,
                  label: "app.admin.emails.imap.auth.plain",
                },
                {
                  value: ImapAuthMethod.OAUTH2,
                  label: "app.admin.emails.imap.auth.oauth2",
                },
              ],
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="serverConnection.secure"
            config={{
              type: "checkbox",
              label: "app.admin.emails.imap.account.fields.secure",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>
      </Div>

      {/* Advanced Settings */}
      <Div className="flex flex-col gap-4">
        <H3 className="text-lg font-medium">
          {t("app.admin.emails.imap.account.sections.advanced")}
        </H3>

        <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EndpointFormField
            name="advancedSettings.connectionTimeout"
            config={{
              type: "number",
              label: "app.admin.emails.imap.account.fields.connectionTimeout",
              placeholder:
                "app.admin.emails.imap.account.fields.connectionTimeout",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="syncConfiguration.syncInterval"
            config={{
              type: "number",
              label: "app.admin.emails.imap.account.fields.syncInterval",
              placeholder: "app.admin.emails.imap.account.fields.syncInterval",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="syncConfiguration.maxMessages"
            config={{
              type: "number",
              label: "app.admin.emails.imap.account.fields.maxMessages",
              placeholder: "app.admin.emails.imap.account.fields.maxMessages",
            }}
            control={endpoint.create.form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>

        <EndpointFormField
          name="syncConfiguration.enabled"
          config={{
            type: "checkbox",
            label: "app.admin.emails.imap.account.fields.enabled",
          }}
          control={endpoint.create.form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="advancedSettings.keepAlive"
          config={{
            type: "checkbox",
            label: "app.admin.emails.imap.account.fields.keepAlive",
          }}
          control={endpoint.create.form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />
      </Div>
      <FormAlert alert={endpoint.alert} />

      {/* Form Actions */}
      <Div className="flex items-center justify-end flex flex-row gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("app.admin.emails.imap.common.cancel")}
        </Button>
        <Button type="submit" disabled={endpoint.create?.isSubmitting}>
          {endpoint.create?.isSubmitting
            ? t("app.admin.emails.imap.common.saving")
            : t("app.admin.emails.imap.account.create")}
        </Button>
      </Div>
    </Form>
  );
}
