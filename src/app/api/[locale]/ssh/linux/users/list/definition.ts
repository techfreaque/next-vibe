/**
 * Linux Users List Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { LinuxUsersListContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "linux", "users", "list"],
  title: "app.api.ssh.linux.users.list.get.title",
  description: "app.api.ssh.linux.users.list.get.description",
  icon: "users",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: LinuxUsersListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      users: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.linux.users.list.get.response.users.title",
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
    title: "app.api.ssh.linux.users.list.get.success.title",
    description: "app.api.ssh.linux.users.list.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.linux.users.list.get.errors.validation.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.linux.users.list.get.errors.unauthorized.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.linux.users.list.get.errors.forbidden.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.linux.users.list.get.errors.server.title",
      description: "app.api.ssh.linux.users.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.linux.users.list.get.errors.notFound.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.linux.users.list.get.errors.unknown.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.linux.users.list.get.errors.unsavedChanges.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.linux.users.list.get.errors.conflict.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.linux.users.list.get.errors.network.title",
      description:
        "app.api.ssh.linux.users.list.get.errors.network.description",
    },
  },

  examples: {
    requests: { default: {} },
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
