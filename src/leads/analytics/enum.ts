/**
 * Lead analytics enums (acquisition, funnel, abuse reports and the lead list
 * drill-down filters). Values are i18n keys of ./i18n.
 */

import { DeviceType } from "next-vibe/identity/lead/enum";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { ChannelType } from "../growth/enum";
import { scopedTranslation } from "./i18n";

/** Human vs bot traffic split, from leads.user_agent (see bot-sql.ts). */
export const {
  enum: TrafficFilter,
  options: TrafficFilterOptions,
  Value: TrafficFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "leadAnalytics.traffic.all",
  HUMANS: "leadAnalytics.traffic.humans",
  BOTS: "leadAnalytics.traffic.bots",
});

/** User agent family. HUMAN is the only non-bot family. */
export const {
  enum: BotFamily,
  options: BotFamilyOptions,
  Value: BotFamilyValue,
} = createEnumOptions(scopedTranslation, {
  HUMAN: "leadAnalytics.botFamily.human",
  META: "leadAnalytics.botFamily.meta",
  GOOGLE: "leadAnalytics.botFamily.google",
  BING: "leadAnalytics.botFamily.bing",
  OPENAI: "leadAnalytics.botFamily.openai",
  ANTHROPIC: "leadAnalytics.botFamily.anthropic",
  PERPLEXITY: "leadAnalytics.botFamily.perplexity",
  OTHER_AI: "leadAnalytics.botFamily.otherAi",
  SOCIAL_PREVIEW: "leadAnalytics.botFamily.socialPreview",
  AUTOMATION: "leadAnalytics.botFamily.automation",
  OTHER_BOT: "leadAnalytics.botFamily.otherBot",
  NO_UA: "leadAnalytics.botFamily.noUa",
});

/** First-touch channel type of the lead's journey; UNATTRIBUTED = no journey. */
export const {
  enum: LeadChannelFilter,
  options: LeadChannelFilterOptions,
  Value: LeadChannelFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "leadAnalytics.channel.all",
  CAMPAIGN: "leadAnalytics.channel.campaign",
  REFERRAL: "leadAnalytics.channel.referral",
  ORGANIC: "leadAnalytics.channel.organic",
  DIRECT: "leadAnalytics.channel.direct",
  UNATTRIBUTED: "leadAnalytics.channel.unattributed",
});

/** Journey channel type (growth enum) -> list filter value. */
export const CHANNEL_TYPE_TO_FILTER = {
  [ChannelType.CAMPAIGN]: LeadChannelFilter.CAMPAIGN,
  [ChannelType.REFERRAL]: LeadChannelFilter.REFERRAL,
  [ChannelType.ORGANIC]: LeadChannelFilter.ORGANIC,
  [ChannelType.DIRECT]: LeadChannelFilter.DIRECT,
} as const;

/** List filter value -> journey channel type (null = no journey). */
export const CHANNEL_FILTER_TO_TYPE = {
  [LeadChannelFilter.CAMPAIGN]: ChannelType.CAMPAIGN,
  [LeadChannelFilter.REFERRAL]: ChannelType.REFERRAL,
  [LeadChannelFilter.ORGANIC]: ChannelType.ORGANIC,
  [LeadChannelFilter.DIRECT]: ChannelType.DIRECT,
  [LeadChannelFilter.UNATTRIBUTED]: null,
} as const;

/** Device class of the lead (UNKNOWN includes leads without a parsed UA). */
export const {
  enum: LeadDeviceFilter,
  options: LeadDeviceFilterOptions,
  Value: LeadDeviceFilterValue,
} = createEnumOptions(scopedTranslation, {
  DESKTOP: "leadAnalytics.device.desktop",
  MOBILE: "leadAnalytics.device.mobile",
  TABLET: "leadAnalytics.device.tablet",
  BOT: "leadAnalytics.device.bot",
  UNKNOWN: "leadAnalytics.device.unknown",
});

export const DEVICE_FILTER_TO_TYPE = {
  [LeadDeviceFilter.DESKTOP]: DeviceType.DESKTOP,
  [LeadDeviceFilter.MOBILE]: DeviceType.MOBILE,
  [LeadDeviceFilter.TABLET]: DeviceType.TABLET,
  [LeadDeviceFilter.BOT]: DeviceType.BOT,
  [LeadDeviceFilter.UNKNOWN]: DeviceType.UNKNOWN,
} as const;

export const DEVICE_TYPE_TO_FILTER = {
  [DeviceType.DESKTOP]: LeadDeviceFilter.DESKTOP,
  [DeviceType.MOBILE]: LeadDeviceFilter.MOBILE,
  [DeviceType.TABLET]: LeadDeviceFilter.TABLET,
  [DeviceType.BOT]: LeadDeviceFilter.BOT,
  [DeviceType.UNKNOWN]: LeadDeviceFilter.UNKNOWN,
} as const;

/** Furthest funnel step a lead reached (list filter + funnel drill-down). */
export const {
  enum: FunnelReach,
  options: FunnelReachOptions,
  Value: FunnelReachValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "leadAnalytics.reach.any",
  VISITED: "leadAnalytics.reach.visited",
  SIGNED_UP: "leadAnalytics.reach.signedUp",
  EMAIL_CONFIRMED: "leadAnalytics.reach.emailConfirmed",
  FIRST_CHAT: "leadAnalytics.reach.firstChat",
  PAID: "leadAnalytics.reach.paid",
});

/** Dimension a breakdown groups by. */
export const {
  enum: LeadDimension,
  options: LeadDimensionOptions,
  Value: LeadDimensionValue,
} = createEnumOptions(scopedTranslation, {
  CHANNEL_TYPE: "leadAnalytics.dimension.channelType",
  CHANNEL: "leadAnalytics.dimension.channel",
  SOURCE: "leadAnalytics.dimension.source",
  MEDIUM: "leadAnalytics.dimension.medium",
  CAMPAIGN: "leadAnalytics.dimension.campaign",
  REFERRER_HOST: "leadAnalytics.dimension.referrerHost",
  LANDING_PATH: "leadAnalytics.dimension.landingPath",
  REF_CODE: "leadAnalytics.dimension.refCode",
  COUNTRY: "leadAnalytics.dimension.country",
  LOCALE_COUNTRY: "leadAnalytics.dimension.localeCountry",
  DEVICE: "leadAnalytics.dimension.device",
  BROWSER: "leadAnalytics.dimension.browser",
  OS: "leadAnalytics.dimension.os",
  BOT_FAMILY: "leadAnalytics.dimension.botFamily",
});

/** What the abuse report groups bursts by. */
export const {
  enum: AbuseGroupBy,
  options: AbuseGroupByOptions,
  Value: AbuseGroupByValue,
} = createEnumOptions(scopedTranslation, {
  IP_PREFIX: "leadAnalytics.abuse.groupBy.ipPrefix",
  UA_FINGERPRINT: "leadAnalytics.abuse.groupBy.uaFingerprint",
});

/** Filter value that matches an empty dimension ("(none)" rows). */
export const NONE_FILTER_VALUE = "(none)";
