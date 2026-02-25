/**
 * IMAP Account Test Connection API Route Definition
 * Defines endpoint for testing IMAP account connections
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
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
import { ImapAuthMethod, ImapConnectionStatus } from "../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Test IMAP Account Connection Endpoint (POST)
 * Tests connection to an IMAP account
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "accounts", "test"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.email",
  tags: ["tags.accounts"],
  icon: "inbox",
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
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

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.success",
        schema: z.boolean(),
      }),

      connectionStatus: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "response.connectionStatus",
        schema: z.enum(ImapConnectionStatus),
      }),

      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.message",
        schema: z.string(),
      }),

      details: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.details.title",
        description: "response.details.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          host: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.details.host",
            schema: z.string().optional(),
          }),
          port: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.details.port",
            schema: z.coerce.number().optional(),
          }),
          secure: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.details.secure",
            schema: z.boolean().optional(),
          }),
          authMethod: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "response.details.authMethod",
            schema: z.enum(ImapAuthMethod).optional(),
          }),
          responseTime: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.details.responseTime",
            schema: z.coerce.number().optional(),
          }),
          serverCapabilities: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "response.details.serverCapabilities",
            schema: z.array(z.string()).optional(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
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
          host: "imap.gmail.com",
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

const imapAccountTestEndpoints = {
  POST,
} as const;
export default imapAccountTestEndpoints;
