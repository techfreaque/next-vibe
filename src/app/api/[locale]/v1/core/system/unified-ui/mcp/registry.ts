/**
 * MCP Tool Registry
 * Provides MCP-specific tool management and execution
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { toolFilter } from "../ai/filter";
import { BaseRegistry } from "../shared/base-registry";
import { endpointToMetadata } from "../shared/converters/base-converter";
/**
 * Singleton instance using shared factory
 */
import { createKeyedSingletonGetter } from "../shared/utils/singleton-factory";
import { isMCPServerEnabled } from "./config";
import { endpointToMCPToolMetadata, toolMetadataToMCPTool } from "./converter";
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

  constructor(logger: EndpointLogger) {
    super(logger, {
      platformName: "MCP Registry",
      enabledCheck: isMCPServerEnabled,
    });
  }

  /**
   * Post-initialization hook - convert endpoints to MCP tools
   */
  protected async onInitialized(): Promise<void> {
    const endpoints = super.getEndpoints();
    this.tools = endpoints.map((endpoint) =>
      endpointToMCPToolMetadata(endpointToMetadata(endpoint)),
    );

    this.logger.info("[MCP Registry] Tools registered", {
      toolsCount: this.tools.length,
    });
  }

  /**
   * Get all tools for a specific user (filtered by permissions)
   */
  getTools(user: JwtPayloadType): MCPToolMetadata[] {
    this.ensureInitialized();

    // Filter tools by user permissions
    return this.tools.filter((tool) => {
      const endpoint = super
        .getEndpoints()
        .find((e) => e.id === tool.endpointId);
      if (!endpoint) {
        return false;
      }

      return (
        toolFilter.filterEndpointsByPermissions([endpoint], user).length > 0
      );
    });
  }

  /**
   * Get tool metadata by name
   */
  getToolByName(name: string): MCPToolMetadata | undefined {
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

    // Get tool metadata
    const toolMeta = this.getToolByName(context.toolName);
    if (!toolMeta) {
      const errorText = "Tool not found" as const;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: errorText,
              code: MCPErrorCode.TOOL_NOT_FOUND,
              toolName: context.toolName,
            }),
          },
        ],
        isError: true,
      };
    }

    // Check permissions
    const endpoint = super
      .getEndpoints()
      .find((e) => e.id === toolMeta.endpointId);
    if (!endpoint) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Endpoint not found",
              code: MCPErrorCode.TOOL_NOT_FOUND,
              toolName: context.toolName,
            }),
          },
        ],
        isError: true,
      };
    }

    const hasPermission =
      toolFilter.filterEndpointsByPermissions([endpoint], context.user).length >
      0;
    if (!hasPermission) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Permission denied",
              code: MCPErrorCode.PERMISSION_DENIED,
              toolName: context.toolName,
              requiredRoles: toolMeta.allowedRoles,
            }),
          },
        ],
        isError: true,
      };
    }

    // Execute tool using shared base executor
    try {
      const { RouteDelegationHandler } = await import(
        "../../unified-backend/cli/route-executor"
      );
      const { simpleT } = await import("@/i18n/core/shared");

      const { t } = simpleT(context.locale);

      const discoveredRoute = {
        alias: toolMeta.name,
        path: toolMeta.endpointPath,
        method: toolMeta.method,
        routePath: toolMeta.routePath,
        description: toolMeta.description,
      };

      const executionContext = {
        command: toolMeta.name,
        data: context.arguments,
        urlPathParams: {},
        user: context.user,
        locale: context.locale,
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

      return this.convertToMCPResult(result, context.toolName);
    } catch (error) {
      this.logger.error("[MCP Registry] Tool execution failed", {
        toolName: context.toolName,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Tool execution failed",
              code: MCPErrorCode.TOOL_EXECUTION_FAILED,
              toolName: context.toolName,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Convert route execution result to MCP format
   */
  private convertToMCPResult(
    result: { success: boolean; data?: unknown; error?: string },
    toolName: string,
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

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: result.error || "Tool execution failed",
              code: MCPErrorCode.TOOL_EXECUTION_FAILED,
              toolName,
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }

  /**
   * Legacy executeTool method - kept for compatibility
   */
  private async legacyExecuteTool(
    context: MCPExecutionContext,
  ): Promise<MCPToolCallResult> {
    try {
      const { RouteDelegationHandler } = await import(
        "../../unified-backend/cli/route-executor"
      );
      const { simpleT } = await import("@/i18n/core/shared");

      const { t } = simpleT(context.locale);
      const toolMeta = this.getToolByName(context.toolName);

      if (!toolMeta) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Tool not found",
                code: MCPErrorCode.TOOL_NOT_FOUND,
                toolName: context.toolName,
              }),
            },
          ],
          isError: true,
        };
      }

      const discoveredRoute = {
        alias: toolMeta.name,
        path: toolMeta.endpointPath,
        method: toolMeta.method,
        routePath: toolMeta.routePath,
        description: toolMeta.description,
      };

      const executionContext = {
        command: toolMeta.name,
        data: context.arguments,
        urlPathParams: {},
        user: context.user,
        locale: context.locale,
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

      return this.convertToMCPResult(result, context.toolName);
    } catch (error) {
      this.logger.error("[MCP Registry] Tool execution failed", {
        toolName: context.toolName,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              code: MCPErrorCode.TOOL_EXECUTION_FAILED,
              toolName: context.toolName,
            }),
          },
        ],
        isError: true,
      };
    }
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
  private findToolByAlias(alias: string): MCPToolMetadata | undefined {
    // Search through all tools for matching aliases
    for (const tool of this.tools) {
      const endpoint = super
        .getEndpoints()
        .find((e) => e.id === tool.endpointId);
      if (!endpoint) {
        continue;
      }

      // Check if alias matches any of the endpoint's aliases
      const aliases = endpoint.definition.cli?.aliases;
      if (aliases?.includes(alias)) {
        return tool;
      }
    }

    return undefined;
  }
}

export const getMCPRegistry = createKeyedSingletonGetter(
  (key: string, locale: CountryLanguage) => {
    const enabledResult = isMCPServerEnabled();
    const logger = createEndpointLogger(
      enabledResult.debug || false,
      Date.now(),
      locale,
    );
    return new MCPRegistry(logger);
  },
);

/**
 * Export converter utilities for direct use
 */
export { toolMetadataToMCPTool };
