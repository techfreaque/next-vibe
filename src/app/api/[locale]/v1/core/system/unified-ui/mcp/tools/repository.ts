/**
 * MCP Tools Repository
 * Business logic for fetching available MCP tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { getMCPRegistry, toolMetadataToMCPTool } from "../registry";
import type {
  MCPToolsListRequestOutput,
  MCPToolsListResponseOutput,
} from "./definition";

/**
 * MCP Tools repository interface
 */
export interface MCPToolsRepository {
  /**
   * Get all available MCP tools for current user
   * @param data - Request data (empty for GET)
   * @param user - User from authentication
   * @param logger - Logger instance for debugging and monitoring
   * @param locale - Locale for translating tool descriptions
   * @returns List of available MCP tools
   */
  getTools(
    data: MCPToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale?: CountryLanguage,
  ): Promise<MCPToolsListResponseOutput>;
}

/**
 * MCP Tools repository implementation
 */
export class MCPToolsRepositoryImpl implements MCPToolsRepository {
  /**
   * Get all available MCP tools for current user
   */
  async getTools(
    data: MCPToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage = "en-GLOBAL",
  ): Promise<MCPToolsListResponseOutput> {
    logger.info("[MCP Tools Repository] Fetching available tools");

    // Get MCP registry
    const registry = getMCPRegistry(locale);

    // Ensure initialized
    if (!registry.isInitialized()) {
      await registry.initialize();
    }

    // Get tools filtered by user permissions
    const toolMetadata = await registry.getTools(user);

    logger.info("[MCP Tools Repository] Found tools", {
      count: toolMetadata.length,
    });

    // Convert to MCP tool format (wire format)
    const tools = toolMetadata.map((meta) =>
      toolMetadataToMCPTool(meta, locale),
    );

    const result = {
      tools,
    };

    logger.info("[MCP Tools Repository] Returning result", {
      resultKeys: Object.keys(result),
      toolsCount: tools.length,
      sampleTool: tools[0],
    });

    // Return plain object - route handler will wrap with createSuccessResponse
    return result;
  }
}

// Export singleton instance of the repository
export const mcpToolsRepository = new MCPToolsRepositoryImpl();
