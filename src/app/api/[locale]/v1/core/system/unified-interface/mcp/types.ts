/**
 * MCP (Model Context Protocol) Type Definitions
 * Based on MCP Specification v1.0
 */

import type { z } from "zod";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { BaseExecutionContext } from "../shared/endpoints/route/executor";
import type { JsonValue } from "../shared/utils/error-types";

export type ParameterValue = JsonValue;

/**
 * JSON-RPC 2.0 Base Types
 */
export type JsonRpcVersion = "2.0";

/**
 * JSON-RPC Request (generic version)
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: MCP tool parameters require 'unknown' for flexible schema definitions
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: MCP tool parameters require 'unknown' for flexible schema definitions
export interface JsonRpcRequest<TParams = unknown> {
  jsonrpc: JsonRpcVersion;
  method: string;
  params?: TParams;
  id?: string | number;
}

/**
 * JSON-RPC Response (generic version)
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Tool result type requires 'unknown' for flexible return values
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Tool result type requires 'unknown' for flexible return values
export interface JsonRpcResponse<TResult = unknown> {
  jsonrpc: JsonRpcVersion;
  result?: TResult;
  error?: JsonRpcError;
  id: string | number | null;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: Record<string, ParameterValue>;
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
/**
 * MCP Schema property value type
 */
interface MCPSchemaPropertyValue {
  [key: string]: string | number | boolean | null | MCPSchemaPropertyValue;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<
      string,
      Record<string, string | number | boolean | null | MCPSchemaPropertyValue>
    >;
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
  arguments?: Record<string, ParameterValue>;
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
 * Extends BaseExecutionContext with MCP-specific fields
 */
export interface MCPExecutionContext<
  TData = { [key: string]: ParameterValue },
> extends Omit<BaseExecutionContext<TData>, "user" | "requestId"> {
  /** More specific user type for MCP */
  user: JwtPayloadType;

  /** Request ID for tracking (required for MCP) */
  requestId: string | number;
}

/**
 * MCP Tool Metadata extends shared SerializableToolMetadata
 * Uses same field names for consistency
 */
export interface MCPToolMetadata {
  id: string; // Unique identifier
  toolName: string; // Tool name for serialization
  name: string;
  description: TranslationKey;
  category?: TranslationKey;
  tags: readonly (TranslationKey | undefined)[];
  path: string; // API path
  routePath: string;
  definitionPath: string;
  method: Methods;
  allowedRoles: readonly UserRoleValue[];
  requiresAuth: boolean;
  requestSchema?: z.ZodTypeAny;
  responseSchema?: z.ZodTypeAny;
  aliases?: readonly string[];
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
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Protocol extension requires 'unknown' for flexible message payloads
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Protocol extension requires 'unknown' for flexible message payloads
  handleRequest(request: JsonRpcRequest<unknown>): Promise<JsonRpcResponse>;
  handleInitialize(params: MCPInitializeParams): Promise<MCPInitializeResult>;
  handleToolsList(params: MCPToolsListParams): Promise<MCPToolsListResult>;
  handleToolCall(params: MCPToolCallParams): Promise<MCPToolCallResult>;
  handlePing(): Promise<Record<string, never>>;
}
