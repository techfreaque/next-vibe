"use client";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import {
  getCurrentUrl,
  getReferrer,
  getUserAgent,
} from "next-vibe-ui/utils/browser";
import { useEffect, useMemo, useRef } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import { EngagementTypes } from "../../api/[locale]/leads/enum";
import type { LeadEngagementResponseOutput } from "../../api/[locale]/leads/tracking/engagement/definition";

const TRACKING_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
let lastTrackedTime = 0;

/**
 * Global Lead Tracking Provider
 * Records website visits for engagement tracking with session-based deduplication
 * Server handles leadid creation and management via JWT/cookies
 * This component should be included in the root layout
 *
 * Optimization: Only tracks once per session (5 minute cooldown) to avoid excessive API calls
 */
export function LeadTrackingProvider(): null {
  const { locale } = useTranslation();
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Prevent double-tracking in strict mode or fast refresh
    if (hasTrackedRef.current) {
      return;
    }

    const initializeLeadTracking = async (): Promise<void> => {
      try {
        // Check if we've tracked recently in this session
        if (lastTrackedTime) {
          const timeSinceLastTrack = Date.now() - lastTrackedTime;

          if (timeSinceLastTrack < TRACKING_COOLDOWN_MS) {
            logger.debug("info.leads.tracking.engagement.skipped_cooldown", {
              timeSinceLastTrack,
              cooldownMs: TRACKING_COOLDOWN_MS,
            });
            return;
          }
        }

        // Mark as tracked to prevent duplicate calls
        hasTrackedRef.current = true;

        // Call the engagement endpoint to record website visit
        // Server will handle leadid creation/validation via JWT payload
        const baseUrl = envClient.NEXT_PUBLIC_APP_URL;
        const apiUrl = `${baseUrl}/api/${locale}/leads/tracking/engagement`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // No leadId needed - server gets it from JWT payload
            engagementType: EngagementTypes.WEBSITE_VISIT,
            metadata: {
              url: getCurrentUrl(),
              referrer: getReferrer(),
              userAgent: getUserAgent(),
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
          // Store tracking timestamp in session storage
          lastTrackedTime = Date.now();

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
