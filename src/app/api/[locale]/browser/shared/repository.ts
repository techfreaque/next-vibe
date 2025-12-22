/**
 * Browser Automation Shared Repository
 * Shared utilities for browser tool route handlers
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  BrowserRequestOutput,
  BrowserResponseOutput,
} from "../definition";
import type { BrowserTool } from "../enum";
import { browserRepository } from "../repository";

/**
 * Explicit type for MCP argument values - no any or unknown
 */
export type MCPArgValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | Record<string, string | number | boolean>
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
      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Generic MCP tool executor that calls the main browser repository
 */
export async function executeMCPTool<T>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  try {
    // Prepare request data for main browser repository
    const requestData: BrowserRequestOutput = {
      tool: params.toolName as (typeof BrowserTool)[keyof typeof BrowserTool],
      arguments: JSON.stringify(params.args),
    };

    // Call main browser repository
    const result = await browserRepository.executeTool(requestData, logger);

    if (!result.success) {
      return result as ResponseType<T>;
    }

    // Return the result directly - it already has the correct structure
    return result as ResponseType<T>;
  } catch (error) {
    logger.error(`MCP tool execution failed: ${params.toolName}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return fail({
      message: "app.api.browser.repository.mcp.tool.call.toolExecutionFailed",
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
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeClosePage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeDrag<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeFill<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeEmulate(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      applied: boolean;
      network?: string;
      cpuThrottling?: number;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeEvaluateScript(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      executed: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result?: string | number | boolean | Record<string, any> | Array<any>;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeFillForm(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      filled: boolean;
      filledCount: number;
      elements?: Array<{
        uid: string;
        filled: boolean;
      }>;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeGetConsoleMessage(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      found: boolean;
      message?: {
        type: string;
        text: string;
        timestamp?: string;
      };
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeGetNetworkRequest<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeHandleDialog(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeHover(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeListConsoleMessages(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeListNetworkRequests(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeListPages(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeNavigatePage(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executeNewPage(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executePerformanceAnalyzeInsight(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executePerformanceStartTrace(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executePerformanceStopTrace(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, logger);
}

export function executePressKey<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeResizePage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeSelectPage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, logger);
}

export function executeTakeScreenshot(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      captured: boolean;
      format: string;
      filePath?: string;
      data?: string;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeTakeSnapshot(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      captured: boolean;
      elementCount?: number;
      filePath?: string;
      data?: string;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeUploadFile(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      uploaded: boolean;
      fileName?: string;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}

export function executeWaitFor(
  params: MCPToolParams,
  logger: EndpointLogger,
): Promise<
  ResponseType<{
    success: boolean;
    result?: {
      found: boolean;
      waitTime?: number;
    };
    error?: string;
    executionId?: string;
  }>
> {
  return executeMCPTool(params, logger);
}
