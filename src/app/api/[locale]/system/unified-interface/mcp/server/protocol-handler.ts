/**
 * MCP Protocol Handler
 * Handles MCP JSON-RPC 2.0 protocol messages
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import { getCliUser } from "@/app/api/[locale]/system/unified-interface/cli/auth/cli-user";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { definitionsRegistry } from "../../shared/endpoints/definitions/registry";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import { Platform } from "../../shared/types/platform";
import type { WidgetData } from "../../shared/widgets/widget-data";
import { endpointToMCPTool } from "../converter";
import { mcpRegistry } from "../registry";
import type {
  JsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
  MCPInitializeResult,
  MCPToolCallParams,
  MCPToolCallResult,
  MCPToolsListResult,
} from "../types";
import { MCPErrorCode, MCPMethod } from "../types";

/**
 * MCP Protocol Handler Interface
 */
export interface IMCPProtocolHandler {
  handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse>;
  handleInitialize(params: WidgetData): Promise<MCPInitializeResult>;
  handleToolsList(params: WidgetData): Promise<MCPToolsListResult>;
  handleToolCall(params: MCPToolCallParams): Promise<MCPToolCallResult>;
  handlePing(): Promise<{ [key: string]: never }>;
}

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
          request.id ?? null,
          MCPErrorCode.INVALID_REQUEST,
          "Invalid JSON-RPC version",
        );
      }

      // Route to appropriate handler

      let result:
        | MCPInitializeResult
        | MCPToolsListResult
        | MCPToolCallResult
        | { [key: string]: never };

      switch (request.method) {
        case MCPMethod.INITIALIZE: {
          if (!request.params) {
            return this.fail(
              request.id ?? null,
              MCPErrorCode.INVALID_PARAMS,
              // eslint-disable-next-line i18next/no-literal-string
              "Initialize params are required",
            );
          }
          result = await this.handleInitialize(request.params);
          this.initialized = true;
          break;
        }

        case MCPMethod.PING:
          result = await this.handlePing();
          break;

        case MCPMethod.TOOLS_LIST:
          if (!this.initialized) {
            return this.fail(
              request.id ?? null,
              MCPErrorCode.INVALID_REQUEST,
              // eslint-disable-next-line i18next/no-literal-string
              "Server not initialized. Call initialize first.",
            );
          }

          result = await this.handleToolsList();
          break;

        case MCPMethod.TOOLS_CALL:
          if (!this.initialized) {
            return this.fail(
              request.id ?? null,
              MCPErrorCode.INVALID_REQUEST,
              // eslint-disable-next-line i18next/no-literal-string
              "Server not initialized. Call initialize first.",
            );
          }
          if (
            !request.params ||
            typeof request.params !== "object" ||
            !("name" in request.params) ||
            typeof request.params.name !== "string"
          ) {
            return this.fail(
              request.id ?? null,
              MCPErrorCode.INVALID_PARAMS,
              // eslint-disable-next-line i18next/no-literal-string
              "Tool call params are required",
            );
          }
          // Runtime check ensures params has name property
          const toolCallParams: MCPToolCallParams = {
            name: request.params.name,
            arguments:
              "arguments" in request.params &&
              typeof request.params.arguments === "object" &&
              !Array.isArray(request.params.arguments)
                ? (request.params.arguments as Record<string, WidgetData>)
                : undefined,
          };
          result = await this.handleToolCall(toolCallParams);
          break;

        default:
          return this.fail(
            request.id ?? null,
            MCPErrorCode.METHOD_NOT_FOUND,
            // eslint-disable-next-line i18next/no-literal-string
            `Method not found: ${request.method}`,
          );
      }

      return this.success(request.id ?? null, result);
    } catch (error) {
      const parsedError = parseError(error);
      this.logger.error("[MCP Protocol] Request handling failed", {
        method: request.method,
        error: parsedError.message,
      });

      return this.fail(
        request.id ?? null,
        MCPErrorCode.INTERNAL_ERROR,
        parsedError.message,
      );
    }
  }

  /**
   * Handle initialize request
   */
  async handleInitialize(params: WidgetData): Promise<MCPInitializeResult> {
    const typedParams = params;
    this.logger.info("[MCP Protocol] Initializing", {
      clientName:
        typeof typedParams === "object" &&
        typedParams !== null &&
        "clientInfo" in typedParams &&
        typeof typedParams.clientInfo === "object" &&
        typedParams.clientInfo !== null &&
        "name" in typedParams.clientInfo
          ? String(typedParams.clientInfo.name)
          : "unknown",
      clientVersion:
        typeof typedParams === "object" &&
        typedParams !== null &&
        "clientInfo" in typedParams &&
        typeof typedParams.clientInfo === "object" &&
        typedParams.clientInfo !== null &&
        "version" in typedParams.clientInfo
          ? String(typedParams.clientInfo.version)
          : "unknown",
      protocolVersion:
        typeof typedParams === "object" &&
        typedParams !== null &&
        "protocolVersion" in typedParams
          ? String(typedParams.protocolVersion)
          : "unknown",
    });

    // Initialize registry
    await mcpRegistry.initialize(this.logger, this.locale);

    const capabilities = {
      tools: true,
      prompts: false,
      resources: false,
    };

    return {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: capabilities.tools ? { listChanged: false } : undefined,
        prompts: capabilities.prompts ? { listChanged: false } : undefined,
        resources: capabilities.resources ? { subscribe: false } : undefined,
      },
      serverInfo: {
        // eslint-disable-next-line i18next/no-literal-string
        name: "Vibe MCP Server",
        version: "1.0.0",
      },
    };
  }

  /**
   * Handle tools/list request
   */
  async handleToolsList(): Promise<MCPToolsListResult> {
    this.logger.info("[MCP Protocol] Listing tools");

    // Get full endpoints with field information for proper schema generation
    const endpoints = definitionsRegistry.getEndpointsForUser(
      Platform.MCP,
      this.user,
    );

    // Convert to MCP tool format with proper JSON Schema and translated descriptions
    const tools = endpoints.map((endpoint) =>
      endpointToMCPTool(endpoint, this.locale),
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
      argumentsKeys: Object.keys(params.arguments || {}),
      argumentsData: JSON.stringify(params.arguments),
    });

    // Execute tool - params.arguments is already properly typed from MCPToolCallParams
    const result = await mcpRegistry.executeTool(
      {
        toolName: params.name,
        data: params.arguments || {},
        user: this.user,
        locale: this.locale,
        requestId: Date.now(),
        timestamp: Date.now(),
        logger: this.logger,
        platform: Platform.MCP,
      },
      this.logger,
    );

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
  async handlePing(): Promise<{ [key: string]: never }> {
    this.logger.debug("[MCP Protocol] Ping");
    return {};
  }

  /**
   * Create success response
   */
  private success(
    id: string | number | null,
    result:
      | MCPInitializeResult
      | MCPToolsListResult
      | MCPToolCallResult
      | { [key: string]: never },
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
    data?: Record<string, WidgetData>,
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
  const cliUserResult = await getCliUser(logger, locale);

  if (!cliUserResult.success) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- MCP server infrastructure requires throwing for invalid CLI user state
    throw new Error(`CLI user authentication failed: ${cliUserResult.message}`);
  }

  const cliUser = cliUserResult.data;

  if (!cliUser.isPublic && !cliUser.id) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- MCP server infrastructure requires throwing for invalid CLI user state
    throw new Error("CLI user ID is required");
  }

  return new MCPProtocolHandler(logger, locale, cliUser);
}
