/**
 * Country compliance at invoice issue: loads issuer and customer identity,
 * runs the profile checks and builds the legal snapshot + notes.
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { db } from "next-vibe/database";
import { userAddresses, users } from "next-vibe/identity/user/db";
import { z } from "zod";

import { companies } from "@/companies/db";

import type { CompanyTaxRegimeValue } from "../regime/enum";
import { ComplianceSeverity, VatTreatment } from "./enum";
import { scopedTranslation, type TaxComplianceT } from "./i18n";
import {
  checkInvoiceCompliance,
  type ComplianceFinding,
  invoiceLegalNotes,
} from "./invoice-rules";
import {
  type DocumentMetadata,
  type LegalSnapshot,
  type PartySnapshot,
  readDraftVatChoice,
} from "./legal-snapshot";
import { getCountryProfile } from "./profiles";

type Reader = Pick<typeof db, "select">;

async function loadIssuer(
  reader: Reader,
  companyId: string,
): Promise<PartySnapshot | null> {
  const [company] = await reader
    .select({
      name: companies.name,
      addressLine1: companies.addressLine1,
      addressLine2: companies.addressLine2,
      city: companies.city,
      postalCode: companies.postalCode,
      country: companies.country,
      registrationNumber: companies.registrationNumber,
      taxId: companies.taxId,
      vatNumber: companies.vatNumber,
      email: companies.email,
    })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);
  return company ?? null;
}

/** Default billing address of the customer user, else their latest address. */
export async function loadCustomerParty(
  reader: Reader,
  customerId: string | undefined,
): Promise<PartySnapshot | null> {
  if (!customerId || !z.uuid().safeParse(customerId).success) {
    return null;
  }
  const [row] = await reader
    .select({
      privateName: users.privateName,
      email: users.email,
      fullName: userAddresses.fullName,
      company: userAddresses.company,
      addressLine1: userAddresses.addressLine1,
      addressLine2: userAddresses.addressLine2,
      city: userAddresses.city,
      postalCode: userAddresses.postalCode,
      country: userAddresses.country,
      taxId: userAddresses.taxId,
      vatNumber: userAddresses.vatNumber,
    })
    .from(users)
    .leftJoin(userAddresses, eq(userAddresses.userId, users.id))
    .where(eq(users.id, customerId))
    .orderBy(
      desc(userAddresses.isDefaultBilling),
      desc(userAddresses.updatedAt),
    )
    .limit(1);
  if (!row) {
    return null;
  }
  return {
    name: row.company ?? row.fullName ?? row.privateName,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    city: row.city,
    postalCode: row.postalCode,
    country: row.country,
    // Customers have no register number field yet; DIČ is in taxId.
    registrationNumber: null,
    taxId: row.taxId,
    vatNumber: row.vatNumber,
    email: row.email,
  };
}

export interface InvoiceIssueCompliance {
  findings: ComplianceFinding[];
  /** First blocking finding, translated for the caller, or null. */
  blockingMessage: ReturnType<TaxComplianceT> | null;
  snapshot: LegalSnapshot | null;
  notes: string[];
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function evaluateInvoiceIssue(
  reader: Reader,
  input: {
    companyId: string;
    regime: typeof CompanyTaxRegimeValue;
    metadata: DocumentMetadata;
    issueDate: Date;
    lineRates: readonly number[];
    locale: CountryLanguage;
  },
): Promise<InvoiceIssueCompliance> {
  const { t } = scopedTranslation.scopedT(input.locale);
  const issuer = await loadIssuer(reader, input.companyId);
  if (!issuer) {
    return { findings: [], blockingMessage: null, snapshot: null, notes: [] };
  }
  const profile = getCountryProfile(issuer.country);
  const choice = readDraftVatChoice(input.metadata);
  const customerId = z
    .object({ customerId: z.string().optional() })
    .safeParse(input.metadata);
  const customer = await loadCustomerParty(
    reader,
    customerId.success ? customerId.data.customerId : undefined,
  );
  const treatment = choice.vatTreatment ?? VatTreatment.DOMESTIC;
  const supplyDate = choice.supplyDate
    ? new Date(`${choice.supplyDate}T00:00:00.000Z`)
    : input.issueDate;
  const findings = checkInvoiceCompliance({
    profile,
    regime: input.regime,
    issuer,
    customer,
    treatment,
    supplyDate,
    issueDate: input.issueDate,
    lineRates: input.lineRates,
  });
  const blocking = findings.find(
    (finding) => finding.severity === ComplianceSeverity.ERROR,
  );
  const notes = invoiceLegalNotes(profile, treatment);
  return {
    findings,
    blockingMessage: blocking ? t(blocking.code, blocking.params) : null,
    snapshot: {
      version: 1,
      country: profile.country,
      regime: input.regime,
      treatment,
      issueDate: isoDay(input.issueDate),
      supplyDate: isoDay(supplyDate),
      issuer,
      customer,
      notes,
    },
    notes,
  };
}
