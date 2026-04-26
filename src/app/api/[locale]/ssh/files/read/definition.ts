/**
 * SSH Files Read Endpoint Definition
 * GET /ssh/files/read - Read a text file
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SSH_FILES_READ_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const FilesReadContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FilesReadContainer })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "files", "read"],
  aliases: [SSH_FILES_READ_ALIAS],
  title: "get.title",
  description: "get.description",
  icon: "file-text",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshFiles",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: FilesReadContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.connectionId.label",
        description: "get.fields.connectionId.description",
        placeholder: "get.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label",
        description: "get.fields.path.description",
        placeholder: "get.fields.path.placeholder",
        schema: z.string().min(1),
      }),
      maxBytes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxBytes.label",
        description: "get.fields.maxBytes.description",
        placeholder: "get.fields.maxBytes.placeholder",
        schema: z.coerce.number().min(1).max(524288).optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        placeholder: "get.fields.offset.placeholder",
        schema: z.coerce.number().min(0).optional(),
      }),
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.content.title",
        schema: z.string(),
      }),
      size: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.size.title",
        schema: z.number(),
      }),
      truncated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.truncated.title",
        schema: z.boolean(),
      }),
      encoding: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.encoding.title",
        schema: z.string(),
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
    requests: { default: { path: "/etc/hostname" } },
    responses: {
      default: {
        content: "my-server\n",
        size: 10,
        truncated: false,
        encoding: "utf8",
      },
    },
  },
});

export type FilesReadRequestOutput = typeof GET.types.RequestOutput;
export type FilesReadResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
