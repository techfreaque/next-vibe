/**
 * AI Tools Loader
 * ONLY file in AI folder - creates AI SDK CoreTool objects from endpoints
 * All other logic (discovery, filtering, execution) is in shared/
 */

import "server-only";

import { jsonSchema, type JSONSchema7, tool } from "ai";
import { claimExecuteToolCallId } from "next-vibe/agent/ai-stream/repository/core/stream";
import {
  FOLDER_ALLOWS_REMOTE_TOOLS,
  FOLDER_BLOCKED_CALLBACK_MODES,
  type ToolExecutionContext,
} from "next-vibe/agent/chat/config";
import {
  endpointToToolName,
  getPreferredToolName,
} from "next-vibe/core/core-utils/path";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { FieldUsage } from "next-vibe/core/definition/enums";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import {
  CallbackMode,
  EXECUTE_TOOL_ALIAS,
} from "next-vibe/execute-tool/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { filterUserPermissionRoles } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  collectServerDefaults,
  generateSchemaForUsage,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { getEndpoint } from "@/generated/endpoints/endpoint";

/**
 * CoreTool type from AI SDK
 * This is the ONLY tool type we use - no custom wrappers or conversions
 * The actual types are inferred by the tool() function at creation time
 * We don't specify generic parameters - they're inferred from the tool() call
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CoreTool = ReturnType<typeof tool<any, any>>;

/**
 * Create AI SDK CoreTool from endpoint
 * This is the ONLY AI-specific logic - converting to AI SDK format
 */
function createToolFromEndpoint(
  endpoint: CreateApiEndpointAny,
  context: {
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
    requiresConfirmation: boolean;
  },
): CoreTool {
  const { t } = endpoint.scopedTranslation.scopedT(context.locale);
  // Generate description
  const description = t(endpoint.description || endpoint.title);

  // Generate Zod schema from fields (with transforms)
  // Pass caller roles so `visibleFor`-gated fields are excluded from the AI tool schema
  const permissionRoles = filterUserPermissionRoles(context.user.roles);
  const zodSchemaWithTransforms = generateInputSchema(
    endpoint,
    permissionRoles,
  );

  // Target draft-7 to ensure compatibility with AI SDK's JSONSchema7 type
  // io:"input" converts the input side of transforms (what AI should pass, not the output)
  // unrepresentable:"any" prevents throwing on types that can't be represented
  // override handles edge cases: transform inputs and z.custom() types
  const jsonSchemaObject = z.toJSONSchema(zodSchemaWithTransforms, {
    target: "draft-7",
    io: "input",
    unrepresentable: "any",
    override: (ctx) => {
      // For custom types (e.g. z.custom<T>()), describe as generic JSON object
      if (ctx.zodSchema._zod.def.type === "custom") {
        ctx.jsonSchema.type = "object";
      }
    },
  });

  // Preferred name (alias if available): Used for AI SDK, execution, and all lookups
  const toolName = getPreferredToolName(endpoint);

  // Inject optional control parameters into the JSON schema so the AI knows
  // it can pass them alongside regular tool args. These are stripped during
  // validation and handled separately by tool-call-handler and the execute handler.
  //
  // Skip injection for:
  // - await-task: has its own stream-pause mechanism, callbackMode would interfere
  // - execute-tool: has callbackMode as a native field in its definition schema
  const schemaObj = jsonSchemaObject as JSONSchema7 & {
    properties?: Record<string, JSONSchema7>;
  };
  if (toolName !== "await-task" && toolName !== EXECUTE_TOOL_ALIAS) {
    // Filter out callback modes blocked for this folder type.
    const blockedModes = new Set(
      FOLDER_BLOCKED_CALLBACK_MODES[context.streamContext.rootFolderId] ?? [],
    );
    const allowedModes = allCallbackModes.filter((m) => !blockedModes.has(m));

    if (!schemaObj.properties) {
      schemaObj.properties = {};
    }
    if (allowedModes.length > 0) {
      schemaObj.properties.callbackMode = {
        type: "string",
        enum: allowedModes,
        description:
          "OMIT for normal tool calls - result is returned synchronously, loop continues. " +
          "Only set when you need async: " +
          "'detach' - fire-and-forget, returns {taskId}, use await-task later. " +
          "'wakeUp' - fire-and-forget, result auto-injected when ready, do NOT call await-task. " +
          "'endLoop' - stops entire AI turn after this batch, use ONLY as final action. " +
          "'approve' - requires user confirmation before executing.",
      };
    }
  }

  // Wrap JSON Schema in AI SDK's jsonSchema() function
  // This creates a FlexibleSchema that the AI SDK can use
  const inputSchema = jsonSchema(jsonSchemaObject as JSONSchema7, {
    validate: (value) => {
      // Extract callbackMode before validation (not part of endpoint schema).
      // callbackMode is read by tool-call-handler for stream control (endLoop, approve)
      // and by the execute handler below for async modes (detach, wakeUp).
      const callbackModeRaw =
        typeof value === "object" &&
        value !== null &&
        "callbackMode" in value &&
        typeof value.callbackMode === "string"
          ? value.callbackMode
          : undefined;

      // Use the original Zod schema (with transforms) for validation
      const result = zodSchemaWithTransforms.safeParse(value);
      if (result.success) {
        // Add callbackMode back to the validated data so it reaches tool-call-handler
        return {
          success: true,
          value:
            callbackModeRaw !== undefined
              ? { ...result.data, callbackMode: callbackModeRaw }
              : result.data,
        };
      }
      return {
        success: false,
        error: result.error,
      };
    },
  });

  return tool({
    description,
    inputSchema,
    execute: async (params, options) => {
      // Extract callbackMode from params - async modes (detach, wakeUp) route through
      // RouteExecuteRepository which handles task creation, backfill, and resume-stream.
      // For execute-tool itself, callbackMode must stay in restParams so the route
      // handler receives it (execute-tool handles all callbackModes natively).
      const { callbackMode: callbackModeParam, ...strippedParams } = (params ??
        {}) as Record<string, WidgetData>;
      const baseParams =
        toolName === EXECUTE_TOOL_ALIAS && callbackModeParam !== undefined
          ? { ...strippedParams, callbackMode: callbackModeParam }
          : strippedParams;

      // Apply field-level serverDefault callbacks for hidden fields.
      // Fields with hiddenForPlatforms are stripped from the AI tool schema,
      // but serverDefault resolves trusted values from request context.
      const serverDefaults = collectServerDefaults(
        endpoint.fields,
        permissionRoles,
        Platform.AI,
      );
      const serverDefaultPatch: Record<string, WidgetData> = {};
      if (Object.keys(serverDefaults).length > 0) {
        const ctx = {
          user: context.user,
          locale: context.locale,
          platform: Platform.AI as Platform,
          streamContext: context.streamContext,
        };
        for (const [key, resolver] of Object.entries(serverDefaults)) {
          const resolved = await resolver(ctx);
          if (resolved !== undefined) {
            serverDefaultPatch[key] = resolved;
          }
        }
      }

      const restParams: Record<string, WidgetData> = {
        ...baseParams,
        ...serverDefaultPatch,
      };

      // CallbackMode is imported at the top of the file - use it directly (no async import needed)
      const callbackMode =
        typeof callbackModeParam === "string" &&
        Object.values(CallbackMode).includes(callbackModeParam as never)
          ? (callbackModeParam as (typeof CallbackMode)[keyof typeof CallbackMode])
          : null;

      context.logger.debug("[ToolsLoader] CoreTool execute called", {
        toolName,
        callbackMode,
        threadId: context.streamContext.threadId,
        aiMessageId: context.streamContext.aiMessageId,
        streamContextRef: !!context.streamContext,
      });
      // Defense in depth: reject callback modes blocked for this folder type
      // even if the AI bypassed the schema enum restriction.
      const folderBlockedModes =
        FOLDER_BLOCKED_CALLBACK_MODES[context.streamContext.rootFolderId] ?? [];
      if (callbackMode && folderBlockedModes.includes(callbackMode)) {
        context.logger.warn(
          "[ToolsLoader] Blocked callbackMode for restricted folder",
          {
            toolName,
            callbackMode,
            rootFolderId: context.streamContext.rootFolderId,
          },
        );
        return {
          error:
            "This callback mode is not available in this conversation type.",
          hint: "Use synchronous execution (omit callbackMode) instead.",
        };
      }

      // Race tool execution against the abort signal so cancellation
      // kills even long-running tool calls immediately.
      const abortSignal = context.streamContext.abortSignal;
      const executeToolInline = async (): Promise<WidgetData> => {
        // Detach and wakeUp need task creation + backfill + resume-stream scheduling.
        // Route through RouteExecuteRepository which handles both modes.
        // execute-tool always routes through RouteExecuteRepository directly
        // so callerToolCallId (options.toolCallId) is available for deduplication.
        // If this tool requires confirmation, do NOT execute it.
        // The stream layer sets stepHasToolsAwaitingConfirmation=true and aborts at finish-step.
        // Confirmation UI shows, user confirms, then tool-confirmation-handler executes.
        // Return a placeholder so the AI SDK has a result and the stream ends cleanly.
        if (context.requiresConfirmation) {
          context.logger.info(
            "[ToolsLoader] tool requires confirmation - returning placeholder without executing",
            { toolName, callbackMode },
          );
          return {
            status: "waiting_for_confirmation",
            hint: "Waiting for user confirmation before executing.",
          };
        }

        // All tools route through RouteExecuteRepository so execute-tool is the single
        // execution path. This covers WAIT, END_LOOP, DETACH, WAKE_UP, APPROVE, and
        // plain synchronous tools with no callbackMode.
        //
        // For WAIT/END_LOOP modes: eagerly mark waitingForRemoteResult on the SHARED
        // streamContext SYNCHRONOUSLY (before any await). The AI SDK can emit finish-step
        // concurrently with async tool execution. If we wait until after DB operations in
        // RouteExecuteRepository.execute(), FinishStep fires while waitingForRemoteResult
        // is still undefined and skips the REMOTE_TOOL_WAIT abort, leaving thread "idle".
        // We eagerly set it now, then reset it after execute() if no WAIT task was created.
        // For execute-tool: effective callbackMode is in restParams.callbackMode.
        const earlyCallbackMode =
          toolName === EXECUTE_TOOL_ALIAS
            ? restParams.callbackMode
            : callbackMode;
        // For execute-tool: only eagerly set waitingForRemoteResult when there IS a remote
        // instanceId (remote WAIT creates a task that blocks the stream). For local inline
        // execution (no instanceId), execute-tool runs generate_image etc. synchronously and
        // the result is returned inline — setting waitingForRemoteResult=true here would cause
        // processToolResult to skip writing the result to DB (it checks the flag before execute()
        // returns and resets it), leaving the thread with a tool-call but no tool-result →
        // AI_MissingToolResultsError on the next step.
        const isRemoteExecuteToolWait =
          toolName === EXECUTE_TOOL_ALIAS &&
          restParams.instanceId !== undefined &&
          restParams.instanceId !== null;
        const didEagerlySetWaiting =
          (earlyCallbackMode === CallbackMode.WAIT ||
            earlyCallbackMode === CallbackMode.END_LOOP) &&
          !!context.streamContext &&
          (toolName !== EXECUTE_TOOL_ALIAS || isRemoteExecuteToolWait);
        if (didEagerlySetWaiting) {
          context.streamContext.waitingForRemoteResult = true;
        }

        // Inject the correct toolMessageId for this specific parallel tool call.
        // pendingToolMessages is keyed by an EFFECTIVE toolCallId - populated
        // by the loop's tool-call handler under the raw id normally, or under
        // a de-duplicated key when the provider reused the raw id for two
        // calls in one step (see duplicateToolCallKeys on StreamContext).
        // claimExecuteToolCallId resolves which one THIS execute()
        // invocation corresponds to (executeClaimCount tracks how many times
        // we've claimed for this raw id so far - shared with no one else).
        // The AI SDK may call execute() before stream-part-handler processes the tool-call event,
        // so spin-wait up to 200ms (20 × 10ms) for the entry to appear.
        // Resolve per-call toolMessageId BEFORE touching shared streamContext.
        // Two parallel tools each have a distinct options.toolCallId.
        // We must NOT write to context.streamContext.callerToolCallId (shared) here —
        // that would race with the sibling call and both would end up with the same ID.
        // Instead, resolve the values locally and pass a per-call context snapshot.
        let perCallToolMessageId: string | undefined;
        let perCallLeafMessageId: string | null = null;
        let effectiveToolCallId = options?.toolCallId;

        if (options?.toolCallId && context.streamContext) {
          effectiveToolCallId = claimExecuteToolCallId(
            context.streamContext,
            options.toolCallId,
          );
          let pending =
            context.streamContext.pendingToolMessages?.get(effectiveToolCallId);
          if (!pending) {
            // Brief spin-wait: stream-part-handler is processing the tool-call event concurrently.
            // In practice this resolves within 1-2 ticks; 200ms cap is a generous safety bound.
            for (let i = 0; i < 20 && !pending; i++) {
              await new Promise<void>((resolve) => {
                setTimeout(resolve, 10);
              });
              pending =
                context.streamContext.pendingToolMessages?.get(
                  effectiveToolCallId,
                );
            }
          }
          if (pending) {
            perCallToolMessageId = pending.messageId;
            perCallLeafMessageId =
              pending.toolCallData?.parentId ??
              context.streamContext.leafMessageId ??
              null;
          }
        }

        const { RouteExecuteRepository } =
          await import("next-vibe/execute-tool/repository");
        const { scopedTranslation: executeScopedT } =
          await import("next-vibe/platforms/ai/i18n");
        const { t: execT } = executeScopedT.scopedT(context.locale);

        // execute-tool: restParams already has the correct shape ({ toolName, input, callbackMode, instanceId? })
        // Other tools: wrap in { toolName, input: restParams, callbackMode }
        const executeData = (
          toolName === EXECUTE_TOOL_ALIAS
            ? restParams
            : { toolName, input: restParams, callbackMode }
        ) as Parameters<typeof RouteExecuteRepository.execute>[0];

        // Build a per-call context snapshot with the resolved IDs.
        // Reset waitingForRemoteResult to false in the copy so we can detect whether
        // RouteExecuteRepository.execute() actually created a WAIT task (sets it to true).
        // This avoids mutating the shared streamContext which would race with sibling parallel calls.
        const perCallStreamContext = context.streamContext
          ? {
              ...context.streamContext,
              waitingForRemoteResult: false as boolean | undefined,
              // Effective (possibly de-duplicated) id, not the raw SDK id -
              // nested lookups (local.ts, remote.ts, guards.ts) read this
              // field back out of pendingToolMessages, so it must match
              // whatever key the entry actually lives under.
              callerToolCallId: effectiveToolCallId,
              currentToolMessageId:
                perCallToolMessageId ??
                context.streamContext.currentToolMessageId,
              leafMessageId:
                perCallLeafMessageId ?? context.streamContext.leafMessageId,
              // Pass the tool's configured stream timeout so execute-tool/escalateToTask
              // can use it instead of the hardcoded 90s default.
              // undefined = not set on definition → callers use default 90_000.
              callerTimeoutMs: endpoint.streamTimeoutMs,
            }
          : context.streamContext;

        context.logger.debug(
          "[ToolsLoader] executing via RouteExecuteRepository",
          {
            toolName,
            callbackMode,
            callerToolCallId: options?.toolCallId,
            currentToolMessageId: perCallStreamContext?.currentToolMessageId,
            aiMessageId: context.streamContext.aiMessageId,
          },
        );

        const result = await RouteExecuteRepository.execute(
          executeData,
          context.user,
          context.locale,
          context.logger,
          execT,
          perCallStreamContext ?? context.streamContext,
          Platform.AI,
        );

        // Propagate waitingForRemoteResult back to the shared streamContext.
        // perCallStreamContext started with waitingForRemoteResult=false; execute() sets it
        // to true only when a real remote WAIT/END_LOOP task was created.
        // If execute() did NOT create a WAIT task, reset the eager flag we set above.
        // Propagate the confirmation gate back to the shared streamContext.
        // execute-tool's gate sets the flag on the per-call snapshot; stopWhen
        // and finish-step read the shared context - without this the stream
        // would start the AI-response turn despite the pending confirmation.
        if (
          perCallStreamContext?.stepHasToolsAwaitingConfirmation &&
          context.streamContext
        ) {
          context.streamContext.stepHasToolsAwaitingConfirmation = true;
        }

        if (perCallStreamContext?.waitingForRemoteResult) {
          // Confirm: a real WAIT task was created - keep the shared flag true
          if (context.streamContext) {
            context.streamContext.waitingForRemoteResult = true;
          }
        } else if (didEagerlySetWaiting && context.streamContext) {
          // No WAIT task created (e.g. local execution, direct HTTP, dedup) - reset
          context.streamContext.waitingForRemoteResult = false;
        }

        if (!result.success) {
          // Return { success: false, message } so tool-result-handler's isErrorResponse
          // check fires (looks for output.success === false + output.message: string).
          // The handler extracts message, creates toolCall.error, sets status="failed".
          // Returning { error: string } loses the structured shape and the tool renders
          // as success in the UI.
          const errMsg: string = result.messageParams?.error
            ? typeof result.messageParams.error === "string" &&
              !result.message.includes(result.messageParams.error)
              ? `${String(result.message)}: ${result.messageParams.error}`
              : String(result.message)
            : String(result.message);
          return { success: false as const, message: errMsg };
        }

        // execute-tool wraps inline (WAIT/END_LOOP) results as { result: actualData }.
        // execute-tool itself expects this shape to stay as-is (the AI reads it).
        // For all other tools, unwrap so the AI sees the tool's actual data directly.
        if (toolName !== EXECUTE_TOOL_ALIAS) {
          const d = result.data as Record<string, WidgetData> | null;
          if (d !== null && typeof d === "object" && "result" in d) {
            return d.result as WidgetData;
          }
        }

        return result.data as WidgetData;
      };

      // If no abort signal, just run inline
      if (!abortSignal) {
        return executeToolInline();
      }

      // Already aborted - bail immediately
      if (abortSignal.aborted) {
        context.logger.info(
          "[ToolsLoader] Stream already cancelled - skipping tool",
          { toolName },
        );
        return { error: "Stream cancelled" };
      }

      // Race: tool execution vs abort signal
      // When abort fires, the promise rejects immediately with AbortError.
      // The tool may keep running in the background but the stream moves on.
      return Promise.race([
        executeToolInline(),
        new Promise<never>((...[, reject]) => {
          const onAbort = (): void => {
            reject(new Error("User cancelled stream"));
          };
          abortSignal.addEventListener("abort", onAbort, { once: true });
        }),
      ]);
    },
  });
}

const allCallbackModes = ["detach", "wakeUp", "endLoop", "approve"];

/**
 * Generate Zod input schema from endpoint fields
 * Combines RequestData and RequestUrlParams for AI tools
 * @param userRoles - Caller roles for field-level visibility enforcement
 */
export function generateInputSchema(
  endpoint: CreateApiEndpointAny,
  userRoles?: ReturnType<typeof filterUserPermissionRoles>,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!endpoint.fields) {
    return z.object({});
  }

  try {
    // Combine request data and URL params
    // Pass Platform.AI so fields with hiddenForPlatforms including AI are excluded
    const requestDataSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestData
    >(endpoint.fields, FieldUsage.RequestData, userRoles, Platform.AI) as
      | z.ZodObject<Record<string, z.ZodTypeAny>>
      | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestUrlParams
    >(endpoint.fields, FieldUsage.RequestUrlParams, userRoles, Platform.AI) as
      | z.ZodObject<Record<string, z.ZodTypeAny>>
      | z.ZodNever;

    const combinedShape: { [key: string]: z.ZodTypeAny } = {};

    if (requestDataSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, requestDataSchema.shape);
    }

    if (urlPathParamsSchema instanceof z.ZodObject) {
      Object.assign(combinedShape, urlPathParamsSchema.shape);
    }

    if (Object.keys(combinedShape).length === 0) {
      return z.object({});
    }

    return z.object(combinedShape);
  } catch {
    return z.object({});
  }
}

/**
 * Build a compact one-line schema summary for a tool catalog entry.
 * Extracts property names and their JSON Schema types from a Zod schema.
 * Returns empty string if the schema has no properties.
 */
function buildSchemaSummary(
  endpoint: CreateApiEndpointAny,
  userRoles: ReturnType<typeof filterUserPermissionRoles>,
): string {
  try {
    const zodSchema = generateInputSchema(endpoint, userRoles);
    const jsonSchemaObj = z.toJSONSchema(zodSchema, {
      target: "draft-7",
      io: "input",
      unrepresentable: "any",
    }) as {
      properties?: Record<string, { type?: string; enum?: WidgetData[] }>;
    };
    const props = jsonSchemaObj.properties;
    if (!props || Object.keys(props).length === 0) {
      return "{}";
    }
    const entries = Object.entries(props).map(([k, v]) => {
      const type = v.enum ? v.enum.map(String).join("|") : (v.type ?? "any");
      return `${k}: ${type}`;
    });
    return `{ ${entries.join(", ")} }`;
  } catch {
    return "{}";
  }
}

/**
 * Build a tool catalog string for injection into the system prompt.
 * The AI uses this to know which tools are available and what inputs they expect.
 * All tools are called via: execute-tool({ toolName, input, callbackMode? })
 */
function buildToolCatalog(
  localEntries: Array<{
    preferredName: string;
    label: string;
    description: string;
    credits: number;
    schemaSummary: string;
    requiresConfirmation: boolean;
  }>,
  remoteEntries: Array<{
    fullName: string;
    label: string;
    description: string;
    credits: number;
  }>,
): string {
  const lines: string[] = [
    "<tool-catalog>",
    "Execute any tool via: execute-tool({ toolName, input, callbackMode? })",
    "callbackMode: omit=sync result | detach=fire-forget+taskId | wakeUp=async-revival | endLoop=stop-turn",
    "",
  ];
  for (const e of localEntries) {
    const confirm = e.requiresConfirmation ? " [confirm]" : "";
    const credits = e.credits > 0 ? ` | ${e.credits} credits` : "";
    lines.push(
      `${e.preferredName}${confirm} — ${e.description} | input: ${e.schemaSummary}${credits}`,
    );
  }
  if (remoteEntries.length > 0) {
    lines.push("");
    for (const e of remoteEntries) {
      const credits = e.credits > 0 ? ` | ${e.credits} credits` : "";
      lines.push(
        `${e.fullName} [remote] — ${e.description} | input: any${credits}`,
      );
    }
  }
  lines.push("</tool-catalog>");
  return lines.join("\n");
}

/**
 * Load tools for AI streaming.
 * Returns a single execute-tool CoreTool (not per-tool registrations).
 * All tool metadata is collected into toolsMeta for UI/billing.
 * A tool catalog is injected into the system prompt so the AI knows available tools.
 */
export async function loadTools(params: {
  requestedTools: string[] | null | undefined;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  systemPrompt: string;
  /** Map of tool IDs to their confirmation requirements (from API request) */
  toolConfirmationConfig?: Map<string, boolean>;
  /** Stream context - rootFolderId, threadId, aiMessageId, etc. */
  streamContext: ToolExecutionContext;
}): Promise<{
  tools: Record<string, CoreTool> | undefined;
  toolsMeta: Map<
    string,
    { requiresConfirmation: boolean; credits: number; label: string }
  >;
  systemPrompt: string;
}> {
  // Empty array = explicitly no tools
  if (
    Array.isArray(params.requestedTools) &&
    params.requestedTools.length === 0
  ) {
    params.logger.debug("Empty tools array, skipping tool loading");
    return {
      tools: undefined,
      toolsMeta: new Map(),
      systemPrompt: params.systemPrompt,
    };
  }

  try {
    const toolNames = params.requestedTools ?? [];

    // Split into local and remote tool names
    // Remote tools are prefixed: "instanceId__toolName"
    const localToolNames: string[] = [];
    const remoteToolNames: string[] = [];
    for (const n of toolNames) {
      if (n.includes("__")) {
        remoteToolNames.push(n);
      } else {
        localToolNames.push(n);
      }
    }

    const toolsMeta = new Map<
      string,
      { requiresConfirmation: boolean; credits: number; label: string }
    >();

    const permissionRoles = filterUserPermissionRoles(params.user.roles);

    // ── Local tools — build toolsMeta + catalog entries ───────────────────────
    const loaded = await Promise.all(localToolNames.map((n) => getEndpoint(n)));
    const enabledEndpoints = loaded.filter(
      (e): e is CreateApiEndpointAny =>
        e !== null &&
        permissionsRegistry.filterEndpointsByPermissions(
          [e],
          params.user,
          Platform.AI,
        ).length > 0,
    );

    params.logger.debug("[Tools Loader] Loading requested tools", {
      requested: toolNames.length,
      local: enabledEndpoints.length,
      remote: remoteToolNames.length,
    });

    // Track the execute-tool endpoint for CoreTool creation
    let executeToolEndpoint: CreateApiEndpointAny | undefined;

    const localCatalogEntries: Array<{
      preferredName: string;
      label: string;
      description: string;
      credits: number;
      schemaSummary: string;
      requiresConfirmation: boolean;
    }> = [];

    for (const endpoint of enabledEndpoints) {
      const internalToolName = endpointToToolName(endpoint);
      const preferredToolName = getPreferredToolName(endpoint);

      const requiresConfirmation =
        params.toolConfirmationConfig?.get(preferredToolName) ??
        params.toolConfirmationConfig?.get(internalToolName) ??
        endpoint.requiresConfirmation ??
        false;

      const { t: tEndpoint } = endpoint.scopedTranslation.scopedT(
        params.locale,
      );
      const label = tEndpoint(endpoint.title);
      const description = tEndpoint(endpoint.description ?? endpoint.title);

      toolsMeta.set(preferredToolName, {
        requiresConfirmation,
        credits: endpoint.credits ?? 0,
        label,
      });

      if (preferredToolName === EXECUTE_TOOL_ALIAS) {
        executeToolEndpoint = endpoint;
        // execute-tool itself does not appear in the catalog — it IS the call mechanism
        continue;
      }

      localCatalogEntries.push({
        preferredName: preferredToolName,
        label,
        description,
        credits: endpoint.credits ?? 0,
        schemaSummary: buildSchemaSummary(endpoint, permissionRoles),
        requiresConfirmation,
      });
    }

    // ── Remote tools — build toolsMeta + catalog entries ──────────────────────
    const remoteCatalogEntries: Array<{
      fullName: string;
      label: string;
      description: string;
      credits: number;
    }> = [];

    if (
      remoteToolNames.length > 0 &&
      !params.user.isPublic &&
      FOLDER_ALLOWS_REMOTE_TOOLS[params.streamContext.rootFolderId] !== false
    ) {
      // Group by instanceId so we fetch capabilities once per instance
      const byInstance = new Map<string, string[]>();
      for (const n of remoteToolNames) {
        const sepIdx = n.indexOf("__");
        const instanceId = n.slice(0, sepIdx);
        const existing = byInstance.get(instanceId) ?? [];
        existing.push(n);
        byInstance.set(instanceId, existing);
      }

      const { RemoteConnectionRepository } =
        await import("next-vibe/remote-connection/repository");

      for (const [instanceId, names] of byInstance) {
        const capabilities = await RemoteConnectionRepository.getCapabilities(
          params.user.id,
          instanceId,
        );
        if (!capabilities) {
          params.logger.debug("[Tools Loader] No capabilities for instance", {
            instanceId,
          });
          continue;
        }

        const capMap = new Map(capabilities.map((c) => [c.toolName, c]));

        for (const fullName of names) {
          // fullName = "hermes__ssh_exec_POST", toolName = "ssh_exec_POST"
          const toolNamePart = fullName.slice(instanceId.length + 2);
          const cap = capMap.get(toolNamePart);
          if (!cap) {
            params.logger.debug("[Tools Loader] Remote tool not in snapshot", {
              fullName,
              instanceId,
            });
            continue;
          }

          const requiresConfirmation =
            params.toolConfirmationConfig?.get(fullName) ?? false;

          toolsMeta.set(fullName, {
            requiresConfirmation,
            credits: cap.credits ?? 0,
            label: cap.title ?? fullName,
          });

          remoteCatalogEntries.push({
            fullName,
            label: cap.title ?? fullName,
            description: cap.description || cap.title,
            credits: cap.credits ?? 0,
          });
        }
      }
    }

    const totalToolCount =
      localCatalogEntries.length + remoteCatalogEntries.length;

    if (totalToolCount === 0 && !executeToolEndpoint) {
      return {
        tools: undefined,
        toolsMeta: new Map(),
        systemPrompt: params.systemPrompt,
      };
    }

    // ── Single execute-tool CoreTool ───────────────────────────────────────────
    // All tool calls go through execute-tool. The AI knows available tools via
    // the catalog injected into the system prompt below.
    if (!executeToolEndpoint) {
      // execute-tool was not in the requested list — load it directly (it must always be available)
      const etEndpoint = await getEndpoint(EXECUTE_TOOL_ALIAS);
      if (etEndpoint) {
        executeToolEndpoint = etEndpoint;
      }
    }

    if (!executeToolEndpoint) {
      params.logger.error(
        "[Tools Loader] execute-tool endpoint not found — cannot register single-path tool",
        {},
      );
      return {
        tools: undefined,
        toolsMeta,
        systemPrompt: params.systemPrompt,
      };
    }

    const executeTool = createToolFromEndpoint(executeToolEndpoint, {
      user: params.user,
      locale: params.locale,
      logger: params.logger,
      streamContext: params.streamContext,
      requiresConfirmation: false,
    });

    const tools: Record<string, CoreTool> = {
      [EXECUTE_TOOL_ALIAS]: executeTool,
    };

    // ── Inject tool catalog into system prompt ─────────────────────────────────
    const catalogText = buildToolCatalog(
      localCatalogEntries,
      remoteCatalogEntries,
    );
    const enrichedSystemPrompt = `${params.systemPrompt}\n\n${catalogText}`;

    params.logger.debug("Tools created (single execute-tool path)", {
      catalogLocal: localCatalogEntries.length,
      catalogRemote: remoteCatalogEntries.length,
      toolsMeta: toolsMeta.size,
    });

    return { tools, toolsMeta, systemPrompt: enrichedSystemPrompt };
  } catch (error) {
    params.logger.error("Failed to load tools", {
      error: parseError(error).message,
    });
    return {
      tools: undefined,
      toolsMeta: new Map(),
      systemPrompt: params.systemPrompt,
    };
  }
}
