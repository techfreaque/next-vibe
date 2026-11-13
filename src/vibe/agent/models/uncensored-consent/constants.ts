/**
 * Uncensored-model consent: shared constants + pure checks.
 * Client-safe (no server imports): the chat composer, the API key page and
 * the server gates all decide with the same functions.
 */

import { ContentLevel, type ContentLevelValue } from "../../skills/enum";

/**
 * Version of the consent text. Bump it when the wording changes in substance:
 * everyone who agreed to an older version is asked again.
 */
export const UNCENSORED_CONSENT_VERSION = 1;

export const UNCENSORED_CONSENT_ALIAS = "uncensored-consent" as const;
export const UNCENSORED_CONSENT_AGREE_ALIAS =
  "uncensored-consent-agree" as const;
export const UNCENSORED_CONSENT_WITHDRAW_ALIAS =
  "uncensored-consent-withdraw" as const;

/**
 * Only the UNCENSORED tier is gated. MAINSTREAM keeps big-lab filters and
 * OPEN keeps light provider filters (it still refuses the hard stuff), so
 * neither can hand out what the consent covers.
 */
export function isUncensoredContent(
  content: typeof ContentLevelValue | undefined | null,
): boolean {
  return content === ContentLevel.UNCENSORED;
}

/** A stored consent counts only for the current consent text version. */
export function isConsentCurrent(
  consentedAt: Date | string | null | undefined,
  version: number | null | undefined,
): boolean {
  return (
    consentedAt !== null &&
    consentedAt !== undefined &&
    typeof version === "number" &&
    version >= UNCENSORED_CONSENT_VERSION
  );
}
