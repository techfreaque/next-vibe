/**
 * IMAP Sync API Route Definition
 * Defines endpoint for triggering IMAP synchronization
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Trigger IMAP Sync Endpoint (POST)
 * Triggers manual synchronization of IMAP accounts
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "imap-client", "sync"],
  title: "app.api.emails.imapClient.sync.title",
  description: "app.api.emails.imapClient.sync.description",
  category: "app.api.emails.category",
  icon: "refresh-cw",
  tags: ["app.api.emails.imapClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.sync.container.title",
      description: "app.api.emails.imapClient.sync.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      accountIds: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.emails.imapClient.sync.accountIds.label",
        description: "app.api.emails.imapClient.sync.accountIds.description",
        placeholder: "app.api.emails.imapClient.sync.accountIds.placeholder",
        columns: 12,
        schema: z.array(z.uuid()).optional(),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.sync.force.label",
        description: "app.api.emails.imapClient.sync.force.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.sync.dryRun.label",
        description: "app.api.emails.imapClient.sync.dryRun.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      maxMessages: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.emails.imapClient.sync.maxMessages.label",
        description: "app.api.emails.imapClient.sync.maxMessages.description",
        placeholder: "app.api.emails.imapClient.sync.maxMessages.placeholder",
        columns: 4,
        schema: z.coerce.number().min(1).max(10000).default(1000),
      }),

      // === RESPONSE FIELDS ===

      accountsProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.accountsProcessed",
        schema: z.coerce.number(),
      }),
      foldersProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.foldersProcessed",
        schema: z.coerce.number(),
      }),
      messagesProcessed: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.messagesProcessed",
        schema: z.coerce.number(),
      }),
      messagesAdded: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.messagesAdded",
        schema: z.coerce.number(),
      }),
      messagesUpdated: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.messagesUpdated",
        schema: z.coerce.number(),
      }),
      messagesDeleted: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.imapClient.sync.post.response.result.messagesDeleted",
        schema: z.coerce.number(),
      }),
      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.sync.post.response.result.duration",
        schema: z.coerce.number(),
      }),

      errors: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          groupBy: "code",
          sortBy: "message",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.emails.imapClient.sync.post.response.errors.error.title",
            description:
              "app.api.emails.imapClient.sync.post.response.errors.error.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            code: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.sync.post.response.errors.error.code",
              schema: z.string(),
            }),
            message: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.sync.post.response.errors.error.message",
              schema: z.string(),
            }),
          },
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.imapClient.sync.errors.validation.title",
      description:
        "app.api.emails.imapClient.sync.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.imapClient.sync.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.sync.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.sync.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.sync.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.sync.errors.server.title",
      description: "app.api.emails.imapClient.sync.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.sync.errors.unknown.title",
      description: "app.api.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.sync.errors.unknown.title",
      description: "app.api.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.sync.errors.unknown.title",
      description: "app.api.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.sync.errors.unknown.title",
      description: "app.api.emails.imapClient.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.sync.errors.unknown.title",
      description: "app.api.emails.imapClient.sync.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.imapClient.sync.success.title",
    description: "app.api.emails.imapClient.sync.success.description",
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
