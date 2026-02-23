/**
 * SSH Files Write Endpoint Definition
 * POST /ssh/files/write — Write or overwrite a file
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { FilesWriteContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "files", "write"],
  title: "post.title",
  description: "post.description",
  icon: "file",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: FilesWriteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.connectionId.label",
        description: "post.fields.connectionId.description",
        placeholder: "post.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.path.label",
        description: "post.fields.path.description",
        placeholder: "post.fields.path.placeholder",
        schema: z.string().min(1),
      }),
      content: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.content.label",
        description: "post.fields.content.description",
        placeholder: "post.fields.content.placeholder",
        schema: z.string(),
      }),
      createDirs: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.createDirs.label",
        description: "post.fields.createDirs.description",
        schema: z.boolean().optional(),
      }),
      ok: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.ok.title",
        schema: z.boolean(),
      }),
      bytesWritten: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.bytesWritten.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
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
