/**
 * GetNetworkRequest Repository
 */

import "server-only";

import type { Platform } from "next-vibe/core/definition/platform";
import type {
  ContentResponse,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import {
  isContentResponse,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { BrowserTool } from "../enum";
import type { BrowserT } from "../i18n";
import type { MCPContentBlock } from "../shared/repository";
import { BrowserSharedRepository } from "../shared/repository";
import type {
  GetNetworkRequestRequestOutput,
  GetNetworkRequestResponseOutput,
} from "./definition";

export class GetNetworkRequestRepository {
  static async getNetworkRequest(
    data: GetNetworkRequestRequestOutput,
    t: BrowserT,
    logger: EndpointLogger,
    platform: Platform,
    threadId: string | undefined,
  ): Promise<ResponseType<GetNetworkRequestResponseOutput> | ContentResponse> {
    const result =
      await BrowserSharedRepository.executeGetNetworkRequest<GetNetworkRequestResponseOutput>(
        {
          toolName: BrowserTool.GET_NETWORK_REQUEST,
          args: BrowserSharedRepository.filterUndefinedArgs({
            reqid: data.reqid,
            requestFilePath: data.requestFilePath,
            responseFilePath: data.responseFilePath,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        threadId,
      );

    // Apply maxBodyLength truncation when specified and result has inline bodies
    if (
      data.maxBodyLength !== undefined &&
      !isContentResponse(result) &&
      result.success
    ) {
      return success({
        ...result.data,
        result: result.data.result
          ? GetNetworkRequestRepository.truncateBodyContent(
              result.data.result,
              data.maxBodyLength,
            )
          : result.data.result,
      });
    }

    return result;
  }

  /**
   * Truncate inline body text in network request content blocks.
   * Finds lines that look like body content (after "Body:" headers) and
   * cuts them at maxBodyLength characters with a truncation notice.
   */
  private static truncateBodyContent(
    blocks: MCPContentBlock[],
    maxBodyLength: number,
  ): MCPContentBlock[] {
    return blocks.map((block) => {
      if (block.type !== "text" || !block.text) {
        return block;
      }
      if (block.text.length <= maxBodyLength) {
        return block;
      }
      return {
        ...block,
        text: `${block.text.slice(0, maxBodyLength)}\n\n[Truncated at ${maxBodyLength} characters. Use requestFilePath/responseFilePath to save full body to a file.]`,
      };
    });
  }
}
