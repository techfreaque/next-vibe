/**
 * Growth Funnel Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Funnel steps, in funnel order. */
export const {
  enum: FunnelStep,
  options: FunnelStepOptions,
  Value: FunnelStepValue,
} = createEnumOptions(scopedTranslation, {
  VISIT: "enums.funnelStep.visit",
  CHAT: "enums.funnelStep.chat",
  SIGNUP: "enums.funnelStep.signup",
  NEWSLETTER: "enums.funnelStep.newsletter",
  PAID: "enums.funnelStep.paid",
  RETAINED: "enums.funnelStep.retained",
});

export const FunnelStepDB = [
  FunnelStep.VISIT,
  FunnelStep.CHAT,
  FunnelStep.SIGNUP,
  FunnelStep.NEWSLETTER,
  FunnelStep.PAID,
  FunnelStep.RETAINED,
] as const;

/** Which touch a channel breakdown attributes to. */
export const {
  enum: AttributionTouch,
  options: AttributionTouchOptions,
  Value: AttributionTouchValue,
} = createEnumOptions(scopedTranslation, {
  FIRST: "enums.attributionTouch.first",
  LAST: "enums.attributionTouch.last",
});

export const AttributionTouchDB = [
  AttributionTouch.FIRST,
  AttributionTouch.LAST,
] as const;

/** How a touch reached us. Stored per touch on the journey. */
export const {
  enum: ChannelType,
  options: ChannelTypeOptions,
  Value: ChannelTypeValue,
} = createEnumOptions(scopedTranslation, {
  CAMPAIGN: "enums.channelType.campaign",
  REFERRAL: "enums.channelType.referral",
  ORGANIC: "enums.channelType.organic",
  DIRECT: "enums.channelType.direct",
});

export const ChannelTypeDB = [
  ChannelType.CAMPAIGN,
  ChannelType.REFERRAL,
  ChannelType.ORGANIC,
  ChannelType.DIRECT,
] as const;

/** Channel-type filter for data sources: one type, or all of them. */
export const {
  enum: ChannelTypeFilter,
  options: ChannelTypeFilterOptions,
  Value: ChannelTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.channelType.all",
  CAMPAIGN: "enums.channelType.campaign",
  REFERRAL: "enums.channelType.referral",
  ORGANIC: "enums.channelType.organic",
  DIRECT: "enums.channelType.direct",
});

export const ChannelTypeFilterDB = [
  ChannelTypeFilter.ALL,
  ChannelTypeFilter.CAMPAIGN,
  ChannelTypeFilter.REFERRAL,
  ChannelTypeFilter.ORGANIC,
  ChannelTypeFilter.DIRECT,
] as const;

/** What the first payment bought. */
export const {
  enum: PaidKind,
  options: PaidKindOptions,
  Value: PaidKindValue,
} = createEnumOptions(scopedTranslation, {
  SUBSCRIPTION: "enums.paidKind.subscription",
  PACK: "enums.paidKind.pack",
});

export const PaidKindDB = [PaidKind.SUBSCRIPTION, PaidKind.PACK] as const;

/** Spend currencies - same set the platform bills in. */
export const SpendCurrencyOptions = [
  { value: "EUR", label: "enums.currency.eur" as const },
  { value: "USD", label: "enums.currency.usd" as const },
  { value: "PLN", label: "enums.currency.pln" as const },
];
