/**
 * Credit-balance helpers for the AI-stream suites: read/pin the local test
 * wallet, assert per-step deductions with a ledger-audit dump on violation,
 * and read/poll the remote (hermes) admin wallet for relay-billing proofs.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { expect } from "vitest";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";

/** Timestamp of the most recent getBalance() call - bounds the charge audit window. */
let lastBalanceReadAt = new Date(0);

/**
 * The moment the most recent getBalance() sampled the wallet. Capture this
 * right after a before-balance read to bound a later ledger audit window
 * (assertDeducted uses it internally; assertLocalNotBilled takes it as input).
 */
export function getLastBalanceReadAt(): Date {
  return lastBalanceReadAt;
}

/** Read the current credit balance for the test user via endpoint */
export async function getBalance(user: JwtPrivatePayloadType): Promise<number> {
  // Settle any in-flight fire-and-forget work (embeddings, vision-bridge) from a
  // prior step before reading the balance — their credit deductions are real but
  // land async; measuring before they settle would attribute a prior step's cost
  // to the current one (cross-test bleed). Embeddings/vision are external fetches,
  // so draining inflight fetches deterministically bounds the measurement window.
  const { waitForInflightFetches } =
    await import("../../../testing/fetch-cache");
  // Let queued setTimeout(0) embeds kick off their fetch, then drain to settle.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 50);
  });
  await waitForInflightFetches();
  const creditsDef = (await import("@/app/api/[locale]/credits/definition"))
    .default;
  const result = await sendTestRequest({
    endpoint: creditsDef.GET,
    user,
  });
  if (!result.success) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(`getBalance failed for user ${user.id}: ${result.message}`);
  }
  lastBalanceReadAt = new Date();
  const total = result.data?.["total"];
  if (typeof total !== "number") {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `getBalance: unexpected response shape — total is ${String(total)}`,
    );
  }
  return total;
}

/**
 * Ensure the test user has at least `credits` credits.
 * Checks balance first via endpoint; tops up only the deficit.
 * Never zeroes wallets — avoids destructive side-effects on other tests.
 */
export async function pinBalance(
  user: JwtPrivatePayloadType,
  credits: number,
): Promise<void> {
  const current = await getBalance(user);
  if (current >= credits) {
    return;
  }
  const deficit = credits - current;
  const adminAddDef = (
    await import("@/app/api/[locale]/credits/admin-add/definition")
  ).default;
  const result = await sendTestRequest({
    endpoint: adminAddDef.POST,
    data: { targetUserId: user.id, amount: Math.ceil(deficit) },
    user,
  });
  expect(
    result.success,
    `pinBalance: failed to top up credits for ${user.id}: ${result.success ? "" : String((result as { message?: string }).message ?? "")}`,
  ).toBe(true);
}

/**
 * True for credit transactions that are async INDEXING / media-bridge work, not
 * a stream's own chat usage: cortex embeddings (a feature with no chat model)
 * and the vision/embedding bridge models (gemini *flash* / *flash-lite* — used
 * for describe + embedding, never as the chat model in these suites). Used to
 * separate the dev-server's shared-wallet indexing charges from chat cost.
 */
export function isIndexingCreditTx(tx: {
  feature: string | null;
  modelId: string | null;
}): boolean {
  if (tx.feature !== null && tx.modelId === null) {
    return true;
  }
  const m = tx.modelId ?? "";
  // Vision-bridge/indexing models only. A bare "flash" match would also
  // swallow chat charges from deepseek-v4-flash (the budget QA model) and
  // make truthful-accounting asserts read 0.
  return (
    m.includes("flash-lite") ||
    m.includes("embedding") ||
    m.startsWith("gemini-2.5-flash") ||
    m.startsWith("gemini-3.1-flash-lite")
  );
}

/** Fetch all wallet transactions for `user` created at/after `since` (newest first). */
async function fetchWalletTxsSince(
  user: JwtPrivatePayloadType,
  since: Date,
): Promise<
  Array<{
    createdAt: Date;
    amount: number;
    modelId: string | null;
    feature: string | null;
    messageId: string | null;
  }>
> {
  const { creditTransactions, creditWallets } =
    await import("@/app/api/[locale]/credits/db");
  const { gte: gteOp, inArray, desc: descOp } = await import("drizzle-orm");
  const wallets = await db
    .select({ id: creditWallets.id })
    .from(creditWallets)
    .where(eq(creditWallets.userId, user.id));
  return db
    .select({
      createdAt: creditTransactions.createdAt,
      amount: creditTransactions.amount,
      modelId: creditTransactions.modelId,
      feature: creditTransactions.feature,
      messageId: creditTransactions.messageId,
    })
    .from(creditTransactions)
    .where(
      and(
        inArray(
          creditTransactions.walletId,
          wallets.map((w) => w.id),
        ),
        gteOp(creditTransactions.createdAt, since),
      ),
    )
    .orderBy(descOp(creditTransactions.createdAt))
    .limit(60);
}

/**
 * Assert credit deduction is within [min, max] inclusive.
 * On violation, dumps every wallet transaction since the before-balance read
 * with timestamp/model/message linkage, so a foreign charge (background
 * generation from an earlier test, another process billing the shared
 * test wallet) is named in the failure instead of needing DB forensics.
 */
export async function assertDeducted(
  user: JwtPrivatePayloadType,
  before: number,
  after: number,
  min: number,
  max: number,
): Promise<void> {
  const deducted = before - after;
  // Float epsilon: balances are floating-point sums; 0.4 can read as
  // 0.39999999999… — a hair under min is a rounding artifact, not a miss.
  const EPSILON = 0.005;
  if (deducted >= min - EPSILON && deducted <= max + EPSILON) {
    return;
  }
  const { inArray } = await import("drizzle-orm");
  const txs = await fetchWalletTxsSince(user, lastBalanceReadAt);
  const knownMessageIds = new Set(
    (
      await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(
          inArray(
            chatMessages.id,
            txs.map((t) => t.messageId).filter((id): id is string => !!id),
          ),
        )
    ).map((m) => m.id),
  );
  const audit = txs
    .map(
      (t) =>
        `  ${t.createdAt.toISOString()} ${String(t.amount)} model=${t.modelId ?? "-"} feature=${t.feature ?? "-"} msg=${t.messageId ?? "-"}${t.messageId && !knownMessageIds.has(t.messageId) ? " [NOT IN chat_messages - foreign/background charge]" : ""}`,
    )
    .join("\n");
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
  throw new Error(
    `Expected deduction ${min}–${max}, got ${deducted} (before=${before}, after=${after}).\n` +
      `Wallet transactions since the before-balance read (${lastBalanceReadAt.toISOString()}):\n${audit}`,
  );
}

/**
 * Remote-folder billing contract: only the loop-running side bills. When the
 * whole loop moved to the remote via REMOTE-folder routing, the LOCAL testUser
 * wallet must NOT drop for the turn beyond a small epsilon — any drop must be
 * fully explained by async indexing/media-bridge charges (isIndexingCreditTx),
 * which the dev server bills to the shared wallet independently of the turn.
 *
 * `since` bounds the audit window: capture getLastBalanceReadAt() right after
 * the before-balance read.
 */
export async function assertLocalNotBilled(
  user: JwtPrivatePayloadType,
  before: number,
  after: number,
  since: Date,
  epsilonCredits = 2,
): Promise<void> {
  const dropped = before - after;
  if (dropped <= epsilonCredits) {
    return;
  }
  const txs = await fetchWalletTxsSince(user, since);
  // Deductions are negative amounts; sum the indexing-attributed portion.
  const indexingDrop = txs
    .filter((t) => t.amount < 0 && isIndexingCreditTx(t))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const unexplainedDrop = dropped - indexingDrop;
  if (unexplainedDrop <= epsilonCredits) {
    return;
  }
  const audit = txs
    .map(
      (t) =>
        `  ${t.createdAt.toISOString()} ${String(t.amount)} model=${t.modelId ?? "-"} feature=${t.feature ?? "-"} msg=${t.messageId ?? "-"}${isIndexingCreditTx(t) ? " [indexing — excluded]" : ""}`,
    )
    .join("\n");
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test assertion
  throw new Error(
    `LOCAL-NOT-BILLED violated: remote-folder relay must bill ONLY the loop-running side, ` +
      `but the local wallet dropped ${String(dropped)} credits (${String(unexplainedDrop)} beyond indexing, epsilon=${String(epsilonCredits)}; before=${String(before)}, after=${String(after)}).\n` +
      `Wallet transactions since ${since.toISOString()}:\n${audit}`,
  );
}

/** A usage-deduction ledger row on the remote admin's wallets. */
export interface RemoteDeductionRow {
  amount: number;
  modelId: string | null;
  createdAt: string;
}

/**
 * Read the newest usage-deduction timestamp on the remote admin's wallets
 * (user wallet + linked lead wallets). Used as a DB-side marker: capture it
 * before a relayed stream, then poll for a deduction row NEWER than it.
 *
 * Why not the balance SUM: the sum flaps — concurrent credit ADDITIONS
 * (setup top-ups, lead-wallet initial grants, monthly free refresh) can land
 * inside the poll window and mask a real deduction, and the deduction itself
 * commits asynchronously on the remote node (observed ~15-20s after the relay
 * HTTP response under load). A ledger row is append-only evidence: immune to
 * offsetting credits, and the DB-side marker avoids cross-host clock skew.
 */
export async function readRemoteDeductionMarker(): Promise<string | null> {
  const rows = await queryRemoteDeductionsAfter(null, 1);
  return rows[0]?.createdAt ?? null;
}

/**
 * Poll the remote ledger for a usage deduction (amount < 0) on the admin's
 * wallets with created_at strictly newer than `marker` (null marker = any
 * deduction counts). Returns the matching rows (newest first), or [] on timeout.
 */
export async function waitForRemoteDeductionAfter(
  marker: string | null,
  timeoutMs = 60_000,
  pollMs = 500,
): Promise<RemoteDeductionRow[]> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const rows = await queryRemoteDeductionsAfter(marker, 10);
    if (rows.length > 0) {
      return rows;
    }
    if (Date.now() >= deadline) {
      return [];
    }
    await new Promise((resolve) => {
      setTimeout(resolve, pollMs);
    });
  }
}

async function queryRemoteDeductionsAfter(
  marker: string | null,
  limit: number,
): Promise<RemoteDeductionRow[]> {
  const { getProdDb, resolveProdUserId } =
    await import("../../../testing/remote-setup");
  const prodUserId = await resolveProdUserId();
  if (!prodUserId) {
    return [];
  }
  const pdb = getProdDb();
  const rows = await pdb.execute<{
    amount: string | number;
    model_id: string | null;
    created_at: string | Date;
  }>(
    sql`SELECT ct.amount, ct.model_id, ct.created_at
        FROM credit_transactions ct
        JOIN credit_wallets cw ON cw.id = ct.wallet_id
        WHERE ct.amount < 0
          AND (cw.user_id = ${prodUserId}
            OR cw.lead_id IN (
              SELECT ull.lead_id FROM user_lead_links ull
              WHERE ull.user_id = ${prodUserId}
            ))
          AND (${marker}::timestamp IS NULL OR ct.created_at > ${marker}::timestamp)
        ORDER BY ct.created_at DESC
        LIMIT ${limit}`,
  );
  return rows.rows.map((r) => ({
    amount: typeof r.amount === "number" ? r.amount : parseFloat(r.amount),
    modelId: r.model_id,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
  }));
}

/**
 * LOCAL-side twins of the remote ledger helpers: marker + poll for a new
 * usage deduction (amount < 0) on the LOCAL admin's wallets. Used by the
 * loop-LOCAL topology to prove the loop ran (and billed) on THIS side.
 */
export async function readLocalDeductionMarker(
  userId: string,
): Promise<string | null> {
  const rows = await queryLocalDeductionsAfter(userId, null, 1);
  return rows[0]?.createdAt ?? null;
}

export async function waitForLocalDeductionAfter(
  userId: string,
  marker: string | null,
  timeoutMs = 60_000,
  pollMs = 500,
): Promise<RemoteDeductionRow[]> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const rows = await queryLocalDeductionsAfter(userId, marker, 10);
    if (rows.length > 0) {
      return rows;
    }
    if (Date.now() >= deadline) {
      return [];
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, pollMs);
    });
  }
}

async function queryLocalDeductionsAfter(
  userId: string,
  marker: string | null,
  limit: number,
): Promise<RemoteDeductionRow[]> {
  const rows = await db.execute<{
    amount: string | number;
    model_id: string | null;
    created_at: string | Date;
  }>(
    sql`SELECT ct.amount, ct.model_id, ct.created_at
        FROM credit_transactions ct
        JOIN credit_wallets cw ON cw.id = ct.wallet_id
        WHERE ct.amount < 0
          AND (cw.user_id = ${userId}
            OR cw.lead_id IN (
              SELECT ull.lead_id FROM user_lead_links ull
              WHERE ull.user_id = ${userId}
            ))
          AND (${marker}::timestamp IS NULL OR ct.created_at > ${marker}::timestamp)
        ORDER BY ct.created_at DESC
        LIMIT ${limit}`,
  );
  return rows.rows.map((r) => ({
    amount: typeof r.amount === "number" ? r.amount : parseFloat(r.amount),
    modelId: r.model_id,
    createdAt:
      r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
  }));
}
