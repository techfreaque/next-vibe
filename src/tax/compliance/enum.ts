import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** How VAT applies to a sales document. Stored in the document metadata. */
export const {
  enum: VatTreatment,
  options: VatTreatmentOptions,
  Value: VatTreatmentValue,
} = createEnumOptions(scopedTranslation, {
  DOMESTIC: "enums.vatTreatment.domestic",
  REVERSE_CHARGE_DOMESTIC: "enums.vatTreatment.reverseChargeDomestic",
  EU_SERVICES_REVERSE_CHARGE: "enums.vatTreatment.euServices",
  EU_GOODS_EXEMPT: "enums.vatTreatment.euGoods",
  EXPORT_EXEMPT: "enums.vatTreatment.export",
  EXEMPT: "enums.vatTreatment.exempt",
});

export const VatTreatmentDB = [
  VatTreatment.DOMESTIC,
  VatTreatment.REVERSE_CHARGE_DOMESTIC,
  VatTreatment.EU_SERVICES_REVERSE_CHARGE,
  VatTreatment.EU_GOODS_EXEMPT,
  VatTreatment.EXPORT_EXEMPT,
  VatTreatment.EXEMPT,
] as const;

export const {
  enum: ComplianceSeverity,
  options: ComplianceSeverityOptions,
  Value: ComplianceSeverityValue,
} = createEnumOptions(scopedTranslation, {
  ERROR: "enums.severity.error",
  WARNING: "enums.severity.warning",
  INFO: "enums.severity.info",
});

export const ComplianceSeverityDB = [
  ComplianceSeverity.ERROR,
  ComplianceSeverity.WARNING,
  ComplianceSeverity.INFO,
] as const;

export const {
  enum: ComplianceIssue,
  options: ComplianceIssueOptions,
  Value: ComplianceIssueValue,
} = createEnumOptions(scopedTranslation, {
  ISSUER_ADDRESS_MISSING: "issues.issuerAddressMissing",
  ISSUER_REGISTRATION_MISSING: "issues.issuerRegistrationMissing",
  ISSUER_REGISTRATION_INVALID: "issues.issuerRegistrationInvalid",
  ISSUER_TAX_ID_MISSING: "issues.issuerTaxIdMissing",
  ISSUER_TAX_ID_INVALID: "issues.issuerTaxIdInvalid",
  ISSUER_VAT_ID_MISSING: "issues.issuerVatIdMissing",
  ISSUER_VAT_ID_INVALID: "issues.issuerVatIdInvalid",
  CUSTOMER_VAT_ID_MISSING: "issues.customerVatIdMissing",
  CUSTOMER_VAT_ID_INVALID: "issues.customerVatIdInvalid",
  CUSTOMER_NOT_FOREIGN_EU: "issues.customerNotForeignEu",
  CUSTOMER_NOT_DOMESTIC: "issues.customerNotDomestic",
  TREATMENT_NOT_ALLOWED: "issues.treatmentNotAllowed",
  TREATMENT_REQUIRES_ZERO_RATE: "issues.treatmentRequiresZeroRate",
  RATE_NOT_VALID_ON_DATE: "issues.rateNotValidOnDate",
  ZERO_RATE_WITHOUT_REASON: "issues.zeroRateWithoutReason",
  ISSUE_DEADLINE_PASSED: "issues.issueDeadlinePassed",
  REGIME_NOT_ELECTED: "issues.regimeNotElected",
  CHART_TEMPLATE_MISMATCH: "issues.chartTemplateMismatch",
  TAX_RATES_MISSING: "issues.taxRatesMissing",
  TAX_RATES_OUTDATED: "issues.taxRatesOutdated",
  FISCAL_PROVIDER_MISSING: "issues.fiscalProviderMissing",
  E_INVOICING_UPCOMING: "issues.eInvoicingUpcoming",
  VAT_THRESHOLD_NEAR: "issues.vatThresholdNear",
  VAT_THRESHOLD_EXCEEDED: "issues.vatThresholdExceeded",
});

export const ComplianceIssueDB = [
  ComplianceIssue.ISSUER_ADDRESS_MISSING,
  ComplianceIssue.ISSUER_REGISTRATION_MISSING,
  ComplianceIssue.ISSUER_REGISTRATION_INVALID,
  ComplianceIssue.ISSUER_TAX_ID_MISSING,
  ComplianceIssue.ISSUER_TAX_ID_INVALID,
  ComplianceIssue.ISSUER_VAT_ID_MISSING,
  ComplianceIssue.ISSUER_VAT_ID_INVALID,
  ComplianceIssue.CUSTOMER_VAT_ID_MISSING,
  ComplianceIssue.CUSTOMER_VAT_ID_INVALID,
  ComplianceIssue.CUSTOMER_NOT_FOREIGN_EU,
  ComplianceIssue.CUSTOMER_NOT_DOMESTIC,
  ComplianceIssue.TREATMENT_NOT_ALLOWED,
  ComplianceIssue.TREATMENT_REQUIRES_ZERO_RATE,
  ComplianceIssue.RATE_NOT_VALID_ON_DATE,
  ComplianceIssue.ZERO_RATE_WITHOUT_REASON,
  ComplianceIssue.ISSUE_DEADLINE_PASSED,
  ComplianceIssue.REGIME_NOT_ELECTED,
  ComplianceIssue.CHART_TEMPLATE_MISMATCH,
  ComplianceIssue.TAX_RATES_MISSING,
  ComplianceIssue.TAX_RATES_OUTDATED,
  ComplianceIssue.FISCAL_PROVIDER_MISSING,
  ComplianceIssue.E_INVOICING_UPCOMING,
  ComplianceIssue.VAT_THRESHOLD_NEAR,
  ComplianceIssue.VAT_THRESHOLD_EXCEEDED,
] as const;
