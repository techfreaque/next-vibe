import "server-only";

import {
  and,
  count,
  desc,
  eq,
  ilike,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentRefunds, paymentTransactions, paymentWebhooks } from "../db";
import {
  CheckoutMode,
  PaymentProvider,
  type PaymentProviderValue,
  PaymentStatus,
  RefundStatus,
} from "../enum";
import { canStartStripeRefund } from "../refund/eligibility";
import type {
  PaymentProcessorRequest,
  PaymentProcessorResponse,
} from "./definition";
import {
  ProcessorKind,
  type ProcessorKindValue,
  ProcessorView,
  RefundBlock,
  type RefundBlockValue,
  WebhookProcessing,
} from "./enum";
import type { PaymentProcessorT } from "./i18n";

const isRenewal = sql<boolean>`coalesce(${paymentTransactions.metadata}->>'type' = 'subscription_renewal', false)`;

/** SQL condition for one payment kind (pack, first subscription, renewal). */
function kindCondition(kind: typeof ProcessorKindValue): SQL | undefined {
  switch (kind) {
    case ProcessorKind.PACK:
      return eq(paymentTransactions.mode, CheckoutMode.PAYMENT);
    case ProcessorKind.SUBSCRIPTION:
      return eq(paymentTransactions.mode, CheckoutMode.SUBSCRIPTION);
    case ProcessorKind.RENEWAL:
      return sql`${isRenewal}`;
    case ProcessorKind.NEW_SUBSCRIPTION:
      return and(
        eq(paymentTransactions.mode, CheckoutMode.SUBSCRIPTION),
        sql`not ${isRenewal}`,
      );
    default:
      return undefined;
  }
}

function rowKind(
  mode: string,
  renewal: boolean,
): typeof ProcessorKindValue | null {
  if (renewal) {
    return ProcessorKind.RENEWAL;
  }
  if (mode === CheckoutMode.PAYMENT) {
    return ProcessorKind.PACK;
  }
  if (mode === CheckoutMode.SUBSCRIPTION) {
    return ProcessorKind.NEW_SUBSCRIPTION;
  }
  return null;
}

/** Reason a settled payment cannot open refund review (null = eligible or not settled). */
function refundBlockFor(row: {
  provider: string;
  status: string;
  mode: string;
  amount: string | number;
  providerPaymentIntentId: string | null;
  providerSessionId: string | null;
}): typeof RefundBlockValue | null {
  if (row.status !== PaymentStatus.SUCCEEDED || canStartStripeRefund(row)) {
    return null;
  }
  if (row.provider !== PaymentProvider.STRIPE) {
    return RefundBlock.NOT_STRIPE;
  }
  if (row.mode === CheckoutMode.SETUP) {
    return RefundBlock.SETUP;
  }
  if (!(Number(row.amount) > 0)) {
    return RefundBlock.ZERO_AMOUNT;
  }
  return RefundBlock.NO_REFERENCE;
}

export class PaymentProcessorRepository {
  static async list(
    input: PaymentProcessorRequest,
    logger: EndpointLogger,
    t: PaymentProcessorT,
  ): Promise<ResponseType<PaymentProcessorResponse>> {
    try {
      if (input.view === ProcessorView.WEBHOOKS) {
        if (input.userId || input.transactionId) {
          return fail({
            message: t("errors.validation"),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
        }
        return success(await this.listWebhooks(input));
      }
      if (input.from && input.to && input.from > input.to) {
        return fail({
          message: t("errors.dateRange"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      return success(await this.listTransactions(input));
    } catch (error) {
      logger.error("Failed to load processor records", parseError(error));
      return fail({
        message: t("errors.server"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async listTransactions(
    input: PaymentProcessorRequest,
  ): Promise<PaymentProcessorResponse> {
    const {
      userId,
      transactionId,
      status,
      provider,
      kind,
      currency,
      from,
      to,
      query,
      page,
      limit,
    } = input;
    const match = `%${(query ?? "").replaceAll(/[\\%_]/g, (char) => `\\${char}`)}%`;
    const scope = and(
      userId ? eq(paymentTransactions.userId, userId) : undefined,
      transactionId ? eq(paymentTransactions.id, transactionId) : undefined,
      provider ? eq(paymentTransactions.provider, provider) : undefined,
      kind ? kindCondition(kind) : undefined,
      currency ? eq(paymentTransactions.currency, currency) : undefined,
      from ? sql`${paymentTransactions.createdAt} >= ${from}::date` : undefined,
      to
        ? sql`${paymentTransactions.createdAt} < (${to}::date + interval '1 day')`
        : undefined,
      query
        ? or(
            ilike(users.email, match),
            ilike(sql`${paymentTransactions.id}::text`, match),
            ilike(paymentTransactions.providerInvoiceId, match),
            ilike(paymentTransactions.providerPaymentIntentId, match),
            ilike(paymentTransactions.providerSessionId, match),
          )
        : undefined,
    );
    const where = and(
      scope,
      status ? eq(paymentTransactions.status, status) : undefined,
    );
    const charged = sql`${paymentTransactions.status} in (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})`;
    const refundAmount = sql`(
      select sum(${paymentRefunds.amount}) from ${paymentRefunds}
      where ${paymentRefunds.transactionId} = ${paymentTransactions.id}
        and ${paymentRefunds.status} = ${RefundStatus.SUCCEEDED}
    )`;
    const [counts, statusCounts, totals, rows] = await Promise.all([
      db
        .select({ total: count() })
        .from(paymentTransactions)
        .innerJoin(users, eq(paymentTransactions.userId, users.id))
        .where(where),
      db
        .select({ status: paymentTransactions.status, count: count() })
        .from(paymentTransactions)
        .innerJoin(users, eq(paymentTransactions.userId, users.id))
        .where(scope)
        .groupBy(paymentTransactions.status)
        .orderBy(paymentTransactions.status),
      db
        .select({
          currency: paymentTransactions.currency,
          gross: sql<string>`coalesce(sum(${paymentTransactions.amount}) filter (where ${charged}), 0)`,
          succeeded: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})::int`,
          failed: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.FAILED})::int`,
          refunded: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.REFUNDED})::int`,
          refundedAmount: sql<string>`coalesce(sum(coalesce(${refundAmount},
            case when ${paymentTransactions.status} = ${PaymentStatus.REFUNDED} then ${paymentTransactions.amount} else 0 end
          )) filter (where ${charged}), 0)`,
        })
        .from(paymentTransactions)
        .innerJoin(users, eq(paymentTransactions.userId, users.id))
        .where(and(where, ne(paymentTransactions.mode, CheckoutMode.SETUP)))
        .groupBy(paymentTransactions.currency)
        .orderBy(paymentTransactions.currency),
      db
        .select({
          id: paymentTransactions.id,
          userId: paymentTransactions.userId,
          userEmail: users.email,
          amount: paymentTransactions.amount,
          currency: paymentTransactions.currency,
          status: paymentTransactions.status,
          provider: paymentTransactions.provider,
          mode: paymentTransactions.mode,
          renewal: isRenewal,
          providerInvoiceId: paymentTransactions.providerInvoiceId,
          providerPaymentIntentId: paymentTransactions.providerPaymentIntentId,
          providerSessionId: paymentTransactions.providerSessionId,
          createdAt: paymentTransactions.createdAt,
          updatedAt: paymentTransactions.updatedAt,
        })
        .from(paymentTransactions)
        .innerJoin(users, eq(paymentTransactions.userId, users.id))
        .where(where)
        .orderBy(
          desc(paymentTransactions.createdAt),
          desc(paymentTransactions.id),
        )
        .limit(limit)
        .offset((page - 1) * limit),
    ]);
    const total = counts[0]?.total ?? 0;

    return {
      resultView: ProcessorView.TRANSACTIONS,
      transactions: rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        userEmail: row.userEmail,
        amount: Number(row.amount),
        currency: row.currency,
        status: row.status,
        provider: row.provider,
        mode: row.mode,
        renewal: row.renewal,
        kind: rowKind(row.mode, row.renewal),
        providerInvoiceId: row.providerInvoiceId,
        refundEligible: canStartStripeRefund(row),
        refundBlock: refundBlockFor(row),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
      webhooks: [],
      statusCounts,
      totals: totals.map((row) => ({
        currency: row.currency,
        collected: Number(row.gross) - Number(row.refundedAmount),
        succeeded: Number(row.succeeded),
        failed: Number(row.failed),
        refunded: Number(row.refunded),
        refundedAmount: Number(row.refundedAmount),
        gross: Number(row.gross),
      })),
      currentPage: page,
      pageCount: Math.ceil(total / limit),
      total,
      pageSize: limit,
    };
  }

  private static async listWebhooks(
    input: PaymentProcessorRequest,
  ): Promise<PaymentProcessorResponse> {
    const { processing, provider, query, page, limit } = input;
    // The event table predates a provider column. Only classify references
    // matching the providers' known identifiers. Never inspect stored bodies.
    const recordedProvider = sql<typeof PaymentProviderValue | null>`
      case
        when ${paymentWebhooks.providerEventId} ~ '^evt_[A-Za-z0-9]+$' then ${PaymentProvider.STRIPE}
        when ${paymentWebhooks.providerEventId} ~ '^[0-9]+(_[a-z_]+)?$' then ${PaymentProvider.NOWPAYMENTS}
        else null
      end`;
    const match = `%${(query ?? "").replaceAll(/[\\%_]/g, (char) => `\\${char}`)}%`;
    const where = and(
      processing
        ? eq(
            paymentWebhooks.processed,
            processing === WebhookProcessing.PROCESSED,
          )
        : undefined,
      provider ? eq(recordedProvider, provider) : undefined,
      query
        ? or(
            ilike(paymentWebhooks.eventType, match),
            ilike(paymentWebhooks.providerEventId, match),
          )
        : undefined,
    );
    const [counts, webhooks] = await Promise.all([
      db.select({ total: count() }).from(paymentWebhooks).where(where),
      db
        .select({
          id: paymentWebhooks.id,
          providerEventId: paymentWebhooks.providerEventId,
          eventType: paymentWebhooks.eventType,
          provider: recordedProvider,
          processed: paymentWebhooks.processed,
          createdAt: paymentWebhooks.createdAt,
          processedAt: paymentWebhooks.processedAt,
        })
        .from(paymentWebhooks)
        .where(where)
        .orderBy(desc(paymentWebhooks.createdAt), desc(paymentWebhooks.id))
        .limit(limit)
        .offset((page - 1) * limit),
    ]);
    const total = counts[0]?.total ?? 0;

    return {
      resultView: ProcessorView.WEBHOOKS,
      transactions: [],
      webhooks,
      totals: [],
      currentPage: page,
      pageCount: Math.ceil(total / limit),
      total,
      pageSize: limit,
    };
  }
}
