/**
 * Kagi Search Endpoint Definition
 * Web search and FastGPT capability for AI agents
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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { KagiSearchResultsContainer } from "./widget";

export const SEARCH_ALIAS = "kagi-search" as const;

/**
 * GET /kagi - Get AI-powered answers with Kagi FastGPT
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "search", "kagi"],
  title: "app.api.agent.search.kagi.get.title" as const,
  description: "app.api.agent.search.kagi.get.description" as const,
  category: "app.api.agent.search.kagi.category" as const,
  tags: [
    "app.api.agent.search.kagi.tags.search" as const,
    "app.api.agent.search.kagi.tags.web" as const,
    "app.api.agent.search.kagi.tags.ai" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [SEARCH_ALIAS, "kagi"] as const,
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
  credits: FEATURE_COSTS.KAGI_SEARCH, // 1.95 credits per search
  icon: "search",

  fields: customWidgetObject({
    render: KagiSearchResultsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      query: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.search.kagi.get.fields.query.title" as const,
        description:
          "app.api.agent.search.kagi.get.fields.query.description" as const,
        placeholder:
          "app.api.agent.search.kagi.get.fields.query.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(400),
      }),

      output: responseField({
        type: WidgetType.MARKDOWN,
        content: "app.api.agent.search.kagi.get.response.output.title" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      references: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            linkable: true,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            title: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.search.kagi.get.response.references.title" as const,
              schema: z.string(),
            }),
            url: responseField({
              type: WidgetType.LINK,
              href: "/{url}",
              text: "app.api.agent.search.kagi.get.response.references.item.url" as const,
              external: true,
              schema: z.string(),
            }),
            snippet: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.search.kagi.get.response.references.item.snippet" as const,
              schema: z.string().optional(),
            }),
          },
        ),
      ),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.search.kagi.get.errors.validation.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.search.kagi.get.errors.internal.title" as const,
      description:
        "app.api.agent.search.kagi.get.errors.internal.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.agent.search.kagi.get.success.title" as const,
    description: "app.api.agent.search.kagi.get.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        query: "What is quantum computing?",
      },
      news: {
        query: "latest AI news",
      },
    },
    responses: {
      default: {
        output:
          "Quantum computing is a type of computing that uses quantum-mechanical phenomena...",
        references: [
          {
            title: "Quantum Computing Explained",
            url: "https://example.com/quantum",
            snippet: "An introduction to quantum computing principles...",
          },
        ],
      },
      news: {
        output: "Recent developments in AI include...",
        references: [
          {
            title: "Breaking: GPT-5 Announced",
            url: "https://example.com/gpt5",
            snippet:
              "OpenAI announces the next generation of language models...",
          },
        ],
      },
    },
  },
});

const kagiSearchDefinition = { GET };

export default kagiSearchDefinition;

// Export types
export type KagiSearchGetRequestInput = typeof GET.types.RequestInput;
export type KagiSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type KagiSearchGetResponseInput = typeof GET.types.ResponseInput;
export type KagiSearchGetResponseOutput = typeof GET.types.ResponseOutput;
export type KagiSearchGetUrlVariablesInput = typeof GET.types.UrlVariablesInput;
export type KagiSearchGetUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;
