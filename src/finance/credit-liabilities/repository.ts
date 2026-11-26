import "server-only";

import { sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountType,
  ledgerEntryStatuses,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  accountingDay,
  nextAccountingDay,
} from "@/chart-of-accounts/shared/journal-validation";
import { companies, companyMembers } from "@/companies/db";
import { getDocumentAccess } from "@/finance/document-company-scope";
import {
  paymentAccountingOffers,
  paymentAccountingPostings,
  paymentAccountingRecognitions,
} from "@/payment/accounting/db";
import { paymentTransactions } from "@/payment/db";
import { CheckoutMode } from "@/payment/enum";

import type { CreditLiabilityInput, CreditLiabilityOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class CreditLiabilityRepository {
  static async get(
    { companyId }: CreditLiabilityInput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditLiabilityOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const today = accountingDay(new Date());
    const asOfDate = today.toISOString().slice(0, 10);
    try {
      if (!companyId) {
        return success({
          reportCompanyId: null,
          companyName: null,
          asOfDate,
          balances: [],
        });
      }
      const access = await getDocumentAccess(userId, { companyId });
      if (!access) {
        return fail({
          message: t("errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const cutoff = nextAccountingDay(today);
      const statuses = sql.join(
        ledgerEntryStatuses.map((status) => sql`${status}`),
        sql`, `,
      );
      const { rows } = await db.execute<
        CreditLiabilityOutput["balances"][number]
      >(sql`
        WITH sale AS (
          SELECT
            ${paymentAccountingPostings.id} AS id,
            ${paymentAccountingPostings.transactionId} AS transaction_id,
            ${paymentAccountingPostings.mappingId} AS mapping_id,
            ${paymentAccountingPostings.journalEntryId} AS entry_id,
            ${paymentAccountingPostings.currency} AS currency,
            ${paymentAccountingOffers.considerationAccountId} AS account_id
          FROM ${paymentAccountingPostings}
          JOIN ${paymentAccountingOffers}
            ON ${paymentAccountingOffers.id} = ${paymentAccountingPostings.mappingId}
            AND ${paymentAccountingOffers.companyId} = ${paymentAccountingPostings.companyId}
            AND ${paymentAccountingOffers.currency} = ${paymentAccountingPostings.currency}
          JOIN ${paymentTransactions}
            ON ${paymentTransactions.id} = ${paymentAccountingPostings.transactionId}
            AND ${paymentTransactions.currency} = ${paymentAccountingPostings.currency}
            AND ${paymentTransactions.provider} = ${paymentAccountingPostings.provider}
          JOIN ${journalEntries}
            ON ${journalEntries.id} = ${paymentAccountingPostings.journalEntryId}
            AND ${journalEntries.companyId} = ${paymentAccountingPostings.companyId}
          WHERE ${paymentAccountingPostings.companyId} = ${companyId}
            AND ${paymentAccountingPostings.sourceKind} = 'sale'
            AND ${paymentAccountingOffers.recognition} = 'deferred'
            AND ${paymentTransactions.mode} = ${CheckoutMode.PAYMENT}
            AND ${paymentTransactions.metadata}->>'type' = 'credit_pack'
            AND EXISTS (
              SELECT 1 FROM ${companies}
              JOIN ${companyMembers} ON ${companyMembers.companyId} = ${companies.id}
              WHERE ${companies.id} = ${companyId}
                AND ${companies.isActive} AND ${companyMembers.isActive}
                AND ${companyMembers.userId} = ${userId}
            )
            AND ${journalEntries.status} IN (${statuses})
            AND ${journalEntries.date} < ${cutoff.toISOString()}
        ), candidate AS (
          SELECT entry_id, currency, account_id FROM sale
          UNION
          SELECT refund.journal_entry_id, sale.currency, sale.account_id
          FROM sale
          JOIN ${paymentAccountingPostings} AS refund
            ON refund.transaction_id = sale.transaction_id AND refund.mapping_id = sale.mapping_id
            AND refund.currency = sale.currency AND refund.company_id = ${companyId}
            AND refund.source_kind = 'refund'
          UNION
          SELECT ${paymentAccountingRecognitions.journalEntryId}, sale.currency, sale.account_id
          FROM sale
          JOIN ${paymentAccountingRecognitions}
            ON ${paymentAccountingRecognitions.postingId} = sale.id
        ), posted AS (
          SELECT candidate.entry_id, candidate.currency, candidate.account_id
          FROM candidate
          JOIN ${journalEntries} ON ${journalEntries.id} = candidate.entry_id
          WHERE ${journalEntries.companyId} = ${companyId}
            AND ${journalEntries.status} IN (${statuses})
            AND ${journalEntries.date} < ${cutoff.toISOString()}
        ), movement AS (
          SELECT entry_id, currency, account_id FROM posted
          UNION
          SELECT reversal.id, posted.currency, posted.account_id
          FROM posted
          JOIN ${journalEntries} AS reversal ON reversal.reversal_of_id = posted.entry_id
          WHERE reversal.company_id = ${companyId}
            AND reversal.status IN (${statuses})
            AND reversal.date < ${cutoff.toISOString()}
        )
        SELECT
          ${accountNodes.id} AS "accountId",
          ${accountNodes.code} AS "accountCode",
          ${accountNodes.name} AS "accountName",
          movement.currency,
          SUM(CASE WHEN ${journalEntryLines.type} = ${LineType.CREDIT}
            THEN ${journalEntryLines.amount} ELSE -${journalEntryLines.amount} END)::text AS amount
        FROM movement
        JOIN ${journalEntryLines}
          ON ${journalEntryLines.journalEntryId} = movement.entry_id
          AND ${journalEntryLines.accountId} = movement.account_id
          AND ${journalEntryLines.currency} = movement.currency
        JOIN ${accountNodes} ON ${accountNodes.id} = movement.account_id
        WHERE ${accountNodes.companyId} = ${companyId}
          AND ${accountNodes.type} = ${AccountType.LIABILITY}
        GROUP BY ${accountNodes.id}, ${accountNodes.code}, ${accountNodes.name}, movement.currency
        ORDER BY movement.currency, ${accountNodes.code}, ${accountNodes.id}
      `);
      return success({
        reportCompanyId: companyId,
        companyName: access.companyName,
        asOfDate,
        balances: rows,
      });
    } catch {
      logger.error("Credit liability report could not load");
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
