/**
 * MCP Server Serve Repository
 * Handles MCP server startup logic
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { IDefinitionLoader } from "../../shared/endpoints/definition/loader";
import type { IDefinitionsRegistry } from "../../shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { MCPRegistry } from "../registry";
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
    user: JwtPayloadType,
    registry?: MCPRegistry,
    defRegistry?: IDefinitionsRegistry,
    definitionLdr?: IDefinitionLoader,
  ): Promise<ResponseType<MCPServeResponseInput>> {
    // Log current directory (chdir already happened in vibe-runtime)
    logger.info("[MCP] Starting MCP server", {
      cwd: process.cwd(),
      projectRoot: process.env.PROJECT_ROOT,
    });

    const mcpServer = new MCPServer(registry, defRegistry, definitionLdr);

    // This never returns - the MCP server takes over stdin/stdout
    await mcpServer.start(logger, locale, user);

    // Never reached - server runs until process exits
    return success({
      status: "MCP server started successfully",
    });
  }
}

export const mcpServeRepository = new MCPServeRepository();
