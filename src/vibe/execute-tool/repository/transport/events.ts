/**
 * Event transport leg — emits the definition-driven tool-execute-request
 * toward the peer; the bridge picks the wire (reverse-ws or direct-http) from
 * the connection's transportMode. Caller context rides the payload envelope.
 */
import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { WidgetData } from "../../../core/utils/json";
import type { Platform } from "../../../platforms/platforms";
import type { CallbackModeValue } from "../../constants";
import executeDefinition from "../../definition";
import type { RouteExecuteContext } from "../types";

/**
 * Emit the definition-driven `tool-execute-request` event toward the peer. The
 * bridge routes it over the connection's leg; the peer's
 * onRemoteEvent["tool-execute-request"] runs it and emits `tool-execute-result`.
 */
export async function emitToolRequest(params: {
  callId: string;
  userId: string;
  toolName: string;
  input: Record<string, WidgetData> | null;
  callbackMode: CallbackModeValue;
  callerPlatform: Platform;
  callerSkillId: string | null;
  callerFavoriteId: string | null;
  /**
   * The dispatching execution's fixture thread id — forwarded on the wire so
   * the receiver records/replays the relayed execution's external calls
   * under the SAME per-test directory. Explicit chain, never ambient.
   */
  toolExecutionContext: ToolExecutionContext;
  locale: string;
  logger: RouteExecuteContext["logger"];
  user: RouteExecuteContext["user"];
}): Promise<void> {
  const { createEndpointEmitter } =
    await import("../../../realtime/core/emitter");
  // The wire carries only the caller's fixture thread id (a string) — the
  // receiver rebuilds its own headless context around it. Spreading the full
  // ToolExecutionContext object would not match the string wire schema.
  const threadId = params.toolExecutionContext.threadId;
  createEndpointEmitter(
    executeDefinition.POST,
    params.logger,
    params.user,
  )("tool-execute-request", {
    requestData: {
      toolName: params.toolName,
      input: params.input ?? {},
      // The receiver runs the tool LOCALLY — no further instanceId hop.
      instanceId: undefined,
      callbackMode: params.callbackMode,
    },
    payload: {
      callId: params.callId,
      userId: params.userId,
      locale: params.locale,
      // Wire-internal caller context: identity for fieldDefaults + the
      // surface the receiver gates/renders under. Envelope side-channel —
      // never the public request schema.
      callerSkillId: params.callerSkillId ?? undefined,
      callerFavoriteId: params.callerFavoriteId ?? undefined,
      callerPlatform: params.callerPlatform,
      ...(threadId ? { toolExecutionContext: threadId } : {}),
    },
  });
}
