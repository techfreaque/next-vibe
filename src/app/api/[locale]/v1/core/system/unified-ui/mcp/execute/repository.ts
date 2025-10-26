/**
 * MCP Execute Repository
 * Business logic for executing MCP tools
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { getMCPRegistry } from "../registry";
import type {
  MCPExecuteRequestOutput,
  MCPExecuteResponseOutput,
} from "./definition";

/**
 * MCP Execute repository interface
 */
export interface MCPExecuteRepository {
  /**
   * Execute an MCP tool
   * @param data - Request data (tool name and arguments)
   * @param user - User from authentication
   * @param logger - Logger instance for debugging and monitoring
   * @param locale - Locale for error messages
   * @returns Tool execution result
   */
  executeTool(
    data: MCPExecuteRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale?: CountryLanguage,
  ): Promise<MCPExecuteResponseOutput>;
}

/**
 * MCP Execute repository implementation
 */
export class MCPExecuteRepositoryImpl implements MCPExecuteRepository {
  /**
   * Execute an MCP tool
   */
  async executeTool(
    data: MCPExecuteRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage = "en-GLOBAL",
  ): Promise<MCPExecuteResponseOutput> {
    const logData1 = {
      toolName: data.name,
      argumentKeys: Object.keys(data.arguments || {}),
    };
    logger.info("[MCP Execute Repository] Executing tool", logData1);

    // Get MCP registry
    const registry = getMCPRegistry(locale);

    // Ensure initialized
    if (!registry.isInitialized()) {
      await registry.initialize();
    }

    // Execute tool
    const result = await registry.executeTool({
      toolName: data.name,
      arguments: data.arguments || {},
      user,
      locale,
      requestId: Date.now(),
    });

    const logData2 = {
      toolName: data.name,
      isError: result.isError,
      contentLength: result.content.length,
    };
    logger.info("[MCP Execute Repository] Tool execution complete", logData2);

    // Return plain object - route handler will wrap with createSuccessResponse
    return result;
  }
}

// Export singleton instance of the repository
export const mcpExecuteRepository = new MCPExecuteRepositoryImpl();
