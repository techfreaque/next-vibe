/**
 * Lead Tracking Client Repository
 * Centralized client-side tracking logic for lead conversion and engagement
 */

"use client";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { envClient } from "@/config/env-client";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import {
  getStorageItem,
  setStorageItem,
} from "../../system/unified-ui/react/storage/storage-client";

/**
 * Lead tracking data structure
 */
export interface LeadTrackingData {
  leadId: string;
  timestamp: number;
  source: string;
  campaign: string | null;
  stage: string | null;
  url: string;
}

/**
 * Tracking parameters for URL building
 */
export interface TrackingParams {
  id: string;
  campaignId?: string;
  stage?: string;
  source: string;
  url?: string;
}

/**
 * Tracking validation result
 */
export interface TrackingValidationResult {
  validatedParams: TrackingParams | null;
  errors: ErrorResponseType[];
}

/**
 * Lead Tracking Client Repository
 * Handles all client-side tracking operations
 */
export class LeadTrackingClientRepository {
  // Loading state constant for forms
  static readonly LOADING_LEAD_ID = "LOADING_LEAD_ID";
  private static readonly STORAGE_KEY = "lead-conversion-tracking";

  /**
   * Create logger for client tracking operations
   */
  static createLogger(locale: string): EndpointLogger {
    return createEndpointLogger(
      envClient.NODE_ENV === "development",
      Date.now(),
      locale,
    );
  }

  /**
   * Capture and store tracking data from URL parameters
   */
  static async captureTrackingData(
    searchParams: URLSearchParams,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadTrackingData | null>> {
    try {
      const leadId = searchParams.get("leadId") || searchParams.get("id");

      if (!leadId) {
        return createSuccessResponse(null);
      }

      // Validate source parameter
      const source = searchParams.get("source") || "email";
      const validatedSource = source || "email";

      const trackingData: LeadTrackingData = {
        leadId,
        timestamp: Date.now(),
        source: validatedSource,
        campaign:
          searchParams.get("campaign") || searchParams.get("campaignId"),
        stage: searchParams.get("stage"),
        url: typeof window !== "undefined" ? window.location.href : "",
      };

      // Store tracking data
      await setStorageItem(
        LeadTrackingClientRepository.STORAGE_KEY,
        trackingData,
      );

      console.debug("lead.tracking.data.captured", {
        leadId,
        source: validatedSource,
        campaign: trackingData.campaign,
        stage: trackingData.stage,
        url: trackingData.url,
      });

      return createSuccessResponse(trackingData);
    } catch (error) {
      console.error("lead.tracking.data.capture.error", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get stored lead tracking data
   */
  static async getTrackingData(): Promise<
    ResponseType<LeadTrackingData | null>
  > {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        return createSuccessResponse(null);
      }

      const data = await getStorageItem<LeadTrackingData>(
        LeadTrackingClientRepository.STORAGE_KEY,
      );

      if (!data?.leadId || !data.timestamp) {
        return createSuccessResponse(null);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error("Error retrieving lead tracking data", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get leadId for signup form
   */
  static async getLeadIdForSignup(): Promise<string | null> {
    try {
      const result = await LeadTrackingClientRepository.getTrackingData();
      if (result.success && result.data) {
        console.debug("Lead tracking data loaded for signup", {
          leadId: result.data.leadId,
          source: result.data.source,
          campaign: result.data.campaign,
          stage: result.data.stage,
        });
        return result.data.leadId;
      }
      return null;
    } catch (error) {
      console.debug("Error loading lead tracking data (non-critical)", error);
      return null;
    }
  }

  /**
   * Store tracking data directly
   */
  static async storeTrackingData(
    trackingData: LeadTrackingData,
  ): Promise<ResponseType<void>> {
    try {
      if (typeof window === "undefined") {
        return createSuccessResponse(undefined);
      }

      await setStorageItem(
        LeadTrackingClientRepository.STORAGE_KEY,
        trackingData,
      );

      console.debug("Lead tracking data stored", {
        leadId: trackingData.leadId,
        source: trackingData.source,
        campaign: trackingData.campaign,
        stage: trackingData.stage,
      });

      return createSuccessResponse(undefined);
    } catch (error) {
      console.error("Error storing lead tracking data", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Clear tracking data from storage
   */
  static async clearTrackingData(): Promise<ResponseType<void>> {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        return createSuccessResponse(undefined);
      }

      await setStorageItem(LeadTrackingClientRepository.STORAGE_KEY, null);
      console.debug("Lead tracking data cleared");
      return createSuccessResponse(undefined);
    } catch (error) {
      console.error("Error clearing lead tracking data", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Validate tracking URL parameters
   */
  static validateTrackingParams(
    searchParams: URLSearchParams,
  ): ResponseType<TrackingValidationResult> {
    try {
      const errors: ErrorResponseType[] = [];
      const id = searchParams.get("id");
      const campaignId = searchParams.get("campaignId");
      const stage = searchParams.get("stage");
      const source = searchParams.get("source") || "email";
      const url = searchParams.get("url");

      // Validate required id
      if (!id) {
        errors.push(
          createErrorResponse(
            "leads.tracking.errors.missingId",
            ErrorResponseTypes.VALIDATION_ERROR,
          ),
        );
      }

      // Validate source
      const validatedSource = source || "email";

      // Validate URL if provided
      if (url) {
        try {
          new URL(url);
        } catch {
          errors.push(
            createErrorResponse(
              "leads.tracking.errors.invalidUrl",
              ErrorResponseTypes.VALIDATION_ERROR,
            ),
          );
        }
      }

      if (errors.length > 0) {
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      const validatedParams: TrackingParams = {
        id: id!,
        campaignId: campaignId || undefined,
        stage: stage || undefined,
        source: validatedSource,
        url: url || undefined,
      };

      return createSuccessResponse({
        validatedParams,
        errors: [],
      });
    } catch (error) {
      console.error("Error validating tracking params", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Format tracking data for storage
   */
  static formatTrackingDataForStorage(
    params: TrackingParams,
  ): ResponseType<LeadTrackingData> {
    try {
      const trackingData: LeadTrackingData = {
        leadId: params.id,
        timestamp: Date.now(),
        source: params.source,
        campaign: params.campaignId || null,
        stage: params.stage || null,
        url:
          params.url ||
          (typeof window !== "undefined" ? window.location.href : ""),
      };

      return createSuccessResponse(trackingData);
    } catch (error) {
      console.error("Error formatting tracking data", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}
