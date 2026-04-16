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
  ): Promise<ResponseType<T> | ContentResponse> {
    try {
      // Prepare request data for main browser repository
      const requestData: {
        tool: string;
        arguments?: string;
      } = {
        tool: params.toolName as (typeof BrowserTool)[keyof typeof BrowserTool],
        arguments: JSON.stringify(params.args),
      };

      // Call main browser repository
      const result = await BrowserRepository.executeTool(
        requestData,
        t,
        logger,
      );

      // Content responses (e.g. inline screenshots) must be propagated directly —
      // wrapping them in success() would break serialization in the execute-tool pipeline.
      if (isContentResponse(result)) {
        return result;
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
  // Type-Safe Wrapper Methods
  // All wrappers return Promise<ResponseType<T> | ContentResponse> because
  // tools that return images (e.g. take_screenshot without filePath) produce
  // a ContentResponse that must be propagated directly to the platform handler.
  // ============================================================================

  static executeClick<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeClosePage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeDrag<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeFill<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeEmulate(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeEvaluateScript(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeFillForm(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeGetConsoleMessage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeGetNetworkRequest<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeHandleDialog(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeHover(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeListConsoleMessages(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeListNetworkRequests(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeListPages(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeNavigatePage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executeNewPage(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executePerformanceAnalyzeInsight(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executePerformanceStartTrace(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executePerformanceStopTrace(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<BrowserToolResponse>(
      params,
      t,
      logger,
    );
  }

  static executePressKey<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeResizePage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeSelectPage<T = BrowserToolResponse>(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<T> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool<T>(params, t, logger);
  }

  static executeTakeScreenshot(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeTakeSnapshot(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeUploadFile(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }

  static executeWaitFor(
    params: MCPToolParams,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrowserToolResponse> | ContentResponse> {
    return BrowserSharedRepository.executeMCPTool(params, t, logger);
  }
}
