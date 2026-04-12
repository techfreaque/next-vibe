/**
 * Kagi Search Endpoint Definition
 * Web search and FastGPT capability for AI agents
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

import { KAGI_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";
import { KagiSearchResultsContainer } from "./widget";

/**
 * GET /kagi - Get AI-powered answers with Kagi FastGPT
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "search", "kagi"],
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

  // Credit cost - use calculated price from centralized pricing
  credits: FEATURE_COSTS.KAGI_SEARCH, // 1.95 credits per search
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiSearch",
  tags: ["tags.search" as const, "tags.web" as const, "tags.ai" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  // CLI alias for better UX
  aliases: [KAGI_ALIAS] as const,
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
  icon: "search",

  fields: customWidgetObject({
    render: KagiSearchResultsContainer,
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

      backButton: backButton(scopedTranslation, {
        label: "get.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.MARKDOWN,
        content: "get.response.output.title" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      references: responseArrayField(scopedTranslation, {
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
              content: "get.response.references.title" as const,
              schema: z.string(),
            }),
            url: responseField(scopedTranslation, {
              type: WidgetType.LINK,
              href: "/{url}",
              text: "get.response.references.item.url" as const,
              external: true,
              schema: z.string(),
            }),
            snippet: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.references.item.snippet" as const,
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
