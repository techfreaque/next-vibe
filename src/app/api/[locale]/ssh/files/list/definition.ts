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

import { scopedTranslation } from "../../i18n";
import { FilesListContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "files", "list"],
  title: "files.list.get.title",
  description: "files.list.get.description",
  icon: "folder",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: FilesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "files.list.get.fields.connectionId.label",
        description: "files.list.get.fields.connectionId.description",
        placeholder: "files.list.get.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      path: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "files.list.get.fields.path.label",
        description: "files.list.get.fields.path.description",
        placeholder: "files.list.get.fields.path.placeholder",
        schema: z.string().optional(),
      }),
      entries: responseField({
        type: WidgetType.TEXT,
        content: "files.list.get.response.entries.title",
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
        content: "files.list.get.response.currentPath.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "files.list.get.success.title",
    description: "files.list.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "files.list.get.errors.validation.title",
      description: "files.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "files.list.get.errors.unauthorized.title",
      description: "files.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "files.list.get.errors.forbidden.title",
      description: "files.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "files.list.get.errors.server.title",
      description: "files.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "files.list.get.errors.notFound.title",
      description: "files.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "files.list.get.errors.unknown.title",
      description: "files.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "files.list.get.errors.unsavedChanges.title",
      description: "files.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "files.list.get.errors.conflict.title",
      description: "files.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "files.list.get.errors.network.title",
      description: "files.list.get.errors.network.description",
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
