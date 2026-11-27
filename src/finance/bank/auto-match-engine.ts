import "server-only";

import {
  and,
  asc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  ne,
  or,
  sql,
} from "drizzle-orm";
import type { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { postBankAdjustment } from "./adjustment";
import {
  bankAccountReconciliationSettings,
  bankStatementLines,
  bankStatementLineSplits,
} from "./db";
import { getBankPaymentBasis } from "./payment-basis";
import {
  type BankMatchPlan,
  bankUnits,
  planBankMatch,
} from "./reconciliation-plan";

export type AutoMatchTargetType = "journal_line" | "invoice" | "bill";
export type AutoMatchBasis =
  | "reference"
  | "iban"
  | "amount_date"
  | "fx_tolerance";

export interface AutoMatchItem {
  lineId: string;
  transactionId: string;
  bookedDate: string;
  amount: string;
  currency: string;
  targetType: AutoMatchTargetType;
  targetId: string;
  targetLabel: string;
  matchKind: "exact" | "fee" | "fx";
  basis: AutoMatchBasis;
  fee: number;
  fx: number;
  applied: boolean;
}

export interface AutoMatchSummary {
  matchedCount: number;
  invoiceMatches: number;
  billMatches: number;
  journalMatches: number;
  skippedAmbiguous: number;
  items: AutoMatchItem[];
}

const metadataContactSchema = z
  .object({
    customerName: z.string().optional(),
    customerIban: z.string().optional(),
    supplierIban: z.string().optional(),
    iban: z.string().optional(),
    vendorId: z.uuid().optional(),
    legal: z
      .object({
        customer: z
          .object({
            name: z.string().optional(),
            iban: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .loose();

export function normalizeIban(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const cleaned = value.replaceAll(/\s+/gu, "").toUpperCase();
  return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/u.test(cleaned) ? cleaned : null;
}

export function extractIbanFromText(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const match = /\b[A-Z]{2}\d{2}(?:[\s]?[A-Z0-9]){10,30}\b/iu.exec(value);
  return match ? normalizeIban(match[0]) : null;
}

export function extractTextCorpus(
  parts: Array<string | null | undefined>,
): string {
  return parts
    .filter((part): part is string => Boolean(part && part.trim().length > 0))
    .join(" ")
    .toUpperCase();
}

export function containsDocumentReference(
  corpus: string,
  reference: string | null | undefined,
): boolean {
  if (!reference) {
    return false;
  }
  const normalized = reference.trim().toUpperCase();
  if (normalized.length < 3) {
    return false;
  }
  return corpus.includes(normalized);
}

export function dateDistanceDays(dateA: string, dateB: Date): number {
  const a = new Date(`${dateA}T00:00:00Z`).getTime();
  const b = Date.UTC(
    dateB.getUTCFullYear(),
    dateB.getUTCMonth(),
    dateB.getUTCDate(),
  );
  return Math.abs(a - b) / 86_400_000;
}

function formatUnits(units: bigint): string {
  const negative = units < BigInt(0);
  const abs = negative ? -units : units;
  const whole = abs / BigInt(10_000);
  const frac = (abs % BigInt(10_000)).toString().padStart(4, "0");
  return `${negative ? "-" : ""}${whole.toString()}.${frac}`;
}

export function scoreDocumentMatch(params: {
  lineCorpus: string;
  lineCounterparty: string | null;
  lineBookedDate: string;
  lineAmount: string;
  lineCurrency: string;
  lineNativeAmount: string | null;
  lineNativeCurrency: string | null;
  lineFeeAmount: string | null;
  lineFeeCurrency: string | null;
  documentNumber: string | null;
  counterpartyName: string | null;
  counterpartyIban: string | null;
  documentDate: Date;
  signedOpenAmount: string;
  carryingAmount?: string;
  documentCurrency: string;
  windowDays: number;
  settings?: typeof bankAccountReconciliationSettings.$inferSelect;
}): {
  score: number;
  basis: AutoMatchBasis;
  plan: BankMatchPlan;
} | null {
  const distance = dateDistanceDays(params.lineBookedDate, params.documentDate);
  const refHit = containsDocumentReference(
    params.lineCorpus,
    params.documentNumber,
  );
  const maxDays = refHit
    ? Math.max(params.windowDays, 90)
    : Math.max(params.windowDays, 30);
  if (!Number.isFinite(distance) || distance > maxDays) {
    return null;
  }

  const carrying = params.carryingAmount ?? params.signedOpenAmount;
  let plan: BankMatchPlan | null = null;
  if (params.documentCurrency === params.lineCurrency) {
    plan = planBankMatch({
      booked: params.lineAmount,
      carrying,
      currency: params.lineCurrency,
      bookedDate: params.lineBookedDate,
      carryingDate: params.documentDate,
      nativeAmount: params.lineNativeAmount,
      nativeCurrency: params.lineNativeCurrency,
      feeAmount: params.lineFeeAmount,
      feeCurrency: params.lineFeeCurrency,
      document: {
        currency: params.documentCurrency,
        amount: params.signedOpenAmount,
      },
      settings: params.settings
        ? { ...params.settings, maxDateDistanceDays: maxDays }
        : undefined,
    });
  } else if (params.settings) {
    plan = planBankMatch({
      booked: params.lineAmount,
      carrying,
      currency: params.lineCurrency,
      bookedDate: params.lineBookedDate,
      carryingDate: params.documentDate,
      nativeAmount: params.lineNativeAmount,
      nativeCurrency: params.lineNativeCurrency,
      feeAmount: params.lineFeeAmount,
      feeCurrency: params.lineFeeCurrency,
      document: {
        currency: params.documentCurrency,
        amount: params.signedOpenAmount,
      },
      settings: { ...params.settings, maxDateDistanceDays: maxDays },
    });
  }

  if (!plan) {
    return null;
  }

  const normalizedIban = normalizeIban(params.counterpartyIban);
  const ibanHit =
    normalizedIban !== null &&
    params.lineCorpus.replaceAll(/\s+/gu, "").includes(normalizedIban);

  const cpLine = params.lineCounterparty?.trim().toLowerCase() ?? "";
  const cpDoc = params.counterpartyName?.trim().toLowerCase() ?? "";
  const nameHit =
    cpLine.length >= 3 &&
    cpDoc.length >= 3 &&
    (cpLine === cpDoc || cpLine.includes(cpDoc) || cpDoc.includes(cpLine));

  let score = plan.kind === "exact" ? 40 : 25;
  if (refHit) {
    score += 50;
  }
  if (ibanHit) {
    score += 35;
  }
  if (nameHit) {
    score += 20;
  }
  if (distance <= 3) {
    score += 10;
  } else if (distance <= 7) {
    score += 5;
  }

  if (!refHit && !ibanHit && !nameHit && distance > params.windowDays) {
    return null;
  }

  const basis: AutoMatchBasis = refHit
    ? "reference"
    : ibanHit
      ? "iban"
      : plan.kind === "fx" || plan.kind === "fee"
        ? "fx_tolerance"
        : "amount_date";

  return { score, basis, plan };
}

export async function runBankAutoMatch(
  tx: LedgerTransaction,
  scope: {
    companyId: string;
    accountId: string;
    userId: string;
    transactionIds?: string[];
    dryRun: boolean;
    adjustmentDescription: (reference: string) => string;
    logger: EndpointLogger;
  },
): Promise<AutoMatchSummary> {
  const [company] = await tx
    .select({ currency: companies.currency })
    .from(companies)
    .where(eq(companies.id, scope.companyId))
    .limit(1);

  const [settings] = await tx
    .select()
    .from(bankAccountReconciliationSettings)
    .where(
      and(
        eq(bankAccountReconciliationSettings.companyId, scope.companyId),
        eq(bankAccountReconciliationSettings.accountId, scope.accountId),
      ),
    )
    .limit(1);

  const windowDays = settings?.maxDateDistanceDays ?? 7;

  const openLines = await tx
    .select()
    .from(bankStatementLines)
    .where(
      and(
        eq(bankStatementLines.companyId, scope.companyId),
        eq(bankStatementLines.accountId, scope.accountId),
        isNull(bankStatementLines.matchedJournalLineId),
        isNull(bankStatementLines.matchedAt),
        scope.transactionIds && scope.transactionIds.length > 0
          ? inArray(bankStatementLines.transactionId, scope.transactionIds)
          : undefined,
      ),
    )
    .orderBy(asc(bankStatementLines.bookedDate), asc(bankStatementLines.id))
    .for("update");

  const items: AutoMatchItem[] = [];
  let invoiceMatches = 0;
  let billMatches = 0;
  let journalMatches = 0;
  let skippedAmbiguous = 0;

  const claimedJournalLines = new Set<string>();
  const claimedInvoices = new Set<string>();
  const claimedBills = new Set<string>();

  const balanceParts = getInvoiceOpenBalanceParts(tx, scope.companyId);
  const openInvoices = await tx
    .select({
      invoice: paymentInvoices,
      openAmount: balanceParts.openAmount,
    })
    .from(paymentInvoices)
    .leftJoin(balanceParts.payments, balanceParts.paymentJoin)
    .leftJoin(balanceParts.credits, balanceParts.creditJoin)
    .where(
      and(
        eq(paymentInvoices.companyId, scope.companyId),
        eq(paymentInvoices.status, InvoiceStatus.OPEN),
      ),
    )
    .orderBy(asc(paymentInvoices.createdAt), asc(paymentInvoices.id));

  const openBills = await tx
    .select({
      bill: paymentBills,
      vendorName: purchasingVendors.name,
      vendorNotes: purchasingVendors.notes,
    })
    .from(paymentBills)
    .leftJoin(
      purchasingVendors,
      and(
        eq(purchasingVendors.companyId, scope.companyId),
        sql`${paymentBills.metadata}->>'vendorId' = ${purchasingVendors.id}::text`,
      ),
    )
    .where(
      and(
        eq(paymentBills.companyId, scope.companyId),
        inArray(paymentBills.status, [
          BillStatus.RECEIVED,
          BillStatus.APPROVED,
        ]),
      ),
    )
    .orderBy(asc(paymentBills.billDate), asc(paymentBills.id));

  for (const line of openLines) {
    const bookedUnits = bankUnits(line.amount);
    if (!bookedUnits || bookedUnits === BigInt(0)) {
      continue;
    }
    const lineCorpus = extractTextCorpus([
      line.description,
      line.sourceReference,
      line.transactionId,
      line.counterparty,
    ]);

    const intervalMs = windowDays * 86_400_000;
    const bookedTime = new Date(`${line.bookedDate}T00:00:00Z`).getTime();
    const withAdjustments =
      settings &&
      company?.currency === line.currency &&
      (settings.foreignCurrency || (settings.feeAccountId && line.feeAmount));

    const journalCandidates = await tx
      .select({
        id: journalEntryLines.id,
        entryNumber: journalEntries.entryNumber,
        description: sql<string>`coalesce(${journalEntryLines.description}, ${journalEntries.description})`,
        journalDate: journalEntries.date,
        sign: journalEntryLines.type,
        amount: journalEntryLines.amount,
        sourceId: journalEntries.sourceId,
        sourceType: journalEntries.sourceType,
      })
      .from(journalEntryLines)
      .innerJoin(
        journalEntries,
        eq(journalEntries.id, journalEntryLines.journalEntryId),
      )
      .leftJoin(
        bankStatementLines,
        eq(bankStatementLines.matchedJournalLineId, journalEntryLines.id),
      )
      .leftJoin(
        bankStatementLineSplits,
        eq(bankStatementLineSplits.journalLineId, journalEntryLines.id),
      )
      .where(
        and(
          eq(journalEntries.companyId, scope.companyId),
          eq(journalEntries.status, JournalEntryStatus.POSTED),
          ne(journalEntries.sourceType, JournalSourceType.BANK_RECONCILIATION),
          isNull(journalEntries.reversedById),
          eq(journalEntryLines.accountId, scope.accountId),
          eq(journalEntryLines.currency, line.currency),
          gt(journalEntryLines.amount, 0),
          isNull(bankStatementLines.id),
          isNull(bankStatementLineSplits.id),
          or(
            sql`(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end) = ${line.amount}::numeric`,
            withAdjustments
              ? and(
                  inArray(journalEntries.sourceType, [
                    JournalSourceType.AR_PAYMENT,
                    JournalSourceType.AP_PAYMENT,
                  ]),
                  gte(journalEntries.date, new Date(bookedTime - intervalMs)),
                  lt(
                    journalEntries.date,
                    new Date(bookedTime + intervalMs + 86_400_000),
                  ),
                )
              : undefined,
          ),
        ),
      )
      .limit(20);

    const scoredJournals: Array<{
      candidate: (typeof journalCandidates)[number];
      plan: BankMatchPlan;
      score: number;
      basis: AutoMatchBasis;
    }> = [];

    for (const candidate of journalCandidates) {
      if (claimedJournalLines.has(candidate.id)) {
        continue;
      }
      const dist = dateDistanceDays(line.bookedDate, candidate.journalDate);
      if (dist > windowDays) {
        continue;
      }
      const carrying = `${candidate.sign === LineType.CREDIT ? "-" : ""}${candidate.amount.toFixed(4)}`;
      const doc =
        carrying !== line.amount && withAdjustments
          ? await getBankPaymentBasis(tx, scope.companyId, candidate)
          : undefined;
      const plan = planBankMatch({
        ...line,
        booked: line.amount,
        carrying,
        carryingDate: candidate.journalDate,
        settings,
        document: doc,
      });
      if (!plan) {
        continue;
      }
      const refMatch =
        containsDocumentReference(lineCorpus, candidate.entryNumber) ||
        containsDocumentReference(lineCorpus, candidate.description);
      const score =
        (plan.kind === "exact" ? 50 : 35) +
        (refMatch ? 40 : 0) +
        (dist === 0 ? 20 : dist <= 3 ? 10 : 0);
      const basis: AutoMatchBasis = refMatch
        ? "reference"
        : plan.kind === "exact"
          ? "amount_date"
          : "fx_tolerance";
      scoredJournals.push({ candidate, plan, score, basis });
    }

    if (scoredJournals.length > 0) {
      scoredJournals.sort((a, b) => b.score - a.score);
      const best = scoredJournals[0];
      const second = scoredJournals[1];
      if (!second || best.score > second.score) {
        let applied = false;
        if (!scope.dryRun) {
          let adjustmentJournalEntryId: string | null = null;
          if (best.plan.kind !== "exact" && settings) {
            adjustmentJournalEntryId = await postBankAdjustment(
              tx,
              line,
              settings,
              best.plan,
              scope.userId,
              scope.adjustmentDescription(line.transactionId),
              scope.logger,
            );
            if (!adjustmentJournalEntryId) {
              continue;
            }
          }
          await tx
            .update(bankStatementLines)
            .set({
              matchedJournalLineId: best.candidate.id,
              adjustmentJournalEntryId,
              matchKind: best.plan.kind,
              matchedByUserId: scope.userId,
              matchedAt: new Date(),
            })
            .where(eq(bankStatementLines.id, line.id));
          applied = true;
        }
        claimedJournalLines.add(best.candidate.id);
        journalMatches += 1;
        items.push({
          lineId: line.id,
          transactionId: line.transactionId,
          bookedDate: line.bookedDate,
          amount: line.amount,
          currency: line.currency,
          targetType: "journal_line",
          targetId: best.candidate.id,
          targetLabel:
            `${best.candidate.entryNumber} ${best.candidate.description}`.trim(),
          matchKind: best.plan.kind,
          basis: best.basis,
          fee: Number(best.plan.fee) / 10_000,
          fx: Number(best.plan.fx) / 10_000,
          applied,
        });
        continue;
      }
      skippedAmbiguous += 1;
      continue;
    }

    if (bookedUnits > BigInt(0)) {
      const scoredInvoices: Array<{
        invoice: typeof paymentInvoices.$inferSelect;
        openCents: number;
        score: number;
        basis: AutoMatchBasis;
        plan: BankMatchPlan;
      }> = [];

      for (const row of openInvoices) {
        const { invoice, openAmount } = row;
        if (claimedInvoices.has(invoice.id)) {
          continue;
        }
        const openCents = Math.round(Number(openAmount) * 100);
        if (openCents <= 0) {
          continue;
        }
        const metaParsed = metadataContactSchema.safeParse(
          invoice.metadata ?? {},
        );
        const meta = metaParsed.success ? metaParsed.data : undefined;
        const customerName =
          meta?.customerName ?? meta?.legal?.customer?.name ?? null;
        const customerIban =
          meta?.customerIban ??
          meta?.legal?.customer?.iban ??
          meta?.iban ??
          null;
        const docNumber =
          invoice.invoiceNumber?.trim() || invoice.providerInvoiceId;
        const signedOpen = formatUnits(BigInt(openCents) * BigInt(100));

        const scored = scoreDocumentMatch({
          lineCorpus,
          lineCounterparty: line.counterparty,
          lineBookedDate: line.bookedDate,
          lineAmount: line.amount,
          lineCurrency: line.currency,
          lineNativeAmount: line.nativeAmount,
          lineNativeCurrency: line.nativeCurrency,
          lineFeeAmount: line.feeAmount,
          lineFeeCurrency: line.feeCurrency,
          documentNumber: docNumber,
          counterpartyName: customerName,
          counterpartyIban: customerIban,
          documentDate: invoice.dueDate ?? invoice.createdAt,
          signedOpenAmount: signedOpen,
          documentCurrency: invoice.currency,
          windowDays,
          settings,
        });
        if (scored) {
          scoredInvoices.push({ invoice, openCents, ...scored });
        }
      }

      if (scoredInvoices.length > 0) {
        scoredInvoices.sort((a, b) => b.score - a.score);
        const best = scoredInvoices[0];
        const second = scoredInvoices[1];
        if (!second || best.score > second.score) {
          let applied = false;
          if (!scope.dryRun) {
            const settled = await settleInvoiceFromBankLine(tx, {
              companyId: scope.companyId,
              line,
              invoice: best.invoice,
              plan: best.plan,
              settings,
              userId: scope.userId,
              logger: scope.logger,
            });
            if (!settled) {
              continue;
            }
            applied = true;
          }
          claimedInvoices.add(best.invoice.id);
          invoiceMatches += 1;
          items.push({
            lineId: line.id,
            transactionId: line.transactionId,
            bookedDate: line.bookedDate,
            amount: line.amount,
            currency: line.currency,
            targetType: "invoice",
            targetId: best.invoice.id,
            targetLabel:
              best.invoice.invoiceNumber ?? best.invoice.providerInvoiceId,
            matchKind: best.plan.kind,
            basis: best.basis,
            fee: Number(best.plan.fee) / 10_000,
            fx: Number(best.plan.fx) / 10_000,
            applied,
          });
          continue;
        }
        skippedAmbiguous += 1;
        continue;
      }
    }

    if (bookedUnits < BigInt(0)) {
      const scoredBills: Array<{
        bill: typeof paymentBills.$inferSelect;
        score: number;
        basis: AutoMatchBasis;
        plan: BankMatchPlan;
      }> = [];

      for (const row of openBills) {
        const { bill, vendorName, vendorNotes } = row;
        if (claimedBills.has(bill.id) || bill.total <= 0) {
          continue;
        }
        const billMeta = metadataContactSchema.safeParse(bill.metadata ?? {});
        const supplierIban =
          (billMeta.success
            ? (billMeta.data.supplierIban ?? billMeta.data.iban)
            : null) ??
          extractIbanFromText(vendorNotes) ??
          null;
        const signedOpen = `-${bill.total.toFixed(4)}`;

        const scored = scoreDocumentMatch({
          lineCorpus,
          lineCounterparty: line.counterparty,
          lineBookedDate: line.bookedDate,
          lineAmount: line.amount,
          lineCurrency: line.currency,
          lineNativeAmount: line.nativeAmount,
          lineNativeCurrency: line.nativeCurrency,
          lineFeeAmount: line.feeAmount,
          lineFeeCurrency: line.feeCurrency,
          documentNumber: bill.billNumber,
          counterpartyName: vendorName ?? bill.supplierName ?? null,
          counterpartyIban: supplierIban,
          documentDate: bill.dueDate ?? bill.billDate,
          signedOpenAmount: signedOpen,
          documentCurrency: bill.currency,
          windowDays,
          settings,
        });
        if (scored) {
          scoredBills.push({ bill, ...scored });
        }
      }

      if (scoredBills.length > 0) {
        scoredBills.sort((a, b) => b.score - a.score);
        const best = scoredBills[0];
        const second = scoredBills[1];
        if (!second || best.score > second.score) {
          let applied = false;
          if (!scope.dryRun) {
            const settled = await settleBillFromBankLine(tx, {
              companyId: scope.companyId,
              line,
              bill: best.bill,
              plan: best.plan,
              settings,
              userId: scope.userId,
              logger: scope.logger,
            });
            if (!settled) {
              continue;
            }
            applied = true;
          }
          claimedBills.add(best.bill.id);
          billMatches += 1;
          items.push({
            lineId: line.id,
            transactionId: line.transactionId,
            bookedDate: line.bookedDate,
            amount: line.amount,
            currency: line.currency,
            targetType: "bill",
            targetId: best.bill.id,
            targetLabel: best.bill.billNumber ?? best.bill.id,
            matchKind: best.plan.kind,
            basis: best.basis,
            fee: Number(best.plan.fee) / 10_000,
            fx: Number(best.plan.fx) / 10_000,
            applied,
          });
          continue;
        }
        skippedAmbiguous += 1;
      }
    }
  }

  return {
    matchedCount: invoiceMatches + billMatches + journalMatches,
    invoiceMatches,
    billMatches,
    journalMatches,
    skippedAmbiguous,
    items,
  };
}

async function findCreatedBankLeg(
  tx: LedgerTransaction,
  journalEntryId: string,
  accountId: string,
): Promise<string | null> {
  const [leg] = await tx
    .select({ id: journalEntryLines.id })
    .from(journalEntryLines)
    .where(
      and(
        eq(journalEntryLines.journalEntryId, journalEntryId),
        eq(journalEntryLines.accountId, accountId),
      ),
    )
    .limit(1);
  return leg?.id ?? null;
}

async function settleInvoiceFromBankLine(
  tx: LedgerTransaction,
  params: {
    companyId: string;
    line: typeof bankStatementLines.$inferSelect;
    invoice: typeof paymentInvoices.$inferSelect;
    plan: BankMatchPlan;
    settings?: typeof bankAccountReconciliationSettings.$inferSelect;
    userId: string;
    logger: EndpointLogger;
  },
): Promise<boolean> {
  const bookedUnits = bankUnits(params.line.amount);
  if (!bookedUnits || bookedUnits <= BigInt(0)) {
    return false;
  }
  const carryingAmount =
    Number(bookedUnits - params.plan.fee - params.plan.fx) / 10_000;
  const bankAmount = Number(bookedUnits) / 10_000;
  const lines: AutoPostLine[] = [
    {
      accountNodeId: params.line.accountId,
      subtype: AccountSubtype.BANK,
      type: LineType.DEBIT,
      amount: bankAmount,
      currency: params.line.currency,
    },
    {
      subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
      type: LineType.CREDIT,
      amount: carryingAmount,
      currency: params.line.currency,
    },
  ];
  if (params.plan.fee !== BigInt(0)) {
    if (!params.settings?.feeAccountId) {
      return false;
    }
    lines.push({
      accountNodeId: params.settings.feeAccountId,
      subtype: AccountSubtype.FINANCIAL_EXPENSE,
      type: params.plan.fee < BigInt(0) ? LineType.DEBIT : LineType.CREDIT,
      amount: Math.abs(Number(params.plan.fee)) / 10_000,
      currency: params.line.currency,
    });
  }
  if (params.plan.fx !== BigInt(0)) {
    const fxAccount =
      params.plan.fx > BigInt(0)
        ? params.settings?.gainAccountId
        : params.settings?.lossAccountId;
    if (!fxAccount) {
      return false;
    }
    lines.push({
      accountNodeId: fxAccount,
      subtype:
        params.plan.fx > BigInt(0)
          ? AccountSubtype.FINANCIAL_INCOME
          : AccountSubtype.FINANCIAL_EXPENSE,
      type: params.plan.fx > BigInt(0) ? LineType.CREDIT : LineType.DEBIT,
      amount: Math.abs(Number(params.plan.fx)) / 10_000,
      currency: params.line.currency,
    });
  }

  const label =
    params.invoice.invoiceNumber ?? params.invoice.providerInvoiceId;
  const journalEntryId = await postJournalEntry(
    {
      companyId: params.companyId,
      date: new Date(`${params.line.bookedDate}T00:00:00Z`),
      description: `AR bank receipt: ${label}`,
      sourceType: JournalSourceType.AR_PAYMENT,
      sourceId: params.invoice.id,
      postedByUserId: params.userId,
      lines,
      logger: params.logger,
    },
    tx,
  );
  if (!journalEntryId) {
    return false;
  }
  const bankLegId = await findCreatedBankLeg(
    tx,
    journalEntryId,
    params.line.accountId,
  );
  if (!bankLegId) {
    return false;
  }

  await tx
    .update(paymentInvoices)
    .set({
      status: InvoiceStatus.PAID,
      paidAt: new Date(`${params.line.bookedDate}T00:00:00Z`),
      updatedAt: new Date(),
    })
    .where(eq(paymentInvoices.id, params.invoice.id));

  await tx
    .update(bankStatementLines)
    .set({
      matchedJournalLineId: bankLegId,
      matchKind: params.plan.kind,
      matchedByUserId: params.userId,
      matchedAt: new Date(),
    })
    .where(eq(bankStatementLines.id, params.line.id));

  return true;
}

async function settleBillFromBankLine(
  tx: LedgerTransaction,
  params: {
    companyId: string;
    line: typeof bankStatementLines.$inferSelect;
    bill: typeof paymentBills.$inferSelect;
    plan: BankMatchPlan;
    settings?: typeof bankAccountReconciliationSettings.$inferSelect;
    userId: string;
    logger: EndpointLogger;
  },
): Promise<boolean> {
  const bookedUnits = bankUnits(params.line.amount);
  if (!bookedUnits || bookedUnits >= BigInt(0)) {
    return false;
  }
  const absBooked = Number(-bookedUnits) / 10_000;
  const carryingUnits = -(bookedUnits - params.plan.fee - params.plan.fx);
  const carryingAmount = Number(carryingUnits) / 10_000;
  const lines: AutoPostLine[] = [
    {
      subtype: AccountSubtype.ACCOUNTS_PAYABLE,
      type: LineType.DEBIT,
      amount: carryingAmount,
      currency: params.line.currency,
    },
    {
      accountNodeId: params.line.accountId,
      subtype: AccountSubtype.BANK,
      type: LineType.CREDIT,
      amount: absBooked,
      currency: params.line.currency,
    },
  ];
  if (params.plan.fee !== BigInt(0)) {
    if (!params.settings?.feeAccountId) {
      return false;
    }
    lines.push({
      accountNodeId: params.settings.feeAccountId,
      subtype: AccountSubtype.FINANCIAL_EXPENSE,
      type: params.plan.fee < BigInt(0) ? LineType.DEBIT : LineType.CREDIT,
      amount: Math.abs(Number(params.plan.fee)) / 10_000,
      currency: params.line.currency,
    });
  }
  if (params.plan.fx !== BigInt(0)) {
    const fxAccount =
      params.plan.fx > BigInt(0)
        ? params.settings?.gainAccountId
        : params.settings?.lossAccountId;
    if (!fxAccount) {
      return false;
    }
    lines.push({
      accountNodeId: fxAccount,
      subtype:
        params.plan.fx > BigInt(0)
          ? AccountSubtype.FINANCIAL_INCOME
          : AccountSubtype.FINANCIAL_EXPENSE,
      type: params.plan.fx > BigInt(0) ? LineType.CREDIT : LineType.DEBIT,
      amount: Math.abs(Number(params.plan.fx)) / 10_000,
      currency: params.line.currency,
    });
  }

  const label = params.bill.billNumber ?? params.bill.id;
  const journalEntryId = await postJournalEntry(
    {
      companyId: params.companyId,
      date: new Date(`${params.line.bookedDate}T00:00:00Z`),
      description: `AP bank payment: ${label}`,
      sourceType: JournalSourceType.AP_PAYMENT,
      sourceId: params.bill.id,
      postedByUserId: params.userId,
      lines,
      logger: params.logger,
    },
    tx,
  );
  if (!journalEntryId) {
    return false;
  }
  const bankLegId = await findCreatedBankLeg(
    tx,
    journalEntryId,
    params.line.accountId,
  );
  if (!bankLegId) {
    return false;
  }

  await tx
    .update(paymentBills)
    .set({
      status: BillStatus.PAID,
      paidAt: new Date(`${params.line.bookedDate}T00:00:00Z`),
      updatedAt: new Date(),
    })
    .where(eq(paymentBills.id, params.bill.id));

  await tx
    .update(bankStatementLines)
    .set({
      matchedJournalLineId: bankLegId,
      supplierBillId: params.bill.id,
      matchKind: params.plan.kind,
      matchedByUserId: params.userId,
      matchedAt: new Date(),
    })
    .where(eq(bankStatementLines.id, params.line.id));

  return true;
}

export async function getCompanyBankAccountStatuses(
  reader: Pick<typeof db, "select">,
  companyId: string,
): Promise<
  Array<{
    accountId: string;
    accountCode: string;
    accountName: string;
    currency: string;
    totalLines: number;
    matchedLines: number;
    unmatchedLines: number;
    matchedAmount: string;
    unmatchedAmount: string;
    statementNetAmount: string;
    ledgerBalance: string;
    difference: string;
    lastBookedDate: string | null;
  }>
> {
  const accounts = await reader
    .select({
      id: accountNodes.id,
      code: accountNodes.code,
      name: accountNodes.name,
      currency: sql<string>`coalesce(${bankAccountReconciliationSettings.bookedCurrency}, ${companies.currency}, 'EUR')`,
    })
    .from(accountNodes)
    .innerJoin(companies, eq(companies.id, accountNodes.companyId))
    .leftJoin(
      bankAccountReconciliationSettings,
      and(
        eq(bankAccountReconciliationSettings.accountId, accountNodes.id),
        eq(bankAccountReconciliationSettings.companyId, companyId),
      ),
    )
    .where(
      and(
        eq(accountNodes.companyId, companyId),
        eq(accountNodes.subtype, AccountSubtype.BANK),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    )
    .orderBy(asc(accountNodes.code));

  if (accounts.length === 0) {
    return [];
  }

  const accountIds = accounts.map((a) => a.id);

  const lineStats = await reader
    .select({
      accountId: bankStatementLines.accountId,
      totalLines: sql<number>`count(*)::int`,
      matchedLines: sql<number>`count(*) filter (where ${bankStatementLines.matchedAt} is not null or ${bankStatementLines.matchedJournalLineId} is not null)::int`,
      unmatchedLines: sql<number>`count(*) filter (where ${bankStatementLines.matchedAt} is null and ${bankStatementLines.matchedJournalLineId} is null)::int`,
      matchedAmount: sql<string>`coalesce(sum(${bankStatementLines.amount}) filter (where ${bankStatementLines.matchedAt} is not null or ${bankStatementLines.matchedJournalLineId} is not null), 0)::numeric(14,4)::text`,
      unmatchedAmount: sql<string>`coalesce(sum(${bankStatementLines.amount}) filter (where ${bankStatementLines.matchedAt} is null and ${bankStatementLines.matchedJournalLineId} is null), 0)::numeric(14,4)::text`,
      statementNetAmount: sql<string>`coalesce(sum(${bankStatementLines.amount}), 0)::numeric(14,4)::text`,
      lastBookedDate: sql<
        string | null
      >`max(${bankStatementLines.bookedDate})::text`,
    })
    .from(bankStatementLines)
    .where(
      and(
        eq(bankStatementLines.companyId, companyId),
        inArray(bankStatementLines.accountId, accountIds),
      ),
    )
    .groupBy(bankStatementLines.accountId);

  const ledgerStats = await reader
    .select({
      accountId: journalEntryLines.accountId,
      balance: sql<string>`coalesce(sum(case when ${journalEntryLines.type} = ${LineType.DEBIT} then ${journalEntryLines.amount} else -${journalEntryLines.amount} end), 0)::numeric(14,4)::text`,
    })
    .from(journalEntryLines)
    .innerJoin(
      journalEntries,
      eq(journalEntries.id, journalEntryLines.journalEntryId),
    )
    .where(
      and(
        eq(journalEntries.companyId, companyId),
        eq(journalEntries.status, JournalEntryStatus.POSTED),
        inArray(journalEntryLines.accountId, accountIds),
      ),
    )
    .groupBy(journalEntryLines.accountId);

  const statsByAccount = new Map(lineStats.map((s) => [s.accountId, s]));
  const ledgerByAccount = new Map(
    ledgerStats.map((l) => [l.accountId, l.balance]),
  );

  return accounts.map((acct) => {
    const s = statsByAccount.get(acct.id);
    const statementNet = s?.statementNetAmount ?? "0.0000";
    const ledgerBal = ledgerByAccount.get(acct.id) ?? "0.0000";
    const diffUnits =
      (bankUnits(statementNet) ?? BigInt(0)) -
      (bankUnits(ledgerBal) ?? BigInt(0));
    return {
      accountId: acct.id,
      accountCode: acct.code,
      accountName: acct.name,
      currency: acct.currency,
      totalLines: s?.totalLines ?? 0,
      matchedLines: s?.matchedLines ?? 0,
      unmatchedLines: s?.unmatchedLines ?? 0,
      matchedAmount: s?.matchedAmount ?? "0.0000",
      unmatchedAmount: s?.unmatchedAmount ?? "0.0000",
      statementNetAmount: statementNet,
      ledgerBalance: ledgerBal,
      difference: formatUnits(diffUnits),
      lastBookedDate: s?.lastBookedDate ?? null,
    };
  });
}
