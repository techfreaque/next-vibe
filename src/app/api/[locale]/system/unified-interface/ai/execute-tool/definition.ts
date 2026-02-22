/**
 * Route Execute Endpoint Definition
 * POST /api/[locale]/system/unified-interface/ai/execute-tool
 *
 * Universal route executor — call any registered endpoint by toolName + input.
 * Auth is enforced by the target route; this endpoint is intentionally public
 * so MCP, AI tools, and external callers can delegate execution.
 *
 * Usage (CLI):
 *   vibe system_unified-interface_ai_execute-tool_POST \
 *     --toolName=agent_chat_characters_GET \
 *     --input='{}'
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

export const EXECUTE_TOOL_ALIAS = "execute-tool" as const;

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "unified-interface", "ai", "execute-tool"],
  aliases: [
    EXECUTE_TOOL_ALIAS,
    "execute",
    "execute-tool",
    "route-execute",
    "tool-execute",
  ],
  title: "app.api.system.unifiedInterface.ai.executeTool.post.title" as const,
  description:
    "app.api.system.unifiedInterface.ai.executeTool.post.description" as const,
  icon: "zap",
  category: "app.api.system.category" as const,
  tags: ["app.api.system.unifiedInterface.mcp.serve.tags.mcp" as const],

  // Public — the target route enforces its own auth
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.MCP_ON,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.container.title" as const,
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.container.description" as const,
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // ── Request fields ────────────────────────────────────────────────────
      toolName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.ai.executeTool.post.fields.toolName.label",
        description:
          "app.api.system.unifiedInterface.ai.executeTool.post.fields.toolName.description",
        placeholder:
          "app.api.system.unifiedInterface.ai.executeTool.post.fields.toolName.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      input: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label:
          "app.api.system.unifiedInterface.ai.executeTool.post.fields.input.label",
        description:
          "app.api.system.unifiedInterface.ai.executeTool.post.fields.input.description",
        columns: 12,
        schema: z.record(z.string(), z.unknown()).default({}),
      }),

      // ── Response fields ───────────────────────────────────────────────────
      result: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label:
          "app.api.system.unifiedInterface.ai.executeTool.post.response.result" as const,
        columns: 12,
        schema: z.unknown().optional(),
      }),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.ai.executeTool.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.unifiedInterface.ai.executeTool.post.success.title",
    description:
      "app.api.system.unifiedInterface.ai.executeTool.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        toolName: "agent_chat_characters_GET",
        input: {},
      },
    },
    responses: {
      // Response is the target route's .data passed through in `result`
      default: { result: {} },
    },
  },
});

const executeDefinition = { POST };

export default executeDefinition;

// Export types
export type RouteExecuteRequestInput = typeof POST.types.RequestInput;
export type RouteExecuteRequestOutput = typeof POST.types.RequestOutput;
export type RouteExecuteResponseInput = typeof POST.types.ResponseInput;
