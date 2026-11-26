/**
 * Invoice compliance checks and legal notes per country profile.
 * Pure functions: callers load the company, customer and lines.
 */

import { CompanyTaxRegime, type CompanyTaxRegimeValue } from "../regime/enum";
import {
  ComplianceIssue,
  type ComplianceIssueValue,
  ComplianceSeverity,
  type ComplianceSeverityValue,
  VatTreatment,
  type VatTreatmentValue,
} from "./enum";
import {
  checkEuVatId,
  checkSlovakDic,
  checkSlovakIco,
  checkSlovakVatId,
  type IdentifierCheck,
  isEuCountry,
  normalizeIdentifier,
  vatIdCountry,
} from "./identifiers";
import { type CountryProfile, isVatRateValidOn } from "./profiles";

export interface PartyIdentity {
  name: string;
  addressLine1: string | null;
  addressLine2?: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  /** IČO / company register number. */
  registrationNumber: string | null;
  /** DIČ / tax number. */
  taxId: string | null;
  /** IČ DPH / VAT id. */
  vatNumber: string | null;
}

export interface ComplianceFinding {
  code: typeof ComplianceIssueValue;
  severity: typeof ComplianceSeverityValue;
  params?: Record<string, string>;
}

export interface InvoiceComplianceInput {
  profile: CountryProfile;
  regime: typeof CompanyTaxRegimeValue;
  issuer: PartyIdentity;
  customer: PartyIdentity | null;
  treatment: typeof VatTreatmentValue;
  supplyDate: Date;
  issueDate: Date;
  /** Line rates as fractions (0.23 = 23 %). */
  lineRates: readonly number[];
}

const error = (
  code: typeof ComplianceIssueValue,
  params?: Record<string, string>,
): ComplianceFinding => ({
  code,
  severity: ComplianceSeverity.ERROR,
  params,
});

const warning = (
  code: typeof ComplianceIssueValue,
  params?: Record<string, string>,
): ComplianceFinding => ({
  code,
  severity: ComplianceSeverity.WARNING,
  params,
});

function identifierFinding(
  check: IdentifierCheck,
  missing: typeof ComplianceIssueValue,
  invalid: typeof ComplianceIssueValue,
): ComplianceFinding | null {
  if (check === "missing") {
    return error(missing);
  }
  return check === "invalid" ? error(invalid) : null;
}

/** Issuer identity rules that apply to every document of the company. */
export function checkIssuerIdentity(
  profile: CountryProfile,
  regime: typeof CompanyTaxRegimeValue,
  issuer: PartyIdentity,
): ComplianceFinding[] {
  const findings: (ComplianceFinding | null)[] = [];
  const rules = profile.invoice;
  if (
    rules.requireIssuerAddress &&
    (!issuer.addressLine1?.trim() ||
      !issuer.city?.trim() ||
      !issuer.postalCode?.trim())
  ) {
    findings.push(error(ComplianceIssue.ISSUER_ADDRESS_MISSING));
  }
  const slovak = profile.identifiers === "SK";
  if (rules.requireIssuerRegistration) {
    findings.push(
      identifierFinding(
        slovak
          ? checkSlovakIco(issuer.registrationNumber)
          : normalizeIdentifier(issuer.registrationNumber)
            ? "ok"
            : "missing",
        ComplianceIssue.ISSUER_REGISTRATION_MISSING,
        ComplianceIssue.ISSUER_REGISTRATION_INVALID,
      ),
    );
  }
  if (rules.requireIssuerTaxId) {
    findings.push(
      identifierFinding(
        slovak
          ? checkSlovakDic(issuer.taxId)
          : normalizeIdentifier(issuer.taxId)
            ? "ok"
            : "missing",
        ComplianceIssue.ISSUER_TAX_ID_MISSING,
        ComplianceIssue.ISSUER_TAX_ID_INVALID,
      ),
    );
  }
  if (profile.vatIdRegimes.includes(regime) && slovak) {
    findings.push(
      identifierFinding(
        checkSlovakVatId(issuer.vatNumber),
        ComplianceIssue.ISSUER_VAT_ID_MISSING,
        ComplianceIssue.ISSUER_VAT_ID_INVALID,
      ),
    );
  }
  return findings.filter((finding) => finding !== null);
}

function customerVatCountry(customer: PartyIdentity | null): string | null {
  return (
    vatIdCountry(customer?.vatNumber) ??
    customer?.country?.trim().toUpperCase() ??
    null
  );
}

/** All checks for issuing one sales invoice. */
export function checkInvoiceCompliance(
  input: InvoiceComplianceInput,
): ComplianceFinding[] {
  const { profile, regime, treatment, customer } = input;
  const findings = checkIssuerIdentity(profile, regime, input.issuer);
  const allowed = profile.invoice.treatments[regime] ?? [VatTreatment.DOMESTIC];
  if (!allowed.includes(treatment)) {
    findings.push(error(ComplianceIssue.TREATMENT_NOT_ALLOWED));
  }

  const zeroRated = treatment !== VatTreatment.DOMESTIC;
  if (zeroRated && input.lineRates.some((rate) => rate > 0)) {
    findings.push(error(ComplianceIssue.TREATMENT_REQUIRES_ZERO_RATE));
  }

  const needsCustomerVatId =
    treatment === VatTreatment.REVERSE_CHARGE_DOMESTIC ||
    treatment === VatTreatment.EU_SERVICES_REVERSE_CHARGE ||
    treatment === VatTreatment.EU_GOODS_EXEMPT;
  if (needsCustomerVatId) {
    const check = checkEuVatId(customer?.vatNumber);
    const finding = identifierFinding(
      check,
      ComplianceIssue.CUSTOMER_VAT_ID_MISSING,
      ComplianceIssue.CUSTOMER_VAT_ID_INVALID,
    );
    if (finding) {
      findings.push(finding);
    } else {
      const customerCountry = customerVatCountry(customer);
      const home = profile.country;
      if (
        treatment === VatTreatment.REVERSE_CHARGE_DOMESTIC &&
        home !== "XX" &&
        customerCountry !== home
      ) {
        findings.push(error(ComplianceIssue.CUSTOMER_NOT_DOMESTIC));
      }
      if (
        treatment !== VatTreatment.REVERSE_CHARGE_DOMESTIC &&
        (!isEuCountry(customerCountry) || customerCountry === home)
      ) {
        findings.push(error(ComplianceIssue.CUSTOMER_NOT_FOREIGN_EU));
      }
    }
  }

  const payer = regime === CompanyTaxRegime.STANDARD;
  if (payer && profile.invoice.enforceRates) {
    const supplyDay = input.supplyDate.toISOString().slice(0, 10);
    for (const rate of new Set(input.lineRates)) {
      if (!isVatRateValidOn(profile, rate, input.supplyDate)) {
        findings.push(
          error(ComplianceIssue.RATE_NOT_VALID_ON_DATE, {
            rate: String(Math.round(rate * 10_000) / 100),
            date: supplyDay,
          }),
        );
      }
    }
    if (
      treatment === VatTreatment.DOMESTIC &&
      input.lineRates.some((rate) => rate === 0)
    ) {
      findings.push(warning(ComplianceIssue.ZERO_RATE_WITHOUT_REASON));
    }
  }

  const deadline = profile.invoice.issueDeadlineDays;
  if (deadline !== null) {
    const days = Math.floor(
      (Date.UTC(
        input.issueDate.getUTCFullYear(),
        input.issueDate.getUTCMonth(),
        input.issueDate.getUTCDate(),
      ) -
        Date.UTC(
          input.supplyDate.getUTCFullYear(),
          input.supplyDate.getUTCMonth(),
          input.supplyDate.getUTCDate(),
        )) /
        86_400_000,
    );
    if (days > deadline) {
      findings.push(
        warning(ComplianceIssue.ISSUE_DEADLINE_PASSED, {
          days: String(days),
          limit: String(deadline),
        }),
      );
    }
  }
  return findings;
}

/** Legal notes printed on the invoice for its treatment, in profile language. */
export function invoiceLegalNotes(
  profile: CountryProfile,
  treatment: typeof VatTreatmentValue,
): string[] {
  const note = profile.invoice.notes[treatment];
  return note ? [note] : [];
}

export function hasBlockingFinding(
  findings: readonly ComplianceFinding[],
): boolean {
  return findings.some(
    (finding) => finding.severity === ComplianceSeverity.ERROR,
  );
}
