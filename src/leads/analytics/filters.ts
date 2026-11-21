/**
 * Lead segment filters shared by the acquisition, funnel and abuse reports and
 * the lead list (drill-down target). Same field names everywhere, so a report
 * can hand its active filters straight to the list.
 *
 * Text filters match exactly; the value "(none)" (NONE_FILTER_VALUE) matches
 * leads where the dimension is empty.
 */

import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  BotFamily,
  BotFamilyOptions,
  FunnelReach,
  FunnelReachOptions,
  LeadChannelFilter,
  LeadChannelFilterOptions,
  LeadDeviceFilter,
  LeadDeviceFilterOptions,
  TrafficFilter,
  TrafficFilterOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const text = z.string().trim().max(253).optional();
const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional();

/** Segment filters (who). */
export const leadSegmentFields = {
  traffic: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "leadAnalytics.traffic.label",
    description: "leadAnalytics.traffic.description",
    options: TrafficFilterOptions,
    columns: 3,
    schema: z.enum(TrafficFilter).optional(),
  }),
  botFamily: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "leadAnalytics.botFamily.label",
    description: "leadAnalytics.botFamily.description",
    options: BotFamilyOptions,
    columns: 3,
    schema: z.enum(BotFamily).optional(),
  }),
  channelType: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "leadAnalytics.channel.label",
    description: "leadAnalytics.channel.description",
    options: LeadChannelFilterOptions,
    columns: 3,
    schema: z.enum(LeadChannelFilter).optional(),
  }),
  channel: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.channel.label",
    description: "leadAnalytics.filters.channel.description",
    columns: 3,
    schema: text,
  }),
  source: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.source.label",
    description: "leadAnalytics.filters.source.description",
    columns: 3,
    schema: text,
  }),
  medium: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.medium.label",
    description: "leadAnalytics.filters.medium.description",
    columns: 3,
    schema: text,
  }),
  campaign: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.campaign.label",
    description: "leadAnalytics.filters.campaign.description",
    columns: 3,
    schema: text,
  }),
  referrerHost: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.referrerHost.label",
    description: "leadAnalytics.filters.referrerHost.description",
    columns: 3,
    schema: text,
  }),
  landingPath: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.landingPath.label",
    description: "leadAnalytics.filters.landingPath.description",
    columns: 3,
    schema: text,
  }),
  refCode: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.refCode.label",
    description: "leadAnalytics.filters.refCode.description",
    columns: 3,
    schema: text,
  }),
  country: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.country.label",
    description: "leadAnalytics.filters.country.description",
    columns: 3,
    schema: text,
  }),
  localeCountry: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.localeCountry.label",
    description: "leadAnalytics.filters.localeCountry.description",
    columns: 3,
    schema: text,
  }),
  device: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "leadAnalytics.device.label",
    description: "leadAnalytics.device.description",
    options: LeadDeviceFilterOptions,
    columns: 3,
    schema: z.enum(LeadDeviceFilter).optional(),
  }),
  browser: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.browser.label",
    description: "leadAnalytics.filters.browser.description",
    columns: 3,
    schema: text,
  }),
  os: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.os.label",
    description: "leadAnalytics.filters.os.description",
    columns: 3,
    schema: text,
  }),
  ipPrefix: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.ipPrefix.label",
    description: "leadAnalytics.filters.ipPrefix.description",
    columns: 3,
    schema: text,
  }),
  uaFingerprint: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.uaFingerprint.label",
    description: "leadAnalytics.filters.uaFingerprint.description",
    columns: 3,
    schema: text,
  }),
};

/** List-only drill-down fields (when + how far). */
export const leadDrillFields = {
  createdFrom: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.createdFrom.label",
    description: "leadAnalytics.filters.createdFrom.description",
    columns: 3,
    schema: day,
  }),
  createdTo: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.createdTo.label",
    description: "leadAnalytics.filters.createdTo.description",
    columns: 3,
    schema: day,
  }),
  reached: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "leadAnalytics.reach.label",
    description: "leadAnalytics.reach.description",
    options: FunnelReachOptions,
    columns: 3,
    schema: z.enum(FunnelReach).optional(),
  }),
  reachedFrom: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.reachedFrom.label",
    description: "leadAnalytics.filters.reachedFrom.description",
    columns: 3,
    schema: day,
  }),
  reachedTo: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "leadAnalytics.filters.reachedTo.label",
    description: "leadAnalytics.filters.reachedTo.description",
    columns: 3,
    schema: day,
  }),
};

export interface LeadSegmentFilters {
  traffic?: (typeof TrafficFilter)[keyof typeof TrafficFilter];
  botFamily?: (typeof BotFamily)[keyof typeof BotFamily];
  channelType?: (typeof LeadChannelFilter)[keyof typeof LeadChannelFilter];
  channel?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrerHost?: string;
  landingPath?: string;
  refCode?: string;
  /** Visitor country from the IP (ISO alpha-2, ZZ = unknown) */
  country?: string;
  /** Region of the chosen site locale (e.g. DE, GLOBAL) */
  localeCountry?: string;
  device?: (typeof LeadDeviceFilter)[keyof typeof LeadDeviceFilter];
  browser?: string;
  os?: string;
  ipPrefix?: string;
  uaFingerprint?: string;
}

export interface LeadDrillFilters extends LeadSegmentFilters {
  createdFrom?: string;
  createdTo?: string;
  reached?: (typeof FunnelReach)[keyof typeof FunnelReach];
  /** The reached step happened in this window (YYYY-MM-DD, inclusive). */
  reachedFrom?: string;
  reachedTo?: string;
}

export const LEAD_SEGMENT_TEXT_KEYS = [
  "channel",
  "source",
  "medium",
  "campaign",
  "referrerHost",
  "landingPath",
  "refCode",
  "country",
  "localeCountry",
  "browser",
  "os",
  "ipPrefix",
  "uaFingerprint",
] as const;

/** Keep only the segment filters that narrow the result (drops ALL / empty). */
export function pickSegmentFilters(
  filters: LeadSegmentFilters,
): LeadSegmentFilters {
  const picked: LeadSegmentFilters = {};
  if (filters.traffic && filters.traffic !== TrafficFilter.ALL) {
    picked.traffic = filters.traffic;
  }
  if (filters.botFamily) {
    picked.botFamily = filters.botFamily;
  }
  if (filters.channelType && filters.channelType !== LeadChannelFilter.ALL) {
    picked.channelType = filters.channelType;
  }
  if (filters.device) {
    picked.device = filters.device;
  }
  for (const key of LEAD_SEGMENT_TEXT_KEYS) {
    const value = filters[key]?.trim();
    if (value) {
      picked[key] = value;
    }
  }
  return picked;
}

export function hasSegmentFilters(filters: LeadSegmentFilters): boolean {
  return Object.keys(pickSegmentFilters(filters)).length > 0;
}
