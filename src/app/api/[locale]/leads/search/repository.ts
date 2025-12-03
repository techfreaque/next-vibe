/**
 * Lead Search Repository
 * Handles search operations for leads
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../user/auth/types";
import { LeadSortField, SortOrder } from "../enum";
import { leadsRepository } from "../repository";
import type { LeadSearchGetResponseOutput } from "./definition";

/**
 * Search request interface - matches definition with defaults
 */
interface SearchRequestType {
  search?: string;
  limit: number;
  offset: number;
}

/**
 * Search response interface - derived from definition
 */
type SearchResponseType = LeadSearchGetResponseOutput;

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
        searchPagination: {
          search: data.search ?? undefined,
          page: Math.floor(offset / limit) + 1,
          limit: limit,
        },
        statusFilters: {
          status: undefined, // Search all statuses
          currentCampaignStage: undefined,
          source: undefined,
        },
        locationFilters: {
          country: undefined,
          language: undefined,
        },
        sortingOptions: {
          sortBy: LeadSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
      user,
      locale,
      logger,
    );

    if (!searchResult.success || !searchResult.data) {
      logger.error("Failed to search leads");
      return fail({
        message: "app.api.leads.list.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Type-safe access to success response data
    const responseData = searchResult.data.response;

    // Calculate if there are more results
    const hasMore = responseData.leads.length === limit;

    // Transform leads to match search definition schema
    const transformedLeads = responseData.leads.map((lead) => ({
      id: lead.id,
      email: lead.email || "",
      businessName: lead.businessName,
      phone: lead.phone || undefined,
      website: lead.website || undefined,
      country: lead.country,
      language: lead.language,
      status: lead.status,
      source: lead.source || undefined,
      notes: lead.notes || undefined,
      convertedUserId: lead.convertedUserId,
      convertedAt: lead.convertedAt?.toISOString() ?? null,
      signedUpAt: lead.signedUpAt?.toISOString() ?? null,
      consultationBookedAt: lead.consultationBookedAt?.toISOString() ?? null,
      subscriptionConfirmedAt:
        lead.subscriptionConfirmedAt?.toISOString() ?? null,
      currentCampaignStage: lead.currentCampaignStage,
      emailsSent: lead.emailsSent,
      lastEmailSentAt: lead.lastEmailSentAt?.toISOString() ?? null,
      unsubscribedAt: lead.unsubscribedAt?.toISOString() ?? null,
      emailsOpened: lead.emailsOpened,
      emailsClicked: lead.emailsClicked,
      lastEngagementAt: lead.lastEngagementAt?.toISOString() ?? null,
      metadata: lead.metadata || undefined,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    }));

    return success({
      response: {
        leads: transformedLeads,
        total: responseData.total,
        hasMore,
      },
    });
  }
}

/**
 * Default repository instance
 */
export const leadSearchRepository = new LeadSearchRepositoryImpl();
