/**
 * Request fields for analytics windows.
 *
 * Spread into an endpoint's request `children`:
 *   children: { ...analyticsWindowFields, ...domainFilters }
 * and spread `analyticsTranslations` (./i18n/<locale>) into the endpoint's
 * i18n root so labels resolve in its scope. CLI: `--range=... --granularity=...
 * --from=YYYY-MM-DD --to=YYYY-MM-DD`.
 */

import { z } from "zod";

import { FieldDataType, WidgetType } from "../../core/definition/enums";
import { requestField } from "../_shared/utils-i18n";
import {
  AnalyticsGranularity,
  AnalyticsGranularityOptions,
  AnalyticsRange,
  AnalyticsRangeOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional();

export const analyticsWindowFields = {
  range: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "analytics.range.label",
    description: "analytics.range.description",
    options: AnalyticsRangeOptions,
    columns: 4,
    schema: z.enum(AnalyticsRange).default(AnalyticsRange.LAST_30_DAYS),
  }),
  granularity: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "analytics.granularity.label",
    description: "analytics.granularity.description",
    options: AnalyticsGranularityOptions,
    columns: 4,
    schema: z.enum(AnalyticsGranularity).default(AnalyticsGranularity.AUTO),
  }),
  from: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "analytics.from.label",
    description: "analytics.from.description",
    columns: 2,
    schema: dayString,
  }),
  to: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "analytics.to.label",
    description: "analytics.to.description",
    columns: 2,
    schema: dayString,
  }),
};
