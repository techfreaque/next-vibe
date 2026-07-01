/**
 * SSH Connection [id] Endpoint - GET / PATCH / DELETE
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import {
  ClusterRole,
  ClusterRoleDB,
  ClusterRoleOptions,
  SshAuthType,
  SshAuthTypeDB,
  SshAuthTypeOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";

const ConnectionDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ConnectionDetailContainer })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "[id]"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "server",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionDetailContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "get.fields.id.label",
        description: "get.fields.id.description",
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.label.title",
        schema: z.string(),
      }),
      host: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.host.title",
        schema: z.string(),
      }),
      port: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.port.title",
        schema: z.number(),
      }),
      username: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.username.title",
        schema: z.string(),
      }),
      authType: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.authType.title",
        schema: z.enum(SshAuthTypeDB),
      }),
      isDefault: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.isDefault.title",
        schema: z.boolean(),
      }),
      fingerprint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.notes.title",
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.createdAt.title",
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
  },

  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    requests: undefined,
    responses: {
      default: {
        label: "prod",
        host: "1.2.3.4",
        port: 22,
        username: "deploy",
        authType: SshAuthType.PASSWORD,
        isDefault: false,
        fingerprint: null,
        notes: null,
        createdAt: "2026-01-01T00:00:00Z",
      },
    },
  },
});

export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["ssh", "connections", "[id]"],
  title: "patch.title",
  titleShort: "patch.titleShort",
  description: "patch.description",
  icon: "server",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionDetailContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "patch.fields.id.label",
        description: "patch.fields.id.description",
      }),
      label: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.label.label",
        description: "patch.fields.label.description",
        placeholder: "patch.fields.label.placeholder",
        schema: z.string().min(1).max(100).optional(),
      }),
      host: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.host.label",
        description: "patch.fields.host.description",
        placeholder: "patch.fields.host.placeholder",
        schema: z.string().min(1).optional(),
      }),
      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.fields.port.label",
        description: "patch.fields.port.description",
        placeholder: "patch.fields.port.placeholder",
        schema: z.coerce.number().min(1).max(65535).optional(),
      }),
      username: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.username.label",
        description: "patch.fields.username.description",
        placeholder: "patch.fields.username.placeholder",
        schema: z.string().min(1).optional(),
      }),
      authType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.fields.authType.label",
        description: "patch.fields.authType.description",
        options: SshAuthTypeOptions,
        schema: z.enum(SshAuthTypeDB).optional(),
      }),
      secret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "patch.fields.secret.label",
        description: "patch.fields.secret.description",
        schema: z.string().optional(),
      }),
      passphrase: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "patch.fields.passphrase.label",
        description: "patch.fields.passphrase.description",
        schema: z.string().optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.fields.isDefault.label",
        description: "patch.fields.isDefault.description",
        schema: z.boolean().optional(),
      }),
      clusterRole: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.fields.clusterRole.label",
        description: "patch.fields.clusterRole.description",
        options: ClusterRoleOptions,
        schema: z.enum(ClusterRoleDB).optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.fields.notes.label",
        description: "patch.fields.notes.description",
        schema: z.string().optional(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "patch.response.updatedAt.title",
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
  },

  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    requests: {
      default: {
        label: "prod-updated",
        isDefault: true,
        clusterRole: ClusterRole.CONTROL_PLANE,
      },
    },
    responses: { default: { updatedAt: "2026-01-01T00:00:00Z" } },
  },
});

export const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["ssh", "connections", "[id]"],
  title: "delete.title",
  titleShort: "delete.titleShort",
  description: "delete.description",
  icon: "server",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        label: "widget.confirmDelete",
        usage: { request: "urlPathParams" },
      }),
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "delete.fields.id.label",
        description: "delete.fields.id.description",
        hidden: true,
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "delete.response.deleted.title",
        schema: z.boolean(),
      }),
      backButton: backButton(scopedTranslation, {
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "delete.title",
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
  },

  examples: {
    urlPathParams: { default: { id: "00000000-0000-0000-0000-000000000000" } },
    requests: undefined,
    responses: { default: { deleted: true } },
  },
});

export type ConnectionDetailRequestOutput = typeof GET.types.RequestOutput;
export type ConnectionDetailResponseOutput = typeof GET.types.ResponseOutput;
export type ConnectionUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type ConnectionUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type ConnectionDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const endpoints = { GET, PATCH, DELETE };
export default endpoints;
