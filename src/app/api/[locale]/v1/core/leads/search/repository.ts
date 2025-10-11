/**
 * Lead Search Repository
 * Handles search operations for leads
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { createSuccessResponse } from "next-vibe/shared/types/response.schema";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../user/auth/definition";
import { leadsRepository } from "../repository";

/**
 * Search request interface - temporarily using simple types
 */
interface SearchRequestType {
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Search response interface
 */
interface SearchResponseType {
  leads: any[];
  total: number;
  hasMore: boolean;
}

/**
 * Lead Search Repository Interface
 */
export interface LeadSearchRepository {
  searchLeads(
    data: SearchRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SearchResponseType>>;
}

/**
 * Lead Search Repository Implementation
 */
class LeadSearchRepositoryImpl implements LeadSearchRepository {
  /**
   * Search leads using the main leads repository
   */
  async searchLeads(
    data: SearchRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SearchResponseType>> {
    logger.debug("Searching leads", {
      userId: user.id,
      searchTerm: data.search,
      limit: data.limit,
      offset: data.offset,
    });

    // Calculate pagination parameters
    const offset = data.offset ?? 0;
    const limit = data.limit ?? 10;

    // Use the existing listLeads method with search filter
    const searchResult = await leadsRepository.listLeads(
      {
        search: data.search ?? undefined,
        page: Math.floor(offset / limit) + 1,
        limit: limit,
        status: undefined, // Search all statuses
        currentCampaignStage: undefined,
        country: undefined,
        language: undefined,
        source: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      },
      user,
      locale,
      logger,
    );

    if (!searchResult.success) {
      return searchResult;
    }

    // Calculate if there are more results
    const hasMore = searchResult.data.leads.length === limit;

    return createSuccessResponse({
      leads: searchResult.data.leads,
      total: searchResult.data.total,
      hasMore,
    });
  }
}

/**
 * Default repository instance
 */
export const leadSearchRepository = new LeadSearchRepositoryImpl();