/**
 * MCP Server Serve Repository
 * Handles MCP server startup logic
 */

import "server-only";

import type { IDefinitionLoader } from "../../../core/definition/loader";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { IDefinitionsRegistry } from "../../../core/route/definitions-registry";
import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import type { MCPRegistry } from "../registry";
import { MCPServer } from "../server/server";
import type { MCPServeResponseInput } from "./definition";

export class MCPServeRepository {
  /**
   * Start MCP server
   * Note: This function never returns as the MCP server takes over the process
   */
  static async startServer(
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
    registry?: MCPRegistry,
    defRegistry?: IDefinitionsRegistry,
    definitionLdr?: IDefinitionLoader,
  ): Promise<ResponseType<MCPServeResponseInput>> {
    // Log current directory (chdir already happened in vibe-runtime)
    logger.debug(`[MCP] Starting server cwd=${process.cwd()}`);

    const mcpServer = new MCPServer(registry, defRegistry, definitionLdr);

    // This never returns - the MCP server takes over stdin/stdout
    await mcpServer.start(logger, locale, user);

    // Never reached - server runs until process exits
    return success({
      status: "MCP server started successfully",
    });
  }
}
