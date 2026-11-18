"use client";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getCurrentUrl } from "next-vibe/ui/lib/location";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import trackingEndpoints from "@/leads/tracking/definition";

/** Funnel events of the first-run onboarding, one engagement row each. */
export type OnboardingEvent =
  | "shown"
  | "companion_picked"
  | "goal_picked"
  | "skipped"
  | "completed";

export type OnboardingStepName = "companion" | "goal";

/** Which flow the visitor got: full (new), companion only, or skill arrival. */
export type OnboardingMode = "full" | "companion" | "arrival";

// The server resolves the real lead from the cookie; this only types the call.
const TRACKING_USER = {
  isPublic: true,
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.PUBLIC],
} satisfies JWTPublicPayloadType;

/**
 * Record one onboarding funnel step as a FORM_SUBMIT engagement
 * (formType "onboarding", formId = event), the same pipe lead tracking uses.
 * Fire and forget: a lost event is logged, never shown.
 */
export function trackOnboarding(
  logger: EndpointLogger,
  event: OnboardingEvent,
  data: {
    mode: OnboardingMode;
    step: OnboardingStepName;
    companionId?: string;
    goal?: string;
    arrivalSkillId?: string;
  },
): void {
  const customData: Record<string, string> = {
    mode: data.mode,
    step: data.step,
  };
  if (data.companionId) {
    customData["companionId"] = data.companionId;
  }
  if (data.goal) {
    customData["goal"] = data.goal;
  }
  if (data.arrivalSkillId) {
    customData["arrivalSkillId"] = data.arrivalSkillId;
  }
  void apiClient
    .mutate(
      trackingEndpoints.POST,
      logger,
      TRACKING_USER,
      {
        engagementType: EngagementTypes.FORM_SUBMIT,
        metadata: {
          formType: "onboarding",
          formId: event,
          source: data.mode,
          url: getCurrentUrl(),
          timestamp: new Date().toISOString(),
          customData,
        },
      },
      undefined,
      defaultLocale,
    )
    .then((result) => {
      if (!result.success) {
        logger.warn("Onboarding tracking event not stored", {
          event,
          mode: data.mode,
          errorType: result.errorType.errorKey,
          reason: result.message,
        });
      }
      return undefined;
    })
    .catch((error: Error) => {
      logger.warn("Onboarding tracking event threw", {
        event,
        mode: data.mode,
        error: parseError(error).message,
      });
    });
}
