/**
 * Purchase Order Convert to Bill Repository
 * Creates a real AP bill in paymentBills, inserts bill lines from PO lines,
 * and links billId back to the PO.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  AccountSubtype,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { autoPostJournalEntry } from "@/chart-of-accounts/shared/auto-post";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";

import {
  purchaseOrderLines,
  purchaseOrders,
  purchasingVendors,
} from "../../../db";
import { scopedTranslation } from "../../../i18n";

interface ConvertToBillResult {
  result: { billId: string; billNumber: string; poId: string };
}

export class OrderConvertToBillRepository {
  static async convertToBill(
    poId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<ConvertToBillResult>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [po] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId))
        .limit(1);

      if (!po) {
        return fail({
          message: t("orderConvertToBill.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (po.billId) {
        return fail({
          message: t("orderConvertToBill.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        po.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("orderConvertToBill.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Fetch vendor for supplier name/VAT
      const [vendor] = await db
        .select({
          name: purchasingVendors.name,
          vatNumber: purchasingVendors.vatNumber,
        })
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, po.vendorId))
        .limit(1);

      const supplierName = vendor?.name ?? "Unknown Vendor";
      const supplierVatNumber = vendor?.vatNumber ?? null;
      const billNumber = `PO-${po.poNumber}`;
      const now = new Date();

      // Validate currency against the allowed enum values; fallback to EUR
      const currency = (CurrenciesArr as ReadonlyArray<string>).includes(
        po.currency,
      )
        ? (po.currency as (typeof CurrenciesArr)[number])
        : ("EUR" as const);

      // Insert into paymentBills
      const [newBill] = await db
        .insert(paymentBills)
        .values({
          companyId: po.companyId,
          supplierName,
          supplierVatNumber,
          billNumber,
          billDate: now,
          dueDate: po.expectedDeliveryDate ?? null,
          currency,
          status: BillStatus.RECEIVED,
          subtotal: po.subtotal,
          taxAmount: po.taxAmount,
          total: po.total,
          notes: `Converted from PO ${po.poNumber}`,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      if (!newBill) {
        return fail({
          message: t("orderConvertToBill.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Fetch PO lines and insert as bill lines
      const lines = await db
        .select()
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, poId))
        .orderBy(purchaseOrderLines.sortOrder);

      for (const line of lines) {
        const taxRate = line.taxRate ?? 0;
        const taxAmount = line.quantity * line.unitPrice * taxRate;
        const lineTotal = line.quantity * line.unitPrice * (1 + taxRate);

        await db.insert(paymentBillLines).values({
          billId: newBill.id,
          description: line.description,
          productId: line.productId ?? undefined,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate,
          taxAmount,
          lineTotal,
          sortOrder: line.sortOrder ?? 0,
          createdAt: now,
          updatedAt: now,
        });
      }

      // Link bill back to PO and update status to BILLED
      await db
        .update(purchaseOrders)
        .set({ billId: newBill.id, status: "BILLED", updatedAt: now })
        .where(eq(purchaseOrders.id, poId));

      // --- AP_BILL journal entry (best-effort, never blocks conversion) ---
      try {
        await autoPostJournalEntry({
          companyId: po.companyId,
          date: now,
          description: `AP Bill: ${billNumber}`,
          sourceType: JournalSourceType.AP_BILL,
          sourceId: newBill.id,
          lines: [
            {
              subtype: AccountSubtype.OPEX,
              type: LineType.DEBIT,
              amount: newBill.subtotal,
              currency,
              description: `AP Bill expense: ${supplierName}`,
            },
            ...(newBill.taxAmount > 0
              ? [
                  {
                    subtype: AccountSubtype.VAT_RECEIVABLE,
                    type: LineType.DEBIT,
                    amount: newBill.taxAmount,
                    currency,
                    description: "AP Bill VAT receivable",
                  },
                ]
              : []),
            {
              subtype: AccountSubtype.ACCOUNTS_PAYABLE,
              type: LineType.CREDIT,
              amount: newBill.total,
              currency,
              description: `AP Bill payable: ${supplierName}`,
            },
          ],
        });
      } catch (journalError) {
        logger.warn(
          "AP_BILL journal entry posting failed — PO conversion continues",
          {
            poId,
            billId: newBill.id,
            error: parseError(journalError).message,
          },
        );
      }

      logger.info("Purchase order converted to bill", {
        poId,
        billId: newBill.id,
        billNumber: newBill.billNumber,
      });

      return success({
        result: {
          billId: newBill.id,
          billNumber: newBill.billNumber ?? billNumber,
          poId,
        },
      });
    } catch (error) {
      logger.error("Failed to convert PO to bill", parseError(error));
      return fail({
        message: t("orderConvertToBill.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
