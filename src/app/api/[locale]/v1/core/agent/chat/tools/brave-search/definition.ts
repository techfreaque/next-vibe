/**
 * Brave Search Endpoint Definition
 * Web search capability for AI agents
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestUrlParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Freshness options for search results
 */
const FRESHNESS_OPTIONS = ["pd", "pw", "pm", "py"] as const;

/**
 * GET /brave-search - Search the web
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "tools", "brave-search"],
  title: "app.api.v1.core.agent.chat.tools.braveSearch.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.tools.braveSearch.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: [
    "app.api.v1.core.agent.chat.tools.braveSearch.tags.search" as const,
    "app.api.v1.core.agent.chat.tools.braveSearch.tags.web" as const,
    "app.api.v1.core.agent.chat.tools.braveSearch.tags.internet" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: ["search"] as const,
  cli: {
    firstCliArgKey: "query",
  },

  // AI Tool metadata
  aiTool: {
    instructions:
      "You have access to a web search tool called 'search'. When the user asks about current events, recent information, or anything that requires up-to-date knowledge, you MUST use the search tool to find relevant information. To use the search tool, call it with a 'query' parameter containing the search keywords. After receiving search results, provide a comprehensive answer based on those results and cite your sources.",
    displayName: "Web Search",
    icon: "search",
    color: "#4285F4", // Google blue
    priority: 100, // High priority - search is fundamental
    creditCost: 1, // 1 credit per search
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.form.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // === REQUEST FIELDS ===
      query: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.query.label" as const,
          description:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.query.description" as const,
          placeholder:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.query.placeholder" as const,
          layout: { columns: 12 },
          validation: { required: true },
        },
        z.string().min(1).max(400),
      ),

      maxResults: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.maxResults.label" as const,
          description:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.maxResults.description" as const,
          layout: { columns: 6 },
          validation: { required: false },
        },
        z.number().min(1).max(10).optional().default(5),
      ),

      includeNews: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.includeNews.label" as const,
          description:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.includeNews.description" as const,
          layout: { columns: 6 },
          validation: { required: false },
        },
        z.boolean().optional().default(false),
      ),

      freshness: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.label" as const,
          description:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.description" as const,
          options: [
            {
              value: "pd",
              label:
                "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.options.day" as const,
            },
            {
              value: "pw",
              label:
                "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.options.week" as const,
            },
            {
              value: "pm",
              label:
                "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.options.month" as const,
            },
            {
              value: "py",
              label:
                "app.api.v1.core.agent.chat.tools.braveSearch.get.fields.freshness.options.year" as const,
            },
          ],
          layout: { columns: 6 },
          validation: { required: false },
        },
        z.enum(FRESHNESS_OPTIONS).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.response.success" as const,
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.response.message" as const,
        },
        z.string(),
      ),

      query: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.response.query" as const,
        },
        z.string(),
      ),

      results: responseArrayField(
        {
          type: WidgetType.GROUPED_LIST,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.title" as const,
            description:
              "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.description" as const,
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            title: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.title" as const,
              },
              z.string(),
            ),
            url: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.url" as const,
              },
              z.string(),
            ),
            snippet: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.snippet" as const,
              },
              z.string(),
            ),
            age: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.age" as const,
              },
              z.string().optional(),
            ),
            source: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.tools.braveSearch.get.response.results.item.source" as const,
              },
              z.string().optional(),
            ),
          },
        ),
      ),

      cached: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.response.cached" as const,
        },
        z.boolean().optional(),
      ),

      timestamp: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.tools.braveSearch.get.response.timestamp" as const,
        },
        z.string().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.INTERNAL_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.internal.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.network.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.agent.chat.tools.braveSearch.get.errors.unsavedChanges.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title:
      "app.api.v1.core.agent.chat.tools.braveSearch.get.success.title" as const,
    description:
      "app.api.v1.core.agent.chat.tools.braveSearch.get.success.description" as const,
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
        freshness: "pd",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Found 5 results for: latest AI news",
        query: "latest AI news",
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
        cached: false,
        timestamp: "2024-01-15T10:30:00Z",
      },
    },
  },
});

const braveSearchDefinition = { GET };

export { GET };

export default braveSearchDefinition;

// Export types
export type BraveSearchGetRequestInput = typeof GET.types.RequestInput;
export type BraveSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type BraveSearchGetResponseInput = typeof GET.types.ResponseInput;
export type BraveSearchGetResponseOutput = typeof GET.types.ResponseOutput;
