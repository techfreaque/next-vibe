/**
 * IMAP Account Individual API Route Definition
 * Defines endpoints for individual IMAP account operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
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

import {
  ImapAuthMethod,
  ImapAuthMethodOptions,
  ImapSpecialUseType,
} from "../../enum";

/**
 * Get IMAP Account Endpoint (GET)
 * Retrieves a specific IMAP account by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "app.api.emails.imapClient.accounts.id.get.title",
  description: "app.api.emails.imapClient.accounts.id.get.description",
  category: "app.api.emails.category",
  icon: "inbox",
  tags: ["app.api.emails.imapClient.tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.accounts.id.get.container.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.accounts.id.get.id.label",
          description:
            "app.api.emails.imapClient.accounts.id.get.id.description",
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.emails.imapClient.accounts.id.get.response.account.title",
          description:
            "app.api.emails.imapClient.accounts.id.get.response.account.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.id",
            },
            z.uuid(),
          ),
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.name",
            },
            z.string(),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.email",
            },
            z.email(),
          ),
          host: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.host",
            },
            z.string(),
          ),
          port: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.port",
            },
            z.coerce.number().int(),
          ),
          secure: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.get.response.account.secure",
            },
            z.boolean(),
          ),
          username: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.username",
            },
            z.string(),
          ),
          authMethod: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.get.response.account.authMethod",
            },
            z.enum(ImapAuthMethod),
          ),
          connectionTimeout: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.connectionTimeout",
            },
            z.coerce.number().int(),
          ),
          keepAlive: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.get.response.account.keepAlive",
            },
            z.boolean(),
          ),
          enabled: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.get.response.account.enabled",
            },
            z.boolean(),
          ),
          syncInterval: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.syncInterval",
            },
            z.coerce.number().int(),
          ),
          maxMessages: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.maxMessages",
            },
            z.coerce.number().int(),
          ),
          syncFolders: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.syncFolders",
            },
            z.array(z.string()),
          ),
          lastSyncAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.lastSyncAt",
            },
            z.string().nullable(),
          ),
          syncStatus: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.get.response.account.syncStatus",
            },
            z.string(),
          ),
          syncError: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.syncError",
            },
            z.string().nullable(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.createdAt",
            },
            z.string(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.get.response.account.updatedAt",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.accounts.id.get.errors.validation.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.accounts.id.get.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.notFound.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.server.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.unknown.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.network.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.accounts.id.get.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.accounts.id.get.errors.conflict.title",
      description:
        "app.api.emails.imapClient.accounts.id.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.accounts.id.get.success.title",
    description:
      "app.api.emails.imapClient.accounts.id.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        account: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Primary IMAP Account",
          email: "user@example.com",
          host: "app.api.emails.imapClient.imap.example.com",
          port: 993,
          secure: true,
          username: "user@example.com",
          authMethod: ImapAuthMethod.PLAIN,
          connectionTimeout: 30000,
          keepAlive: true,
          enabled: true,
          syncInterval: 300,
          maxMessages: 1000,
          syncFolders: [
            ImapSpecialUseType.INBOX,
            ImapSpecialUseType.SENT,
            ImapSpecialUseType.DRAFTS,
          ],
          lastSyncAt: "2023-12-01T10:32:15Z",
          syncStatus: "CONNECTED",
          syncError: null,
          createdAt: "2023-11-01T08:15:30Z",
          updatedAt: "2023-12-01T10:32:15Z",
        },
      },
    },
  },
});

/**
 * Update IMAP Account Endpoint (PUT)
 * Updates an existing IMAP account
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "app.api.emails.imapClient.accounts.id.post.title",
  description: "app.api.emails.imapClient.accounts.id.post.description",
  category: "app.api.emails.category",
  icon: "inbox",
  tags: ["app.api.emails.imapClient.tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.accounts.id.post.form.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.accounts.id.get.id.label",
          description:
            "app.api.emails.imapClient.accounts.id.get.id.description",
        },
        z.uuid(),
      ),

      // === REQUEST DATA FIELDS ===
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.accounts.id.post.form.name.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.name.description",
        },
        z.string().min(1).max(255),
      ),

      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.emails.imapClient.accounts.id.post.form.email.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.email.description",
        },
        z.email(),
      ),

      host: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.accounts.id.post.form.host.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.host.description",
        },
        z.string().min(1),
      ),

      port: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.emails.imapClient.accounts.id.post.form.port.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.port.description",
        },
        z.coerce.number().int().min(1).max(65535),
      ),

      secure: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.emails.imapClient.accounts.id.post.form.secure.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.secure.description",
        },
        z.boolean(),
      ),

      username: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.username.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.username.description",
        },
        z.string().min(1),
      ),

      password: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PASSWORD,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.password.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.password.description",
        },
        z.string().min(1),
      ),

      authMethod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.authMethod.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.authMethod.description",
          placeholder:
            "app.api.emails.imapClient.accounts.id.post.form.authMethod.label",
          options: ImapAuthMethodOptions,
          columns: 6,
        },
        z.enum(ImapAuthMethod),
      ),

      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.enabled.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.enabled.description",
        },
        z.boolean().optional(),
      ),

      connectionTimeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.connectionTimeout.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.connectionTimeout.description",
        },
        z.coerce.number().min(1000).optional(),
      ),

      keepAlive: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.keepAlive.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.keepAlive.description",
        },
        z.boolean().optional(),
      ),

      syncInterval: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.syncInterval.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.syncInterval.description",
        },
        z.coerce.number().min(10).optional(),
      ),

      maxMessages: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.maxMessages.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.maxMessages.description",
        },
        z.coerce.number().min(1).optional(),
      ),

      syncFolders: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.emails.imapClient.accounts.id.post.form.syncFolders.label",
          description:
            "app.api.emails.imapClient.accounts.id.post.form.syncFolders.description",
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE FIELDS ===
      account: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.imapClient.accounts.id.post.response.title",
          description:
            "app.api.emails.imapClient.accounts.id.post.response.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.id",
            },
            z.uuid(),
          ),
          name: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.name",
            },
            z.string(),
          ),
          email: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.email",
            },
            z.email(),
          ),
          host: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.host",
            },
            z.string(),
          ),
          port: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.port",
            },
            z.coerce.number().int(),
          ),
          secure: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.post.response.account.secure",
            },
            z.boolean(),
          ),
          username: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.username",
            },
            z.string(),
          ),
          authMethod: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.post.response.account.authMethod",
            },
            z.enum(ImapAuthMethod),
          ),
          enabled: responseField(
            {
              type: WidgetType.BADGE,
              text: "app.api.emails.imapClient.accounts.id.post.response.account.enabled",
            },
            z.boolean(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.createdAt",
            },
            z.string(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.emails.imapClient.accounts.id.post.response.account.updatedAt",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.accounts.id.post.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.accounts.id.post.errors.validation.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.post.errors.server.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.post.errors.unknown.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.post.errors.network.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.accounts.id.post.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.imapClient.accounts.id.post.errors.notFound.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.imapClient.accounts.id.post.errors.conflict.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.accounts.id.post.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.accounts.id.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.accounts.id.post.success.title",
    description:
      "app.api.emails.imapClient.accounts.id.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        name: "Updated IMAP Account",
        email: "updated@example.com",
        host: "app.api.emails.imapClient.imap.example.com",
        port: 993,
        secure: true,
        username: "updated@example.com",
        password: "newpassword123",
        authMethod: ImapAuthMethod.PLAIN,
        enabled: true,
      },
    },
    responses: {
      default: {
        account: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Updated IMAP Account",
          email: "updated@example.com",
          host: "app.api.emails.imapClient.imap.example.com",
          port: 993,
          secure: true,
          username: "updated@example.com",
          authMethod: ImapAuthMethod.PLAIN,
          enabled: true,
          createdAt: "2023-11-01T08:15:30Z",
          updatedAt: "2023-12-01T10:32:15Z",
        },
      },
    },
  },
});

/**
 * Delete IMAP Account Endpoint (DELETE)
 * Deletes an IMAP account
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "app.api.emails.imapClient.accounts.id.delete.title",
  description: "app.api.emails.imapClient.accounts.id.delete.description",
  category: "app.api.emails.category",
  icon: "inbox",
  tags: ["app.api.emails.imapClient.tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.emails.imapClient.accounts.id.delete.container.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.imapClient.accounts.id.get.id.label",
          description:
            "app.api.emails.imapClient.accounts.id.get.id.description",
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.emails.imapClient.accounts.id.delete.response.message",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.unauthorized.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.notFound.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.imapClient.accounts.id.delete.errors.server.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.server.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.forbidden.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.conflict.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.network.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.unknown.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.unsavedChanges.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.imapClient.accounts.id.delete.errors.validation.title",
      description:
        "app.api.emails.imapClient.accounts.id.delete.errors.validation.description",
    },
  },

  successTypes: {
    title: "app.api.emails.imapClient.accounts.id.delete.success.title",
    description:
      "app.api.emails.imapClient.accounts.id.delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        message: "Account deleted successfully",
      },
    },
  },
});

// Export types
export type ImapAccountGetRequestInput = typeof GET.types.RequestInput;
export type ImapAccountGetRequestOutput = typeof GET.types.RequestOutput;
export type ImapAccountGetResponseInput = typeof GET.types.ResponseInput;
export type ImapAccountGetResponseOutput = typeof GET.types.ResponseOutput;

export type ImapAccountPutRequestInput = typeof PUT.types.RequestInput;
export type ImapAccountPutRequestOutput = typeof PUT.types.RequestOutput;
export type ImapAccountPutResponseInput = typeof PUT.types.ResponseInput;
export type ImapAccountPutResponseOutput = typeof PUT.types.ResponseOutput;

export type ImapAccountDeleteRequestInput = typeof DELETE.types.RequestInput;
export type ImapAccountDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type ImapAccountDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type ImapAccountDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const imapAccountEndpoints = {
  GET,
  PUT,
  DELETE,
};

// Export individual endpoints
export { DELETE, GET, PUT };
export default imapAccountEndpoints;
