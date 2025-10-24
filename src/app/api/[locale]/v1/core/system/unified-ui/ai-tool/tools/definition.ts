/**
 * AI Tools List Endpoint Definition
 * Returns available AI tools for current user
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

// AI Tool metadata schema - serializable version for API response
// Note: parameters field is omitted as Zod schemas cannot be JSON serialized
const aiToolMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()),
  endpointId: z.string(),
  allowedRoles: z.array(z.string()),
  isManualTool: z.boolean(),
});

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "unified-ui", "ai-tool", "tools"],
  aliases: ["ai-tools", "tools:list"],
  title: "app.api.v1.core.system.unifiedUi.aiTool.tools.get.title" as const,
  description:
    "app.api.v1.core.system.unifiedUi.aiTool.tools.get.description" as const,
  category: "app.api.v1.core.system.unifiedUi.aiTool.tools.category" as const,
  tags: ["app.api.v1.core.system.unifiedUi.aiTool.tools.tags.tools" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.response.title" as const,
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.response.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      tools: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedUi.aiTool.tools.get.fields.tools.title" as const,
        },
        z.array(aiToolMetadataSchema),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.server.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedUi.aiTool.tools.get.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.unifiedUi.aiTool.tools.get.success.title",
    description:
      "app.api.v1.core.system.unifiedUi.aiTool.tools.get.success.description",
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

export { GET };

export default toolsDefinition;

// Export types as required by migration guide
export type AIToolsListRequestInput = typeof GET.types.RequestInput;
export type AIToolsListRequestOutput = typeof GET.types.RequestOutput;
export type AIToolsListResponseInput = typeof GET.types.ResponseInput;
export type AIToolsListResponseOutput = typeof GET.types.ResponseOutput;
