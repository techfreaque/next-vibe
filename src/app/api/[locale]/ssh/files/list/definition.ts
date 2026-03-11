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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { FilesListContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "files", "list"],
  title: "get.title",
  description: "get.description",
  icon: "folder",
  category: "app.endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: FilesListContainer,
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
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label",
        description: "get.fields.path.description",
        placeholder: "get.fields.path.placeholder",
        schema: z.string().optional(),
      }),
      entries: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.entries.title",
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
      currentPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPath.title",
        schema: z.string(),
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
