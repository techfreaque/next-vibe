/**
 * Lead Tracking Repository
 * Centralized server-side tracking logic for lead engagement and conversion
 */

import "server-only";

import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import type { NextRequest } from "next-vibe-ui/lib/request";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

// Removed unused import - using direct database operations instead
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
} from "@/i18n/core/language-utils";

import { emails } from "../../messenger/messages/db";
import { ReferralRepository } from "../../referral/repository";
import type { JwtPayloadType } from "../../user/auth/types";
import { LeadAuthRepository } from "../auth/repository";
import { leads } from "../db";
import {
  DeviceType,
  EmailCampaignStage,
  EngagementTypes,
  isStatusTransitionAllowed,
  LeadSource,
  LeadStatus,
} from "../enum";
import { scopedTranslation } from "../i18n";
import type { LeadsT } from "../i18n";
import { LeadsRepository } from "../repository";
import type {
  ClickTrackingRequestOutput,
  ClickTrackingResponseOutput,
  LeadEngagementRequestOutput,
  LeadEngagementResponseOutput,
} from "./engagement/definition";

interface AnonymousLeadResult {
  leadId: string;
}

/**
 * Handles all server-side tracking operations
 */
export class LeadTrackingRepository {
  /**
   * Helper to safely extract number from metadata
   */
  private static getMetadataNumber(
    meta: Record<string, string | number | boolean> | undefined,
    key: string,
  ): number {
    if (!meta) {
      return 0;
    }
    const value = meta[key];
    return typeof value === "number" ? value : 0;
  }

  /**
   * Parse basic device type, browser and OS from user agent string
   */
  private static parseUserAgent(userAgent: string): {
    deviceType: (typeof DeviceType)[keyof typeof DeviceType];
    browser: string;
    os: string;
  } {
    const ua = userAgent.toLowerCase();

    // Device type detection
    let deviceType: (typeof DeviceType)[keyof typeof DeviceType] =
      DeviceType.UNKNOWN;
    if (
      ua.includes("bot") ||
      ua.includes("crawler") ||
      ua.includes("spider") ||
      ua.includes("googlebot") ||
      ua.includes("bingbot") ||
      ua.includes("slurp") ||
      ua.includes("duckduckbot") ||
      ua.includes("baidu") ||
      ua.includes("yandex")
    ) {
      deviceType = DeviceType.BOT;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      deviceType = DeviceType.TABLET;
    } else if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("ipod") ||
      ua.includes("blackberry") ||
      ua.includes("windows phone")
    ) {
      deviceType = DeviceType.MOBILE;
    } else if (ua.length > 0) {
      deviceType = DeviceType.DESKTOP;
    }

    // Browser detection
    let browser = "Unknown";
    if (ua.includes("firefox")) {
      browser = "Firefox";
    } else if (ua.includes("edg/")) {
      browser = "Edge";
    } else if (ua.includes("opr/") || ua.includes("opera")) {
      browser = "Opera";
    } else if (ua.includes("chrome") && !ua.includes("chromium")) {
      browser = "Chrome";
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
      browser = "Safari";
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      browser = "Internet Explorer";
    }

    // OS detection
    let os = "Unknown";
    if (ua.includes("windows nt")) {
      os = "Windows";
    } else if (ua.includes("mac os x") || ua.includes("macos")) {
      os = "macOS";
    } else if (ua.includes("android")) {
      os = "Android";
    } else if (
      ua.includes("ios") ||
      ua.includes("iphone") ||
      ua.includes("ipad")
    ) {
      os = "iOS";
    } else if (ua.includes("linux")) {
      os = "Linux";
    } else if (ua.includes("cros")) {
      os = "ChromeOS";
    }

    return { deviceType, browser, os };
  }

  /**
   * Extract client information from request
   */
  static extractClientInfo(request: NextRequest | undefined): {
    userAgent: string;
    referer: string;
    ipAddress: string;
    timestamp: string;
  } {
    if (!request) {
      return {
        userAgent: "cli",
        referer: "",
        ipAddress: "cli",
        timestamp: new Date().toISOString(),
      };
    }

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
   * Record engagement event
   * Returns LeadEngagementResponseOutput from definition
   */
  private static async recordEngagement(
    data: {
      leadId: string;
      engagementType: (typeof EngagementTypes)[keyof typeof EngagementTypes];
      campaignId?: string;
      metadata?: Record<string, string | number | boolean>;
    },
    clientInfo:
      | {
          userAgent: string;
          referer: string;
          ipAddress: string;
          timestamp: string;
        }
      | undefined,
    t: LeadsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>> {
    try {
      logger.debug(
        `Engagement: ${data.engagementType} for lead ${data.leadId}${data.campaignId ? ` campaign ${data.campaignId}` : ""}`,
      );

      const result = await LeadsRepository.recordEngagementInternal(
        {
          leadId: data.leadId,
          engagementType: data.engagementType,
          campaignId: data.campaignId,
          metadata: {
            ...data.metadata,
            ...clientInfo,
          },
        },
        logger,
        t,
      );

      if (!result.success || !result.data) {
        return result.success
          ? fail({
              message: t("tracking.errors.default"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            })
          : result;
      }

      // Type guard: result is now success response with data
      const engagementData = result.data;

      logger.debug(`Engagement recorded: ${engagementData.id}`);

      // Also update the email engagement in the emails table if campaign is present
      if (data.campaignId) {
        await this.updateEmailEngagementRecord(
          data.campaignId,
          data.engagementType,
          logger,
        );
      }

      // Transition lead status based on engagement type
      // Note: Not all engagement types trigger status transitions (e.g., LEAD_ATTRIBUTION)
      const actionMap: Partial<
        Record<
          (typeof EngagementTypes)[keyof typeof EngagementTypes],
          "website_visit" | "email_open" | "email_click" | "form_submit"
        >
      > = {
        [EngagementTypes.WEBSITE_VISIT]: "website_visit",
        [EngagementTypes.EMAIL_OPEN]: "email_open",
        [EngagementTypes.EMAIL_CLICK]: "email_click",
        [EngagementTypes.FORM_SUBMIT]: "form_submit",
        // LEAD_ATTRIBUTION intentionally omitted - no status transition needed
      };

      const action = actionMap[data.engagementType];
      if (action) {
        try {
          await this.transitionLeadStatus(data.leadId, action, t, logger, {
            engagementId: engagementData.id,
            ...(data.campaignId && { campaignId: data.campaignId }),
          });
        } catch (error) {
          // Don't fail the engagement recording if status transition fails
          logger.warn(
            "Engagement status transition failed",
            parseError(error).message,
          );
        }
      }

      // Return properly formatted response matching LeadEngagementResponseOutput
      return success({
        id: engagementData.id,
        responseLeadId: data.leadId,
        responseEngagementType: data.engagementType,
        responseCampaignId: data.campaignId,
        responseMetadata: data.metadata,
        timestamp: engagementData.timestamp,
        ipAddress: clientInfo?.ipAddress,
        userAgent: clientInfo?.userAgent,
        createdAt: engagementData.createdAt,
      });
    } catch (error) {
      logger.error("Engagement record error", parseError(error).message);
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update email engagement record in the emails table
   */
  private static async updateEmailEngagementRecord(
    campaignId: string,
    engagementType: (typeof EngagementTypes)[keyof typeof EngagementTypes],
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
        logger.debug(`Email record not found for campaign ${campaignId}`);
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

        logger.debug(
          `Email engagement ${engagementType} for campaign ${campaignId}`,
        );
      }
    } catch (error) {
      logger.error("Email engagement update error", parseError(error).message);
      // Don't throw - this is a secondary operation
    }
  }

  /**
   * Create anonymous lead for website visitors
   */
  private static async createAnonymousLead(
    clientInfo: {
      userAgent: string;
      referer: string;
      ipAddress: string;
      timestamp: string;
    },
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: LeadsT,
  ): Promise<ResponseType<AnonymousLeadResult>> {
    try {
      logger.debug("Creating anonymous lead for tracking", {
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
            // Check new typed columns first, fall back to metadata JSONB for old rows
            or(
              and(
                eq(leads.ipAddress, clientInfo.ipAddress),
                eq(leads.userAgent, clientInfo.userAgent),
              ),
              and(
                sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`,
                sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`,
              ),
            ),
          ),
        )
        .limit(1);

      if (existingLead.length > 0) {
        logger.debug(`Reusing anonymous lead ${existingLead[0].id}`);
        return success({ leadId: existingLead[0].id });
      }

      // Extract country and language from locale
      const country = getCountryFromLocale(locale);
      const language = getLanguageFromLocale(locale);

      const parsedDevice = LeadTrackingRepository.parseUserAgent(
        clientInfo.userAgent,
      );

      const newLead = {
        email: `anonymous-${crypto.randomUUID()}@tracking.local`,
        businessName: "",
        contactName: "",
        phone: "",
        website: "",
        country,
        language,
        source: LeadSource.WEBSITE,
        status: LeadStatus.WEBSITE_USER, // Website leads are always WEBSITE_USER
        notes: "", // Will be set with proper translation key when needed
        currentCampaignStage: EmailCampaignStage.NOT_STARTED,
        // Identity columns — first-touch, written once
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        deviceType: parsedDevice.deviceType,
        browser: parsedDevice.browser,
        os: parsedDevice.os,
        metadata: {
          anonymous: true,
          createdFromTracking: true,
          referer: clientInfo.referer,
          timestamp: new Date().toISOString(),
        },
      };

      const [createdLead] = await db.insert(leads).values(newLead).returning();

      if (!createdLead) {
        logger.error("Failed to create anonymous lead - no record returned", {
          userAgent: clientInfo.userAgent,
          referer: clientInfo.referer,
          locale,
        });
        return fail({
          message: t("tracking.errors.default"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug(`Created anonymous lead ${createdLead.id}`);

      return success({
        leadId: createdLead.id,
      });
    } catch (error) {
      logger.error("Anonymous lead tracking error", parseError(error).message);
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
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
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }

  /**
   * Transition lead status based on user actions
   * Implements proper lead lifecycle management
   */
  private static async transitionLeadStatus(
    leadId: string,
    action:
      | "website_visit"
      | "email_open"
      | "email_click"
      | "form_submit"
      | "signup"
      | "contact"
      | "newsletter",
    t: LeadsT,
    logger: EndpointLogger,
    metadata?: Record<string, string | number | boolean>,
  ): Promise<
    ResponseType<{
      statusChanged: boolean;
      newStatus: (typeof LeadStatus)[keyof typeof LeadStatus];
      previousStatus: (typeof LeadStatus)[keyof typeof LeadStatus];
    }>
  > {
    try {
      logger.debug("Processing lead status transition", {
        leadId,
        action,
        metadata,
      });

      // Get current lead
      const leadResult = await LeadsRepository.getLeadByIdInternal(
        leadId,
        logger,
        t,
      );
      if (!leadResult.success || !leadResult.data) {
        return fail({
          message: t("tracking.errors.default"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const leadDetail = leadResult.data.lead;
      const currentStatus = leadDetail.basicInfo.status;
      let newStatus = currentStatus;
      let statusChanged = false;

      // Define target status for each action
      const actionTargetStatus: Record<
        string,
        (typeof LeadStatus)[keyof typeof LeadStatus]
      > = {
        website_visit: LeadStatus.WEBSITE_USER, // Website visitors become WEBSITE_USER
        email_open: LeadStatus.WEBSITE_USER, // Email engagement keeps them as WEBSITE_USER
        email_click: LeadStatus.WEBSITE_USER, // Email engagement keeps them as WEBSITE_USER
        form_submit: LeadStatus.IN_CONTACT, // Form submission means they're in contact
        contact: LeadStatus.IN_CONTACT, // Contact form means they're in contact
        newsletter: LeadStatus.NEWSLETTER_SUBSCRIBER, // Newsletter subscription
        signup: LeadStatus.SIGNED_UP, // User signup
      };

      // Get target status for this action
      const targetStatus:
        | (typeof LeadStatus)[keyof typeof LeadStatus]
        | undefined = actionTargetStatus[action];
      if (targetStatus !== undefined) {
        // Check if transition is allowed using centralized validation
        if (isStatusTransitionAllowed(currentStatus, targetStatus)) {
          newStatus = targetStatus;
          statusChanged = currentStatus !== newStatus;

          if (statusChanged) {
            logger.debug("Transitioning lead status", {
              leadId,
              action,
              from: currentStatus,
              to: newStatus,
            });

            // Build properly typed metadata - filter existing metadata to only include valid types
            const filteredMetadata: Record<string, string | number | boolean> =
              {};
            if (leadDetail.metadata.metadata) {
              Object.entries(leadDetail.metadata.metadata).forEach(
                ([key, value]) => {
                  if (
                    typeof value === "string" ||
                    typeof value === "number" ||
                    typeof value === "boolean"
                  ) {
                    filteredMetadata[key] = value;
                  }
                },
              );
            }

            const updatedMetadata: Record<string, string | number | boolean> = {
              ...filteredMetadata,
              lastAction: action,
              lastActionAt: new Date().toISOString(),
              statusTransitionCount:
                LeadTrackingRepository.getMetadataNumber(
                  filteredMetadata,
                  "statusTransitionCount",
                ) + 1,
              lastTransition: [currentStatus, "to", newStatus].join("_"),
            };

            // Merge additional metadata if provided
            if (metadata) {
              Object.assign(updatedMetadata, metadata);
            }

            // Update lead status
            const updateResult = await LeadsRepository.updateLeadInternal(
              leadId,
              {
                status: newStatus,
                metadata: updatedMetadata,
              },
              logger,
              t,
            );

            if (!updateResult.success) {
              logger.error("Failed to update lead status in database", {
                leadId,
                action,
                from: currentStatus,
                to: newStatus,
                error: updateResult.message,
              });
              return fail({
                message: t("tracking.errors.default"),
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
                cause: updateResult,
              });
            }

            logger.debug("Lead status transitioned successfully", {
              leadId,
              action,
              from: currentStatus,
              to: newStatus,
            });
          } else {
            logger.debug("Lead status unchanged for action", {
              leadId,
              action,
              currentStatus,
            });
          }
        } else {
          logger.debug("Lead status transition not allowed", {
            leadId,
            action,
            currentStatus,
            targetStatus,
          });
        }
      } else {
        logger.debug("Unknown tracking action for lead status update", {
          leadId,
          action,
          currentStatus,
        });
      }

      return success({
        statusChanged,
        newStatus,
        previousStatus: currentStatus,
      });
    } catch (error) {
      logger.error("Error processing lead status transition", {
        error: parseError(error),
        leadId,
        action,
      });
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle engagement with relationship establishment
   * Combines engagement recording with lead-user relationship handling
   */
  static async handleEngagementWithRelationship(
    data: LeadEngagementRequestOutput,
    clientInfo: {
      userAgent: string;
      referer: string;
      ipAddress: string;
      timestamp: string;
    },
    locale: CountryLanguage,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadEngagementResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      // Get leadId from user prop (JWT payload) - always present
      // Fallback to data.leadId for backward compatibility (tracking links)
      let leadId: string | undefined = data.leadId || user.leadId;

      logger.debug("Handling lead engagement and relationship", {
        leadId,
        engagementType: data.engagementType,
        userId: data.userId || user.id,
        isLoggedIn: !user.isPublic,
      });

      let leadCreated = false;
      let relationshipEstablished = false;

      // Validate existing lead ID if provided
      if (leadId) {
        const leadResult = await LeadsRepository.getLeadByIdInternal(
          leadId,
          logger,
          t,
        );
        if (!leadResult.success) {
          logger.debug("Provided lead ID not found, will create new lead", {
            invalidLeadId: leadId,
          });
          leadId = undefined; // Clear invalid lead ID
        }
      }

      // Create anonymous lead if leadId is missing or invalid
      // This should rarely happen since leadAuthService ensures leadId in JWT
      if (!leadId) {
        const anonymousLeadResult = await this.createAnonymousLead(
          clientInfo,
          locale,
          logger,
          t,
        );

        if (anonymousLeadResult.success && anonymousLeadResult.data) {
          leadId = anonymousLeadResult.data.leadId;
          leadCreated = true;
          logger.debug("Anonymous lead created for engagement tracking", {
            newLeadId: leadId,
          });
        } else {
          return fail({
            message: t("tracking.errors.default"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      // If we still don't have a leadId, return error
      if (!leadId) {
        return fail({
          message: t("tracking.errors.default"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Establish lead-user relationship if user is logged in
      // Check if relationship already exists before attempting conversion
      const currentUserId =
        data.userId || (user.isPublic ? undefined : user.id);
      if (currentUserId && !user.isPublic) {
        try {
          // First check if lead is already converted to avoid unnecessary conversion attempts
          const leadResult = await LeadsRepository.getLeadByIdInternal(
            leadId,
            logger,
            t,
          );

          if (
            leadResult.success &&
            leadResult.data?.lead.conversion.convertedUserId === currentUserId
          ) {
            // Lead already converted to this user - skip conversion entirely
            relationshipEstablished = true;
            // No need to log - relationship already exists
          } else {
            // Attempt conversion
            const convertResult = await LeadsRepository.convertLeadInternal(
              leadId,
              {
                userId: currentUserId,
                email: "", // Email will be fetched from user record during conversion
              },
              logger,
              t,
            );
            if (convertResult.success) {
              relationshipEstablished = true;
              logger.debug("Lead-user relationship established", {
                leadId,
                userId: currentUserId,
              });
            }
          }
        } catch (error) {
          // Don't fail the engagement if relationship establishment fails
          logger.debug(
            "Failed to establish lead-user relationship, continuing",
            {
              error: parseError(error),
              leadId,
              userId: currentUserId,
            },
          );
        }
      }

      // Convert typed metadata to flat format for storage
      const flatMetadata: Record<string, string | number | boolean> = {};
      const customDataPrefix = "custom_"; // Avoid literal string ESLint rule

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
            // Type guard to narrow unknown to allowed types
            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              flatMetadata[customDataPrefix + key] = value;
            }
          });
        }
      }

      // Record engagement
      const result = await this.recordEngagement(
        {
          leadId,
          engagementType: data.engagementType,
          campaignId: data.campaignId,
          metadata: flatMetadata,
        },
        clientInfo,
        t,
        logger,
      );

      if (result.success && result.data) {
        return success({
          ...result.data,
          leadCreated,
          relationshipEstablished,
        });
      }

      return result;
    } catch (error) {
      logger.error("Error handling lead engagement relationship", {
        error: parseError(error),
      });
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle tracking pixel request
   */
  static async handleTrackingPixel(
    leadId: string,
    campaignId: string | undefined,
    clientInfo: {
      userAgent: string;
      referer: string;
      ipAddress: string;
      timestamp: string;
    },
    logger: EndpointLogger,
    t: LeadsT,
  ): Promise<
    ResponseType<{
      success: boolean;
      leadId: string;
      campaignId?: string;
      engagementRecorded: boolean;
    }>
  > {
    try {
      let engagementRecorded = false;

      // Record email open engagement if campaign is present
      if (campaignId) {
        const engagementResult = await this.recordEngagement(
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
          t,
          logger,
        );

        engagementRecorded = engagementResult.success;
      }

      logger.debug("Tracking pixel processed", {
        leadId,
        campaignId,
        engagementRecorded,
      });

      return success({
        success: true,
        leadId,
        campaignId,
        engagementRecorded,
      });
    } catch (error) {
      logger.error("Pixel tracking failed", parseError(error).message);
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle click tracking
   * Two modes:
   * 1. With tracking id: Link tracking lead to current user's lead from JWT
   * 2. Without tracking id (ref only): Link referral code to current user's lead from JWT
   */
  static async handleClickTracking(
    data: ClickTrackingRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ClickTrackingResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { leadId: trackingLeadId, campaignId, url, ref } = data;
      const isLoggedIn = !user.isPublic;
      const currentLeadId = user.leadId;
      let engagementRecorded = false;
      let leadStatusUpdated = false;
      let leadsLinked = false;

      // Handle referral code linking to current user's lead
      if (ref && currentLeadId) {
        try {
          const referralResult = await ReferralRepository.linkReferralToLead(
            currentLeadId,
            ref,
            logger,
            locale,
          );
          if (referralResult.success) {
            logger.debug("Referral code linked to lead", {
              referralCode: ref,
              leadId: currentLeadId,
            });
          }
        } catch (error) {
          logger.error(
            "Failed to link referral code to lead",
            parseError(error).message,
            {
              ref,
              leadId: currentLeadId,
            },
          );
        }
      }

      // If no tracking id, return with redirect to home
      if (!trackingLeadId) {
        return success({
          success: true,
          redirectUrl: url ?? `/${locale}`,
          responseLeadId: currentLeadId ?? "",
          responseCampaignId: campaignId,
          engagementRecorded: false,
          leadStatusUpdated: false,
          isLoggedIn,
        });
      }

      const clientInfo: {
        userAgent: string;
        referer: string;
        ipAddress: string;
        timestamp: string;
      } = {
        userAgent: "",
        referer: "",
        ipAddress: "",
        timestamp: new Date().toISOString(),
      };

      // Link tracking leadId with current user's leadId (lead-to-lead or lead-to-user tracking)
      if (trackingLeadId !== currentLeadId && currentLeadId) {
        try {
          if (isLoggedIn && user.id) {
            await LeadAuthRepository.linkLeadToUser(
              trackingLeadId,
              user.id,
              logger,
            );
            leadsLinked = true;
            logger.debug("Tracking lead linked to authenticated user", {
              trackingLeadId,
              userId: user.id,
              currentLeadId,
            });
          } else {
            await LeadsRepository.linkLeadToLead(
              trackingLeadId,
              currentLeadId,
              "track_page",
              logger,
              t,
            );
            leadsLinked = true;
            logger.debug("Tracking lead linked to current lead", {
              currentLeadId,
              trackingLeadId,
              campaignId: campaignId,
              url,
            });
          }
        } catch (error) {
          logger.error(
            "Failed to link tracking lead",
            parseError(error).message,
          );
        }
      }

      // Record email click engagement if campaign is present
      if (campaignId) {
        const clickResult = await this.recordEngagement(
          {
            leadId: trackingLeadId,
            campaignId,
            engagementType: EngagementTypes.EMAIL_CLICK,
            metadata: {
              destinationUrl: url,
              trackingMethod: "redirect",
              isLoggedIn,
              currentLeadId,
              leadsLinked,
            },
          },
          clientInfo,
          t,
          logger,
        );
        engagementRecorded = clickResult.success;
      }

      // Update lead status if user is logged in
      if (isLoggedIn) {
        try {
          const leadResult = await LeadsRepository.getLeadByIdInternal(
            trackingLeadId,
            logger,
            t,
          );
          if (leadResult.success) {
            await LeadsRepository.updateLeadInternal(
              trackingLeadId,
              { status: LeadStatus.SIGNED_UP },
              logger,
              t,
            );
            leadStatusUpdated = true;
          }
        } catch (error) {
          logger.error(
            "Click tracking status update failed",
            parseError(error).message,
          );
        }
      }

      return success({
        success: true,
        redirectUrl: url,
        responseLeadId: trackingLeadId,
        responseCampaignId: campaignId,
        engagementRecorded,
        leadStatusUpdated,
        isLoggedIn,
      });
    } catch (error) {
      logger.error("Error processing tracking click", {
        error: error instanceof Error ? error.message : String(error),
      });
      return fail({
        message: t("tracking.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate campaign tracking URL for email campaigns
   * Migrated from utils.ts
   */
  static generateCampaignTrackingUrl(
    baseUrl: string,
    leadId: string,
    campaignId: string,
    stage: string,
    locale: CountryLanguage,
    destinationUrl?: string,
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
}
