/**
 * Leads List Repository
 * Repository for listing leads with filtering and pagination
 */

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
  LeadListGetRequestTypeOutput,
  LeadListGetResponseTypeOutput,
} from "./definition";
import type { LeadsT } from "../i18n";
import type { LeadsListT } from "./i18n";

/**
 * Repository implementation for leads list operations
 */
export class LeadsListRepository {
  static async listLeads(
    data: LeadListGetRequestTypeOutput,
    t: LeadsListT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>> {
    logger.info("Listing leads with filters");
    logger.debug("Request data", data);

    // Pass data directly - it matches the structure expected by LeadsRepository
    const leadsT: LeadsT = leadsScopedTranslation.scopedT(locale).t;
    const result = await LeadsRepository.listLeads(data, logger, leadsT);

    if (result.success && result.data) {
      // Type-safe access to success response data
      const responseData = result.data.response;
      const paginationData = result.data.paginationInfo;
      logger.vibe(`🎯 Successfully listed ${responseData.leads.length} leads`);

      // The definition expects response and paginationInfo separately
      return success({
        response: {
          leads: responseData.leads,
        },
        paginationInfo: {
          totalCount: paginationData.totalCount,
          pageCount: paginationData.pageCount,
        },
        countsByStatus: result.data.countsByStatus,
      });
    }
    logger.error("Failed to list leads", { message: result.message });
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
