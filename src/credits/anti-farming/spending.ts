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
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  ipPrefixSql,
  leadIpSql,
  leadUserAgentSql,
  uaFingerprintSql,
} from "@/leads/analytics/bot-sql";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { creditPacks, creditTransactions, creditWallets } from "../db";
import { CreditFundingType, CreditTransactionType } from "../enum";
import { packFundingType, spendablePacks } from "../funding";
import type { CreditsT } from "../i18n";
import { TOOL_COST_PROVIDERS } from "../tool-cost-providers";
import { protectionEnv } from "./env";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
const toolServices = new Set<string>(
  Object.values(TOOL_COST_PROVIDERS).map((tool) => tool.modelId),
);

export function restrictedModel(model: string | undefined): boolean {
  return (
    protectionEnv.FREE_MODEL_MODE !== "off" &&
    !!model &&
    !toolServices.has(model) &&
    !protectionEnv.FREE_MODEL_ALLOWLIST.split(",").some(
      (id) => id.trim() === model,
    )
  );
}

export function purchasedPack(pack: typeof creditPacks.$inferSelect): boolean {
  const funding = packFundingType({
    ...pack,
    sessionId: pack.metadata.sessionId,
  });
  return (
    funding === CreditFundingType.SUBSCRIPTION ||
    funding === CreditFundingType.PURCHASED
  );
}

interface ClusterBudget {
  prefix: string | null;
  fingerprint: string | null;
  remaining: number;
}

/** Only shadow/enforced debits participate. Shadow records the amount the shared
 * pool would have covered, so switching to enforcement preserves the current window. */
async function clusterBudget(
  userId: string | undefined,
  leadId: string | undefined,
  tx?: Transaction,
): Promise<ClusterBudget | undefined> {
  if (protectionEnv.FREE_CLUSTER_MODE === "off" || !leadId) {
    return undefined;
  }
  const reader = tx ?? db;
  if (userId) {
    const [purchase] = await reader
      .select({ id: paymentTransactions.id })
      .from(paymentTransactions)
      .where(
        and(
          eq(paymentTransactions.userId, userId),
          eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          gt(paymentTransactions.amount, "0"),
        ),
      )
      .limit(1);
    if (purchase) {
      return undefined;
    }
  }
  const {
    rows: [identity],
  } = await reader.execute<{
    prefix: string | null;
    fingerprint: string | null;
  }>(sql`
    SELECT ${ipPrefixSql(leadIpSql())} AS prefix, ${uaFingerprintSql(leadUserAgentSql())} AS fingerprint
    FROM leads l WHERE l.id = ${leadId}`);
  const rules = protectionEnv.FREE_CLUSTER_RULES;
  const prefix = rules !== "fingerprint" ? (identity?.prefix ?? null) : null;
  const fingerprint =
    rules !== "prefix" ? (identity?.fingerprint ?? null) : null;
  if (!prefix && !fingerprint) {
    return undefined;
  }
  if (tx) {
    // All writers acquire keys in the same order, before wallet/pack row locks.
    for (const key of [prefix, fingerprint]) {
      if (key) {
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtextextended(${`free-cluster:${key}`}, 0))`,
        );
      }
    }
  }
  const hours = protectionEnv.FREE_CLUSTER_WINDOW_HOURS;
  const {
    rows: [row],
  } = await reader.execute<{ used: number }>(sql`
    SELECT greatest(
      coalesce(sum((metadata->>'clusterCredits')::numeric) FILTER (WHERE metadata->>'clusterPrefix' = ${prefix}), 0),
      coalesce(sum((metadata->>'clusterCredits')::numeric) FILTER (WHERE metadata->>'clusterFingerprint' = ${fingerprint}), 0)
    )::float8 AS used
    FROM ${creditTransactions}
    CROSS JOIN (SELECT date_bin(make_interval(hours => ${hours}), now(), timestamptz '1970-01-01 UTC') AT TIME ZONE 'UTC' AS start_at) period
    WHERE created_at >= period.start_at AND created_at < period.start_at + make_interval(hours => ${hours})
      AND type = ${CreditTransactionType.USAGE}
      AND (metadata->>'clusterPrefix' = ${prefix} OR metadata->>'clusterFingerprint' = ${fingerprint})`);
  return {
    prefix,
    fingerprint,
    remaining: Math.max(
      0,
      Math.round(
        (protectionEnv.FREE_CLUSTER_CREDITS - Number(row?.used ?? 0)) *
          1_000_000,
      ) / 1_000_000,
    ),
  };
}

/** Roll back a failed shadow lookup to a savepoint so it cannot abort a real charge. */
export async function deductionClusterBudget(
  userId: string | undefined,
  leadId: string | undefined,
  tx: Transaction,
  logger: EndpointLogger,
): Promise<ClusterBudget | undefined> {
  if (protectionEnv.FREE_CLUSTER_MODE !== "shadow") {
    return clusterBudget(userId, leadId, tx);
  }
  try {
    return await tx.transaction((savepoint) =>
      clusterBudget(userId, leadId, savepoint),
    );
  } catch (error) {
    logger.warn(
      "Could not evaluate the shadow cluster budget",
      parseError(error).message,
    );
    return undefined;
  }
}

/** Ceiling for pre-generation checks and output-token budgets. A settled debit
 * rechecks the same limits under lock because concurrent calls can spend it. */
export async function protectedBalance(
  userId: string | undefined,
  leadId: string | undefined,
  model: string | undefined,
  balance: number,
  cost: number,
  t: CreditsT,
  locale: CountryLanguage,
): Promise<ResponseType<number>> {
  const paidOnly =
    protectionEnv.FREE_MODEL_MODE === "enforce" && restrictedModel(model);
  const budget =
    !paidOnly && protectionEnv.FREE_CLUSTER_MODE === "enforce"
      ? await clusterBudget(userId, leadId)
      : undefined;
  if (!paidOnly && !budget) {
    return success(balance);
  }
  const packs = userId
    ? await db
        .select({ pack: creditPacks })
        .from(creditPacks)
        .innerJoin(creditWallets, eq(creditWallets.id, creditPacks.walletId))
        .where(
          and(
            eq(creditWallets.userId, userId),
            spendablePacks(new Date()),
            gt(creditPacks.remaining, 0),
          ),
        )
    : [];
  const packBalance = packs.reduce(
    (sum, { pack }) =>
      sum + (!paidOnly || purchasedPack(pack) ? pack.remaining : 0),
    0,
  );
  const eligible = Math.min(
    balance,
    Math.round(((budget?.remaining ?? 0) + packBalance) * 1_000_000) /
      1_000_000,
  );
  if (
    (eligible < cost && (paidOnly || eligible < balance)) ||
    (paidOnly && eligible <= 0)
  ) {
    return fail({
      message: paidOnly
        ? t("errors.purchasedModel", { path: `/${locale}/subscription/buy` })
        : t("errors.clusterLimit"),
      errorType: paidOnly
        ? ErrorResponseTypes.PURCHASED_MODEL_REQUIRED
        : ErrorResponseTypes.SHARED_ALLOWANCE_REACHED,
    });
  }
  return success(eligible);
}
