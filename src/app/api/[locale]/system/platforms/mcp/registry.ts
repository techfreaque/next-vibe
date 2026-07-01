/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import { formatValidationErrorCompact } from "next-vibe/core/core-utils/format-validation-error";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import {
  definitionLoader,
  type IDefinitionLoader,
} from "next-vibe/core/definition/loader";
import { Platform } from "next-vibe/core/definition/platform";
import {
  definitionsRegistry,
  type IDefinitionsRegistry,
} from "next-vibe/core/definitions/registry";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { ContentBlock } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation as mcpScopedTranslation } from "next-vibe/platforms/mcp/i18n";
import { VIBE_CHECK_TOOL_NAMES } from "next-vibe/tooling/check/vibe-check/constants";
import { McpResultFormatter } from "next-vibe/ui/renderers/mcp/McpResultFormatter";

import { makeHeadlessContext } from "@/app/api/[locale]/agent/chat/config";
import { fetchStorageFileAsBase64 } from "@/app/api/[locale]/agent/chat/storage/url-utils";

import type { MCPContent } from "./types";
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

    // Prefixed tool name (e.g. "hermes__tool-help_POST") — route to remote instance via
    // unified execute-tool repository instead of the local handler.
    if (context.toolName.includes("__")) {
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const result = await RouteExecuteRepository.runInProcess({
        toolName: context.toolName,
        input: context.data as Record<string, WidgetData>,
        callbackMode: "wait",
        user: context.user,
        locale: context.locale,
        logger,
        streamContext: makeHeadlessContext(context.signal),
        platform: Platform.MCP,
      });
      if (!result.success) {
        return this.fail({
          error: result.message,
          code: MCPErrorCode.TOOL_EXECUTION_FAILED,
          details: { toolName: context.toolName },
        });
      }
      return await this.convertToMCPResult(
        result,
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

    const streamContext = makeHeadlessContext(context.signal);

    // Remote routing: check if a remote connection's routing rules match this request.
    // Same logic as CLI remote leg — if a target is found, route through runInProcess
    // with instanceId so both direct-http and reverse-ws transports are handled uniformly.
    // Hot-reload is local-only; remote execution uses the remote's own module cache.
    const userId =
      !context.user.isPublic && "id" in context.user
        ? context.user.id
        : undefined;
    if (userId) {
      const { RemoteTransport } =
        await import("@/app/api/[locale]/remote-connection/transport");
      const target = await RemoteTransport.resolveTarget({
        userId,
        locale: context.locale,
        logger,
      });
      if (target) {
        const { RouteExecuteRepository } =
          await import("next-vibe/execute-tool/repository");
        const remoteResult = await RouteExecuteRepository.runInProcess({
          toolName: context.toolName,
          input: context.data as Record<string, WidgetData>,
          instanceId: target.instanceId,
          callbackMode: "wait",
          user: context.user,
          locale: context.locale,
          logger,
          streamContext,
          platform: Platform.MCP,
        });
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

    // Route local execution through the unified execute-tool repository — the
    // single dispatch path that applies the permission cascade, folder
    // restrictions, and confirmation gate (same as AI/remote). MCP keeps only
    // its platform concerns: hot-reload (via preloadedHandler), result
    // formatting, and the Bun TDZ retry. freshHandler is undefined for
    // hot-reload-excluded tools → the executor loads the handler itself.
    const { RouteExecuteRepository } =
      await import("next-vibe/execute-tool/repository");
    const runTool = (): Promise<ResponseType<WidgetData>> =>
      RouteExecuteRepository.runInProcess({
        toolName: context.toolName,
        input: context.data as Record<string, WidgetData>,
        callbackMode: "wait",
        user: context.user,
        locale: context.locale,
        logger,
        streamContext,
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
