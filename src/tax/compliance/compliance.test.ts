import { describe, expect, it } from "bun:test";

import { CompanyTaxRegime } from "../regime/enum";
import { ComplianceIssue, ComplianceSeverity, VatTreatment } from "./enum";
import {
  checkEuVatId,
  checkSlovakDic,
  checkSlovakIco,
  checkSlovakVatId,
  vatIdCountry,
} from "./identifiers";
import {
  checkInvoiceCompliance,
  hasBlockingFinding,
  invoiceLegalNotes,
  type PartyIdentity,
} from "./invoice-rules";
import {
  getCountryProfile,
  isVatRateValidOn,
  profileCountry,
  vatRatesOn,
} from "./profiles";

const sk = getCountryProfile("SK");

const issuer: PartyIdentity = {
  name: "Demo s.r.o.",
  addressLine1: "Hlavná 1",
  city: "Bratislava",
  postalCode: "811 01",
  country: "SK",
  registrationNumber: "35763469",
  taxId: "2020273893",
  vatNumber: "SK2020273893",
};

const czCustomer: PartyIdentity = {
  name: "Zákazník s.r.o.",
  addressLine1: "Národní 2",
  city: "Praha",
  postalCode: "110 00",
  country: "CZ",
  registrationNumber: null,
  taxId: null,
  vatNumber: "CZ12345678",
};

const day = (iso: string): Date => new Date(`${iso}T00:00:00.000Z`);

describe("Slovak identifiers", () => {
  it("validates IČO check digits", () => {
    expect(checkSlovakIco("35763469")).toBe("ok");
    expect(checkSlovakIco("35 763 469")).toBe("ok");
    expect(checkSlovakIco("35763468")).toBe("invalid");
    expect(checkSlovakIco("")).toBe("missing");
  });
  it("validates DIČ and IČ DPH", () => {
    expect(checkSlovakDic("2020273893")).toBe("ok");
    expect(checkSlovakDic("0020273893")).toBe("invalid");
    expect(checkSlovakVatId("SK2020273893")).toBe("ok");
    expect(checkSlovakVatId("SK2022549813")).toBe("invalid");
    expect(checkSlovakVatId("2020273893")).toBe("invalid");
    expect(checkEuVatId("CZ12345678")).toBe("ok");
    expect(vatIdCountry("EL123456789")).toBe("GR");
  });
});

describe("Slovak VAT rates", () => {
  it("switches from 20 / 10 % to 23 / 19 / 5 % on 1 January 2025", () => {
    const before = vatRatesOn(sk, day("2024-12-31")).map((rate) => rate.rate);
    const after = vatRatesOn(sk, day("2025-01-01")).map((rate) => rate.rate);
    expect(before).toContain(0.2);
    expect(before).toContain(0.1);
    expect(before).not.toContain(0.23);
    expect(after).toEqual(expect.arrayContaining([0.23, 0.19, 0.05, 0]));
    expect(after).not.toContain(0.2);
    expect(isVatRateValidOn(sk, 0.2, day("2026-11-26"))).toBe(false);
    expect(isVatRateValidOn(sk, 0.23, day("2026-11-26"))).toBe(true);
  });
  it("keeps unknown countries on the generic profile", () => {
    expect(profileCountry("sk")).toBe("SK");
    expect(profileCountry("FR")).toBe("XX");
    expect(getCountryProfile(null).vatReturn).toBeNull();
  });
});

describe("Slovak invoice compliance", () => {
  const base = {
    profile: sk,
    regime: CompanyTaxRegime.STANDARD,
    issuer,
    customer: null,
    treatment: VatTreatment.DOMESTIC,
    supplyDate: day("2026-11-20"),
    issueDate: day("2026-11-26"),
    lineRates: [0.23, 0.05],
  };

  it("accepts a domestic invoice with current rates", () => {
    expect(checkInvoiceCompliance(base)).toEqual([]);
  });

  it("blocks missing issuer identity", () => {
    const findings = checkInvoiceCompliance({
      ...base,
      issuer: { ...issuer, registrationNumber: null, vatNumber: "SK123" },
    });
    expect(findings.map((finding) => finding.code)).toEqual([
      ComplianceIssue.ISSUER_REGISTRATION_MISSING,
      ComplianceIssue.ISSUER_VAT_ID_INVALID,
    ]);
    expect(hasBlockingFinding(findings)).toBe(true);
  });

  it("blocks the old 20 % rate after 2024", () => {
    const findings = checkInvoiceCompliance({ ...base, lineRates: [0.2] });
    expect(findings).toEqual([
      {
        code: ComplianceIssue.RATE_NOT_VALID_ON_DATE,
        severity: ComplianceSeverity.ERROR,
        params: { rate: "20", date: "2026-11-20" },
      },
    ]);
  });

  it("allows 20 % for a supply in 2024", () => {
    expect(
      checkInvoiceCompliance({
        ...base,
        supplyDate: day("2024-12-10"),
        issueDate: day("2024-12-20"),
        lineRates: [0.2],
      }),
    ).toEqual([]);
  });

  it("requires an EU customer VAT id and zero rate for reverse charge", () => {
    const ok = checkInvoiceCompliance({
      ...base,
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      customer: czCustomer,
      lineRates: [0],
    });
    expect(ok).toEqual([]);
    expect(
      invoiceLegalNotes(sk, VatTreatment.EU_SERVICES_REVERSE_CHARGE),
    ).toEqual(["Prenesenie daňovej povinnosti"]);

    const missing = checkInvoiceCompliance({
      ...base,
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      customer: { ...czCustomer, vatNumber: null },
      lineRates: [0.23],
    });
    expect(missing.map((finding) => finding.code)).toEqual([
      ComplianceIssue.TREATMENT_REQUIRES_ZERO_RATE,
      ComplianceIssue.CUSTOMER_VAT_ID_MISSING,
    ]);

    const domesticCustomer = checkInvoiceCompliance({
      ...base,
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      customer: { ...czCustomer, vatNumber: "SK2021869234", country: "SK" },
      lineRates: [0],
    });
    expect(domesticCustomer.map((finding) => finding.code)).toEqual([
      ComplianceIssue.CUSTOMER_NOT_FOREIGN_EU,
    ]);
  });

  it("limits non payers and § 7a registrants", () => {
    const nonPayer = checkInvoiceCompliance({
      ...base,
      regime: CompanyTaxRegime.SK_NON_PAYER,
      issuer: { ...issuer, vatNumber: null },
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      customer: czCustomer,
      lineRates: [0],
    });
    expect(nonPayer.map((finding) => finding.code)).toEqual([
      ComplianceIssue.TREATMENT_NOT_ALLOWED,
    ]);
    const section7a = checkInvoiceCompliance({
      ...base,
      regime: CompanyTaxRegime.SK_REGISTERED_7A,
      treatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      customer: czCustomer,
      lineRates: [0],
    });
    expect(section7a).toEqual([]);
  });

  it("warns when issued after the 15 day limit", () => {
    const findings = checkInvoiceCompliance({
      ...base,
      supplyDate: day("2026-11-01"),
    });
    expect(findings).toEqual([
      {
        code: ComplianceIssue.ISSUE_DEADLINE_PASSED,
        severity: ComplianceSeverity.WARNING,
        params: { days: "25", limit: "15" },
      },
    ]);
    expect(hasBlockingFinding(findings)).toBe(false);
  });

  it("leaves German companies on their existing rules", () => {
    expect(
      checkInvoiceCompliance({
        ...base,
        profile: getCountryProfile("DE"),
        issuer: { ...issuer, registrationNumber: null, taxId: null },
        lineRates: [0.19, 0.2],
      }),
    ).toEqual([]);
  });
});
