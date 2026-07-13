/**
 * POS Order Complete Repository
 * Completes an order: validates full payment, posts journal entry, updates status
 */

import { and, eq, or, sum } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
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
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import type { LineTypeDB } from "@/chart-of-accounts/enum";
import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { posOrders, posPayments, posSessions, posTerminals } from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import type { PosOrderCompletePostRequestOutput } from "./definition";

export class PosOrderCompleteRepository {
  static async completeOrder(
    data: PosOrderCompletePostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
        total: number;
        journalEntryId: string | null;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { orderId } = data;

      // Load order with session and terminal context
      const [order] = await db
        .select({
          id: posOrders.id,
          status: posOrders.status,
          total: posOrders.total,
          subtotal: posOrders.subtotal,
          taxAmount: posOrders.taxAmount,
          currency: posOrders.currency,
          sessionId: posOrders.sessionId,
        })
        .from(posOrders)
        .where(eq(posOrders.id, orderId))
        .limit(1);

      if (!order) {
        return fail({
          message: t("orderComplete.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (order.status !== PosOrderStatus.OPEN) {
        return fail({
          message: t("orderComplete.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Verify user is a member of the order's company via session → terminal chain
      {
        const [authSession] = await db
          .select({ terminalId: posSessions.terminalId })
          .from(posSessions)
          .where(eq(posSessions.id, order.sessionId))
          .limit(1);

        if (authSession) {
          const [authTerminal] = await db
            .select({ companyId: posTerminals.companyId })
            .from(posTerminals)
            .where(eq(posTerminals.id, authSession.terminalId))
            .limit(1);

          if (authTerminal) {
            const authResult = await CompanyAuthRepository.requireMember(
              userId,
              authTerminal.companyId,
              CompanyMemberRole.MEMBER,
              logger,
              locale,
            );
            if (!authResult.success) {
              return authResult;
            }
          }
        }
      }

      // Sum payments
      const [paidTotals] = await db
        .select({ totalPaid: sum(posPayments.amount) })
        .from(posPayments)
        .where(eq(posPayments.orderId, orderId));

      const totalPaid = Number(paidTotals?.totalPaid ?? 0);

      // Round to 4 decimal places to avoid floating-point false negatives
      const roundedTotal = Math.round(order.total * 10000) / 10000;
      const roundedPaid = Math.round(totalPaid * 10000) / 10000;

      if (roundedPaid < roundedTotal) {
        return fail({
          message: t("orderComplete.post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Attempt journal posting — best effort, skip if data is missing
      let journalEntryId: string | null = null;

      try {
        // Get session → terminal → companyId
        const [session] = await db
          .select({ terminalId: posSessions.terminalId })
          .from(posSessions)
          .where(eq(posSessions.id, order.sessionId))
          .limit(1);

        if (session) {
          const [terminal] = await db
            .select({
              companyId: posTerminals.companyId,
              cashAccountNodeId: posTerminals.cashAccountNodeId,
            })
            .from(posTerminals)
            .where(eq(posTerminals.id, session.terminalId))
            .limit(1);

          if (terminal) {
            const companyId = terminal.companyId;

            // Find open accounting period for this company
            const [period] = await db
              .select({ id: accountingPeriods.id })
              .from(accountingPeriods)
              .where(
                and(
                  eq(accountingPeriods.companyId, companyId),
                  eq(accountingPeriods.status, PeriodStatus.OPEN),
                ),
              )
              .orderBy(accountingPeriods.startDate)
              .limit(1);

            if (period) {
              // Find revenue account node
              const revenueNodes = await db
                .select({ id: accountNodes.id, subtype: accountNodes.subtype })
                .from(accountNodes)
                .where(
                  and(
                    eq(accountNodes.companyId, companyId),
                    eq(accountNodes.isActive, true),
                    eq(accountNodes.isPostable, true),
                    or(
                      eq(accountNodes.subtype, AccountSubtype.REVENUE_SALES),
                      eq(accountNodes.subtype, AccountSubtype.REVENUE_SERVICE),
                    ),
                  ),
                )
                .limit(1);

              // Find VAT payable account node
              const vatNodes = await db
                .select({ id: accountNodes.id })
                .from(accountNodes)
                .where(
                  and(
                    eq(accountNodes.companyId, companyId),
                    eq(accountNodes.isActive, true),
                    eq(accountNodes.isPostable, true),
                    eq(accountNodes.subtype, AccountSubtype.VAT_PAYABLE),
                  ),
                )
                .limit(1);

              const revenueNode = revenueNodes[0];
              const vatNode = vatNodes[0];

              if (revenueNode) {
                // Build journal entry lines
                const payments = await db
                  .select({
                    method: posPayments.method,
                    amount: posPayments.amount,
                    accountNodeId: posPayments.accountNodeId,
                  })
                  .from(posPayments)
                  .where(eq(posPayments.orderId, orderId));

                // Generate entry number
                const now = new Date();
                const entryNumber = `POS-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${now.getTime().toString().slice(-8)}`;

                const [entry] = await db
                  .insert(journalEntries)
                  .values({
                    companyId,
                    periodId: period.id,
                    entryNumber,
                    date: now,
                    description: `POS Order ${orderId}`,
                    status: JournalEntryStatus.POSTED,
                    sourceType: JournalSourceType.POS_ORDER,
                    sourceId: orderId,
                    postedAt: now,
                  })
                  .returning({ id: journalEntries.id });

                if (entry) {
                  const lines: {
                    journalEntryId: string;
                    accountId: string;
                    type: (typeof LineTypeDB)[number];
                    amount: number;
                    currency: string;
                    description: string;
                    sortOrder: number;
                  }[] = [];

                  let sortOrder = 0;

                  // Debit lines: one per payment (cash/card account)
                  for (const payment of payments) {
                    const debitAccountId =
                      payment.accountNodeId ?? terminal.cashAccountNodeId;

                    if (debitAccountId) {
                      lines.push({
                        journalEntryId: entry.id,
                        accountId: debitAccountId,
                        type: LineType.DEBIT,
                        amount: payment.amount,
                        currency: order.currency,
                        description: `POS payment (${payment.method})`,
                        sortOrder: sortOrder++,
                      });
                    }
                  }

                  // Credit revenue and VAT payable — must always balance debits
                  if (order.taxAmount > 0 && vatNode) {
                    // Separate lines: net revenue + VAT payable
                    lines.push({
                      journalEntryId: entry.id,
                      accountId: revenueNode.id,
                      type: LineType.CREDIT,
                      amount: order.subtotal,
                      currency: order.currency,
                      description: "POS revenue",
                      sortOrder: sortOrder++,
                    });
                    lines.push({
                      journalEntryId: entry.id,
                      accountId: vatNode.id,
                      type: LineType.CREDIT,
                      amount: order.taxAmount,
                      currency: order.currency,
                      description: "POS VAT payable",
                      sortOrder: sortOrder++,
                    });
                  } else {
                    // No VAT account available — credit full order total to revenue
                    // to keep the entry balanced (subtotal + taxAmount = total)
                    if (order.taxAmount > 0) {
                      logger.warn(
                        "POS order complete: no VAT_PAYABLE account found, folding tax into revenue credit to maintain balance",
                        { companyId, taxAmount: order.taxAmount },
                      );
                    }
                    lines.push({
                      journalEntryId: entry.id,
                      accountId: revenueNode.id,
                      type: LineType.CREDIT,
                      amount: order.subtotal + order.taxAmount,
                      currency: order.currency,
                      description: "POS revenue",
                      sortOrder: sortOrder++,
                    });
                  }

                  // Validate balance before posting: total debits must equal total credits
                  const totalDebits = lines
                    .filter((l) => l.type === LineType.DEBIT)
                    .reduce((acc, l) => acc + l.amount, 0);
                  const totalCredits = lines
                    .filter((l) => l.type === LineType.CREDIT)
                    .reduce((acc, l) => acc + l.amount, 0);
                  const isBalanced =
                    Math.abs(totalDebits - totalCredits) < 0.0001;

                  if (lines.length > 0 && totalDebits > 0 && isBalanced) {
                    await db.insert(journalEntryLines).values(lines);
                    journalEntryId = entry.id;
                  } else if (!isBalanced || totalDebits === 0) {
                    logger.warn(
                      "POS order complete: journal entry would be unbalanced or has no debit lines, skipping posting",
                      { companyId, totalDebits, totalCredits },
                    );
                    // Delete the empty journal entry header we already created
                    await db
                      .delete(journalEntries)
                      .where(eq(journalEntries.id, entry.id));
                  }
                }
              } else {
                logger.warn(
                  "POS order complete: no revenue account node found for company, skipping journal posting",
                  { companyId },
                );
              }
            } else {
              logger.warn(
                "POS order complete: no open accounting period found for company, skipping journal posting",
                { companyId },
              );
            }
          }
        }
      } catch (journalError) {
        // Journal posting failure must not block order completion
        logger.warn(
          "POS order complete: journal posting failed, order will still be completed",
          parseError(journalError),
        );
      }

      // Mark order as completed
      const [updated] = await db
        .update(posOrders)
        .set({
          status: PosOrderStatus.COMPLETED,
          journalEntryId,
          updatedAt: new Date(),
        })
        .where(eq(posOrders.id, orderId))
        .returning({
          id: posOrders.id,
          status: posOrders.status,
          total: posOrders.total,
          journalEntryId: posOrders.journalEntryId,
        });

      if (!updated) {
        logger.error("Failed to update POS order status to COMPLETED");
        return fail({
          message: t("orderComplete.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({ result: updated });
    } catch (error) {
      logger.error("Error completing POS order", parseError(error));
      return fail({
        message: t("orderComplete.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
