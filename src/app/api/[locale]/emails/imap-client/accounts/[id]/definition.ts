/**
 * IMAP Account Individual API Route Definition
 * Defines endpoints for individual IMAP account operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedObjectFieldNew,
  scopedRequestDataArrayOptionalField,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
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
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { ImapAccountEditContainer } from "./widget";

/**
 * Get IMAP Account Endpoint (GET)
 * Retrieves a specific IMAP account by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.email",
  icon: "inbox",
  tags: ["tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title",
    description: "get.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label",
        description: "get.id.description",
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      account: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.account.title",
        description: "get.response.account.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.id",
            schema: z.uuid(),
          }),
          name: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.name",
            schema: z.string(),
          }),
          email: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.email",
            schema: z.email(),
          }),
          host: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.host",
            schema: z.string(),
          }),
          port: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.port",
            schema: z.coerce.number().int(),
          }),
          secure: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.account.secure",
            schema: z.boolean(),
          }),
          username: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.username",
            schema: z.string(),
          }),
          authMethod: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.account.authMethod",
            schema: z.enum(ImapAuthMethod),
          }),
          connectionTimeout: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.connectionTimeout",
            schema: z.coerce.number().int(),
          }),
          keepAlive: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.account.keepAlive",
            schema: z.boolean(),
          }),
          enabled: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.account.enabled",
            schema: z.boolean(),
          }),
          syncInterval: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.syncInterval",
            schema: z.coerce.number().int(),
          }),
          maxMessages: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.maxMessages",
            schema: z.coerce.number().int(),
          }),
          syncFolders: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.syncFolders",
            schema: z.array(z.string()),
          }),
          lastSyncAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.lastSyncAt",
            schema: z.string().nullable(),
          }),
          syncStatus: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.account.syncStatus",
            schema: z.string(),
          }),
          syncError: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.syncError",
            schema: z.string().nullable(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.createdAt",
            schema: z.string(),
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.account.updatedAt",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
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
          host: "imap.example.com",
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
  scopedTranslation,
  method: Methods.PUT,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.email",
  icon: "inbox",
  tags: ["tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: ImapAccountEditContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      backButton: scopedBackButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === URL PARAMETERS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label",
        description: "get.id.description",
        schema: z.uuid(),
      }),

      // === REQUEST DATA FIELDS ===
      name: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.form.name.label",
        description: "post.form.name.description",
        schema: z.string().min(1).max(255),
      }),

      email: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.form.email.label",
        description: "post.form.email.description",
        schema: z.email(),
      }),

      host: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.form.host.label",
        description: "post.form.host.description",
        schema: z.string().min(1),
      }),

      port: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.form.port.label",
        description: "post.form.port.description",
        schema: z.coerce.number().int().min(1).max(65535),
      }),

      secure: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.form.secure.label",
        description: "post.form.secure.description",
        schema: z.boolean(),
      }),

      username: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.form.username.label",
        description: "post.form.username.description",
        schema: z.string().min(1),
      }),

      password: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "post.form.password.label",
        description: "post.form.password.description",
        schema: z.string().min(1),
      }),

      authMethod: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.form.authMethod.label",
        description: "post.form.authMethod.description",
        placeholder: "post.form.authMethod.label",
        options: ImapAuthMethodOptions,
        columns: 6,
        schema: z.enum(ImapAuthMethod),
      }),

      enabled: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.form.enabled.label",
        description: "post.form.enabled.description",
        schema: z.boolean().optional(),
      }),

      connectionTimeout: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.form.connectionTimeout.label",
        description: "post.form.connectionTimeout.description",
        schema: z.coerce.number().min(1000).optional(),
      }),

      keepAlive: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.form.keepAlive.label",
        description: "post.form.keepAlive.description",
        schema: z.boolean().optional(),
      }),

      syncInterval: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.form.syncInterval.label",
        description: "post.form.syncInterval.description",
        schema: z.coerce.number().min(10).optional(),
      }),

      maxMessages: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.form.maxMessages.label",
        description: "post.form.maxMessages.description",
        schema: z.coerce.number().min(1).optional(),
      }),

      syncFolders: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.form.syncFolders.label",
          description: "post.form.syncFolders.description",
        },
        scopedRequestField(scopedTranslation, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "post.form.syncFolders.label",
          description: "post.form.syncFolders.description",
          schema: z.string().optional(),
        }),
      ),

      // === RESPONSE FIELDS ===
      account: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.id",
            schema: z.uuid(),
          }),
          name: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.name",
            schema: z.string(),
          }),
          email: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.email",
            schema: z.email(),
          }),
          host: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.host",
            schema: z.string(),
          }),
          port: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.port",
            schema: z.coerce.number().int(),
          }),
          secure: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "post.response.account.secure",
            schema: z.boolean(),
          }),
          username: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.username",
            schema: z.string(),
          }),
          authMethod: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "post.response.account.authMethod",
            schema: z.enum(ImapAuthMethod),
          }),
          enabled: scopedResponseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "post.response.account.enabled",
            schema: z.boolean(),
          }),
          createdAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.createdAt",
            schema: z.string(),
          }),
          updatedAt: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.account.updatedAt",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        host: "imap.example.com",
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
          host: "imap.example.com",
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
  scopedTranslation,
  method: Methods.DELETE,
  path: ["emails", "imap-client", "accounts", ":id"],
  title: "delete.title",
  description: "delete.description",
  category: "app.endpointCategories.email",
  icon: "inbox",
  tags: ["tags.accounts"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title",
    description: "delete.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      id: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.id.label",
        description: "get.id.description",
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.message",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
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
} as const;
export default imapAccountEndpoints;
