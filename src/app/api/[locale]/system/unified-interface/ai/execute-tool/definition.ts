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
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";
export const EXECUTE_TOOL_ALIAS = "execute-tool" as const;
import { ExecuteToolWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "ai", "execute-tool"],
  aliases: [
    EXECUTE_TOOL_ALIAS,
    "execute",
    "execute-tool",
    "route-execute",
    "tool-execute",
  ],
  title: "executeTool.post.title" as const,
  description: "executeTool.post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.toolName) {
      return {
        message: "executeTool.post.dynamicTitle" as const,
        messageParams: { toolName: request.toolName },
      };
    }
    return undefined;
  },
  icon: "zap",
  category: "app.endpointCategories.system",
  tags: ["tools.get.tags.tools" as const],
  cli: {
    firstCliArgKey: "toolName",
  },

  // Public — the target route enforces its own auth
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.MCP_VISIBLE,
  ] as const,

  fields: customWidgetObject({
    render: ExecuteToolWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // ── Request fields ────────────────────────────────────────────────────
      toolName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "executeTool.post.fields.toolName.label",
        description: "executeTool.post.fields.toolName.description",
        placeholder: "executeTool.post.fields.toolName.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      input: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "executeTool.post.fields.input.label",
        description: "executeTool.post.fields.input.description",
        columns: 12,
        schema: z.record(z.string(), z.unknown()).default({}),
      }),

      instanceId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "executeTool.post.fields.instanceId.label",
        description: "executeTool.post.fields.instanceId.description",
        columns: 12,
        schema: z.string().optional(),
      }),

      // ── Response fields ───────────────────────────────────────────────────
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "executeTool.post.response.result" as const,
        columns: 12,
        schema: z.unknown().optional(),
      }),

      taskId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),

      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "executeTool.post.errors.validation.title",
      description: "executeTool.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "executeTool.post.errors.unauthorized.title",
      description: "executeTool.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "executeTool.post.errors.forbidden.title",
      description: "executeTool.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "executeTool.post.errors.notFound.title",
      description: "executeTool.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "executeTool.post.errors.server.title",
      description: "executeTool.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "executeTool.post.errors.network.title",
      description: "executeTool.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "executeTool.post.errors.unknown.title",
      description: "executeTool.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "executeTool.post.errors.server.title",
      description: "executeTool.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "executeTool.post.errors.server.title",
      description: "executeTool.post.errors.server.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "executeTool.post.success.title",
    description: "executeTool.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        toolName: "agent_chat_characters_GET",
        input: {},
      },
      remoteExecution: {
        toolName: "bash",
        input: { command: "echo hello" },
        instanceId: "hermes",
      },
    },
    responses: {
      // Response is the target route's .data passed through in `result`
      default: { result: {} },
      // Remote execution returns a task ID (async)
      remote: { taskId: "task-uuid-here", status: "pending" },
    },
  },
});

const executeDefinition = { POST };

export default executeDefinition;

// Export types
export type RouteExecuteRequestInput = typeof POST.types.RequestInput;
export type RouteExecuteRequestOutput = typeof POST.types.RequestOutput;
export type RouteExecuteResponseInput = typeof POST.types.ResponseInput;
