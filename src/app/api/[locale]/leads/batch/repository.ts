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

import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import { LeadsRepository } from "../repository";
import type {
  BatchDeleteRequestOutput,
  BatchDeleteResponseOutput,
  BatchUpdateRequestOutput,
  BatchUpdateResponseOutput,
} from "./definition";
import type { LeadsT } from "../i18n";
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
