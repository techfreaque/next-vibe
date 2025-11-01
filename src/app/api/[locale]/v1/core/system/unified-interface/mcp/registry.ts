/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { RouteExecutionContext } from "../cli/route-executor";
import { endpointToMetadata } from "../shared/conversion/endpoint-to-metadata";
import type { ParameterValue } from "../shared/server-only/execution/executor";
import { BaseRegistry } from "../shared/server-only/execution/registry";
import { toolFilter } from "../shared/server-only/permissions/filter";
/**
 * Singleton instance using shared factory
 */
import { createKeyedSingletonGetter } from "../shared/utils/singleton";
import { isMCPServerEnabled } from "./config";
import { toolMetadataToMCPTool } from "./converter";
import type {
  IMCPRegistry,
  MCPExecutionContext,
  MCPToolCallResult,
  MCPToolMetadata,
} from "./types";
import { MCPErrorCode } from "./types";

/**
 * MCP Registry Implementation
 * Extends BaseRegistry to eliminate duplication
 */
export class MCPRegistry extends BaseRegistry implements IMCPRegistry {
  private tools: MCPToolMetadata[] = [];

  constructor(logger: EndpointLogger, locale: CountryLanguage) {
    super(
      {
        // Platform name is an internal identifier for logging, not user-facing
        // eslint-disable-next-line i18next/no-literal-string
        platformName: "MCP Registry",
        locale,
        enabledCheck: isMCPServerEnabled,
      },
      logger,
    );
  }

  /**
   * Post-initialization hook - convert endpoints to MCP tools
   * Async to match parent interface, even though no await is needed
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async onInitialized(): Promise<void> {
    const endpoints = super.getEndpoints();
    this.tools = endpoints.map((endpoint) => endpointToMetadata(endpoint));

    this.logger.info("[MCP Registry] Tools registered", {
      toolsCount: this.tools.length,
    });
  }

  /**
   * Get all tools for a specific user (filtered by permissions)
   */
  getTools(user: JwtPayloadType): MCPToolMetadata[] {
    this.ensureInitialized();

    // Use base class method for permission filtering
    const filteredEndpoints = super.getEndpointsByPermissions(user);
    const filteredEndpointIds = new Set(filteredEndpoints.map((e) => e.id));

    // Return only tools whose endpoints passed permission check
    return this.tools.filter((tool) => filteredEndpointIds.has(tool.id));
  }

  /**
   * Get tool metadata by name
   */
  getToolByName(name: string): MCPToolMetadata | null {
    this.ensureInitialized();

    // Try direct name match first
    const tool = this.tools.find((t) => t.name === name);
    if (tool) {
      return tool;
    }

    // Try aliases (check definition files)
    return this.findToolByAlias(name);
  }

  /**
   * Execute a tool
   */
  async executeTool(context: MCPExecutionContext): Promise<MCPToolCallResult> {
    this.ensureInitialized();

    const { t } = simpleT(context.locale);

    // Get tool metadata
    const toolMeta = this.getToolByName(context.toolName);
    if (!toolMeta) {
      return this.fail({
        error: t("app.api.v1.core.system.unifiedInterface.mcp.registry.toolNotFound"),
        code: MCPErrorCode.TOOL_NOT_FOUND,
        details: { toolName: context.toolName },
      });
    }

    // Check permissions (toolMeta IS the endpoint now)
    const endpoint = super.getEndpoints().find((e) => e.id === toolMeta.id);
    if (!endpoint) {
      return this.fail({
        error: t(
          "app.api.v1.core.system.unifiedInterface.mcp.registry.endpointNotFound",
        ),
        code: MCPErrorCode.TOOL_NOT_FOUND,
        details: { toolName: context.toolName },
      });
    }

    if (!toolFilter.hasEndpointPermission(endpoint, context.user)) {
      return this.fail({
        error: t(
          "app.api.v1.core.system.unifiedInterface.mcp.registry.permissionDenied",
        ),
        code: MCPErrorCode.PERMISSION_DENIED,
        details: {
          toolName: context.toolName,
          requiredRoles: toolMeta.allowedRoles,
        },
      });
    }

    // Execute tool using shared base executor
    try {
      const { RouteDelegationHandler } = await import(
        "../../unified-interface/cli/route-executor"
      );

      const { t } = simpleT(context.locale);

      const discoveredRoute = {
        alias: toolMeta.name,
        path: toolMeta.path,
        method: toolMeta.method,
        routePath: toolMeta.routePath,
        description: toolMeta.description,
      };

      const executionContext: RouteExecutionContext = {
        toolName: toolMeta.name,
        data: context.data,
        urlPathParams: {},
        user: context.user,
        locale: context.locale,
        logger: this.logger,
        platform: context.platform,
        options: {
          dryRun: false,
          interactive: false,
          output: "json" as const,
        },
      };

      const routeExecutor = new RouteDelegationHandler();
      const result = await routeExecutor.executeRoute(
        discoveredRoute,
        executionContext,
        this.logger,
        context.locale,
        t,
      );

      return this.convertToMCPResult(result, context.toolName, context.locale);
    } catch (error) {
      this.logger.error("[MCP Registry] Tool execution failed", {
        toolName: context.toolName,
        error: error instanceof Error ? error.message : String(error),
      });

      return this.fail({
        error: t(
          "app.api.v1.core.system.unifiedInterface.mcp.registry.toolExecutionFailed",
        ),
        code: MCPErrorCode.TOOL_EXECUTION_FAILED,
        details: { toolName: context.toolName },
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
    // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Tool registration requires 'unknown' for flexible tool definitions
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
  private convertToMCPResult(
    result: { success: boolean; data?: ParameterValue; error?: string },
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
    return this.fail({
      error:
        result.error ||
        t("app.api.v1.core.system.unifiedInterface.mcp.registry.toolExecutionFailed"),
      code: MCPErrorCode.TOOL_EXECUTION_FAILED,
      details: { toolName },
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
  async refresh(): Promise<void> {
    this.logger.info("[MCP Registry] Refreshing...");
    this.tools = [];
    await super.refresh();
  }

  /**
   * Find tool by checking definition files for custom aliases
   */
  private findToolByAlias(alias: string): MCPToolMetadata | null {
    // Search through all tools for matching aliases
    for (const tool of this.tools) {
      const endpoint = super.getEndpoints().find((e) => e.id === tool.id);
      if (!endpoint) {
        continue;
      }

      // Check if alias matches any of the endpoint's aliases
      const aliases = endpoint.definition.aliases;
      if (aliases?.includes(alias)) {
        return tool;
      }
    }

    return null;
  }
}

export const getMCPRegistry = createKeyedSingletonGetter(
  (key: string, locale: CountryLanguage) => {
    const logger = createEndpointLogger(false, Date.now(), locale);
    return new MCPRegistry(logger, locale);
  },
);

/**
 * Export converter utilities for direct use
 */
export { toolMetadataToMCPTool };
