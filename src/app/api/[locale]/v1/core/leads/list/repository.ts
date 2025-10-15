/**
 * Leads List Repository
 * Repository for listing leads with filtering and pagination
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";

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

    // Convert multi-select arrays to single values for the existing repository
    const queryData = {
      ...data,
      status: data.statusFilters?.status?.[0],
      currentCampaignStage: data.statusFilters?.currentCampaignStage?.[0],
      country: data.locationFilters?.country?.[0],
      language: data.locationFilters?.language?.[0],
      source: data.sourceFilters?.source?.[0],
    };

    // Create mock user and locale for the main repository
    const mockUser: JwtPayloadType = {
      id: "system",
      isPublic: false,
    };
    const mockLocale = "en-GLOBAL" as const;

    const result = await leadsRepository.listLeads(
      queryData,
      mockUser,
      mockLocale,
      logger,
    );

    if (result.success) {
      logger.vibe(`🎯 Successfully listed ${result.data.leads.length} leads`);
      // The definition expects a response wrapper
      // We'll create a properly typed response
      return {
        success: true as const,
        data: {
          response: {
            leads: result.data.leads,
            total: result.data.total,
            page: result.data.page,
            limit: result.data.limit,
            totalPages: result.data.totalPages,
          },
        },
      } satisfies ResponseType<LeadListGetResponseTypeOutput>;
    } else {
      logger.error("Failed to list leads", result);
      return createErrorResponse(
        "app.api.v1.core.leads.list.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      ) as ResponseType<LeadListGetResponseTypeOutput>;
    }
  }
}

/**
 * Export repository instance
 */
export const leadsListRepository = new LeadsListRepositoryImpl();
