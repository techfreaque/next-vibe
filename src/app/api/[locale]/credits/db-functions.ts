/**
 * Credit DB Functions
 *
 * All queries written in Drizzle - compiled to SQL at deploy time.
 * Row types are 100% inferred from the schema: no hand-written shapes.
 * Logic is a typed TypeScript function serialized to PL/v8 at deploy time.
 *
 * HOT PATH: getPoolBalance replaces 8-15 roundtrips with 1 atomic call.
 */

import "server-only";

import { and, eq, gt, isNotNull, isNull, lt, or, sql } from "drizzle-orm";

import { leadLeadLinks, userLeadLinks } from "@/app/api/[locale]/leads/db";
import { defineDbFunction } from "@/app/api/[locale]/system/db/db-functions/define";
import type { Plv8Global } from "@/app/api/[locale]/system/db/db-functions/types";
import { db } from "@/app/api/[locale]/system/db/index";

import { creditPacks, creditTransactions, creditWallets } from "./db";

// plv8 is a global injected by PostgreSQL's V8 engine at runtime.
// Declared here for type safety inside the logic function body.
// Does NOT exist in Node.js - logic is serialized and deployed to PL/v8.
declare const plv8: Plv8Global;

export const getPoolBalance = defineDbFunction({
  name: "credits_get_pool_balance",
  tables: [creditWallets, creditPacks, creditTransactions],
  params: { p_user_id: "uuid", p_lead_id: "uuid" } as const,
  returns: {
    total: "numeric",
    free: "numeric",
    expiring: "numeric",
    permanent: "numeric",
    earned: "numeric",
    expires_at: "text",
    capacity: "numeric",
  } as const,

  queries: (p) => ({
    // ── Wallet collection (scalar-param JOINs, no arrays needed) ──────────

    /** User's own wallet */
    userWallet: db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.userId, p.p_user_id)),

    /** Lead wallets linked to a user (via user_lead_links JOIN) */
    linkedLeadWallets: db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .innerJoin(userLeadLinks, eq(creditWallets.leadId, userLeadLinks.leadId))
      .where(eq(userLeadLinks.userId, p.p_user_id)),

    /** The starting lead's own wallet */
    leadWallet: db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.leadId, p.p_lead_id)),

    /**
     * Connected leads via graph traversal (WITH RECURSIVE).
     * Uses sql`` subquery in WHERE to avoid the array-param limitation.
     */
    connectedLeadWallets: db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(
        sql`${creditWallets.leadId} IN (
          WITH RECURSIVE connected(lead_id) AS (
            SELECT ${p.p_lead_id}::uuid
            UNION
            SELECT CASE
              WHEN ll.lead_id_1 = c.lead_id THEN ll.lead_id_2
              ELSE ll.lead_id_1
            END
            FROM ${leadLeadLinks} ll
            JOIN connected c ON ll.lead_id_1 = c.lead_id OR ll.lead_id_2 = c.lead_id
          )
          SELECT DISTINCT lead_id FROM connected
        )`,
      ),

    // ── Expiry (wallet subquery instead of array param) ───────────────────

    /** Expired subscription packs for a user's pool (user wallet + linked leads) */
    expiredPacksForUser: db
      .select({
        id: creditPacks.id,
        walletId: creditPacks.walletId,
        remaining: creditPacks.remaining,
      })
      .from(creditPacks)
      .where(
        and(
          or(
            // User's own wallet
            sql`${creditPacks.walletId} IN (
              SELECT id FROM ${creditWallets} WHERE user_id = ${p.p_user_id}
            )`,
            // Linked lead wallets
            sql`${creditPacks.walletId} IN (
              SELECT cw.id FROM ${creditWallets} cw
              JOIN ${userLeadLinks} ull ON cw.lead_id = ull.lead_id
              WHERE ull.user_id = ${p.p_user_id}
            )`,
          ),
          eq(creditPacks.type, "enums.packType.subscription"),
          isNotNull(creditPacks.expiresAt),
          lt(creditPacks.expiresAt, sql`NOW()`),
          gt(creditPacks.remaining, 0),
        ),
      ),

    /** Expired subscription packs for a lead's pool (connected leads) */
    expiredPacksForLead: db
      .select({
        id: creditPacks.id,
        walletId: creditPacks.walletId,
        remaining: creditPacks.remaining,
      })
      .from(creditPacks)
      .where(
        and(
          sql`${creditPacks.walletId} IN (
            WITH RECURSIVE connected(lead_id) AS (
              SELECT ${p.p_lead_id}::uuid
              UNION
              SELECT CASE
                WHEN ll.lead_id_1 = c.lead_id THEN ll.lead_id_2
                ELSE ll.lead_id_1
              END
              FROM ${leadLeadLinks} ll
              JOIN connected c ON ll.lead_id_1 = c.lead_id OR ll.lead_id_2 = c.lead_id
            )
            SELECT cw.id FROM ${creditWallets} cw
            JOIN connected c ON cw.lead_id = c.lead_id
          )`,
          eq(creditPacks.type, "enums.packType.subscription"),
          isNotNull(creditPacks.expiresAt),
          lt(creditPacks.expiresAt, sql`NOW()`),
          gt(creditPacks.remaining, 0),
        ),
      ),

    // ── Aggregation (wallet subquery) ─────────────────────────────────────

    /** Full wallet rows for a user's pool (includes current session lead even if not yet in userLeadLinks) */
    walletsForUser: db
      .select({
        id: creditWallets.id,
        leadId: creditWallets.leadId,
        balance: creditWallets.balance,
        freeCreditsRemaining: creditWallets.freeCreditsRemaining,
        freePeriodStart: creditWallets.freePeriodStart,
        freePeriodId: creditWallets.freePeriodId,
      })
      .from(creditWallets)
      .where(
        or(
          eq(creditWallets.userId, p.p_user_id),
          sql`${creditWallets.id} IN (
            SELECT cw.id FROM ${creditWallets} cw
            JOIN ${userLeadLinks} ull ON cw.lead_id = ull.lead_id
            WHERE ull.user_id = ${p.p_user_id}
          )`,
          // Include current session's lead wallet even if not yet linked to user
          // (new sessions create leads before the userLeadLinks record is established)
          eq(creditWallets.leadId, p.p_lead_id),
        ),
      ),

    /** Full wallet rows for a lead's pool */
    walletsForLead: db
      .select({
        id: creditWallets.id,
        leadId: creditWallets.leadId,
        balance: creditWallets.balance,
        freeCreditsRemaining: creditWallets.freeCreditsRemaining,
        freePeriodStart: creditWallets.freePeriodStart,
        freePeriodId: creditWallets.freePeriodId,
      })
      .from(creditWallets)
      .where(
        sql`${creditWallets.leadId} IN (
          WITH RECURSIVE connected(lead_id) AS (
            SELECT ${p.p_lead_id}::uuid
            UNION
            SELECT CASE
              WHEN ll.lead_id_1 = c.lead_id THEN ll.lead_id_2
              ELSE ll.lead_id_1
            END
            FROM ${leadLeadLinks} ll
            JOIN connected c ON ll.lead_id_1 = c.lead_id OR ll.lead_id_2 = c.lead_id
          )
          SELECT lead_id FROM connected
        )`,
      ),

    /** Active (non-expired) packs for a user's pool */
    activePacksForUser: db
      .select({
        type: creditPacks.type,
        remaining: creditPacks.remaining,
        originalAmount: creditPacks.originalAmount,
        expiresAt: creditPacks.expiresAt,
      })
      .from(creditPacks)
      .where(
        and(
          or(
            sql`${creditPacks.walletId} IN (
              SELECT id FROM ${creditWallets} WHERE user_id = ${p.p_user_id}
            )`,
            sql`${creditPacks.walletId} IN (
              SELECT cw.id FROM ${creditWallets} cw
              JOIN ${userLeadLinks} ull ON cw.lead_id = ull.lead_id
              WHERE ull.user_id = ${p.p_user_id}
            )`,
          ),
          // Include permanent packs (no expiry) and non-expired packs
          or(
            isNull(creditPacks.expiresAt),
            sql`${creditPacks.expiresAt} >= NOW()`,
          ),
          gt(creditPacks.remaining, 0),
        ),
      ),

    /** Active (non-expired) packs for a lead's pool */
    activePacksForLead: db
      .select({
        type: creditPacks.type,
        remaining: creditPacks.remaining,
        originalAmount: creditPacks.originalAmount,
        expiresAt: creditPacks.expiresAt,
      })
      .from(creditPacks)
      .where(
        and(
          sql`${creditPacks.walletId} IN (
            WITH RECURSIVE connected(lead_id) AS (
              SELECT ${p.p_lead_id}::uuid
              UNION
              SELECT CASE
                WHEN ll.lead_id_1 = c.lead_id THEN ll.lead_id_2
                ELSE ll.lead_id_1
              END
              FROM ${leadLeadLinks} ll
              JOIN connected c ON ll.lead_id_1 = c.lead_id OR ll.lead_id_2 = c.lead_id
            )
            SELECT cw.id FROM ${creditWallets} cw
            JOIN connected c ON cw.lead_id = c.lead_id
          )`,
          // Include permanent packs (no expiry) and non-expired packs
          or(
            isNull(creditPacks.expiresAt),
            sql`${creditPacks.expiresAt} >= NOW()`,
          ),
          gt(creditPacks.remaining, 0),
        ),
      ),
  }),

  // eslint-disable-next-line no-unused-vars -- p_lead_id used by compiled queries (q.*ForLead), not directly in logic body
  logic: (q, { p_user_id, p_lead_id: _p_lead_id }) => {
    const MAX_FREE_PER_POOL = 20;

    // ── Step 1: Determine which query set to use (user vs lead pool) ──────
    const isUserPool = p_user_id !== null;

    // ── Step 2: Expire stale subscription packs atomically ────────────────
    const expired = isUserPool
      ? q.expiredPacksForUser()
      : q.expiredPacksForLead();

    for (const ep of expired) {
      plv8.execute(
        "UPDATE credit_wallets SET balance = GREATEST(0, balance - $1), updated_at = NOW() WHERE id = $2",
        [ep.remaining, ep.walletId],
      );
      plv8.execute(
        "UPDATE credit_packs SET remaining = 0, updated_at = NOW() WHERE id = $1",
        [ep.id],
      );
      const afterRows = plv8.execute<{
        balance: number;
        free_period_id: string | null;
      }>("SELECT balance, free_period_id FROM credit_wallets WHERE id = $1", [
        ep.walletId,
      ]);
      const balAfter = afterRows.length > 0 ? afterRows[0].balance : 0;
      const fpId = afterRows.length > 0 ? afterRows[0].free_period_id : null;
      plv8.execute(
        "INSERT INTO credit_transactions (wallet_id, amount, balance_after, type, pack_id, free_period_id, metadata) VALUES ($1,$2,$3,'enums.transactionType.expiry',$4,$5,$6::jsonb)",
        [
          ep.walletId,
          -Number(ep.remaining),
          Number(balAfter),
          ep.id,
          fpId,
          JSON.stringify({
            expiredPackId: ep.id,
            expiredAmount: Number(ep.remaining),
          }),
        ],
      );
    }

    // ── Step 3: Load wallets and aggregate balances ───────────────────────
    const allWallets = isUserPool ? q.walletsForUser() : q.walletsForLead();

    // Deduplicate by wallet ID - the user pool OR conditions may return the same
    // wallet twice if the current session lead is also already in userLeadLinks
    const seenIds = new Set<string>();
    const wallets = allWallets.filter((w) => {
      if (seenIds.has(w.id)) {
        return false;
      }
      seenIds.add(w.id);
      return true;
    });

    if (wallets.length === 0) {
      return {
        total: 0,
        free: 0,
        expiring: 0,
        permanent: 0,
        earned: 0,
        expires_at: null,
        capacity: MAX_FREE_PER_POOL,
      };
    }

    let totalPaid = 0;
    let totalFreeInWallets = 0;

    for (const w of wallets) {
      totalPaid += Number(w.balance) || 0;
      if (w.leadId !== null) {
        totalFreeInWallets += Number(w.freeCreditsRemaining) || 0;
      }
    }

    // ── Step 4: Categorize active packs ──────────────────────────────────
    const packs = isUserPool ? q.activePacksForUser() : q.activePacksForLead();

    let totalExpiring = 0;
    let totalPermanent = 0;
    let totalEarned = 0;
    let packCapacity = 0;
    let earliestExpiry: Date | null = null;

    for (const pack of packs) {
      const rem = Number(pack.remaining) || 0;
      const orig = Number(pack.originalAmount) || 0;
      packCapacity += orig;
      if (
        pack.type === "enums.packType.subscription" &&
        pack.expiresAt !== null
      ) {
        totalExpiring += rem;
        const expAt = new Date(String(pack.expiresAt));
        if (earliestExpiry === null || expAt < earliestExpiry) {
          earliestExpiry = expAt;
        }
      } else if (pack.type === "enums.packType.earned") {
        totalEarned += rem;
      } else {
        totalPermanent += rem;
      }
    }

    // ── Step 5: Calculate free credits spent this period ─────────────────
    // Sum usage across ALL lead wallets in the pool using the current calendar period.
    // Uses plv8.execute() directly because wallet_id varies per-wallet in the loop
    // and cannot use the function-level params (p_user_id / p_lead_id).
    let freeCreditsSpent = 0;
    const now = new Date();
    const activePeriodId = `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    for (const w of wallets) {
      if (w.leadId !== null) {
        // Fetch ALL usage transactions for this lead wallet in the current period
        const usageRows = plv8.execute<{
          metadata: { freeCreditsUsed?: number } | null;
        }>(
          "SELECT metadata FROM credit_transactions WHERE wallet_id = $1 AND free_period_id = $2 AND type = 'enums.transactionType.usage'",
          [w.id, activePeriodId],
        );

        for (const row of usageRows) {
          const meta = row.metadata;
          if (
            meta !== null &&
            typeof meta === "object" &&
            meta.freeCreditsUsed
          ) {
            freeCreditsSpent += Number(meta.freeCreditsUsed) || 0;
          }
        }
      }
    }

    // ── Step 6: Final result ──────────────────────────────────────────────
    const freeAvailable = Math.max(
      0,
      Math.min(totalFreeInWallets, MAX_FREE_PER_POOL - freeCreditsSpent),
    );

    return {
      total: freeAvailable + totalPaid,
      free: freeAvailable,
      expiring: totalExpiring,
      permanent: totalPermanent,
      earned: totalEarned,
      expires_at: earliestExpiry ? earliestExpiry.toISOString() : null,
      capacity: packCapacity + MAX_FREE_PER_POOL,
    };
  },
});
