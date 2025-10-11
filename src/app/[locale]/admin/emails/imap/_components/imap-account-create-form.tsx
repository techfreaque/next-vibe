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
import { useTranslation } from "@/i18n/core/client";

interface ImapAccountCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * IMAP Account Create Form Component
 * Uses useEndpoint for all form state management following leads/cron patterns
 */
export function ImapAccountCreateForm({
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
              label: "imap.account.fields.name",
              placeholder: "imap.account.placeholders.name",
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
              label: "imap.account.fields.email",
              placeholder: "imap.account.placeholders.email",
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
              label: "imap.account.fields.host",
              placeholder: "imap.account.fields.host",
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
              label: "imap.account.fields.port",
              placeholder: "imap.account.fields.port",
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
              label: "imap.account.fields.username",
              placeholder: "imap.account.fields.username",
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
              label: "imap.account.fields.password",
              placeholder: "imap.account.fields.password",
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
              label: "imap.account.fields.authMethod",
              placeholder: "imap.account.fields.authMethod",
              options: [
                { value: ImapAuthMethod.PLAIN, label: "imap.auth.plain" },
                { value: ImapAuthMethod.OAUTH2, label: "imap.auth.oauth2" },
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
              label: "imap.account.fields.secure",
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
          {t("imap.account.sections.advanced")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EndpointFormField
            name="connectionTimeout"
            config={{
              type: "number",
              label: "imap.account.fields.connectionTimeout",
              placeholder: "imap.account.fields.connectionTimeout",
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
              label: "imap.account.fields.syncInterval",
              placeholder: "imap.account.fields.syncInterval",
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
              label: "imap.account.fields.maxMessages",
              placeholder: "imap.account.fields.maxMessages",
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
            label: "imap.account.fields.enabled",
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
            label: "imap.account.fields.keepAlive",
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
          {t("imap.common.cancel")}
        </Button>
        <Button type="submit" disabled={endpoint.create?.isSubmitting}>
          {endpoint.create?.isSubmitting
            ? t("imap.common.saving")
            : t("imap.account.create")}
        </Button>
      </div>
    </Form>
  );
}
