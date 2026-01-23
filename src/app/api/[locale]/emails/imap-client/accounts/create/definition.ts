/**
 * IMAP Account Create API Route Definition
 * Defines endpoint for creating new IMAP accounts
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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
  path: ["emails", "imap-client", "accounts", "create"],
  title: "app.api.emails.imapClient.accounts.create.title",
  description: "app.api.emails.imapClient.accounts.create.description",
  category: "app.api.emails.category",
  tags: ["app.api.emails.imapClient.accounts.tag"],
  icon: "inbox",
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.accounts.create.container.title",
      description:
        "app.api.emails.imapClient.accounts.create.container.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === BASIC ACCOUNT INFO ===
      basicInfo: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.emails.imapClient.accounts.create.container.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          name: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.emails.imapClient.accounts.create.name.label",
            description:
              "app.api.emails.imapClient.accounts.create.name.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.name.placeholder",
            columns: 12,
            schema: z.string().min(1).max(255),
          }),

          email: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "app.api.emails.imapClient.accounts.create.email.label",
            description:
              "app.api.emails.imapClient.accounts.create.email.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.email.placeholder",
            columns: 12,
            schema: z.email(),
          }),
        },
      ),

      // === SERVER CONNECTION ===
      serverConnection: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.emails.imapClient.accounts.create.container.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          host: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.emails.imapClient.accounts.create.host.label",
            description:
              "app.api.emails.imapClient.accounts.create.host.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.host.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          port: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.emails.imapClient.accounts.create.port.label",
            description:
              "app.api.emails.imapClient.accounts.create.port.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.port.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1).max(65535),
          }),

          secure: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.emails.imapClient.accounts.create.secure.label",
            description:
              "app.api.emails.imapClient.accounts.create.secure.description",
            columns: 12,
            schema: z.boolean().default(true),
          }),
        },
      ),

      // === AUTHENTICATION ===
      authentication: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.emails.imapClient.accounts.create.container.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          username: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.emails.imapClient.accounts.create.username.label",
            description:
              "app.api.emails.imapClient.accounts.create.username.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.username.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          password: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.PASSWORD,
            label: "app.api.emails.imapClient.accounts.create.password.label",
            description:
              "app.api.emails.imapClient.accounts.create.password.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.password.placeholder",
            columns: 12,
            schema: z.string().min(1),
          }),

          authMethod: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.emails.imapClient.accounts.create.authMethod.label",
            description:
              "app.api.emails.imapClient.accounts.create.authMethod.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.authMethod.placeholder",
            columns: 12,
            options: ImapAuthMethodOptions,
            schema: z.enum(ImapAuthMethod),
          }),
        },
      ),

      // === SYNC CONFIGURATION ===
      syncConfiguration: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.imapClient.accounts.create.response.syncConfiguration.title",
          description:
            "app.api.emails.imapClient.accounts.create.response.syncConfiguration.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          enabled: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.emails.imapClient.accounts.create.enabled.label",
            description:
              "app.api.emails.imapClient.accounts.create.enabled.description",
            columns: 12,
            schema: z.boolean().default(true).optional(),
          }),

          syncInterval: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label:
              "app.api.emails.imapClient.accounts.create.syncInterval.label",
            description:
              "app.api.emails.imapClient.accounts.create.syncInterval.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.syncInterval.placeholder",
            columns: 12,
            schema: z.coerce.number().min(10).default(60).optional(),
          }),

          maxMessages: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label:
              "app.api.emails.imapClient.accounts.create.maxMessages.label",
            description:
              "app.api.emails.imapClient.accounts.create.maxMessages.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.maxMessages.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1).default(1000).optional(),
          }),

          syncFolders: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label:
              "app.api.emails.imapClient.accounts.create.syncFolders.label",
            description:
              "app.api.emails.imapClient.accounts.create.syncFolders.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.syncFolders.placeholder",
            columns: 12,
            schema: z.array(z.string()).default([]).optional(),
          }),
        },
      ),

      // === ADVANCED SETTINGS ===
      advancedSettings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.create.container.title",
          description:
            "app.api.emails.imapClient.accounts.create.container.description",
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          connectionTimeout: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label:
              "app.api.emails.imapClient.accounts.create.connectionTimeout.label",
            description:
              "app.api.emails.imapClient.accounts.create.connectionTimeout.description",
            placeholder:
              "app.api.emails.imapClient.accounts.create.connectionTimeout.placeholder",
            columns: 12,
            schema: z.coerce.number().min(1000).default(30000).optional(),
          }),

          keepAlive: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.emails.imapClient.accounts.create.keepAlive.label",
            description:
              "app.api.emails.imapClient.accounts.create.keepAlive.description",
            columns: 12,
            schema: z.boolean().default(true).optional(),
          }),
        },
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.create.response.title",
          description:
            "app.api.emails.imapClient.accounts.create.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          // === ACCOUNT SUMMARY ===
          accountSummary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.imapClient.accounts.create.response.accountSummary.title",
              description:
                "app.api.emails.imapClient.accounts.create.response.accountSummary.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              id: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.id.title",
                schema: z.uuid(),
              }),
              name: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.name.title",
                schema: z.string(),
              }),
              email: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.email.title",
                schema: z.email(),
              }),
              connectionStatus: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.isConnected",
                schema: z.boolean(),
              }),
            },
          ),

          // === CONNECTION DETAILS ===
          connectionDetails: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.imapClient.accounts.create.response.connectionDetails.title",
              description:
                "app.api.emails.imapClient.accounts.create.response.connectionDetails.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              host: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.host.title",
                schema: z.string(),
              }),
              port: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.port.title",
                schema: z.coerce.number(),
              }),
              secure: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.secure.title",
                schema: z.boolean(),
              }),
              username: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.username.title",
                schema: z.string(),
              }),
              authMethod: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.authMethod.title",
                schema: z.enum(ImapAuthMethod),
              }),
              connectionTimeout: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.connectionTimeout.title",
                schema: z.coerce.number(),
              }),
            },
          ),

          // === SYNC CONFIGURATION ===
          syncConfiguration: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.emails.imapClient.accounts.create.response.syncConfiguration.title",
              description:
                "app.api.emails.imapClient.accounts.create.response.syncConfiguration.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              enabled: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.enabled.title",
                schema: z.boolean(),
              }),
              syncStatus: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.syncStatus.title",
                schema: z.enum(ImapSyncStatus),
              }),
              syncInterval: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.syncInterval.title",
                schema: z.coerce.number(),
              }),
              maxMessages: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.maxMessages.title",
                schema: z.coerce.number(),
              }),
              syncFolders: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.syncFolders.title",
                schema: z.array(z.string()),
              }),
              lastSyncAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.lastSyncAt",
                schema: z.string().nullable(),
              }),
            },
          ),

          // === METADATA ===
          metadata: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.emails.imapClient.accounts.create.response.title",
              description:
                "app.api.emails.imapClient.accounts.create.response.description",
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              keepAlive: responseField({
                type: WidgetType.BADGE,
                text: "app.api.emails.imapClient.accounts.create.response.keepAlive.title",
                schema: z.boolean(),
              }),
              syncError: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.syncError",
                schema: z.string().nullable(),
              }),
              createdAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.createdAt",
                schema: z.string(),
              }),
              updatedAt: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.emails.imapClient.accounts.create.response.updatedAt",
                schema: z.string(),
              }),
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
        "app.api.emails.imapClient.accounts.create.errors.validation.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.accounts.create.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.unauthorized.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.accounts.create.errors.conflict.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.accounts.create.errors.server.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.accounts.create.errors.unknown.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.accounts.create.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.accounts.create.errors.network.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.accounts.create.errors.notFound.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.accounts.create.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.accounts.create.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.emails.imapClient.accounts.create.success.title",
    description:
      "app.api.emails.imapClient.accounts.create.success.description",
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
          host: "app.api.emails.imapClient.imap.gmail.com",
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
            host: "app.api.emails.imapClient.imap.gmail.com",
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
