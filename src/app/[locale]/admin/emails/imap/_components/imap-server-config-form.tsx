/**
 * IMAP Server Configuration Form Component
 * Form component for configuring IMAP server settings
 */

"use client";

import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import type { Control } from "react-hook-form";

import type { ImapConfigPostRequestOutput } from "@/app/api/[locale]/v1/core/emails/imap-client/config/definition";

interface ImapServerConfigFormProps {
  control: Control<ImapConfigPostRequestOutput>;
}

/**
 * IMAP Server Configuration Form Component
 */
export function ImapServerConfigForm({
  control,
}: ImapServerConfigFormProps): JSX.Element {
  return (
    <Div className="space-y-4">
      <EndpointFormField
        name="serverEnabled"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.server.enabled",
        }}
        control={control}
      />

      <EndpointFormField
        name="maxConnections"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.maxConnections",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="connectionTimeout"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.connectionTimeout",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="poolIdleTimeout"
        config={{
          type: "number",
          label: "app.admin.emails.imap.config.server.poolIdleTimeout",
          placeholder: undefined,
        }}
        control={control}
      />

      <EndpointFormField
        name="keepAlive"
        config={{
          type: "switch",
          label: "app.admin.emails.imap.config.server.keepAlive",
        }}
        control={control}
      />
    </Div>
  );
}
