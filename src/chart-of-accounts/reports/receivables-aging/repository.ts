import "server-only";

import { and, eq, gt, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { getDocumentCompanies } from "@/finance/document-company-scope";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

import { scopedTranslation } from "../../i18n";
import type {
  ReceivablesAgingRequestOutput,
  ReceivablesAgingResponseOutput,
} from "./definition";

export class ReceivablesAgingRepository {
  private static emptyBucket(): {
    items: NonNullable<ReceivablesAgingResponseOutput["bucketsCurrentItems"]>;
    cents: number;
  } {
    return { items: [], cents: 0 };
  }

  static async getReceivablesAging(
    data: ReceivablesAgingRequestOutput,
    logger: EndpointLogger,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReceivablesAgingResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const allowed = await getDocumentCompanies(user.id, data.companyId);
      const company = allowed.length === 1 ? allowed[0] : undefined;
      const asOfDate = new Date(
        data.asOfDate ?? new Date().toISOString().slice(0, 10),
      );
      if (!company && !data.companyId) {
        return success({
          reportCompanyId: null,
          reportCompanyName: null,
          reportCurrency: null,
          asOfDateResponse: asOfDate,
          bucketsCurrentItems: [],
          bucketsDays1to30Items: [],
          bucketsDays31to60Items: [],
          bucketsDays61to90Items: [],
          bucketsOver90Items: [],
          totalsCurrent: 0,
          totalsDays1to30: 0,
          totalsDays31to60: 0,
          totalsDays61to90: 0,
          totalsOver90: 0,
          totalsTotal: 0,
        });
      }
      if (!company) {
        return fail({
          message: t("receivablesAging.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const currency = data.currency ?? company.currency;
      if (!currency) {
        return fail({
          message: t("receivablesAging.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const { payments, credits, paymentJoin, creditJoin, openAmount } =
        getInvoiceOpenBalanceParts(db, company.id, currency);

      const customerId = sql<
        string | null
      >`case when jsonb_typeof(${paymentInvoices.metadata}->'customerId') = 'string' then ${paymentInvoices.metadata}->>'customerId' end`;
      const invoices = await db
        .select({
          invoiceId: paymentInvoices.id,
          invoiceNumber: sql<
            string | null
          >`coalesce(${paymentInvoices.invoiceNumber}, 'INV-' || ${paymentInvoices.invoiceSequenceNumber})`,
          customerId,
          customerName: sql<
            string | null
          >`coalesce(nullif(${users.publicName},''),case when jsonb_typeof(${paymentInvoices.metadata}->'customerName')='string' then nullif(trim(${paymentInvoices.metadata}->>'customerName'),'') end)`,
          dueDate: paymentInvoices.dueDate,
          // Open balances stay in SQL decimal arithmetic until rounded to invoice storage precision.
          cents: sql<number>`${openAmount} * 100`.mapWith(Number),
        })
        .from(paymentInvoices)
        .leftJoin(users, sql`${users.id}::text = ${customerId}`)
        .leftJoin(payments, paymentJoin)
        .leftJoin(credits, creditJoin)
        .where(
          and(
            eq(paymentInvoices.companyId, company.id),
            eq(paymentInvoices.status, InvoiceStatus.OPEN),
            gt(paymentInvoices.amount, "0"),
            sql`${paymentInvoices.currency} = ${currency}`,
          ),
        )
        .orderBy(paymentInvoices.dueDate, paymentInvoices.id);

      const current = ReceivablesAgingRepository.emptyBucket(),
        first = ReceivablesAgingRepository.emptyBucket(),
        second = ReceivablesAgingRepository.emptyBucket(),
        third = ReceivablesAgingRepository.emptyBucket(),
        oldest = ReceivablesAgingRepository.emptyBucket();
      for (const { cents, ...invoice } of invoices) {
        if (cents <= 0) {
          continue;
        }
        const days = invoice.dueDate
          ? (asOfDate.getTime() -
              Date.parse(invoice.dueDate.toISOString().slice(0, 10))) /
            86_400_000
          : 0;
        const group =
          days <= 0
            ? current
            : days <= 30
              ? first
              : days <= 60
                ? second
                : days <= 90
                  ? third
                  : oldest;
        group.items.push({ ...invoice, amount: cents / 100 });
        group.cents += cents;
      }

      return success({
        asOfDateResponse: asOfDate,
        reportCompanyId: company.id,
        reportCompanyName: company.name,
        reportCurrency: currency,
        bucketsCurrentItems: current.items,
        bucketsDays1to30Items: first.items,
        bucketsDays31to60Items: second.items,
        bucketsDays61to90Items: third.items,
        bucketsOver90Items: oldest.items,
        totalsCurrent: current.cents / 100,
        totalsDays1to30: first.cents / 100,
        totalsDays31to60: second.cents / 100,
        totalsDays61to90: third.cents / 100,
        totalsOver90: oldest.cents / 100,
        totalsTotal:
          (current.cents +
            first.cents +
            second.cents +
            third.cents +
            oldest.cents) /
          100,
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
