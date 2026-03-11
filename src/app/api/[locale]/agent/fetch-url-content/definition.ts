/**
 * Fetch URL Content Endpoint Definition
 * Web scraping capability for AI agents
 */

import { z } from "zod";

import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { FETCH_URL_ALIAS, FETCH_URL_SHORT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * GET /fetch_url_content - Fetch and convert URL content to markdown
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "fetch-url-content"],
  title: "get.title" as const,
  description: "get.description" as const,
  category: "app.endpointCategories.ai",
  tags: [
    "tags.scraping" as const,
    "tags.web" as const,
    "tags.content" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [FETCH_URL_ALIAS, "fetch", FETCH_URL_SHORT_ALIAS] as const,
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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    linkable: true,
    title: "get.form.title" as const,
    description: "get.form.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.url.title" as const,
        description: "get.fields.url.description" as const,
        placeholder: "get.fields.url.placeholder" as const,
        columns: 12,
        schema: z.string().url().min(1),
      }),

      // === RESPONSE FIELDS ===
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.title" as const,
        columns: 12,
        schema: z.string(),
      }),

      fetchedUrl: responseField(scopedTranslation, {
        type: WidgetType.LINK,
        href: "/{fetchedUrl}",
        text: "get.response.url.title" as const,
        external: true,
        columns: 12,
        schema: z.string(),
      }),

      content: responseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        label: "get.response.content.title" as const,
        description: "get.response.content.description" as const,
        columns: 12,
        schema: z.string(),
      }),

      statusCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.statusCode.title" as const,
        columns: 6,
        schema: z.number().optional(),
      }),

      timeElapsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.timeElapsed.title" as const,
        columns: 6,
        schema: z.number().optional(),
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
      description: "get.errors.internal.description" as const,
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
