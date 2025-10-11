/**
 * Lead Engagement Tracking Hooks
 * Simplified lead ID fetching and storage
 */

"use client";

import { useCallback, useEffect, useState } from "react";

// Client-side logging - using console methods instead of server loggers
import { useTranslation } from "@/i18n/core/client";

import { EngagementTypes } from "../../enum";
import { LeadTrackingClientRepository } from "../client-repository";
import type { LeadEngagementResponseType } from "./definition";

/**
 * Simple Lead ID Hook
 * Fetches and stores lead ID, automatically sets it in forms via useEffect callback
 */
export function useLeadId(
  setValueCallback?: (key: "leadId", value: string) => void,
): {
  leadId: string;
  isLoading: boolean;
} {
  const { locale } = useTranslation();
  const [leadId, setLeadId] = useState<string>(
    LeadTrackingClientRepository.LOADING_LEAD_ID,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch or create lead ID - the engagement endpoint handles validation internally
  const fetchLeadId = useCallback(async (): Promise<string | null> => {
    try {
      // Get stored lead ID if available
      const result = await LeadTrackingClientRepository.getTrackingData();
      const storedLeadId = result.success ? result.data?.leadId : undefined;

      // Always call the engagement endpoint - it will validate the lead ID
      // and create a new one if the stored one is invalid
      const apiUrl = `/api/${locale}/v1/leads/tracking/engagement`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: storedLeadId, // Pass stored lead ID for validation
          engagementType: EngagementTypes.WEBSITE_VISIT,
          metadata: {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to get/create lead", { status: response.status });
        return null;
      }

      const apiResult = (await response.json()) as {
        success: boolean;
        data?: LeadEngagementResponseType;
      };

      if (apiResult.success && apiResult.data?.leadId) {
        const newLeadId = apiResult.data.leadId;

        // Update stored tracking data with the valid lead ID
        await LeadTrackingClientRepository.storeTrackingData({
          leadId: newLeadId,
          timestamp: Date.now(),
          source: "website",
          campaign: null,
          stage: null,
          url: window.location.href,
        });

        // Log if we got a different lead ID than what was stored
        if (storedLeadId && storedLeadId !== newLeadId) {
          console.debug("Lead ID was updated by server", {
            oldLeadId: storedLeadId,
            newLeadId: newLeadId,
          });
        } else if (!storedLeadId) {
          console.debug("New lead ID created", { leadId: newLeadId });
        } else {
          console.debug("Using existing valid lead ID", { leadId: newLeadId });
        }

        return newLeadId;
      }

      return null;
    } catch (error) {
      console.error("Error fetching/creating lead ID", error);
      return null;
    }
  }, [locale]);

  // Load lead ID on mount with retry
  useEffect(() => {
    const loadLeadId = async (): Promise<void> => {
      setIsLoading(true);

      // First attempt
      let id = await fetchLeadId();

      // Retry once if first attempt failed
      if (!id) {
        id = await fetchLeadId();
      }

      // Use LOADING_LEAD_ID as fallback if both attempts failed
      setLeadId(id || LeadTrackingClientRepository.LOADING_LEAD_ID);
      setIsLoading(false);
    };

    void loadLeadId();
  }, [fetchLeadId]);

  // Automatically set lead ID in form when available
  useEffect(() => {
    if (leadId && setValueCallback) {
      setValueCallback("leadId", leadId);
    }
  }, [leadId, setValueCallback]);

  return {
    leadId,
    isLoading,
  };
}
