/**
 * IMAP Message Sync API Route Definition
 * Defines endpoint for syncing IMAP messages
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
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

import { UserRole } from "../../../../user/user-roles/enum";
import { ImapMessagesSyncContainer } from "./widget";

/**
 * Sync IMAP Messages Endpoint (POST)
 * Syncs messages for an IMAP account or specific folder
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "sync"],
  title: "app.api.emails.imapClient.messages.sync.title",
  description: "app.api.emails.imapClient.messages.sync.description",
  category: "app.api.emails.category",
  icon: "message-square",
  tags: ["app.api.emails.imapClient.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapMessagesSyncContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === REQUEST FIELDS ===
      accountId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.sync.accountId.label",
        description:
          "app.api.emails.imapClient.messages.sync.accountId.description",
        placeholder:
          "app.api.emails.imapClient.messages.sync.accountId.placeholder",
        columns: 12,
        schema: z.uuid(),
      }),

      folderId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.imapClient.messages.sync.folderId.label",
        description:
          "app.api.emails.imapClient.messages.sync.folderId.description",
        placeholder:
          "app.api.emails.imapClient.messages.sync.folderId.placeholder",
        columns: 12,
        schema: z.uuid().optional(),
      }),

      force: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.imapClient.messages.sync.force.label",
        description:
          "app.api.emails.imapClient.messages.sync.force.description",
        columns: 12,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.BADGE,
        text: "app.api.emails.imapClient.messages.sync.response.success",
        schema: z.boolean(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.imapClient.messages.sync.response.message",
        schema: z.string(),
      }),

      results: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.imapClient.messages.sync.response.results.title",
          description:
            "app.api.emails.imapClient.messages.sync.response.results.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          messagesProcessed: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.messages.sync.response.results.messagesProcessed",
            schema: z.coerce.number(),
          }),
          messagesAdded: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.messages.sync.response.results.messagesAdded",
            schema: z.coerce.number(),
          }),
          messagesUpdated: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.messages.sync.response.results.messagesUpdated",
            schema: z.coerce.number(),
          }),
          messagesDeleted: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.messages.sync.response.results.messagesDeleted",
            schema: z.coerce.number(),
          }),
          duration: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.imapClient.messages.sync.response.results.duration",
            schema: z.coerce.number(),
          }),
        },
      ),

      errors: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.emails.imapClient.messages.sync.response.errors.error.title",
            description:
              "app.api.emails.imapClient.messages.sync.response.errors.error.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            code: responseField({
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.messages.sync.response.errors.error.code",
              schema: z.string(),
            }),
            message: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.messages.sync.response.errors.error.message",
              schema: z.string(),
            }),
          },
        ),
      ),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.imapClient.messages.sync.errors.validation.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.messages.sync.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.messages.sync.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.messages.sync.errors.server.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.messages.sync.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.messages.sync.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.messages.sync.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.messages.sync.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.imapClient.messages.sync.errors.unknown.title",
      description:
        "app.api.emails.imapClient.messages.sync.errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.imapClient.messages.sync.success.title",
    description: "app.api.emails.imapClient.messages.sync.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        accountId: "123e4567-e89b-12d3-a456-426614174000",
        folderId: "456e7890-e89b-12d3-a456-426614174001",
        force: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Messages synchronized successfully",
        results: {
          messagesProcessed: 150,
          messagesAdded: 25,
          messagesUpdated: 10,
          messagesDeleted: 5,
          duration: 15000,
        },
        errors: [],
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapMessageSyncPostRequestInput = typeof POST.types.RequestInput;
export type ImapMessageSyncPostRequestOutput = typeof POST.types.RequestOutput;
export type ImapMessageSyncPostResponseInput = typeof POST.types.ResponseInput;
export type ImapMessageSyncPostResponseOutput =
  typeof POST.types.ResponseOutput;

// Export repository types for import standardization
export type ImapMessageSyncRequestOutput = ImapMessageSyncPostRequestOutput;
export type ImapMessageSyncResponseOutput = ImapMessageSyncPostResponseOutput;

const definitions = {
  POST,
};

export default definitions;
