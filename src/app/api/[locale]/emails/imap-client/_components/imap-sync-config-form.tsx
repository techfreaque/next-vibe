/**
 * IMAP Sync Configuration Form Component
 * Form component for configuring IMAP synchronization settings
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/emails/imap-client/config/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapSyncConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
  locale: CountryLanguage;
}

/**
 * IMAP Sync Configuration Form Component
 */
export function ImapSyncConfigForm({
  control,
  locale,
}: ImapSyncConfigFormProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <EndpointFormField
        name="syncEnabled"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.sync.enabled",
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="syncInterval"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.interval",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="batchSize"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.batchSize",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="maxMessages"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.maxMessages",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="concurrentAccounts"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.concurrentAccounts",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />
    </Div>
  );
}
