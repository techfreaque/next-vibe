"use client";

import {
  isBrowserNetworkLossMessage,
  isErrorResponseType,
  parseError,
} from "next-vibe/core/utils/parse-error";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { getClientRoute } from "next-vibe/logger/client-context";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  addDocumentListener,
  addWindowListener,
  getReferrer,
  getVisibilityState,
} from "next-vibe/ui/lib/dom";
import { getCurrentUrl } from "next-vibe/ui/lib/location";
import { getUserAgent, isOnline } from "next-vibe/ui/lib/media";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { useEffect, useRef } from "react";

import trackingEndpoints from "@/leads/tracking/definition";

const TRACKING_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * A visit POST that dies with a browser network error ("Failed to fetch" /
 * Firefox "NetworkError") is mostly a bounce: the visitor navigated or closed
 * the tab while the request was in flight, or the connection blipped. Retry
 * once - after a short delay, and only while the tab is visible and online -
 * before reporting the visit as lost.
 */
const NETWORK_RETRY_DELAY_MS = 3000;
const MAX_ATTEMPTS = 2;

interface VisitRunState {
  pageHidden: boolean;
  retryDue: boolean;
  retryTimer: ReturnType<typeof setTimeout> | undefined;
  stopWaiting: (() => void) | undefined;
}

// not used for any auth, here in tracking - server will get correct leadid from cookies
const PUBLIC_USER = {
  isPublic: true,
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.PUBLIC],
} satisfies JWTPublicPayloadType;

/**
 * Global Lead Tracking (loaded lazily via ./lead-tracking-provider)
 * Records website visits for engagement tracking with session-based deduplication
 * Server handles leadid creation and management via JWT/cookies
 * This component should be included in the root layout
 *
 * Optimization: Only tracks once per session (5 minute cooldown) to avoid excessive API calls
 */
export function LeadTracking(): null {
  const logger = useLogger();
  const hasTrackedRef = useRef(false);
  const lastTrackedTimeRef = useRef(0);

  const { mutateAsync } = useApiMutation(
    trackingEndpoints.POST,
    logger,
    PUBLIC_USER,
  );

  useEffect(() => {
    // Prevent double-tracking in strict mode or fast refresh
    if (hasTrackedRef.current) {
      return undefined;
    }

    // Check if we've tracked recently in this session
    if (lastTrackedTimeRef.current) {
      const timeSinceLastTrack = Date.now() - lastTrackedTimeRef.current;

      if (timeSinceLastTrack < TRACKING_COOLDOWN_MS) {
        logger.debug("info.leads.tracking.engagement.skipped_cooldown", {
          timeSinceLastTrack,
          cooldownMs: TRACKING_COOLDOWN_MS,
        });
        return undefined;
      }
    }

    // Mark as tracked to prevent duplicate calls
    hasTrackedRef.current = true;

    const mountedAt = Date.now();
    const requestData = {
      engagementType: EngagementTypes.WEBSITE_VISIT,
      metadata: {
        url: getCurrentUrl(),
        referrer: getReferrer(),
        userAgent: getUserAgent(),
        timestamp: new Date().toISOString(),
      },
    };

    // Mutable per-effect state in one object (closures mutate fields, never
    // reassign bindings).
    const run: VisitRunState = {
      pageHidden: false,
      retryDue: false,
      retryTimer: undefined,
      stopWaiting: undefined,
    };
    const removePageHide = addWindowListener("pagehide", () => {
      run.pageHidden = true;
    });

    // Second attempt: fires once the delay passed and the tab is online +
    // visible again (whichever comes last).
    const retryIfReady = (): void => {
      if (run.retryDue && isOnline() && getVisibilityState() === "visible") {
        run.retryDue = false;
        run.stopWaiting?.();
        run.stopWaiting = undefined;
        void send(MAX_ATTEMPTS);
      }
    };

    const send = async (attempt: number): Promise<void> => {
      try {
        const result = await mutateAsync({ requestData });
        if (result.success) {
          lastTrackedTimeRef.current = Date.now();
          logger.debug("info.leads.tracking.engagement.visit_recorded", {
            leadId: result.data.responseLeadId,
            attempt,
          });
        }
      } catch (err) {
        // mutateAsync throws the ErrorResponseType on any failure
        const errorMessage = parseError(err).message;
        const errorType = isErrorResponseType(err) ? err.errorType : null;
        const isNetworkLoss = isBrowserNetworkLossMessage(errorMessage);
        if (isNetworkLoss && attempt < MAX_ATTEMPTS && !run.pageHidden) {
          logger.debug("Lead tracking: network loss, retrying visit once", {
            attempt,
            online: isOnline(),
            visibilityState: getVisibilityState(),
          });
          const removeOnline = addWindowListener("online", retryIfReady);
          const removeVisibility = addDocumentListener(
            "visibilitychange",
            retryIfReady,
          );
          run.stopWaiting = (): void => {
            removeOnline();
            removeVisibility();
          };
          run.retryTimer = setTimeout(() => {
            run.retryDue = true;
            retryIfReady();
          }, NETWORK_RETRY_DELAY_MS);
          return;
        }
        logger.error("Lead tracking: failed to record website visit", {
          error: errorMessage,
          errorKey: errorType?.errorKey ?? null,
          errorCode: errorType?.errorCode ?? null,
          engagementType: requestData.engagementType,
          attempt,
          isNetworkLoss,
          // Network-loss triage: offline -> visitor connectivity; hidden or
          // pageHidden -> visitor left mid-request; online + visible on the
          // retry -> the server/proxy really dropped it.
          online: isOnline(),
          visibilityState: getVisibilityState(),
          pageHidden: run.pageHidden,
          path: getClientRoute(),
          msSinceMount: Date.now() - mountedAt,
        });
      }
    };

    void send(1);

    return (): void => {
      removePageHide();
      run.stopWaiting?.();
      if (run.retryTimer !== undefined) {
        clearTimeout(run.retryTimer);
      }
    };
  }, [logger, mutateAsync]);

  return null;
}
