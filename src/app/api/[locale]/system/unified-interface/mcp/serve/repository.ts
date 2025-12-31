/**
 * MCP Server Serve Repository
 * Handles MCP server startup logic
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import { MCPServer } from "../server/server";
import type { MCPServeResponseInput } from "./definition";

class MCPServeRepository {
  /**
   * Start MCP server
   * Note: This function never returns as the MCP server takes over the process
   */
  async startServer(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<MCPServeResponseInput>> {
    // Log current directory (chdir already happened in vibe-runtime)
    logger.info("[MCP] Starting MCP server", {
      cwd: process.cwd(),
      projectRoot: process.env.PROJECT_ROOT,
    });

    const mcpServer = new MCPServer();

    // This never returns - the MCP server takes over stdin/stdout
    await mcpServer.start(logger, locale);

    // Never reached - server runs until process exits
    return success({
      status: "MCP server started successfully",
    });
  }
}

export const mcpServeRepository = new MCPServeRepository();
