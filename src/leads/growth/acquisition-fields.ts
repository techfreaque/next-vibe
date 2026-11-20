import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  AcquisitionSourceFilter,
  AcquisitionSourceFilterOptions,
} from "./acquisition";
import { SpendCurrencyOptions } from "./enum";
import { scopedTranslation } from "./i18n";

const acquisitionText = z.string().max(253).optional();

export const acquisitionFilterFields = {
  sourceType: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "acquisition.fields.type",
    options: AcquisitionSourceFilterOptions,
    placeholder: "acquisition.sources.all",
    schema: z.enum(AcquisitionSourceFilter).optional(),
  }),
  source: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "acquisition.fields.source",
    schema: acquisitionText,
  }),
  medium: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "acquisition.fields.medium",
    schema: acquisitionText,
  }),
  campaign: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "acquisition.fields.campaign",
    schema: acquisitionText,
  }),
  referrerHost: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "acquisition.fields.referrerHost",
    schema: acquisitionText,
  }),
  refCode: requestField(scopedTranslation, {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "acquisition.fields.refCode",
    schema: acquisitionText,
  }),
};

export const acquisitionCurrencyField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.SELECT,
  label: "acquisition.fields.currency",
  options: SpendCurrencyOptions,
  placeholder: "enums.currency.eur",
  schema: z.enum(CurrenciesArr).optional(),
});
