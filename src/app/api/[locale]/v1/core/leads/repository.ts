/**
 * Leads Repository
 * Core functionality for lead management operations
 */

import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import { withTransaction } from "@/app/api/[locale]/v1/core/system/db/utils/repository-helpers";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import {
  convertCountryFilter,
  convertLanguageFilter,
  type Countries,
  type CountryFilter,
  type CountryLanguage,
  type LanguageFilter,
  type Languages,
} from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { newsletterSubscriptions } from "../newsletter/db";
import { NewsletterSubscriptionStatus } from "../newsletter/enum";
import type { JwtPayloadType } from "../user/auth/types";
import {
  emailCampaigns,
  type Lead,
  leadEngagements,
  leads,
  userLeadLinks,
} from "./db";
import type {
  BatchOperationScopeValues,
  EmailCampaignStageFilterValues,
  EmailCampaignStageValues,
  EngagementTypesValues,
  LeadSortFieldValues,
  LeadSourceFilterValues,
  LeadSourceValues,
  LeadStatusFilterValues,
  LeadStatusValues,
  SortOrderValues,
} from "./enum";
import {
  BatchOperationScope,
  EmailCampaignStage,
  EngagementTypes,
  ExportFormat,
  getWebsiteUserStatus,
  isStatusTransitionAllowed,
  LeadSortField,
  LeadStatus,
  mapCampaignStageFilter,
  mapSourceFilter,
  mapStatusFilter,
  MimeType,
  SortOrder,
} from "./enum";
import type { ExportQueryType, ExportResponseType } from "./export/definition";
import type { LeadEngagementResponseOutput } from "./tracking/engagement/definition";
import type {
  LeadDetailResponse,
  LeadListResponseType,
  LeadResponseType,
  LeadUpdateType,
  LeadWithEmailType,
  UnsubscribeType,
} from "./types";
import type { LeadCreateRequestTypeOutput } from "./create/definition";
import type { LeadListGetRequestTypeOutput } from "./list/definition";

// Type aliases for enum values
type LeadSortFieldType = typeof LeadSortFieldValues;
type SortOrderType = typeof SortOrderValues;
type BatchOperationScopeType = typeof BatchOperationScopeValues;
type LeadStatusType = typeof LeadStatusValues;
type EmailCampaignStageType = typeof EmailCampaignStageValues;
type LeadSourceType = typeof LeadSourceValues;
type EngagementTypesType = typeof EngagementTypesValues;

// Type aliases for filter values (CountryFilter and LanguageFilter are imported from i18n/core/config)
type LeadStatusFilterType = typeof LeadStatusFilterValues;
type EmailCampaignStageFilterType = typeof EmailCampaignStageFilterValues;
type LeadSourceFilterType = typeof LeadSourceFilterValues;

const INVALID_STATUS_TRANSITION_ERROR = "Invalid status transition";

/**
 * Leads Repository Interface
 */
export interface LeadsRepository {
  createLead(
    data: LeadCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      lead: {
        summary: {
          id: string;
          businessName: string;
          email: string | null;
          status: LeadStatusType;
        };
        contactDetails: {
          phone: string | null;
          website: string | null;
          country: string;
          language: string;
        };
        trackingInfo: {
          source: LeadSourceType | null;
          emailsSent: number;
          currentCampaignStage: string | null;
        };
        metadata: {
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>
  >;

  getLeadById(
    id: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>>;

  getLeadByTrackingId(
    leadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>>;

  getLeadByEmail(
    email: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>>;

  updateLead(
    id: string,
    data: Partial<LeadUpdateType>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>>;

  listLeads(
    query: Partial<LeadListGetRequestTypeOutput>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadListResponseType>>;

  convertLead(
    leadId: string,
    options: {
      userId: DbId;
      email: string;
      additionalData?: {
        businessName?: string;
        contactName?: string;
        phone?: string;
        website?: string;
      };
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>>;

  unsubscribeLead(
    data: UnsubscribeType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ success: boolean; message?: string; unsubscribedAt?: Date }>
  >;

  recordEngagement(
    data: {
      leadId: string;
      engagementType: EngagementTypesType;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>>;

  // Internal methods (no auth required) for use by other services
  getLeadByIdInternal(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>>;

  updateLeadInternal(
    id: string,
    data: Partial<LeadUpdateType>,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>>;

  convertLeadInternal(
    leadId: string,
    options: {
      userId: DbId;
      email: string;
      additionalData?: {
        businessName?: string;
        contactName?: string;
        phone?: string;
        website?: string;
      };
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>>;

  recordEngagementInternal(
    data: {
      leadId: string;
      engagementType: EngagementTypesType;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>>;

  exportLeads(
    query: ExportQueryType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<ExportResponseType>>;

  batchUpdateLeads(
    data: {
      search?: string;
      status?: LeadStatusFilterType | LeadStatusFilterType[];
      currentCampaignStage?:
        | EmailCampaignStageFilterType
        | EmailCampaignStageFilterType[];
      country?: CountryFilter | CountryFilter[];
      language?: LanguageFilter | LanguageFilter[];
      source?: LeadSourceFilterType | LeadSourceFilterType[];
      sortBy?: LeadSortFieldType[];
      sortOrder?: SortOrderType[];
      scope?: BatchOperationScopeType;
      page?: number;
      pageSize?: number;
      updates: {
        status?: LeadStatusType;
        currentCampaignStage?: EmailCampaignStageType;
        source?: LeadSourceType;
        notes?: string;
      };
      dryRun?: boolean;
      maxRecords?: number;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      totalMatched: number;
      totalProcessed: number;
      totalUpdated: number;
      errors: Array<{ leadId: string; error: string }>;
      preview: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatusType;
        currentCampaignStage: EmailCampaignStageType | null;
      }> | null;
    }>
  >;

  batchDeleteLeads(
    data: {
      search?: string;
      status?: LeadStatusFilterType | LeadStatusFilterType[];
      currentCampaignStage?:
        | EmailCampaignStageFilterType
        | EmailCampaignStageFilterType[];
      country?: CountryFilter | CountryFilter[];
      language?: LanguageFilter | LanguageFilter[];
      source?: LeadSourceFilterType | LeadSourceFilterType[];
      sortBy?: LeadSortFieldType[];
      sortOrder?: SortOrderType[];
      scope?: BatchOperationScopeType;
      page?: number;
      pageSize?: number;
      confirmDelete: boolean;
      dryRun?: boolean;
      maxRecords?: number;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      totalMatched: number;
      totalProcessed: number;
      totalDeleted: number;
      errors: Array<{ leadId: string; error: string }>;
      preview: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatusType;
        currentCampaignStage: EmailCampaignStageType | null;
      }> | null;
    }>
  >;
}

/**
 * Utility function to ensure a lead has an email
 * Returns the lead if it has an email, otherwise returns null
 * @deprecated Use leadHasEmail type guard instead and handle null case
 */
export function ensureLeadHasEmail(
  lead: LeadResponseType,
): LeadWithEmailType | null {
  if (!leadHasEmail(lead)) {
    return null;
  }
  return lead;
}

/**
 * Type guard to check if a lead has an email
 */
export function leadHasEmail(
  lead: LeadResponseType,
): lead is LeadWithEmailType {
  return Boolean(lead.email);
}

/**
 * Filter leads to only include those with email addresses
 * Returns an array of LeadWithEmailType
 */
export function filterLeadsWithEmail(
  leads: LeadResponseType[],
): LeadWithEmailType[] {
  return leads.filter(leadHasEmail);
}

/**
 * Leads Repository Implementation
 */
class LeadsRepositoryImpl implements LeadsRepository {
  /**
   * Create a new lead with business logic
   */
  async createLead(
    data: LeadCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      lead: {
        summary: {
          id: string;
          businessName: string;
          email: string | null;
          status: LeadStatusType;
        };
        contactDetails: {
          phone: string | null;
          website: string | null;
          country: string;
          language: string;
        };
        trackingInfo: {
          source: LeadSourceType | null;
          emailsSent: number;
          currentCampaignStage: string | null;
        };
        metadata: {
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>
  > {
    try {
      logger.debug("Creating new lead", {
        email: data.contactInfo?.email,
        businessName: data.contactInfo?.businessName,
        userId: user?.id,
      });

      if (data.contactInfo?.email) {
        // Check if lead already exists
        const existingLead = await db
          .select()
          .from(leads)
          .where(eq(leads.email, data.contactInfo.email.toLowerCase().trim()))
          .limit(1);

        if (existingLead.length > 0) {
          return fail({
            message:
              "app.api.v1.core.leads.leadsErrors.leads.post.error.duplicate.title",
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
      }

      // Filter out null values from metadata (if exists in leadDetails)
      const metadata: Record<string, string | number | boolean | null> = {};
      // Note: metadata is not in the current definition, keeping empty for now

      // Create lead directly in insert statement to avoid type inference issues
      const country = data.locationPreferences?.country ?? "GLOBAL";
      const language = data.locationPreferences?.language ?? "en";
      const email = data.contactInfo?.email ?? null;
      const businessName = data.contactInfo?.businessName ?? "";
      const phone = data.contactInfo?.phone ?? null;
      const website = data.contactInfo?.website ?? null;
      const source = data.leadDetails?.source ?? null;
      const notes = data.leadDetails?.notes ?? null;

      const [createdLead] = await db
        .insert(leads)
        .values({
          email,
          businessName,
          phone,
          website,
          country: country as typeof leads.$inferInsert.country,
          language: language as typeof leads.$inferInsert.language,
          source,
          notes,
          status: LeadStatus.PENDING, // Default status for general lead creation
          currentCampaignStage: EmailCampaignStage.INITIAL,
          metadata,
        })
        .returning();

      logger.debug("Lead created successfully", {
        leadId: createdLead.id,
        trackingId: createdLead.id,
        status: createdLead.status,
        note: "Lead marked as NOT_STARTED - campaign starter cron will process it",
      });

      return success({
        lead: {
          summary: {
            id: createdLead.id,
            businessName: createdLead.businessName,
            email: createdLead.email,
            status: createdLead.status,
          },
          contactDetails: {
            phone: createdLead.phone,
            website: createdLead.website,
            country: createdLead.country,
            language: createdLead.language,
          },
          trackingInfo: {
            source: createdLead.source,
            emailsSent: createdLead.emailsSent,
            currentCampaignStage: createdLead.currentCampaignStage,
          },
          metadata: {
            notes: createdLead.notes,
            createdAt: createdLead.createdAt.toISOString(),
            updatedAt: createdLead.updatedAt.toISOString(),
          },
        },
      });
    } catch (error) {
      logger.error("Error creating lead", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get lead by ID with business logic (public API with auth)
   */
  async getLeadById(
    id: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>> {
    return await this.getLeadByIdInternal(id, logger);
  }

  /**
   * Get lead by tracking ID
   */
  async getLeadByTrackingId(
    leadId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>> {
    try {
      logger.debug("Fetching lead by tracking ID", { leadId });

      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (!lead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(this.formatLeadResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by tracking ID", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get lead by email
   */
  async getLeadByEmail(
    email: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>> {
    try {
      logger.debug("Fetching lead by email", { email });

      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.email, email))
        .limit(1);

      if (!lead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(this.formatLeadResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by email", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update lead with business logic (public API with auth)
   * Includes status transition validation
   */
  async updateLead(
    id: string,
    data: Partial<LeadUpdateType>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>> {
    try {
      logger.debug("Updating lead", { id, updates: Object.keys(data) });

      // If status is being updated, validate the transition
      if (data.status) {
        // Get current lead to check current status
        const currentLeadResult = await this.getLeadByIdInternal(id, logger);
        if (!currentLeadResult.success) {
          return fail({
            message:
              "app.api.v1.core.leads.leadsErrors.leads.patch.error.not_found.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            cause: currentLeadResult,
          });
        }

        const currentStatus = currentLeadResult.data.lead.basicInfo.status;
        const newStatus = data.status;

        // Validate status transition
        if (!isStatusTransitionAllowed(currentStatus, newStatus)) {
          logger.error("Invalid lead status transition", {
            id,
            currentStatus,
            newStatus,
          });
          return fail({
            message:
              "app.api.v1.core.leads.leadsErrors.batch.update.error.default",
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
        }

        logger.debug("Lead status transition validated", {
          id,
          from: currentStatus,
          to: newStatus,
        });
      }

      // Delegate to internal method
      return await this.updateLeadInternal(id, data, logger);
    } catch (error) {
      logger.error("Error updating lead", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.patch.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * List leads with filtering and pagination with business logic
   */
  async listLeads(
    query: Partial<LeadListGetRequestTypeOutput>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadListResponseType>> {
    try {
      // Extract values from nested structure with type safety
      const page = query.searchPagination?.page ?? 1;
      const limit = query.searchPagination?.limit ?? 20;
      const search = query.searchPagination?.search;
      const statusFilters = query.statusFilters?.status;
      const campaignStageFilters = query.statusFilters?.currentCampaignStage;
      const sourceFilters = query.statusFilters?.source;
      const countryFilters = query.locationFilters?.country;
      const languageFilters = query.locationFilters?.language;
      const sortByField =
        query.sortingOptions?.sortBy ?? LeadSortField.CREATED_AT;
      const sortDirection = query.sortingOptions?.sortOrder ?? SortOrder.DESC;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions: SQL[] = [];

      // Handle status filters (array of filters)
      if (statusFilters && statusFilters.length > 0) {
        const mappedStatuses = statusFilters
          .map((filter) => mapStatusFilter(filter))
          .filter((status) => status !== null);
        if (mappedStatuses.length > 0) {
          conditions.push(
            or(...mappedStatuses.map((status) => eq(leads.status, status)))!,
          );
        }
      }

      // Handle campaign stage filters (array of filters)
      if (campaignStageFilters && campaignStageFilters.length > 0) {
        const mappedStages = campaignStageFilters
          .map((filter) => mapCampaignStageFilter(filter))
          .filter((stage) => stage !== null);
        if (mappedStages.length > 0) {
          conditions.push(
            or(
              ...mappedStages.map((stage) =>
                eq(leads.currentCampaignStage, stage),
              ),
            )!,
          );
        }
      }

      // Handle source filters (array of filters)
      if (sourceFilters && sourceFilters.length > 0) {
        const mappedSources = sourceFilters
          .map((filter) => mapSourceFilter(filter))
          .filter((source) => source !== null);
        if (mappedSources.length > 0) {
          conditions.push(
            or(...mappedSources.map((source) => eq(leads.source, source)))!,
          );
        }
      }

      // Handle country filters (array of countries)
      if (countryFilters && countryFilters.length > 0) {
        conditions.push(
          or(...countryFilters.map((country) => eq(leads.country, country)))!,
        );
      }

      // Handle language filters (array of languages)
      if (languageFilters && languageFilters.length > 0) {
        conditions.push(
          or(
            ...languageFilters.map((language) => eq(leads.language, language)),
          )!,
        );
      }

      // Handle search filter
      if (search) {
        conditions.push(
          or(
            ilike(leads.email, `%${search}%`),
            ilike(leads.businessName, `%${search}%`),
          )!,
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const [{ total }] = await db
        .select({ total: count() })
        .from(leads)
        .where(whereClause);

      // Get leads with sorting
      let orderClause;
      switch (sortByField) {
        case LeadSortField.EMAIL:
          orderClause =
            sortDirection === SortOrder.ASC ? leads.email : desc(leads.email);
          break;
        case LeadSortField.BUSINESS_NAME:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.businessName
              : desc(leads.businessName);
          break;
        case LeadSortField.UPDATED_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.updatedAt
              : desc(leads.updatedAt);
          break;
        case LeadSortField.LAST_ENGAGEMENT_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.lastEngagementAt
              : desc(leads.lastEngagementAt);
          break;
        default:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.createdAt
              : desc(leads.createdAt);
      }

      const leadsList = await db
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(orderClause)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(total / limit);

      logger.debug("Leads listed successfully", {
        total,
        page,
        limit,
        totalPages,
        resultsCount: leadsList.length,
      });

      return success({
        response: {
          leads: leadsList.map((lead) => this.formatLeadResponse(lead)),
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      logger.error("Error listing leads", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Convert lead - handles both anonymous lead conversion and user-lead relationship establishment (public API with auth)
   */
  async convertLead(
    leadId: string,
    options: {
      userId: DbId;
      email: string;
      additionalData?: {
        businessName?: string;
        contactName?: string;
        phone?: string;
        website?: string;
      };
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>> {
    return await this.convertLeadInternal(leadId, options, logger);
  }

  /**
   * Private helper methods
   */
  private formatLeadResponse(lead: Lead): LeadResponseType {
    return {
      id: lead.id,
      email: lead.email,
      businessName: lead.businessName,
      contactName: lead.contactName,
      phone: lead.phone,
      website: lead.website,
      country: lead.country,
      language: lead.language,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      convertedUserId: lead.convertedUserId,
      convertedAt: lead.convertedAt,
      signedUpAt: lead.signedUpAt,
      consultationBookedAt: lead.consultationBookedAt,
      subscriptionConfirmedAt: lead.subscriptionConfirmedAt,
      currentCampaignStage: lead.currentCampaignStage,
      emailsSent: lead.emailsSent,
      lastEmailSentAt: lead.lastEmailSentAt,
      unsubscribedAt: lead.unsubscribedAt,
      emailsOpened: lead.emailsOpened,
      emailsClicked: lead.emailsClicked,
      lastEngagementAt: lead.lastEngagementAt,
      metadata: lead.metadata || {},
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  private formatLeadDetailResponse(lead: Lead): LeadDetailResponse {
    return {
      lead: {
        basicInfo: {
          id: lead.id,
          email: lead.email,
          businessName: lead.businessName,
          contactName: lead.contactName,
          status: lead.status,
        },
        contactDetails: {
          phone: lead.phone,
          website: lead.website,
          country: lead.country,
          language: lead.language,
        },
        campaignTracking: {
          source: lead.source,
          currentCampaignStage: lead.currentCampaignStage,
          emailJourneyVariant: lead.emailJourneyVariant,
          emailsSent: lead.emailsSent,
          lastEmailSentAt: lead.lastEmailSentAt,
        },
        engagement: {
          emailsOpened: lead.emailsOpened,
          emailsClicked: lead.emailsClicked,
          lastEngagementAt: lead.lastEngagementAt,
          unsubscribedAt: lead.unsubscribedAt,
        },
        conversion: {
          convertedUserId: lead.convertedUserId,
          convertedAt: lead.convertedAt,
          signedUpAt: lead.signedUpAt,
          consultationBookedAt: lead.consultationBookedAt,
          subscriptionConfirmedAt: lead.subscriptionConfirmedAt,
        },
        metadata: {
          notes: lead.notes,
          metadata: lead.metadata || {},
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
        },
      },
    };
  }

  /**
   * Unsubscribe lead from email campaigns and newsletter
   * This method handles both leads and newsletter unsubscription to ensure
   * the user is completely opted out from all email communications
   */
  async unsubscribeLead(
    data: UnsubscribeType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ success: boolean; message?: string; unsubscribedAt?: Date }>
  > {
    try {
      logger.debug("Unsubscribing lead and newsletter", {
        leadId: data.leadId,
        email: data.email,
      });

      let whereClause;
      let email: string | null;

      if (data.leadId) {
        whereClause = eq(leads.id, data.leadId);
        // Get the email from the lead for newsletter unsubscription
        const [lead] = await db
          .select({ email: leads.email })
          .from(leads)
          .where(eq(leads.id, data.leadId))
          .limit(1);
        email = lead?.email;
      } else if (data.email) {
        whereClause = eq(leads.email, data.email);
        email = data.email;
      } else {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leadsUnsubscribe.post.error.validation.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (!email) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // 1. Unsubscribe the lead
      const [updatedLead] = await db
        .update(leads)
        .set({
          status: LeadStatus.UNSUBSCRIBED,
          unsubscribedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(whereClause)
        .returning();

      if (!updatedLead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // 2. Also unsubscribe from newsletter
      await this.unsubscribeFromNewsletterInternal(email, logger);

      logger.debug("Lead and newsletter unsubscribed successfully", {
        leadId: updatedLead.id,
        email,
      });

      return success({
        success: true,
        message:
          "app.api.v1.core.leads.leadsErrors.leadsUnsubscribe.post.success.description",
        unsubscribedAt: updatedLead.unsubscribedAt || undefined,
      });
    } catch (error) {
      logger.error(
        "Error unsubscribing lead and newsletter",
        parseError(error),
      );
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leadsUnsubscribe.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal method to unsubscribe from newsletter
   * Handles newsletter opt-out as part of lead unsubscribe process
   */
  private async unsubscribeFromNewsletterInternal(
    email: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Unsubscribing from newsletter (internal)", { email });

      // Check if newsletter subscription exists
      const [subscription] = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, email))
        .limit(1);

      if (!subscription) {
        // Create an opt-out record for users who haven't subscribed yet
        // This prevents future unwanted subscriptions and ensures compliance
        logger.debug("Creating newsletter opt-out record for non-subscriber", {
          email,
        });

        await db.insert(newsletterSubscriptions).values({
          email,
          status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
          marketingConsent: false,
          subscriptionDate: new Date(), // Required field
          unsubscribedDate: new Date(),
          source: "lead-unsubscribe",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else if (
        subscription.status !== NewsletterSubscriptionStatus.UNSUBSCRIBED
      ) {
        // Update existing subscription status
        await db
          .update(newsletterSubscriptions)
          .set({
            status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
            marketingConsent: false,
            unsubscribedDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscriptions.email, email));
      }

      logger.debug("Newsletter opt-out completed", { email });
    } catch (error) {
      logger.error(
        "Error unsubscribing from newsletter (internal)",
        parseError(error),
      );
      // Don't re-throw - we want lead opt-out to succeed even if newsletter fails
    }
  }

  /**
   * Update lead status to unsubscribed when unsubscribing from newsletter
   * This method is called from newsletter unsubscribe to ensure lead status is updated
   */
  async updateLeadStatusOnNewsletterUnsubscribe(
    email: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; leadFound: boolean }>> {
    try {
      logger.debug("Updating lead status on newsletter unsubscribe", { email });

      // Check if lead exists with this email
      const [existingLead] = await db
        .select({ id: leads.id, status: leads.status })
        .from(leads)
        .where(eq(leads.email, email))
        .limit(1);

      if (!existingLead) {
        logger.debug("No lead found for email during newsletter unsubscribe", {
          email,
        });
        return success({
          success: true,
          leadFound: false,
        });
      }

      // Only update if lead is not already unsubscribed
      if (existingLead.status !== LeadStatus.UNSUBSCRIBED) {
        await db
          .update(leads)
          .set({
            status: LeadStatus.UNSUBSCRIBED,
            unsubscribedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(leads.email, email));

        logger.debug("Lead status updated to unsubscribed", {
          email,
          leadId: existingLead.id,
        });
      } else {
        logger.debug("Lead already unsubscribed", {
          email,
          leadId: existingLead.id,
        });
      }

      return success({
        success: true,
        leadFound: true,
      });
    } catch (error) {
      logger.error(
        "Error updating lead status on newsletter unsubscribe",
        parseError(error).message,
      );
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal: Get lead by ID (no auth required)
   * Used by internal services like tracking
   */
  async getLeadByIdInternal(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>> {
    try {
      logger.debug("Fetching lead by ID (internal)", { id });

      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1);

      if (!lead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(this.formatLeadDetailResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by ID (internal)", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Internal: Update lead (no auth required, no status transition validation)
   * Used by internal services like tracking
   */
  async updateLeadInternal(
    id: string,
    data: Partial<LeadUpdateType>,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponse>> {
    try {
      logger.debug("Updating lead (internal)", {
        id,
        updates: Object.keys(data),
      });

      // Filter out null values and prepare update data
      const updateData: Record<
        string,
        | string
        | number
        | boolean
        | Date
        | null
        | Record<string, string | number | boolean | null>
      > = {
        updatedAt: new Date(),
      };

      // Only include non-null values in the update
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          updateData[key] = value;
        }
      });

      const [updatedLead] = await db
        .update(leads)
        .set(updateData)
        .where(eq(leads.id, id))
        .returning();

      if (!updatedLead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leads.patch.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.debug("Lead updated successfully (internal)", { id });

      return success(this.formatLeadDetailResponse(updatedLead));
    } catch (error) {
      logger.error("Error updating lead (internal)", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.patch.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal: Convert lead (no auth required)
   * Used by internal services like tracking
   */
  async convertLeadInternal(
    leadId: string,
    options: {
      userId: DbId;
      email: string;
      additionalData?: {
        businessName?: string;
        contactName?: string;
        phone?: string;
        website?: string;
      };
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>> {
    try {
      logger.debug("Converting lead (internal)", {
        leadId,
        userId: options.userId,
        email: options.email,
        hasAdditionalData: !!options.additionalData,
      });

      // Use transaction to ensure data consistency
      const result = await withTransaction<ResponseType<LeadResponseType>>(
        logger,
        async (tx) => {
          // Find the lead
          const [existingLead] = await tx
            .select()
            .from(leads)
            .where(eq(leads.id, leadId))
            .limit(1);

          if (!existingLead) {
            return fail({
              message:
                "app.api.v1.core.leads.leadsErrors.leads.patch.error.not_found.title",
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          // Check if lead is already converted to a user
          if (existingLead.convertedUserId && options.userId) {
            logger.debug("Lead already converted to user (internal)", {
              leadId,
              existingUserId: existingLead.convertedUserId,
              newUserId: options.userId,
            });
            return success(this.formatLeadResponse(existingLead));
          }

          // Prepare update data
          const updateData: Partial<Lead> = {
            updatedAt: new Date(),
          };

          // Handle anonymous lead conversion (email update)
          if (options.email && existingLead.metadata?.anonymous) {
            logger.debug(
              "Converting anonymous lead with real email (internal)",
              {
                leadId,
                oldEmail: existingLead.email,
                newEmail: options.email,
              },
            );

            // Check for duplicate email
            const [duplicateLead] = await tx
              .select()
              .from(leads)
              .where(eq(leads.email, options.email.toLowerCase().trim()))
              .limit(1);

            if (duplicateLead && duplicateLead.id !== existingLead.id) {
              return fail({
                message:
                  "app.api.v1.core.leads.leadsErrors.leads.post.error.duplicate.title",
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }

            updateData.email = options.email.toLowerCase().trim();
            updateData.status = getWebsiteUserStatus(existingLead.status);
            updateData.metadata = {
              ...existingLead.metadata,
              anonymous: false,
              convertedAt: new Date().toISOString(),
              originalEmail: existingLead.email,
            };
          }

          // Handle additional data updates
          if (options.additionalData) {
            if (options.additionalData.businessName) {
              updateData.businessName = options.additionalData.businessName;
            }
            if (options.additionalData.contactName) {
              updateData.contactName = options.additionalData.contactName;
            }
            if (options.additionalData.phone) {
              updateData.phone = options.additionalData.phone;
            }
            if (options.additionalData.website) {
              updateData.website = options.additionalData.website;
            }
          }

          // Handle user-lead relationship establishment
          if (options.userId) {
            updateData.status = LeadStatus.SIGNED_UP;
            updateData.convertedUserId = options.userId;
            updateData.convertedAt = new Date();
            updateData.signedUpAt = new Date();

            // Check if user-lead relationship already exists
            const [existingRelationship] = await tx
              .select()
              .from(userLeadLinks)
              .where(
                and(
                  eq(userLeadLinks.userId, options.userId),
                  eq(userLeadLinks.leadId, existingLead.id),
                ),
              )
              .limit(1);

            if (!existingRelationship) {
              // Create user-lead relationship record only if it doesn't exist
              // Using onConflictDoNothing for race condition safety
              await tx
                .insert(userLeadLinks)
                .values({
                  userId: options.userId,
                  leadId: existingLead.id,
                  linkReason: "lead_update",
                })
                .onConflictDoNothing();

              logger.debug("User-lead relationship created (internal)", {
                userId: options.userId,
                leadId: existingLead.id,
              });
            } else {
              logger.debug("User-lead relationship already exists (internal)", {
                userId: options.userId,
                leadId: existingLead.id,
                relationshipId: existingRelationship.id,
              });
            }
          }

          // Apply updates
          const [updatedLead] = await tx
            .update(leads)
            .set(updateData)
            .where(eq(leads.id, existingLead.id))
            .returning();

          return success(this.formatLeadResponse(updatedLead));
        },
      );

      if (result?.success) {
        logger.debug("Lead converted successfully (internal)", {
          leadId,
          userId: options.userId,
          email: options.email,
        });
      }

      return result;
    } catch (error) {
      logger.error("Error converting lead (internal)", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leads.patch.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Internal: Record engagement event for a lead (no auth required)
   * Used by internal services like tracking
   */
  async recordEngagementInternal(
    data: {
      leadId: string;
      engagementType: EngagementTypesType;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>> {
    try {
      logger.debug("Recording lead engagement", {
        leadId: data.leadId,
        engagementType: data.engagementType,
        campaignId: data.campaignId,
      });

      // First, check if the lead exists
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, data.leadId))
        .limit(1);

      if (!lead) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leadsEngagement.post.error.validation.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Create the engagement record
      const [engagement] = await db
        .insert(leadEngagements)
        .values({
          leadId: data.leadId,
          campaignId: data.campaignId || null,
          engagementType: data.engagementType,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        })
        .returning();

      if (!engagement) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.leadsEngagement.post.error.server.title",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      // Update lead engagement counters
      const updateData: Record<string, Date | ReturnType<typeof sql>> = {
        lastEngagementAt: new Date(),
        updatedAt: new Date(),
      };

      if (data.engagementType === EngagementTypes.EMAIL_OPEN) {
        updateData.emailsOpened = sql`${leads.emailsOpened} + 1`;
      } else if (data.engagementType === EngagementTypes.EMAIL_CLICK) {
        updateData.emailsClicked = sql`${leads.emailsClicked} + 1`;
      }

      await db.update(leads).set(updateData).where(eq(leads.id, data.leadId));

      // Update campaign if provided
      if (data.campaignId) {
        const campaignUpdateData: Record<string, Date> = {
          updatedAt: new Date(),
        };

        if (data.engagementType === EngagementTypes.EMAIL_OPEN) {
          // Only update timestamp, keep status as SENT
          campaignUpdateData.openedAt = new Date();
        } else if (data.engagementType === EngagementTypes.EMAIL_CLICK) {
          // Only update timestamp, keep status as SENT
          campaignUpdateData.clickedAt = new Date();
          // Also mark as opened if not already opened
          const [campaign] = await db
            .select({ openedAt: emailCampaigns.openedAt })
            .from(emailCampaigns)
            .where(eq(emailCampaigns.id, data.campaignId))
            .limit(1);

          if (campaign && !campaign.openedAt) {
            campaignUpdateData.openedAt = new Date();
          }
        }

        await db
          .update(emailCampaigns)
          .set(campaignUpdateData)
          .where(eq(emailCampaigns.id, data.campaignId));
      }

      logger.debug("Engagement recorded successfully", {
        engagementId: engagement.id,
        leadId: lead.id,
        engagementType: data.engagementType,
      });

      return success<LeadEngagementResponseOutput>({
        id: engagement.id,
        responseEngagementType: engagement.engagementType,
        responseCampaignId: engagement.campaignId || undefined,
        responseMetadata: engagement.metadata || {},
        timestamp: engagement.timestamp.toISOString(),
        ipAddress: engagement.ipAddress || undefined,
        userAgent: engagement.userAgent || undefined,
        createdAt: engagement.timestamp.toISOString(),
        responseLeadId: engagement.leadId,
      });
    } catch (error) {
      logger.error("Error recording engagement", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leadsEngagement.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Record engagement event for a lead (public API with auth)
   */
  async recordEngagement(
    data: {
      leadId: string;
      engagementType: EngagementTypesType;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>> {
    return await this.recordEngagementInternal(data, logger);
  }

  /**
   * Export leads to CSV or Excel
   */
  async exportLeads(
    query: ExportQueryType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<ExportResponseType>> {
    try {
      logger.debug("Exporting leads", {
        format: query.format,
        limit: query.limit,
      });

      // Build where conditions (similar to listLeads)
      const conditions: SQL[] = [];

      if (query.status) {
        conditions.push(eq(leads.status, query.status));
      }

      if (query.country) {
        conditions.push(eq(leads.country, query.country));
      }

      if (query.language) {
        conditions.push(eq(leads.language, query.language));
      }

      if (query.source) {
        conditions.push(eq(leads.source, query.source));
      }

      if (query.search) {
        const searchConditions = [
          ilike(leads.email, `%${query.search}%`),
          ilike(leads.businessName, `%${query.search}%`),
        ].filter((condition): condition is SQL => condition !== undefined);

        if (searchConditions.length > 0) {
          const orCondition = or(...searchConditions);
          if (orCondition) {
            conditions.push(orCondition);
          }
        }
      }

      if (query.dateFrom) {
        conditions.push(gte(leads.createdAt, new Date(query.dateFrom)));
      }

      if (query.dateTo) {
        conditions.push(lte(leads.createdAt, new Date(query.dateTo)));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get leads data
      const leadsData = await db
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(desc(leads.createdAt));

      // Generate CSV content
      const csvContent = this.generateCsvContent(
        leadsData,
        query.includeMetadata,
        query.includeEngagementData,
        t,
      );

      const dateString = new Date().toISOString().split("T")[0];
      const DEFAULT_FILE_PREFIX = "leads_export_";
      const CSV_EXTENSION = ".csv";
      const EXCEL_EXTENSION = ".xlsx";

      const filePrefix = DEFAULT_FILE_PREFIX;
      const fileSuffix =
        query.format === ExportFormat.CSV ? CSV_EXTENSION : EXCEL_EXTENSION;
      const fileName = `${filePrefix}${dateString}${fileSuffix}`;
      const fileContent = Buffer.from(csvContent).toString("base64");

      logger.debug("Leads exported successfully", {
        totalRecords: leadsData.length,
        format: String(query.format),
        fileName,
      });

      return success({
        fileName,
        fileContent,
        mimeType:
          query.format === ExportFormat.CSV ? MimeType.CSV : MimeType.XLSX,
        totalRecords: leadsData.length,
        exportedAt: new Date(),
      });
    } catch (error) {
      logger.error("Error exporting leads", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.leadsExport.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate CSV content from leads data
   */
  private generateCsvContent(
    leadsData: Lead[],
    includeMetadata: boolean,
    includeEngagementData: boolean,
    t: TFunction,
  ): string {
    const headers = [
      t("app.api.v1.core.leads.export.headers.email"),
      t("app.api.v1.core.leads.export.headers.businessName"),
      t("app.api.v1.core.leads.export.headers.contactName"),
      t("app.api.v1.core.leads.export.headers.phone"),
      t("app.api.v1.core.leads.export.headers.website"),
      t("app.api.v1.core.leads.export.headers.country"),
      t("app.api.v1.core.leads.export.headers.language"),
      t("app.api.v1.core.leads.export.headers.status"),
      t("app.api.v1.core.leads.export.headers.source"),
      t("app.api.v1.core.leads.export.headers.notes"),
      t("app.api.v1.core.leads.export.headers.createdAt"),
      t("app.api.v1.core.leads.export.headers.updatedAt"),
    ];

    if (includeEngagementData) {
      headers.push(
        t("app.api.v1.core.leads.export.headers.emailsSent"),
        t("app.api.v1.core.leads.export.headers.emailsOpened"),
        t("app.api.v1.core.leads.export.headers.emailsClicked"),
        t("app.api.v1.core.leads.export.headers.lastEmailSent"),
        t("app.api.v1.core.leads.export.headers.lastEngagement"),
        t("app.api.v1.core.leads.export.headers.unsubscribedAt"),
      );
    }

    if (includeMetadata) {
      headers.push(t("app.api.v1.core.leads.export.headers.metadata"));
    }

    const rows = leadsData.map((lead) => {
      const row = [
        lead.email,
        lead.businessName,
        lead.phone || "",
        lead.website || "",
        lead.country,
        lead.language,
        lead.status,
        lead.source || "",
        lead.notes || "",
        lead.createdAt.toISOString(),
        lead.updatedAt.toISOString(),
      ];

      if (includeEngagementData) {
        row.push(
          lead.emailsSent.toString(),
          lead.emailsOpened.toString(),
          lead.emailsClicked.toString(),
          lead.lastEmailSentAt?.toISOString() || "",
          lead.lastEngagementAt?.toISOString() || "",
          lead.unsubscribedAt?.toISOString() || "",
        );
      }

      if (includeMetadata) {
        row.push(JSON.stringify(lead.metadata || {}));
      }

      return row;
    });

    // Escape CSV values and join
    const CSV_COMMA = ",";
    const CSV_QUOTE = '"';
    const CSV_NEWLINE = "\n";
    const CSV_DOUBLE_QUOTE = '""';

    const escapeCsvValue = (value: string | undefined): string => {
      const stringValue = value || "";
      if (
        stringValue.includes(CSV_COMMA) ||
        stringValue.includes(CSV_QUOTE) ||
        stringValue.includes(CSV_NEWLINE)
      ) {
        const quotedValue = stringValue.replace(
          new RegExp(CSV_QUOTE, "g"),
          CSV_DOUBLE_QUOTE,
        );
        return `${CSV_QUOTE}${quotedValue}${CSV_QUOTE}`;
      }
      return stringValue;
    };

    const csvRows = [headers.map(escapeCsvValue).join(",")];
    rows.forEach((row) => {
      csvRows.push(row.map((value) => escapeCsvValue(value ?? "")).join(","));
    });

    return csvRows.join("\n");
  }

  /**
   * Batch update leads based on filter criteria
   */
  async batchUpdateLeads(
    data: {
      search?: string;
      status?: LeadStatusFilterType;
      currentCampaignStage?: EmailCampaignStageFilterType;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilterType;
      sortBy?: LeadSortFieldType[];
      sortOrder?: SortOrderType[];
      scope?: BatchOperationScopeType;
      page?: number;
      pageSize?: number;
      updates: {
        status?: LeadStatusType;
        currentCampaignStage?: EmailCampaignStageType;
        source?: LeadSourceType;
        notes?: string;
      };
      dryRun?: boolean;
      maxRecords?: number;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      totalMatched: number;
      totalProcessed: number;
      totalUpdated: number;
      errors: Array<{ leadId: string; error: string }>;
      preview: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatusType;
        currentCampaignStage: EmailCampaignStageType | null;
      }> | null;
    }>
  > {
    try {
      const {
        search,
        status,
        currentCampaignStage,
        country,
        language,
        source,
        sortBy = [LeadSortField.CREATED_AT],
        sortOrder = [SortOrder.DESC],
        scope = BatchOperationScope.ALL_PAGES,
        page = 1,
        pageSize = 20,
        updates,
        dryRun = false,
        maxRecords = 1000,
      } = data;

      logger.debug("Starting batch update", {
        filters: {
          search,
          status,
          currentCampaignStage,
          country,
          language,
          source,
        },
        updates: Object.keys(updates),
        dryRun,
        maxRecords,
      });

      // Build where conditions (same logic as listLeads)
      const conditions: SQL[] = [];

      // Handle status filters (can be array)
      if (status && Array.isArray(status) && status.length > 0) {
        const mappedStatuses = status
          .map((filter: LeadStatusFilterType) => mapStatusFilter(filter))
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapStatusFilter>> =>
              s !== null,
          );
        if (mappedStatuses.length > 0) {
          conditions.push(
            or(...mappedStatuses.map((s) => eq(leads.status, s)))!,
          );
        }
      } else if (status && !Array.isArray(status)) {
        const dbStatus = mapStatusFilter(status);
        if (dbStatus !== null) {
          conditions.push(eq(leads.status, dbStatus));
        }
      }

      // Handle campaign stage filters (can be array)
      if (
        currentCampaignStage &&
        Array.isArray(currentCampaignStage) &&
        currentCampaignStage.length > 0
      ) {
        const mappedStages = currentCampaignStage
          .map((filter: EmailCampaignStageFilterType) =>
            mapCampaignStageFilter(filter),
          )
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapCampaignStageFilter>> =>
              s !== null,
          );
        if (mappedStages.length > 0) {
          conditions.push(
            or(...mappedStages.map((s) => eq(leads.currentCampaignStage, s)))!,
          );
        }
      } else if (currentCampaignStage && !Array.isArray(currentCampaignStage)) {
        const dbStage = mapCampaignStageFilter(currentCampaignStage);
        if (dbStage !== null) {
          conditions.push(eq(leads.currentCampaignStage, dbStage));
        }
      }

      // Handle source filters (can be array)
      if (source && Array.isArray(source) && source.length > 0) {
        const mappedSources = source
          .map((filter: LeadSourceFilterType) => mapSourceFilter(filter))
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapSourceFilter>> =>
              s !== null,
          );
        if (mappedSources.length > 0) {
          conditions.push(
            or(...mappedSources.map((s) => eq(leads.source, s)))!,
          );
        }
      } else if (source && !Array.isArray(source)) {
        const dbSource = mapSourceFilter(source);
        if (dbSource !== null) {
          conditions.push(eq(leads.source, dbSource));
        }
      }

      // Handle country filters (can be array)
      if (country && Array.isArray(country) && country.length > 0) {
        const mappedCountries = country
          .map((filter: CountryFilter) => convertCountryFilter(filter))
          .filter((c): c is NonNullable<Countries> => c !== null);
        if (mappedCountries.length > 0) {
          conditions.push(
            or(...mappedCountries.map((c) => eq(leads.country, c)))!,
          );
        }
      } else if (country && !Array.isArray(country)) {
        const dbCountry = convertCountryFilter(country);
        if (dbCountry !== null) {
          conditions.push(eq(leads.country, dbCountry));
        }
      }

      // Handle language filters (can be array)
      if (language && Array.isArray(language) && language.length > 0) {
        const mappedLanguages = language
          .map((filter: LanguageFilter) => convertLanguageFilter(filter))
          .filter((l): l is NonNullable<Languages> => l !== null);
        if (mappedLanguages.length > 0) {
          conditions.push(
            or(...mappedLanguages.map((l) => eq(leads.language, l)))!,
          );
        }
      } else if (language && !Array.isArray(language)) {
        const dbLanguage = convertLanguageFilter(language);
        if (dbLanguage !== null) {
          conditions.push(eq(leads.language, dbLanguage));
        }
      }

      if (search) {
        conditions.push(
          or(
            ilike(leads.email, `%${search}%`),
            ilike(leads.businessName, `%${search}%`),
          )!,
        );
      }

      // Build the query
      let query = db.select().from(leads);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      // Apply sorting
      let orderClause;
      const sortByField = Array.isArray(sortBy)
        ? sortBy[0]
        : (sortBy ?? LeadSortField.CREATED_AT);
      const sortDirection = Array.isArray(sortOrder)
        ? sortOrder[0]
        : (sortOrder ?? SortOrder.DESC);
      switch (sortByField) {
        case LeadSortField.EMAIL:
          orderClause =
            sortDirection === SortOrder.ASC ? leads.email : desc(leads.email);
          break;
        case LeadSortField.BUSINESS_NAME:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.businessName
              : desc(leads.businessName);
          break;
        case LeadSortField.UPDATED_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.updatedAt
              : desc(leads.updatedAt);
          break;
        case LeadSortField.LAST_ENGAGEMENT_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.lastEngagementAt
              : desc(leads.lastEngagementAt);
          break;
        default:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.createdAt
              : desc(leads.createdAt);
      }
      query = query.orderBy(orderClause) as typeof query;

      // Apply scope-based pagination or limit
      if (scope === BatchOperationScope.CURRENT_PAGE) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset) as typeof query;
      } else {
        // Apply limit for safety on all pages
        query = query.limit(maxRecords) as typeof query;
      }

      // Get matching leads
      const matchingLeads = await query;

      logger.debug("Found matching leads", { count: matchingLeads.length });

      // If dry run, return preview
      if (dryRun) {
        const preview = matchingLeads.map((lead) => ({
          id: lead.id,
          email: lead.email,
          businessName: lead.businessName,
          currentStatus: lead.status,
          currentCampaignStage: lead.currentCampaignStage,
        }));

        return success({
          success: true,
          totalMatched: matchingLeads.length,
          totalProcessed: 0,
          totalUpdated: 0,
          errors: [],
          preview,
        });
      }

      // Perform actual updates
      const errors: Array<{ leadId: string; error: string }> = [];
      let totalUpdated = 0;

      // Prepare update data with proper type safety
      const updateData: Record<
        string,
        | string
        | number
        | boolean
        | Date
        | null
        | Record<string, string | number | boolean | null>
      > = {
        updatedAt: new Date(),
      };

      // Only include non-null values in the update
      if (updates.status !== null && updates.status !== undefined) {
        updateData.status = updates.status;
      }
      if (
        updates.currentCampaignStage !== null &&
        updates.currentCampaignStage !== undefined
      ) {
        updateData.currentCampaignStage = updates.currentCampaignStage;
      }
      if (updates.source !== null && updates.source !== undefined) {
        updateData.source = updates.source;
      }
      if (updates.notes !== null && updates.notes !== undefined) {
        updateData.notes = updates.notes;
      }

      // Use transaction for batch update
      await withTransaction(logger, async (tx) => {
        for (const lead of matchingLeads) {
          try {
            // If status is being updated, validate the transition
            if (updates.status && updates.status !== lead.status) {
              if (!isStatusTransitionAllowed(lead.status, updates.status)) {
                errors.push({
                  leadId: lead.id,
                  error: INVALID_STATUS_TRANSITION_ERROR,
                });
                continue;
              }
            }

            await tx.update(leads).set(updateData).where(eq(leads.id, lead.id));
            totalUpdated++;
          } catch (error) {
            logger.error(
              "Error updating lead in batch",
              parseError(error).message,
            );
            errors.push({
              leadId: lead.id,
              error: parseError(error).toString(),
            });
          }
        }
      });

      logger.debug("Batch update completed", {
        totalMatched: matchingLeads.length,
        totalUpdated,
        errors: errors.length,
      });

      return success({
        success: true,
        totalMatched: matchingLeads.length,
        totalProcessed: matchingLeads.length,
        totalUpdated,
        errors,
        preview: null,
      });
    } catch (error) {
      logger.error("Error in batch update", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.batch.update.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Batch delete leads based on filter criteria
   */
  async batchDeleteLeads(
    data: {
      search?: string;
      status?: LeadStatusFilterType;
      currentCampaignStage?: EmailCampaignStageFilterType;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilterType;
      sortBy?: LeadSortFieldType[];
      sortOrder?: SortOrderType[];
      scope?: BatchOperationScopeType;
      page?: number;
      pageSize?: number;
      confirmDelete: boolean;
      dryRun?: boolean;
      maxRecords?: number;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      totalMatched: number;
      totalProcessed: number;
      totalDeleted: number;
      errors: Array<{ leadId: string; error: string }>;
      preview: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatusType;
        currentCampaignStage: EmailCampaignStageType | null;
      }> | null;
    }>
  > {
    try {
      const {
        search,
        status,
        currentCampaignStage,
        country,
        language,
        source,
        sortBy = [LeadSortField.CREATED_AT],
        sortOrder = [SortOrder.DESC],
        scope = BatchOperationScope.ALL_PAGES,
        page = 1,
        pageSize = 20,
        confirmDelete,
        dryRun = false,
        maxRecords = 1000,
      } = data;

      logger.debug("Starting batch delete", {
        filters: {
          search,
          status,
          currentCampaignStage,
          country,
          language,
          source,
        },
        scope,
        page,
        pageSize,
        confirmDelete,
        dryRun,
        maxRecords,
      });

      // Validation: confirmDelete must be true for actual deletion
      if (!dryRun && !confirmDelete) {
        return fail({
          message:
            "app.api.v1.core.leads.leadsErrors.batch.update.error.validation.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Build the query using the same logic as list endpoint and batchUpdateLeads
      const conditions: SQL[] = [];

      // Search filter
      if (search?.trim()) {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
        conditions.push(
          or(
            ilike(leads.businessName, searchTerm),
            ilike(leads.email, searchTerm),
            ilike(leads.notes, searchTerm),
          )!,
        );
      }

      // Handle status filters (can be array)
      if (status && Array.isArray(status) && status.length > 0) {
        const mappedStatuses = status
          .map((filter: LeadStatusFilterType) => mapStatusFilter(filter))
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapStatusFilter>> =>
              s !== null,
          );
        if (mappedStatuses.length > 0) {
          conditions.push(
            or(...mappedStatuses.map((s) => eq(leads.status, s)))!,
          );
        }
      } else if (status && !Array.isArray(status)) {
        const dbStatus = mapStatusFilter(status);
        if (dbStatus !== null) {
          conditions.push(eq(leads.status, dbStatus));
        }
      }

      // Handle campaign stage filters (can be array)
      if (
        currentCampaignStage &&
        Array.isArray(currentCampaignStage) &&
        currentCampaignStage.length > 0
      ) {
        const mappedStages = currentCampaignStage
          .map((filter: EmailCampaignStageFilterType) =>
            mapCampaignStageFilter(filter),
          )
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapCampaignStageFilter>> =>
              s !== null,
          );
        if (mappedStages.length > 0) {
          conditions.push(
            or(...mappedStages.map((s) => eq(leads.currentCampaignStage, s)))!,
          );
        }
      } else if (currentCampaignStage && !Array.isArray(currentCampaignStage)) {
        const dbStage = mapCampaignStageFilter(currentCampaignStage);
        if (dbStage !== null) {
          conditions.push(eq(leads.currentCampaignStage, dbStage));
        }
      }

      // Handle source filters (can be array)
      if (source && Array.isArray(source) && source.length > 0) {
        const mappedSources = source
          .map((filter: LeadSourceFilterType) => mapSourceFilter(filter))
          .filter(
            (s): s is NonNullable<ReturnType<typeof mapSourceFilter>> =>
              s !== null,
          );
        if (mappedSources.length > 0) {
          conditions.push(
            or(...mappedSources.map((s) => eq(leads.source, s)))!,
          );
        }
      } else if (source && !Array.isArray(source)) {
        const dbSource = mapSourceFilter(source);
        if (dbSource !== null) {
          conditions.push(eq(leads.source, dbSource));
        }
      }

      // Handle country filters (can be array)
      if (country && Array.isArray(country) && country.length > 0) {
        const mappedCountries = country
          .map((filter: CountryFilter) => convertCountryFilter(filter))
          .filter((c): c is NonNullable<Countries> => c !== null);
        if (mappedCountries.length > 0) {
          conditions.push(
            or(...mappedCountries.map((c) => eq(leads.country, c)))!,
          );
        }
      } else if (country && !Array.isArray(country)) {
        const dbCountry = convertCountryFilter(country);
        if (dbCountry !== null) {
          conditions.push(eq(leads.country, dbCountry));
        }
      }

      // Handle language filters (can be array)
      if (language && Array.isArray(language) && language.length > 0) {
        const mappedLanguages = language
          .map((filter: LanguageFilter) => convertLanguageFilter(filter))
          .filter((l): l is NonNullable<Languages> => l !== null);
        if (mappedLanguages.length > 0) {
          conditions.push(
            or(...mappedLanguages.map((l) => eq(leads.language, l)))!,
          );
        }
      } else if (language && !Array.isArray(language)) {
        const dbLanguage = convertLanguageFilter(language);
        if (dbLanguage !== null) {
          conditions.push(eq(leads.language, dbLanguage));
        }
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      logger.debug("Applied filter conditions", {
        totalConditions: conditions.length,
        hasWhereClause: !!whereClause,
      });

      // Apply sorting
      let orderClause;
      const sortByField = Array.isArray(sortBy)
        ? sortBy[0]
        : (sortBy ?? LeadSortField.CREATED_AT);
      const sortDirection = Array.isArray(sortOrder)
        ? sortOrder[0]
        : (sortOrder ?? SortOrder.DESC);
      switch (sortByField) {
        case LeadSortField.EMAIL:
          orderClause =
            sortDirection === SortOrder.ASC ? leads.email : desc(leads.email);
          break;
        case LeadSortField.BUSINESS_NAME:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.businessName
              : desc(leads.businessName);
          break;
        case LeadSortField.UPDATED_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.updatedAt
              : desc(leads.updatedAt);
          break;
        case LeadSortField.LAST_ENGAGEMENT_AT:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.lastEngagementAt
              : desc(leads.lastEngagementAt);
          break;
        default:
          orderClause =
            sortDirection === SortOrder.ASC
              ? leads.createdAt
              : desc(leads.createdAt);
      }

      // Execute query to get matching leads
      let query = db
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(orderClause);

      // Apply scope-based pagination or limit
      if (scope === BatchOperationScope.CURRENT_PAGE) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset) as typeof query;
      } else {
        // Apply limit for safety on all pages
        query = query.limit(maxRecords) as typeof query;
      }

      const matchingLeads = await query;

      logger.debug("Found matching leads for deletion", {
        count: matchingLeads.length,
        scope,
        page,
        pageSize,
        maxRecords,
        appliedLimit:
          scope === BatchOperationScope.CURRENT_PAGE ? pageSize : maxRecords,
      });

      // If dry run, return preview
      if (dryRun) {
        const preview = matchingLeads.map((lead) => ({
          id: lead.id,
          email: lead.email,
          businessName: lead.businessName,
          currentStatus: lead.status,
          currentCampaignStage: lead.currentCampaignStage,
        }));

        return success({
          success: true,
          totalMatched: matchingLeads.length,
          totalProcessed: 0,
          totalDeleted: 0,
          errors: [],
          preview,
        });
      }

      // Perform actual deletion
      let totalDeleted = 0;
      const errors: Array<{ leadId: string; error: string }> = [];

      logger.debug("Starting actual deletion", {
        leadsToDelete: matchingLeads.length,
        scope,
        dryRun: false,
        leadIds: matchingLeads.map((lead) => lead.id),
      });

      // Use transaction for batch delete
      await withTransaction(logger, async (tx) => {
        for (const lead of matchingLeads) {
          try {
            logger.debug("Deleting individual lead", {
              leadId: lead.id,
              email: lead.email,
              businessName: lead.businessName,
            });
            await tx.delete(leads).where(eq(leads.id, lead.id));
            totalDeleted++;
          } catch (error) {
            logger.error(
              "Error deleting lead in batch",
              parseError(error).message,
            );
            errors.push({
              leadId: lead.id,
              error: parseError(error).toString(),
            });
          }
        }
      });

      logger.debug("Batch delete completed", {
        totalMatched: matchingLeads.length,
        totalDeleted,
        errors: errors.length,
        scope,
        expectedDeletions:
          scope === BatchOperationScope.CURRENT_PAGE
            ? Math.min(pageSize, matchingLeads.length)
            : matchingLeads.length,
        actualDeletions: totalDeleted,
        deletionMatch: totalDeleted === matchingLeads.length,
      });

      return success({
        success: true,
        totalMatched: matchingLeads.length,
        totalProcessed: matchingLeads.length,
        totalDeleted,
        errors,
        preview: null,
      });
    } catch (error) {
      logger.error("Error in batch delete", parseError(error));
      return fail({
        message:
          "app.api.v1.core.leads.leadsErrors.batch.update.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const leadsRepository = new LeadsRepositoryImpl();
