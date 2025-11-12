/**
 * IMAP Performance Configuration Form Component
 * Form component for configuring IMAP performance and resilience settings
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/v1/core/emails/imap-client/config/definition";

interface ImapPerformanceConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
}

/**
 * IMAP Performance Configuration Form Component
 */
export function ImapPerformanceConfigForm({
  control,
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
      />

      <EndpointFormField
        name="cacheTtl"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.cacheTtl",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="cacheMaxSize"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.cacheMaxSize",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="memoryThreshold"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.performance.memoryThreshold",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="maxRetries"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.resilience.maxRetries",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="retryDelay"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.resilience.retryDelay",
          placeholder: undefined,
        }}
        control={control}
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
      />
    </Div>
  );
}
