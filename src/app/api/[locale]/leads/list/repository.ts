/**
 * Leads List Repository
 * Repository for listing leads with filtering and pagination
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import { LeadsRepository } from "../repository";
import type {
  LeadListGetRequestTypeOutput,
  LeadListGetResponseTypeOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];
type LeadsModuleT = ReturnType<typeof leadsScopedTranslation.scopedT>["t"];

/**
 * Repository implementation for leads list operations
 */
export class LeadsListRepositoryImpl {
  async listLeads(
    data: LeadListGetRequestTypeOutput,
    t: ModuleT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>> {
    logger.info("Listing leads with filters");
    logger.debug("Request data", data);

    // Pass data directly - it matches the structure expected by LeadsRepository
    const leadsT: LeadsModuleT = leadsScopedTranslation.scopedT(locale).t;
    const result = await LeadsRepository.listLeads(data, logger, leadsT);

    if (result.success && result.data) {
      // Type-safe access to success response data
      const responseData = result.data.response;
      const paginationData = result.data.paginationInfo;
      logger.vibe(`🎯 Successfully listed ${responseData.leads.length} leads`);

      // The definition expects response and paginationInfo separately
      return {
        success: true as const,
        data: {
          response: {
            leads: responseData.leads,
          },
          paginationInfo: {
            totalCount: paginationData.totalCount,
            pageCount: paginationData.pageCount,
          },
        },
      } satisfies ResponseType<LeadListGetResponseTypeOutput>;
    }
    logger.error("Failed to list leads", { message: result.message });
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Export repository instance
 */
export const leadsListRepository = new LeadsListRepositoryImpl();
