/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import { fetchStorageFileAsBase64 } from "../../agent/chat/storage/url-utils";
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import {
  definitionLoader,
  type IDefinitionLoader,
} from "../../core/definition/loader";
import { makeHeadlessContext } from "../../core/execution-context";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { permissionsRegistry } from "../../core/permissions/registry";
import {
  definitionsRegistry,
  type IDefinitionsRegistry,
} from "../../core/route/definitions-registry";
import type {
  ContentBlock,
  ResponseType,
} from "../../core/route/response.schema";
import { ErrorResponseTypes } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { VIBE_CHECK_TOOL_NAMES } from "../../tooling/check/constants";
import { McpResultFormatter } from "../../unified-ui/renderers/mcp/McpResultFormatter";
import { Platform } from "../platforms";
import { scopedTranslation as mcpScopedTranslation } from "./i18n";
import {
  dispatchPrefixedToolName,
  dispatchRoutedTool,
} from "./remote-dispatch";
import type {
  MCPContent,
  MCPExecutionContext,
  MCPToolCallResult,
  MCPToolMetadata,
} from "./types";
import { MCPErrorCode } from "./types";

/**
 * Tools excluded from hot-reload (use cached module loading instead).
 * vibe-check is excluded because it is the code quality tool itself and
 * must remain stable while checking other code.
 */
const HOT_RELOAD_EXCLUDED_TOOLS = new Set(VIBE_CHECK_TOOL_NAMES);

/**
 * MCP Registry Implementation
 */
export class MCPRegistry {
  private initialized = false;
  private lastRefresh = 0;
  private readonly definitionsReg: IDefinitionsRegistry;
  private readonly definitionLdr: IDefinitionLoader;

  constructor(
    definitionsReg: IDefinitionsRegistry = definitionsRegistry,
    definitionLdr: IDefinitionLoader = definitionLoader,
  ) {
    this.definitionsReg = definitionsReg;
    this.definitionLdr = definitionLdr;
  }

  /**
   * Initialize the registry
   */
  async initialize(logger: EndpointLogger): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.lastRefresh = Date.now();
      this.initialized = true;

      logger.debug("[MCP Registry] Initialized");
    } catch (error) {
      logger.error("[MCP Registry] Initialization failed", {
        error: parseError(error).message,
      });
      this.initialized = false;
    }
  }

  /**
   * Ensure registry is initialized
   */
  private ensureInitialized(logger: EndpointLogger): void {
    if (!this.initialized) {
      logger.warn(
        "[MCP Registry] Registry not initialized, initializing now...",
      );
    }
  }

  /**
   * Get all tools for a specific user (filtered by permissions)
   */
  async getTools(
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<MCPToolMetadata[]> {
    this.ensureInitialized(logger);

    // Get full execution-set tools for this user on MCP platform
    const allMcpTools = await this.definitionsReg.getSerializedToolsForUser(
      Platform.MCP,
      user,
      locale,
      logger,
    );

    // MCP native tool listing is opt-in: only expose tools marked MCP_VISIBLE
    const serialized = allMcpTools.filter(
      (tool) =>
        permissionsRegistry.checkMcpDiscoveryAccess(tool.allowedRoles).allowed,
    );

    // Convert to MCP tool metadata format
    return serialized.map((tool) => ({
      id: tool.name,
      toolName: tool.name,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      tags: tool.tags,
      path: tool.name,
      routePath: tool.name,
      definitionPath: tool.name,
      method: tool.method,
      allowedRoles: tool.allowedRoles,
      requiresAuth: tool.allowedRoles.length > 0,
      aliases: tool.aliases,
    }));
  }

  /**
   * Execute a tool
   */
  async executeTool(
    context: MCPExecutionContext,
    logger: EndpointLogger,
  ): Promise<MCPToolCallResult> {
    this.ensureInitialized(logger);

    const { t } = mcpScopedTranslation.scopedT(context.locale);

    // Prefixed tool name (e.g. "hermes__tool-help_POST") — route to remote instance via
    // unified execute-tool repository instead of the local handler. Checked before the
    // local visibility check below: the prefix means the REMOTE instance authorizes it.
    if (context.toolName.includes("__")) {
      const outcome = await dispatchPrefixedToolName(context, logger);
      if (outcome.kind === "failed") {
        return this.fail({
          error: outcome.message,
          code: MCPErrorCode.TOOL_EXECUTION_FAILED,
          details: { toolName: context.toolName },
        });
      }
      return await this.convertToMCPResult(
        outcome.result,
        context.toolName,
        context.locale,
        logger,
        null,
        context.user,
        context.data,
      );
    }

    // Check tool exists and user has MCP execution access (opt-out, not opt-in MCP_VISIBLE)
    // Discovery (tools/list) uses MCP_VISIBLE opt-in, but execution uses opt-out semantics.
    const allMcpTools = await this.definitionsReg.getSerializedToolsForUser(
      Platform.MCP,
      context.user,
      context.locale,
      logger,
    );
    const toolMeta = allMcpTools.find(
      (tool) =>
        tool.name === context.toolName ||
        tool.toolName === context.toolName ||
        tool.aliases?.includes(context.toolName),
    );

    if (!toolMeta) {
      return this.fail({
        error: t("registry.toolNotFound"),
        code: MCPErrorCode.TOOL_NOT_FOUND,
        details: { toolName: context.toolName },
      });
    }

    // no user context — UTC (dates not user-facing here)
    const toolExecutionContext = makeHeadlessContext(
      context.signal,
      undefined,
      "UTC",
    );

    // Remote routing: a connection rule for this user may claim the call for another
    // instance. Null means it stays local.
    const remoteResult = await dispatchRoutedTool(
      context,
      logger,
      toolExecutionContext,
    );
    if (remoteResult) {
      return await this.convertToMCPResult(
        remoteResult,
        context.toolName,
        context.locale,
        logger,
        null,
        context.user,
        context.data,
      );
    }

    // Hot reload: load fresh modules on every call so file changes are reflected
    // immediately without restarting the MCP server. vibe-check is excluded
    // because it must remain stable while checking code quality.
    const isHotReload = !HOT_RELOAD_EXCLUDED_TOOLS.has(context.toolName);

    // Execute tool using shared generic handler.
    // For hot-reload tools, pre-load the handler fresh and pass it as preloadedHandler
    // so the executor uses it directly without going through the cached switch.
    // Coerce null → undefined: null tells core.ts "skip the handler lookup entirely"
    // (used for explicit no-op), while undefined means "fall through to the registry
    // switch". If the hot-loader can't find the route, fall through so the registry's
    // own lookup (handlers.ts → handlers-dev.ts fallback) can attempt it.
    const freshHandlerOrNull = isHotReload
      ? await import("./hot-loader").then((m) =>
          m.getRouteHandlerFresh(context.toolName),
        )
      : undefined;
    const freshHandler = freshHandlerOrNull ?? undefined;

    // Route local execution through the unified execute-tool repository — the
    // single dispatch path that applies the permission cascade, folder
    // restrictions, and confirmation gate (same as AI/remote). MCP keeps only
    // its platform concerns: hot-reload (via preloadedHandler), result
    // formatting, and the Bun TDZ retry. freshHandler is undefined for
    // hot-reload-excluded tools → the executor loads the handler itself.
    const { runEndpointByName } =
      await import("../../execute-tool/repository/run-endpoint-by-name");
    const runTool = (): Promise<ResponseType<WidgetData>> =>
      runEndpointByName({
        toolName: context.toolName,
        input: context.data as Record<string, WidgetData>,
        callbackMode: "wait",
        user: context.user,
        locale: context.locale,
        logger,
        toolExecutionContext,
        platform: Platform.MCP,
        preloadedHandler: freshHandler,
      });

    try {
      logger.debug("[MCP Registry] Executing tool", {
        toolName: context.toolName,
        user: context.user.isPublic
          ? { isPublic: true, leadId: context.user.leadId }
          : { isPublic: false, id: context.user.id },
        dataKeys: Object.keys(context.data),
      });

      let result = await runTool();

      // Bun TDZ race: dynamic imports can throw "Cannot access 'X' before initialization"
      // on first load. Retry once after 10ms to let the module settle.
      // The underlying text now rides in `message` (produced by the catch in
      // execute-tool/repository/index.ts), not a separate params channel.
      if (!result.success && result.message.includes("before initialization")) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 10);
        });
        result = await runTool();
      }

      logger.debug("[MCP Registry] Tool execution complete", {
        toolName: context.toolName,
        success: result.success,
        hasData: !!(result.success && result.data),
        errorMessage: result.success ? undefined : result.message,
      });

      // Load endpoint definition for rendering (success) or error formatting (validation errors)
      let endpoint: CreateApiEndpointAny | null = null;
      // Only the success path needs the definition now - validation errors
      // arrive with their text already formatted.
      const needsEndpoint = result.success && result.data;
      if (needsEndpoint) {
        if (isHotReload) {
          // Hot reload: bypass allDefinitionsCache and load fresh from disk
          endpoint = await import("./hot-loader").then((m) =>
            m.getEndpointFresh(context.toolName),
          );
        } else {
          let endpointResult = await this.definitionLdr.load({
            identifier: context.toolName,
            platform: Platform.MCP,
            user: context.user,
            logger,
            locale: context.locale,
          });
          // Bun TDZ race: dynamic imports can throw "Cannot access 'X' before initialization"
          // on first load. Retry once after 10ms to let the module settle.
          if (
            !endpointResult.success &&
            endpointResult.message?.includes("before initialization")
          ) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, 10);
            });
            endpointResult = await this.definitionLdr.load({
              identifier: context.toolName,
              platform: Platform.MCP,
              user: context.user,
              logger,
              locale: context.locale,
            });
          }
          if (endpointResult.success) {
            endpoint = endpointResult.data;
          }
        }
      }

      return await this.convertToMCPResult(
        result,
        context.toolName,
        context.locale,
        logger,
        endpoint,
        context.user,
        context.data,
      );
    } catch (error) {
      const parsedError = parseError(error);

      // Bun TDZ race: retry once after 10ms if the module wasn't initialized yet.
      if (parsedError.message.includes("before initialization")) {
        logger.warn("[MCP Registry] TDZ race detected, retrying after 10ms", {
          toolName: context.toolName,
          error: parsedError.message,
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 10);
        });
        try {
          const retryResult = await runTool();
          return await this.convertToMCPResult(
            retryResult,
            context.toolName,
            context.locale,
            logger,
            null,
            context.user,
            context.data,
          );
        } catch (retryError) {
          const retryParsed = parseError(retryError);
          logger.error("[MCP Registry] Retry also failed", {
            toolName: context.toolName,
            error: retryParsed.message,
          });
          return this.fail({
            error: t("registry.toolExecutionFailed"),
            code: MCPErrorCode.TOOL_EXECUTION_FAILED,
            details: {
              toolName: context.toolName,
              exceptionMessage: retryParsed.message,
            },
          });
        }
      }

      logger.error("[MCP Registry] Tool execution failed with exception", {
        toolName: context.toolName,
        error: parsedError.message,
        stack: parsedError.stack,
      });

      return this.fail({
        error: t("registry.toolExecutionFailed"),
        code: MCPErrorCode.TOOL_EXECUTION_FAILED,
        details: {
          toolName: context.toolName,
          exceptionMessage: parsedError.message,
          stack: parsedError.stack?.split("\n").slice(0, 3).join("\n"),
        },
      });
    }
  }

  /**
   * Create MCP error response
   */
  private fail({
    error,
    code,
    details,
  }: {
    error: string;
    code: MCPErrorCode;

    // eslint-disable-next-line restricted/no-unknown -- Infrastructure: Tool registration requires 'unknown' for flexible tool definitions
    details?: { [key: string]: unknown };
  }): MCPToolCallResult {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error,
            code,
            ...details,
          }),
        },
      ],
      isError: true,
    };
  }

  /**
   * Convert route execution result to MCP format
   */
  private async convertToMCPResult<TData extends WidgetData>(
    result: ResponseType<TData>,
    toolName: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    endpoint: CreateApiEndpointAny | null,
    user: JwtPayloadType,
    requestInput: Record<string, WidgetData>,
  ): Promise<MCPToolCallResult> {
    const { t } = mcpScopedTranslation.scopedT(locale);

    if (result.success && result.data) {
      let data: TData = result.data;

      // ContentResponse (e.g. screenshots): return content blocks directly.
      // May appear at the top level or inside an unwrapped execute-tool wrapper.
      if (
        typeof data === "object" &&
        data !== null &&
        "isContentResponse" in data &&
        "content" in data &&
        Array.isArray((data as Record<string, ContentBlock[]>).content)
      ) {
        const rawContent = (data as Record<string, ContentBlock[]>).content;
        // Convert all blocks to MCP-compatible format.
        // image_url blocks are read from storage (with ownership check) and converted
        // to base64 image blocks so MCP clients can render them inline.
        const content: MCPContent[] = (
          await Promise.all(
            rawContent.map(async (block): Promise<MCPContent | null> => {
              if (block.type === "text" || block.type === "image") {
                return block;
              }
              // image_url: read from storage adapter with user ownership check
              const base64 = await fetchStorageFileAsBase64(block.url, user);
              if (!base64) {
                logger.warn(
                  "[MCP Registry] Failed to fetch image_url block, skipping",
                  { url: block.url, toolName },
                );
                return null;
              }
              return { type: "image", data: base64, mimeType: block.mimeType };
            }),
          )
        ).filter((block): block is MCPContent => block !== null);
        logger.debug(
          "[MCP Registry] ContentResponse with native content blocks",
          { toolName, blockCount: content.length },
        );
        return { content, isError: false };
      }

      // Format successful response using endpoint renderer if available
      const formattedData = await McpResultFormatter.formatSuccess(
        data,
        endpoint,
        locale,
        logger,
        user,
        requestInput,
      );
      logger.debug("[MCP Registry] Tool execution successful", {
        toolName,
        formattedDataLength: formattedData.length,
        formattedDataPreview: formattedData.slice(0, 200),
        hasEndpoint: !!endpoint,
        dataKeys:
          typeof data === "object" && data !== null ? Object.keys(data) : [],
      });

      return {
        content: [
          {
            type: "text",
            text: formattedData,
          },
        ],
        isError: false,
      };
    }

    if (result.success) {
      // Success with no data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
        isError: false,
      };
    }

    // Error response. Keyed off the error type rather than the message text -
    // the type is set at the source and survives the JSON round trip, whereas
    // sniffing the rendered text would be guesswork.
    const isValidationError =
      result.errorType.errorKey ===
      ErrorResponseTypes.VALIDATION_ERROR.errorKey;
    const errorMessage = result.message
      ? result.message
      : t("registry.toolExecutionFailed");

    return this.fail({
      error: errorMessage,
      code: isValidationError
        ? MCPErrorCode.INVALID_PARAMS
        : MCPErrorCode.TOOL_EXECUTION_FAILED,
      details: isValidationError
        ? { tool: toolName }
        : { tool: toolName, error: result },
    });
  }

  /**
   * Check if registry is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Refresh the registry
   */
  async refresh(logger: EndpointLogger): Promise<void> {
    logger.info("[MCP Registry] Refreshing...");
    this.initialized = false;
    await this.initialize(logger);
  }
}

export const mcpRegistry = new MCPRegistry();
