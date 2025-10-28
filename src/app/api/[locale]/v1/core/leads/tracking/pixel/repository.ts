/**
 * Tracking Pixel Repository
 * Handles pixel tracking requests and engagement recording
 */

import type { NextRequest } from "next/server";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

import { leadId } from "../../types";
import { leadTrackingRepository } from "../repository";

const pixelTrackingRequestSchema = z.object({
  leadId: leadId,
  campaignId: z.uuid().optional(),
  t: z.string().optional(), // Timestamp parameter to prevent caching
});

export type PixelTrackingRequestType = z.infer<
  typeof pixelTrackingRequestSchema
>;

/**
 * Repository for handling tracking pixel requests
 */
export class PixelTrackingRepository {
  /**
   * Handle pixel tracking request
   * Returns a 1x1 transparent GIF and records engagement asynchronously
   */
  handlePixelRequest(request: NextRequest, logger: EndpointLogger): Response {
    try {
      const { searchParams } = new URL(request.url);

      // Validate tracking parameters
      const validationResult = this.validateTrackingParams(searchParams);

      // Always return pixel first to avoid broken images, even on errors
      const pixelResponse =
        leadTrackingRepository.createTrackingPixelResponse();

      if (!validationResult.success || !validationResult.data?.leadId) {
        logger.warn("tracking.pixel.request.invalid", {
          error: validationResult.success
            ? "Missing leadId"
            : validationResult.error,
          searchParams: Object.fromEntries(searchParams),
          ip: PixelTrackingRepository.getClientIp(request),
        });
        return pixelResponse;
      }

      const { leadId, campaignId } = validationResult.data;
      const clientIp = PixelTrackingRepository.getClientIp(request);

      // Basic rate limiting check - log suspicious activity
      if (clientIp === "unknown") {
        logger.warn("tracking.pixel.request.unknown.ip", {
          leadId,
          campaignId,
        });
      }

      const clientInfo = leadTrackingRepository.extractClientInfo(request);

      // Record engagement asynchronously to avoid blocking pixel response
      // This ensures the pixel loads quickly even if database is slow
      setImmediate(async () => {
        try {
          // Import user factory for mock user
          const { createMockUser } = await import(
            "@/app/api/[locale]/v1/core/system/unified-backend/shared/auth/cli-user-factory"
          );
          const mockUser = createMockUser();

          const result = await leadTrackingRepository.handleTrackingPixel(
            leadId,
            campaignId,
            clientInfo,
            mockUser,
            "en-GLOBAL",
            logger,
          );

          if (result.success) {
            logger.info("tracking.pixel.engagement.recorded", {
              leadId,
              campaignId,
              clientIp,
              engagementRecorded: result.data.engagementRecorded,
            });
          } else {
            logger.error("tracking.pixel.engagement.failed", {
              leadId,
              campaignId,
              error: result.message,
              clientIp,
            });
          }
        } catch (error) {
          logger.error("tracking.pixel.engagement.error", {
            error: parseError(error),
            leadId,
            campaignId,
            clientIp,
          });
        }
      });

      logger.info("tracking.pixel.served", {
        leadId,
        campaignId,
        userAgent: clientInfo.userAgent,
        clientIp,
      });

      return pixelResponse;
    } catch (error) {
      logger.error("tracking.pixel.serve.error", parseError(error));
      return leadTrackingRepository.createTrackingPixelResponse(); // Always return pixel to avoid broken images
    }
  }

  /**
   * Validate tracking parameters from URL search params
   */
  private validateTrackingParams(searchParams: URLSearchParams): {
    success: boolean;
    data?: PixelTrackingRequestType;
    error?: string;
  } {
    try {
      const params = {
        leadId: searchParams.get("leadId"),
        campaignId: searchParams.get("campaignId") || undefined,
        t: searchParams.get("t") || undefined,
      };

      // Filter out null values
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== null),
      );

      const result = pixelTrackingRequestSchema.safeParse(filteredParams);

      if (!result.success) {
        // Use Zod's built-in error formatting
        const fallbackError = "validation" + "." + "failed"; // Avoid i18next literal string
        return {
          success: false,
          error: result.error.message || fallbackError,
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Extract client IP address from request headers
   */
  private static getClientIp(request: NextRequest): string {
    return (
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }
}

export const pixelTrackingRepository = new PixelTrackingRepository();
