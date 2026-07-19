/**
 * execute-tool's DISPATCH request fields — the seam between "which tool do I run"
 * and "where/when does it run".
 *
 * WHAT LIVES HERE
 * The two request fields that do not describe the CALL, but its DISPATCH:
 *   - instanceId    → run it on ANOTHER instance (remote-connection)
 *   - callbackMode  → run it at another TIME (task system: detach / wakeUp /
 *                     approve / endLoop)
 *
 * WHY IT IS ITS OWN FILE
 * `toolName` + `input` are universal: every deployment that can execute a tool at
 * all understands them. These two are not — each is only meaningful when the
 * machinery behind it exists (remote-connection for instanceId; the task system,
 * confirmation round-trip and AI loop for callbackMode). This mirrors the
 * repository/orchestration.ts seam at the DEFINITION layer: orchestration.ts
 * gates the BEHAVIOUR of the non-local branches, this file gates the CONTRACT
 * that advertises them.
 *
 * A deployment that runs tools only here, now, inline (CLI + MCP, no task system,
 * no remote instances) swaps this import in ./definition.ts for
 * ./definition-dispatch-fields-local. That drops both fields from the request
 * schema entirely, so the surface never ADVERTISES a mode it cannot honour.
 *
 * Advertising is the whole point: request schemas are not strict, so a stray
 * callbackMode would be silently stripped either way. What changes is that the
 * field no longer appears in the tool catalog the model reads — and a model only
 * sends what it is offered. A field that is offered, accepted and then ignored is
 * the bug being closed here: callbackMode="detach" returning an inline result for
 * a task that was never created.
 */

import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/ai/i18n";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CallbackMode } from "./constants";

/** Spread into the execute-tool definition's `children`. */
export const dispatchRequestFields = {
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
} as const;

/**
 * Spread into the execute-tool definition's `children`.
 *
 * The dispatch OUTPUTS. A call that runs inline returns its payload in `result`
 * and nothing else; only a dispatched call has a task to name (`taskId`), a model
 * to steer afterwards (`hint`), or an outcome that arrives detached from the
 * request (`status`, carried on the tool-execute-result wire event). These are
 * the response half of the same seam as dispatchRequestFields.
 */
export const dispatchResponseFields = {
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
} as const;

/** Spread into the definition's `examples.requests`. */
export const dispatchRequestExamples = {
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
} as const;

/** Spread into the definition's `examples.responses`. */
export const dispatchResponseExamples = {
  // Remote / async execution returns a task ID instead of an inline result.
  remote: {
    taskId: "task-uuid-here",
    hint: "Result/return will be injected when complete and wakes up the thread. Call await-task only if you need the result before continuing.",
  },
} as const;
