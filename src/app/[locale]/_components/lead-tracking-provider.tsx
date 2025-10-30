"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { useEffect, useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import { EngagementTypes } from "../../api/[locale]/v1/core/leads/enum";
import type { LeadEngagementResponseOutput } from "../../api/[locale]/v1/core/leads/tracking/engagement/definition";

/**
 * Global Lead Tracking Provider
 * Records website visits for engagement tracking
 * Server handles leadid creation and management via JWT/cookies
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
        // Call the engagement endpoint to record website visit
        // Server will handle leadid creation/validation via JWT payload
        const apiUrl = `/api/${locale}/v1/core/leads/tracking/engagement`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // No leadId needed - server gets it from JWT payload
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
          logger.error("error.leads.tracking.engagement.failed_to_record", {
            status: response.status,
          });
          return;
        }

        const apiResult =
          (await response.json()) as ResponseType<LeadEngagementResponseOutput>;

        if (apiResult.success) {
          logger.debug("info.leads.tracking.engagement.visit_recorded", {
            leadId: apiResult.data.responseLeadId,
          });
        }
      } catch (error) {
        logger.error(
          "error.leads.tracking.engagement.fetch_error",
          parseError(error),
        );
      }
    };

    void initializeLeadTracking();
  }, [locale, logger]);

  return null;
}
