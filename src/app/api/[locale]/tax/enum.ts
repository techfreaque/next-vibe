/**
 * Tax enums
 * Defines the enums used in the tax module using createEnumOptions pattern
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Tax type enum
 * Classifies the type of tax applied to transactions
 */
export const {
  enum: TaxType,
  options: TaxTypeOptions,
  Value: TaxTypeValue,
} = createEnumOptions(scopedTranslation, {
  VAT: "enums.taxType.vat",
  GST: "enums.taxType.gst",
  SALES: "enums.taxType.sales",
  WITHHOLDING: "enums.taxType.withholding",
  NONE: "enums.taxType.none",
});

// Create DB enum array for Drizzle (text() constraint)
export const TaxTypeDB = [
  TaxType.VAT,
  TaxType.GST,
  TaxType.SALES,
  TaxType.WITHHOLDING,
  TaxType.NONE,
] as const;
