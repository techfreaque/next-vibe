/**
 * Batch Operations Repository
 * Handles batch operations for lead management
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { LeadsT } from "next-vibe/identity/lead/i18n";
import { scopedTranslation as leadsScopedTranslation } from "next-vibe/identity/lead/i18n";
import { LeadsRepository } from "next-vibe/identity/lead/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  BatchDeleteRequestOutput,
  BatchDeleteResponseOutput,
  BatchUpdateRequestOutput,
  BatchUpdateResponseOutput,
} from "./definition";
import type { LeadsBatchT } from "./i18n";

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
    t: LeadsBatchT,
    locale: CountryLanguage,
  ): Promise<ResponseType<BatchUpdateResponseOutput>> {
    logger.debug("Batch update leads operation", {
      dataKeys: Object.keys(data),
    });

    const leadsT: LeadsT = leadsScopedTranslation.scopedT(locale).t;
    const result = await LeadsRepository.batchUpdateLeads(data, logger, leadsT);

    if (result.success && result.data) {
      return success({
        response: result.data,
      });
    }

    return fail({
      message: t("patch.errors.server.title"),
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
    locale: CountryLanguage,
    t: LeadsBatchT,
  ): Promise<ResponseType<BatchDeleteResponseOutput>> {
    logger.debug("Batch delete leads operation", {
      dataKeys: Object.keys(data),
    });

    const leadsT: LeadsT = leadsScopedTranslation.scopedT(locale).t;
    const result = await LeadsRepository.batchDeleteLeads(data, logger, leadsT);

    if (result.success && result.data) {
      return success({
        response: result.data,
      });
    }

    return fail({
      message: t("delete.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
