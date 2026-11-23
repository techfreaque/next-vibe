"use client";

/**
 * Conversion walls, client side: the chat refused a send before it left the
 * browser (credit guard) or the 18+ consent dialog was closed without
 * agreeing. Reported through the lead tracking endpoint as an engagement.
 * Fire-and-forget: never blocks or changes the UI.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getCurrentUrl } from "next-vibe/ui/lib/location";
import { apiClient } from "next-vibe/unified-ui/hooks/store";

import trackingEndpoints from "./definition";

export function sendWallBeacon(params: {
  wall: "credits" | "consent";
  model: string;
  user: JwtPayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  /** consent only: why the dialog was open */
  prompt?: "select" | "send";
}): void {
  const { wall, model, user, locale, logger, prompt } = params;
  void (async (): Promise<void> => {
    const result = await apiClient.mutate(
      trackingEndpoints.POST,
      logger,
      user,
      {
        engagementType:
          wall === "credits"
            ? EngagementTypes.CREDIT_WALL
            : EngagementTypes.CONSENT_DECLINED,
        metadata: {
          url: getCurrentUrl(),
          customData: {
            model,
            who: user.isPublic ? "guest" : "account",
            via: "client",
            ...(prompt ? { prompt } : {}),
          },
        },
      },
      undefined,
      locale,
    );
    if (!result.success) {
      logger.debug("Wall beacon not recorded", {
        wall,
        error: parseError(result).message,
      });
    }
  })();
}
