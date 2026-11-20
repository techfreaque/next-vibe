import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

export const { enum: AcquisitionSource } = createEnumOptions(
  scopedTranslation,
  {
    CREATOR: "acquisition.sources.creator",
    REFERRAL: "acquisition.sources.referral",
    CAMPAIGN: "acquisition.sources.campaign",
    SEARCH: "acquisition.sources.search",
    REFERRER: "acquisition.sources.referrer",
    DIRECT: "acquisition.sources.direct",
    UNATTRIBUTED: "acquisition.sources.unattributed",
  },
);

export const {
  enum: AcquisitionSourceFilter,
  options: AcquisitionSourceFilterOptions,
} = createEnumOptions(scopedTranslation, {
  ALL: "acquisition.sources.all",
  ...AcquisitionSource,
});

export const { enum: AcquisitionMetric, options: AcquisitionMetricOptions } =
  createEnumOptions(scopedTranslation, {
    VISITS: "acquisition.metrics.visits",
    LEADS: "acquisition.metrics.leads",
    SIGNUPS: "acquisition.metrics.signups",
    FIRST_CHATS: "acquisition.metrics.firstChats",
    PAYERS: "acquisition.metrics.payers",
    REVENUE: "acquisition.metrics.revenue",
  });

export type AcquisitionMetric =
  (typeof AcquisitionMetric)[keyof typeof AcquisitionMetric];

export interface AcquisitionFilters {
  sourceType?: (typeof AcquisitionSourceFilter)[keyof typeof AcquisitionSourceFilter];
  source?: string;
  medium?: string;
  campaign?: string;
  referrerHost?: string;
  refCode?: string;
}

export const acquisitionDimensions = {
  sourceType: z.enum(AcquisitionSource),
  source: z.string().nullable(),
  medium: z.string().nullable(),
  campaign: z.string().nullable(),
  referrerHost: z.string().nullable(),
  refCode: z.string().nullable(),
};

export const acquisitionMetrics = z.object({
  visits: z.number(),
  leads: z.number(),
  signups: z.number(),
  firstChats: z.number(),
  payers: z.number(),
  revenue: z.number(),
});

export const acquisitionSummaryRow = acquisitionMetrics.extend(
  acquisitionDimensions,
);

export const acquisitionLeadRow = acquisitionSummaryRow
  .omit({ leads: true })
  .extend({
    currency: z.enum(CurrenciesArr),
  });
