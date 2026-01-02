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
import syncConfigDefinitions from "@/app/api/[locale]/emails/imap-client/config/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapSyncConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
  locale: CountryLanguage;
}

/**
 * IMAP Sync Configuration Form Component
 */
export function ImapSyncConfigForm({ control, locale }: ImapSyncConfigFormProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <EndpointFormField
        name="syncEnabled"
        control={control}
        endpoint={syncConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="syncInterval"
        control={control}
        endpoint={syncConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="batchSize"
        control={control}
        endpoint={syncConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="maxMessages"
        control={control}
        endpoint={syncConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="concurrentAccounts"
        control={control}
        endpoint={syncConfigDefinitions.POST}
        locale={locale}
      />
    </Div>
  );
}
