/**
 * SSH Files Write Endpoint Definition
 * POST /ssh/files/write — Write or overwrite a file
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

import { FilesWriteContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "files", "write"],
  title: "app.api.ssh.files.write.post.title",
  description: "app.api.ssh.files.write.post.description",
  icon: "file",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: FilesWriteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.write.post.fields.connectionId.label",
        description:
          "app.api.ssh.files.write.post.fields.connectionId.description",
        placeholder:
          "app.api.ssh.files.write.post.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.write.post.fields.path.label",
        description: "app.api.ssh.files.write.post.fields.path.description",
        placeholder: "app.api.ssh.files.write.post.fields.path.placeholder",
        schema: z.string().min(1),
      }),
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.write.post.fields.content.label",
        description: "app.api.ssh.files.write.post.fields.content.description",
        placeholder: "app.api.ssh.files.write.post.fields.content.placeholder",
        schema: z.string(),
      }),
      createDirs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.ssh.files.write.post.fields.createDirs.label",
        description:
          "app.api.ssh.files.write.post.fields.createDirs.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.write.post.response.ok.title",
        schema: z.boolean(),
      }),
      bytesWritten: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.write.post.response.bytesWritten.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.files.write.post.success.title",
    description: "app.api.ssh.files.write.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.files.write.post.errors.validation.title",
      description: "app.api.ssh.files.write.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.files.write.post.errors.unauthorized.title",
      description:
        "app.api.ssh.files.write.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.files.write.post.errors.forbidden.title",
      description: "app.api.ssh.files.write.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.files.write.post.errors.server.title",
      description: "app.api.ssh.files.write.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.files.write.post.errors.notFound.title",
      description: "app.api.ssh.files.write.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.files.write.post.errors.unknown.title",
      description: "app.api.ssh.files.write.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.files.write.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.files.write.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.files.write.post.errors.conflict.title",
      description: "app.api.ssh.files.write.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.files.write.post.errors.network.title",
      description: "app.api.ssh.files.write.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      default: {
        path: "/tmp/test.txt",
        content: "hello world\n",
        createDirs: false,
      },
    },
    responses: { default: { ok: true, bytesWritten: 12 } },
  },
});

export type FilesWriteRequestOutput = typeof POST.types.RequestOutput;
export type FilesWriteResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
