/**
 * Commercial-use status of a media model's output, per the model license and
 * the provider terms on the route we serve it through. Descriptive only:
 * it never gates a request. Source: scratchpad/legal/commercial-use-*.md.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: CommercialUse,
  options: CommercialUseOptions,
  Value: CommercialUseValue,
} = createEnumOptions(scopedTranslation, {
  ALLOWED: "enums.status.allowed",
  RESTRICTED: "enums.status.restricted",
  UNCLEAR: "enums.status.unclear",
});

export const CommercialUseDB = [
  CommercialUse.ALLOWED,
  CommercialUse.RESTRICTED,
  CommercialUse.UNCLEAR,
] as const;

export const {
  enum: CommercialUseReason,
  options: CommercialUseReasonOptions,
  Value: CommercialUseReasonValue,
} = createEnumOptions(scopedTranslation, {
  OPEN_LICENSE: "enums.reason.openLicense",
  PROVIDER_TERMS: "enums.reason.providerTerms",
  NON_COMMERCIAL_LICENSE: "enums.reason.nonCommercialLicense",
  SEPARATE_LICENSE: "enums.reason.separateLicense",
  USE_LIMITS: "enums.reason.useLimits",
  COMMUNITY_LICENSE: "enums.reason.communityLicense",
  HOST_PERSONAL_USE: "enums.reason.hostPersonalUse",
  VENDOR_APPROVAL: "enums.reason.vendorApproval",
  TERMS_UNCONFIRMED: "enums.reason.termsUnconfirmed",
});

export const CommercialUseReasonDB = [
  CommercialUseReason.OPEN_LICENSE,
  CommercialUseReason.PROVIDER_TERMS,
  CommercialUseReason.NON_COMMERCIAL_LICENSE,
  CommercialUseReason.SEPARATE_LICENSE,
  CommercialUseReason.USE_LIMITS,
  CommercialUseReason.COMMUNITY_LICENSE,
  CommercialUseReason.HOST_PERSONAL_USE,
  CommercialUseReason.VENDOR_APPROVAL,
  CommercialUseReason.TERMS_UNCONFIRMED,
] as const;

export interface CommercialUseInfo {
  status: typeof CommercialUseValue;
  reason: typeof CommercialUseReasonValue;
}

/** Shorthands for the model definitions. */
export const commercialUse = {
  allowed: (
    reason:
      | typeof CommercialUseReason.OPEN_LICENSE
      | typeof CommercialUseReason.PROVIDER_TERMS,
  ): CommercialUseInfo => ({ status: CommercialUse.ALLOWED, reason }),
  restricted: (reason: typeof CommercialUseReasonValue): CommercialUseInfo => ({
    status: CommercialUse.RESTRICTED,
    reason,
  }),
  unclear: (reason: typeof CommercialUseReasonValue): CommercialUseInfo => ({
    status: CommercialUse.UNCLEAR,
    reason,
  }),
} as const;

/** True when the UI should warn (restricted or unclear). */
export function needsCommercialUseNotice(
  info: CommercialUseInfo | undefined,
): info is CommercialUseInfo {
  return info !== undefined && info.status !== CommercialUse.ALLOWED;
}

/** Terms section explaining rights in AI output (anchor on the terms page). */
export function commercialUseTermsHref(locale: string): string {
  return `/${locale}/story/terms-of-service#ai-output`;
}
