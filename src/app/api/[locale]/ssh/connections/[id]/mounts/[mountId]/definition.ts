/**
 * SSH Connection Mount [mountId] Endpoint — GET / PATCH / DELETE
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const MountDetailWidget = lazyWidget(() =>
  import("../widget").then((m) => ({ default: m.MountDetailWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "detail.errors.validation.title" as const,
    description: "detail.errors.validation.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "detail.errors.unauthorized.title" as const,
    description: "detail.errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "detail.errors.forbidden.title" as const,
    description: "detail.errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "detail.errors.server.title" as const,
    description: "detail.errors.server.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "detail.errors.notFound.title" as const,
    description: "detail.errors.notFound.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "detail.errors.unknown.title" as const,
    description: "detail.errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "detail.errors.unsavedChanges.title" as const,
    description: "detail.errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "detail.errors.conflict.title" as const,
    description: "detail.errors.conflict.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "detail.errors.network.title" as const,
    description: "detail.errors.network.description" as const,
  },
};

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "[id]", "mounts", "[mountId]"],
  aliases: ["ssh-mount"] as const,
  title: "detail.titleGet" as const,
  titleShort: "detail.titleShortGet" as const,
  description: "detail.descriptionGet" as const,
  icon: "folder-open",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: MountDetailWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
        hidden: true,
      }),
      mountId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.name.title" as const,
        schema: z.string(),
      }),
      path: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.path.title" as const,
        schema: z.string(),
      }),
      isDefault: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.isDefault.title" as const,
        schema: z.boolean(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.createdAt.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "detail.successGet.title" as const,
    description: "detail.successGet.description" as const,
  },
  errorTypes,

  examples: {
    urlPathParams: {
      default: {
        id: "00000000-0000-0000-0000-000000000000",
        mountId: "00000000-0000-0000-0000-000000000001",
      },
    },
    requests: undefined,
    responses: {
      default: {
        name: "project",
        path: "/home/max/project",
        isDefault: true,
        createdAt: "2026-01-01T00:00:00Z",
      },
    },
  },
});

export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["ssh", "connections", "[id]", "mounts", "[mountId]"],
  aliases: ["ssh-mount-update"] as const,
  title: "detail.titlePatch" as const,
  titleShort: "detail.titleShortPatch" as const,
  description: "detail.descriptionPatch" as const,
  icon: "folder-pen",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: MountDetailWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
        hidden: true,
      }),
      mountId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
      }),
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "detail.fields.path.label" as const,
        description: "detail.fields.path.description" as const,
        placeholder: "detail.fields.path.placeholder" as const,
        schema: z.string().min(1).startsWith("/").optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "detail.fields.isDefault.label" as const,
        description: "detail.fields.isDefault.description" as const,
        schema: z.boolean().optional(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.updatedAt.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "detail.successPatch.title" as const,
    description: "detail.successPatch.description" as const,
  },
  errorTypes,

  examples: {
    urlPathParams: {
      default: {
        id: "00000000-0000-0000-0000-000000000000",
        mountId: "00000000-0000-0000-0000-000000000001",
      },
    },
    requests: { default: { isDefault: true } },
    responses: { default: { updatedAt: "2026-01-01T00:00:00Z" } },
  },
});

export const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["ssh", "connections", "[id]", "mounts", "[mountId]"],
  aliases: ["ssh-mount-delete"] as const,
  title: "detail.titleDelete" as const,
  titleShort: "detail.titleShortDelete" as const,
  description: "detail.descriptionDelete" as const,
  icon: "folder-x",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: MountDetailWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
        hidden: true,
      }),
      mountId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list/definition")).default.GET,
        labelField: "name",
        schema: z.string().uuid(),
        label: "detail.fields.mountId.label" as const,
        description: "detail.fields.mountId.description" as const,
        hidden: true,
      }),
      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        level: 5,
        label: "detail.widget.confirmDelete" as const,
        usage: { request: "urlPathParams" },
      }),
      deleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "detail.response.deleted.title" as const,
        schema: z.boolean(),
      }),
      backButton: backButton(scopedTranslation, {
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "urlPathParams" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "detail.titleDelete" as const,
        icon: "trash",
        variant: "destructive",
        usage: { request: "urlPathParams" },
      }),
    },
  }),

  successTypes: {
    title: "detail.successDelete.title" as const,
    description: "detail.successDelete.description" as const,
  },
  errorTypes,

  examples: {
    urlPathParams: {
      default: {
        id: "00000000-0000-0000-0000-000000000000",
        mountId: "00000000-0000-0000-0000-000000000001",
      },
    },
    requests: undefined,
    responses: { default: { deleted: true } },
  },
});

export type MountDetailRequestOutput = typeof GET.types.RequestOutput;
export type MountDetailResponseOutput = typeof GET.types.ResponseOutput;
export type MountUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type MountUpdateResponseOutput = typeof PATCH.types.ResponseOutput;
export type MountDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const endpoints = { GET, PATCH, DELETE };
export default endpoints;
