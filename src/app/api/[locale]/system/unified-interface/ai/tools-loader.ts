/**
 * AI Tools Loader
 * ONLY file in AI folder - creates AI SDK CoreTool objects from endpoints
 * All other logic (discovery, filtering, execution) is in shared/
 */

import "server-only";

import { jsonSchema, type JSONSchema7, tool } from "ai";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import {
  collectServerDefaults,
  generateSchemaForUsage,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { filterUserPermissionRoles } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliRequestData } from "../cli/runtime/cli-request-data";
import { permissionsRegistry } from "../shared/endpoints/permissions/registry";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import { Platform } from "../shared/types/platform";
import { endpointToToolName, getPreferredToolName } from "../shared/utils/path";
import type { JsonValue } from "../tasks/unified-runner/types";

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
  // - wait-for-task: has its own stream-pause mechanism, callbackMode would interfere
  // - execute-tool: has callbackMode as a native field in its definition schema
  const schemaObj = jsonSchemaObject as JSONSchema7 & {
    properties?: Record<string, JSONSchema7>;
  };
  if (toolName !== "wait-for-task" && toolName !== "execute-tool") {
    if (!schemaObj.properties) {
      schemaObj.properties = {};
    }
    schemaObj.properties.callbackMode = {
      type: "string",
      enum: ["detach", "wakeUp", "endLoop", "approve"],
      description:
        "Optional. Controls post-execution behavior. " +
        "'detach': fire-and-forget, returns {taskId} immediately, use wait-for-task later to get result. " +
        "'wakeUp': fire-and-forget, returns {taskId} immediately. Result is automatically injected into the thread when ready - you will see it as a tool result in a follow-up message. Do NOT call wait-for-task for wakeUp. " +
        "'endLoop': execute this tool normally (parallel sibling tools in the same batch also run), then stop - AI will not make any further tool calls after this batch completes. " +
        "'approve': require user confirmation before executing. " +
        "Omit for default synchronous execution.",
    };
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
        {}) as Record<string, JsonValue>;
      const baseParams =
        toolName === "execute-tool" && callbackModeParam !== undefined
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
      const serverDefaultPatch: Record<string, JsonValue> = {};
      if (Object.keys(serverDefaults).length > 0) {
        const ctx = {
          user: context.user,
          locale: context.locale,
          platform: Platform.AI as Platform,
          streamContext: context.streamContext,
        };
        for (const [key, resolver] of Object.entries(serverDefaults)) {
          const resolved = resolver(ctx);
          if (resolved !== undefined) {
            serverDefaultPatch[key] = resolved as JsonValue;
          }
        }
      }

      const restParams = {
        ...baseParams,
        ...serverDefaultPatch,
      };

      const { CallbackMode: CM } =
        await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");
      const callbackMode =
        typeof callbackModeParam === "string" &&
        Object.values(CM).includes(callbackModeParam as never)
          ? (callbackModeParam as (typeof CM)[keyof typeof CM])
          : null;

      context.logger.debug("[ToolsLoader] CoreTool execute called", {
        toolName,
        callbackMode,
        threadId: context.streamContext?.threadId,
        aiMessageId: context.streamContext?.aiMessageId,
        streamContextRef: !!context.streamContext,
      });

      // Race tool execution against the abort signal so cancellation
      // kills even long-running tool calls immediately.
      const abortSignal = context.streamContext?.abortSignal;
      const executeToolInline = async (): Promise<JsonValue> => {
        // Detach and wakeUp need task creation + backfill + resume-stream scheduling.
        // Route through RouteExecuteRepository which handles both modes.
        // execute-tool always routes through RouteExecuteRepository directly
        // so callerToolCallId (options.toolCallId) is available for deduplication.
        // If this tool requires confirmation, do NOT fire wakeUp/detach goroutines.
        // The stream layer sets stepHasToolsAwaitingConfirmation=true and aborts at finish-step.
        // Confirmation UI shows, user confirms, then tool-confirmation-handler executes.
        // Return a placeholder so the AI SDK has a result and the stream ends cleanly.
        if (
          context.requiresConfirmation &&
          (callbackMode === CM.WAKE_UP || callbackMode === CM.DETACH)
        ) {
          context.logger.info(
            "[ToolsLoader] tool requires confirmation - blocking wakeUp/detach, returning placeholder",
            { toolName, callbackMode },
          );
          return {
            status: "waiting_for_confirmation",
            hint: "Waiting for user confirmation before executing.",
          };
        }

        if (
          callbackMode === CM.DETACH ||
          callbackMode === CM.WAKE_UP ||
          toolName === "execute-tool"
        ) {
          // Inject the correct toolMessageId for this specific parallel tool call.
          // pendingToolMessages is keyed by AI SDK toolCallId - populated by stream-part-handler.
          // The AI SDK may call execute() before stream-part-handler processes the tool-call event,
          // so spin-wait up to 200ms (20 × 10ms) for the entry to appear.
          // Resolve per-call toolMessageId BEFORE touching shared streamContext.
          // Two parallel wakeUp tools each have a distinct options.toolCallId.
          // We must NOT write to context.streamContext.callerToolCallId (shared) here —
          // that would race with the sibling call and both would end up with the same ID.
          // Instead, resolve the values locally and pass a per-call context snapshot.
          let perCallToolMessageId: string | undefined;
          let perCallLeafMessageId: string | null = null;

          if (options?.toolCallId && context.streamContext) {
            let pending = context.streamContext.pendingToolMessages?.get(
              options.toolCallId,
            );
            if (!pending) {
              // Brief spin-wait: stream-part-handler is processing the tool-call event concurrently.
              // In practice this resolves within 1-2 ticks; 200ms cap is a generous safety bound.
              for (let i = 0; i < 20 && !pending; i++) {
                await new Promise<void>((resolve) => {
                  setTimeout(resolve, 10);
                });
                pending = context.streamContext.pendingToolMessages?.get(
                  options.toolCallId,
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
            await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/repository");
          const { scopedTranslation: executeScopedT } =
            await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
          const { t: execT } = executeScopedT.scopedT(context.locale);

          // execute-tool: restParams already has the correct shape ({ toolName, input, callbackMode, instanceId? })
          // Other tools: wrap in { toolName, input: restParams, callbackMode }
          const executeData = (
            toolName === "execute-tool"
              ? restParams
              : { toolName, input: restParams, callbackMode }
          ) as Parameters<typeof RouteExecuteRepository.execute>[0];

          // Build a per-call context snapshot with the resolved IDs.
          // This avoids mutating the shared streamContext which would race with sibling parallel calls.
          const perCallStreamContext = context.streamContext
            ? {
                ...context.streamContext,
                callerToolCallId: options?.toolCallId,
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

          context.logger.info(
            "[ToolsLoader] wakeUp/detach via RouteExecuteRepository",
            {
              toolName,
              callerToolCallId: options?.toolCallId,
              currentToolMessageId: perCallStreamContext?.currentToolMessageId,
              aiMessageId: context.streamContext?.aiMessageId,
            },
          );

          const result = await RouteExecuteRepository.execute(
            executeData,
            context.user,
            context.locale,
            context.logger,
            execT,
            perCallStreamContext ?? context.streamContext,
          );

          // Propagate waitingForRemoteResult back to the shared streamContext.
          // perCallStreamContext is a copy - mutations to it don't affect the original.
          // stream-part-handler checks context.streamContext.waitingForRemoteResult to
          // decide whether to abort the stream at the tool-result event.
          if (
            perCallStreamContext?.waitingForRemoteResult &&
            context.streamContext
          ) {
            context.streamContext.waitingForRemoteResult = true;
          }

          if (!result.success) {
            const errorMsg = result.message ?? "Tool execution failed";
            // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Tool error must be thrown for AI SDK
            // eslint-disable-next-line @typescript-eslint/only-throw-error -- Tool error must be thrown for AI SDK
            throw new Error(errorMsg);
          }

          return result.data as JsonValue;
        }

        // Default path: execute inline (wait, endLoop, approve handled by stream layer)
        const { RouteExecutionExecutor } =
          await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
        const result = await RouteExecutionExecutor.executeGenericHandler({
          toolName,
          data: restParams as CliRequestData,
          user: context.user,
          locale: context.locale,
          logger: context.logger,
          platform: Platform.AI,
          streamContext: context.streamContext,
        });

        if (!result.success) {
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Tool error must be thrown for AI SDK
          // eslint-disable-next-line @typescript-eslint/only-throw-error -- Throwing ErrorResponseType so AI SDK marks isError=true with structured data
          throw result;
        }

        // Return the data to AI SDK
        // Must be JSON-serializable for streaming
        return result.data as JsonValue;
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

/**
 * Generate Zod input schema from endpoint fields
 * Combines RequestData and RequestUrlParams for AI tools
 * @param userRoles - Caller roles for field-level visibility enforcement
 */
function generateInputSchema(
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
 * Create an AI SDK CoreTool for a remote capability.
 * The tool calls execute-tool locally which forwards the request to the remote.
 */
function createRemoteTool(params: {
  toolName: string; // full prefixed name: "hermes__ssh_exec_POST"
  cap: { title: string; description: string };
  requiresConfirmation: boolean;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  streamContext: ToolExecutionContext;
}): CoreTool {
  const { toolName, cap, user, locale, logger, streamContext } = params;

  // Accept any JSON object as input - schema is opaque for remote tools
  const inputSchema = jsonSchema(
    {
      type: "object",
      additionalProperties: true,
    } as JSONSchema7,
    {
      validate: (value) => ({
        success: true,
        value: value as Record<string, JsonValue>,
      }),
    },
  );

  return tool({
    description: cap.description || cap.title,
    inputSchema,
    execute: async (input, options) => {
      const abortSignal = streamContext?.abortSignal;

      const executeRemoteInline = async (): Promise<JsonValue> => {
        // Delegate to execute-tool which routes to the remote
        const { RouteExecuteRepository } =
          await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/repository");
        const { scopedTranslation: executeScopedT } =
          await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
        const { t } = executeScopedT.scopedT(locale);

        // Extract callbackMode from input if AI passed it; default to wait
        const { callbackMode: inputCallbackMode, ...restInput } = (input ??
          {}) as Record<string, JsonValue>;
        const { CallbackMode: CM } =
          await import("@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants");
        const callbackMode =
          typeof inputCallbackMode === "string" &&
          Object.values(CM).includes(inputCallbackMode as never)
            ? (inputCallbackMode as (typeof CM)[keyof typeof CM])
            : CM.WAIT;

        if (options?.toolCallId && streamContext) {
          streamContext.callerToolCallId = options.toolCallId;
        }
        const result = await RouteExecuteRepository.execute(
          {
            toolName,
            input: restInput,
            callbackMode,
          },
          user,
          locale,
          logger,
          t,
          streamContext,
        );

        if (!result.success) {
          const errorMsg = result.message ?? "Remote tool execution failed";
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Tool error must be thrown for AI SDK
          // eslint-disable-next-line @typescript-eslint/only-throw-error -- Tool error must be thrown for AI SDK
          throw new Error(errorMsg);
        }

        // Signal the stream layer to pause when callbackMode=wait.
        if (callbackMode === CM.WAIT && streamContext) {
          streamContext.waitingForRemoteResult = true;
        }

        return result.data as JsonValue;
      };

      // If no abort signal, just run inline
      if (!abortSignal) {
        return executeRemoteInline();
      }

      // Already aborted - bail immediately
      if (abortSignal.aborted) {
        logger.info(
          "[ToolsLoader] Stream already cancelled - skipping remote tool",
          { toolName },
        );
        return { error: "Stream cancelled" };
      }

      // Race: tool execution vs abort signal
      return Promise.race([
        executeRemoteInline(),
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

/**
 * Load tools for AI streaming
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
  toolsMeta: Map<string, { requiresConfirmation: boolean; credits: number }>;
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

    // Create AI SDK tools map
    const toolsMap = new Map<string, CoreTool>();
    const toolsMeta = new Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >();

    // ── Local tools ──────────────────────────────────────────────────────────
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

    for (const endpoint of enabledEndpoints) {
      const internalToolName = endpointToToolName(endpoint);
      const preferredToolName = getPreferredToolName(endpoint);

      try {
        const requiresConfirmation =
          params.toolConfirmationConfig?.get(preferredToolName) ??
          params.toolConfirmationConfig?.get(internalToolName) ??
          endpoint.requiresConfirmation ??
          false;

        const createdTool = createToolFromEndpoint(endpoint, {
          user: params.user,
          locale: params.locale,
          logger: params.logger,
          streamContext: params.streamContext,
          requiresConfirmation,
        });

        toolsMap.set(preferredToolName, createdTool);
        toolsMeta.set(preferredToolName, {
          requiresConfirmation,
          credits: endpoint.credits ?? 0,
        });
      } catch (error) {
        const parsedError = parseError(error);
        params.logger.error("Failed to create tool - skipping", {
          internalToolName,
          preferredToolName,
          endpoint: [...endpoint.path],
          error: parsedError.message,
        });
      }
    }

    // ── Remote tools ─────────────────────────────────────────────────────────
    if (remoteToolNames.length > 0 && !params.user.isPublic) {
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
        await import("@/app/api/[locale]/user/remote-connection/repository");

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

          try {
            const remoteTool = createRemoteTool({
              toolName: fullName,
              cap,
              requiresConfirmation,
              user: params.user,
              locale: params.locale,
              logger: params.logger,
              streamContext: params.streamContext,
            });

            toolsMap.set(fullName, remoteTool);
            toolsMeta.set(fullName, {
              requiresConfirmation,
              credits: cap.credits ?? 0,
            });
          } catch (error) {
            params.logger.error("[Tools Loader] Failed to create remote tool", {
              fullName,
              error: parseError(error).message,
            });
          }
        }
      }
    }

    if (toolsMap.size === 0) {
      return {
        tools: undefined,
        toolsMeta: new Map(),
        systemPrompt: params.systemPrompt,
      };
    }

    const tools = Object.fromEntries(toolsMap.entries());

    params.logger.debug("Tools created", {
      count: toolsMap.size,
      preferredToolNames: [...toolsMap.keys()],
    });

    return { tools, toolsMeta, systemPrompt: params.systemPrompt };
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
