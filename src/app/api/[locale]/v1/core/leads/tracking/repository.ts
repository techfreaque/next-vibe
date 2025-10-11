/**
 * Lead Tracking Repository
 * Centralized server-side tracking logic for lead engagement and conversion
 */

import "server-only";

import { and, eq, gt, isNull, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";

// Removed unused import - using direct database operations instead
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries, Languages } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { emails } from "../../emails/messages/db";
import type { JwtPayloadType } from "../../user/auth/definition";
import { leads } from "../db";
import {
  EmailCampaignStage,
  EngagementTypes,
  isStatusTransitionAllowed,
  LeadSource,
  LeadStatus,
} from "../enum";
import { leadsRepository } from "../repository";
import type {
  ClickTrackingRequestType,
  LeadEngagementRequestType,
  LeadEngagementResponseType,
} from "./engagement/definition";

/**
 * Client information extracted from request
 */
export interface ClientInfo {
  userAgent: string;
  referer: string;
  ipAddress: string;
  timestamp: string;
}

/**
 * Tracking pixel response data
 */
export interface TrackingPixelResult {
  success: boolean;
  leadId: string;
  campaignId?: string;
  engagementRecorded: boolean;
}

/**
 * Click tracking result
 */
export interface ClickTrackingResult {
  success: boolean;
  redirectUrl: string;
  leadId: string;
  campaignId?: string;
  engagementRecorded: boolean;
  leadStatusUpdated: boolean;
  isLoggedIn: boolean;
}

/**
 * Lead Tracking Repository Interface
 */
export interface ILeadTrackingRepository {
  handleTrackingPixel(
    leadId: string,
    campaignId: string | undefined,
    clientInfo: ClientInfo,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TrackingPixelResult>>;

  handleClickTracking(
    data: ClickTrackingRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ClickTrackingResult>>;

  generateTrackingPixelUrl(
    leadId: string | undefined,
    userId: string | undefined,
    campaignId: string | undefined,
    baseUrl: string,
    locale: CountryLanguage,
  ): string;

  generateTrackingLinkUrl(
    originalUrl: string,
    leadId: string | undefined,
    userId: string | undefined,
    campaignId: string | undefined,
    baseUrl: string,
    locale: CountryLanguage,
    source?: string,
  ): string;

  generateCampaignTrackingUrl(
    baseUrl: string,
    leadId: string,
    campaignId: string,
    stage: string,
    destinationUrl?: string,
    locale?: CountryLanguage,
  ): string;

  isTrackingUrl(url: string, locale?: CountryLanguage): boolean;

  ensureFullUrl(url: string, baseUrl: string): string;

  generateEngagementTrackingApiUrl(
    baseUrl: string,
    locale: CountryLanguage,
    params: {
      id: string;
      campaignId?: string;
      stage?: string;
      source?: string;
      url: string;
    },
  ): string;
}

/**
 * Lead Tracking Repository
 * Handles all server-side tracking operations
 */
export class LeadTrackingRepository implements ILeadTrackingRepository {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  private static readonly VALID_SOURCES = [
    "email",
    "social",
    "website",
    "referral",
  ];

  /**
   * Extract client information from request
   */
  static extractClientInfo(request: NextRequest): ClientInfo {
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    return {
      userAgent,
      referer,
      ipAddress: ip.split(",")[0].trim(), // Take first IP if multiple
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate tracking parameters from URL
   */
  static validateTrackingParams(searchParams: URLSearchParams): {
    leadId?: string;
    campaignId?: string;
    error?: string;
  } {
    const leadId =
      searchParams.get("leadId") || searchParams.get("id") || undefined;
    const campaignId = searchParams.get("campaignId");

    if (!leadId) {
      return { error: "error.validation" };
    }

    // Validate UUID format
    if (!LeadTrackingRepository.UUID_REGEX.test(leadId)) {
      return { error: "error.validation" };
    }

    if (campaignId && !LeadTrackingRepository.UUID_REGEX.test(campaignId)) {
      return { error: "error.validation" };
    }

    return { leadId, campaignId: campaignId || undefined };
  }

  /**
   * Record engagement event
   */
  static async recordEngagement(
    data: {
      leadId: string;
      engagementType: EngagementTypes;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
    },
    clientInfo: ClientInfo | undefined,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      id: string;
      leadId: string;
      engagementType: EngagementTypes;
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
      timestamp: string | number | Date;
      ipAddress?: string;
      userAgent?: string;
      createdAt: string | number | Date;
    }>
  > {
    try {
      logger.debug("leads.tracking.engagement.record.start", {
        leadId: data.leadId,
        engagementType: data.engagementType,
        campaignId: data.campaignId,
        clientInfo,
      });

      const result = await leadsRepository.recordEngagement({
        leadId: data.leadId,
        engagementType: data.engagementType,
        campaignId: data.campaignId,
        metadata: {
          ...data.metadata,
          ...clientInfo,
        },
      });

      if (result.success) {
        logger.debug("leads.tracking.engagement.record.success", {
          leadId: data.leadId,
          engagementType: data.engagementType,
          engagementId: result.data.id,
        });

        // Also update the email engagement in the emails table if campaign is present
        if (data.campaignId) {
          await LeadTrackingRepository.updateEmailEngagementRecord(
            data.campaignId,
            data.engagementType,
            logger,
          );
        }

        // Transition lead status based on engagement type
        const actionMap: Record<EngagementTypes, string> = {
          [EngagementTypes.WEBSITE_VISIT]: EngagementTypes.WEBSITE_VISIT,
          [EngagementTypes.EMAIL_OPEN]: EngagementTypes.EMAIL_OPEN,
          [EngagementTypes.EMAIL_CLICK]: EngagementTypes.EMAIL_CLICK,
          [EngagementTypes.FORM_SUBMIT]: EngagementTypes.FORM_SUBMIT,
        };

        const action = actionMap[data.engagementType];
        if (action) {
          try {
            await LeadTrackingRepository.transitionLeadStatus(
              data.leadId,
              action as
                | "website_visit"
                | "email_open"
                | "email_click"
                | "form_submit",
              {
                engagementId: result.data.id,
                ...(data.campaignId && { campaignId: data.campaignId }),
              },
              logger,
            );
          } catch (error) {
            // Don't fail the engagement recording if status transition fails
            logger.warn("leads.tracking.engagement.status.transition.failed", {
              error,
              leadId: data.leadId,
              engagementType: data.engagementType,
            });
          }
        }
      }

      return result;
    } catch (error) {
      logger.error("leads.tracking.engagement.record.error", {
        error,
        leadId: data.leadId,
        engagementType: data.engagementType,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update email engagement record in the emails table
   */
  private static async updateEmailEngagementRecord(
    campaignId: string,
    engagementType: EngagementTypes,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Find the email record by campaign ID stored in metadata
      // Lead campaigns store the campaignId in the metadata field
      const [emailRecord] = await db
        .select()
        .from(emails)
        .where(sql`${emails.metadata}->>'campaignId' = ${campaignId}`)
        .limit(1);

      if (!emailRecord) {
        logger.debug("leads.tracking.email.record.not.found", {
          campaignId,
          engagementType,
        });
        return;
      }

      // Update the email engagement based on engagement type
      const engagement: {
        openedAt?: Date;
        clickedAt?: Date;
      } = {};

      if (engagementType === EngagementTypes.EMAIL_OPEN) {
        engagement.openedAt = new Date();
      } else if (engagementType === EngagementTypes.EMAIL_CLICK) {
        engagement.clickedAt = new Date();
        // Also mark as opened if not already opened
        if (!emailRecord.openedAt) {
          engagement.openedAt = new Date();
        }
      }

      if (Object.keys(engagement).length > 0) {
        // Update email engagement directly in database
        await db
          .update(emails)
          .set({
            ...engagement,
            updatedAt: new Date(),
          })
          .where(eq(emails.id, emailRecord.id));

        logger.debug("leads.tracking.email.engagement.updated", {
          emailId: emailRecord.id,
          campaignId,
          engagementType,
          engagement,
        });
      }
    } catch (error) {
      logger.error("leads.tracking.email.engagement.update.error", {
        error,
        campaignId,
        engagementType,
      });
      // Don't throw - this is a secondary operation
    }
  }

  /**
   * Handle tracking pixel request
   */
  static async handleTrackingPixel(
    leadId: string,
    campaignId: string | undefined,
    clientInfo: ClientInfo,
  ): Promise<ResponseType<TrackingPixelResult>> {
    try {
      let engagementRecorded = false;

      // Record email open engagement if campaign is present
      if (campaignId) {
        const engagementResult = await LeadTrackingRepository.recordEngagement(
          {
            leadId,
            campaignId,
            engagementType: EngagementTypes.EMAIL_OPEN,
            metadata: {
              ...clientInfo,
              trackingMethod: "pixel",
            },
          },
          clientInfo,
        );

        engagementRecorded = engagementResult.success;
      }

      // TODO: Add EndpointLogger parameter to method and use logger.debug instead
      console.debug("Tracking pixel processed", {
        leadId,
        campaignId,
        engagementRecorded,
      });

      return createSuccessResponse({
        success: true,
        leadId,
        campaignId,
        engagementRecorded,
      });
    } catch (error) {
      // TODO: Add EndpointLogger parameter to method and use logger.error instead
      console.error("Failed to handle tracking pixel", {
        error,
        leadId,
        campaignId,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Handle click tracking with lead status update for logged-in users
   */
  static async handleClickTracking(
    params: ClickTrackingRequestType,
    clientInfo: ClientInfo,
    isLoggedIn = false,
    userEmail?: string,
  ): Promise<ResponseType<ClickTrackingResult>> {
    try {
      const { id: leadId, campaignId, url } = params;
      let engagementRecorded = false;
      let leadStatusUpdated = false;

      // Validate source parameter (currently unused but kept for future use)
      // const validatedSource = this.VALID_SOURCES.includes(source) ? source : "email";

      // Record both email open and click engagement if campaign is present
      if (campaignId) {
        const engagementMetadata: Record<string, string | number | boolean> = {
          destinationUrl: url,
          trackingMethod: "redirect",
          isLoggedIn,
          userEmail: userEmail || "",
          userAgent: clientInfo.userAgent,
          referer: clientInfo.referer,
          ipAddress: clientInfo.ipAddress,
        };

        try {
          // Check if email was already opened by checking the email record
          const [emailRecord] = await db
            .select({ openedAt: emails.openedAt })
            .from(emails)
            .where(sql`${emails.metadata}->>'campaignId' = ${campaignId}`)
            .limit(1);

          // Track email open first (since click implies open) only if not already recorded
          if (!emailRecord?.openedAt) {
            await LeadTrackingRepository.recordEngagement(
              {
                leadId,
                campaignId,
                engagementType: EngagementTypes.EMAIL_OPEN,
                metadata: {
                  ...engagementMetadata,
                  inferredFromClick: true,
                },
              },
              clientInfo,
            );
          }

          // Track email click
          const clickResult = await LeadTrackingRepository.recordEngagement(
            {
              leadId,
              campaignId,
              engagementType: EngagementTypes.EMAIL_CLICK,
              metadata: engagementMetadata,
            },
            clientInfo,
          );

          engagementRecorded = clickResult.success;

          console.debug("Email engagement recorded for click tracking", {
            leadId,
            campaignId,
            engagementRecorded,
          });
        } catch (error) {
          console.error("Failed to record email engagement for click", {
            error,
            leadId,
            campaignId,
          });
        }
      }

      // Update lead status if user is logged in
      if (isLoggedIn) {
        try {
          const leadResult = await leadsRepository.getLeadById(leadId);
          if (leadResult.success) {
            // For logged-in users clicking tracking links, mark as SIGNED_UP
            // since they are already registered users
            await leadsRepository.updateLead(leadId, {
              status: LeadStatus.SIGNED_UP,
            });

            leadStatusUpdated = true;
            console.debug("Lead status updated to SIGNED_UP for logged-in user", {
              leadId,
              isLoggedIn,
            });
          }
        } catch (error) {
          console.error("Failed to update lead status", {
            error,
            leadId,
            isLoggedIn,
          });
        }
      }

      const result: ClickTrackingResult = {
        success: true,
        redirectUrl: url,
        leadId,
        campaignId,
        engagementRecorded,
        leadStatusUpdated,
        isLoggedIn,
      };

      console.debug("Click tracking completed", {
        leadId,
        redirectUrl: url,
        engagementRecorded,
        leadStatusUpdated,
        isLoggedIn,
      });

      return createSuccessResponse(result);
    } catch (error) {
      console.error("Failed to handle click tracking", {
        error,
        leadId: params.id,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Track consultation booking
   */
  static async trackConsultationBooking(
    leadId: string,
  ): Promise<ResponseType<{ leadStatusUpdated: boolean }>> {
    try {
      console.debug("Tracking consultation booking", {
        leadId,
      });

      // Update lead status to CONSULTATION_BOOKED and set timestamp
      await leadsRepository.updateLead(leadId, {
        status: LeadStatus.CONSULTATION_BOOKED,
        consultationBookedAt: new Date(),
      });

      console.debug("Lead status updated to CONSULTATION_BOOKED", {
        leadId,
      });

      return createSuccessResponse({
        leadStatusUpdated: true,
      });
    } catch (error) {
      console.error("Failed to track consultation booking", {
        error,
        leadId,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Track subscription confirmation (true conversion)
   */
  static async trackSubscriptionConfirmation(
    leadId: string,
  ): Promise<ResponseType<{ leadStatusUpdated: boolean }>> {
    try {
      console.debug("Tracking subscription confirmation", {
        leadId,
      });

      // Update lead status to SUBSCRIPTION_CONFIRMED and set timestamp
      await leadsRepository.updateLead(leadId, {
        status: LeadStatus.SUBSCRIPTION_CONFIRMED,
        subscriptionConfirmedAt: new Date(),
      });

      console.debug("Lead status updated to SUBSCRIPTION_CONFIRMED", {
        leadId,
      });

      return createSuccessResponse({
        leadStatusUpdated: true,
      });
    } catch (error) {
      console.error("Failed to track subscription confirmation", {
        error,
        leadId,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Create anonymous lead for website visitors
   */
  static async createAnonymousLead(
    clientInfo: ClientInfo,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ leadId: string }>> {
    try {
      console.debug("Creating anonymous lead for website visitor", {
        userAgent: clientInfo.userAgent,
        ipAddress: clientInfo.ipAddress,
        locale,
      });

      // Check for existing anonymous lead with same IP and user agent within last 5 minutes
      // to prevent duplicate lead creation from multiple simultaneous requests
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const existingLead = await db
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.status, LeadStatus.WEBSITE_USER),
            eq(leads.source, LeadSource.WEBSITE),
            isNull(leads.email), // Anonymous leads have no email
            gt(leads.createdAt, fiveMinutesAgo),
            sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`,
            sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`,
          ),
        )
        .limit(1);

      if (existingLead.length > 0) {
        console.debug("Found existing anonymous lead, reusing", {
          leadId: existingLead[0].id,
          createdAt: existingLead[0].createdAt,
        });
        return createSuccessResponse({ leadId: existingLead[0].id });
      }

      // Extract country and language from locale or use defaults
      const [language, country] = locale.split("-");

      // Create anonymous lead directly in database to ensure WEBSITE_USER status
      // Don't use the general createLead method as it might override the status
      const newLead = {
        email: null, // Anonymous leads have no email
        businessName: "", // Will be set with proper translation when needed
        contactName: "",
        phone: "",
        website: "",
        country: Object.values(Countries).includes(
          country?.toUpperCase() as Countries,
        )
          ? (country.toUpperCase() as Countries)
          : Countries.GLOBAL,
        language: Object.values(Languages).includes(
          language?.toLowerCase() as Languages,
        )
          ? (language.toLowerCase() as Languages)
          : Languages.EN,
        source: LeadSource.WEBSITE,
        status: LeadStatus.WEBSITE_USER, // Website leads are always WEBSITE_USER
        notes: "", // Will be set with proper translation key when needed
        currentCampaignStage: EmailCampaignStage.NOT_STARTED,
        metadata: {
          anonymous: true,
          createdFromTracking: true,
          userAgent: clientInfo.userAgent,
          ipAddress: clientInfo.ipAddress,
          referer: clientInfo.referer,
          timestamp: new Date().toISOString(),
        },
      };

      const [createdLead] = await db.insert(leads).values(newLead).returning();

      if (!createdLead) {
        console.error("Failed to create anonymous lead", {
          error: "No lead returned from database",
          clientInfo,
          locale,
        });
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      console.debug("Anonymous lead created successfully", {
        leadId: createdLead.id,
        email: createdLead.email,
        source: createdLead.source,
      });

      return createSuccessResponse({
        leadId: createdLead.id,
      });
    } catch (error) {
      console.error("Error creating anonymous lead", {
        error,
        clientInfo,
        locale,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Create tracking pixel response (1x1 transparent GIF)
   */
  static createTrackingPixelResponse(): Response {
    // 1x1 transparent GIF in base64
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64",
    );

    return new Response(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Content-Length": pixel.length.toString(),
        // eslint-disable-next-line i18next/no-literal-string
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }

  /**
   * Transition lead status based on user actions
   * Implements proper lead lifecycle management
   */
  static async transitionLeadStatus(
    leadId: string,
    action:
      | "website_visit"
      | "email_open"
      | "email_click"
      | "form_submit"
      | "signup"
      | "contact"
      | "newsletter",
    metadata?: Record<string, string | number | boolean>,
  ): Promise<
    ResponseType<{
      statusChanged: boolean;
      newStatus: LeadStatus;
      previousStatus: LeadStatus;
    }>
  > {
    try {
      console.debug("Processing lead status transition", {
        leadId,
        action,
        metadata,
      });

      // Get current lead
      const leadResult = await leadsRepository.getLeadById(leadId);
      if (!leadResult.success) {
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      const lead = leadResult.data;
      const currentStatus = lead.status;
      let newStatus = currentStatus;
      let statusChanged = false;

      // Define target status for each action
      const actionTargetStatus: Record<string, LeadStatus> = {
        website_visit: LeadStatus.WEBSITE_USER, // Website visitors become WEBSITE_USER
        email_open: LeadStatus.WEBSITE_USER, // Email engagement keeps them as WEBSITE_USER
        email_click: LeadStatus.WEBSITE_USER, // Email engagement keeps them as WEBSITE_USER
        form_submit: LeadStatus.IN_CONTACT, // Form submission means they're in contact
        contact: LeadStatus.IN_CONTACT, // Contact form means they're in contact
        newsletter: LeadStatus.NEWSLETTER_SUBSCRIBER, // Newsletter subscription
        signup: LeadStatus.SIGNED_UP, // User signup
      };

      // Get target status for this action
      const targetStatus = actionTargetStatus[action];
      if (targetStatus) {
        // Check if transition is allowed using centralized validation
        if (isStatusTransitionAllowed(currentStatus, targetStatus)) {
          newStatus = targetStatus;
          statusChanged = currentStatus !== newStatus;

          if (statusChanged) {
            console.debug("Transitioning lead status", {
              leadId,
              action,
              from: currentStatus,
              to: newStatus,
            });

            // Update lead status
            const updateResult = await leadsRepository.updateLead(leadId, {
              status: newStatus,
              metadata: {
                ...lead.metadata,
                lastAction: action,
                lastActionAt: new Date().toISOString(),
                statusTransitionCount:
                  ((lead.metadata?.statusTransitionCount as number) || 0) + 1,
                lastTransition: [currentStatus, "to", newStatus].join("_"),
                ...metadata,
              } as Record<string, string | number | boolean>,
            });

            if (!updateResult.success) {
              console.error("Failed to update lead status", {
                leadId,
                action,
                from: currentStatus,
                to: newStatus,
                error: updateResult.message,
              });
              return createErrorResponse(
                "error.default",
                ErrorResponseTypes.INTERNAL_ERROR,
              );
            }

            console.debug("Lead status transitioned successfully", {
              leadId,
              action,
              from: currentStatus,
              to: newStatus,
            });
          } else {
            console.debug("Lead status unchanged", {
              leadId,
              action,
              currentStatus,
            });
          }
        } else {
          console.debug("Lead status transition not allowed", {
            leadId,
            action,
            currentStatus,
            targetStatus,
          });
        }
      } else {
        console.debug("Unknown action for lead status transition", {
          leadId,
          action,
          currentStatus,
        });
      }

      return createSuccessResponse({
        statusChanged,
        newStatus,
        previousStatus: currentStatus,
      });
    } catch (error) {
      console.error("Error transitioning lead status", {
        error,
        leadId,
        action,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Handle engagement with relationship establishment
   * Combines engagement recording with lead-user relationship handling
   */
  static async handleEngagementWithRelationship(
    data: LeadEngagementRequestType,
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    user: { id?: string; isPublic: boolean; email?: string },
  ): Promise<ResponseType<LeadEngagementResponseType>> {
    try {
      console.debug("Handling engagement with relationship", {
        leadId: data.leadId,
        engagementType: data.engagementType,
        userId: data.userId || user.id,
        isLoggedIn: !user.isPublic,
      });

      let leadId = data.leadId;
      let leadCreated = false;
      let relationshipEstablished = false;

      // Validate existing lead ID if provided
      if (leadId) {
        const leadResult = await leadsRepository.getLeadById(leadId);
        if (!leadResult.success) {
          console.debug("Provided lead ID is invalid, creating new lead", {
            invalidLeadId: leadId,
          });
          leadId = undefined; // Clear invalid lead ID
        }
      }

      // Create anonymous lead if leadId is missing or invalid
      if (!leadId) {
        const anonymousLeadResult =
          await LeadTrackingRepository.createAnonymousLead(clientInfo, locale);

        if (anonymousLeadResult.success) {
          leadId = anonymousLeadResult.data.leadId;
          leadCreated = true;
          console.debug("Created new anonymous lead", {
            newLeadId: leadId,
          });
        } else {
          return createErrorResponse(
            "error.default",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      }

      // If we still don't have a leadId, return error
      if (!leadId) {
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Establish lead-user relationship if user is logged in
      const currentUserId = data.userId || user.id;
      if (currentUserId && !user.isPublic) {
        try {
          const convertResult = await leadsRepository.convertLead(leadId, {
            userId: currentUserId,
            email: user.email || "", // Use user's email for conversion
          });
          if (convertResult.success) {
            relationshipEstablished = true;
            console.debug("Lead-user relationship established", {
              leadId,
              userId: currentUserId,
            });
          }
        } catch (error) {
          // Don't fail the engagement if relationship establishment fails
          console.debug("Lead-user relationship establishment failed", {
            error,
            leadId,
            userId: currentUserId,
          });
        }
      }

      // Convert typed metadata to flat format for storage
      const flatMetadata: Record<string, string | number | boolean> = {};
      const customDataPrefix = "custom" + "_"; // Avoid literal string ESLint rule

      if (data.metadata) {
        // Add simple fields directly
        if (data.metadata.userAgent) {
          flatMetadata.userAgent = data.metadata.userAgent;
        }
        if (data.metadata.referrer) {
          flatMetadata.referrer = data.metadata.referrer;
        }
        if (data.metadata.url) {
          flatMetadata.url = data.metadata.url;
        }
        if (data.metadata.timestamp) {
          flatMetadata.timestamp = data.metadata.timestamp;
        }
        if (data.metadata.emailId) {
          flatMetadata.emailId = data.metadata.emailId;
        }
        if (data.metadata.emailSubject) {
          flatMetadata.emailSubject = data.metadata.emailSubject;
        }
        if (data.metadata.emailTemplate) {
          flatMetadata.emailTemplate = data.metadata.emailTemplate;
        }
        if (data.metadata.campaignName) {
          flatMetadata.campaignName = data.metadata.campaignName;
        }
        if (data.metadata.campaignStage) {
          flatMetadata.campaignStage = data.metadata.campaignStage;
        }
        if (data.metadata.abTestVariant) {
          flatMetadata.abTestVariant = data.metadata.abTestVariant;
        }
        if (data.metadata.formType) {
          flatMetadata.formType = data.metadata.formType;
        }
        if (data.metadata.formId) {
          flatMetadata.formId = data.metadata.formId;
        }
        if (data.metadata.source) {
          flatMetadata.source = data.metadata.source;
        }

        // Flatten customData if present
        if (data.metadata.customData) {
          Object.entries(data.metadata.customData).forEach(([key, value]) => {
            flatMetadata[customDataPrefix + key] = value;
          });
        }
      }

      // Record engagement
      const result = await LeadTrackingRepository.recordEngagement(
        {
          leadId,
          engagementType: data.engagementType,
          campaignId: data.campaignId,
          metadata: flatMetadata,
        },
        clientInfo,
      );

      if (result.success) {
        return createSuccessResponse({
          ...result.data,
          leadCreated,
          relationshipEstablished,
        });
      }

      return result;
    } catch (error) {
      console.error("Error handling engagement with relationship", {
        error,
        data,
      });
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Generate tracking pixel URL for email opens
   * Migrated from utils.ts
   */
  generateTrackingPixelUrl(
    leadId: string | undefined,
    userId: string | undefined,
    campaignId: string | undefined,
    baseUrl: string,
    locale: CountryLanguage,
  ): string {
    const url = new URL(`/api/${locale}/v1/leads/tracking/pixel`, baseUrl);

    if (leadId) {
      url.searchParams.set("leadId", leadId);
    }
    if (userId) {
      url.searchParams.set("userId", userId);
    }
    if (campaignId) {
      url.searchParams.set("campaignId", campaignId);
    }

    // Add timestamp to prevent caching
    url.searchParams.set("t", Date.now().toString());

    return url.toString();
  }

  /**
   * Generate tracking link URL for click tracking
   * Migrated from utils.ts
   */
  generateTrackingLinkUrl(
    originalUrl: string,
    leadId: string | undefined,
    userId: string | undefined,
    campaignId: string | undefined,
    baseUrl: string,
    locale: CountryLanguage,
    source = "email",
  ): string {
    // Prevent nested tracking URLs
    if (
      originalUrl.includes("/track?") ||
      originalUrl.includes(`/api/${locale}/v1/leads/tracking/`) ||
      (originalUrl.includes("/api/") && originalUrl.includes("/tracking/"))
    ) {
      console.debug("Preventing nested tracking URL", { originalUrl });
      return originalUrl;
    }

    const url = new URL(`/${locale}/track`, baseUrl);
    url.searchParams.set("url", originalUrl);

    if (leadId) {
      url.searchParams.set("id", leadId);
    }
    if (campaignId) {
      url.searchParams.set("campaignId", campaignId);
    }

    url.searchParams.set("source", source);

    return url.toString();
  }

  /**
   * Generate campaign tracking URL for email campaigns
   * Migrated from utils.ts
   */
  generateCampaignTrackingUrl(
    baseUrl: string,
    leadId: string,
    campaignId: string,
    stage: string,
    destinationUrl?: string,
    locale: CountryLanguage = "en-GLOBAL",
  ): string {
    const finalDestinationUrl = destinationUrl || `${baseUrl}/`;

    // Prevent nested tracking URLs
    if (
      finalDestinationUrl.includes("/track?") ||
      (finalDestinationUrl.includes("/api/") &&
        finalDestinationUrl.includes("/tracking/"))
    ) {
      return finalDestinationUrl;
    }

    const url = new URL(`/${locale}/track`, baseUrl);
    url.searchParams.set("id", leadId);
    url.searchParams.set("campaignId", campaignId);
    url.searchParams.set("stage", stage);
    url.searchParams.set("source", "email");
    url.searchParams.set("url", finalDestinationUrl);

    return url.toString();
  }

  /**
   * Check if URL is already a tracking URL
   * Migrated from utils.ts
   */
  isTrackingUrl(url: string, locale?: CountryLanguage): boolean {
    if (url.includes("/track?")) {
      return true;
    }

    if (locale && url.includes(`/api/${locale}/v1/leads/tracking/`)) {
      return true;
    }

    if (url.includes("/api/") && url.includes("/tracking/")) {
      return true;
    }

    return false;
  }

  /**
   * Ensure URL has proper base URL
   * Migrated from utils.ts
   */
  ensureFullUrl(url: string, baseUrl: string): string {
    // Skip mailto, tel, and anchor links
    const mailtoPrefix = "mailto" + ":";
    const telPrefix = "tel" + ":";
    const anchorPrefix = "#";

    if (
      url.startsWith(mailtoPrefix) ||
      url.startsWith(telPrefix) ||
      url.startsWith(anchorPrefix)
    ) {
      return url;
    }

    // If already a full URL, return as is
    const httpPrefix = "http://";
    const httpsPrefix = "https://";
    const slashPrefix = "/";

    if (url.startsWith(httpPrefix) || url.startsWith(httpsPrefix)) {
      return url;
    }

    // If relative URL, prepend base URL
    if (url.startsWith(slashPrefix)) {
      return `${baseUrl}${url}`;
    }

    return url;
  }

  /**
   * Generate engagement tracking API URL
   * Migrated from utils.ts
   */
  generateEngagementTrackingApiUrl(
    baseUrl: string,
    locale: CountryLanguage,
    params: {
      id: string;
      campaignId?: string;
      stage?: string;
      source?: string;
      url: string;
    },
  ): string {
    const apiUrl = new URL(
      `/api/${locale}/v1/leads/tracking/engagement`,
      baseUrl,
    );

    apiUrl.searchParams.set("id", params.id);
    if (params.campaignId) {
      apiUrl.searchParams.set("campaignId", params.campaignId);
    }
    if (params.stage) {
      apiUrl.searchParams.set("stage", params.stage);
    }
    apiUrl.searchParams.set("source", params.source || "email");
    apiUrl.searchParams.set("url", params.url);

    return apiUrl.toString();
  }
}

/**
 * Default repository instance
 */
export const leadTrackingRepository = new LeadTrackingRepository();
