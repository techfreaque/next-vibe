/**
 * IMAP Account Test Connection API Route Definition
 * Defines endpoint for testing IMAP account connections
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";

import { UserRole } from "../../../../user/user-roles/enum";
import { ImapAuthMethod, ImapConnectionStatus } from "../../enum";

/**
 * Test IMAP Account Connection Endpoint (POST)
 * Tests connection to an IMAP account
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "imap-client", "accounts", "test"],
  title: "app.api.v1.core.emails.imapClient.accounts.test.title",
  description: "app.api.v1.core.emails.imapClient.accounts.test.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.accounts.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.accounts.test.container.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      accountId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.emails.imapClient.accounts.test.accountId.label",
          description:
            "app.api.v1.core.emails.imapClient.accounts.test.accountId.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.accounts.test.accountId.placeholder",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.emails.imapClient.accounts.test.response.success",
        },
        z.boolean(),
      ),

      connectionStatus: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.v1.core.emails.imapClient.accounts.test.response.connectionStatus",
        },
        z.enum(ImapConnectionStatus),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.accounts.test.response.message",
        },
        z.string(),
      ),

      details: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.test.response.details.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.test.response.details.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          host: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.test.response.details.host",
            },
            z.string().optional(),
          ),
          port: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.test.response.details.port",
            },
            z.number().optional(),
          ),
          secure: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.imapClient.accounts.test.response.details.secure",
            },
            z.boolean().optional(),
          ),
          authMethod: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.v1.core.emails.imapClient.accounts.test.response.details.authMethod",
            },
            z.enum(ImapAuthMethod).optional(),
          ),
          responseTime: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.test.response.details.responseTime",
            },
            z.number().optional(),
          ),
          serverCapabilities: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.emails.imapClient.accounts.test.response.details.serverCapabilities",
            },
            z.array(z.string()).optional(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.network.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.notFound.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.conflict.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.test.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.emails.imapClient.accounts.test.success.title",
    description:
      "app.api.v1.core.emails.imapClient.accounts.test.success.description",
  },

  examples: {
    requests: {
      default: {
        accountId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        success: true,
        connectionStatus: ImapConnectionStatus.CONNECTED,
        message: "Connection test successful",
        details: {
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
          port: 993,
          secure: true,
          authMethod: ImapAuthMethod.PLAIN,
          responseTime: 250,
          serverCapabilities: ["IMAP4rev1", "STARTTLS", "AUTH=PLAIN"],
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapAccountTestPostRequestInput = typeof POST.types.RequestInput;
export type ImapAccountTestPostRequestOutput = typeof POST.types.RequestOutput;
export type ImapAccountTestPostResponseInput = typeof POST.types.ResponseInput;
export type ImapAccountTestPostResponseOutput =
  typeof POST.types.ResponseOutput;

// Export individual endpoints
export { POST };

const imapAccountTestEndpoints = {
  POST,
};

export default imapAccountTestEndpoints;
