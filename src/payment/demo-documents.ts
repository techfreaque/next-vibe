import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { withTransaction } from "next-vibe/database/utils/repository-helpers";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import {
  demoRecordId,
  findDemoCompany,
} from "@/companies/demo-company.repository";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import { purchasingVendors } from "@/purchasing/db";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import {
  paymentBillLines,
  paymentBills,
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoices,
} from "./db";
import { BillStatus, EstimateStatus, InvoiceStatus } from "./enum";
import { calculateInvoiceLine } from "./invoice/line/amounts";

const currency = "EUR";
const taxRate = 0.19;

export async function seedDemoDocuments(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  const demo = await findDemoCompany();
  if (!demo) {
    return;
  }
  const { id: companyId, adminId } = demo;
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthKey = now.toISOString().slice(0, 7);
  const today = new Date(Date.UTC(year, month, now.getUTCDate()));
  const previousMonth = new Date(Date.UTC(year, month - 1, 1));
  const overdue = new Date(Date.UTC(year, month - 1, 15));
  const nextMonth = new Date(Date.UTC(year, month + 1, 15));
  const customer = {
    id: demoRecordId(companyId, "customer:birch-street"),
    name: "Birch Street Design GmbH",
    email: `birch-street+${companyId}@demo-company.example`,
  };

  const saved = await withTransaction(
    logger,
    async (tx): Promise<boolean> => {
      if ((await lockLedgerCompany(tx, companyId))?.currency !== currency) {
        return false;
      }
      const invoiceId = demoRecordId(companyId, `invoice:${monthKey}:workshop`);
      const [existing] = await tx
        .select({ id: paymentInvoices.id })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      if (existing) {
        return true;
      }
      const [vendor] = await tx
        .select()
        .from(purchasingVendors)
        .where(
          and(
            eq(purchasingVendors.companyId, companyId),
            eq(purchasingVendors.code, "ACME"),
          ),
        )
        .limit(1);
      const [expense] = await tx
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(
          and(
            eq(accountNodes.companyId, companyId),
            eq(accountNodes.subtype, AccountSubtype.OPEX),
            eq(accountNodes.isPostable, true),
            eq(accountNodes.isActive, true),
          ),
        )
        .orderBy(accountNodes.code)
        .limit(1);
      if (!vendor || !expense) {
        return false;
      }

      const post = (
        sourceId: string,
        sourceType: Parameters<typeof postJournalEntry>[0]["sourceType"],
        description: string,
        date: Date,
        lines: Omit<AutoPostLine, "currency">[],
      ): Promise<string | null> =>
        postJournalEntry(
          {
            companyId,
            date,
            sourceType,
            sourceId,
            description,
            postedByUserId: adminId,
            logger,
            lines: lines.map((line) => ({ ...line, currency })),
          },
          tx,
        );

      await tx
        .insert(users)
        .values({
          id: customer.id,
          email: customer.email,
          privateName: customer.name,
          publicName: customer.name,
          password: "!",
          locale,
          isActive: false,
        })
        .onConflictDoNothing();
      await tx
        .insert(userRoles)
        .values({
          id: demoRecordId(customer.id, "role"),
          userId: customer.id,
          role: UserRole.CUSTOMER,
        })
        .onConflictDoNothing();

      const customerMetadata = {
        customerId: customer.id,
        customerName: customer.name,
        lineSettlement: LINE_SETTLEMENT_V1,
      };
      for (const sample of [
        {
          id: invoiceId,
          key: "WORKSHOP",
          net: 600,
          quantity: 4,
          paid: 238,
          issued: previousMonth,
          due: overdue,
        },
        {
          id: demoRecordId(companyId, `invoice:${monthKey}:consulting`),
          key: "CONSULTING",
          net: 300,
          quantity: 2,
          paid: 357,
          issued: today,
          due: nextMonth,
        },
      ]) {
        const invoiceNumber = `DEMO-INV-${monthKey}-${sample.key}`;
        const line = calculateInvoiceLine(
          {
            quantity: sample.quantity,
            unitPrice: sample.net / sample.quantity,
            taxRate,
          },
          LINE_SETTLEMENT_V1,
        );
        const journalEntryId = await post(
          sample.id,
          JournalSourceType.AR_INVOICE,
          invoiceNumber,
          sample.issued,
          [
            {
              subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
              type: LineType.DEBIT,
              amount: line.lineTotal,
            },
            {
              subtype: AccountSubtype.REVENUE_SERVICE,
              fallbackSubtype: AccountSubtype.REVENUE_SALES,
              type: LineType.CREDIT,
              amount: sample.net,
            },
            {
              subtype: AccountSubtype.VAT_PAYABLE,
              type: LineType.CREDIT,
              amount: line.taxAmount,
            },
          ],
        );
        if (!journalEntryId) {
          return tx.rollback();
        }
        const receipt = await post(
          sample.id,
          JournalSourceType.AR_PAYMENT,
          `Bank receipt for ${invoiceNumber}`,
          today,
          [
            {
              subtype: AccountSubtype.BANK,
              type: LineType.DEBIT,
              amount: sample.paid,
            },
            {
              subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
              type: LineType.CREDIT,
              amount: sample.paid,
            },
          ],
        );
        if (!receipt) {
          return tx.rollback();
        }
        const paid = sample.paid === line.lineTotal;
        await tx.insert(paymentInvoices).values({
          id: sample.id,
          userId: adminId,
          companyId,
          providerInvoiceId: `${invoiceNumber}-${companyId}`,
          invoiceNumber,
          amount: line.lineTotal.toFixed(2),
          currency,
          status: paid ? InvoiceStatus.PAID : InvoiceStatus.OPEN,
          journalEntryId,
          dueDate: sample.due,
          paidAt: paid ? today : null,
          metadata: customerMetadata,
          createdAt: sample.issued,
          updatedAt: today,
        });
        await tx.insert(paymentInvoiceLines).values({
          ...line,
          invoiceId: sample.id,
          description: paid ? "Studio consulting" : "On-site design workshops",
        });
      }

      const creditId = demoRecordId(invoiceId, "credit-note");
      const creditNumber = `CN-DEMO-${monthKey}-WORKSHOP`;
      const creditLine = calculateInvoiceLine(
        { quantity: 1, unitPrice: 150, taxRate },
        LINE_SETTLEMENT_V1,
      );
      const creditJournal = await post(
        creditId,
        JournalSourceType.AR_INVOICE,
        creditNumber,
        today,
        [
          {
            subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
            type: LineType.CREDIT,
            amount: creditLine.lineTotal,
          },
          {
            subtype: AccountSubtype.REVENUE_SERVICE,
            fallbackSubtype: AccountSubtype.REVENUE_SALES,
            type: LineType.DEBIT,
            amount: 150,
          },
          {
            subtype: AccountSubtype.VAT_PAYABLE,
            type: LineType.DEBIT,
            amount: creditLine.taxAmount,
          },
        ],
      );
      if (!creditJournal) {
        return tx.rollback();
      }
      await tx.insert(paymentInvoices).values({
        id: creditId,
        userId: adminId,
        companyId,
        providerInvoiceId: `${creditNumber}-${companyId}`,
        invoiceNumber: creditNumber,
        amount: (-creditLine.lineTotal).toFixed(2),
        currency,
        status: InvoiceStatus.OPEN,
        journalEntryId: creditJournal,
        metadata: {
          ...customerMetadata,
          originalInvoiceId: invoiceId,
          reason: "One workshop was cancelled.",
        },
        createdAt: today,
        updatedAt: today,
      });
      await tx.insert(paymentInvoiceLines).values({
        ...creditLine,
        invoiceId: creditId,
        description: "Cancelled workshop",
        unitPrice: -creditLine.unitPrice,
        taxAmount: -creditLine.taxAmount,
        lineTotal: -creditLine.lineTotal,
      });

      for (const sample of [
        {
          key: "CABLES",
          description: "Studio cable and adapter supplies",
          net: 120,
          paid: false,
          issued: previousMonth,
          due: overdue,
        },
        {
          key: "REPAIR",
          description: "Studio equipment repair",
          net: 250,
          paid: true,
          issued: today,
          due: nextMonth,
        },
      ]) {
        const billId = demoRecordId(
          companyId,
          `bill:${monthKey}:${sample.key}`,
        );
        const evidenceId = demoRecordId(billId, "evidence");
        const billNumber = `DEMO-AP-${monthKey}-${sample.key}`;
        const line = calculateInvoiceLine(
          { quantity: 1, unitPrice: sample.net, taxRate },
          LINE_SETTLEMENT_V1,
        );
        const journalEntryId = await post(
          billId,
          JournalSourceType.AP_BILL,
          billNumber,
          sample.issued,
          [
            {
              subtype: AccountSubtype.OPEX,
              accountNodeId: expense.id,
              type: LineType.DEBIT,
              amount: sample.net,
            },
            {
              subtype: AccountSubtype.VAT_RECEIVABLE,
              type: LineType.DEBIT,
              amount: line.taxAmount,
            },
            {
              subtype: AccountSubtype.ACCOUNTS_PAYABLE,
              type: LineType.CREDIT,
              amount: line.lineTotal,
            },
          ],
        );
        if (!journalEntryId) {
          return tx.rollback();
        }
        if (sample.paid) {
          const settlement = await post(
            billId,
            JournalSourceType.AP_PAYMENT,
            `Bank payment for ${billNumber}`,
            today,
            [
              {
                subtype: AccountSubtype.ACCOUNTS_PAYABLE,
                type: LineType.DEBIT,
                amount: line.lineTotal,
              },
              {
                subtype: AccountSubtype.BANK,
                type: LineType.CREDIT,
                amount: line.lineTotal,
              },
            ],
          );
          if (!settlement) {
            return tx.rollback();
          }
        }
        await tx.insert(paymentBills).values({
          id: billId,
          companyId,
          supplierName: vendor.name,
          supplierVatNumber: vendor.vatNumber,
          billNumber,
          billDate: sample.issued,
          dueDate: sample.due,
          currency,
          status: sample.paid ? BillStatus.PAID : BillStatus.APPROVED,
          subtotal: sample.net,
          taxAmount: line.taxAmount,
          total: line.lineTotal,
          journalEntryId,
          paidAt: sample.paid ? today : null,
          metadata: {
            vendorId: vendor.id,
            supplierEvidenceId: evidenceId,
            lineSettlement: LINE_SETTLEMENT_V1,
          },
          createdAt: sample.issued,
          updatedAt: today,
        });
        await tx.insert(paymentBillLines).values({
          ...line,
          billId,
          description: sample.description,
          expenseAccountId: expense.id,
        });
        await tx.insert(supplierEvidenceRecords).values({
          id: evidenceId,
          companyId,
          vendorId: vendor.id,
          sourceScope: `demo:${companyId}`,
          externalReference: billNumber,
          invoiceReference: billNumber,
          digest: evidenceId,
          kind: "bill",
          date: sample.issued,
          grossAmount: line.lineTotal.toFixed(2),
          taxAmount: line.taxAmount.toFixed(2),
          currency,
          description: sample.description,
          debitAccountId: expense.id,
          billId,
          recordedByUserId: adminId,
        });
      }

      const estimateId = demoRecordId(
        companyId,
        `estimate:${monthKey}:training`,
      );
      const quoteLine = calculateInvoiceLine(
        { quantity: 3, unitPrice: 150, taxRate },
        LINE_SETTLEMENT_V1,
      );
      await tx.insert(paymentEstimates).values({
        id: estimateId,
        companyId,
        estimateNumber: `DEMO-Q-${monthKey}`,
        status: EstimateStatus.SENT,
        title: "Design team training",
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        validUntil: nextMonth,
        sentAt: today,
        currency,
        subtotal: 450,
        taxAmount: quoteLine.taxAmount,
        total: quoteLine.lineTotal,
        createdAt: today,
        updatedAt: today,
      });
      await tx.insert(paymentEstimateLines).values({
        ...quoteLine,
        estimateId,
        description: "Hands-on design training",
      });
      return true;
    },
    () => false,
  );
  if (!saved) {
    logger.warn(
      "ERP demo documents require EUR, a supplier and open posting periods",
      { companyId },
    );
  }
}
