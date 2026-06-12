/**
 * Browser Automation Shared Repository
 * Shared utilities for browser tool route handlers
 */

import type {
  ContentResponse,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isContentResponse,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

import type { BrowserTool } from "../enum";
import type { BrowserT } from "../i18n";
import { BrowserRepository } from "../repository";

export interface MCPContentBlock {
  type: string;
  text?: string;
  data?: string;
  mimeType?: string;
}

interface BrowserToolResponse {
  success: boolean;
  result?: MCPContentBlock[];
  error?: string;
  executionId?: string;
}

/**
 * Explicit type for MCP argument values - no any or unknown
 */
type MCPArgValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | Record<string, string | number | boolean | undefined>
  | Array<Record<string, string | number | boolean>>;

interface MCPToolParams {
  toolName: string;
  args: Record<string, MCPArgValue>;
  instanceId?: string;
}

export class BrowserSharedRepository {
  /**
   * Filter undefined values from args object
   */
  static filterUndefinedArgs<T extends Record<string, MCPArgValue | undefined>>(
    args: T,
  ): Record<string, MCPArgValue> {
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
  static async executeMCPTool<T>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    try {
      const requestData: {
        tool: string;
        arguments?: string;
        instanceId?: string;
      } = {
        tool: params.toolName as (typeof BrowserTool)[keyof typeof BrowserTool],
        arguments: JSON.stringify(params.args),
        instanceId: params.instanceId,
      };

      const result = await BrowserRepository.executeTool(
        requestData,
        t,
        logger,
        platform,
        threadId,
      );

      if (isContentResponse(result)) {
        return result;
      }

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
  // Type-Safe Wrapper Methods
  // All wrappers return Promise<ResponseType<T> | ContentResponse> because
  // tools that return images (e.g. take_screenshot without filePath) produce
  // a ContentResponse that must be propagated directly to the platform handler.
  // ============================================================================

  static executeClick<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeClosePage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeDrag<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeFill<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeEmulate(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeEvaluateScript(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeFillForm(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeGetConsoleMessage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeGetNetworkRequest<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeHandleDialog(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeHover(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeListConsoleMessages(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeListNetworkRequests(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeListPages(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeNavigatePage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeNewPage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executePerformanceAnalyzeInsight(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executePerformanceStartTrace(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executePerformanceStopTrace(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executePressKey<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeResizePage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeSelectPage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeTakeScreenshot(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeTakeSnapshot(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeUploadFile(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }

  static executeWaitFor(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(
      params,
      t,
      logger,
      platform,
      threadId,
    );
  }
}
