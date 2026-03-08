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
import { generateSchemaForUsage } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { FieldUsage } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CliRequestData } from "../cli/runtime/parsing";
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
  },
  requiresConfirmation: boolean,
): CoreTool {
  const { t } = endpoint.scopedTranslation.scopedT(context.locale);
  // Generate description
  const description = t(endpoint.description || endpoint.title);

  // Generate Zod schema from fields (with transforms)
  const zodSchemaWithTransforms = generateInputSchema(endpoint);

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

  // Wrap JSON Schema in AI SDK's jsonSchema() function
  // This creates a FlexibleSchema that the AI SDK can use
  const inputSchema = jsonSchema(jsonSchemaObject as JSONSchema7, {
    validate: (value) => {
      // Extract noLoop parameter before validation (it's not part of endpoint schema)
      const noLoop =
        typeof value === "object" &&
        value !== null &&
        "noLoop" in value &&
        value.noLoop === true;

      // Use the original Zod schema (with transforms) for validation
      const result = zodSchemaWithTransforms.safeParse(value);
      if (result.success) {
        // Add noLoop back to the validated data so it reaches tool-call-handler
        return {
          success: true,
          value: noLoop ? { ...result.data, noLoop: true } : result.data,
        };
      }
      return {
        success: false,
        error: result.error,
      };
    },
  });

  // Get tool names
  // Internal name (full path): Used for internal tracking/debugging only
  const internalToolName = endpointToToolName(endpoint);
  // Preferred name (alias if available): Used for AI SDK, execution, and all lookups
  const toolName = getPreferredToolName(endpoint);

  return tool({
    description,
    inputSchema,
    execute: async (params) => {
      context.logger.debug("[Tools Loader] Tool execute called", {
        toolName,
        internalToolName,
        requiresConfirmation,
      });

      // Execute using shared generic handler — it auto-splits urlPathParams from data
      const { RouteExecutionExecutor } =
        await import("@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor");
      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data: params as CliRequestData,
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
      return result.data;
    },
  });
}

/**
 * Generate Zod input schema from endpoint fields
 * Combines RequestData and RequestUrlParams for AI tools
 */
function generateInputSchema(
  endpoint: CreateApiEndpointAny,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  if (!endpoint.fields) {
    return z.object({});
  }

  try {
    // Combine request data and URL params
    const requestDataSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestData
    >(endpoint.fields, FieldUsage.RequestData) as
      | z.ZodObject<Record<string, z.ZodTypeAny>>
      | z.ZodNever;

    const urlPathParamsSchema = generateSchemaForUsage<
      typeof endpoint.fields,
      FieldUsage.RequestUrlParams
    >(endpoint.fields, FieldUsage.RequestUrlParams) as
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

  // Accept any JSON object as input — schema is opaque for remote tools
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
    execute: async (input) => {
      logger.debug("[Tools Loader] Remote tool execute called", { toolName });

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
      // Stream aborts after this step; /report resumes via headless stream (wakeUp)
      // or the user sees the pending tool message and the stream ends (other modes).
      if (callbackMode === CM.WAIT && streamContext) {
        streamContext.waitingForRemoteResult = true;
      }

      return result.data;
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
  /** Stream context — rootFolderId, threadId, aiMessageId, etc. */
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

        const createdTool = createToolFromEndpoint(
          endpoint,
          {
            user: params.user,
            locale: params.locale,
            logger: params.logger,
            streamContext: params.streamContext,
          },
          requiresConfirmation,
        );

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

      const { getCapabilities } =
        await import("@/app/api/[locale]/user/remote-connection/repository");

      for (const [instanceId, names] of byInstance) {
        const capabilities = await getCapabilities(params.user.id, instanceId);
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
            toolsMeta.set(fullName, { requiresConfirmation, credits: 1 });
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
