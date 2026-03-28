/**
 * Linux Users List Endpoint Definition
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

import { scopedTranslation } from "./i18n";
import { LinuxUsersListContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "linux", "users", "list"],
  title: "get.title",
  description: "get.description",
  icon: "users",
  category: "endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: LinuxUsersListContainer,
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
      users: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.users.title",
        schema: z.array(
          z.object({
            username: z.string(),
            uid: z.number(),
            gid: z.number(),
            homeDir: z.string(),
            shell: z.string(),
            groups: z.array(z.string()),
            locked: z.boolean(),
          }),
        ),
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
      description: "get.errors.unsavedChanges.title",
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
    requests: {
      default: {
        connectionId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        users: [
          {
            username: "alice",
            uid: 1001,
            gid: 1001,
            homeDir: "/home/alice",
            shell: "/bin/bash",
            groups: ["www-data"],
            locked: false,
          },
        ],
      },
    },
  },
});

export type LinuxUsersListRequestOutput = typeof GET.types.RequestOutput;
export type LinuxUsersListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
