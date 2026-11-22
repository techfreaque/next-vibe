"use client";

/**
 * Shared widget helpers of the lead analytics reports: dimension labels,
 * dimension -> filter mapping, filter chips, the segment filter panel and the
 * drill-down into the lead list.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { AnalyticsFilterChip } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import type { AnalyticsBucket } from "next-vibe/unified-ui/analytics/enum";
import { nextBucket, toDayKey } from "next-vibe/unified-ui/analytics/window";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import type { JSX } from "react";

import { UNKNOWN_COUNTRY } from "../geo/constants";
import {
  BotFamily,
  LeadChannelFilter,
  LeadDeviceFilter,
  LeadDimension,
  NONE_FILTER_VALUE,
  TrafficFilter,
} from "./enum";
import type { LeadDrillFilters, LeadSegmentFilters } from "./filters";
import {
  DIMENSION_LABEL,
  LEAD_SEGMENT_TEXT_KEYS,
  leadSegmentFields,
  pickSegmentFilters,
  type SegmentFilterKey,
} from "./filters";
import { scopedTranslation } from "./i18n";

type LeadDimensionValue = (typeof LeadDimension)[keyof typeof LeadDimension];
type SharedT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export function useLeadAnalyticsT(locale: CountryLanguage): SharedT {
  return scopedTranslation.scopedT(locale).t;
}

/** Human label of a breakdown key. */
export function dimensionValueLabel(key: string | null, t: SharedT): string {
  if (key === null || key === "") {
    return t("leadAnalytics.none");
  }
  if (isValidEnumValue(BotFamily, key)) {
    return t(key);
  }
  if (isValidEnumValue(LeadChannelFilter, key)) {
    return t(key);
  }
  if (isValidEnumValue(LeadDeviceFilter, key)) {
    return t(key);
  }
  if (key === UNKNOWN_COUNTRY) {
    return t("leadAnalytics.unknownCountry");
  }
  return key;
}

/** Muted explanation under a "(none)" breakdown row. */
export function noneRowHint(
  key: string | null,
  t: SharedT,
): string | undefined {
  return key === null || key === "" ? t("leadAnalytics.noneHint") : undefined;
}

/** Filter patch that selects the leads of one breakdown row. */
export function dimensionFilter(
  dimension: LeadDimensionValue,
  key: string | null,
): LeadSegmentFilters {
  const text = key ?? NONE_FILTER_VALUE;
  switch (dimension) {
    case LeadDimension.CHANNEL_TYPE:
      return isValidEnumValue(LeadChannelFilter, text)
        ? { channelType: text }
        : {};
    case LeadDimension.DEVICE:
      return isValidEnumValue(LeadDeviceFilter, text) ? { device: text } : {};
    case LeadDimension.BOT_FAMILY:
      return isValidEnumValue(BotFamily, text) ? { botFamily: text } : {};
    case LeadDimension.CHANNEL:
      return { channel: text };
    case LeadDimension.SOURCE:
      return { source: text };
    case LeadDimension.MEDIUM:
      return { medium: text };
    case LeadDimension.CAMPAIGN:
      return { campaign: text };
    case LeadDimension.REFERRER_HOST:
      return { referrerHost: text };
    case LeadDimension.LANDING_PATH:
      return { landingPath: text };
    case LeadDimension.REF_CODE:
      return { refCode: text };
    case LeadDimension.COUNTRY:
      return { country: text };
    case LeadDimension.LOCALE_COUNTRY:
      return { localeCountry: text };
    case LeadDimension.BROWSER:
      return { browser: text };
    case LeadDimension.OS:
      return { os: text };
    default:
      return {};
  }
}

const CHIP_LABEL = {
  traffic: "leadAnalytics.traffic.label",
  botFamily: "leadAnalytics.botFamily.label",
  channelType: "leadAnalytics.channel.label",
  device: "leadAnalytics.device.label",
  channel: "leadAnalytics.filters.channel.label",
  source: "leadAnalytics.filters.source.label",
  medium: "leadAnalytics.filters.medium.label",
  campaign: "leadAnalytics.filters.campaign.label",
  referrerHost: "leadAnalytics.filters.referrerHost.label",
  landingPath: "leadAnalytics.filters.landingPath.label",
  refCode: "leadAnalytics.filters.refCode.label",
  country: "leadAnalytics.filters.country.label",
  localeCountry: "leadAnalytics.filters.localeCountry.label",
  browser: "leadAnalytics.filters.browser.label",
  os: "leadAnalytics.filters.os.label",
  ipPrefix: "leadAnalytics.filters.ipPrefix.label",
  uaFingerprint: "leadAnalytics.filters.uaFingerprint.label",
} as const;

/** Removable chips for every active segment filter. */
export function segmentChips(
  filters: LeadSegmentFilters,
  t: SharedT,
  onRemove: (key: SegmentFilterKey) => void,
): AnalyticsFilterChip[] {
  const picked = pickSegmentFilters(filters);
  const chips: AnalyticsFilterChip[] = [];
  const push = (key: SegmentFilterKey, value: string): void => {
    chips.push({
      key,
      label: t(CHIP_LABEL[key]),
      value,
      onRemove: () => onRemove(key),
    });
  };
  if (picked.traffic && picked.traffic !== TrafficFilter.ALL) {
    push("traffic", t(picked.traffic));
  }
  if (picked.botFamily) {
    push("botFamily", t(picked.botFamily));
  }
  if (picked.channelType) {
    push("channelType", t(picked.channelType));
  }
  if (picked.device) {
    push("device", t(picked.device));
  }
  for (const key of LEAD_SEGMENT_TEXT_KEYS) {
    const value = picked[key];
    if (value) {
      push(key, value === NONE_FILTER_VALUE ? t("leadAnalytics.none") : value);
    }
  }
  return chips;
}

/** Inclusive day range of one chart bucket. */
export function bucketDays(
  bucketKey: string,
  bucket: AnalyticsBucket,
): { from: string; to: string } {
  const start = new Date(`${bucketKey}T00:00:00.000Z`);
  const end = nextBucket(start, bucket);
  return {
    from: bucketKey,
    to: toDayKey(new Date(end.getTime() - 86_400_000)),
  };
}

/** Open the lead list filtered like the report. */
export function useLeadDrill(): (filters: LeadDrillFilters) => void {
  const navigate = useRelatedEntityNavigation();
  return (filters) =>
    navigate(
      () => import("@/leads/list/definition").then((m) => m.default.GET),
      { data: { ...pickSegmentFilters(filters), ...drillOnly(filters) } },
    );
}

function drillOnly(filters: LeadDrillFilters): LeadDrillFilters {
  return {
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    reached: filters.reached,
    reachedFrom: filters.reachedFrom,
    reachedTo: filters.reachedTo,
  };
}

/** Editable segment filters (all server-side). */
export function SegmentFilterPanel({
  onApply,
  applyLabel,
}: {
  onApply: () => void;
  applyLabel: string;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-3">
      <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-4">
        <SelectFieldWidget
          fieldName="traffic"
          field={leadSegmentFields.traffic}
        />
        <SelectFieldWidget
          fieldName="botFamily"
          field={leadSegmentFields.botFamily}
        />
        <SelectFieldWidget
          fieldName="channelType"
          field={leadSegmentFields.channelType}
        />
        <SelectFieldWidget
          fieldName="device"
          field={leadSegmentFields.device}
        />
        <TextFieldWidget
          fieldName="channel"
          field={leadSegmentFields.channel}
        />
        <TextFieldWidget fieldName="source" field={leadSegmentFields.source} />
        <TextFieldWidget fieldName="medium" field={leadSegmentFields.medium} />
        <TextFieldWidget
          fieldName="campaign"
          field={leadSegmentFields.campaign}
        />
        <TextFieldWidget
          fieldName="referrerHost"
          field={leadSegmentFields.referrerHost}
        />
        <TextFieldWidget
          fieldName="landingPath"
          field={leadSegmentFields.landingPath}
        />
        <TextFieldWidget
          fieldName="refCode"
          field={leadSegmentFields.refCode}
        />
        <TextFieldWidget
          fieldName="country"
          field={leadSegmentFields.country}
        />
        <TextFieldWidget
          fieldName="localeCountry"
          field={leadSegmentFields.localeCountry}
        />
        <TextFieldWidget
          fieldName="browser"
          field={leadSegmentFields.browser}
        />
        <TextFieldWidget fieldName="os" field={leadSegmentFields.os} />
        <TextFieldWidget
          fieldName="ipPrefix"
          field={leadSegmentFields.ipPrefix}
        />
        <TextFieldWidget
          fieldName="uaFingerprint"
          field={leadSegmentFields.uaFingerprint}
        />
      </Div>
      <Div>
        <Button type="button" variant="secondary" size="sm" onClick={onApply}>
          {applyLabel}
        </Button>
      </Div>
    </Div>
  );
}

/** Small labelled select for report toolbars (no form-field chrome). */
export function CompactSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: ReadonlyArray<{ value: TValue; label: string }>;
  onChange: (next: TValue) => void;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-1.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Select<TValue> value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-auto min-w-24 gap-2 text-xs">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Div>
  );
}

/** Most useful dimensions first; every one is a single click. */
const DIMENSION_TABS = [
  LeadDimension.CHANNEL,
  LeadDimension.CHANNEL_TYPE,
  LeadDimension.SOURCE,
  LeadDimension.REFERRER_HOST,
  LeadDimension.CAMPAIGN,
  LeadDimension.LANDING_PATH,
  LeadDimension.REF_CODE,
  LeadDimension.COUNTRY,
  LeadDimension.LOCALE_COUNTRY,
  LeadDimension.DEVICE,
  LeadDimension.BROWSER,
  LeadDimension.OS,
  LeadDimension.MEDIUM,
] as const;

/** One-click dimension switcher shown above breakdown tables. */
export function DimensionTabs({
  value,
  onChange,
  t,
  ariaLabel,
}: {
  value: LeadDimensionValue;
  onChange: (next: LeadDimensionValue) => void;
  t: SharedT;
  ariaLabel: string;
}): JSX.Element {
  return (
    <Div
      role="tablist"
      aria-label={ariaLabel}
      className="flex max-w-full flex-wrap gap-1"
    >
      {DIMENSION_TABS.map((dimension) => (
        <Button
          key={dimension}
          type="button"
          role="tab"
          aria-selected={dimension === value}
          variant={dimension === value ? "secondary" : "ghost"}
          size="sm"
          className="h-7 shrink-0 px-2.5 text-xs"
          onClick={() => onChange(dimension)}
        >
          {t(DIMENSION_LABEL[dimension])}
        </Button>
      ))}
    </Div>
  );
}
