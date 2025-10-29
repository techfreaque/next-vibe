/**
 * IMAP Account Create API Route Definition
 * Defines endpoint for creating new IMAP accounts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  ImapAuthMethod,
  ImapAuthMethodOptions,
  ImapSpecialUseType,
  ImapSyncStatus,
} from "../../enum";

/**
 * Create IMAP Account Endpoint (POST)
 * Creates a new IMAP account
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "emails", "imap-client", "accounts", "create"],
  title: "app.api.v1.core.emails.imapClient.accounts.create.title",
  description: "app.api.v1.core.emails.imapClient.accounts.create.description",
  category: "app.api.v1.core.emails.category",
  tags: ["app.api.v1.core.emails.imapClient.accounts.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.container.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.container.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === BASIC ACCOUNT INFO ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.container.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          name: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.name.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.name.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.name.placeholder",
              layout: { columns: 12 },
              validation: { required: true, maxLength: 255 },
            },
            z.string().min(1).max(255),
          ),

          email: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.EMAIL,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.email.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.email.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.email.placeholder",
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.email(),
          ),
        },
      ),

      // === SERVER CONNECTION ===
      serverConnection: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.container.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          host: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.host.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.host.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.host.placeholder",
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          port: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.port.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.port.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.port.placeholder",
              layout: { columns: 12 },
              validation: { required: true, min: 1, max: 65535 },
            },
            z.number().min(1).max(65535),
          ),

          secure: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.secure.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.secure.description",
              layout: { columns: 12 },
            },
            z.boolean().default(true),
          ),
        },
      ),

      // === AUTHENTICATION ===
      authentication: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.container.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          username: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.username.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.username.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.username.placeholder",
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          password: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.PASSWORD,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.password.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.password.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.password.placeholder",
              layout: { columns: 12 },
              validation: { required: true },
            },
            z.string().min(1),
          ),

          authMethod: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.authMethod.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.authMethod.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.authMethod.placeholder",
              layout: { columns: 12 },
              options: ImapAuthMethodOptions,
              validation: { required: true },
            },
            z.enum(ImapAuthMethod),
          ),
        },
      ),

      // === SYNC CONFIGURATION ===
      syncConfiguration: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.response.syncConfiguration.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.response.syncConfiguration.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          enabled: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.enabled.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.enabled.description",
              layout: { columns: 12 },
            },
            z.boolean().default(true).optional(),
          ),

          syncInterval: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.syncInterval.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.syncInterval.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.syncInterval.placeholder",
              layout: { columns: 12 },
              validation: { min: 10 },
            },
            z.number().min(10).default(60).optional(),
          ),

          maxMessages: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.maxMessages.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.maxMessages.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.maxMessages.placeholder",
              layout: { columns: 12 },
              validation: { min: 1 },
            },
            z.number().min(1).default(1000).optional(),
          ),

          syncFolders: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.syncFolders.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.syncFolders.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.syncFolders.placeholder",
              layout: { columns: 12 },
            },
            z.array(z.string()).default([]).optional(),
          ),
        },
      ),

      // === ADVANCED SETTINGS ===
      advancedSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.container.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
        },
        { request: "data" },
        {
          connectionTimeout: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.connectionTimeout.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.connectionTimeout.description",
              placeholder:
                "app.api.v1.core.emails.imapClient.accounts.create.connectionTimeout.placeholder",
              layout: { columns: 12 },
              validation: { min: 1000 },
            },
            z.number().min(1000).default(30000).optional(),
          ),

          keepAlive: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.label",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.keepAlive.description",
              layout: { columns: 12 },
            },
            z.boolean().default(true).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.emails.imapClient.accounts.create.response.title",
          description:
            "app.api.v1.core.emails.imapClient.accounts.create.response.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          // === ACCOUNT SUMMARY ===
          accountSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.imapClient.accounts.create.response.accountSummary.title",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.response.accountSummary.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.id.title",
                },
                z.uuid(),
              ),
              name: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.name.title",
                },
                z.string(),
              ),
              email: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.email.title",
                },
                z.email(),
              ),
              connectionStatus: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.isConnected",
                },
                z.boolean(),
              ),
            },
          ),

          // === CONNECTION DETAILS ===
          connectionDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.imapClient.accounts.create.response.connectionDetails.title",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.response.connectionDetails.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              host: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.host.title",
                },
                z.string(),
              ),
              port: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.port.title",
                },
                z.number(),
              ),
              secure: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.secure.title",
                },
                z.boolean(),
              ),
              username: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.username.title",
                },
                z.string(),
              ),
              authMethod: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.authMethod.title",
                },
                z.enum(ImapAuthMethod),
              ),
              connectionTimeout: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.connectionTimeout.title",
                },
                z.number(),
              ),
            },
          ),

          // === SYNC CONFIGURATION ===
          syncConfiguration: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.imapClient.accounts.create.response.syncConfiguration.title",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.response.syncConfiguration.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              enabled: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.enabled.title",
                },
                z.boolean(),
              ),
              syncStatus: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.syncStatus.title",
                },
                z.enum(ImapSyncStatus),
              ),
              syncInterval: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.syncInterval.title",
                },
                z.number(),
              ),
              maxMessages: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.maxMessages.title",
                },
                z.number(),
              ),
              syncFolders: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.syncFolders.title",
                },
                z.array(z.string()),
              ),
              lastSyncAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.lastSyncAt",
                },
                z.string().nullable(),
              ),
            },
          ),

          // === METADATA ===
          metadata: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.emails.imapClient.accounts.create.response.title",
              description:
                "app.api.v1.core.emails.imapClient.accounts.create.response.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              keepAlive: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.v1.core.emails.imapClient.accounts.create.response.keepAlive.title",
                },
                z.boolean(),
              ),
              syncError: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.syncError",
                },
                z.string().nullable(),
              ),
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.createdAt",
                },
                z.string(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.emails.imapClient.accounts.create.response.updatedAt",
                },
                z.string(),
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.validation.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.conflict.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.server.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unknown.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.network.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.notFound.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.imapClient.accounts.create.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.emails.imapClient.accounts.create.success.title",
    description:
      "app.api.v1.core.emails.imapClient.accounts.create.success.description",
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
          host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
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
            host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
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
export { POST };

const definitions = {
  POST,
};

export default definitions;
