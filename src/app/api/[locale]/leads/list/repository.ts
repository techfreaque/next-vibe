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

import { LeadsRepository } from "../repository";
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
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>>;
}

/**
 * Repository implementation for leads list operations
 */
export class LeadsListRepositoryImpl implements LeadsListRepository {
  async listLeads(
    data: LeadListGetRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadListGetResponseTypeOutput>> {
    logger.info("Listing leads with filters");
    logger.debug("Request data", data);

    // Pass data directly - it matches the structure expected by LeadsRepository
    const result = await LeadsRepository.listLeads(data, logger);

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
            page: paginationData.page,
            limit: paginationData.limit,
            total: paginationData.total,
            totalPages: paginationData.totalPages,
          },
        },
      } satisfies ResponseType<LeadListGetResponseTypeOutput>;
    }
    logger.error("Failed to list leads", { message: result.message });
    return fail({
      message: "app.api.leads.list.get.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Export repository instance
 */
export const leadsListRepository = new LeadsListRepositoryImpl();
