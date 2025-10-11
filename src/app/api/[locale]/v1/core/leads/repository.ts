/**
 * Leads Repository
 * Core functionality for lead management operations
 */

import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
// TODO: Replace with proper enum imports from core config
// TODO: Replace with proper filter utilities
// Temporarily comment out for CLI compatibility
// import { convertCountryFilter, convertLanguageFilter } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import type { CountryLanguage, Countries, Languages } from "@/i18n/core/config";

// Type aliases for filter values
type CountryFilter = (typeof Countries)[keyof typeof Countries] | "ALL";
type LanguageFilter = (typeof Languages)[keyof typeof Languages] | "ALL";

import { newsletterSubscriptions } from "../newsletter/db";
import { NewsletterSubscriptionStatus } from "../newsletter/enum";
import type { JwtPayloadType } from "../user/auth/definition";
import { users } from "../user/db";
import {
  emailCampaigns,
  type Lead,
  leadEngagements,
  leads,
  type NewLead,
} from "./db";
import type {
  EmailCampaignStageFilter,
  LeadSource,
  LeadSourceFilter,
  LeadStatusFilter,
} from "./enum";
import {
  BatchOperationScope,
  EmailCampaignStage,
  EngagementTypes,
  EngagementTypesValues,
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
import type { LeadResponseType as LeadDetailResponseType } from "./lead/[id]/definition";
import type {
  LeadCreateType,
  LeadListResponseType,
  LeadQueryType,
  LeadResponseType,
  LeadUpdateType,
  LeadWithEmailType,
  UnsubscribeType,
} from "./definition";
import type { LeadEngagementResponseType } from "./tracking/engagement/definition";

const INVALID_STATUS_TRANSITION_ERROR = "Invalid status transition";

/**
 * Leads Repository Interface
 */
export interface LeadsRepository {
  createLead(
    data: Omit<LeadCreateType, "email"> & { email: string | undefined },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>>;

  getLeadById(
    id: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponseType>>;

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
  ): Promise<ResponseType<LeadDetailResponseType>>;

  listLeads(
    query: Partial<LeadQueryType>,
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
  ): Promise<ResponseType<{ success: boolean; message?: string; unsubscribedAt?: Date }>>;

  recordEngagement(
    data: {
      leadId: string;
      engagementType: typeof EngagementTypesValues;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseType>>;

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
      status?: LeadStatusFilter;
      currentCampaignStage?: EmailCampaignStageFilter;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilter;
      sortBy?: LeadSortField[];
      sortOrder?: SortOrder[];
      scope?: BatchOperationScope;
      page?: number;
      pageSize?: number;
      updates: {
        status?: LeadStatus;
        currentCampaignStage?: EmailCampaignStage;
        source?: LeadSource;
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
      preview?: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatus;
        currentCampaignStage: EmailCampaignStage | null;
      }>;
    }>
  >;

  batchDeleteLeads(
    data: {
      search?: string;
      status?: LeadStatusFilter;
      currentCampaignStage?: EmailCampaignStageFilter;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilter;
      sortBy?: LeadSortField[];
      sortOrder?: SortOrder[];
      scope?: BatchOperationScope;
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
      preview?: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatus;
        currentCampaignStage: EmailCampaignStage | null;
      }>;
    }>
  >;
}

/**
 * Utility function to ensure a lead has an email
 * Throws an error if the lead doesn't have an email
 */
export function ensureLeadHasEmail(lead: LeadResponseType): LeadWithEmailType {
  if (!lead.email) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
    throw new Error(`Lead ${lead.id} does not have an email address`);
  }
  return lead as LeadWithEmailType;
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
    data: Omit<LeadCreateType, "email"> & { email: string | undefined },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadResponseType>> {
    try {
      logger.debug("Creating new lead", {
        email: data.email,
        businessName: data.businessName,
        userId: user?.id,
      });

      if (data.email) {
        // Check if lead already exists
        const existingLead = await db
          .select()
          .from(leads)
          .where(eq(leads.email, data.email.toLowerCase().trim()))
          .limit(1);

        if (existingLead.length > 0) {
          return createErrorResponse(
            "leadsErrors.leads.post.error.duplicate.title",
            ErrorResponseTypes.CONFLICT,
          );
        }
      }

      const newLead: NewLead = {
        ...data,
        status: LeadStatus.PENDING, // Default status for general lead creation
        language: data.language,
        currentCampaignStage: EmailCampaignStage.INITIAL,
        metadata: data.metadata
          ? (Object.fromEntries(
              Object.entries(data.metadata).filter(
                ([, value]) => value !== null,
              ),
            ) as Record<string, string | number | boolean>)
          : {},
      };

      const [createdLead] = await db.insert(leads).values(newLead).returning();

      logger.debug("Lead created successfully", {
        leadId: createdLead.id,
        trackingId: createdLead.id,
        status: createdLead.status,
        note: "Lead marked as NOT_STARTED - campaign starter cron will process it",
      });

      return createSuccessResponse(this.formatLeadResponse(createdLead));
    } catch (error) {
      logger.error("Error creating lead", error);
      return createErrorResponse(
        "leadsErrors.leads.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get lead by ID with business logic
   */
  async getLeadById(
    id: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponseType>> {
    try {
      logger.debug("Fetching lead by ID", { id });

      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1);

      if (!lead) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(this.formatLeadDetailResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by ID", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
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
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(this.formatLeadResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by tracking ID", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(this.formatLeadResponse(lead));
    } catch (error) {
      logger.error("Error fetching lead by email", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Update lead with business logic
   */
  async updateLead(
    id: string,
    data: Partial<LeadUpdateType>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadDetailResponseType>> {
    try {
      logger.debug("Updating lead", { id, updates: Object.keys(data) });

      // If status is being updated, validate the transition
      if (data.status) {
        // Get current lead to check current status
        const currentLeadResult = await this.getLeadById(id, user, locale, logger);
        if (!currentLeadResult.success) {
          return createErrorResponse(
            "leadsErrors.leads.patch.error.not_found.title",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        const currentStatus = currentLeadResult.data.status;
        const newStatus = data.status;

        // Validate status transition
        if (!isStatusTransitionAllowed(currentStatus, newStatus)) {
          logger.error("Invalid lead status transition", {
            id,
            currentStatus,
            newStatus,
          });
          return createErrorResponse(
            "error.default",
            ErrorResponseTypes.BAD_REQUEST,
          );
        }

        logger.debug("Lead status transition validated", {
          id,
          from: currentStatus,
          to: newStatus,
        });
      }

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
        return createErrorResponse(
          "leadsErrors.leads.patch.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      logger.debug("Lead updated successfully", { id });

      return createSuccessResponse(this.formatLeadDetailResponse(updatedLead));
    } catch (error) {
      logger.error("Error updating lead", error);
      return createErrorResponse(
        "leadsErrors.leads.patch.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * List leads with filtering and pagination with business logic
   */
  async listLeads(
    query: Partial<LeadQueryType>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadListResponseType>> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        currentCampaignStage,
        country,
        language,
        source,
        search,
        sortBy = [LeadSortField.CREATED_AT],
        sortOrder = [SortOrder.DESC],
      } = query;
      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];

      // Convert filter values to database values
      const dbStatus = mapStatusFilter(status);
      const dbCampaignStage = mapCampaignStageFilter(currentCampaignStage);
      const dbSource = mapSourceFilter(source);
      // const dbCountry = convertCountryFilter(country);
      const dbCountry = country; // TODO: Fix type conversion
      // const dbLanguage = convertLanguageFilter(language);
      const dbLanguage = language; // TODO: Fix type conversion

      if (dbStatus) {
        conditions.push(eq(leads.status, dbStatus));
      }

      if (dbCampaignStage) {
        conditions.push(eq(leads.currentCampaignStage, dbCampaignStage));
      }

      if (dbCountry) {
        conditions.push(eq(leads.country, dbCountry));
      }

      if (dbLanguage) {
        conditions.push(eq(leads.language, dbLanguage));
      }

      if (dbSource) {
        conditions.push(eq(leads.source, dbSource));
      }

      if (search) {
        conditions.push(
          or(
            ilike(leads.email, `%${search}%`),
            ilike(leads.businessName, `%${search}%`),
          ),
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
      const sortByField = sortBy[0] || LeadSortField.CREATED_AT;
      const sortDirection = sortOrder[0] || SortOrder.DESC;
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

      return createSuccessResponse({
        leads: leadsList.map((lead) => this.formatLeadResponse(lead)),
        total,
        page,
        limit,
        totalPages,
      });
    } catch (error) {
      logger.error("Error listing leads", error);
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Convert lead - handles both anonymous lead conversion and user-lead relationship establishment
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
    try {
      logger.debug("Converting lead", {
        leadId,
        userId: options.userId,
        email: options.email,
        hasAdditionalData: !!options.additionalData,
      });

      // Use transaction to ensure data consistency
      const result = await withTransaction<ResponseType<LeadResponseType>>(
        async (tx) => {
          // Find the lead
          let [existingLead] = await tx
            .select()
            .from(leads)
            .where(eq(leads.id, leadId))
            .limit(1);

          if (!existingLead) {
            return createErrorResponse(
              "leadsErrors.leads.patch.error.not_found.title",
              ErrorResponseTypes.NOT_FOUND,
            );
          }

          // Check if lead is already converted to a user
          if (existingLead.convertedUserId && options.userId) {
            logger.debug("Lead already converted to user", {
              leadId,
              existingUserId: existingLead.convertedUserId,
              newUserId: options.userId,
            });
            return createSuccessResponse(this.formatLeadResponse(existingLead));
          }

          // Prepare update data
          const updateData: Partial<Lead> = {
            updatedAt: new Date(),
          };

          // Handle anonymous lead conversion (email update)
          if (options.email && existingLead.metadata?.anonymous) {
            logger.debug("Converting anonymous lead with real email", {
              leadId,
              oldEmail: existingLead.email,
              newEmail: options.email,
            });

            // Check for duplicate email
            const [duplicateLead] = await tx
              .select()
              .from(leads)
              .where(eq(leads.email, options.email.toLowerCase().trim()))
              .limit(1);

            if (duplicateLead && duplicateLead.id !== existingLead.id) {
              return createErrorResponse(
                "leadsErrors.leads.post.error.duplicate.title",
                ErrorResponseTypes.CONFLICT,
              );
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

            // Update the user record with the leadId for future tracking
            await tx
              .update(users)
              .set({
                leadId: existingLead.id,
                updatedAt: new Date(),
              })
              .where(eq(users.id, options.userId));

            logger.debug("User record updated with leadId", {
              userId: options.userId,
              leadId: existingLead.id,
            });
          }

          // Apply updates
          const [updatedLead] = await tx
            .update(leads)
            .set(updateData)
            .where(eq(leads.id, existingLead.id))
            .returning();

          return createSuccessResponse(this.formatLeadResponse(updatedLead));
        },
      );

      if (result?.success) {
        logger.debug("Lead converted successfully", {
          leadId,
          userId: options.userId,
          email: options.email,
        });
      }

      return result;
    } catch (error) {
      logger.error("Error converting lead", error);
      return createErrorResponse(
        "leadsErrors.leads.patch.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
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

  private formatLeadDetailResponse(lead: Lead): LeadDetailResponseType {
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
      emailJourneyVariant: lead.emailJourneyVariant,
      metadata: lead.metadata || {},
      emailsSent: lead.emailsSent,
      lastEmailSentAt: lead.lastEmailSentAt,
      unsubscribedAt: lead.unsubscribedAt,
      emailsOpened: lead.emailsOpened,
      emailsClicked: lead.emailsClicked,
      lastEngagementAt: lead.lastEngagementAt,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
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
      logger.debug("Unsubscribing lead and newsletter", data);

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
        return createErrorResponse(
          "leadsErrors.leadsUnsubscribe.post.error.validation.title",
          ErrorResponseTypes.BAD_REQUEST,
        );
      }

      if (!email) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
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
        return createErrorResponse(
          "leadsErrors.leads.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // 2. Also unsubscribe from newsletter
      await this.unsubscribeFromNewsletterInternal(email, logger);

      logger.debug("Lead and newsletter unsubscribed successfully", {
        leadId: updatedLead.id,
        email,
      });

      return createSuccessResponse({
        success: true,
        message: "leadsErrors.leadsUnsubscribe.post.success.description",
        unsubscribedAt: updatedLead.unsubscribedAt || undefined,
      });
    } catch (error) {
      logger.error("Error unsubscribing lead and newsletter", error);
      return createErrorResponse(
        "leadsErrors.leadsUnsubscribe.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      logger.error("Error unsubscribing from newsletter (internal)", error);
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
        return createSuccessResponse({
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

      return createSuccessResponse({
        success: true,
        leadFound: true,
      });
    } catch (error) {
      logger.error(
        "Error updating lead status on newsletter unsubscribe",
        error,
      );
      return createErrorResponse(
        "leadsErrors.leads.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Record engagement event for a lead
   */
  async recordEngagement(
    data: {
      leadId: string;
      engagementType: typeof EngagementTypesValues;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      ipAddress?: string;
      userAgent?: string;
    },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseType>> {
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
        return createErrorResponse(
          "leadsErrors.leadsEngagement.post.error.validation.title",
          ErrorResponseTypes.NOT_FOUND,
        );
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
        return createErrorResponse(
          "leadsErrors.leadsEngagement.post.error.server.title",
          ErrorResponseTypes.DATABASE_ERROR,
        );
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

      return createSuccessResponse<LeadEngagementResponseType>({
        id: engagement.id,
        engagementType: engagement.engagementType,
        campaignId: engagement.campaignId || undefined,
        metadata: engagement.metadata || {},
        timestamp: engagement.timestamp,
        ipAddress: engagement.ipAddress || undefined,
        userAgent: engagement.userAgent || undefined,
        createdAt: engagement.timestamp,
        leadId: engagement.leadId,
      });
    } catch (error) {
      logger.error("Error recording engagement", error);
      return createErrorResponse(
        "leadsErrors.leadsEngagement.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
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
      logger.debug("Exporting leads", { query });

      // Build where conditions (similar to listLeads)
      const conditions = [];

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
        const convertedSource = mapSourceFilter(query.source);
        if (convertedSource) {
          conditions.push(eq(leads.source, convertedSource));
        }
      }

      if (query.search) {
        conditions.push(
          or(
            ilike(leads.email, `%${query.search}%`),
            ilike(leads.businessName, `%${query.search}%`),
          ),
        );
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
        format: query.format,
        fileName,
      });

      return createSuccessResponse({
        fileName,
        fileContent,
        mimeType:
          query.format === ExportFormat.CSV ? MimeType.CSV : MimeType.XLSX,
        totalRecords: leadsData.length,
        exportedAt: new Date(),
      });
    } catch (error) {
      logger.error("Error exporting leads", error);
      return createErrorResponse(
        "leadsErrors.leadsExport.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      t("leads.export.headers.email"),
      t("leads.export.headers.businessName"),
      t("leads.export.headers.contactName"),
      t("leads.export.headers.phone"),
      t("leads.export.headers.website"),
      t("leads.export.headers.country"),
      t("leads.export.headers.language"),
      t("leads.export.headers.status"),
      t("leads.export.headers.source"),
      t("leads.export.headers.notes"),
      t("leads.export.headers.createdAt"),
      t("leads.export.headers.updatedAt"),
    ];

    if (includeEngagementData) {
      headers.push(
        t("leads.export.headers.emailsSent"),
        t("leads.export.headers.emailsOpened"),
        t("leads.export.headers.emailsClicked"),
        t("leads.export.headers.lastEmailSent"),
        t("leads.export.headers.lastEngagement"),
        t("leads.export.headers.unsubscribedAt"),
      );
    }

    if (includeMetadata) {
      headers.push(t("leads.export.headers.metadata"));
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
      status?: LeadStatusFilter;
      currentCampaignStage?: EmailCampaignStageFilter;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilter;
      sortBy?: LeadSortField[];
      sortOrder?: SortOrder[];
      scope?: BatchOperationScope;
      page?: number;
      pageSize?: number;
      updates: {
        status?: LeadStatus;
        currentCampaignStage?: EmailCampaignStage;
        source?: LeadSource;
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
      preview?: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatus;
        currentCampaignStage: EmailCampaignStage | null;
      }>;
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
      const conditions = [];

      // Convert filter values to database values
      const dbStatus = mapStatusFilter(status);
      const dbCampaignStage = mapCampaignStageFilter(currentCampaignStage);
      const dbSource = mapSourceFilter(source);
      // const dbCountry = convertCountryFilter(country);
      const dbCountry = country; // TODO: Fix type conversion
      // const dbLanguage = convertLanguageFilter(language);
      const dbLanguage = language; // TODO: Fix type conversion

      // Apply filters
      if (dbStatus !== null) {
        conditions.push(eq(leads.status, dbStatus));
      }

      if (dbCampaignStage !== null) {
        conditions.push(eq(leads.currentCampaignStage, dbCampaignStage));
      }

      if (dbSource !== null) {
        conditions.push(eq(leads.source, dbSource));
      }

      if (dbCountry !== null) {
        conditions.push(eq(leads.country, dbCountry));
      }

      if (dbLanguage !== null) {
        conditions.push(eq(leads.language, dbLanguage));
      }

      if (search) {
        const searchConditions = [
          ilike(leads.email, `%${search}%`),
          ilike(leads.businessName, `%${search}%`),
        ];
        if (leads.contactName) {
          searchConditions.push(ilike(leads.contactName, `%${search}%`));
        }
        conditions.push(or(...searchConditions));
      }

      // Build the query
      let query = db.select().from(leads);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      // Apply sorting
      let orderClause;
      const sortByField = sortBy[0] || LeadSortField.CREATED_AT;
      const sortDirection = sortOrder[0] || SortOrder.DESC;
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

        return createSuccessResponse({
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

      // Prepare update data
      const updateData: Partial<NewLead> = {
        updatedAt: new Date(),
      };

      // Only include non-null values in the update
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key in updateData) {
          (updateData as Record<keyof NewLead, NewLead[keyof NewLead]>)[
            key as keyof NewLead
          ] = value;
        }
      });

      // Use transaction for batch update
      await withTransaction(async (tx) => {
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
            logger.error("Error updating lead in batch", error, {
              leadId: lead.id,
            });
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

      return createSuccessResponse({
        success: true,
        totalMatched: matchingLeads.length,
        totalProcessed: matchingLeads.length,
        totalUpdated,
        errors,
      });
    } catch (error) {
      logger.error("Error in batch update", error);
      return createErrorResponse(
        "leadsErrors.batch.update.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Batch delete leads based on filter criteria
   */
  async batchDeleteLeads(
    data: {
      search?: string;
      status?: LeadStatusFilter;
      currentCampaignStage?: EmailCampaignStageFilter;
      country?: CountryFilter;
      language?: LanguageFilter;
      source?: LeadSourceFilter;
      sortBy?: LeadSortField[];
      sortOrder?: SortOrder[];
      scope?: BatchOperationScope;
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
      preview?: Array<{
        id: string;
        email: string | null;
        businessName: string;
        currentStatus: LeadStatus;
        currentCampaignStage: EmailCampaignStage | null;
      }>;
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
        return createErrorResponse(
          "leadsErrors.batch.update.error.validation.title",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Build the query using the same logic as list endpoint and batchUpdateLeads
      const conditions: SQL[] = [];

      // Convert filter values to database values (consistent with other methods)
      const dbStatus = mapStatusFilter(status);
      const dbCampaignStage = mapCampaignStageFilter(currentCampaignStage);
      const dbSource = mapSourceFilter(source);
      // const dbCountry = convertCountryFilter(country);
      const dbCountry = country; // TODO: Fix type conversion
      // const dbLanguage = convertLanguageFilter(language);
      const dbLanguage = language; // TODO: Fix type conversion

      logger.debug("Converted filter values", {
        originalFilters: {
          status,
          currentCampaignStage,
          country,
          language,
          source,
        },
        convertedFilters: {
          dbStatus,
          dbCampaignStage,
          dbCountry,
          dbLanguage,
          dbSource,
        },
      });

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

      // Apply filters using converted values (consistent with batchUpdateLeads and listLeads)
      if (dbStatus !== null) {
        conditions.push(eq(leads.status, dbStatus));
      }

      if (dbCampaignStage !== null) {
        conditions.push(eq(leads.currentCampaignStage, dbCampaignStage));
      }

      if (dbCountry !== null) {
        conditions.push(eq(leads.country, dbCountry));
      }

      if (dbLanguage !== null) {
        conditions.push(eq(leads.language, dbLanguage));
      }

      if (dbSource !== null) {
        conditions.push(eq(leads.source, dbSource));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      logger.debug("Applied filter conditions", {
        totalConditions: conditions.length,
        hasWhereClause: !!whereClause,
        appliedFilters: {
          hasSearch: !!search?.trim(),
          hasStatus: dbStatus !== null,
          hasCampaignStage: dbCampaignStage !== null,
          hasCountry: dbCountry !== null,
          hasLanguage: dbLanguage !== null,
          hasSource: dbSource !== null,
        },
      });

      // Apply sorting
      let orderClause;
      const sortByField = sortBy[0] || LeadSortField.CREATED_AT;
      const sortDirection = sortOrder[0] || SortOrder.DESC;
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

        return createSuccessResponse({
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
      await withTransaction(async (tx) => {
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
            logger.error("Error deleting lead in batch", error, {
              leadId: lead.id,
            });
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

      return createSuccessResponse({
        success: true,
        totalMatched: matchingLeads.length,
        totalProcessed: matchingLeads.length,
        totalDeleted,
        errors,
      });
    } catch (error) {
      logger.error("Error in batch delete", error);
      return createErrorResponse(
        "leadsErrors.batch.update.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const leadsRepository = new LeadsRepositoryImpl();
