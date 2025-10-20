/**
 * IMAP Account Create Form Component
 * Handles creation of new IMAP accounts with proper type safety
 */

"use client";

import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { FormEvent, JSX } from "react";

import { useImapAccountCreateEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/create/hooks";
import { ImapAuthMethod } from "@/app/api/[locale]/v1/core/emails/imap-client/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { useTranslation } from "@/i18n/core/client";

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
  const endpoint = useImapAccountCreateEndpoint();

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    await endpoint.create.submitForm(e);
    if (endpoint.create.response?.success) {
      onSuccess();
    }
  };
  return (
    <Form
      form={endpoint.create.form}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <EndpointFormField
            name="name"
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
            name="email"
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
            name="host"
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
            name="port"
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
        </div>

        {/* Authentication */}
        <div className="space-y-4">
          <EndpointFormField
            name="username"
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
            name="password"
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
            name="authMethod"
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
            name="secure"
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
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("app.admin.emails.imap.account.sections.advanced")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EndpointFormField
            name="connectionTimeout"
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
            name="syncInterval"
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
            name="maxMessages"
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
        </div>

        <EndpointFormField
          name="enabled"
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
          name="keepAlive"
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
      </div>
      <FormAlert alert={endpoint.alert} />

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("app.admin.emails.imap.common.cancel")}
        </Button>
        <Button type="submit" disabled={endpoint.create?.isSubmitting}>
          {endpoint.create?.isSubmitting
            ? t("app.admin.emails.imap.common.saving")
            : t("app.admin.emails.imap.account.create")}
        </Button>
      </div>
    </Form>
  );
}
