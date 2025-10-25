/**
 * MCP (Model Context Protocol) Type Definitions
 * Based on MCP Specification v1.0
 */

import type { z } from "zod";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { Methods } from "../cli/vibe/endpoints/endpoint-types/core/enums";

/**
 * JSON-RPC 2.0 Base Types
 */
export type JsonRpcVersion = "2.0";

export interface JsonRpcRequest {
  jsonrpc: JsonRpcVersion;
  method: string;
  params?: unknown;
  id?: string | number;
}

export interface JsonRpcResponse {
  jsonrpc: JsonRpcVersion;
  result?: unknown;
  error?: JsonRpcError;
  id: string | number | null;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * MCP Error Codes (JSON-RPC compatible)
 */
export enum MCPErrorCode {
  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  TOOL_NOT_FOUND = -32001,
  TOOL_EXECUTION_FAILED = -32002,
  PERMISSION_DENIED = -32003,
  AUTHENTICATION_FAILED = -32004,
}

/**
 * MCP Protocol Methods
 */
export enum MCPMethod {
  // Lifecycle
  INITIALIZE = "initialize",
  PING = "ping",

  // Tools
  TOOLS_LIST = "tools/list",
  TOOLS_CALL = "tools/call",

  // Prompts (future)
  PROMPTS_LIST = "prompts/list",
  PROMPTS_GET = "prompts/get",

  // Resources (future)
  RESOURCES_LIST = "resources/list",
  RESOURCES_READ = "resources/read",
}

/**
 * MCP Initialize Request
 */
export interface MCPInitializeParams {
  protocolVersion: string;
  capabilities: {
    tools?: { listChanged?: boolean };
    prompts?: { listChanged?: boolean };
    resources?: { subscribe?: boolean };
  };
  clientInfo: {
    name: string;
    version: string;
  };
}

export interface MCPInitializeResult {
  protocolVersion: string;
  capabilities: {
    tools?: { listChanged?: boolean };
    prompts?: { listChanged?: boolean };
    resources?: { subscribe?: boolean };
  };
  serverInfo: {
    name: string;
    version: string;
  };
}

/**
 * MCP Tool Definition
 */
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
}

/**
 * MCP Tools List
 */
export interface MCPToolsListParams {
  cursor?: string;
}

export interface MCPToolsListResult {
  tools: MCPTool[];
  nextCursor?: string;
}

/**
 * MCP Tool Call
 */
export interface MCPToolCallParams {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface MCPToolCallResult {
  content: MCPContent[];
  isError?: boolean;
}

export type MCPContent =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string }
  | { type: "resource"; uri: string; mimeType?: string };

/**
 * MCP Server Configuration
 */
export interface MCPServerConfig {
  name: string;
  version: string;
  locale: CountryLanguage;
  debug: boolean;
  capabilities: {
    tools: boolean;
    prompts: boolean;
    resources: boolean;
  };
  rootDir: string;
  excludePaths: string[];
}

/**
 * MCP Execution Context
 */
export interface MCPExecutionContext {
  toolName: string;
  arguments: Record<string, unknown>;
  user: JwtPayloadType;
  locale: CountryLanguage;
  requestId: string | number;
}

/**
 * Internal Tool Metadata (from endpoint registry)
 */
export interface MCPToolMetadata {
  name: string;
  description: string;
  category?: string;
  tags: string[];
  endpointId: string;
  endpointPath: string;
  routePath: string;
  method: Methods;
  allowedRoles: readonly (typeof UserRoleValue)[];
  requiresAuth: boolean;
  requestSchema?: z.ZodTypeAny;
  responseSchema?: z.ZodTypeAny;
  aliases?: string[];
}

/**
 * MCP Registry Interface
 */
export interface IMCPRegistry {
  initialize(): Promise<void>;
  getTools(user: JwtPayloadType): Promise<MCPToolMetadata[]>;
  getToolByName(name: string): Promise<MCPToolMetadata | null>;
  executeTool(context: MCPExecutionContext): Promise<MCPToolCallResult>;
  isInitialized(): boolean;
  refresh(): Promise<void>;
}

/**
 * MCP Transport Interface
 */
export interface IMCPTransport {
  start(): Promise<void>;
  stop(): Promise<void>;
  send(message: JsonRpcResponse): Promise<void>;
  onMessage(handler: (message: JsonRpcRequest) => Promise<void>): void;
}

/**
 * MCP Protocol Handler Interface
 */
export interface IMCPProtocolHandler {
  handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse>;
  handleInitialize(params: MCPInitializeParams): Promise<MCPInitializeResult>;
  handleToolsList(params: MCPToolsListParams): Promise<MCPToolsListResult>;
  handleToolCall(params: MCPToolCallParams): Promise<MCPToolCallResult>;
  handlePing(): Promise<Record<string, never>>;
}
