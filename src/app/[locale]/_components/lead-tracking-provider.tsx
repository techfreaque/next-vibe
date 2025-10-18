"use client";

import { useEffect, useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";

import { EngagementTypes } from "../../api/[locale]/v1/core/leads/enum";
import { LeadTrackingClientRepository } from "../../api/[locale]/v1/core/leads/tracking/client-repository";
import type { LeadEngagementResponseOutput } from "../../api/[locale]/v1/core/leads/tracking/engagement/definition";

/**
 * Global Lead Tracking Provider
 * Ensures lead ID is created on every page visit
 * This component should be included in the root layout
 */
export function LeadTrackingProvider(): null {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  useEffect(() => {
    const initializeLeadTracking = async (): Promise<void> => {
      try {
        // Get stored lead ID if available
        const result =
          await LeadTrackingClientRepository.getTrackingData(logger);
        const storedLeadId = result.success ? result.data?.leadId : undefined;

        // Call the engagement endpoint to validate/create lead ID
        const apiUrl = `/api/${locale}/v1/core/leads/tracking/engagement`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId: storedLeadId,
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
          logger.error("error.leads.tracking.engagement.failed_to_create", {
            status: response.status,
          });
          return;
        }

        const apiResult = (await response.json()) as {
          success: boolean;
          data?: LeadEngagementResponseOutput;
        };

        if (apiResult.success && apiResult.data?.responseLeadId) {
          const newLeadId = apiResult.data.responseLeadId;

          // Update stored tracking data with the valid lead ID
          await LeadTrackingClientRepository.storeTrackingData(
            {
              leadId: newLeadId,
              timestamp: Date.now(),
              source: "website",
              campaign: null,
              stage: null,
              url: window.location.href,
            },
            logger,
          );

          // Log lead ID status
          if (storedLeadId && storedLeadId !== newLeadId) {
            logger.debug("info.leads.tracking.engagement.lead_id_updated", {
              oldLeadId: storedLeadId,
              newLeadId: newLeadId,
            });
          } else if (!storedLeadId) {
            logger.debug("info.leads.tracking.engagement.lead_id_created", {
              leadId: newLeadId,
            });
          } else {
            logger.debug("info.leads.tracking.engagement.lead_id_existing", {
              leadId: newLeadId,
            });
          }
        }
      } catch (error) {
        logger.error("error.leads.tracking.engagement.fetch_error", { error });
      }
    };

    void initializeLeadTracking();
  }, [locale, logger]);

  return null;
}
