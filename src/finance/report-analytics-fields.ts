import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { analyticsWindowFields } from "next-vibe/unified-ui/analytics/fields";
import { z } from "zod";

import { reportDay, reportPeriodRange } from "./report-period";

export const reportAnalyticsWindowFields = {
  ...analyticsWindowFields,
  range: {
    ...analyticsWindowFields.range,
    schema: z.enum(AnalyticsRange).default(AnalyticsRange.CUSTOM),
  },
  from: {
    ...analyticsWindowFields.from,
    schema: z.iso
      .date()
      .default(() => reportDay(reportPeriodRange("thisMonth").from)),
  },
  to: {
    ...analyticsWindowFields.to,
    schema: z.iso
      .date()
      .default(() => reportDay(reportPeriodRange("thisMonth").to)),
  },
};
