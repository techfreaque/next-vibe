/**
 * Pure helpers behind the daily free limit card (out-of-credits-card.tsx):
 * which lighter model still fits what is left today, and when the limit
 * resets in the viewer's own clock.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { AgentEnvAvailability } from "../../../env-availability";
import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "../../../models/constants";
import {
  calculateCreditCost,
  isModelProviderAvailable,
} from "../../../models/models";
import {
  type ChatModelOption,
  chatModelOptionsPool,
  isLegacyChatModel,
} from "../../models";

/**
 * The strongest chat model this caller can run whose turn cost (same
 * estimate the server gates on) fits `remaining`. Null when none fits.
 */
export function findLighterModel({
  remaining,
  currentModelId,
  user,
  availability,
  models = chatModelOptionsPool,
}: {
  remaining: number;
  currentModelId: string | undefined;
  user: JwtPayloadType;
  availability: AgentEnvAvailability;
  models?: readonly ChatModelOption[];
}): { model: ChatModelOption; cost: number } | null {
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
  let best: { model: ChatModelOption; cost: number } | null = null;
  for (const model of models) {
    if (
      model.id === currentModelId ||
      (model.adminOnly === true && !isAdmin) ||
      model.outputs?.includes("text") !== true ||
      isLegacyChatModel(model.id) ||
      !isModelProviderAvailable(model, availability)
    ) {
      continue;
    }
    const cost = calculateCreditCost(
      model,
      DEFAULT_INPUT_TOKENS,
      DEFAULT_OUTPUT_TOKENS,
    );
    if (cost > remaining) {
      continue;
    }
    if (!best || cost > best.cost) {
      best = { model, cost };
    }
  }
  return best;
}

/** Reset time in the viewer's zone ("01:00") and how far away ("in 5 hours"). */
export function describeReset(
  resetsAt: string,
  locale: CountryLanguage,
  now: Date = new Date(),
): { time: string; relative: string } {
  const reset = new Date(resetsAt);
  const time = reset.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const minutes = Math.max(
    1,
    Math.ceil((reset.getTime() - now.getTime()) / 60_000),
  );
  const relativeFormat = new Intl.RelativeTimeFormat(locale, {
    numeric: "always",
  });
  const relative =
    minutes < 60
      ? relativeFormat.format(minutes, "minute")
      : relativeFormat.format(Math.round(minutes / 60), "hour");
  return { time, relative };
}
