/**
 * Chart of Accounts — Receivables Aging Repository
 * Buckets unpaid invoices by days overdue as of asOfDate
 */

import "server-only";

import { ne } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import { paymentInvoices } from "@/app/api/[locale]/payment/db";
import { InvoiceStatus } from "@/app/api/[locale]/payment/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../../i18n";
import type { ReceivablesAgingRequestOutput } from "./definition";

interface InvoiceItem {
  invoiceId: string;
  customerId: string;
  amount: number;
  dueDate: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function sumBucket(bucket: InvoiceItem[]): number {
  return bucket.reduce((s, i) => s + i.amount, 0);
}

export class ReceivablesAgingRepository {
  static async getReceivablesAging(
    data: ReceivablesAgingRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      asOfDateResponse: string;
      bucketsCurrentItems: InvoiceItem[];
      bucketsDays1to30Items: InvoiceItem[];
      bucketsDays31to60Items: InvoiceItem[];
      bucketsDays61to90Items: InvoiceItem[];
      bucketsOver90Items: InvoiceItem[];
      totalsCurrent: number;
      totalsDays1to30: number;
      totalsDays31to60: number;
      totalsDays61to90: number;
      totalsOver90: number;
      totalsTotal: number;
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    const authResult = await CompanyAuthRepository.requireMember(
      user.id,
      data.companyId,
      null,
      logger,
      locale,
    );
    if (!authResult.success) {
      return authResult;
    }

    try {
      const asOfDate = data.asOfDate ? new Date(data.asOfDate) : new Date();
      const asOfDateStr = asOfDate.toISOString().slice(0, 10);

      // Set to end of day for inclusive comparison
      const asOfMidnight = new Date(asOfDate);
      asOfMidnight.setHours(23, 59, 59, 999);

      const invoices = await db
        .select({
          id: paymentInvoices.id,
          userId: paymentInvoices.userId,
          amount: paymentInvoices.amount,
          dueDate: paymentInvoices.dueDate,
          status: paymentInvoices.status,
        })
        .from(paymentInvoices)
        .where(ne(paymentInvoices.status, InvoiceStatus.PAID));

      const bucketsCurrentItems: InvoiceItem[] = [];
      const bucketsDays1to30Items: InvoiceItem[] = [];
      const bucketsDays31to60Items: InvoiceItem[] = [];
      const bucketsDays61to90Items: InvoiceItem[] = [];
      const bucketsOver90Items: InvoiceItem[] = [];

      for (const inv of invoices) {
        const amount = Number(inv.amount);
        const dueDate = inv.dueDate;

        const item: InvoiceItem = {
          invoiceId: inv.id,
          customerId: inv.userId,
          amount,
          dueDate: dueDate ? dueDate.toISOString().slice(0, 10) : asOfDateStr,
        };

        if (!dueDate || dueDate > asOfMidnight) {
          // Not yet due
          bucketsCurrentItems.push(item);
        } else {
          const daysOverdue = Math.floor(
            (asOfMidnight.getTime() - dueDate.getTime()) / MS_PER_DAY,
          );

          if (daysOverdue <= 30) {
            bucketsDays1to30Items.push(item);
          } else if (daysOverdue <= 60) {
            bucketsDays31to60Items.push(item);
          } else if (daysOverdue <= 90) {
            bucketsDays61to90Items.push(item);
          } else {
            bucketsOver90Items.push(item);
          }
        }
      }

      const totalsCurrent = sumBucket(bucketsCurrentItems);
      const totalsDays1to30 = sumBucket(bucketsDays1to30Items);
      const totalsDays31to60 = sumBucket(bucketsDays31to60Items);
      const totalsDays61to90 = sumBucket(bucketsDays61to90Items);
      const totalsOver90 = sumBucket(bucketsOver90Items);
      const totalsTotal =
        totalsCurrent +
        totalsDays1to30 +
        totalsDays31to60 +
        totalsDays61to90 +
        totalsOver90;

      return success({
        asOfDateResponse: asOfDateStr,
        bucketsCurrentItems,
        bucketsDays1to30Items,
        bucketsDays31to60Items,
        bucketsDays61to90Items,
        bucketsOver90Items,
        totalsCurrent,
        totalsDays1to30,
        totalsDays31to60,
        totalsDays61to90,
        totalsOver90,
        totalsTotal,
      });
    } catch (error) {
      logger.error("Error computing receivables aging", parseError(error));
      return fail({
        message: t("receivablesAging.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
