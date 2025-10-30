/**
 * MCP Protocol Handler
 * Handles MCP JSON-RPC 2.0 protocol messages
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import { getCliUser } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/auth/cli-user";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../shared/logger/endpoint";
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
import { getMCPConfig } from "./config";
import { MCPErrorCode, MCPMethod } from "./types";

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
        return this.fail(
          request.id || null,
          MCPErrorCode.INVALID_REQUEST,
          // eslint-disable-next-line i18next/no-literal-string
          "Invalid JSON-RPC version",
        );
      }

      // Route to appropriate handler
      let result: Record<string, string | number | boolean | null | object>;

      switch (request.method) {
        case MCPMethod.INITIALIZE:
          result = (await this.handleInitialize(
            request.params as unknown as MCPInitializeParams,
          )) as unknown as Record<
            string,
            string | number | boolean | null | object
          >;
          this.initialized = true;
          break;

        case MCPMethod.PING:
          result = await this.handlePing();
          break;

        case MCPMethod.TOOLS_LIST:
          if (!this.initialized) {
            return this.fail(
              request.id || null,
              MCPErrorCode.INVALID_REQUEST,
              // eslint-disable-next-line i18next/no-literal-string
              "Server not initialized. Call initialize first.",
            );
          }
          result = (await this.handleToolsList(
            request.params as MCPToolsListParams,
          )) as unknown as Record<
            string,
            string | number | boolean | null | object
          >;
          break;

        case MCPMethod.TOOLS_CALL:
          if (!this.initialized) {
            return this.fail(
              request.id || null,
              MCPErrorCode.INVALID_REQUEST,
              // eslint-disable-next-line i18next/no-literal-string
              "Server not initialized. Call initialize first.",
            );
          }
          result = (await this.handleToolCall(
            request.params as unknown as MCPToolCallParams,
          )) as unknown as Record<
            string,
            string | number | boolean | null | object
          >;
          break;

        default:
          return this.fail(
            request.id || null,
            MCPErrorCode.METHOD_NOT_FOUND,
            // eslint-disable-next-line i18next/no-literal-string
            `Method not found: ${request.method}`,
          );
      }

      return this.createSuccessResponse(request.id || null, result);
    } catch (error) {
      const parsedError = parseError(error);
      this.logger.error("[MCP Protocol] Request handling failed", {
        method: request.method,
        error: parsedError.message,
      });

      return this.fail(
        request.id || null,
        MCPErrorCode.INTERNAL_ERROR,
        parsedError.message,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  async handleToolCall(params: MCPToolCallParams): Promise<MCPToolCallResult> {
    this.logger.info("[MCP Protocol] Calling tool", {
      toolName: params.name,
    });

    const registry = getMCPRegistry(this.locale);

    // Execute tool
    const result = await registry.executeTool({
      toolName: params.name,
      data: (params.arguments || {}) as { [key: string]: never },
      user: this.user,
      locale: this.locale,
      requestId: Date.now(),
      logger: this.logger,
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
  // eslint-disable-next-line @typescript-eslint/require-await
  async handlePing(): Promise<Record<string, never>> {
    this.logger.debug("[MCP Protocol] Ping");
    return {};
  }

  /**
   * Create success response
   */
  private createSuccessResponse(
    id: string | number | null,
    result: Record<string, string | number | boolean | null | object>,
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
  private fail(
    id: string | number | null,
    code: MCPErrorCode,
    message: string,
    data?: Record<string, string | number | boolean | null | object>,
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
  // Get CLI user for authentication using consolidated factory
  const cliUser = await getCliUser(logger, locale);

  if (!cliUser.id) {
    throw new Error("CLI user ID is required");
  }

  // Convert to JwtPayloadType for MCP
  const user: JwtPayloadType = {
    isPublic: false,
    id: cliUser.id,
    leadId: cliUser.id, // Use same ID for leadId in CLI context
  };

  return new MCPProtocolHandler(logger, locale, user);
}
