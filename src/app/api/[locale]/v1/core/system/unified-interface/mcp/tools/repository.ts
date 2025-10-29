/**
 * MCP Tools Repository
 * Business logic for fetching available MCP tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { BaseToolsRepositoryImpl } from "../../shared/repositories/base-tools-repository";
import { getMCPRegistry, toolMetadataToMCPTool } from "../registry";
import type {
  MCPToolsListRequestOutput,
  MCPToolsListResponseOutput,
} from "./definition";

/**
 * MCP Tools repository implementation
 * Extends BaseToolsRepositoryImpl to eliminate duplication
 */
export class MCPToolsRepositoryImpl extends BaseToolsRepositoryImpl<
  MCPToolsListRequestOutput,
  MCPToolsListResponseOutput
> {
  constructor() {
    // eslint-disable-next-line i18next/no-literal-string
    super("MCP Tools Repository");
  }
  /**
   * Get all available MCP tools for current user
   */
  async getTools(
    data: MCPToolsListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<MCPToolsListResponseOutput> {
    this.logFetchStart(logger, user);

    // Get MCP registry
    const registry = getMCPRegistry(locale);

    // Ensure initialized
    if (!registry.isInitialized()) {
      await registry.initialize();
    }

    // Get tools filtered by user permissions
    const toolMetadata = registry.getTools(user);

    this.logToolsFound(logger, toolMetadata.length);

    // Convert to MCP tool format (wire format)
    const tools = toolMetadata.map((meta) =>
      toolMetadataToMCPTool(meta, locale),
    );

    const result = {
      tools,
    };

    this.logResult(logger, result, tools.length, tools[0]);

    // Return plain object - route handler will wrap with createSuccessResponse
    return result;
  }
}

// Export singleton instance of the repository
export const mcpToolsRepository = new MCPToolsRepositoryImpl();
