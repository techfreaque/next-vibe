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

import { scopedTranslation } from "../../../i18n";
import { LinuxUserDeleteContainer } from "./widget";

export const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["ssh", "linux", "users", "[username]"],
  title: "linux.users.username.delete.title",
  description: "linux.users.username.delete.description",
  icon: "user",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: LinuxUserDeleteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      removeHome: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "linux.users.username.delete.fields.removeHome.label",
        description:
          "linux.users.username.delete.fields.removeHome.description",
        schema: z.boolean().optional(),
      }),
      ok: responseField({
        type: WidgetType.TEXT,
        content: "linux.users.username.delete.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "linux.users.username.delete.success.title",
    description: "linux.users.username.delete.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "linux.users.username.delete.errors.validation.title",
      description: "linux.users.username.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "linux.users.username.delete.errors.unauthorized.title",
      description:
        "linux.users.username.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "linux.users.username.delete.errors.forbidden.title",
      description: "linux.users.username.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "linux.users.username.delete.errors.server.title",
      description: "linux.users.username.delete.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "linux.users.username.delete.errors.notFound.title",
      description: "linux.users.username.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "linux.users.username.delete.errors.unknown.title",
      description: "linux.users.username.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "linux.users.username.delete.errors.unsavedChanges.title",
      description:
        "linux.users.username.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "linux.users.username.delete.errors.conflict.title",
      description: "linux.users.username.delete.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "linux.users.username.delete.errors.network.title",
      description: "linux.users.username.delete.errors.network.description",
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
