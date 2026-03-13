/**
 * IMAP Sync API Route Definition
 * Defines endpoint for triggering IMAP synchronization
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { ImapSyncContainer } from "./widget";

/**
 * Trigger IMAP Sync Endpoint (POST)
 * Triggers manual synchronization of IMAP accounts
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "imap-client", "sync"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.messenger",
  icon: "refresh-cw",
  tags: ["category" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapSyncContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS ===
      accountIds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT_ARRAY,
        label: "accountIds.label",
        description: "accountIds.description",
        columns: 12,
        schema: z.array(z.string()),
      }),

      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "force.label",
        description: "force.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "dryRun.label",
        description: "dryRun.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      maxMessages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "maxMessages.label",
        description: "maxMessages.description",
        placeholder: "maxMessages.placeholder",
        columns: 4,
        schema: z.coerce.number().min(1).max(10000).default(1000),
      }),

      // === RESPONSE FIELDS ===

      accountsProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.accountsProcessed",
        schema: z.coerce.number(),
      }),
      foldersProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.foldersProcessed",
        schema: z.coerce.number(),
      }),
      messagesProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.messagesProcessed",
        schema: z.coerce.number(),
      }),
      messagesAdded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.messagesAdded",
        schema: z.coerce.number(),
      }),
      messagesUpdated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.messagesUpdated",
        schema: z.coerce.number(),
      }),
      messagesDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.messagesDeleted",
        schema: z.coerce.number(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.result.duration",
        schema: z.coerce.number(),
      }),

      errors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        groupBy: "code",
        sortBy: "message",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "post.response.errors.error.title",
          description: "post.response.errors.error.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            code: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "post.response.errors.error.code",
              schema: z.string(),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors.error.message",
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

const definitions = {
  POST,
};

export default definitions;
