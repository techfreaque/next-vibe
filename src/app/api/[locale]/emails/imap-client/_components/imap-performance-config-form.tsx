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
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.performance.cacheEnabled",
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="cacheTtl"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.cacheTtl",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="cacheMaxSize"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.cacheMaxSize",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="memoryThreshold"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.memoryThreshold",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="maxRetries"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.resilience.maxRetries",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="retryDelay"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.resilience.retryDelay",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="circuitBreakerThreshold"
        config={{
          type: "number",
          label:
            "app.admin.emails.imap.config.resilience.circuitBreakerThreshold",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />

      <EndpointFormField
        name="circuitBreakerTimeout"
        config={{
          type: "number",
          label:
            "app.admin.emails.imap.config.resilience.circuitBreakerTimeout",
          placeholder: undefined,
        }}
        control={control}
        locale={locale}
      />
    </Div>
  );
}
