/**
 * System Prompt Debug Endpoint
 * Admin/dev-only - renders the full system prompt for a given user context.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const SystemPromptDebugWidget = lazyWidget(() =>
  import("./widget.cli").then((m) => ({ default: m.SystemPromptDebugWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "ai-stream", "system-prompt", "debug"],
  aliases: ["system-prompt-debug"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "terminal",
  dynamicIcon: () => "terminal" as const,
  statusBadge: {
    loading: {
      label: "get.status.loading" as const,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    done: {
      label: "get.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["get.tags.debug" as const],
  defaultExpanded: false,
  options: {
    queryOptions: {
      enabled: false,
    },
    formOptions: {
      autoSubmit: false,
    },
  },

  fields: customWidgetObject({
    render: SystemPromptDebugWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.rootFolderId.label" as const,
        description: "get.fields.rootFolderId.description" as const,
        placeholder: "get.fields.rootFolderId.placeholder" as const,
        schema: z
          .nativeEnum(DefaultFolderId)
          .default(DefaultFolderId.PRIVATE)
          .describe(
            "Folder context: private | public | incognito | cron | shared | support",
          ),
      }),
      userRole: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.userRole.label" as const,
        description: "get.fields.userRole.description" as const,
        placeholder: "get.fields.userRole.placeholder" as const,
        schema: z
          .enum(["public", "customer", "admin"])
          .default("admin")
          .describe("Simulated user role: public | customer | admin"),
      }),
      userMessage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.userMessage.label" as const,
        description: "get.fields.userMessage.description" as const,
        placeholder: "get.fields.userMessage.placeholder" as const,
        schema: z
          .string()
          .optional()
          .describe(
            "User message to drive cortex embedding search - what the user would ask",
          ),
      }),
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.threadId.label" as const,
        description: "get.fields.threadId.description" as const,
        placeholder: "get.fields.threadId.placeholder" as const,
        schema: z.string().uuid().optional().describe("Thread ID for context"),
      }),
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.userId.label" as const,
        description: "get.fields.userId.description" as const,
        placeholder: "get.fields.userId.placeholder" as const,
        schema: z
          .string()
          .uuid()
          .optional()
          .describe("Target user ID (defaults to own account)"),
      }),
      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.skillId.label" as const,
        description: "get.fields.skillId.description" as const,
        placeholder: "get.fields.skillId.placeholder" as const,
        schema: z.string().uuid().optional().describe("Skill ID to inject"),
      }),
      subFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.subFolderId.label" as const,
        description: "get.fields.subFolderId.description" as const,
        placeholder: "get.fields.subFolderId.placeholder" as const,
        schema: z.string().uuid().optional().describe("Sub-folder UUID"),
      }),

      // === RESPONSE ===
      systemPrompt: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.systemPrompt.text" as const,
        schema: z.string().describe("Full leading system prompt"),
      }),
      trailingSystemMessage: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.trailingSystemMessage.text" as const,
        schema: z.string().describe("Trailing system message (cortex context)"),
      }),
      charCount: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.charCount.text" as const,
        schema: z.number().describe("Total character count"),
      }),
      tokenEstimate: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.tokenEstimate.text" as const,
        schema: z.number().describe("Estimated token count (chars / 4)"),
      }),
      cortexDiagnostics: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.cortexDiagnostics.text" as const,
        schema: z
          .object({
            embeddingGenerated: z.boolean(),
            topScores: z.array(
              z.object({
                path: z.string(),
                baseSimilarity: z.number(),
                recencyBoost: z.number(),
                pathWeight: z.number(),
                adjustedScore: z.number(),
                passesThreshold: z.boolean(),
              }),
            ),
          })
          .optional()
          .describe("Raw embedding scores for top 20 matches (debug only)"),
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
      private: {
        rootFolderId: DefaultFolderId.PRIVATE,
        userRole: "admin" as const,
        userMessage: "What tools can you use?",
      },
      public: {
        rootFolderId: DefaultFolderId.PUBLIC,
        userRole: "customer" as const,
        userMessage: "Hello, who are you?",
      },
      incognito: {
        rootFolderId: DefaultFolderId.INCOGNITO,
        userRole: "public" as const,
      },
    },
    responses: {
      default: {
        systemPrompt: "## Identity\nYou are an AI assistant...",
        trailingSystemMessage: "## Cortex (Your Persistent Brain)...",
        charCount: 12400,
        tokenEstimate: 3100,
      },
    },
  },
});

export type SystemPromptDebugResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
