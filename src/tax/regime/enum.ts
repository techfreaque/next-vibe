import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: CompanyTaxRegime,
  options: CompanyTaxRegimeOptions,
  Value: CompanyTaxRegimeValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD: "regimes.standard",
  DE_SMALL_BUSINESS: "regimes.german",
  AT_SMALL_BUSINESS: "regimes.austrian",
  SK_NON_PAYER: "regimes.slovak",
  SK_REGISTERED_7: "regimes.slovakSection7",
  SK_REGISTERED_7A: "regimes.slovakSection7a",
});

export const CompanyTaxRegimeDB = [
  CompanyTaxRegime.STANDARD,
  CompanyTaxRegime.DE_SMALL_BUSINESS,
  CompanyTaxRegime.AT_SMALL_BUSINESS,
  CompanyTaxRegime.SK_NON_PAYER,
  CompanyTaxRegime.SK_REGISTERED_7,
  CompanyTaxRegime.SK_REGISTERED_7A,
] as const;
