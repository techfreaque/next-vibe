/**
 * IMAP Sync Configuration Form Component
 * Form component for configuring IMAP synchronization settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/v1/core/emails/imap-client/config/definition";

interface ImapSyncConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
}

/**
 * IMAP Sync Configuration Form Component
 */
export function ImapSyncConfigForm({
  control,
}: ImapSyncConfigFormProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <EndpointFormField
        name="syncEnabled"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.sync.enabled",
        }}
        control={control}
      />

      <EndpointFormField
        name="syncInterval"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.interval",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="batchSize"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.batchSize",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="maxMessages"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.maxMessages",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="concurrentAccounts"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.concurrentAccounts",
          placeholder: undefined,
        }}
        control={control}
      />
    </div>
  );
}
