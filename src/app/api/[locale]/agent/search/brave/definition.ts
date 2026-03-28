/**
 * Brave Search Endpoint Definition
 * Web search capability for AI agents
 */

import { z } from "zod";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { BraveSearchResultsContainer } from "./widget";

/**
 * Freshness options for search results
 */
const FRESHNESS_OPTIONS = [
  "past_day",
  "past_week",
  "past_month",
  "past_year",
] as const;

import { BRAVE_SEARCH_ALIAS } from "./constants";

/**
 * GET /brave-search - Search the web
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "search", "brave"],
  title: "get.title" as const,
  description: "get.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.query) {
      const query =
        request.query.length > 40
          ? `${request.query.slice(0, 40)}...`
          : request.query;
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { query },
      };
    }
    return undefined;
  },
  category: "endpointCategories.ai",
  tags: ["tags.search" as const, "tags.web" as const, "tags.internet" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [BRAVE_SEARCH_ALIAS] as const,
  cli: {
    firstCliArgKey: "query",
  },

  options: {
    queryOptions: {
      enabled: false, // Don't auto-fetch, wait for user to press search
    },
    formOptions: {
      autoSubmit: false, // Don't auto-submit, wait for user to press search
    },
  },

  // Credit cost - use calculated price from centralized pricing
  credits: FEATURE_COSTS.BRAVE_SEARCH, // 0.65 credits per search
  icon: "search",

  fields: customWidgetObject({
    render: BraveSearchResultsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.title" as const,
        description: "get.fields.query.description" as const,
        placeholder: "get.fields.query.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(400),
      }),

      maxResults: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxResults.title" as const,
        description: "get.fields.maxResults.description" as const,
        columns: 4,
        schema: z.coerce.number().min(1).max(10).optional().default(5),
      }),

      includeNews: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeNews.title" as const,
        description: "get.fields.includeNews.description" as const,
        columns: 4,
        schema: z.boolean().optional().default(false),
      }),

      freshness: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.freshness.title" as const,
        description: "get.fields.freshness.description" as const,
        options: [
          {
            value: "past_day",
            label: "get.fields.freshness.options.day" as const,
          },
          {
            value: "past_week",
            label: "get.fields.freshness.options.week" as const,
          },
          {
            value: "past_month",
            label: "get.fields.freshness.options.month" as const,
          },
          {
            value: "past_year",
            label: "get.fields.freshness.options.year" as const,
          },
        ],
        columns: 4,
        schema: z.enum(FRESHNESS_OPTIONS).optional(),
      }),

      // === RESPONSE FIELDS ===
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          linkable: true,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            title: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.title" as const,
              schema: z.string(),
            }),
            url: responseField(scopedTranslation, {
              type: WidgetType.LINK,
              href: "/{url}",
              text: "get.response.results.item.url" as const,
              external: true,
              schema: z.string(),
            }),
            snippet: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.item.snippet" as const,
              schema: z.string(),
            }),
            age: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.item.age" as const,
              schema: z.string().optional(),
            }),
            source: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.results.item.source" as const,
              schema: z.string().optional(),
            }),
          },
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.searchFailed.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        query: "latest AI news",
        maxResults: 5,
      },
      withNews: {
        query: "breaking news today",
        maxResults: 10,
        includeNews: true,
      },
      recent: {
        query: "tech updates",
        maxResults: 5,
        freshness: "past_day",
      },
    },
    responses: {
      default: {
        results: [
          {
            title: "Breaking: GPT-5 Announced",
            url: "https://example.com/gpt5",
            snippet:
              "OpenAI announces the next generation of language models...",
            age: "2 hours ago",
            source: "TechNews",
          },
        ],
      },
      withNews: {
        results: [
          {
            title: "Breaking News Update",
            url: "https://example.com/news",
            snippet: "Latest breaking news from around the world...",
            age: "1 hour ago",
            source: "NewsSource",
          },
        ],
      },
      recent: {
        results: [
          {
            title: "Tech Updates Today",
            url: "https://example.com/tech",
            snippet: "Latest technology updates and innovations...",
            age: "3 hours ago",
            source: "TechDaily",
          },
        ],
      },
    },
  },
});

const braveSearchDefinition = { GET };

export default braveSearchDefinition;

// Export types
export type BraveSearchGetRequestInput = typeof GET.types.RequestInput;
export type BraveSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type BraveSearchGetResponseInput = typeof GET.types.ResponseInput;
export type BraveSearchGetResponseOutput = typeof GET.types.ResponseOutput;
export type BraveSearchGetUrlVariablesInput =
  typeof GET.types.UrlVariablesInput;
export type BraveSearchGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
