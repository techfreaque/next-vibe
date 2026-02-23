/**
 * IMAP Message Sync API Route Definition
 * Defines endpoint for syncing IMAP messages
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../../user/user-roles/enum";
import { scopedTranslation } from "./i18n";
import { ImapMessagesSyncContainer } from "./widget";

/**
 * Sync IMAP Messages Endpoint (POST)
 * Syncs messages for an IMAP account or specific folder
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "messages", "sync"],
  title: "title",
  description: "description",
  category: "category",
  icon: "message-square",
  tags: ["category" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapMessagesSyncContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS ===
      accountId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        columns: 12,
        schema: z.uuid(),
      }),

      folderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "folderId.label",
        description: "folderId.description",
        placeholder: "folderId.placeholder",
        columns: 12,
        schema: z.uuid().optional(),
      }),

      force: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "force.label",
        description: "force.description",
        columns: 12,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.success",
        schema: z.boolean(),
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message",
        schema: z.string(),
      }),

      results: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.results.title",
        description: "response.results.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          messagesProcessed: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.results.messagesProcessed",
            schema: z.coerce.number(),
          }),
          messagesAdded: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.results.messagesAdded",
            schema: z.coerce.number(),
          }),
          messagesUpdated: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.results.messagesUpdated",
            schema: z.coerce.number(),
          }),
          messagesDeleted: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.results.messagesDeleted",
            schema: z.coerce.number(),
          }),
          duration: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.results.duration",
            schema: z.coerce.number(),
          }),
        },
      }),

      errors: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "response.errors.error.title",
          description: "response.errors.error.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            code: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.errors.error.code",
              schema: z.string(),
            }),
            message: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.errors.error.message",
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
