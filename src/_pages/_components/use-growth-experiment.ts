"use client";

import { platform } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  JwtPayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  getSessionItem,
  removeSessionItem,
  setSessionItem,
  storage,
} from "next-vibe/ui/lib/storage";
import { useEffect, useRef, useState } from "react";

type Experiment = "model-starter-v1" | "pricing-guest-signup-v1";
type Variant = "control" | "treatment";
const MODEL_STARTER_KEY = "growth-experiment:model-starter-v1";

// The tracking route resolves the actual lead from the authenticated request.
const PUBLIC_USER: JWTPublicPayloadType = {
  isPublic: true,
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.PUBLIC],
};

export function pickGrowthVariant(saved: string | null, draw: number): Variant {
  if (saved === "control" || saved === "treatment") {
    return saved;
  }
  return draw < 0.5 ? "control" : "treatment";
}

export function pricingGuestVariant(user: JwtPayloadType): Variant | null {
  if (!user.isPublic || user.leadId === PUBLIC_USER.leadId) {
    return null;
  }
  // Lead IDs are random UUIDs. Their last hexadecimal digit is uniformly distributed.
  return Number.parseInt(user.leadId.slice(-1), 16) % 2 === 0
    ? "control"
    : "treatment";
}

/** The model page keeps its cacheable baseline until the browser picks an arm. */
export function useModelStarterVariant(eligible: boolean): Variant | null {
  const logger = useLogger();
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (!eligible || platform.isReactNative) {
      return;
    }
    const assignment = { active: true };
    void (async (): Promise<void> => {
      const saved = await storage.getItem(MODEL_STARTER_KEY, logger);
      if (!assignment.active) {
        return;
      }
      const assigned = pickGrowthVariant(saved, Math.random());
      if (assigned !== saved) {
        await storage.setItem(MODEL_STARTER_KEY, assigned, logger);
      }
      if (assignment.active) {
        setVariant(assigned);
      }
    })();
    return (): void => {
      assignment.active = false;
    };
  }, [eligible, logger]);

  return eligible ? variant : null;
}

export function useGrowthExposure({
  experiment,
  locale,
  variant,
  model,
  user = PUBLIC_USER,
}: {
  experiment: Experiment;
  locale: CountryLanguage;
  variant: Variant | null;
  model?: string;
  user?: JWTPublicPayloadType;
}): void {
  const logger = useLogger();
  const reported = useRef<string | null>(null);

  useEffect(() => {
    if (variant === null || platform.isReactNative) {
      return;
    }
    const key = `growth-exposure:${experiment}:${variant}:${user.leadId}:${model ?? ""}`;
    if (reported.current === key || getSessionItem(key, logger) !== null) {
      return;
    }
    reported.current = key;
    setSessionItem(key, "pending", logger);
    void (async (): Promise<void> => {
      try {
        const [
          { apiClient },
          { default: trackingEndpoints },
          { EngagementTypes },
        ] = await Promise.all([
          import("next-vibe/unified-ui/hooks/store"),
          import("@/leads/tracking/definition"),
          import("next-vibe/identity/lead/enum"),
        ]);
        const result = await apiClient.mutate(
          trackingEndpoints.POST,
          logger,
          user,
          {
            engagementType: EngagementTypes.LEAD_ATTRIBUTION,
            metadata: {
              abTestVariant: variant,
              customData: { experiment, locale, ...(model ? { model } : {}) },
            },
          },
          undefined,
          locale,
        );
        if (result.success) {
          setSessionItem(key, "recorded", logger);
          return;
        }
        logger.debug("Growth experiment exposure was not recorded", {
          experiment,
          variant,
          errorKey: result.errorType.errorKey,
        });
      } catch (error) {
        logger.debug("Growth experiment exposure could not start", {
          experiment,
          variant,
          error: String(error),
        });
      }
      removeSessionItem(key, logger);
    })();
  }, [experiment, locale, logger, model, user, variant]);
}
