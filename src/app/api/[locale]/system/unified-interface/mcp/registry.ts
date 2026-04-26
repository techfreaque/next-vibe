/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ContentBlock } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { McpResultFormatter } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/mcp/McpResultFormatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { VIBE_CHECK_TOOL_NAMES } from "@/app/api/[locale]/system/check/vibe-check/constants";
import { DefaultFolderId } from "../../../agent/chat/config";
import {
  definitionLoader,
  type IDefinitionLoader,
} from "../shared/endpoints/definition/loader";
import {
  definitionsRegistry,
  type IDefinitionsRegistry,
} from "../shared/endpoints/definitions/registry";
import { permissionsRegistry } from "../shared/endpoints/permissions/registry";
import { RouteExecutionExecutor } from "../shared/endpoints/route/executor";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";
import { Platform } from "../shared/types/platform";
import { formatValidationErrorCompact } from "../shared/utils/format-validation-error";
import { scopedTranslation as mcpScopedTranslation } from "./i18n";
import type {
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
      logger.info("[MCP Registry] Starting initialization...");

      this.lastRefresh = Date.now();
      this.initialized = true;

      logger.info("[MCP Registry] Initialization complete");
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
   * Get tool metadata by name
   */
  async getToolByName(
    name: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<MCPToolMetadata | null> {
    this.ensureInitialized(logger);

    // Get all tools (this will be filtered by user in getTools, but here we need unfiltered)
    // For now, we'll use a public user to get all tools
    const publicUser: JwtPayloadType = {
      isPublic: true,
      leadId: "mcp-registry-anonymous",
      roles: [UserPermissionRole.PUBLIC],
    };

    const tools = await this.getTools(publicUser, logger, locale);

    // Try direct name match first
    const tool = tools.find((t) => t.name === name);
    if (tool) {
      return tool;
    }

    // Try aliases
    return tools.find((t) => t.aliases?.includes(name)) ?? null;
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

    // Hot reload: load fresh modules on every call so file changes are reflected
    // immediately without restarting the MCP server. vibe-check is excluded
    // because it must remain stable while checking code quality.
    const isHotReload = !HOT_RELOAD_EXCLUDED_TOOLS.has(context.toolName);

    // Execute tool using shared generic handler.
    // For hot-reload tools, pre-load the handler fresh and pass it as preloadedHandler
    // so the executor uses it directly without going through the cached switch.
    const freshHandler = isHotReload
      ? await import("./hot-loader").then((m) =>
          m.getRouteHandlerFresh(context.toolName),
        )
      : undefined;

    const executeArgs: Parameters<
      typeof RouteExecutionExecutor.executeGenericHandler
    >[0] = {
      toolName: context.toolName,
      data: context.data,
      user: context.user,
      locale: context.locale,
      logger,
      platform: Platform.MCP,
      preloadedHandler: freshHandler,
      streamContext: {
        rootFolderId: DefaultFolderId.BACKGROUND,
        threadId: undefined,
        aiMessageId: undefined,
        skillId: undefined,
        headless: undefined,
        subAgentDepth: 0,
        currentToolMessageId: undefined,
        callerToolCallId: undefined,
        pendingToolMessages: undefined,
        pendingTimeoutMs: undefined,
        leafMessageId: undefined,
        waitingForRemoteResult: undefined,
        favoriteId: undefined,
        abortSignal: context.signal,
        callerCallbackMode: undefined,
        onEscalatedTaskCancel: undefined,
        escalateToTask: undefined,
        isRevival: undefined,

        providerOverride: undefined,
      },
    };

    try {
      logger.debug("[MCP Registry] Executing tool", {
        toolName: context.toolName,
        user: context.user.isPublic
          ? { isPublic: true, leadId: context.user.leadId }
          : { isPublic: false, id: context.user.id },
        dataKeys: Object.keys(context.data),
      });

      let result =
        await RouteExecutionExecutor.executeGenericHandler(executeArgs);

      // Bun TDZ race: dynamic imports can throw "Cannot access 'X' before initialization"
      // on first load. Retry once after 10ms to let the module settle.
      if (
        !result.success &&
        result.messageParams &&
        "error" in result.messageParams &&
        typeof result.messageParams["error"] === "string" &&
        result.messageParams["error"].includes("before initialization")
      ) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 10);
        });
        result =
          await RouteExecutionExecutor.executeGenericHandler(executeArgs);
      }

      logger.debug("[MCP Registry] Tool execution complete", {
        toolName: context.toolName,
        success: result.success,
        hasData: !!(result.success && result.data),
        errorMessage: result.success ? undefined : result.message,
      });

      // Load endpoint definition for rendering (success) or error formatting (validation errors)
      let endpoint: CreateApiEndpointAny | null = null;
      const needsEndpoint =
        (result.success && result.data) ||
        (!result.success &&
          result.messageParams &&
          "error" in result.messageParams &&
          "errorCount" in result.messageParams);
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

      return this.convertToMCPResult(
        result,
        context.toolName,
        context.locale,
        logger,
        endpoint,
        context.user,
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
          const retryResult =
            await RouteExecutionExecutor.executeGenericHandler(executeArgs);
          return this.convertToMCPResult(
            retryResult,
            context.toolName,
            context.locale,
            logger,
            null,
            context.user,
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

    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Tool registration requires 'unknown' for flexible tool definitions
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
  private convertToMCPResult<TData>(
    result: ResponseType<TData>,
    toolName: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    endpoint: CreateApiEndpointAny | null,
    user: JwtPayloadType,
  ): MCPToolCallResult {
    const { t } = mcpScopedTranslation.scopedT(locale);

    if (result.success && result.data) {
      // Unwrap execute-tool's { result: ... } wrapper - MCP receives data directly,
      // not nested inside a `result` key. Any other single-key { result: X } wrapper
      // from intermediary endpoints is also unwrapped.
      let data: TData = result.data;
      if (
        typeof data === "object" &&
        data !== null &&
        "result" in data &&
        Object.keys(data).length === 1
      ) {
        data = (data as Record<string, TData>)["result"] as TData;
      }

      // ContentResponse (e.g. screenshots): return content blocks directly.
      // May appear at the top level or inside an unwrapped execute-tool wrapper.
      if (
        typeof data === "object" &&
        data !== null &&
        "__isContentResponse" in data &&
        "content" in data &&
        Array.isArray((data as Record<string, ContentBlock[]>).content)
      ) {
        const content = (data as Record<string, ContentBlock[]>).content;
        logger.debug(
          "[MCP Registry] ContentResponse with native content blocks",
          { toolName, blockCount: content.length },
        );
        return { content, isError: false };
      }

      // Format successful response using endpoint renderer if available
      const formattedData = McpResultFormatter.formatSuccess(
        data as Parameters<typeof McpResultFormatter.formatSuccess>[0],
        endpoint,
        locale,
        logger,
        user,
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

    // Error response
    const compactDetails = formatValidationErrorCompact(
      result.messageParams as Record<string, string | number> | undefined,
      endpoint,
    );

    const isValidationError = compactDetails !== null;
    const errorMessage =
      compactDetails ??
      (result.message ? result.message : t("registry.toolExecutionFailed"));

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
