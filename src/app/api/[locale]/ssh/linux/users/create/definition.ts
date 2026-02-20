/**
 * Linux Users Create Endpoint Definition
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

import { LinuxUserCreateContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "linux", "users", "create"],
  title: "app.api.ssh.linux.users.create.post.title",
  description: "app.api.ssh.linux.users.create.post.description",
  icon: "user-plus",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: LinuxUserCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      username: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.linux.users.create.post.fields.username.label",
        description:
          "app.api.ssh.linux.users.create.post.fields.username.description",
        placeholder:
          "app.api.ssh.linux.users.create.post.fields.username.placeholder",
        schema: z
          .string()
          .min(1)
          .max(32)
          .regex(/^[a-z][a-z0-9-]*$/),
      }),
      groups: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.linux.users.create.post.fields.groups.label",
        description:
          "app.api.ssh.linux.users.create.post.fields.groups.description",
        placeholder:
          "app.api.ssh.linux.users.create.post.fields.groups.placeholder",
        schema: z.array(z.string()).optional(),
      }),
      loginShell: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.linux.users.create.post.fields.shell.label",
        description:
          "app.api.ssh.linux.users.create.post.fields.shell.description",
        placeholder:
          "app.api.ssh.linux.users.create.post.fields.shell.placeholder",
        schema: z.string().optional(),
      }),
      homeDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.linux.users.create.post.fields.homeDir.label",
        description:
          "app.api.ssh.linux.users.create.post.fields.homeDir.description",
        placeholder:
          "app.api.ssh.linux.users.create.post.fields.homeDir.placeholder",
        schema: z.string().optional(),
      }),
      sudoAccess: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.ssh.linux.users.create.post.fields.sudoAccess.label",
        description:
          "app.api.ssh.linux.users.create.post.fields.sudoAccess.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.create.post.response.ok.title",
        schema: z.boolean(),
      }),
      uid: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.create.post.response.uid.title",
        schema: z.number(),
      }),
      gid: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.create.post.response.gid.title",
        schema: z.number(),
      }),
      homeDirectory: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.ssh.linux.users.create.post.response.homeDirectory.title",
        schema: z.string(),
      }),
      shellPath: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.create.post.response.shell.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.linux.users.create.post.success.title",
    description: "app.api.ssh.linux.users.create.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.linux.users.create.post.errors.validation.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.linux.users.create.post.errors.unauthorized.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.linux.users.create.post.errors.forbidden.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.linux.users.create.post.errors.server.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.linux.users.create.post.errors.notFound.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.linux.users.create.post.errors.unknown.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.linux.users.create.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.linux.users.create.post.errors.conflict.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.linux.users.create.post.errors.network.title",
      description:
        "app.api.ssh.linux.users.create.post.errors.network.description",
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
