/**
 * IMAP Performance Configuration Form Component
 * Form component for configuring IMAP performance and resilience settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";

import { useImapConfigEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/config/hooks";

/**
 * IMAP Performance Configuration Form Component
 */
export function ImapPerformanceConfigForm(): JSX.Element {
  const configEndpoint = useImapConfigEndpoint();

  return (
    <div className="space-y-4">
      <EndpointFormField
        name="cacheEnabled"
        config={{
          type: "switch",
          label: "imap.config.performance.cacheEnabled",
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="cacheTtl"
        config={{
          type: "number",
          label: "imap.config.performance.cacheTtl",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="cacheMaxSize"
        config={{
          type: "number",
          label: "imap.config.performance.cacheMaxSize",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="memoryThreshold"
        config={{
          type: "number",
          label: "imap.config.performance.memoryThreshold",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="maxRetries"
        config={{
          type: "number",
          label: "imap.config.resilience.maxRetries",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="retryDelay"
        config={{
          type: "number",
          label: "imap.config.resilience.retryDelay",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="circuitBreakerThreshold"
        config={{
          type: "number",
          label: "imap.config.resilience.circuitBreakerThreshold",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="circuitBreakerTimeout"
        config={{
          type: "number",
          label: "imap.config.resilience.circuitBreakerTimeout",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />
    </div>
  );
}
