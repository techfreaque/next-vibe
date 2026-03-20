/**
 * Lead Search Repository
 * Handles search operations for leads
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

import {
  LeadSortField,
  LeadStatus,
  LeadStatusFilter,
  SortOrder,
} from "../enum";
import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import { LeadsRepository } from "../repository";
import type { LeadSearchGetResponseOutput } from "./definition";
import type { LeadsT } from "../i18n";
import type { LeadsSearchT } from "./i18n";

/**
 * Search request interface - matches definition with defaults
 */
interface SearchRequestType {
  search?: string;
  status?: string;
  limit: number;
  offset: number;
}

/**
 * Lead Search Repository Implementation
 */
export class LeadSearchRepository {
  /**
   * Search leads using the main leads repository
   */
  static async searchLeads(
    data: SearchRequestType,
    t: LeadsSearchT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadSearchGetResponseOutput>> {
    logger.debug("Searching leads", {
      searchTerm: data.search,
      status: data.status,
      limit: data.limit,
      offset: data.offset,
    });

    // Calculate pagination parameters
    const offset = data.offset ?? 0;
    const limit = data.limit ?? 10;

    const leadsT: LeadsT = leadsScopedTranslation.scopedT(locale).t;

    // Map LeadStatus value → LeadStatusFilter value (same keys, different i18n paths)
    const statusFilterValue:
      | (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter][]
      | undefined = data.status
      ? (() => {
          const key = Object.keys(LeadStatus).find(
            (k) => LeadStatus[k as keyof typeof LeadStatus] === data.status,
          ) as keyof typeof LeadStatusFilter | undefined;
          return key && LeadStatusFilter[key]
            ? [LeadStatusFilter[key]]
            : undefined;
        })()
      : undefined;

    // Use the existing listLeads method with search filter
    const searchResult = await LeadsRepository.listLeads(
      {
        statusFilters: {
          search: data.search ?? undefined,
          status: statusFilterValue,
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
        paginationInfo: {
          page: Math.floor(offset / limit) + 1,
          limit: limit,
        },
      },
      logger,
      leadsT,
    );

    if (!searchResult.success || !searchResult.data) {
      logger.error("Failed to search leads");
      return fail({
        message: t("get.errors.server.title"),
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
      convertedAt: lead.convertedAt ?? null,
      signedUpAt: lead.signedUpAt ?? null,
      subscriptionConfirmedAt: lead.subscriptionConfirmedAt ?? null,
      currentCampaignStage: lead.currentCampaignStage,
      emailsSent: lead.emailsSent,
      lastEmailSentAt: lead.lastEmailSentAt ?? null,
      unsubscribedAt: lead.unsubscribedAt ?? null,
      emailsOpened: lead.emailsOpened,
      emailsClicked: lead.emailsClicked,
      lastEngagementAt: lead.lastEngagementAt ?? null,
      metadata: lead.metadata || undefined,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));

    return success({
      response: {
        leads: transformedLeads,
        total: searchResult.data.paginationInfo.totalCount,
        hasMore,
      },
    });
  }
}
