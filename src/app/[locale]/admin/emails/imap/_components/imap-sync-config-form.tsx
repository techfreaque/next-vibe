/**
 * IMAP Sync Configuration Form Component
 * Form component for configuring IMAP synchronization settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";

import { useImapConfigEndpoint } from "@/app/api/[locale]/v1/core/emails/imap-client/config/hooks";

/**
 * IMAP Sync Configuration Form Component
 */
export function ImapSyncConfigForm(): JSX.Element {
  const configEndpoint = useImapConfigEndpoint();

  return (
    <div className="space-y-4">
      <EndpointFormField
        name="syncEnabled"
        config={{
          type: "switch",
          label: "imap.config.sync.enabled",
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="syncInterval"
        config={{
          type: "number",
          label: "imap.config.sync.interval",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="batchSize"
        config={{
          type: "number",
          label: "imap.config.sync.batchSize",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="maxMessages"
        config={{
          type: "number",
          label: "imap.config.sync.maxMessages",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="concurrentAccounts"
        config={{
          type: "number",
          label: "imap.config.sync.concurrentAccounts",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />
    </div>
  );
}
