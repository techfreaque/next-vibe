/**
 * Country compliance profiles.
 *
 * One profile per supported country, picked by the company's country.
 * Profiles hold legal data (rates with effective dates, regimes, invoice
 * rules, statutory outputs). Unknown countries use the generic profile, so
 * the ERP keeps working anywhere; Germany and Austria keep their existing
 * behaviour and only gain the shared invoice checks.
 *
 * Tooling, not tax advice: the data mirrors the cited laws as researched in
 * scratchpad/erp/SLOVAK-COMPLIANCE.md and must be reviewed when laws change.
 */

import { CompanyTaxRegime, type CompanyTaxRegimeValue } from "../regime/enum";
import { VatTreatment, type VatTreatmentValue } from "./enum";

export const PROFILE_COUNTRIES = ["AT", "DE", "SK", "XX"] as const;
export type ProfileCountry = (typeof PROFILE_COUNTRIES)[number];

export type VatRateKind = "standard" | "reduced" | "zero";

export interface ProfileVatRate {
  /** Stable tax rate code seeded per company (tax_rates.code). */
  code: string;
  /** Rate name as printed on documents in the jurisdiction language. */
  name: string;
  rate: number;
  kind: VatRateKind;
  /** First day the rate applies (inclusive, ISO date), null = always. */
  validFrom: string | null;
  /** Last day the rate applies (inclusive, ISO date), null = open ended. */
  validTo: string | null;
  isDefault: boolean;
}

export interface CountryProfile {
  country: ProfileCountry;
  /** coa_templates.country used for chart setup. */
  chartTemplate: ProfileCountry;
  vatRates: readonly ProfileVatRate[];
  /** Regimes a company of this country may elect. */
  regimes: readonly (typeof CompanyTaxRegimeValue)[];
  /** Regimes that hold a VAT id and must print it. */
  vatIdRegimes: readonly (typeof CompanyTaxRegimeValue)[];
  invoice: {
    requireIssuerAddress: boolean;
    requireIssuerRegistration: boolean;
    requireIssuerTaxId: boolean;
    /** Days after the supply date by which the invoice must be issued. */
    issueDeadlineDays: number | null;
    /** Reject line rates that are not legal on the supply date. */
    enforceRates: boolean;
    /** Treatments allowed per regime (STANDARD = VAT payer). */
    treatments: Partial<
      Record<
        typeof CompanyTaxRegimeValue,
        readonly (typeof VatTreatmentValue)[]
      >
    >;
    /** Legal note printed on the document per treatment, jurisdiction language. */
    notes: Partial<Record<typeof VatTreatmentValue, string>>;
  };
  identifiers: "SK" | "generic";
  vatRegistration: {
    /** Domestic turnover threshold for mandatory VAT registration. */
    threshold: number | null;
    /** Turnover above which registration applies from that supply. */
    immediateThreshold: number | null;
  };
  /** Online fiscal receipt system for cash and card sales, if any. */
  fiscalReceipts: "EKASA" | null;
  eInvoicing: {
    /** Day domestic B2B structured e-invoices become mandatory, if enacted. */
    mandatoryFrom: string | null;
  };
  /** Statutory VAT return layout, if the ERP can prepare it. */
  vatReturn: "SK_DPH" | null;
  /** Statutory financial statement layout, if available. */
  statements: "SK_MUJ" | null;
}

const ALL_TREATMENTS = [
  VatTreatment.DOMESTIC,
  VatTreatment.REVERSE_CHARGE_DOMESTIC,
  VatTreatment.EU_SERVICES_REVERSE_CHARGE,
  VatTreatment.EU_GOODS_EXEMPT,
  VatTreatment.EXPORT_EXEMPT,
  VatTreatment.EXEMPT,
] as const;

const SK_PROFILE: CountryProfile = {
  country: "SK",
  chartTemplate: "SK",
  vatRates: [
    // Zákon 222/2004 § 27, rates since 1 January 2025 (zákon 278/2024).
    {
      code: "SK_VAT_23",
      name: "DPH 23 %",
      rate: 0.23,
      kind: "standard",
      validFrom: "2025-01-01",
      validTo: null,
      isDefault: true,
    },
    {
      code: "SK_VAT_19",
      name: "DPH 19 %",
      rate: 0.19,
      kind: "reduced",
      validFrom: "2025-01-01",
      validTo: null,
      isDefault: false,
    },
    {
      code: "SK_VAT_5",
      name: "DPH 5 %",
      rate: 0.05,
      kind: "reduced",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
    // Rates before 2025, kept for corrections of older supplies.
    {
      code: "SK_VAT_20",
      name: "DPH 20 %",
      rate: 0.2,
      kind: "standard",
      validFrom: null,
      validTo: "2024-12-31",
      isDefault: false,
    },
    {
      code: "SK_VAT_10",
      name: "DPH 10 %",
      rate: 0.1,
      kind: "reduced",
      validFrom: null,
      validTo: "2024-12-31",
      isDefault: false,
    },
    {
      code: "SK_VAT_0",
      name: "Bez DPH (oslobodené, prenesenie)",
      rate: 0,
      kind: "zero",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
  ],
  regimes: [
    CompanyTaxRegime.STANDARD,
    CompanyTaxRegime.SK_NON_PAYER,
    CompanyTaxRegime.SK_REGISTERED_7,
    CompanyTaxRegime.SK_REGISTERED_7A,
  ],
  vatIdRegimes: [
    CompanyTaxRegime.STANDARD,
    CompanyTaxRegime.SK_REGISTERED_7,
    CompanyTaxRegime.SK_REGISTERED_7A,
  ],
  invoice: {
    requireIssuerAddress: true,
    requireIssuerRegistration: true,
    requireIssuerTaxId: true,
    // § 73 zákona o DPH: within 15 days after the supply.
    issueDeadlineDays: 15,
    enforceRates: true,
    treatments: {
      [CompanyTaxRegime.STANDARD]: ALL_TREATMENTS,
      [CompanyTaxRegime.SK_NON_PAYER]: [VatTreatment.DOMESTIC],
      [CompanyTaxRegime.SK_REGISTERED_7]: [VatTreatment.DOMESTIC],
      // § 7a: services to EU taxable persons are invoiced without VAT,
      // the customer accounts for it (reverse charge).
      [CompanyTaxRegime.SK_REGISTERED_7A]: [
        VatTreatment.DOMESTIC,
        VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      ],
    },
    notes: {
      [VatTreatment.REVERSE_CHARGE_DOMESTIC]:
        "Prenesenie daňovej povinnosti (§ 69 ods. 12 zákona č. 222/2004 Z. z.)",
      [VatTreatment.EU_SERVICES_REVERSE_CHARGE]:
        "Prenesenie daňovej povinnosti",
      [VatTreatment.EU_GOODS_EXEMPT]:
        "Oslobodenie od dane podľa § 43 zákona č. 222/2004 Z. z.",
      [VatTreatment.EXPORT_EXEMPT]:
        "Oslobodenie od dane podľa § 47 zákona č. 222/2004 Z. z.",
      [VatTreatment.EXEMPT]:
        "Oslobodené od dane podľa zákona č. 222/2004 Z. z.",
    },
  },
  identifiers: "SK",
  vatRegistration: { threshold: 50_000, immediateThreshold: 62_500 },
  fiscalReceipts: "EKASA",
  eInvoicing: { mandatoryFrom: "2027-01-01" },
  vatReturn: "SK_DPH",
  statements: "SK_MUJ",
};

const DE_PROFILE: CountryProfile = {
  country: "DE",
  chartTemplate: "DE",
  vatRates: [
    {
      code: "DE_VAT_19",
      name: "MwSt 19%",
      rate: 0.19,
      kind: "standard",
      validFrom: null,
      validTo: null,
      isDefault: true,
    },
    {
      code: "DE_VAT_7",
      name: "MwSt 7%",
      rate: 0.07,
      kind: "reduced",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
    {
      code: "DE_VAT_0",
      name: "Steuerfrei",
      rate: 0,
      kind: "zero",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
  ],
  regimes: [CompanyTaxRegime.STANDARD, CompanyTaxRegime.DE_SMALL_BUSINESS],
  vatIdRegimes: [CompanyTaxRegime.STANDARD],
  invoice: {
    requireIssuerAddress: false,
    requireIssuerRegistration: false,
    requireIssuerTaxId: false,
    issueDeadlineDays: null,
    enforceRates: false,
    treatments: {
      [CompanyTaxRegime.STANDARD]: ALL_TREATMENTS,
      [CompanyTaxRegime.DE_SMALL_BUSINESS]: [VatTreatment.DOMESTIC],
    },
    notes: {
      [VatTreatment.REVERSE_CHARGE_DOMESTIC]:
        "Steuerschuldnerschaft des Leistungsempfängers",
      [VatTreatment.EU_SERVICES_REVERSE_CHARGE]:
        "Steuerschuldnerschaft des Leistungsempfängers",
      [VatTreatment.EU_GOODS_EXEMPT]:
        "Steuerfreie innergemeinschaftliche Lieferung (§ 4 Nr. 1b UStG)",
      [VatTreatment.EXPORT_EXEMPT]:
        "Steuerfreie Ausfuhrlieferung (§ 4 Nr. 1a UStG)",
      [VatTreatment.EXEMPT]: "Steuerfreie Leistung",
    },
  },
  identifiers: "generic",
  vatRegistration: { threshold: null, immediateThreshold: null },
  fiscalReceipts: null,
  eInvoicing: { mandatoryFrom: null },
  vatReturn: null,
  statements: null,
};

const AT_PROFILE: CountryProfile = {
  country: "AT",
  chartTemplate: "AT",
  vatRates: [
    {
      code: "AT_VAT_20",
      name: "MwSt 20%",
      rate: 0.2,
      kind: "standard",
      validFrom: null,
      validTo: null,
      isDefault: true,
    },
    {
      code: "AT_VAT_10",
      name: "MwSt 10%",
      rate: 0.1,
      kind: "reduced",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
    {
      code: "AT_VAT_13",
      name: "MwSt 13%",
      rate: 0.13,
      kind: "reduced",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
    {
      code: "AT_VAT_0",
      name: "Steuerfrei",
      rate: 0,
      kind: "zero",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
  ],
  regimes: [CompanyTaxRegime.STANDARD, CompanyTaxRegime.AT_SMALL_BUSINESS],
  vatIdRegimes: [CompanyTaxRegime.STANDARD],
  invoice: {
    requireIssuerAddress: false,
    requireIssuerRegistration: false,
    requireIssuerTaxId: false,
    issueDeadlineDays: null,
    enforceRates: false,
    treatments: {
      [CompanyTaxRegime.STANDARD]: ALL_TREATMENTS,
      [CompanyTaxRegime.AT_SMALL_BUSINESS]: [VatTreatment.DOMESTIC],
    },
    notes: {
      [VatTreatment.REVERSE_CHARGE_DOMESTIC]:
        "Übergang der Steuerschuld auf den Leistungsempfänger",
      [VatTreatment.EU_SERVICES_REVERSE_CHARGE]:
        "Übergang der Steuerschuld auf den Leistungsempfänger",
      [VatTreatment.EU_GOODS_EXEMPT]:
        "Steuerfreie innergemeinschaftliche Lieferung (Art. 6 Abs. 1 UStG 1994)",
      [VatTreatment.EXPORT_EXEMPT]:
        "Steuerfreie Ausfuhrlieferung (§ 6 Abs. 1 Z 1 UStG 1994)",
      [VatTreatment.EXEMPT]: "Steuerfreie Leistung",
    },
  },
  identifiers: "generic",
  vatRegistration: { threshold: null, immediateThreshold: null },
  fiscalReceipts: null,
  eInvoicing: { mandatoryFrom: null },
  vatReturn: null,
  statements: null,
};

const GENERIC_PROFILE: CountryProfile = {
  country: "XX",
  chartTemplate: "XX",
  vatRates: [
    {
      code: "VAT_20",
      name: "VAT 20%",
      rate: 0.2,
      kind: "standard",
      validFrom: null,
      validTo: null,
      isDefault: true,
    },
    {
      code: "VAT_10",
      name: "VAT 10%",
      rate: 0.1,
      kind: "reduced",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
    {
      code: "VAT_0",
      name: "Tax Exempt",
      rate: 0,
      kind: "zero",
      validFrom: null,
      validTo: null,
      isDefault: false,
    },
  ],
  regimes: [CompanyTaxRegime.STANDARD],
  vatIdRegimes: [CompanyTaxRegime.STANDARD],
  invoice: {
    requireIssuerAddress: false,
    requireIssuerRegistration: false,
    requireIssuerTaxId: false,
    issueDeadlineDays: null,
    enforceRates: false,
    treatments: { [CompanyTaxRegime.STANDARD]: ALL_TREATMENTS },
    notes: {
      [VatTreatment.REVERSE_CHARGE_DOMESTIC]: "Reverse charge",
      [VatTreatment.EU_SERVICES_REVERSE_CHARGE]: "Reverse charge",
      [VatTreatment.EU_GOODS_EXEMPT]: "Exempt intra-community supply",
      [VatTreatment.EXPORT_EXEMPT]: "Exempt export supply",
      [VatTreatment.EXEMPT]: "VAT exempt supply",
    },
  },
  identifiers: "generic",
  vatRegistration: { threshold: null, immediateThreshold: null },
  fiscalReceipts: null,
  eInvoicing: { mandatoryFrom: null },
  vatReturn: null,
  statements: null,
};

const PROFILES: Record<ProfileCountry, CountryProfile> = {
  AT: AT_PROFILE,
  DE: DE_PROFILE,
  SK: SK_PROFILE,
  XX: GENERIC_PROFILE,
};

/** Normalizes a stored company country to a profile country. */
export function profileCountry(
  country: string | null | undefined,
): ProfileCountry {
  const normalized = country?.trim().toUpperCase();
  return PROFILE_COUNTRIES.find((code) => code === normalized) ?? "XX";
}

export function getCountryProfile(
  country: string | null | undefined,
): CountryProfile {
  return PROFILES[profileCountry(country)];
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rates of a profile that apply on a given day. */
export function vatRatesOn(
  profile: CountryProfile,
  day: Date,
): readonly ProfileVatRate[] {
  const iso = isoDay(day);
  return profile.vatRates.filter(
    (rate) =>
      (rate.validFrom === null || rate.validFrom <= iso) &&
      (rate.validTo === null || rate.validTo >= iso),
  );
}

/** True when a line rate (fraction, 0.23 = 23 %) is legal on that day. */
export function isVatRateValidOn(
  profile: CountryProfile,
  rate: number,
  day: Date,
): boolean {
  return vatRatesOn(profile, day).some(
    (candidate) => Math.abs(candidate.rate - rate) < 0.000_05,
  );
}
