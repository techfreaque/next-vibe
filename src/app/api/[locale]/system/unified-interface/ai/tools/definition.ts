/**
 * AI Tools List Endpoint Definition
 * Returns available AI tools for current user
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

// AI Tool metadata schema - serializable version for API response
// Note: parameters field is omitted as Zod schemas cannot be JSON serialized
const aiToolMetadataSchema = z.object({
  name: z.string(),
  method: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()),
  toolName: z.string(),
  allowedRoles: z.array(z.string()).readonly(),
  aliases: z.array(z.string()).optional(),
  requiresConfirmation: z.boolean().optional(),
});

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "ai", "tools"],
  aliases: ["ai-tools", "tools:list"],
  title: "app.api.system.unifiedInterface.ai.tools.get.title" as const,
  description:
    "app.api.system.unifiedInterface.ai.tools.get.description" as const,
  icon: "wand",
  category: "app.api.system.unifiedInterface.ai.tools.category" as const,
  tags: ["app.api.system.unifiedInterface.ai.tools.tags.tools" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.ai.tools.get.response.title" as const,
      description:
        "app.api.system.unifiedInterface.ai.tools.get.response.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      tools: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.ai.tools.get.fields.tools.title" as const,
        },
        z.array(aiToolMetadataSchema),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.unifiedInterface.ai.tools.get.errors.server.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unsavedChanges.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.ai.tools.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.ai.tools.get.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.unifiedInterface.ai.tools.get.success.title",
    description:
      "app.api.system.unifiedInterface.ai.tools.get.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        tools: [],
      },
    },
  },
});

const toolsDefinition = { GET };

export default toolsDefinition;

// Export types as required by migration guide
export type AIToolsListRequestInput = typeof GET.types.RequestInput;
export type AIToolsListRequestOutput = typeof GET.types.RequestOutput;
export type AIToolsListResponseInput = typeof GET.types.ResponseInput;
export type AIToolsListResponseOutput = typeof GET.types.ResponseOutput;

// Inferred types for component use
export type AIToolMetadataSerialized = AIToolsListResponseOutput["tools"][0];
