import "server-only";

import { and, desc, eq, lte } from "drizzle-orm";
import type { db } from "next-vibe/database";

import { companyTaxRegimes } from "./db";
import { CompanyTaxRegime, type CompanyTaxRegimeValue } from "./enum";

const taxNotices: Record<typeof CompanyTaxRegimeValue, string | null> = {
  [CompanyTaxRegime.STANDARD]: null,
  [CompanyTaxRegime.DE_SMALL_BUSINESS]:
    "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
  [CompanyTaxRegime.AT_SMALL_BUSINESS]:
    "Umsatzsteuerbefreit gemäß § 6 Abs. 1 Z 27 UStG 1994.",
  [CompanyTaxRegime.SK_NON_PAYER]: "Dodávateľ nie je platiteľom DPH.",
};

/** Legal document wording follows the issuer's elected regime and is snapshotted at issue. */
export async function getCompanyTaxRegime(
  reader: Pick<typeof db, "select">,
  companyId: string,
  accountingDate: Date,
): Promise<{
  code: typeof CompanyTaxRegimeValue;
  exempt: boolean;
  notice: string | null;
}> {
  const [election] = await reader
    .select({ regime: companyTaxRegimes.regime })
    .from(companyTaxRegimes)
    .where(
      and(
        eq(companyTaxRegimes.companyId, companyId),
        lte(
          companyTaxRegimes.effectiveFrom,
          accountingDate.toISOString().slice(0, 10),
        ),
      ),
    )
    .orderBy(desc(companyTaxRegimes.effectiveFrom))
    .limit(1);
  const code = election?.regime ?? CompanyTaxRegime.STANDARD;
  return {
    code,
    exempt: code !== CompanyTaxRegime.STANDARD,
    notice: taxNotices[code],
  };
}

export function notesWithTaxNotice(
  notes: string | null,
  notice: string | null,
): string | null {
  if (!notice || notes?.split("\n").some((line) => line.trim() === notice)) {
    return notes;
  }
  return notes ? `${notes}\n\n${notice}` : notice;
}
