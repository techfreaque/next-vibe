import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { and, desc, eq, inArray, lt, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";
import { postJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import {
  accountingDay,
  nextAccountingDay,
} from "@/chart-of-accounts/shared/journal-validation";
import {
  findOpenPeriod,
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import {
  findBankBillStatement,
  hasSupplierBillCandidate,
  readBankBillOrigin,
} from "@/finance/bank/followup/bill-provenance";
import { outreachDeals } from "@/leads/outreach/db";
import { creatorDealBillDate } from "@/leads/outreach/deal/bill-date";
import {
  paymentAccountingEvidence,
  paymentAccountingOffers,
} from "@/payment/accounting/db";
import { calculateBillLine } from "@/payment/bill/create/amounts";
import { billDueDateFromTerms } from "@/payment/bill/create/dates";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { BillStatus, PaymentProvider } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";
import { payoutRequests } from "@/referral/db";
import { PayoutStatus } from "@/referral/enum";
import { canDocumentReferralPayout } from "@/referral/payout-actions";

import { financeProviderSnapshots } from "../db";
import { getDocumentAccess } from "../document-company-scope";
import type { FinanceT } from "../i18n";
import { supplierEvidenceRecords, supplierProviderBindings } from "./db";
import type {
  SupplierEvidenceInput,
  SupplierEvidenceListOutput,
  SupplierEvidenceOutput,
} from "./definition";
import {
  getMonthlyModelEstimates,
  getMonthlySupplierExpenses,
} from "./monthly";
import { getMonthlyProviderReview } from "./monthly-review";
import { getSupplierPrepaidBalances } from "./prepaid-balances";
import {
  evidenceAmounts,
  evidenceCurrencies,
  evidenceDay,
  operationValues,
} from "./rules";
import { mailboxTaxPending } from "./tax-pending";

export class SupplierEvidenceRepository {
  static async list(
    companyId: string,
    requestedMonth: string | undefined,
    userId: string,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SupplierEvidenceListOutput>> {
    try {
      if (!(await getDocumentAccess(userId, { companyId }))) {
        return SupplierEvidenceRepository.forbidden(t);
      }

      const month = requestedMonth ?? new Date().toISOString().slice(0, 7);
      const [company] = await db
        .select({ currency: companies.currency, name: companies.name })
        .from(companies)
        .where(eq(companies.id, companyId));
      const currency = company?.currency ?? "EUR";
      const [bindings, records, expenses, prepaidBalances] = await Promise.all([
        db
          .select({
            provider: supplierProviderBindings.provider,
            configuredAt: supplierProviderBindings.configuredAt,
            vendorId: purchasingVendors.id,
            vendorName: purchasingVendors.name,
          })
          .from(supplierProviderBindings)
          .innerJoin(
            purchasingVendors,
            and(
              eq(purchasingVendors.id, supplierProviderBindings.vendorId),
              eq(purchasingVendors.companyId, companyId),
            ),
          )
          .where(eq(supplierProviderBindings.companyId, companyId))
          .orderBy(purchasingVendors.name, supplierProviderBindings.provider),
        db
          .select({
            id: supplierEvidenceRecords.id,
            kind: supplierEvidenceRecords.kind,
            vendorName: purchasingVendors.name,
            externalReference: supplierEvidenceRecords.externalReference,
            description: supplierEvidenceRecords.description,
            date: supplierEvidenceRecords.date,
            grossAmount: supplierEvidenceRecords.grossAmount,
            currency: supplierEvidenceRecords.currency,
            billId: supplierEvidenceRecords.billId,
            journalEntryId: journalEntries.id,
            billStatus: paymentBills.status,
            journalStatus: journalEntries.status,
          })
          .from(supplierEvidenceRecords)
          .innerJoin(
            purchasingVendors,
            and(
              eq(purchasingVendors.id, supplierEvidenceRecords.vendorId),
              eq(purchasingVendors.companyId, companyId),
            ),
          )
          .leftJoin(
            paymentBills,
            and(
              eq(paymentBills.id, supplierEvidenceRecords.billId),
              eq(paymentBills.companyId, companyId),
            ),
          )
          .leftJoin(
            journalEntries,
            and(
              sql`${journalEntries.id} = coalesce(${supplierEvidenceRecords.journalEntryId}, ${paymentBills.journalEntryId})`,
              eq(journalEntries.companyId, companyId),
            ),
          )
          .where(eq(supplierEvidenceRecords.companyId, companyId))
          .orderBy(
            desc(supplierEvidenceRecords.date),
            desc(supplierEvidenceRecords.id),
          )
          .limit(30),
        getMonthlySupplierExpenses(companyId, currency, month),
        getSupplierPrepaidBalances(companyId, currency),
      ]);

      const snapshots = bindings.length
        ? await db
            .selectDistinctOn([financeProviderSnapshots.provider])
            .from(financeProviderSnapshots)
            .where(
              inArray(
                financeProviderSnapshots.provider,
                bindings.map(({ provider }) => provider),
              ),
            )
            .orderBy(
              financeProviderSnapshots.provider,
              desc(financeProviderSnapshots.bucketAt),
            )
        : [];
      const providers = bindings.map(({ provider }) => provider);
      const [modelEstimates, providerReview] = await Promise.all([
        getMonthlyModelEstimates(month, providers),
        getMonthlyProviderReview(companyId, month, providers),
      ]);
      return success({
        companyName: company?.name,
        monthly: { month, currency, expenses, modelEstimates, providerReview },
        bindings: bindings.map(({ provider, vendorId, vendorName }) => {
          const snap = snapshots.find((row) => row.provider === provider);
          return {
            provider,
            vendorId,
            vendorName,
            capturedAt: snap?.capturedAt.toISOString() ?? null,
            balanceUsd: snap?.balanceUsd ?? null,
            ledgerPrepaid:
              prepaidBalances.find((row) => row.provider === provider)
                ?.balance ?? null,
            balanceNative: snap?.balanceNative ?? null,
            unit: snap?.unit ?? null,
            intervalSpendUsd: snap?.spendUsd ?? null,
            spendEvidence: snap?.spendEvidence ?? null,
          };
        }),
        records: records.flatMap(({ kind, date, ...row }) => {
          const operation = operationValues.find((value) => value === kind);
          return operation
            ? [{ ...row, kind: operation, date: date.toISOString() }]
            : [];
        }),
      });
    } catch (error) {
      logger.error("Supplier evidence list failed", parseError(error));
      return SupplierEvidenceRepository.server(t);
    }
  }

  static async record(
    data: SupplierEvidenceInput,
    userId: string,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SupplierEvidenceOutput>> {
    try {
      return await db.transaction((tx) =>
        SupplierEvidenceRepository.recordInTransaction(
          tx,
          data,
          userId,
          t,
          logger,
        ),
      );
    } catch (error) {
      logger.error("Supplier evidence record failed", parseError(error));
      return SupplierEvidenceRepository.server(t);
    }
  }

  static async recordInTransaction(
    tx: LedgerTransaction,
    data: SupplierEvidenceInput,
    userId: string,
    t: FinanceT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SupplierEvidenceOutput>> {
    const { companyId, vendorId, operation, externalReference } = data;
    const requestedProvider =
      operation === "bind" ||
      operation === "fund" ||
      operation === "fundBill" ||
      operation === "consume"
        ? data.provider
        : undefined;
    const company = await lockLedgerCompany(tx, companyId);
    const access = await getDocumentAccess(userId, { companyId }, tx);
    if (!company || !access?.canManage) {
      return SupplierEvidenceRepository.forbidden(t);
    }

    if (
      operation === "bind" ||
      operation === "sponsorship" ||
      operation === "processorFee" ||
      operation === "referral"
    ) {
      const [instanceAdmin] = await tx
        .select({ id: userRoles.userId })
        .from(userRoles)
        .where(
          and(eq(userRoles.userId, userId), eq(userRoles.role, UserRole.ADMIN)),
        )
        .limit(1)
        .for("share");
      if (!instanceAdmin) {
        return SupplierEvidenceRepository.forbidden(t);
      }
    }

    const referralId =
      operation === "referral"
        ? SupplierEvidenceRepository.uuid(externalReference ?? "")
        : null;
    const [payout] = referralId
      ? await tx
          .select({
            status: payoutRequests.status,
            currency: payoutRequests.currency,
            recipient: users.email,
            emailVerified: users.emailVerified,
            processedAt: payoutRequests.processedAt,
          })
          .from(payoutRequests)
          .innerJoin(users, eq(users.id, payoutRequests.userId))
          .where(eq(payoutRequests.id, referralId))
          .for("share")
      : [];
    if (operation === "referral") {
      if (!payout) {
        return SupplierEvidenceRepository.invalid(t);
      }
      if (
        !canDocumentReferralPayout(payout) ||
        !vendorId ||
        !data.invoiceReference ||
        !data.date ||
        !data.currency ||
        !data.grossAmount ||
        data.taxAmount === undefined ||
        !data.description ||
        !data.debitAccountId
      ) {
        return SupplierEvidenceRepository.result("review");
      }
    }

    if (!vendorId) {
      return SupplierEvidenceRepository.invalid(t);
    }
    const mayInferProvider =
      operation === "fund" ||
      operation === "fundBill" ||
      operation === "consume";
    const [inferred, ambiguousProvider] =
      mayInferProvider && !requestedProvider
        ? await tx
            .select({ provider: supplierProviderBindings.provider })
            .from(supplierProviderBindings)
            .where(
              and(
                eq(supplierProviderBindings.companyId, companyId),
                eq(supplierProviderBindings.vendorId, vendorId),
              ),
            )
            .limit(2)
        : [];
    const provider =
      requestedProvider ?? (ambiguousProvider ? undefined : inferred?.provider);
    const [vendor] = await tx
      .select()
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.id, vendorId),
          eq(purchasingVendors.companyId, companyId),
        ),
      )
      .for("share");
    if (
      !vendor ||
      (payout &&
        (!payout.emailVerified ||
          vendor.email?.trim().toLowerCase() !==
            payout.recipient.trim().toLowerCase()))
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    if (operation === "bind") {
      if (!provider || !vendor.isActive) {
        return SupplierEvidenceRepository.invalid(t);
      }
      await SupplierEvidenceRepository.lockIdentity(tx, `provider:${provider}`);
      const [existing] = await tx
        .select()
        .from(supplierProviderBindings)
        .where(eq(supplierProviderBindings.provider, provider));
      if (existing) {
        return existing.companyId === companyId &&
          existing.vendorId === vendorId
          ? SupplierEvidenceRepository.result("replayed")
          : SupplierEvidenceRepository.conflict(t);
      }
      if (data.dryRun) {
        return SupplierEvidenceRepository.result("preview");
      }
      await tx.insert(supplierProviderBindings).values({
        companyId,
        vendorId,
        provider,
        configuredByUserId: userId,
      });
      return SupplierEvidenceRepository.result("bound");
    }

    if (!externalReference) {
      return SupplierEvidenceRepository.invalid(t);
    }

    if (provider) {
      const [binding] = await tx
        .select()
        .from(supplierProviderBindings)
        .where(
          and(
            eq(supplierProviderBindings.provider, provider),
            eq(supplierProviderBindings.companyId, companyId),
            eq(supplierProviderBindings.vendorId, vendorId),
          ),
        );
      if (!binding) {
        return SupplierEvidenceRepository.invalid(t);
      }
    }

    const sourceBacked =
      operation === "sponsorship" || operation === "processorFee";
    const sourceId = sourceBacked
      ? SupplierEvidenceRepository.uuid(externalReference)
      : referralId;
    const funding = operation === "fund" || operation === "fundBill";
    const namespace =
      operation === "bill" || operation === "paid" ? "invoice" : operation;
    const sourceScope =
      operation === "referral"
        ? "referral-payout"
        : operation === "sponsorship"
          ? "outreach-deal"
          : operation === "processorFee"
            ? "processor-fee"
            : `vendor:${vendorId}:${funding ? "fund" : namespace}`;
    const reference =
      sourceId ??
      (operation === "bill" || operation === "paid" || funding
        ? externalReference.trim().toUpperCase()
        : externalReference);
    await SupplierEvidenceRepository.lockIdentity(
      tx,
      JSON.stringify([sourceScope, reference]),
    );
    const [existing] = await tx
      .select()
      .from(supplierEvidenceRecords)
      .where(
        and(
          eq(supplierEvidenceRecords.sourceScope, sourceScope),
          eq(supplierEvidenceRecords.externalReference, reference),
        ),
      );
    if (
      existing &&
      (existing.companyId !== companyId || existing.vendorId !== vendorId)
    ) {
      return SupplierEvidenceRepository.conflict(t);
    }

    const source =
      existing || !sourceBacked
        ? null
        : operation === "sponsorship"
          ? await SupplierEvidenceRepository.sponsorship(tx, sourceId)
          : await SupplierEvidenceRepository.processorFee(
              tx,
              companyId,
              sourceId,
            );
    if (sourceBacked && !existing && !source) {
      return SupplierEvidenceRepository.result("review");
    }

    const date = data.date
      ? evidenceDay(data.date)
      : (existing?.date ?? source?.date ?? null);
    const sourceCurrency = sourceBacked
      ? (existing?.currency ?? source?.currency)
      : data.currency;
    const grossAmount = sourceBacked
      ? (existing?.grossAmount ?? source?.grossAmount ?? "")
      : (data.grossAmount ?? "");
    const description = sourceBacked
      ? (existing?.description ?? source?.description ?? "")
      : (data.description ?? "");
    const isBill =
      operation === "bill" ||
      operation === "fundBill" ||
      operation === "referral" ||
      sourceBacked;
    const invoiceNumber =
      isBill || operation === "paid" || operation === "fund"
        ? (data.invoiceReference ??
          (sourceBacked || operation === "fund"
            ? undefined
            : externalReference))
        : undefined;
    const invoiceReference = invoiceNumber?.trim().toUpperCase() ?? null;
    const servicePeriodStart = data.servicePeriodStart
      ? evidenceDay(data.servicePeriodStart)
      : null;
    const servicePeriodEnd = data.servicePeriodEnd
      ? evidenceDay(data.servicePeriodEnd)
      : null;
    if (
      (data.servicePeriodStart || data.servicePeriodEnd) &&
      (!servicePeriodStart ||
        !servicePeriodEnd ||
        servicePeriodStart > servicePeriodEnd)
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }
    if (sourceBacked && (!invoiceReference || data.taxAmount === undefined)) {
      return SupplierEvidenceRepository.result("review", {
        date: date?.toISOString().slice(0, 10) ?? null,
        currency: sourceCurrency ?? null,
        grossAmount,
      });
    }
    const taxAmount = isBill ? (data.taxAmount ?? "") : "0";
    const amount = evidenceAmounts(grossAmount, taxAmount, isBill);
    const { debitAccountId } = data;
    const creditAccountId = isBill ? undefined : data.creditAccountId;
    const parsedCurrency = evidenceCurrencies.safeParse(sourceCurrency);
    if (
      !date ||
      !parsedCurrency.success ||
      !amount ||
      !description ||
      !debitAccountId ||
      (!isBill && !creditAccountId)
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    const currency = parsedCurrency.data;
    const decimal = amount.gross.toFixed(4);
    const taxDecimal = amount.tax.toFixed(4);
    const digest = createHash("sha256")
      .update(
        JSON.stringify([
          companyId,
          vendorId,
          operation,
          (!requestedProvider && existing ? existing.provider : provider) ??
            null,
          sourceScope,
          reference,
          invoiceReference,
          servicePeriodStart?.toISOString() ?? null,
          servicePeriodEnd?.toISOString() ?? null,
          date.toISOString(),
          currency,
          decimal,
          taxDecimal,
          isBill ? null : description,
          debitAccountId,
          creditAccountId ?? null,
        ]),
      )
      .digest("hex");
    const details = {
      date: date.toISOString().slice(0, 10),
      currency,
      grossAmount: decimal,
    };

    if (existing) {
      return existing.digest === digest &&
        (!data.bankDraftBillId || existing.billId === data.bankDraftBillId)
        ? SupplierEvidenceRepository.result("replayed", {
            ...details,
            id: existing.id,
            billId: existing.billId,
            journalEntryId: existing.journalEntryId,
          })
        : SupplierEvidenceRepository.conflict(t);
    }

    if (
      !vendor.isActive ||
      (!isBill &&
        (currency !== company.currency ||
          !(await findOpenPeriod(tx, companyId, date))))
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    const accountIds = [
      debitAccountId,
      ...(creditAccountId ? [creditAccountId] : []),
    ];
    const accounts = await tx
      .select()
      .from(accountNodes)
      .where(
        and(
          inArray(accountNodes.id, accountIds),
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .orderBy(accountNodes.id)
      .for("share");
    const debit = accounts.find(({ id }) => id === debitAccountId);
    const credit = accounts.find(({ id }) => id === creditAccountId);
    if (
      !debit ||
      (funding
        ? debit.type !== AccountType.ASSET ||
          debit.subtype !== AccountSubtype.PREPAID
        : debit.type !== AccountType.EXPENSE) ||
      (!isBill &&
        (!credit ||
          debit.id === credit.id ||
          credit.type !== AccountType.ASSET ||
          (operation === "consume"
            ? credit.subtype !== AccountSubtype.PREPAID
            : credit.subtype !== AccountSubtype.BANK &&
              credit.subtype !== AccountSubtype.CASH)))
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    if (
      operation === "consume" &&
      credit &&
      !(await SupplierEvidenceRepository.hasPrepaidAmount(
        tx,
        companyId,
        credit.id,
        date,
        currency,
        amount.gross,
      ))
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    const line = isBill
      ? calculateBillLine({
          quantity: 1,
          unitPrice: amount.net,
          taxRate: amount.tax / amount.net,
        })
      : null;
    if (
      line &&
      (line.taxRate > 1 ||
        line.lineTotal !== amount.gross ||
        line.taxAmount !== amount.tax)
    ) {
      return SupplierEvidenceRepository.invalid(t);
    }

    if (invoiceReference) {
      const [linked] = await tx
        .select()
        .from(supplierEvidenceRecords)
        .where(
          and(
            eq(supplierEvidenceRecords.companyId, companyId),
            eq(supplierEvidenceRecords.vendorId, vendorId),
            eq(supplierEvidenceRecords.invoiceReference, invoiceReference),
          ),
        );
      if (linked) {
        const exact =
          isBill &&
          linked.billId &&
          linked.currency === currency &&
          linked.grossAmount === decimal &&
          linked.taxAmount === taxDecimal &&
          linked.date.getTime() === date.getTime() &&
          (operation !== "referral" ||
            linked.debitAccountId === debitAccountId) &&
          (linked.kind === "fundBill") === funding;
        if (
          !exact ||
          !linked.billId ||
          (data.bankDraftBillId && linked.billId !== data.bankDraftBillId)
        ) {
          return SupplierEvidenceRepository.conflict(t);
        }
        if (sourceBacked || operation === "referral") {
          const [alreadyMatched] = await tx
            .select({ id: supplierEvidenceRecords.id })
            .from(supplierEvidenceRecords)
            .where(
              and(
                eq(supplierEvidenceRecords.billId, linked.billId),
                eq(supplierEvidenceRecords.kind, operation),
              ),
            )
            .limit(1);
          if (alreadyMatched) {
            return SupplierEvidenceRepository.conflict(t);
          }
        }
        let id = linked.id;
        if (!data.dryRun) {
          id = randomUUID();
          await tx.insert(supplierEvidenceRecords).values({
            id,
            companyId,
            vendorId,
            sourceScope,
            provider,
            externalReference: reference,
            digest,
            servicePeriodStart,
            servicePeriodEnd,
            kind: operation,
            date,
            grossAmount: decimal,
            taxAmount: taxDecimal,
            currency,
            description,
            debitAccountId,
            billId: linked.billId,
            recordedByUserId: userId,
          });
        }
        return SupplierEvidenceRepository.result("replayed", {
          ...details,
          id,
          billId: linked.billId,
        });
      }
    }

    if (invoiceReference) {
      const [duplicate, ambiguous] = await tx
        .select({
          id: paymentBills.id,
          canonicalVendorId: sql<
            string | null
          >`${paymentBills.metadata}->>'vendorId'`,
          total: paymentBills.total,
          taxAmount: paymentBills.taxAmount,
          currency: paymentBills.currency,
          billDate: paymentBills.billDate,
          status: paymentBills.status,
          metadata: paymentBills.metadata,
        })
        .from(paymentBills)
        .where(
          and(
            eq(paymentBills.companyId, companyId),
            sql`upper(btrim(${paymentBills.billNumber})) = ${invoiceReference}`,
            sql`(${paymentBills.metadata}->>'vendorId' = ${vendorId} OR (${paymentBills.metadata}->>'vendorId' IS NULL AND ${paymentBills.supplierName} = ${vendor.name}))`,
          ),
        )
        .limit(2);
      if (ambiguous) {
        return SupplierEvidenceRepository.conflict(t);
      }
      if (duplicate) {
        if (operation === "referral") {
          const expenseLines = await tx
            .selectDistinct({ accountId: paymentBillLines.expenseAccountId })
            .from(paymentBillLines)
            .where(eq(paymentBillLines.billId, duplicate.id))
            .limit(2);
          if (
            expenseLines.length !== 1 ||
            expenseLines[0]?.accountId !== debitAccountId
          ) {
            return SupplierEvidenceRepository.conflict(t);
          }
        }
        const pending = mailboxTaxPending(duplicate.metadata);
        const confirmPending =
          pending !== null &&
          line !== null &&
          funding &&
          operation === "fundBill" &&
          duplicate.status === BillStatus.DRAFT &&
          pending.debitAccountId === debitAccountId &&
          duplicate.canonicalVendorId === vendorId &&
          duplicate.total === amount.gross &&
          duplicate.currency === currency &&
          accountingDay(duplicate.billDate).getTime() === date.getTime();
        const exact =
          !pending &&
          isBill &&
          !funding &&
          duplicate.canonicalVendorId === vendorId &&
          duplicate.total === amount.gross &&
          duplicate.taxAmount === amount.tax &&
          duplicate.currency === currency &&
          accountingDay(duplicate.billDate).getTime() === date.getTime();
        if ((!confirmPending && !exact) || data.bankDraftBillId) {
          return SupplierEvidenceRepository.conflict(t);
        }
        if (!data.dryRun) {
          const evidenceId = randomUUID();
          await tx.insert(supplierEvidenceRecords).values({
            id: evidenceId,
            companyId,
            vendorId,
            sourceScope,
            provider,
            externalReference: reference,
            digest,
            invoiceReference,
            servicePeriodStart,
            servicePeriodEnd,
            kind: operation,
            date,
            grossAmount: decimal,
            taxAmount: taxDecimal,
            currency,
            description,
            debitAccountId,
            billId: duplicate.id,
            recordedByUserId: userId,
          });
          if (confirmPending && line) {
            await tx
              .update(paymentBills)
              .set({
                subtotal: amount.net,
                taxAmount: amount.tax,
                updatedAt: new Date(),
                metadata: sql`(${paymentBills.metadata} - 'mailboxTaxPending')
                || ${JSON.stringify({
                  supplierEvidenceId: evidenceId,
                  mailboxReviewId: pending.reviewId,
                  mailboxTaxConfirmedBy: userId,
                })}::jsonb`,
              })
              .where(eq(paymentBills.id, duplicate.id));
            await tx.insert(paymentBillLines).values({
              ...line,
              billId: duplicate.id,
              description,
              expenseAccountId: debitAccountId,
            });
          }
        }
        return SupplierEvidenceRepository.result("replayed", {
          ...details,
          billId: duplicate.id,
        });
      }
    }

    if (data.bankDraftBillId && (!line || !invoiceReference)) {
      return SupplierEvidenceRepository.invalid(t);
    }
    const [bankBill] = data.bankDraftBillId
      ? await tx
          .select()
          .from(paymentBills)
          .where(
            and(
              eq(paymentBills.id, data.bankDraftBillId),
              eq(paymentBills.companyId, companyId),
            ),
          )
          .for("update")
      : [];
    if (data.bankDraftBillId) {
      const origin = bankBill && readBankBillOrigin(bankBill);
      if (
        !bankBill ||
        !origin?.originalSupplierInvoicePending ||
        origin.vendorId !== vendorId ||
        (!funding && origin.expenseAccountId !== debitAccountId) ||
        bankBill.billNumber ||
        bankBill.total !== amount.gross ||
        bankBill.currency !== currency ||
        bankBill.taxAmount !== 0 ||
        bankBill.status === BillStatus.DISPUTED ||
        !(await findBankBillStatement(tx, bankBill, origin))
      ) {
        return SupplierEvidenceRepository.conflict(t);
      }
    } else if (
      invoiceReference &&
      !data.confirmSeparateBankBill &&
      (await hasSupplierBillCandidate(
        tx,
        {
          companyId,
          vendorId,
          supplierName: vendor.name,
          currency,
          total: amount.gross,
          date,
        },
        "bank-pending",
      ))
    ) {
      return fail({
        message: t("suppliers.possibleBankDuplicate"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    if (data.dryRun) {
      return SupplierEvidenceRepository.result("preview", {
        ...details,
        ...(bankBill ? { billId: bankBill.id } : {}),
      });
    }

    const id = randomUUID();
    let billId: string | null = null;
    let journalEntryId: string | null = null;
    if (line && bankBill) {
      billId = bankBill.id;
      const posted =
        !!bankBill.journalEntryId ||
        bankBill.status === BillStatus.APPROVED ||
        bankBill.status === BillStatus.PAID;
      await tx
        .update(paymentBills)
        .set({
          billNumber: invoiceNumber,
          updatedAt: new Date(),
          metadata: sql`coalesce(${paymentBills.metadata}, '{}'::jsonb) || ${JSON.stringify(
            {
              supplierEvidenceId: id,
              originalSupplierInvoicePending: false,
              supplierDocumentLinkedAfterPosting: posted,
              supplierDocumentDate: date.toISOString().slice(0, 10),
              supplierDocumentTaxAmount: taxDecimal,
            },
          )}::jsonb`,
          ...(posted
            ? {}
            : {
                billDate: date,
                dueDate:
                  billDueDateFromTerms(date, vendor.defaultPaymentTermsDays) ??
                  null,
                subtotal: amount.net,
                taxAmount: amount.tax,
              }),
        })
        .where(eq(paymentBills.id, billId));
      if (!posted) {
        await tx
          .delete(paymentBillLines)
          .where(eq(paymentBillLines.billId, billId));
        await tx.insert(paymentBillLines).values({
          ...line,
          billId,
          description,
          expenseAccountId: debitAccountId,
        });
      }
    } else if (line) {
      billId = randomUUID();
      await tx.insert(paymentBills).values({
        id: billId,
        companyId,
        supplierName: vendor.name,
        supplierVatNumber: vendor.vatNumber,
        billNumber: invoiceNumber,
        billDate: date,
        dueDate:
          billDueDateFromTerms(date, vendor.defaultPaymentTermsDays) ?? null,
        currency,
        metadata: {
          vendorId,
          supplierEvidenceId: id,
          sourcePaidAt:
            (payout?.status === PayoutStatus.COMPLETED
              ? payout.processedAt
              : source?.paidAt
            )?.toISOString() ?? null,
          ...(referralId ? { referralPayoutId: referralId } : {}),
          sourceOccurredOn: source?.date.toISOString().slice(0, 10) ?? null,
          ...(data.confirmSeparateBankBill
            ? {
                separateBankChargeConfirmedAt: new Date().toISOString(),
                separateBankChargeConfirmedBy: userId,
              }
            : {}),
        },
        subtotal: amount.net,
        taxAmount: amount.tax,
        total: amount.gross,
      });
      await tx.insert(paymentBillLines).values({
        ...line,
        billId,
        description,
        expenseAccountId: debitAccountId,
      });
    } else if (credit) {
      journalEntryId = await postJournalEntry(
        {
          companyId,
          date,
          description,
          sourceType: JournalSourceType.SUPPLIER_EVIDENCE,
          sourceId: id,
          postedByUserId: userId,
          logger,
          lines: [
            {
              accountNodeId: debit.id,
              subtype: debit.subtype,
              type: LineType.DEBIT,
              amount: amount.gross,
              currency,
            },
            {
              accountNodeId: credit.id,
              subtype: credit.subtype,
              type: LineType.CREDIT,
              amount: amount.gross,
              currency,
            },
          ],
        },
        tx,
      );
      if (!journalEntryId) {
        return SupplierEvidenceRepository.invalid(t);
      }
    }

    await tx.insert(supplierEvidenceRecords).values({
      id,
      companyId,
      vendorId,
      sourceScope,
      provider,
      externalReference: reference,
      digest,
      invoiceReference,
      servicePeriodStart,
      servicePeriodEnd,
      kind: operation,
      date,
      grossAmount: decimal,
      taxAmount: taxDecimal,
      currency,
      description,
      debitAccountId,
      creditAccountId,
      journalEntryId,
      billId,
      recordedByUserId: userId,
    });
    return SupplierEvidenceRepository.result(
      bankBill ? "linked" : billId ? "bill" : "posted",
      {
        ...details,
        id,
        billId,
        journalEntryId,
      },
    );
  }

  private static async hasPrepaidAmount(
    tx: LedgerTransaction,
    companyId: string,
    accountId: string,
    date: Date,
    currency: string,
    amount: number,
  ): Promise<boolean> {
    const [remaining] = await tx
      .select({
        sufficient: sql<boolean>`coalesce(sum(case when ${journalEntryLines.type} = ${LineType.DEBIT}
          then ${journalEntryLines.amount} else -${journalEntryLines.amount} end), 0) >= ${amount}`,
      })
      .from(journalEntryLines)
      .innerJoin(
        journalEntries,
        eq(journalEntries.id, journalEntryLines.journalEntryId),
      )
      .where(
        and(
          eq(journalEntryLines.accountId, accountId),
          eq(journalEntryLines.currency, currency),
          eq(journalEntries.companyId, companyId),
          inArray(journalEntries.status, ledgerEntryStatuses),
          lt(journalEntries.date, nextAccountingDay(date)),
        ),
      );
    return remaining?.sufficient === true;
  }

  private static async sponsorship(
    tx: LedgerTransaction,
    id: string | null,
  ): Promise<{
    date: Date;
    paidAt: Date | null;
    currency: string;
    grossAmount: string;
    description: string;
  } | null> {
    const [deal] = id
      ? await tx
          .select()
          .from(outreachDeals)
          .where(eq(outreachDeals.id, id))
          .for("share")
      : [];
    if (!deal) {
      return null;
    }
    const date = creatorDealBillDate(deal);
    return date
      ? {
          date: accountingDay(date),
          currency: deal.currency,
          grossAmount: (deal.amountCents / 100).toFixed(2),
          description: deal.deliverable,
          paidAt: deal.paidAt,
        }
      : null;
  }

  private static async processorFee(
    tx: LedgerTransaction,
    companyId: string,
    evidenceId: string | null,
  ): Promise<{
    date: Date;
    paidAt: Date;
    currency: string;
    grossAmount: string;
    description: string;
  } | null> {
    if (!evidenceId) {
      return null;
    }
    const [fee] = await tx
      .select()
      .from(paymentAccountingEvidence)
      .where(
        and(
          eq(paymentAccountingEvidence.id, evidenceId),
          eq(paymentAccountingEvidence.provider, PaymentProvider.STRIPE),
          eq(paymentAccountingEvidence.sourceKind, "fee"),
        ),
      )
      .for("share");
    if (
      !fee ||
      !fee.feeMinor ||
      !Number.isSafeInteger(fee.feeMinor) ||
      fee.feeMinor <= 0
    ) {
      return null;
    }
    const [owner, ambiguous] = await tx
      .selectDistinct({ companyId: paymentAccountingOffers.companyId })
      .from(paymentAccountingOffers)
      .where(
        and(
          eq(paymentAccountingOffers.provider, fee.provider),
          eq(paymentAccountingOffers.merchantId, fee.merchantId),
          eq(paymentAccountingOffers.currency, fee.currency),
          eq(paymentAccountingOffers.active, true),
        ),
      )
      .limit(2);
    if (!owner || ambiguous || owner.companyId !== companyId) {
      return null;
    }
    return {
      date: accountingDay(fee.sourceDate),
      paidAt: fee.sourceDate,
      currency: fee.currency,
      grossAmount: (fee.feeMinor / 100).toFixed(2),
      description: fee.externalId,
    };
  }

  private static uuid(value: string): string | null {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
      ? value.toLowerCase()
      : null;
  }

  private static async lockIdentity(
    tx: LedgerTransaction,
    key: string,
  ): Promise<void> {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${`supplier-evidence:${key}`}, 0))`,
    );
  }

  private static result(
    outcome: SupplierEvidenceOutput["result"]["outcome"],
    values?: Partial<Omit<SupplierEvidenceOutput["result"], "outcome">>,
  ): ResponseType<SupplierEvidenceOutput> {
    return success({
      result: {
        id: null,
        billId: null,
        journalEntryId: null,
        grossAmount: null,
        currency: null,
        date: null,
        ...values,
        outcome,
      },
    });
  }

  private static forbidden(t: FinanceT): ErrorResponseType {
    return fail({
      message: t("errors.forbidden.title"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }

  private static conflict(t: FinanceT): ErrorResponseType {
    return fail({
      message: t("suppliers.conflict"),
      errorType: ErrorResponseTypes.CONFLICT,
    });
  }

  private static invalid(t: FinanceT): ErrorResponseType {
    return fail({
      message: t("suppliers.invalid"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }

  private static server(t: FinanceT): ErrorResponseType {
    return fail({
      message: t("errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
