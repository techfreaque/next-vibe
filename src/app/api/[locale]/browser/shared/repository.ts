/**
 * Browser Automation Shared Repository
 * Shared utilities for browser tool route handlers
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { BrowserTool } from "../enum";
import type { BrowserT } from "../i18n";
import { browserRepository } from "../repository";

/**
 * MCP content block returned by browser tools
 */
export interface MCPContentBlock {
  type: string;
  text?: string;
  data?: string;
  mimeType?: string;
}

/**
 * Standard response shape for individual browser tool endpoints
 */
export interface BrowserToolResponse {
  success: boolean;
  result?: MCPContentBlock[];
  error?: string;
  executionId?: string;
}

/**
 * Explicit type for MCP argument values - no any or unknown
 */
export type MCPArgValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | Record<string, string | number | boolean | undefined>
  | Array<Record<string, string | number | boolean>>;

/**
 * MCP Tool execution parameters
 */
export interface MCPToolParams {
  toolName: string;
  args: Record<string, MCPArgValue>;
}

/**
 * Filter undefined values from args object
 */
export function filterUndefinedArgs<
  T extends Record<string, MCPArgValue | undefined>,
>(args: T): Record<string, MCPArgValue> {
  const filtered: Record<string, MCPArgValue> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined) {
      filtered[key] = value as MCPArgValue;
    }
  }
  return filtered;
}

/**
 * Generic MCP tool executor that calls the main browser repository
 */
export async function executeMCPTool<T>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  try {
    // Prepare request data for main browser repository
    const requestData: BrowserRequestOutput = {
      tool: params.toolName as (typeof BrowserTool)[keyof typeof BrowserTool],
      arguments: JSON.stringify(params.args),
    };

    // Call main browser repository
    const result = await browserRepository.executeTool(requestData, t, logger);

    // Content responses (e.g. screenshots) are wrapped in success for MCP/AI consumers
    if (isContentResponse(result)) {
      return success(result as T & typeof result);
    }

    // Return the result directly - it already has the correct structure
    return result as ResponseType<T>;
  } catch (error) {
    logger.error(`MCP tool execution failed: ${params.toolName}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return fail({
      message: t("repository.mcp.tool.call.toolExecutionFailed"),
      messageParams: { toolName: params.toolName },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }) as ResponseType<T>;
  }
}

// ============================================================================
// Type-Safe Wrapper Functions
// ============================================================================

export function executeClick<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeClosePage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeDrag<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeFill<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeEmulate(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeEvaluateScript(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeFillForm(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeGetConsoleMessage(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeGetNetworkRequest<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeHandleDialog(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeHover(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeListConsoleMessages(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeListNetworkRequests(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeListPages(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeNavigatePage(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executeNewPage(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executePerformanceAnalyzeInsight(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executePerformanceStartTrace(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executePerformanceStopTrace(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, t, logger);
}

export function executePressKey<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeResizePage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeSelectPage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, t, logger);
}

export function executeTakeScreenshot(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeTakeSnapshot(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeUploadFile(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}

export function executeWaitFor(
  params: MCPToolParams,
  t: BrowserT,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserToolResponse>> {
  return executeMCPTool(params, t, logger);
}
