/**
 * Browser Automation Shared Repository
 * Shared utilities for browser tool route handlers
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { browserRepository } from "../repository";
import type {
  BrowserRequestOutput,
  BrowserResponseOutput,
} from "../definition";
import type { BrowserTool } from "../enum";

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
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<T>> {
  try {
    // Prepare request data for main browser repository
    const requestData: BrowserRequestOutput = {
      tool: params.toolName as (typeof BrowserTool)[keyof typeof BrowserTool],
      arguments: JSON.stringify(params.args),
    };

    // Call main browser repository - pass user as-is
    const result = await browserRepository.executeTool(
      requestData,
      user,
      logger,
      locale,
    );

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
      message: `Failed to execute ${params.toolName}`,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    }) as ResponseType<T>;
  }
}

// ============================================================================
// Type-Safe Wrapper Functions
// ============================================================================

export async function executeClick<T = BrowserResponseOutput>(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, user, logger, locale);
}

export async function executeClosePage<T = BrowserResponseOutput>(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, user, logger, locale);
}

export async function executeDrag<T = BrowserResponseOutput>(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, user, logger, locale);
}

export async function executeFill<T = BrowserResponseOutput>(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<T>> {
  return executeMCPTool<T>(params, user, logger, locale);
}

export async function executeEmulate(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeEvaluateScript(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeFillForm(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeGetConsoleMessage(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeGetNetworkRequest(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeHandleDialog(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeHover(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeListConsoleMessages(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeListNetworkRequests(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeListPages(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeNavigatePage(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeNewPage(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executePerformanceAnalyzeInsight(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executePerformanceStartTrace(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executePerformanceStopTrace(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executePressKey(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeResizePage(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeSelectPage(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<BrowserResponseOutput>> {
  return executeMCPTool<BrowserResponseOutput>(params, user, logger, locale);
}

export async function executeTakeScreenshot(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeTakeSnapshot(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeUploadFile(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}

export async function executeWaitFor(
  params: MCPToolParams,
  user: JwtPayloadType | null,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
  return executeMCPTool(params, user, logger, locale);
}
