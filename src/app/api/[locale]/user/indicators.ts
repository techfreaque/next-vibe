/**
 * Users Domain — Vibe Sense Indicators
 *
 * Exports time-series indicators for the users domain.
 * Auto-discovered by the Vibe Sense registry at startup.
 */

import "server-only";

import { and, count, eq, gte, lt, lte, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import type {
  DataPoint,
  DerivedIndicator,
  Indicator,
} from "../system/unified-interface/vibe-sense/indicators/types";
import { users } from "./db";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateToDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function dayBuckets(from: Date, to: Date): Date[] {
  const buckets: Date[] = [];
  let ts = truncateToDay(from).getTime();
  const endTs = truncateToDay(to).getTime();
  while (ts <= endTs) {
    buckets.push(new Date(ts));
    ts += 86_400_000; // 1 day in ms
  }
  return buckets;
}

// ─── users.registered ─────────────────────────────────────────────────────────

/**
 * Number of new user registrations per day.
 */
export const usersRegistered: Indicator = {
  id: "users.registered",
  description: "Number of new user registrations per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${users.createdAt})`.as("day"),
        cnt: count(),
      })
      .from(users)
      .where(and(gte(users.createdAt, from), lte(users.createdAt, to)))
      .groupBy(sql`date_trunc('day', ${users.createdAt})`)
      .orderBy(sql`date_trunc('day', ${users.createdAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── users.active_total ───────────────────────────────────────────────────────

/**
 * Total active (non-banned, verified) users — snapshot per day.
 */
export const usersActiveTotal: Indicator = {
  id: "users.active_total",
  description: "Total active verified user count (snapshot per day)",
  resolution: GraphResolution.ONE_DAY,
  persist: "snapshot",

  async query({ from, to }) {
    const buckets = dayBuckets(from, to);
    const points: DataPoint[] = [];

    for (const bucket of buckets) {
      const next = new Date(bucket);
      next.setUTCDate(next.getUTCDate() + 1);

      const [row] = await db
        .select({ cnt: count() })
        .from(users)
        .where(
          and(
            lt(users.createdAt, next),
            eq(users.isActive, true),
            eq(users.isBanned, false),
            eq(users.emailVerified, true),
          ),
        );

      points.push({
        timestamp: bucket,
        value: Number(row?.cnt ?? 0),
      });
    }

    return points;
  },
};

// ─── users.banned ─────────────────────────────────────────────────────────────

/**
 * Number of users banned per day.
 * Uses updatedAt as a proxy for when the ban was applied, filtered by isBanned=true.
 * NOTE: This is approximate — a proper banned_at timestamp would be more accurate.
 */
export const usersBanned: Indicator = {
  id: "users.banned",
  description: "Number of users banned per day (approximate)",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${users.updatedAt})`.as("day"),
        cnt: count(),
      })
      .from(users)
      .where(
        and(
          gte(users.updatedAt, from),
          lte(users.updatedAt, to),
          eq(users.isBanned, true),
        ),
      )
      .groupBy(sql`date_trunc('day', ${users.updatedAt})`)
      .orderBy(sql`date_trunc('day', ${users.updatedAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── users.registered_ma7 ─────────────────────────────────────────────────────

/**
 * 7-day moving average of user registrations.
 */
export const usersRegisteredMA7: DerivedIndicator = {
  id: "users.registered_ma7",
  description: "7-day moving average of new user registrations",
  inputs: ["users.registered"],
  resolution: GraphResolution.ONE_DAY,
  persist: "never",
  lookback: 7,

  derive([input]) {
    const points = input?.points ?? [];
    const result: DataPoint[] = [];

    for (let i = 0; i < points.length; i++) {
      const window = points.slice(Math.max(0, i - 6), i + 1);
      const avg = window.reduce((s, p) => s + p.value, 0) / window.length;
      const pt = points[i];
      if (pt) {
        result.push({ timestamp: pt.timestamp, value: avg });
      }
    }

    return result;
  },
};
