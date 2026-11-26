import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import { getDocumentAccess } from "@/finance/document-company-scope";
import { purchasingVendors } from "@/purchasing/db";

import { bankUnits } from "../bank/reconciliation-plan";
import type { StatementSourceRow } from "../bank/statement-format";
import type { BankSyncOutput } from "./definition";
import { normalizeMatch } from "./privacy/rules";

/** Group screened movements by scoped directory supplier and settlement currency. */
export async function supplierTotals(
  companyId: string,
  actorId: string,
  business: readonly StatementSourceRow[],
  attribution: ReadonlyMap<string, string | null>,
): Promise<BankSyncOutput["result"]["suppliers"]> {
  if (
    !business.length ||
    !(await getDocumentAccess(actorId, { companyId }))?.canManage
  ) {
    return [];
  }
  const vendors = await db
    .select({ id: purchasingVendors.id, name: purchasingVendors.name })
    .from(purchasingVendors)
    .where(
      and(
        eq(purchasingVendors.companyId, companyId),
        eq(purchasingVendors.isActive, true),
      ),
    );
  const nameById = new Map(vendors.map(({ id, name }) => [id, name]));
  const idByName = new Map<string, string | null>();
  for (const { id, name } of vendors) {
    const key = normalizeMatch(name);
    idByName.set(key, idByName.has(key) ? null : id);
  }
  const totals = new Map<
    string,
    {
      supplierId: string;
      name: string;
      currency: string;
      units: bigint;
      count: number;
    }
  >();
  for (const row of business) {
    const configured = row.transactionId
      ? attribution.get(row.transactionId)
      : undefined;
    const id =
      configured === undefined && row.counterparty
        ? idByName.get(normalizeMatch(row.counterparty))
        : configured;
    const name = id ? nameById.get(id) : undefined;
    const units = bankUnits(row.amount);
    if (!id || !name || units === null) {
      continue;
    }
    const key = JSON.stringify([id, row.currency]);
    const current = totals.get(key) ?? {
      supplierId: id,
      name,
      currency: row.currency,
      units: BigInt(0),
      count: 0,
    };
    current.units += units;
    current.count++;
    totals.set(key, current);
  }
  return Array.from(
    totals.values(),
    ({ supplierId, name, currency, units, count }) => {
      const digits = (units < BigInt(0) ? -units : units)
        .toString()
        .padStart(5, "0");
      return {
        supplierId,
        name,
        currency,
        count,
        amount: `${units < BigInt(0) ? "-" : ""}${digits.slice(0, -4)}.${digits.slice(-4)}`,
      };
    },
  ).toSorted(
    (a, b) =>
      a.name.localeCompare(b.name) ||
      a.currency.localeCompare(b.currency) ||
      (a.supplierId ?? "").localeCompare(b.supplierId ?? ""),
  );
}
