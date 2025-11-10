/**
 * IMAP Account Edit Form Component
 * Handles editing of existing IMAP accounts with proper type safety
 */

"use client";

import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { H3 } from "next-vibe-ui/ui/typography";
import type { FormEvent, JSX } from "react";

import { useImapAccountByIdEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/accounts/[id]/hooks";
import { ImapAuthMethod } from "@/app/api/[locale]/v1/core/emails/imap-client/enum";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapAccountEditFormProps {
  accountId: string;
  locale: CountryLanguage;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * IMAP Account Edit Form Component
 * Uses useEndpoint for all form state management following leads/cron patterns
 */
export function ImapAccountEditForm({
  accountId,
  locale,
  onSuccess,
  onCancel,
}: ImapAccountEditFormProps): JSX.Element {
  const { t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useImapAccountByIdEndpoint(
    {
      accountId,
      enabled: true,
    },
    logger,
  );

  // Handle form submission
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await endpoint.create?.onSubmit?.(e);
    if (endpoint.create?.response?.success) {
      onSuccess();
    }
  };

  // Get the form from the endpoint
  const form = endpoint.create.form;
  const alert = endpoint.alert;

  if (endpoint.read?.isLoading) {
    return <Div>{t("app.admin.emails.imap.common.loading")}</Div>;
  }

  if (!form) {
    return <Div>{t("app.admin.emails.imap.common.loading")}</Div>;
  }

  return (
    <Form form={form} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormAlert alert={alert} />

      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Div className="flex flex-col gap-4">
          <EndpointFormField
            name="name"
            config={{
              type: "text",
              label: "app.admin.emails.imap.account.fields.name",
              placeholder: "app.admin.emails.imap.account.fields.name",
            }}
            control={form.control}
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
              placeholder: "app.admin.emails.imap.account.fields.email",
            }}
            control={form.control}
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
            control={form.control}
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
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>

        {/* Authentication */}
        <Div className="flex flex-col gap-4">
          <EndpointFormField
            name="username"
            config={{
              type: "text",
              label: "app.admin.emails.imap.account.fields.username",
              placeholder: "app.admin.emails.imap.account.fields.username",
            }}
            control={form.control}
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
              placeholder:
                "app.admin.emails.imap.account.placeholders.password_update",
            }}
            control={form.control}
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
                {
                  value: ImapAuthMethod.XOAUTH2,
                  label: "app.admin.emails.imap.auth.xoauth2",
                },
              ],
            }}
            control={form.control}
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
            control={form.control}
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
            name="connectionTimeout"
            config={{
              type: "number",
              label: "app.admin.emails.imap.account.fields.connectionTimeout",
              placeholder:
                "app.admin.emails.imap.account.fields.connectionTimeout",
            }}
            control={form.control}
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
            control={form.control}
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
            control={form.control}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>

        <EndpointFormField
          name="enabled"
          config={{
            type: "checkbox",
            label: "app.admin.emails.imap.account.fields.enabled",
          }}
          control={form.control}
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
          control={form.control}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />
      </Div>

      {/* Form Actions */}
      <Div className="flex items-center justify-end flex flex-row gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("app.admin.emails.imap.common.cancel")}
        </Button>
        <Button type="submit" disabled={endpoint.create?.isSubmitting}>
          {endpoint.create?.isSubmitting
            ? t("app.admin.emails.imap.common.saving")
            : t("app.admin.emails.imap.account.update")}
        </Button>
      </Div>
    </Form>
  );
}
