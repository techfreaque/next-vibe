/**
 * Leads List Repository
 * Repository for listing leads with filtering and pagination
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { leadsRepository } from "../repository";
import type {
  LeadListGetRequestTypeOutput,
  LeadListGetResponseTypeOutput,
} from "./definition";

/**
 * Repository interface for leads list operations
 */
export interface LeadsListRepository {
  listLeads(
    data: LeadListGetRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>>;
}

/**
 * Repository implementation for leads list operations
 */
export class LeadsListRepositoryImpl implements LeadsListRepository {
  async listLeads(
    data: LeadListGetRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>> {
    logger.info("Listing leads with filters");
    logger.debug("Request data", data);

    // Convert multi-select arrays to single values for the existing repository
    const queryData = {
      ...data,
      status: data.statusFilters?.status?.[0],
      currentCampaignStage: data.statusFilters?.currentCampaignStage?.[0],
      country: data.locationFilters?.country?.[0],
      language: data.locationFilters?.language?.[0],
      source: data.statusFilters?.source?.[0],
    };

    const result = await leadsRepository.listLeads(
      queryData,
      user,
      locale,
      logger,
    );

    if (result.success && result.data) {
      // Type-safe access to success response data
      const responseData = result.data.response;
      logger.vibe(`🎯 Successfully listed ${responseData.leads.length} leads`);

      // The definition expects a response wrapper
      // We'll create a properly typed response
      return {
        success: true as const,
        data: {
          response: {
            leads: responseData.leads,
            total: responseData.total,
            page: responseData.page,
            limit: responseData.limit,
            totalPages: responseData.totalPages,
          },
        },
      } satisfies ResponseType<LeadListGetResponseTypeOutput>;
    } else {
      logger.error("Failed to list leads", { message: result.message });
      return fail({
        message: "app.api.leads.list.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Export repository instance
 */
export const leadsListRepository = new LeadsListRepositoryImpl();
