/**
 * IMAP Account Edit Form Component
 * Handles editing of existing IMAP accounts with proper type safety
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import imapAccountDefinitions from "@/app/api/[locale]/emails/imap-client/accounts/[id]/definition";
import { useImapAccountByIdEndpoint } from "@/app/api/[locale]/emails/imap-client/accounts/[id]/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
  const handleSubmit = async (): Promise<void> => {
    await endpoint.create.onSubmit();
    if (endpoint.create.response?.success) {
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
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="email"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="host"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="port"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
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
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="password"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="authMethod"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="secure"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
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
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="syncInterval"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />

          <EndpointFormField
            name="maxMessages"
            control={form.control}
            endpoint={imapAccountDefinitions.PUT}
            locale={locale}
            theme={{
              style: "none",
              showAllRequired: false,
            }}
          />
        </Div>

        <EndpointFormField
          name="enabled"
          control={form.control}
          endpoint={imapAccountDefinitions.PUT}
          locale={locale}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />

        <EndpointFormField
          name="keepAlive"
          control={form.control}
          endpoint={imapAccountDefinitions.PUT}
          locale={locale}
          theme={{
            style: "none",
            showAllRequired: false,
          }}
        />
      </Div>

      {/* Form Actions */}
      <Div className="flex items-center justify-end flex-row gap-4">
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
