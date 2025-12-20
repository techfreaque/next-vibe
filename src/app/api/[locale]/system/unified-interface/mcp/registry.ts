/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TParams } from "@/i18n/core/static-types";

import { definitionsRegistry } from "../shared/endpoints/definitions/registry";
import { routeExecutionExecutor } from "../shared/endpoints/route/executor";
import type { CreateApiEndpointAny } from "../shared/types/endpoint";
import { Platform } from "../shared/types/platform";
import type {
  MCPExecutionContext,
  MCPToolCallResult,
  MCPToolMetadata,
} from "./types";
import { MCPErrorCode } from "./types";

/**
 * MCP Registry Interface
 */
export interface IMCPRegistry {
  initialize(logger: EndpointLogger, locale: CountryLanguage): Promise<void>;
  getTools(user: JwtPayloadType, logger: EndpointLogger): MCPToolMetadata[];
  getToolByName(name: string, logger: EndpointLogger): MCPToolMetadata | null;
  executeTool(
    context: MCPExecutionContext,
    logger: EndpointLogger,
  ): Promise<MCPToolCallResult>;
  isInitialized(): boolean;
  refresh(logger: EndpointLogger, locale: CountryLanguage): Promise<void>;
}

/**
 * MCP Registry Implementation
 */
export class MCPRegistry implements IMCPRegistry {
  private initialized = false;
  private lastRefresh = 0;
  private locale: CountryLanguage = "en-GLOBAL" as CountryLanguage;

  /**
   * Initialize the registry
   */
  async initialize(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      logger.info("[MCP Registry] Starting initialization...");

      this.locale = locale;
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
  getTools(user: JwtPayloadType, logger: EndpointLogger): MCPToolMetadata[] {
    this.ensureInitialized(logger);

    // Get serialized tools from shared registry (already filtered by user)
    const serialized = definitionsRegistry.getSerializedToolsForUser(
      Platform.MCP,
      user,
      this.locale,
      logger,
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
   * Get full endpoints for a specific user (filtered by permissions)
   * Returns endpoints with field information for schema generation
   */
  getEndpoints(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): CreateApiEndpointAny[] {
    this.ensureInitialized(logger);

    // Get filtered endpoints from shared registry
    return definitionsRegistry.getEndpointsForUser(Platform.MCP, user, logger);
  }

  /**
   * Get tool metadata by name
   */
  getToolByName(name: string, logger: EndpointLogger): MCPToolMetadata | null {
    this.ensureInitialized(logger);

    // Get all tools (this will be filtered by user in getTools, but here we need unfiltered)
    // For now, we'll use a public user to get all tools
    const publicUser: JwtPayloadType = {
      isPublic: true,
      leadId: "mcp-registry-anonymous",
      roles: [UserPermissionRole.PUBLIC],
    };

    const tools = this.getTools(publicUser, logger);

    // Try direct name match first
    const tool = tools.find((t) => t.name === name);
    if (tool) {
      return tool;
    }

    // Try aliases
    return tools.find((t) => t.aliases?.includes(name)) || null;
  }

  /**
   * Execute a tool
   */
  async executeTool(
    context: MCPExecutionContext,
    logger: EndpointLogger,
  ): Promise<MCPToolCallResult> {
    this.ensureInitialized(logger);

    const { t } = simpleT(context.locale);

    // Get tool metadata (this checks if tool exists and user has permission)
    const userTools = this.getTools(context.user, logger);
    const toolMeta = userTools.find(
      (t) =>
        t.name === context.toolName || t.aliases?.includes(context.toolName),
    );

    if (!toolMeta) {
      return this.fail({
        error: t("app.api.system.unifiedInterface.mcp.registry.toolNotFound"),
        code: MCPErrorCode.TOOL_NOT_FOUND,
        details: { toolName: context.toolName },
      });
    }

    // Execute tool using shared generic handler
    try {
      logger.debug("[MCP Registry] Executing tool", {
        toolName: context.toolName,
        user: context.user.isPublic
          ? { isPublic: true, leadId: context.user.leadId }
          : { isPublic: false, id: context.user.id },
        dataKeys: Object.keys(context.data),
      });

      const result = await routeExecutionExecutor.executeGenericHandler({
        toolName: context.toolName,
        data: context.data,
        user: context.user,
        locale: context.locale,
        logger,
        platform: Platform.MCP,
      });

      logger.debug("[MCP Registry] Tool execution complete", {
        toolName: context.toolName,
        success: result.success,
        hasData: !!(result.success && result.data),
        errorMessage: result.success ? undefined : result.message,
      });

      return this.convertToMCPResult(result, context.toolName, context.locale);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("[MCP Registry] Tool execution failed with exception", {
        toolName: context.toolName,
        error: parsedError.message,
        stack: parsedError.stack,
      });

      return this.fail({
        error: t(
          "app.api.system.unifiedInterface.mcp.registry.toolExecutionFailed",
        ),
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
  ): MCPToolCallResult {
    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data || result, null, 2),
          },
        ],
        isError: false,
      };
    }

    const { t } = simpleT(locale);

    // Extract error message from ResponseType
    const errorMessage = result.message
      ? t(result.message, result.messageParams)
      : t("app.api.system.unifiedInterface.mcp.registry.toolExecutionFailed");

    // Build detailed error information for debugging
    const errorDetails: {
      toolName: string;
      errorType?: string;
      message?: string;
      messageParams?: TParams;
      cause?: string;
      causeType?: string;
      causeParams?: TParams;
    } = {
      toolName,
      errorType: result.errorType?.errorKey,
      message: result.message,
      messageParams: result.messageParams,
    };

    // Include full cause chain for better debugging
    if (result.cause) {
      errorDetails.cause = result.cause.message;
      errorDetails.causeType = result.cause.errorType?.errorKey;
      errorDetails.causeParams = result.cause.messageParams;
    }

    return this.fail({
      error: errorMessage,
      code: MCPErrorCode.TOOL_EXECUTION_FAILED,
      details: errorDetails,
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
  async refresh(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    logger.info("[MCP Registry] Refreshing...");
    this.initialized = false;
    await this.initialize(logger, locale);
  }
}

export const mcpRegistry = new MCPRegistry();
