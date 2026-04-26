/**
 * Cortex Search Definition
 * GET endpoint for full-text search across Cortex content
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

import { CORTEX_SEARCH_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexSearchWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexSearchWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "cortex", "search"],
  aliases: [CORTEX_SEARCH_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  cli: { firstCliArgKey: "query" },
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "search",
  dynamicTitle: ({ request }) => {
    if (request?.query) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { query: request.query },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
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
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["get.tags.cortex" as const],
  defaultExpanded: true,
  options: {
    queryOptions: {
      enabled: false, // Don't auto-fetch, wait for user to press submit
    },
    formOptions: {
      autoSubmit: false, // Don't auto-submit, wait for user to press submit
    },
  },

  fields: customWidgetObject({
    render: CortexSearchWidget,
    usage: { request: "data", response: true } as const,
    children: {
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.label" as const,
        description: "get.fields.query.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.path.label" as const,
        description: "get.fields.path.description" as const,
        columns: 6,
        schema: z.string().optional().default("/"),
      }),
      maxResults: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxResults.label" as const,
        description: "get.fields.maxResults.description" as const,
        columns: 6,
        schema: z.coerce.number().int().min(1).max(50).optional().default(20),
      }),

      // === RESPONSE ===
      responseQuery: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.query.content" as const,
        schema: z.string(),
        fieldName: "query",
      }),
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            resultPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.path.content" as const,
              schema: z.string(),
              fieldName: "path",
            }),
            excerpt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.excerpt.content" as const,
              schema: z.string(),
            }),
            score: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.results.score.text" as const,
              schema: z.number(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.updatedAt.content" as const,
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
      searchMode: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.searchMode.text" as const,
        schema: z.enum(["hybrid", "keyword"]),
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
      searchAll: { query: "auth" },
      searchDocuments: { query: "meeting", path: "/documents" },
    },
    responses: {
      results: {
        responseQuery: "auth",
        results: [
          {
            resultPath: "/documents/tasks/fix-auth.md",
            excerpt:
              "...session tokens expire too early in the **auth** module...",
            score: 0.85,
            updatedAt: "2026-04-17T14:30:00Z",
          },
        ],
        total: 1,
        searchMode: "hybrid" as const,
      },
    },
  },
});

export type CortexSearchResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
