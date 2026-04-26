/**
 * Cortex List Definition
 * GET endpoint for listing directory contents
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CORTEX_LIST_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "cortex", "list"],
  aliases: [CORTEX_LIST_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
  statusBadge: {
    loading: {
      label: "get.status.loading" as const,
      color: "bg-blue-500/10 text-blue-500",
    },
    done: {
      label: "get.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  icon: "folder-open",
  dynamicIcon: ({ request, response }) =>
    resolveCortexIcon(response?.responsePath ?? request?.path),
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["get.tags.cortex" as const],
  defaultExpanded: true,

  fields: customWidgetObject({
    render: CortexListWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label" as const,
        description: "get.fields.path.description" as const,
        columns: 12,
        schema: z.string().optional().default("/"),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      entries: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.entries.name.content" as const,
              schema: z.string(),
            }),
            entryPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.entries.path.content" as const,
              schema: z.string(),
              fieldName: "path",
            }),
            nodeType: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.entries.nodeType.text" as const,
              schema: z.string(),
            }),
            size: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.entries.size.text" as const,
              schema: z.number().nullable(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.entries.updatedAt.content" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.total.text" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      root: { path: "/" },
      documents: { path: "/documents" },
      threads: { path: "/threads/private" },
    },
    responses: {
      root: {
        responsePath: "/",
        entries: [
          {
            name: "documents",
            entryPath: "/documents",
            nodeType: "dir",
            size: null,
            updatedAt: "2026-04-17T14:30:00Z",
          },
          {
            name: "threads",
            entryPath: "/threads",
            nodeType: "dir",
            size: null,
            updatedAt: "2026-04-17T14:30:00Z",
          },
          {
            name: "memories",
            entryPath: "/memories",
            nodeType: "dir",
            size: null,
            updatedAt: "2026-04-17T14:30:00Z",
          },
        ],
        total: 3,
      },
    },
  },
});

export type CortexListRequestInput = typeof GET.types.RequestInput;
export type CortexListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
