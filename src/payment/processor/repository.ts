import "server-only";

import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
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

import { paymentTransactions, paymentWebhooks } from "../db";
import { PaymentProvider, type PaymentProviderValue } from "../enum";
import { canStartStripeRefund } from "../refund/eligibility";
import type {
  PaymentProcessorRequest,
  PaymentProcessorResponse,
} from "./definition";
import { ProcessorView, WebhookProcessing } from "./enum";
import type { PaymentProcessorT } from "./i18n";

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
    const { userId, transactionId, status, provider, query, page, limit } =
      input;
    const match = `%${(query ?? "").replaceAll(/[\\%_]/g, (char) => `\\${char}`)}%`;
    const where = and(
      userId ? eq(paymentTransactions.userId, userId) : undefined,
      transactionId ? eq(paymentTransactions.id, transactionId) : undefined,
      status ? eq(paymentTransactions.status, status) : undefined,
      provider ? eq(paymentTransactions.provider, provider) : undefined,
      query
        ? or(
            ilike(users.email, match),
            ilike(sql`${paymentTransactions.id}::text`, match),
            ilike(paymentTransactions.providerInvoiceId, match),
          )
        : undefined,
    );
    const [counts, rows] = await Promise.all([
      db
        .select({ total: count() })
        .from(paymentTransactions)
        .innerJoin(users, eq(paymentTransactions.userId, users.id))
        .where(where),
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
          renewal: sql<boolean>`coalesce(${paymentTransactions.metadata}->>'type' = 'subscription_renewal', false)`,
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
        providerInvoiceId: row.providerInvoiceId,
        refundEligible: canStartStripeRefund(row),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
      webhooks: [],
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
      currentPage: page,
      pageCount: Math.ceil(total / limit),
      total,
      pageSize: limit,
    };
  }
}
