/**
 * Outreach CRM Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Where a contact stands. SENT → REPLIED → INTERESTED → DEAL is the pipeline;
 * DECLINED / OPT_OUT / BOUNCED are exits.
 */
export const {
  enum: OutreachContactStatus,
  options: OutreachContactStatusOptions,
  Value: OutreachContactStatusValue,
} = createEnumOptions(scopedTranslation, {
  SENT: "enums.contactStatus.sent",
  REPLIED: "enums.contactStatus.replied",
  INTERESTED: "enums.contactStatus.interested",
  DEAL: "enums.contactStatus.deal",
  DECLINED: "enums.contactStatus.declined",
  OPT_OUT: "enums.contactStatus.optOut",
  BOUNCED: "enums.contactStatus.bounced",
});

export const OutreachContactStatusDB = [
  OutreachContactStatus.SENT,
  OutreachContactStatus.REPLIED,
  OutreachContactStatus.INTERESTED,
  OutreachContactStatus.DEAL,
  OutreachContactStatus.DECLINED,
  OutreachContactStatus.OPT_OUT,
  OutreachContactStatus.BOUNCED,
] as const;

/** What kind of outlet the contact runs. */
export const {
  enum: OutreachContactKind,
  options: OutreachContactKindOptions,
  Value: OutreachContactKindValue,
} = createEnumOptions(scopedTranslation, {
  CREATOR: "enums.contactKind.creator",
  NEWSLETTER: "enums.contactKind.newsletter",
  DIRECTORY: "enums.contactKind.directory",
  OTHER: "enums.contactKind.other",
});

export const OutreachContactKindDB = [
  OutreachContactKind.CREATOR,
  OutreachContactKind.NEWSLETTER,
  OutreachContactKind.DIRECTORY,
  OutreachContactKind.OTHER,
] as const;

/** Touch direction: we wrote them, or they wrote us. */
export const {
  enum: OutreachDirection,
  options: OutreachDirectionOptions,
  Value: OutreachDirectionValue,
} = createEnumOptions(scopedTranslation, {
  OUT: "enums.direction.out",
  IN: "enums.direction.in",
});

export const OutreachDirectionDB = [
  OutreachDirection.OUT,
  OutreachDirection.IN,
] as const;

/** Paid deal lifecycle. */
export const {
  enum: OutreachDealStatus,
  options: OutreachDealStatusOptions,
  Value: OutreachDealStatusValue,
} = createEnumOptions(scopedTranslation, {
  PROPOSED: "enums.dealStatus.proposed",
  COMMITTED: "enums.dealStatus.committed",
  PAID: "enums.dealStatus.paid",
  CANCELED: "enums.dealStatus.canceled",
});

export const OutreachDealStatusDB = [
  OutreachDealStatus.PROPOSED,
  OutreachDealStatus.COMMITTED,
  OutreachDealStatus.PAID,
  OutreachDealStatus.CANCELED,
] as const;

/** Pitch angle family. Raw angles stay free text; the family groups them. */
export const {
  enum: OutreachAngleGroup,
  options: OutreachAngleGroupOptions,
  Value: OutreachAngleGroupValue,
} = createEnumOptions(scopedTranslation, {
  AFFILIATE: "enums.angleGroup.affiliate",
  AUDIENCE_FIT: "enums.angleGroup.audienceFit",
  MISSION: "enums.angleGroup.mission",
  TRY_IT: "enums.angleGroup.tryIt",
  VIDEO: "enums.angleGroup.video",
  INFO_FIRST: "enums.angleGroup.infoFirst",
  NEGOTIATION: "enums.angleGroup.negotiation",
  OTHER: "enums.angleGroup.other",
});

export const OutreachAngleGroupDB = [
  OutreachAngleGroup.AFFILIATE,
  OutreachAngleGroup.AUDIENCE_FIT,
  OutreachAngleGroup.MISSION,
  OutreachAngleGroup.TRY_IT,
  OutreachAngleGroup.VIDEO,
  OutreachAngleGroup.INFO_FIRST,
  OutreachAngleGroup.NEGOTIATION,
  OutreachAngleGroup.OTHER,
] as const;

/** How a deal's results were matched to journeys. */
export const {
  enum: OutreachAttributionBasis,
  options: OutreachAttributionBasisOptions,
  Value: OutreachAttributionBasisValue,
} = createEnumOptions(scopedTranslation, {
  TRACKED: "enums.attributionBasis.tracked",
  CHANNEL: "enums.attributionBasis.channel",
  NONE: "enums.attributionBasis.none",
});

export const OutreachAttributionBasisDB = [
  OutreachAttributionBasis.TRACKED,
  OutreachAttributionBasis.CHANNEL,
  OutreachAttributionBasis.NONE,
] as const;

/** Deal currencies - same set the platform bills in. */
export const OutreachCurrencyOptions = [
  { value: "EUR", label: "enums.currency.eur" as const },
  { value: "USD", label: "enums.currency.usd" as const },
  { value: "PLN", label: "enums.currency.pln" as const },
];
