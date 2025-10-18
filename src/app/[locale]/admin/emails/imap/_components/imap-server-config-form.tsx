/**
 * IMAP Server Configuration Form Component
 * Form component for configuring IMAP server settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX } from "react";

import imapConfigDefinition from "@/app/api/[locale]/v1/core/emails/imap-client/config/definition";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

/**
 * IMAP Server Configuration Form Component
 */
export function ImapServerConfigForm(): JSX.Element {
  const configEndpoint = useEndpoint(imapConfigDefinition, {
    queryOptions: {
      enabled: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    formOptions: {
      persistForm: false,
      persistenceKey: "imap-config-form",
    },
  });

  return (
    <div className="space-y-4">
      <EndpointFormField
        name="serverEnabled"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.server.enabled",
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="maxConnections"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.maxConnections",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="connectionTimeout"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.connectionTimeout",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="poolIdleTimeout"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.poolIdleTimeout",
          placeholder: undefined,
        }}
        control={configEndpoint.create.form.control}
      />

      <EndpointFormField
        name="keepAlive"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.server.keepAlive",
        }}
        control={configEndpoint.create.form.control}
      />
    </div>
  );
}
