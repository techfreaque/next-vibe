/**
 * POS Order Refund Repository
 * Refunds a completed sale: refund document, reversing journal, stock back,
 * cash out of an open drawer.
 */

import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
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
import {
  type AutoPostLine,
  postJournalEntry,
} from "@/chart-of-accounts/shared/auto-post";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { stockMovements } from "@/inventory/db";
import { applyStockMovement } from "@/inventory/stock/shared-helpers";

import {
  posOrderItems,
  posOrders,
  posRefundLines,
  posRefunds,
  posSessions,
  posTerminals,
} from "../../../db";
import {
  PosOrderStatus,
  PosPaymentMethod,
  PosSessionStatus,
} from "../../../enum";
import { getPosSessionCash } from "../../../session/cash-totals";
import { isPosMinorUnitAmount } from "../../settlement-amounts";
import {
  buildPosCogsLines,
  hasCogsAndInventoryAccounts,
  roundCogsAmount,
} from "../../stock";
import { planPosRefund, type PosRefundSourceLine } from "./amounts";
import type {
  PosOrderRefundPostRequestOutput,
  PosOrderRefundPostResponseOutput,
  PosOrderRefundsGetResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type PosTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type PosReader = typeof db | PosTransaction;

/** Stock movements written by refunds carry this source type. */
export const POS_REFUND_STOCK_SOURCE = "POS_REFUND";
const POS_ORDER_STOCK_SOURCE = "POS_ORDER";

interface CashDrawer {
  sessionId: string;
  terminalName: string;
  terminalCurrency: string;
  cashAccountId: string | null;
  openingFloat: number;
}

export class PosOrderRefundRepository {
  /** Company of the order, or undefined when it does not exist. */
  private static async orderCompany(
    orderId: string,
  ): Promise<string | undefined> {
    const [owner] = await db
      .select({ companyId: posTerminals.companyId })
      .from(posOrders)
      .innerJoin(posSessions, eq(posSessions.id, posOrders.sessionId))
      .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
      .where(eq(posOrders.id, orderId));
    return owner?.companyId;
  }

  private static async sourceLines(
    reader: PosReader,
    orderId: string,
  ): Promise<
    (PosRefundSourceLine & {
      productId: string | null;
      description: string;
      unitPrice: number;
      taxRate: number;
    })[]
  > {
    const items = await reader
      .select({
        orderItemId: posOrderItems.id,
        productId: posOrderItems.productId,
        description: posOrderItems.description,
        quantity: posOrderItems.quantity,
        unitPrice: posOrderItems.unitPrice,
        taxRate: posOrderItems.taxRate,
        lineTotal: posOrderItems.lineTotal,
        taxAmount: posOrderItems.taxAmount,
      })
      .from(posOrderItems)
      .where(eq(posOrderItems.orderId, orderId))
      .orderBy(asc(posOrderItems.sortOrder), asc(posOrderItems.id));
    const refunded = await reader
      .select({
        orderItemId: posRefundLines.orderItemId,
        quantity: sql<string>`sum(${posRefundLines.quantity})`,
        lineTotal: sql<string>`sum(${posRefundLines.lineTotal})`,
        taxAmount: sql<string>`sum(${posRefundLines.taxAmount})`,
      })
      .from(posRefundLines)
      .innerJoin(posRefunds, eq(posRefunds.id, posRefundLines.refundId))
      .where(eq(posRefunds.orderId, orderId))
      .groupBy(posRefundLines.orderItemId);
    return items.map((item) => {
      const done = refunded.find((row) => row.orderItemId === item.orderItemId);
      return {
        ...item,
        refundedQuantity: Number(done?.quantity ?? 0),
        refundedLineTotal: Number(done?.lineTotal ?? 0),
        refundedTaxAmount: Number(done?.taxAmount ?? 0),
      };
    });
  }

  private static async priorRefunds(
    reader: PosReader,
    orderId: string,
  ): Promise<{
    subtotal: number;
    taxAmount: number;
    total: number;
    count: number;
  }> {
    const [row] = await reader
      .select({
        subtotal: sql<string>`coalesce(sum(${posRefunds.subtotal}), 0)`,
        taxAmount: sql<string>`coalesce(sum(${posRefunds.taxAmount}), 0)`,
        total: sql<string>`coalesce(sum(${posRefunds.total}), 0)`,
        count: sql<number>`count(*)::int`,
      })
      .from(posRefunds)
      .where(eq(posRefunds.orderId, orderId));
    return {
      subtotal: Number(row?.subtotal ?? 0),
      taxAmount: Number(row?.taxAmount ?? 0),
      total: Number(row?.total ?? 0),
      count: row?.count ?? 0,
    };
  }

  /**
   * The drawer a cash refund comes out of: the requested session, else the
   * sale's own session when it is still open, else the cashier's newest open
   * session on a till in the sale currency.
   */
  private static async findDrawer(
    reader: PosReader,
    opts: {
      companyId: string;
      currency: string;
      userId: string;
      orderSessionId: string;
      sessionId: string | undefined;
    },
  ): Promise<CashDrawer | undefined> {
    const [drawer] = await reader
      .select({
        sessionId: posSessions.id,
        terminalName: posTerminals.name,
        terminalCurrency: posTerminals.currency,
        cashAccountId: posTerminals.cashAccountNodeId,
        openingFloat: posSessions.openingFloat,
      })
      .from(posSessions)
      .innerJoin(posTerminals, eq(posTerminals.id, posSessions.terminalId))
      .where(
        and(
          eq(posTerminals.companyId, opts.companyId),
          eq(posSessions.status, PosSessionStatus.OPEN),
          opts.sessionId
            ? eq(posSessions.id, opts.sessionId)
            : and(
                eq(posTerminals.currency, opts.currency),
                sql`(${posSessions.id} = ${opts.orderSessionId} or ${posSessions.cashierUserId} = ${opts.userId})`,
              ),
        ),
      )
      .orderBy(
        desc(sql`${posSessions.id} = ${opts.orderSessionId}`),
        desc(posSessions.openedAt),
      )
      .limit(1);
    return drawer;
  }

  static async getRefunds(
    orderId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosOrderRefundsGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const companyId = await PosOrderRefundRepository.orderCompany(orderId);
      if (!companyId) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const access = await CompanyAuthRepository.requireMember(
        userId,
        companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!access.success) {
        return access;
      }
      const [order] = await db
        .select()
        .from(posOrders)
        .where(eq(posOrders.id, orderId));
      if (!order) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const lines = await PosOrderRefundRepository.sourceLines(db, orderId);
      const prior = await PosOrderRefundRepository.priorRefunds(db, orderId);
      const refunds = await db
        .select({
          refundId: posRefunds.id,
          refundNumber: posRefunds.refundNumber,
          method: posRefunds.method,
          total: posRefunds.total,
          reason: posRefunds.reason,
          createdAt: posRefunds.createdAt,
        })
        .from(posRefunds)
        .where(eq(posRefunds.orderId, orderId))
        .orderBy(desc(posRefunds.createdAt), desc(posRefunds.id));
      const completed = order.status === PosOrderStatus.COMPLETED;
      const plan = completed
        ? planPosRefund(lines, undefined, order, prior)
        : undefined;
      const drawer = completed
        ? await PosOrderRefundRepository.findDrawer(db, {
            companyId,
            currency: order.currency,
            userId,
            orderSessionId: order.sessionId,
            sessionId: undefined,
          })
        : undefined;
      const cash = drawer
        ? await getPosSessionCash(db, drawer.sessionId, drawer.openingFloat)
        : undefined;

      return success({
        result: {
          orderId,
          orderNumber: order.orderNumber,
          status: order.status,
          currency: order.currency,
          total: order.total,
          refundedTotal: prior.total,
          refundableTotal: plan?.ok ? plan.total : 0,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount,
          refundedSubtotal: prior.subtotal,
          refundedTaxAmount: prior.taxAmount,
          journalPosted: order.journalEntryId !== null,
          cashSession:
            drawer && cash
              ? {
                  sessionId: drawer.sessionId,
                  terminalName: drawer.terminalName,
                  available: cash.expectedCash,
                }
              : null,
          lines: lines.map((line) => ({
            orderItemId: line.orderItemId,
            description: line.description,
            quantity: line.quantity,
            refundedQuantity: line.refundedQuantity,
            refundableQuantity:
              Math.max(
                0,
                Math.round(line.quantity * 10_000) -
                  Math.round(line.refundedQuantity * 10_000),
              ) / 10_000,
            unitPrice: line.unitPrice,
            lineTotal: line.lineTotal,
            taxRate: line.taxRate,
            taxAmount: line.taxAmount,
            refundedLineTotal: line.refundedLineTotal,
            refundedTaxAmount: line.refundedTaxAmount,
          })),
          refunds,
        },
      });
    } catch (error) {
      logger.error("Error loading POS refunds", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async refundOrder(
    data: PosOrderRefundPostRequestOutput,
    orderId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<PosOrderRefundPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const conflict = (message: Parameters<typeof t>[0]): ErrorResponseType =>
      fail({ message: t(message), errorType: ErrorResponseTypes.CONFLICT });
    // Failures after the journal or stock writes roll the transaction back.
    let rolledBack: ErrorResponseType | undefined;

    try {
      const companyId = await PosOrderRefundRepository.orderCompany(orderId);
      if (!companyId) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const access = await CompanyAuthRepository.requireMember(
        userId,
        companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!access.success) {
        return access;
      }

      return await db.transaction(async (tx) => {
        const [order] = await tx
          .select()
          .from(posOrders)
          .where(eq(posOrders.id, orderId))
          .for("update");
        if (!order || order.status !== PosOrderStatus.COMPLETED) {
          return conflict("messages.notCompleted");
        }

        const lines = await PosOrderRefundRepository.sourceLines(tx, orderId);
        const prior = await PosOrderRefundRepository.priorRefunds(tx, orderId);
        const plan = planPosRefund(lines, data.lines, order, prior);
        if (!plan.ok) {
          return plan.reason === "invalidLine"
            ? fail({
                message: t("messages.invalidLine"),
                errorType: ErrorResponseTypes.VALIDATION_ERROR,
              })
            : conflict(`messages.${plan.reason}`);
        }

        const cash = data.method === PosPaymentMethod.CASH;
        let drawer: CashDrawer | undefined;
        if (cash || data.sessionId) {
          drawer = await PosOrderRefundRepository.findDrawer(tx, {
            companyId,
            currency: order.currency,
            userId,
            orderSessionId: order.sessionId,
            sessionId: data.sessionId,
          });
          if (!drawer) {
            return conflict(
              data.sessionId
                ? "messages.sessionInvalid"
                : "messages.cashSessionRequired",
            );
          }
        }
        if (cash && drawer) {
          if (drawer.terminalCurrency !== order.currency) {
            return conflict("messages.cashCurrencyMismatch");
          }
          // Serialize with session close and other cash refunds of this drawer.
          const [locked] = await tx
            .select({ status: posSessions.status })
            .from(posSessions)
            .where(eq(posSessions.id, drawer.sessionId))
            .for("update");
          if (locked?.status !== PosSessionStatus.OPEN) {
            return conflict("messages.cashSessionRequired");
          }
          const inDrawer = await getPosSessionCash(
            tx,
            drawer.sessionId,
            drawer.openingFloat,
          );
          if (
            Math.round(inDrawer.expectedCash * 100) <
            Math.round(plan.total * 100)
          ) {
            return conflict("messages.drawerShort");
          }
        }

        const refundId = crypto.randomUUID();
        const refundNumber = `${order.orderNumber}-R${prior.count + 1}`;

        // Put back what the sale took out of stock, never more.
        const stockReturnResult = await PosOrderRefundRepository.returnStock(
          tx,
          {
            orderId,
            companyId,
            refundId,
            refundNumber,
            userId,
            logger,
            lines: plan.lines.map((line) => ({
              quantity: line.quantity,
              productId:
                lines.find((item) => item.orderItemId === line.orderItemId)
                  ?.productId ?? null,
            })),
            insufficientStockError: t("messages.stockUnavailable"),
          },
        );
        if (stockReturnResult === undefined) {
          rolledBack = conflict("messages.stockUnavailable");
          return tx.rollback();
        }
        const stockReturned = stockReturnResult.moved;

        // Reverse the sale in the books when the sale itself was posted.
        let journalEntryId: string | null = null;
        if (order.journalEntryId) {
          const amounts = [plan.subtotal, plan.taxAmount, plan.total];
          if (!amounts.every(isPosMinorUnitAmount)) {
            rolledBack = conflict("messages.rounding");
            return tx.rollback();
          }
          const journalLines: AutoPostLine[] = [];
          if (plan.subtotal > 0) {
            journalLines.push({
              type: LineType.DEBIT,
              subtype: AccountSubtype.REVENUE_SALES,
              fallbackSubtype: AccountSubtype.REVENUE_SERVICE,
              amount: plan.subtotal,
              currency: order.currency,
            });
          }
          if (plan.taxAmount > 0) {
            journalLines.push({
              type: LineType.DEBIT,
              subtype: AccountSubtype.VAT_PAYABLE,
              amount: plan.taxAmount,
              currency: order.currency,
            });
          }
          journalLines.push({
            type: LineType.CREDIT,
            subtype: cash ? AccountSubtype.CASH : AccountSubtype.BANK,
            accountNodeId: (cash ? drawer?.cashAccountId : null) ?? undefined,
            amount: plan.total,
            currency: order.currency,
          });
          if (
            stockReturnResult.totalCogsReversed > 0 &&
            (await hasCogsAndInventoryAccounts(tx, companyId))
          ) {
            journalLines.push(
              ...buildPosCogsLines({
                totalCogs: stockReturnResult.totalCogsReversed,
                currency: order.currency,
                description: `${refundNumber} COGS reversal`,
                reverse: true,
              }),
            );
          }
          journalEntryId = await postJournalEntry(
            {
              companyId,
              date: new Date(),
              description: refundNumber,
              sourceId: orderId,
              sourceType: JournalSourceType.POS_ORDER,
              postedByUserId: userId,
              lines: journalLines,
              logger,
            },
            tx,
          );
          if (!journalEntryId) {
            rolledBack = conflict("messages.postingUnavailable");
            return tx.rollback();
          }
        }

        await tx.insert(posRefunds).values({
          id: refundId,
          orderId,
          sessionId: drawer?.sessionId ?? null,
          refundNumber,
          method: data.method,
          currency: order.currency,
          subtotal: plan.subtotal,
          taxAmount: plan.taxAmount,
          total: plan.total,
          reason: data.reason,
          journalEntryId,
          createdByUserId: userId,
        });
        await tx.insert(posRefundLines).values(
          plan.lines.map((line) => ({
            refundId,
            orderItemId: line.orderItemId,
            quantity: line.quantity,
            lineTotal: line.lineTotal,
            taxAmount: line.taxAmount,
          })),
        );

        return success({
          result: {
            refundId,
            refundNumber,
            orderId,
            sessionId: drawer?.sessionId ?? null,
            method: data.method,
            currency: order.currency,
            subtotal: plan.subtotal,
            taxAmount: plan.taxAmount,
            total: plan.total,
            refundedTotal: plan.refundedTotal,
            fullyRefunded: plan.fullyRefunded,
            journalEntryId,
            stockReturned,
          },
        });
      });
    } catch (error) {
      if (rolledBack) {
        return rolledBack;
      }
      logger.error("Error refunding POS order", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Return refunded units of products this sale issued from stock. Returns the
   * number of products moved, or undefined when a movement failed.
   */
  private static async returnStock(
    tx: PosTransaction,
    opts: {
      orderId: string;
      companyId: string;
      refundId: string;
      refundNumber: string;
      userId: string;
      logger: EndpointLogger;
      lines: { productId: string | null; quantity: number }[];
      insufficientStockError: TranslatedKeyType;
    },
  ): Promise<{ moved: number; totalCogsReversed: number } | undefined> {
    const wanted = new Map<string, number>();
    for (const line of opts.lines) {
      if (line.productId) {
        wanted.set(
          line.productId,
          (wanted.get(line.productId) ?? 0) +
            Math.round(line.quantity * 10_000),
        );
      }
    }
    if (wanted.size === 0) {
      return { moved: 0, totalCogsReversed: 0 };
    }
    const productIds = [...wanted.keys()];
    const issued = await tx
      .select({
        productId: stockMovements.productId,
        warehouseId: stockMovements.warehouseId,
        quantity: sql<string>`-sum(${stockMovements.quantity})`,
        unitCost: sql<string | null>`max(${stockMovements.unitCost})`,
      })
      .from(stockMovements)
      .where(
        and(
          eq(stockMovements.sourceId, opts.orderId),
          eq(stockMovements.sourceType, POS_ORDER_STOCK_SOURCE),
          eq(stockMovements.type, "ISSUE"),
          inArray(stockMovements.productId, productIds),
        ),
      )
      .groupBy(stockMovements.productId, stockMovements.warehouseId)
      .orderBy(asc(stockMovements.productId), asc(stockMovements.warehouseId));
    if (issued.length === 0) {
      return { moved: 0, totalCogsReversed: 0 };
    }
    const returned = await tx
      .select({
        productId: stockMovements.productId,
        warehouseId: stockMovements.warehouseId,
        quantity: sql<string>`sum(${stockMovements.quantity})`,
      })
      .from(stockMovements)
      .innerJoin(posRefunds, eq(posRefunds.id, stockMovements.sourceId))
      .where(
        and(
          eq(posRefunds.orderId, opts.orderId),
          eq(stockMovements.sourceType, POS_REFUND_STOCK_SOURCE),
          inArray(stockMovements.productId, productIds),
        ),
      )
      .groupBy(stockMovements.productId, stockMovements.warehouseId);

    let moved = 0;
    let totalCogsUnits = 0;
    for (const row of issued) {
      const left = wanted.get(row.productId) ?? 0;
      const already =
        returned.find(
          (r) =>
            r.productId === row.productId && r.warehouseId === row.warehouseId,
        )?.quantity ?? 0;
      const open =
        Math.round(Number(row.quantity) * 10_000) -
        Math.round(Number(already) * 10_000);
      const quantity = Math.min(left, open);
      if (quantity <= 0) {
        continue;
      }
      wanted.set(row.productId, left - quantity);
      const unitCost = row.unitCost === null ? undefined : Number(row.unitCost);
      const normalizedCost =
        unitCost === undefined
          ? undefined
          : Math.round(unitCost * 10_000) / 10_000;
      const movement = await applyStockMovement(
        {
          warehouseId: row.warehouseId,
          companyId: opts.companyId,
          productId: row.productId,
          type: "RETURN",
          quantity: quantity / 10_000,
          unitCost: normalizedCost,
          reference: opts.refundNumber,
          sourceId: opts.refundId,
          sourceType: POS_REFUND_STOCK_SOURCE,
          userId: opts.userId,
          logger: opts.logger,
          insufficientStockError: opts.insufficientStockError,
        },
        tx,
      );
      if (!movement.success) {
        return undefined;
      }
      if (normalizedCost !== undefined && normalizedCost > 0) {
        totalCogsUnits += Math.round(
          (quantity / 10_000) * normalizedCost * 10_000,
        );
      }
      moved += 1;
    }
    return {
      moved,
      totalCogsReversed: roundCogsAmount(totalCogsUnits / 10_000),
    };
  }
}
