/**
 * Lead Engagement Tracking Hooks
 * Simplified lead ID fetching and storage
 */

"use client";

import { useEffect, useMemo, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";

import { LeadTrackingClientRepository } from "../client-repository";

/**
 * Simple Lead ID Hook
 * Gets lead ID from storage (created by LeadTrackingProvider on page load)
 * Automatically sets it in forms via useEffect callback
 */
export function useLeadId(setValueCallback?: (value: string) => void): {
  leadId: string | undefined;
  isLoading: boolean;
} {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Get lead ID from storage (should already be created by LeadTrackingProvider)
  useEffect(() => {
    const loadLeadId = async (): Promise<void> => {
      setIsLoading(true);

      try {
        // Get stored lead ID
        const result =
          await LeadTrackingClientRepository.getTrackingData(logger);
        const storedLeadId = result.success ? result.data?.leadId : undefined;

        if (storedLeadId) {
          setLeadId(storedLeadId);
          logger.debug("info.leads.tracking.engagement.lead_id_retrieved", {
            leadId: storedLeadId,
          });
        } else {
          // If no lead ID in storage, wait a bit and retry (LeadTrackingProvider might still be initializing)
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 500);
          });
          const retryResult =
            await LeadTrackingClientRepository.getTrackingData(logger);
          const retryLeadId = retryResult.success
            ? retryResult.data?.leadId
            : undefined;

          if (retryLeadId) {
            setLeadId(retryLeadId);
            logger.debug(
              "info.leads.tracking.engagement.lead_id_retrieved_retry",
              {
                leadId: retryLeadId,
              },
            );
          } else {
            logger.warn("error.leads.tracking.engagement.no_lead_id_found");
            setLeadId(undefined);
          }
        }
      } catch (error) {
        logger.error("error.leads.tracking.engagement.fetch_error", { error });
        setLeadId(undefined);
      }

      setIsLoading(false);
    };

    void loadLeadId();
  }, [logger]);

  // Automatically set lead ID in form when available
  useEffect(() => {
    if (leadId && setValueCallback) {
      setValueCallback(leadId);
    }
  }, [leadId, setValueCallback]);

  return {
    leadId,
    isLoading,
  };
}
