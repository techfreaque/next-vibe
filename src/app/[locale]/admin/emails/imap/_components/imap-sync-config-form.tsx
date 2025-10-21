/**
 * IMAP Sync Configuration Form Component
 * Form component for configuring IMAP synchronization settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import React from "react";
import type { JSX } from "react";

import { useImapConfig } from "@/app/api/[locale]/v1/core/emails/imap-client/config/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useLocale } from "@/i18n/core/client";

/**
 * IMAP Sync Configuration Form Component
 */
export function ImapSyncConfigForm(): JSX.Element {
  const locale = useLocale();
  const logger = React.useMemo(
    () => createEndpointLogger(true, Date.now(), locale),
    [locale],
  );
  const configEndpoint = useImapConfig(logger);

  return (
    <div className="space-y-4">
      <EndpointFormField
        name="syncEnabled"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.sync.enabled",
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="syncInterval"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.interval",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="batchSize"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.batchSize",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="maxMessages"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.maxMessages",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="concurrentAccounts"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.sync.concurrentAccounts",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />
    </div>
  );
}
