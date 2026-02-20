/**
 * SSH Files Read Endpoint Definition
 * GET /ssh/files/read — Read a text file
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { FilesReadContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "files", "read"],
  title: "app.api.ssh.files.read.get.title",
  description: "app.api.ssh.files.read.get.description",
  icon: "file-text",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: FilesReadContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.read.get.fields.connectionId.label",
        description:
          "app.api.ssh.files.read.get.fields.connectionId.description",
        placeholder:
          "app.api.ssh.files.read.get.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.read.get.fields.path.label",
        description: "app.api.ssh.files.read.get.fields.path.description",
        placeholder: "app.api.ssh.files.read.get.fields.path.placeholder",
        schema: z.string().min(1),
      }),
      maxBytes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.files.read.get.fields.maxBytes.label",
        description: "app.api.ssh.files.read.get.fields.maxBytes.description",
        placeholder: "app.api.ssh.files.read.get.fields.maxBytes.placeholder",
        schema: z.coerce.number().min(1).max(524288).optional(),
      }),
      offset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.files.read.get.fields.offset.label",
        description: "app.api.ssh.files.read.get.fields.offset.description",
        placeholder: "app.api.ssh.files.read.get.fields.offset.placeholder",
        schema: z.coerce.number().min(0).optional(),
      }),
      content: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.read.get.response.content.title",
        schema: z.string(),
      }),
      size: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.read.get.response.size.title",
        schema: z.number(),
      }),
      truncated: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.read.get.response.truncated.title",
        schema: z.boolean(),
      }),
      encoding: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.read.get.response.encoding.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.files.read.get.success.title",
    description: "app.api.ssh.files.read.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.files.read.get.errors.validation.title",
      description: "app.api.ssh.files.read.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.files.read.get.errors.unauthorized.title",
      description: "app.api.ssh.files.read.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.files.read.get.errors.forbidden.title",
      description: "app.api.ssh.files.read.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.files.read.get.errors.server.title",
      description: "app.api.ssh.files.read.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.files.read.get.errors.notFound.title",
      description: "app.api.ssh.files.read.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.files.read.get.errors.unknown.title",
      description: "app.api.ssh.files.read.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.files.read.get.errors.unsavedChanges.title",
      description:
        "app.api.ssh.files.read.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.files.read.get.errors.conflict.title",
      description: "app.api.ssh.files.read.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.files.read.get.errors.network.title",
      description: "app.api.ssh.files.read.get.errors.network.description",
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
