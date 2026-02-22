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

import { scopedTranslation } from "../../i18n";
import { FilesWriteContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "files", "write"],
  title: "files.write.post.title",
  description: "files.write.post.description",
  icon: "file",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: FilesWriteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "files.write.post.fields.connectionId.label",
        description: "files.write.post.fields.connectionId.description",
        placeholder: "files.write.post.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "files.write.post.fields.path.label",
        description: "files.write.post.fields.path.description",
        placeholder: "files.write.post.fields.path.placeholder",
        schema: z.string().min(1),
      }),
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "files.write.post.fields.content.label",
        description: "files.write.post.fields.content.description",
        placeholder: "files.write.post.fields.content.placeholder",
        schema: z.string(),
      }),
      createDirs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "files.write.post.fields.createDirs.label",
        description: "files.write.post.fields.createDirs.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "files.write.post.response.ok.title",
        schema: z.boolean(),
      }),
      bytesWritten: responseField({
        type: WidgetType.TEXT,
        content: "files.write.post.response.bytesWritten.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "files.write.post.success.title",
    description: "files.write.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "files.write.post.errors.validation.title",
      description: "files.write.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "files.write.post.errors.unauthorized.title",
      description: "files.write.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "files.write.post.errors.forbidden.title",
      description: "files.write.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "files.write.post.errors.server.title",
      description: "files.write.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "files.write.post.errors.notFound.title",
      description: "files.write.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "files.write.post.errors.unknown.title",
      description: "files.write.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "files.write.post.errors.unsavedChanges.title",
      description: "files.write.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "files.write.post.errors.conflict.title",
      description: "files.write.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "files.write.post.errors.network.title",
      description: "files.write.post.errors.network.description",
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
