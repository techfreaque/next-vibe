/**
 * Linux Users Create Endpoint Definition
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
import { LinuxUserCreateContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "linux", "users", "create"],
  title: "post.title",
  description: "post.description",
  icon: "user-plus",
  category: "app.endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: LinuxUserCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      username: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.username.label",
        description: "post.fields.username.description",
        placeholder: "post.fields.username.placeholder",
        schema: z
          .string()
          .min(1)
          .max(32)
          .regex(/^[a-z][a-z0-9-]*$/),
      }),
      groups: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.groups.label",
        description: "post.fields.groups.description",
        placeholder: "post.fields.groups.placeholder",
        schema: z.array(z.string()).optional(),
      }),
      loginShell: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.shell.label",
        description: "post.fields.shell.description",
        placeholder: "post.fields.shell.placeholder",
        schema: z.string().optional(),
      }),
      homeDir: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.homeDir.label",
        description: "post.fields.homeDir.description",
        placeholder: "post.fields.homeDir.placeholder",
        schema: z.string().optional(),
      }),
      sudoAccess: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.sudoAccess.label",
        description: "post.fields.sudoAccess.description",
        schema: z.boolean().optional(),
      }),
      ok: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.ok.title",
        schema: z.boolean(),
      }),
      uid: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.uid.title",
        schema: z.number(),
      }),
      gid: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.gid.title",
        schema: z.number(),
      }),
      homeDirectory: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.homeDirectory.title",
        schema: z.string(),
      }),
      shellPath: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.shell.title",
        schema: z.string(),
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
        username: "alice",
        groups: ["www-data"],
        loginShell: "/bin/bash",
        sudoAccess: false,
      },
    },
    responses: {
      default: {
        ok: true,
        uid: 1001,
        gid: 1001,
        homeDirectory: "/home/alice",
        shellPath: "/bin/bash",
      },
    },
  },
});

export type LinuxUserCreateRequestOutput = typeof POST.types.RequestOutput;
export type LinuxUserCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
