"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { LeadTrackingData } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
import { LeadTrackingClientRepository } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
// Client-side logging - using console methods instead of server loggers
import type { CountryLanguage } from "@/i18n/core/config";

interface LeadTrackingProps {
  locale: CountryLanguage;
}

/**
 * Lead Tracking Component
 * Comprehensive lead tracking that:
 * 1. Captures leadId from URL parameters
 * 2. Creates anonymous leads for new visitors
 * 3. Handles lead-user relationships from URL parameters
 * 4. Stores tracking data for conversion tracking
 */
export function LeadTracking({ locale }: LeadTrackingProps): null {
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleComprehensiveLeadTracking = async (): Promise<void> => {
      try {
        // Skip if already initialized to prevent duplicate processing
        if (isInitialized) {
          return;
        }

        // 1. Capture any existing tracking data from URL parameters
        await LeadTrackingClientRepository.captureTrackingData(searchParams);

        // 2. Check if we already have tracking data
        const existingResult =
          await LeadTrackingClientRepository.getTrackingData();
        if (existingResult.success && existingResult.data?.leadId) {
          console.debug("Existing lead tracking found", {
            leadId: existingResult.data.leadId,
          });
          setIsInitialized(true);
          return;
        }

        // 3. Lead tracking will be handled server-side when engagement occurs
        console.debug(
          "Lead tracking component initialized - server will handle anonymous lead creation when needed",
          {
            locale,
            hasUrlParams: searchParams.toString().length > 0,
          },
        );

        setIsInitialized(true);
      } catch (error) {
        console.error("Error in comprehensive lead tracking", error);
        setIsInitialized(true); // Set to true even on error to prevent infinite retries
      }
    };

    void handleComprehensiveLeadTracking();
  }, [searchParams, locale, isInitialized]);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to get stored lead tracking data
 * Used by signup form to retrieve leadId for conversion tracking
 */
export function useLeadTracking(): {
  getLeadTrackingData: () => Promise<LeadTrackingData | null>;
  clearLeadTrackingData: () => Promise<void>;
} {
  const getLeadTrackingData = async (): Promise<LeadTrackingData | null> => {
    const result = await LeadTrackingClientRepository.getTrackingData();
    return result.success ? result.data : null;
  };

  const clearLeadTrackingData = async (): Promise<void> => {
    await LeadTrackingClientRepository.clearTrackingData();
  };

  return {
    getLeadTrackingData,
    clearLeadTrackingData,
  };
}
