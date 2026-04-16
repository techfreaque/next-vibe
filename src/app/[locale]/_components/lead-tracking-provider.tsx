"use client";

import {
  getCurrentUrl,
  getReferrer,
  getUserAgent,
} from "next-vibe-ui/utils/browser";
import { useEffect, useRef } from "react";

import trackingEndpoints from "@/app/api/[locale]/leads/tracking/engagement/definition";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import { useLogger } from "@/hooks/use-logger";
import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { useTranslation } from "@/i18n/core/client";

import { EngagementTypes } from "../../api/[locale]/leads/enum";

const TRACKING_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// not used for any auth, here in tracking - server will get correct leadid from cookies
const PUBLIC_USER = {
  isPublic: true,
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.PUBLIC],
} satisfies JWTPublicPayloadType;

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
  const logger = useLogger();
  const hasTrackedRef = useRef(false);
  const lastTrackedTimeRef = useRef(0);

  const engagementMutation = useApiMutation(
    trackingEndpoints.POST,
    logger,
    PUBLIC_USER,
    {
      onSuccess: ({ responseData }) => {
        lastTrackedTimeRef.current = Date.now();
        logger.debug("info.leads.tracking.engagement.visit_recorded", {
          leadId: responseData.responseLeadId,
        });
      },
      onError: ({ error }) => {
        logger.error("error.leads.tracking.engagement.failed_to_record", {
          error: error.message,
        });
      },
    },
  );

  useEffect(() => {
    // Prevent double-tracking in strict mode or fast refresh
    if (hasTrackedRef.current) {
      return;
    }

    // Check if we've tracked recently in this session
    if (lastTrackedTimeRef.current) {
      const timeSinceLastTrack = Date.now() - lastTrackedTimeRef.current;

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

    engagementMutation.mutate({
      requestData: {
        engagementType: EngagementTypes.WEBSITE_VISIT,
        metadata: {
          url: getCurrentUrl(),
          referrer: getReferrer(),
          userAgent: getUserAgent(),
          timestamp: new Date().toISOString(),
        },
      },
    });
  }, [locale, logger, engagementMutation]);

  return null;
}
