/**
 * Linux Users [username] Endpoint Definition
 * DELETE /ssh/linux/users/[username] — Delete an OS user
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

import { LinuxUserDeleteContainer } from "./widget";

export const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["ssh", "linux", "users", "[username]"],
  title: "app.api.ssh.linux.users.username.delete.title",
  description: "app.api.ssh.linux.users.username.delete.description",
  icon: "user",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: LinuxUserDeleteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      removeHome: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.ssh.linux.users.username.delete.fields.removeHome.label",
        description:
          "app.api.ssh.linux.users.username.delete.fields.removeHome.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.username.delete.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.linux.users.username.delete.success.title",
    description: "app.api.ssh.linux.users.username.delete.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.linux.users.username.delete.errors.validation.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.ssh.linux.users.username.delete.errors.unauthorized.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.linux.users.username.delete.errors.forbidden.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.linux.users.username.delete.errors.server.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.linux.users.username.delete.errors.notFound.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.linux.users.username.delete.errors.unknown.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.ssh.linux.users.username.delete.errors.unsavedChanges.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.linux.users.username.delete.errors.conflict.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.linux.users.username.delete.errors.network.title",
      description:
        "app.api.ssh.linux.users.username.delete.errors.network.description",
    },
  },

  examples: {
    requests: { default: { removeHome: false } },
    responses: { default: { ok: true } },
  },
});

export type LinuxUserDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type LinuxUserDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const endpoints = { DELETE };
export default endpoints;
