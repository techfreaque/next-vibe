/**
 * WaitFor Repository
 */

import "server-only";

import {
  isContentResponse,
  success,
} from "next-vibe/shared/types/response.schema";
import type {
  ContentResponse,
  ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { BrowserT } from "../i18n";
import type { MCPContentBlock } from "../shared/repository";
import { BrowserSharedRepository } from "../shared/repository";
import { BrowserTool } from "../enum";
import type { WaitForRequestOutput, WaitForResponseOutput } from "./definition";

export class WaitForRepository {
  static async waitFor(
    data: WaitForRequestOutput,
    sessionId: string,
    t: BrowserT,
    logger: EndpointLogger,
  ): Promise<ResponseType<WaitForResponseOutput> | ContentResponse> {
    const result = await BrowserSharedRepository.executeWaitFor(
      {
        sessionId,
        toolName: BrowserTool.WAIT_FOR,
        args: BrowserSharedRepository.filterUndefinedArgs({
          text: data.text,
          timeout: data.timeout,
        }),
      },
      t,
      logger,
    );

    // When captureSnapshot is false (default), strip the a11y tree from the response
    if (!data.captureSnapshot && !isContentResponse(result) && result.success) {
      return success({
        ...result.data,
        result: result.data.result
          ? WaitForRepository.stripSnapshot(result.data.result)
          : result.data.result,
      });
    }

    return result;
  }

  /**
   * Strip accessibility snapshot from wait_for text content.
   * The MCP server appends a full a11y tree after a blank line following the confirmation.
   * When captureSnapshot is false (default), keep only the first paragraph.
   */
  private static stripSnapshot(blocks: MCPContentBlock[]): MCPContentBlock[] {
    return blocks.map((block) => {
      if (block.type !== "text" || !block.text) {
        return block;
      }
      const firstBlankLine = block.text.indexOf("\n\n");
      if (firstBlankLine === -1) {
        return block;
      }
      return { ...block, text: block.text.slice(0, firstBlankLine) };
    });
  }
}
