/**
 * IMAP Server Configuration Form Component
 * Form component for configuring IMAP server settings
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/emails/imap-client/config/definition";
import serverConfigDefinitions from "@/app/api/[locale]/emails/imap-client/config/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapServerConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
  locale: CountryLanguage;
}

/**
 * IMAP Server Configuration Form Component
 */
export function ImapServerConfigForm({
  control,
  locale,
}: ImapServerConfigFormProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <EndpointFormField
        name="serverEnabled"
        control={control}
        endpoint={serverConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="maxConnections"
        control={control}
        endpoint={serverConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="connectionTimeout"
        control={control}
        endpoint={serverConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="poolIdleTimeout"
        control={control}
        endpoint={serverConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="keepAlive"
        control={control}
        endpoint={serverConfigDefinitions.POST}
        locale={locale}
      />
    </Div>
  );
}
