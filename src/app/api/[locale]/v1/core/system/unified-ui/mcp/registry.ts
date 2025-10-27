/**
 * MCP Tool Registry
 * Wraps shared endpoint registry and provides MCP-specific functionality
 *
 * NOTE: This registry now uses the unified platform system internally.
 * For new code, consider using createMCPPlatform() from shared/platform/unified-platform.ts
 *
 * @see src/app/api/[locale]/v1/core/system/unified-ui/shared/platform/unified-platform.ts
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { toolFilter } from "../ai/filter";
import { getEndpointRegistry } from "../shared/endpoint-registry";
import { getMCPConfig, isMCPServerEnabled } from "./config";
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
 */
export class MCPRegistry implements IMCPRegistry {
  private initialized = false;
  private tools: MCPToolMetadata[] = [];
  private logger: EndpointLogger;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Initialize the registry using shared endpoint registry
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!isMCPServerEnabled()) {
      this.logger.warn("[MCP Registry] MCP server is disabled");
      return;
    }

    try {
      this.logger.info("[MCP Registry] Starting discovery...");

      const config = getMCPConfig();

      // Use shared endpoint registry
      const endpointRegistry = getEndpointRegistry(this.logger);
      await endpointRegistry.initialize({
        rootDir: config.rootDir,
        excludePaths: config.excludePaths,
      });

      // Get all endpoints
      const endpoints = await endpointRegistry.getAllEndpoints();

      this.logger.info("[MCP Registry] Discovery complete", {
        endpointsFound: endpoints.length,
      });

      // Convert to MCP tool metadata
      this.tools = endpoints.map((endpoint) =>
        endpointToMCPToolMetadata(endpoint),
      );

      this.logger.info("[MCP Registry] Tools registered", {
        toolsCount: this.tools.length,
      });

      this.initialized = true;
    } catch (error) {
      this.logger.error("[MCP Registry] Initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Get all tools for a specific user (filtered by permissions)
   */
  async getTools(user: JwtPayloadType): Promise<MCPToolMetadata[]> {
    await this.ensureInitialized();

    // Filter tools by user permissions
    return this.tools.filter((tool) => {
      // Convert to format compatible with toolFilter
      const aiToolMeta = {
        name: tool.name,
        description: tool.description,
        category: tool.category || "general",
        tags: tool.tags,
        endpointId: tool.endpointId,
        allowedRoles: tool.allowedRoles,
      };

      return toolFilter.hasPermission(aiToolMeta, user);
    });
  }

  /**
   * Get tool metadata by name
   */
  async getToolByName(name: string): Promise<MCPToolMetadata | null> {
    await this.ensureInitialized();

    // Try direct name match first
    let tool = this.tools.find((t) => t.name === name);
    if (tool) {
      return tool;
    }

    // Try aliases (check definition files)
    tool = await this.findToolByAlias(name);
    return tool || null;
  }

  /**
   * Execute a tool
   */
  async executeTool(context: MCPExecutionContext): Promise<MCPToolCallResult> {
    await this.ensureInitialized();

    // Get tool metadata
    const toolMeta = await this.getToolByName(context.toolName);
    if (!toolMeta) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              // eslint-disable-next-line i18next/no-literal-string
              error: "Tool not found",
              code: MCPErrorCode.TOOL_NOT_FOUND,
              toolName: context.toolName,
            }),
          },
        ],
        isError: true,
      };
    }

    // Check permissions
    const aiToolMeta = {
      name: toolMeta.name,
      description: toolMeta.description,
      category: toolMeta.category || "general",
      tags: toolMeta.tags,
      endpointId: toolMeta.endpointId,
      allowedRoles: toolMeta.allowedRoles,
    };

    if (!toolFilter.hasPermission(aiToolMeta, context.user)) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Permission denied",
              code: MCPErrorCode.PERMISSION_DENIED,
              toolName: context.toolName,
              userRole: context.user.role,
              requiredRoles: toolMeta.allowedRoles,
            }),
          },
        ],
        isError: true,
      };
    }

    // Execute tool using route delegation handler
    try {
      const { routeDelegationHandler } = await import(
        "../cli/vibe/utils/route-delegation-handler"
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

      const result = await routeDelegationHandler.executeRoute(
        discoveredRoute,
        executionContext,
        this.logger,
        context.locale,
        t,
      );

      // Convert result to MCP format
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
      } else {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  // eslint-disable-next-line i18next/no-literal-string
                  error: result.error || "Tool execution failed",
                  code: MCPErrorCode.TOOL_EXECUTION_FAILED,
                  toolName: context.toolName,
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }
    } catch (error) {
      this.logger.error("[MCP Registry] Tool execution failed", {
        toolName: context.toolName,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: error instanceof Error ? error.message : String(error),
                code: MCPErrorCode.TOOL_EXECUTION_FAILED,
                toolName: context.toolName,
              },
              null,
              2,
            ),
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

    const config = getMCPConfig();

    // Get shared endpoint registry and refresh it
    const endpointRegistry = getEndpointRegistry(this.logger);
    await endpointRegistry.refresh({
      rootDir: config.rootDir,
      excludePaths: config.excludePaths,
    });

    // Re-initialize
    this.initialized = false;
    this.tools = [];

    await this.initialize();
  }

  /**
   * Find tool by checking definition files for custom aliases
   */
  private async findToolByAlias(
    alias: string,
  ): Promise<MCPToolMetadata | null> {
    // Get unique route files
    const uniqueRouteFiles = [...new Set(this.tools.map((t) => t.routePath))];

    for (const routeFile of uniqueRouteFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

      try {
        // Use dynamic import
        const definitionModule = (await import(definitionPath)) as {
          default?: Record<
            string,
            {
              aliases?: string[];
            }
          >;
        };

        // Check default export
        if (
          definitionModule.default &&
          typeof definitionModule.default === "object"
        ) {
          for (const methodKey of Object.keys(definitionModule.default)) {
            const methodDef = definitionModule.default[methodKey];
            if (
              methodDef &&
              typeof methodDef === "object" &&
              Array.isArray(methodDef.aliases)
            ) {
              if (methodDef.aliases.includes(alias)) {
                // Found it! Return the tool with this alias
                const existingTool = this.tools.find(
                  (t) => t.routePath === routeFile,
                );
                if (existingTool) {
                  return {
                    ...existingTool,
                    name: alias,
                  };
                }
              }
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }

    return null;
  }

  /**
   * Ensure registry is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

/**
 * Singleton instance
 */
let registryInstance: MCPRegistry | null = null;

/**
 * Get or create MCP registry instance
 */
export function getMCPRegistry(
  locale: CountryLanguage = "en-GLOBAL",
): MCPRegistry {
  if (!registryInstance) {
    const logger = createEndpointLogger(
      getMCPConfig().debug,
      Date.now(),
      locale,
    );
    registryInstance = new MCPRegistry(logger);
  }
  return registryInstance;
}

/**
 * Export converter utilities for direct use
 */
export { toolMetadataToMCPTool };
