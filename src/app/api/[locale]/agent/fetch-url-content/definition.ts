/**
 * Fetch URL Content Endpoint Definition
 * Web scraping capability for AI agents
 */

import { z } from "zod";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

export const FETCH_URL_ALIAS = "fetch-url-content" as const;

/**
 * GET /fetch_url_content - Fetch and convert URL content to markdown
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "fetch-url-content"],
  title: "app.api.agent.chat.tools.fetchUrl.get.title" as const,
  description: "app.api.agent.chat.tools.fetchUrl.get.description" as const,
  category: "app.api.agent.chat.category" as const,
  tags: [
    "app.api.agent.chat.tools.fetchUrl.tags.scraping" as const,
    "app.api.agent.chat.tools.fetchUrl.tags.web" as const,
    "app.api.agent.chat.tools.fetchUrl.tags.content" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [FETCH_URL_ALIAS, "fetch", "fetch-url"] as const,
  cli: {
    firstCliArgKey: "url",
  },

  options: {
    queryOptions: {
      enabled: false, // Don't auto-fetch, wait for user to press submit
    },
    formOptions: {
      autoSubmit: false, // Don't auto-submit, wait for user to press submit
    },
  },

  // Credit cost - Scrappey with 30% markup
  credits: FEATURE_COSTS.FETCH_URL_CONTENT, // 0.13 credits per fetch
  icon: "globe",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      linkable: true,
      title: "app.api.agent.chat.tools.fetchUrl.get.form.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.form.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      url: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.agent.chat.tools.fetchUrl.get.fields.url.title" as const,
          description:
            "app.api.agent.chat.tools.fetchUrl.get.fields.url.description" as const,
          placeholder:
            "app.api.agent.chat.tools.fetchUrl.get.fields.url.placeholder" as const,
          columns: 12,
        },
        z.string().url().min(1),
      ),

      // === RESPONSE FIELDS ===
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.tools.fetchUrl.get.response.message.title" as const,
          columns: 12,
        },
        z.string(),
      ),

      fetchedUrl: responseField(
        {
          type: WidgetType.LINK,
          href: "/{fetchedUrl}",
          text: "app.api.agent.chat.tools.fetchUrl.get.response.url.title" as const,
          external: true,
          columns: 12,
        },
        z.string(),
      ),

      content: responseField(
        {
          type: WidgetType.MARKDOWN,
          label:
            "app.api.agent.chat.tools.fetchUrl.get.response.content.title" as const,
          description:
            "app.api.agent.chat.tools.fetchUrl.get.response.content.description" as const,
          columns: 12,
        },
        z.string(),
      ),

      statusCode: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.tools.fetchUrl.get.response.statusCode.title" as const,
          columns: 6,
        },
        z.number().optional(),
      ),

      timeElapsed: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.agent.chat.tools.fetchUrl.get.response.timeElapsed.title" as const,
          columns: 6,
        },
        z.number().optional(),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.title" as const,
      description:
        "app.api.agent.chat.tools.fetchUrl.get.errors.internal.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.agent.chat.tools.fetchUrl.get.success.title" as const,
    description:
      "app.api.agent.chat.tools.fetchUrl.get.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        url: "https://example.com",
      },
      blog: {
        url: "https://blog.example.com/article",
      },
    },
    responses: {
      default: {
        message: "Successfully fetched content from: https://example.com",
        content:
          "# Example Domain\n\nThis domain is for use in illustrative examples...",
        fetchedUrl: "https://example.com",
        statusCode: 200,
        timeElapsed: 1234,
      },
      blog: {
        message:
          "Successfully fetched content from: https://blog.example.com/article",
        content: "# Article Title\n\nArticle content in markdown format...",
        fetchedUrl: "https://blog.example.com/article",
        statusCode: 200,
        timeElapsed: 2345,
      },
    },
  },
});

const fetchUrlContentDefinition = { GET } as const;

export default fetchUrlContentDefinition;

// Export types
export type FetchUrlContentGetRequestInput = typeof GET.types.RequestInput;
export type FetchUrlContentGetRequestOutput = typeof GET.types.RequestOutput;
export type FetchUrlContentGetResponseInput = typeof GET.types.ResponseInput;
export type FetchUrlContentGetResponseOutput = typeof GET.types.ResponseOutput;
export type FetchUrlContentGetUrlVariablesInput =
  typeof GET.types.UrlVariablesInput;
export type FetchUrlContentGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
