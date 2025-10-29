/**
 * MCP Execute Repository
 * Business logic for executing MCP tools
 */

import "server-only";

import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import { createSuccessResponse } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
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
    locale: CountryLanguage,
  ): Promise<ResponseType<MCPExecuteResponseOutput>>;
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
    locale: CountryLanguage,
  ): Promise<ResponseType<MCPExecuteResponseOutput>> {
    logger.info("[MCP Execute Repository] Executing tool", {
      toolName: data.name,
      argumentKeys: Object.keys(data.arguments),
    });

    // Get MCP registry
    const registry = getMCPRegistry(locale);

    // Ensure initialized
    if (!registry.isInitialized()) {
      await registry.initialize();
    }

    // Execute tool
    const result = await registry.executeTool({
      toolName: data.name,
      arguments: data.arguments,
      user,
      locale,
      requestId: Date.now(),
    },

    logger.info("[MCP Execute Repository] Tool execution complete", {
      toolName: data.name,
      isError: result.isError,
      contentLength: result.content.length,
    },

    return createSuccessResponse(result);
  }
}

// Export singleton instance of the repository
export const mcpExecuteRepository = new MCPExecuteRepositoryImpl();
