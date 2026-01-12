/**
 * Brave Search Endpoint Definition
 * Web search capability for AI agents
 */

import { z } from "zod";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

/**
 * Freshness options for search results
 * Values are API codes, mapped to readable display in options
 */
const FRESHNESS_OPTIONS = [
  "past_day",
  "past_week",
  "past_month",
  "past_year",
] as const;

/** Map readable values to Brave API codes */
export const FRESHNESS_API_MAP: Record<string, string> = {
  past_day: "pd",
  past_week: "pw",
  past_month: "pm",
  past_year: "py",
};
export const SEARCH_ALIAS = "web-search" as const;

/**
 * GET /brave-search - Search the web
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "brave-search"],
  title: "app.api.agent.chat.tools.braveSearch.get.title" as const,
  description: "app.api.agent.chat.tools.braveSearch.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tools.braveSearch.tags.search" as const,
    "app.api.agent.chat.tools.braveSearch.tags.web" as const,
    "app.api.agent.chat.tools.braveSearch.tags.internet" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [SEARCH_ALIAS, "search"] as const,
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

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      linkable: true,
      title: "app.api.agent.chat.tools.braveSearch.get.form.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      query: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.tools.braveSearch.get.fields.query.title" as const,
          description:
            "app.api.agent.chat.tools.braveSearch.get.fields.query.description" as const,
          placeholder:
            "app.api.agent.chat.tools.braveSearch.get.fields.query.placeholder" as const,
          columns: 12,
        },
        z.string().min(1).max(400),
      ),

      maxResults: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.agent.chat.tools.braveSearch.get.fields.maxResults.title" as const,
          description:
            "app.api.agent.chat.tools.braveSearch.get.fields.maxResults.description" as const,
          columns: 4,
        },
        z.coerce.number().min(1).max(10).optional().default(5),
      ),

      includeNews: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.agent.chat.tools.braveSearch.get.fields.includeNews.title" as const,
          description:
            "app.api.agent.chat.tools.braveSearch.get.fields.includeNews.description" as const,
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      freshness: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.agent.chat.tools.braveSearch.get.fields.freshness.title" as const,
          description:
            "app.api.agent.chat.tools.braveSearch.get.fields.freshness.description" as const,
          options: [
            {
              value: "past_day",
              label:
                "app.api.agent.chat.tools.braveSearch.get.fields.freshness.options.day" as const,
            },
            {
              value: "past_week",
              label:
                "app.api.agent.chat.tools.braveSearch.get.fields.freshness.options.week" as const,
            },
            {
              value: "past_month",
              label:
                "app.api.agent.chat.tools.braveSearch.get.fields.freshness.options.month" as const,
            },
            {
              value: "past_year",
              label:
                "app.api.agent.chat.tools.braveSearch.get.fields.freshness.options.year" as const,
            },
          ],
          columns: 4,
        },
        z.enum(FRESHNESS_OPTIONS).optional(),
      ),

      // === RESPONSE FIELDS ===
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.tools.braveSearch.get.response.message.title" as const,
          columns: 12,
        },
        z.string(),
      ),

      results: responseArrayField(
        {
          type: WidgetType.LINK_LIST,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.DATA_CARD,
            linkable: true,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            title: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.tools.braveSearch.get.response.results.title" as const,
              },
              z.string(),
            ),
            url: responseField(
              {
                type: WidgetType.LINK,
                href: "/{url}",
                text: "app.api.agent.chat.tools.braveSearch.get.response.results.item.url" as const,
                external: true,
              },
              z.string(),
            ),
            snippet: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.tools.braveSearch.get.response.results.item.snippet" as const,
              },
              z.string(),
            ),
            age: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.tools.braveSearch.get.response.results.item.age" as const,
              },
              z.string().optional(),
            ),
            source: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.agent.chat.tools.braveSearch.get.response.results.item.source" as const,
              },
              z.string().optional(),
            ),
          },
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.agent.chat.tools.braveSearch.get.success.title" as const,
    description:
      "app.api.agent.chat.tools.braveSearch.get.success.description" as const,
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
        message: "Found 5 results for: latest AI news",
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
        message: "Found 10 results for: breaking news today",
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
        message: "Found 5 results for: tech updates",
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
