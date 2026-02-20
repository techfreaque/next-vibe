/**
 * SSH Files List Endpoint Definition
 * GET /ssh/files/list — List directory contents
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

import { FilesListContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "files", "list"],
  title: "app.api.ssh.files.list.get.title",
  description: "app.api.ssh.files.list.get.description",
  icon: "folder",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: FilesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.list.get.fields.connectionId.label",
        description:
          "app.api.ssh.files.list.get.fields.connectionId.description",
        placeholder:
          "app.api.ssh.files.list.get.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.files.list.get.fields.path.label",
        description: "app.api.ssh.files.list.get.fields.path.description",
        placeholder: "app.api.ssh.files.list.get.fields.path.placeholder",
        schema: z.string().optional(),
      }),
      entries: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.list.get.response.entries.title",
        schema: z.array(
          z.object({
            name: z.string(),
            type: z.enum(["file", "dir", "symlink"]),
            size: z.number().nullable(),
            permissions: z.string().nullable(),
            modifiedAt: z.string().nullable(),
          }),
        ),
      }),
      currentPath: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.files.list.get.response.currentPath.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.files.list.get.success.title",
    description: "app.api.ssh.files.list.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.files.list.get.errors.validation.title",
      description: "app.api.ssh.files.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.files.list.get.errors.unauthorized.title",
      description: "app.api.ssh.files.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.files.list.get.errors.forbidden.title",
      description: "app.api.ssh.files.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.files.list.get.errors.server.title",
      description: "app.api.ssh.files.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.files.list.get.errors.notFound.title",
      description: "app.api.ssh.files.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.files.list.get.errors.unknown.title",
      description: "app.api.ssh.files.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.files.list.get.errors.unsavedChanges.title",
      description:
        "app.api.ssh.files.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.files.list.get.errors.conflict.title",
      description: "app.api.ssh.files.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.files.list.get.errors.network.title",
      description: "app.api.ssh.files.list.get.errors.network.description",
    },
  },

  examples: {
    requests: { default: { path: "~" } },
    responses: {
      default: {
        entries: [
          {
            name: "Documents",
            type: "dir",
            size: null,
            permissions: "drwxr-xr-x",
            modifiedAt: "2026-01-01T00:00:00Z",
          },
          {
            name: "README.md",
            type: "file",
            size: 1024,
            permissions: "-rw-r--r--",
            modifiedAt: "2026-01-01T00:00:00Z",
          },
        ],
        currentPath: "/home/user",
      },
    },
  },
});

export type FilesListRequestOutput = typeof GET.types.RequestOutput;
export type FilesListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
