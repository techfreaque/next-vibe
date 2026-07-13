/**
 * Route Execute Endpoint Definition
 * POST /api/[locale]/system/unified-interface/execute-tool
 *
 * Universal route executor - call any registered endpoint by toolName + input.
 * Auth is enforced by the target route; this endpoint is intentionally public
 * so MCP, AI tools, and external callers can delegate execution.
 *
 * Usage (CLI):
 *   vibe execute-tool \
 *     --toolName=agent_chat_characters_GET \
 *     --input='{}'
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/core/definition/platform";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/ai/i18n";
import { taskInputSchema } from "next-vibe/tasks/cron/db";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { CallbackMode, EXECUTE_TOOL_ALIAS } from "./constants";

const ExecuteToolWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ExecuteToolWidget,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "execute-tool"],
  aliases: [EXECUTE_TOOL_ALIAS],
  title: "executeTool.post.title" as const,
  titleShort: "executeTool.post.titleShort" as const,
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
  timeoutMs: 0,
  icon: "zap",
  category: "ai",
  subCategory: "Tools",
  tags: ["tools.get.tags.tools" as const],
  cli: {
    firstCliArgKey: "toolName",
  },

  // Public - the target route enforces its own auth
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.MCP_VISIBLE,
  ] as const,
  defaultAiPinned: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
  ] as const,
  fields: customWidgetObject({
    render: ExecuteToolWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      // ── Request fields ────────────────────────────────────────────────────
      toolName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "executeTool.post.fields.toolName.label",
        description: "executeTool.post.fields.toolName.description",
        placeholder: "executeTool.post.fields.toolName.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),

      input: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "executeTool.post.fields.input.label",
        description: "executeTool.post.fields.input.description",
        columns: 12,
        schema: taskInputSchema.default({}),
      }),

      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "executeTool.post.fields.instanceId.label",
        description: "executeTool.post.fields.instanceId.description",
        visibleFor: [
          UserRole.CUSTOMER,
          UserRole.PARTNER_ADMIN,
          UserRole.PARTNER_EMPLOYEE,
          UserRole.ADMIN,
        ] as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      callbackMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "executeTool.post.fields.callbackMode.label",
        description: "executeTool.post.fields.callbackMode.description",
        visibleFor: [
          UserRole.CUSTOMER,
          UserRole.PARTNER_ADMIN,
          UserRole.PARTNER_EMPLOYEE,
          UserRole.ADMIN,
        ] as const,
        columns: 12,
        schema: z
          .enum([
            CallbackMode.WAIT,
            CallbackMode.DETACH,
            CallbackMode.END_LOOP,
            CallbackMode.WAKE_UP,
            CallbackMode.APPROVE,
          ])
          .optional()
          .default(CallbackMode.WAIT),
      }),

      // ── Response fields ───────────────────────────────────────────────────

      result: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "executeTool.post.response.result" as const,
        columns: 12,
        schema: WidgetDataSchema.optional(),
      }),

      taskId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),

      hint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().optional(),
      }),

      // Explicit execution outcome on the tool-execute-result wire event.
      // Without it the requester had to INFER failure from hint presence —
      // a successful result carrying a hint would be misclassified as failed.
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.enum(["completed", "failed"]).optional(),
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

  // === EVENTS (server-side wire protocol) ===
  // Tool dispatch wire events — server-only, never delivered to client.
  events: {
    "tool-execute-request": {
      remoteEvent: true as const,
      clientDelivery: false as const,
      requestFields: [
        "callbackMode",
        "input",
        "instanceId",
        "toolName",
      ] as const,
      // Roundtrip context: the receiver echoes callId in tool-execute-result so
      // the requester's pending-call registry resolves. Carried in the envelope
      // `payload` side-channel, separate from the execution args (requestFields).
      payloadType: z.object({
        callId: z.string(),
        userId: z.string(),
        locale: z.string(),
        // Wire-internal caller context — NEVER public request fields (those
        // leak into every UI/CLI/MCP/AI schema). The receiver's fieldDefaults
        // resolve against the CALLER's skill/favorite, and the tool is gated
        // and rendered under the CALLER's surface. AI dispatch always rides
        // this event envelope, on both reverse-ws and direct-http legs.
        callerSkillId: z.string().optional(),
        callerFavoriteId: z.string().optional(),
        callerPlatform: z.enum(Platform).optional(),
        // Tests only: the caller's fixture-scope thread id. The receiver reads
        // that thread's fixture prefix + ordinal counter from its OWN synced
        // copy (the thread syncs cross-instance), so its external calls
        // record/replay in the caller's folder and continue the same ordinal
        // sequence. A plain thread id — absence is the switch (no env flag).
        streamContext: z.string().optional(),
      }),
    },
    "tool-execute-result": {
      remoteEvent: true as const,
      clientDelivery: false as const,
      responseFields: ["hint", "result", "status", "taskId"] as const,
    },
    // Mid-execution control for a single in-flight tool call (cross-PROCESS,
    // same-instance — NOT cross-instance). A running WAIT execution subscribes to
    // this event on the pub/sub bus keyed by its callId; the call-control tools
    // (cancel / detach / resume-when-done) emit it. The action mirrors a callback
    // mode — the running call converts itself (cancel → interrupt+error result,
    // detach → DETACH, wakeUp → WAKE_UP). Server-only signal, never client-delivered.
    "tool-control": {
      clientDelivery: false as const,
      payloadType: z.object({
        callId: z.string(),
        action: z.enum(["cancel", "detach", "wakeUp"]),
      }),
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        toolName: "agent_chat_characters_GET",
        input: {},
      },
      remoteBackground: {
        toolName: "bash",
        input: { command: "echo hello" },
        instanceId: "hermes",
        callbackMode: CallbackMode.DETACH,
      },
      remoteWakeUp: {
        toolName: "bash",
        input: { command: "ls /tmp" },
        instanceId: "hermes",
        callbackMode: CallbackMode.WAKE_UP,
      },
    },
    responses: {
      // Response is the target route's .data passed through in `result`
      default: { result: {} },
      // Remote execution returns a task ID (async)
      remote: {
        taskId: "task-uuid-here",
        hint: "Result/return will be injected when complete and wakes up the thread. Call await-task only if you need the result before continuing.",
      },
    },
  },
});

const executeDefinition = { POST } as const;

export default executeDefinition;

// Export types
export type RouteExecuteRequestInput = typeof POST.types.RequestInput;
export type RouteExecuteRequestOutput = typeof POST.types.RequestOutput;
export type RouteExecuteResponseOutput = typeof POST.types.ResponseOutput;
