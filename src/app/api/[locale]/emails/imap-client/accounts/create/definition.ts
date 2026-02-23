/**
 * IMAP Account Create API Route Definition
 * Defines endpoint for creating new IMAP accounts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  ImapAuthMethod,
  ImapAuthMethodOptions,
  ImapSpecialUseType,
  ImapSyncStatus,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { ImapAccountCreateContainer } from "./widget";

/**
 * Create IMAP Account Endpoint (POST)
 * Creates a new IMAP account
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["emails", "imap-client", "accounts", "create"],
  title: "title",
  description: "description",
  category: "category",
  tags: ["tags.create"],
  icon: "inbox",
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapAccountCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === BASIC ACCOUNT INFO ===
      basicInfo: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          name: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "name.label",
            description: "name.description",
            placeholder: "name.placeholder",
            columns: 12,
            schema: z.string().min(1).max(255),
          }),

          email: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "email.label",
            description: "email.description",
            placeholder: "email.placeholder",
            columns: 12,
            schema: z.email(),
          }),
        },
      }),

      // === SERVER CONNECTION ===
      serverConnection: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          host: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "host.label",
            description: "host.description",
            placeholder: "host.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          port: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "port.label",
            description: "port.description",
            placeholder: "port.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1).max(65535),
          }),

          secure: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "secure.label",
            description: "secure.description",
            columns: 12,
            schema: z.boolean().default(true),
          }),
        },
      }),

      // === AUTHENTICATION ===
      authentication: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          username: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "username.label",
            description: "username.description",
            placeholder: "username.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          password: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label: "password.label",
            description: "password.description",
            placeholder: "password.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          authMethod: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "authMethod.label",
            description: "authMethod.description",
            placeholder: "authMethod.placeholder",
            columns: 12,
            options: ImapAuthMethodOptions,
            schema: z.enum(ImapAuthMethod),
          }),
        },
      }),

      // === SYNC CONFIGURATION ===
      syncConfiguration: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.syncConfiguration.title",
        description: "response.syncConfiguration.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          enabled: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "enabled.label",
            description: "enabled.description",
            columns: 12,
            schema: z.boolean().default(true),
          }),

          syncInterval: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "syncInterval.label",
            description: "syncInterval.description",
            placeholder: "syncInterval.placeholder",
            columns: 12,
            schema: z.coerce.number().min(10).default(60),
          }),

          maxMessages: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "maxMessages.label",
            description: "maxMessages.description",
            placeholder: "maxMessages.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1).default(1000),
          }),

          syncFolders: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label: "syncFolders.label",
            description: "syncFolders.description",
            placeholder: "syncFolders.placeholder",
            columns: 12,
            schema: z.array(z.string()).default([]).optional(),
          }),
        },
      }),

      // === ADVANCED SETTINGS ===
      advancedSettings: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "container.title",
        description: "container.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          connectionTimeout: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "connectionTimeout.label",
            description: "connectionTimeout.description",
            placeholder: "connectionTimeout.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1000).default(30000).optional(),
          }),

          keepAlive: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "keepAlive.label",
            description: "keepAlive.description",
            columns: 12,
            schema: z.boolean().default(true).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      account: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.title",
        description: "response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          // === ACCOUNT SUMMARY ===
          accountSummary: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.accountSummary.title",
            description: "response.accountSummary.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              id: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.id.title",
                schema: z.uuid(),
              }),
              name: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.name.title",
                schema: z.string(),
              }),
              email: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.email.title",
                schema: z.email(),
              }),
              connectionStatus: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.isConnected",
                schema: z.boolean(),
              }),
            },
          }),

          // === CONNECTION DETAILS ===
          connectionDetails: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.connectionDetails.title",
            description: "response.connectionDetails.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              host: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.host.title",
                schema: z.string(),
              }),
              port: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.port.title",
                schema: z.coerce.number(),
              }),
              secure: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.secure.title",
                schema: z.boolean(),
              }),
              username: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.username.title",
                schema: z.string(),
              }),
              authMethod: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.authMethod.title",
                schema: z.enum(ImapAuthMethod),
              }),
              connectionTimeout: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.connectionTimeout.title",
                schema: z.coerce.number(),
              }),
            },
          }),

          // === SYNC CONFIGURATION ===
          syncConfiguration: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.syncConfiguration.title",
            description: "response.syncConfiguration.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              enabled: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.enabled.title",
                schema: z.boolean(),
              }),
              syncStatus: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.syncStatus.title",
                schema: z.enum(ImapSyncStatus),
              }),
              syncInterval: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.syncInterval.title",
                schema: z.coerce.number(),
              }),
              maxMessages: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.maxMessages.title",
                schema: z.coerce.number(),
              }),
              syncFolders: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.syncFolders.title",
                schema: z.array(z.string()),
              }),
              lastSyncAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.lastSyncAt",
                schema: z.string().nullable(),
              }),
            },
          }),

          // === METADATA ===
          metadata: scopedObjectFieldNew(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "response.title",
            description: "response.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              keepAlive: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "response.keepAlive.title",
                schema: z.boolean(),
              }),
              syncError: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.syncError",
                schema: z.string().nullable(),
              }),
              createdAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.createdAt",
                schema: z.string(),
              }),
              updatedAt: scopedResponseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.updatedAt",
                schema: z.string(),
              }),
            },
          }),
        },
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
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
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
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
        basicInfo: {
          name: "Gmail Account",
          email: "user@gmail.com",
        },
        serverConnection: {
          host: "imap.gmail.com",
          port: 993,
          secure: true,
        },
        authentication: {
          username: "user@gmail.com",
          password: "app-password",
          authMethod: ImapAuthMethod.PLAIN,
        },
        syncConfiguration: {
          enabled: true,
          syncInterval: 60,
          maxMessages: 1000,
          syncFolders: [],
        },
        advancedSettings: {
          connectionTimeout: 30000,
          keepAlive: true,
        },
      },
      withCustomSettings: {
        basicInfo: {
          name: "Corporate Email",
          email: "john@company.com",
        },
        serverConnection: {
          host: "mail.company.com",
          port: 993,
          secure: true,
        },
        authentication: {
          username: "john@company.com",
          password: "secure-password",
          authMethod: ImapAuthMethod.PLAIN,
        },
        syncConfiguration: {
          enabled: true,
          syncInterval: 300,
          maxMessages: 5000,
          syncFolders: ["INBOX", "Sent", "Important"],
        },
        advancedSettings: {
          connectionTimeout: 60000,
          keepAlive: true,
        },
      },
    },
    responses: {
      default: {
        account: {
          accountSummary: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Gmail Account",
            email: "user@gmail.com",
            connectionStatus: true,
          },
          connectionDetails: {
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            username: "user@gmail.com",
            authMethod: ImapAuthMethod.PLAIN,
            connectionTimeout: 30000,
          },
          syncConfiguration: {
            enabled: true,
            syncStatus: ImapSyncStatus.SYNCED,
            syncInterval: 60,
            maxMessages: 1000,
            syncFolders: [ImapSpecialUseType.INBOX, ImapSpecialUseType.SENT],
            lastSyncAt: "2024-01-07T15:30:00.000Z",
          },
          metadata: {
            keepAlive: true,
            syncError: null,
            createdAt: "2024-01-07T14:00:00.000Z",
            updatedAt: "2024-01-07T15:30:00.000Z",
          },
        },
      },
      withCustomSettings: {
        account: {
          accountSummary: {
            id: "456e7890-e89b-12d3-a456-426614174001",
            name: "Corporate Email",
            email: "john@company.com",
            connectionStatus: true,
          },
          connectionDetails: {
            host: "mail.company.com",
            port: 993,
            secure: true,
            username: "john@company.com",
            authMethod: ImapAuthMethod.PLAIN,
            connectionTimeout: 60000,
          },
          syncConfiguration: {
            enabled: true,
            syncStatus: ImapSyncStatus.SYNCED,
            syncInterval: 300,
            maxMessages: 5000,
            syncFolders: ["INBOX", "Sent", "Important"],
            lastSyncAt: null,
          },
          metadata: {
            keepAlive: true,
            syncError: null,
            createdAt: "2024-01-07T14:00:00.000Z",
            updatedAt: "2024-01-07T14:00:00.000Z",
          },
        },
      },
    },
  },
});

// Export types following migration guide pattern
export type ImapAccountCreatePostRequestInput = typeof POST.types.RequestInput;
export type ImapAccountCreatePostRequestOutput =
  typeof POST.types.RequestOutput;
export type ImapAccountCreatePostResponseInput =
  typeof POST.types.ResponseInput;
export type ImapAccountCreatePostResponseOutput =
  typeof POST.types.ResponseOutput;

// Repository types for standardized import patterns
export type ImapAccountCreateRequestInput = ImapAccountCreatePostRequestInput;
export type ImapAccountCreateRequestOutput = ImapAccountCreatePostRequestOutput;
export type ImapAccountCreateResponseInput = ImapAccountCreatePostResponseInput;
export type ImapAccountCreateResponseOutput =
  ImapAccountCreatePostResponseOutput;

// Export individual endpoints

const definitions = {
  POST,
} as const;
export default definitions;
