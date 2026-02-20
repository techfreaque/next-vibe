/**
 * Batch Operations Repository
 * Handles batch operations for lead management
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { LeadsRepository } from "../repository";
import type {
  BatchDeleteRequestOutput,
  BatchDeleteResponseOutput,
  BatchUpdateRequestOutput,
  BatchUpdateResponseOutput,
} from "./definition";

/**
 * Batch Operations Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class BatchRepository {
  /**
   * Batch update leads - delegates to main leads repository
   * Wraps response in expected format
   */
  static async batchUpdateLeads(
    data: BatchUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<BatchUpdateResponseOutput>> {
    logger.debug("Batch update leads operation", {
      dataKeys: Object.keys(data),
    });

    const result = await LeadsRepository.batchUpdateLeads(data, logger, locale);

    if (result.success && result.data) {
      return success({
        response: result.data,
      });
    }

    return fail({
      message: "app.api.leads.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  /**
   * Batch delete leads - delegates to main leads repository
   * Wraps response in expected format
   */
  static async batchDeleteLeads(
    data: BatchDeleteRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchDeleteResponseOutput>> {
    logger.debug("Batch delete leads operation", {
      dataKeys: Object.keys(data),
    });

    const result = await LeadsRepository.batchDeleteLeads(data, logger);

    if (result.success && result.data) {
      return success({
        response: result.data,
      });
    }

    return fail({
      message: "app.api.leads.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
