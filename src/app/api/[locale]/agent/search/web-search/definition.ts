/**
 * Unified Web Search Endpoint Definition
 * Routes to user's preferred search provider (Brave, Kagi, or auto-detect)
 */

import { z } from "zod";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

import { SearchProvider, SearchProviderDB } from "../enum";
import { WEB_SEARCH_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const WebSearchResultsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.WebSearchResultsContainer })),
);

/**
 * Freshness options for search results (Brave only)
 */
const FRESHNESS_OPTIONS = [
  "past_day",
  "past_week",
  "past_month",
  "past_year",
] as const;

/**
 * Provider options: auto + all enum values
 */
const PROVIDER_VALUES = ["auto", ...SearchProviderDB] as const;

/**
 * GET /web-search - Search the web with preferred provider
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "search", "web-search"],
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
  subCategory: "endpointCategories.aiSearch",
  tags: ["tags.search" as const, "tags.web" as const, "tags.internet" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  aliases: [WEB_SEARCH_ALIAS] as const,
  cli: {
    firstCliArgKey: "query",
  },

  options: {
    queryOptions: {
      enabled: false,
    },
    formOptions: {
      autoSubmit: false,
    },
  },

  credits: FEATURE_COSTS.BRAVE_SEARCH,
  icon: "search",

  fields: customWidgetObject({
    render: WebSearchResultsContainer,
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

      provider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.provider.title" as const,
        description: "get.fields.provider.description" as const,
        options: [
          {
            value: "auto",
            label: "get.fields.provider.options.auto" as const,
          },
          {
            value: SearchProvider.BRAVE,
            label: "get.fields.provider.options.brave" as const,
          },
          {
            value: SearchProvider.KAGI,
            label: "get.fields.provider.options.kagi" as const,
          },
        ],
        columns: 4,
        schema: z.enum(PROVIDER_VALUES).optional().default("auto"),
      }),

      maxResults: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.maxResults.title" as const,
        description: "get.fields.maxResults.description" as const,
        columns: 3,
        schema: z.coerce.number().min(1).max(10).optional().default(5),
      }),

      includeNews: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.includeNews.title" as const,
        description: "get.fields.includeNews.description" as const,
        columns: 2,
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
        columns: 3,
        schema: z.enum(FRESHNESS_OPTIONS).optional(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),

      // === RESPONSE FIELDS ===
      usedProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.provider.title" as const,
        schema: z.string(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        content: "get.response.output.title" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

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
              content: "get.response.results.item.title" as const,
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
      title: "get.errors.searchFailed.title" as const,
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
      },
      withProvider: {
        query: "quantum computing explained",
        provider: SearchProvider.KAGI,
      },
      withOptions: {
        query: "tech updates",
        maxResults: 10,
        freshness: "past_day",
      },
    },
    responses: {
      default: {
        usedProvider: SearchProvider.BRAVE,
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
      withAiAnswer: {
        usedProvider: SearchProvider.KAGI,
        output:
          "Quantum computing is a type of computing that uses quantum-mechanical phenomena...",
        results: [
          {
            title: "Quantum Computing Explained",
            url: "https://example.com/quantum",
            snippet: "An introduction to quantum computing principles...",
          },
        ],
      },
    },
  },
});

const webSearchDefinition = { GET };

export default webSearchDefinition;

// Export types
export type WebSearchGetRequestInput = typeof GET.types.RequestInput;
export type WebSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type WebSearchGetResponseInput = typeof GET.types.ResponseInput;
export type WebSearchGetResponseOutput = typeof GET.types.ResponseOutput;
export type WebSearchGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type WebSearchGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
