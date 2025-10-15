/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions, {
  type BatchDeleteResponseOutput,
  type BatchUpdateResponseOutput,
} from "./definition";
import {
  renderBatchDeleteNotificationMail,
  renderBatchUpdateNotificationMail,
} from "./email";
import { batchRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: [
      {
        render: renderBatchUpdateNotificationMail,
        ignoreErrors: true, // Don't fail batch operation if notification email fails
      },
    ],
    handler: async ({
      data,
      user,
      locale,
      logger,
    }): Promise<ResponseType<BatchUpdateResponseOutput>> => {
      const result = await batchRepository.batchUpdateLeads(
        data,
        user,
        locale,
        logger,
      );
      // Wrap the response data in the expected structure
      if (result.success && result.data) {
        return {
          ...result,
          data: {
            response: result.data,
          },
        } as ResponseType<BatchUpdateResponseOutput>;
      }
      return result as ResponseType<BatchUpdateResponseOutput>;
    },
  },
  [Methods.DELETE]: {
    email: [
      {
        render: renderBatchDeleteNotificationMail,
        ignoreErrors: true, // Don't fail batch operation if notification email fails
      },
    ],
    handler: async ({
      data,
      user,
      locale,
      logger,
    }): Promise<ResponseType<BatchDeleteResponseOutput>> => {
      const result = await batchRepository.batchDeleteLeads(
        data,
        user,
        locale,
        logger,
      );
      // Wrap the response data in the expected structure
      if (result.success && result.data) {
        return {
          ...result,
          data: {
            response: result.data,
          },
        } as ResponseType<BatchDeleteResponseOutput>;
      }
      return result as ResponseType<BatchDeleteResponseOutput>;
    },
  },
});
