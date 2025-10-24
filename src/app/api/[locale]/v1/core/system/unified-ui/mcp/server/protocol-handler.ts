/**
 * MCP Protocol Handler
 * Handles MCP JSON-RPC 2.0 protocol messages
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { getMCPConfig } from "../config";
import { getMCPRegistry, toolMetadataToMCPTool } from "../registry";
import type {
  IMCPProtocolHandler,
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPToolCallParams,
  MCPToolCallResult,
  MCPToolsListParams,
  MCPToolsListResult,
} from "../types";
import { MCPErrorCode, MCPMethod } from "../types";

/**
 * MCP Protocol Handler Implementation
 */
export class MCPProtocolHandler implements IMCPProtocolHandler {
  private initialized = false;
  private logger: EndpointLogger;
  private locale: CountryLanguage;
  private user: JwtPayloadType;

  constructor(
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ) {
    this.logger = logger;
    this.locale = locale;
    this.user = user;
  }

  /**
   * Handle incoming JSON-RPC request
   */
  async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    this.logger.debug("[MCP Protocol] Received request", {
      method: request.method,
      id: request.id,
    });

    try {
      // Validate JSON-RPC version
      if (request.jsonrpc !== "2.0") {
        return this.createErrorResponse(
          request.id || null,
          MCPErrorCode.INVALID_REQUEST,
          "Invalid JSON-RPC version",
        );
      }

      // Route to appropriate handler
      let result: unknown;

      switch (request.method) {
        case MCPMethod.INITIALIZE:
          result = await this.handleInitialize(
            request.params as MCPInitializeParams,
          );
          this.initialized = true;
          break;

        case MCPMethod.PING:
          result = await this.handlePing();
          break;

        case MCPMethod.TOOLS_LIST:
          if (!this.initialized) {
            return this.createErrorResponse(
              request.id || null,
              MCPErrorCode.INVALID_REQUEST,
              "Server not initialized. Call initialize first.",
            );
          }
          result = await this.handleToolsList(
            request.params as MCPToolsListParams,
          );
          break;

        case MCPMethod.TOOLS_CALL:
          if (!this.initialized) {
            return this.createErrorResponse(
              request.id || null,
              MCPErrorCode.INVALID_REQUEST,
              "Server not initialized. Call initialize first.",
            );
          }
          result = await this.handleToolCall(
            request.params as MCPToolCallParams,
          );
          break;

        default:
          return this.createErrorResponse(
            request.id || null,
            MCPErrorCode.METHOD_NOT_FOUND,
            `Method not found: ${request.method}`,
          );
      }

      return this.createSuccessResponse(request.id || null, result);
    } catch (error) {
      this.logger.error("[MCP Protocol] Request handling failed", {
        method: request.method,
        error: error instanceof Error ? error.message : String(error),
      });

      return this.createErrorResponse(
        request.id || null,
        MCPErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Handle initialize request
   */
  async handleInitialize(
    params: MCPInitializeParams,
  ): Promise<MCPInitializeResult> {
    this.logger.info("[MCP Protocol] Initializing", {
      clientName: params.clientInfo.name,
      clientVersion: params.clientInfo.version,
      protocolVersion: params.protocolVersion,
    });

    const config = getMCPConfig();

    // Initialize registry
    const registry = getMCPRegistry(this.locale);
    await registry.initialize();

    return {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: config.capabilities.tools ? { listChanged: false } : undefined,
        prompts: config.capabilities.prompts
          ? { listChanged: false }
          : undefined,
        resources: config.capabilities.resources
          ? { subscribe: false }
          : undefined,
      },
      serverInfo: {
        name: config.name,
        version: config.version,
      },
    };
  }

  /**
   * Handle tools/list request
   */
  async handleToolsList(
    _params: MCPToolsListParams,
  ): Promise<MCPToolsListResult> {
    this.logger.info("[MCP Protocol] Listing tools");

    const registry = getMCPRegistry(this.locale);
    const toolMetadata = await registry.getTools(this.user);

    // Convert to MCP tool format
    const tools = toolMetadata.map((meta) =>
      toolMetadataToMCPTool(meta, this.locale),
    );

    this.logger.info("[MCP Protocol] Tools listed", {
      count: tools.length,
    });

    return {
      tools,
      // No pagination for now
    };
  }

  /**
   * Handle tools/call request
   */
  async handleToolCall(
    params: MCPToolCallParams,
  ): Promise<MCPToolCallResult> {
    this.logger.info("[MCP Protocol] Calling tool", {
      toolName: params.name,
    });

    const registry = getMCPRegistry(this.locale);

    // Execute tool
    const result = await registry.executeTool({
      toolName: params.name,
      arguments: params.arguments || {},
      user: this.user,
      locale: this.locale,
      requestId: Date.now(),
    });

    this.logger.info("[MCP Protocol] Tool call complete", {
      toolName: params.name,
      isError: result.isError,
    });

    return result;
  }

  /**
   * Handle ping request
   */
  async handlePing(): Promise<Record<string, never>> {
    this.logger.debug("[MCP Protocol] Ping");
    return {};
  }

  /**
   * Create success response
   */
  private createSuccessResponse(
    id: string | number | null,
    result: unknown,
  ): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      result,
      id,
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(
    id: string | number | null,
    code: MCPErrorCode,
    message: string,
    data?: unknown,
  ): JsonRpcResponse {
    const error: JsonRpcError = {
      code,
      message,
      data,
    };

    return {
      jsonrpc: "2.0",
      error,
      id,
    };
  }
}

/**
 * Create protocol handler with CLI user
 */
export async function createMCPProtocolHandler(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<MCPProtocolHandler> {
  // Get CLI user for authentication
  const user = await getCliUser(logger);

  return new MCPProtocolHandler(logger, locale, user);
}

/**
 * Get CLI user with fallback
 */
async function getCliUser(
  logger: EndpointLogger,
): Promise<JwtPayloadType> {
  try {
    const { userRepository } = await import("@/app/api/[locale]/v1/core/user/repository");
    const { UserDetailLevel } = await import("@/app/api/[locale]/v1/core/user/enum");

    const CLI_USER_EMAIL =
      process.env.VIBE_CLI_USER_EMAIL || "cli@system.local";

    const userResponse = await userRepository.getUserByEmail(
      CLI_USER_EMAIL,
      UserDetailLevel.COMPLETE,
      logger,
    );

    if (userResponse.success && userResponse.data) {
      const user = userResponse.data;

      return {
        isPublic: false,
        id: user.id,
        email: user.email,
        role: UserRole.ADMIN,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
    } else {
      // Fallback to default CLI user
      logger.debug(
        "[MCP Protocol] CLI user not found in database, using default",
      );
      return {
        isPublic: false,
        id: "00000000-0000-0000-0000-000000000001",
        email: "cli@system.local",
        role: UserRole.ADMIN,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
    }
  } catch (error) {
    logger.debug("[MCP Protocol] Error getting CLI user, using default:", {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fallback to default CLI user
    return {
      isPublic: false,
      id: "00000000-0000-0000-0000-000000000001",
      email: "cli@system.local",
      role: UserRole.ADMIN,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}
