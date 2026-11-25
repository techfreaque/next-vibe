import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "../i18n";

export const {
  enum: TaxReportDirection,
  options: TaxReportDirectionOptions,
  Value: TaxReportDirectionValue,
} = createEnumOptions(scopedTranslation, {
  SALES: "enums.reportDirection.sales",
  POS_SALES: "enums.reportDirection.posSales",
  CREDIT_NOTES: "enums.reportDirection.creditNotes",
  PURCHASES: "enums.reportDirection.purchases",
});

export const TaxReportDirectionDB = [
  TaxReportDirection.SALES,
  TaxReportDirection.POS_SALES,
  TaxReportDirection.CREDIT_NOTES,
  TaxReportDirection.PURCHASES,
] as const;
