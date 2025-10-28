/**
 * IMAP Sync API Route Definition
 * Defines endpoint for triggering IMAP synchronization
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Trigger IMAP Sync Endpoint (POST)
 * Triggers manual synchronization of IMAP accounts
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "imap-client", "sync"],
  title: "app.api.v1.core.emails.imapClient.sync.title",
  description: "app.api.v1.core.emails.imapClient.sync.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.imapClient.sync.container.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      accountIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.emails.imapClient.sync.accountIds.label",
          description:
            "app.api.v1.core.emails.imapClient.sync.accountIds.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.sync.accountIds.placeholder",
          layout: { columns: 12 },
        },
        z.array(z.uuid()).optional(),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.sync.force.label",
          description:
            "app.api.v1.core.emails.imapClient.sync.force.description",
          layout: { columns: 4 },
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.emails.imapClient.sync.dryRun.label",
          description:
            "app.api.v1.core.emails.imapClient.sync.dryRun.description",
          layout: { columns: 4 },
        },
        z.boolean().default(false),
      ),

      maxMessages: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.emails.imapClient.sync.maxMessages.label",
          description:
            "app.api.v1.core.emails.imapClient.sync.maxMessages.description",
          placeholder:
            "app.api.v1.core.emails.imapClient.sync.maxMessages.placeholder",
          layout: { columns: 4 },
        },
        z.number().min(1).max(10000).default(1000),
      ),

      // === RESPONSE FIELDS ===

      accountsProcessed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.accountsProcessed",
        },
        z.number(),
      ),
      foldersProcessed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.foldersProcessed",
        },
        z.number(),
      ),
      messagesProcessed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.messagesProcessed",
        },
        z.number(),
      ),
      messagesAdded: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.messagesAdded",
        },
        z.number(),
      ),
      messagesUpdated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.messagesUpdated",
        },
        z.number(),
      ),
      messagesDeleted: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.messagesDeleted",
        },
        z.number(),
      ),
      duration: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.imapClient.sync.post.response.result.duration",
        },
        z.number(),
      ),

      errors: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "code",
          sortBy: "message",
          showGroupSummary: false,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.emails.imapClient.sync.post.response.errors.error.title",
            description:
              "app.api.v1.core.emails.imapClient.sync.post.response.errors.error.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            code: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.emails.imapClient.sync.post.response.errors.error.code",
              },
              z.string(),
            ),
            message: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.emails.imapClient.sync.post.response.errors.error.message",
              },
              z.string(),
            ),
          },
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.emails.imapClient.sync.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.sync.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.sync.success.title",
    description: "app.api.v1.core.emails.imapClient.sync.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        accountIds: ["123e4567-e89b-12d3-a456-426614174000"],
        force: false,
        dryRun: false,
        maxMessages: 1000,
      },
    },
    responses: {
      default: {
        accountsProcessed: 1,
        foldersProcessed: 5,
        messagesProcessed: 150,
        messagesAdded: 25,
        messagesUpdated: 10,
        messagesDeleted: 5,
        duration: 15000,
        errors: [],
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapSyncPostRequestInput = typeof POST.types.RequestInput;
export type ImapSyncPostRequestOutput = typeof POST.types.RequestOutput;
export type ImapSyncPostResponseInput = typeof POST.types.ResponseInput;
export type ImapSyncPostResponseOutput = typeof POST.types.ResponseOutput;

// Export repository types for import standardization
export type ImapSyncRequestOutput = ImapSyncPostRequestOutput;
export type ImapSyncResponseOutput = ImapSyncPostResponseOutput;

// Additional type exports for repository compatibility
export type ImapSyncGetRequestOutput = typeof POST.types.RequestOutput;
export type ImapSyncGetResponseOutput = typeof POST.types.ResponseOutput;

const definitions = {
  POST,
};

export default definitions;
