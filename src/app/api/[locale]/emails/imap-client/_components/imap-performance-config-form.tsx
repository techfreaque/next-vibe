/**
 * IMAP Performance Configuration Form Component
 * Form component for configuring IMAP performance and resilience settings
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/emails/imap-client/config/definition";
import perfConfigDefinitions from "@/app/api/[locale]/emails/imap-client/config/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface ImapPerformanceConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
  locale: CountryLanguage;
}

/**
 * IMAP Performance Configuration Form Component
 */
export function ImapPerformanceConfigForm({
  control,
  locale,
}: ImapPerformanceConfigFormProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <EndpointFormField
        name="cacheEnabled"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="cacheTtl"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="cacheMaxSize"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="memoryThreshold"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="maxRetries"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="retryDelay"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="circuitBreakerThreshold"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />

      <EndpointFormField
        name="circuitBreakerTimeout"
        control={control}
        endpoint={perfConfigDefinitions.POST}
        locale={locale}
      />
    </Div>
  );
}
