/**
 * Leads Domain — Vibe Sense Indicators
 *
 * Exports time-series indicators for the leads domain.
 * Auto-discovered by the Vibe Sense registry at startup.
 */

import "server-only";

import { and, count, eq, gte, lt, lte, notInArray, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import type { DataPoint } from "../system/unified-interface/vibe-sense/indicators/types";
import type {
  DerivedIndicator,
  Indicator,
} from "../system/unified-interface/vibe-sense/indicators/types";
import { emailCampaigns, leadEngagements, leads } from "./db";
import { LeadStatus } from "./enum";
import { GraphResolution } from "../system/unified-interface/vibe-sense/enum";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Truncate a date to day boundary (UTC midnight) for daily bucketing.
 */
function truncateToDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

/**
 * Generate all day buckets in [from, to) range.
 */
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

// ─── leads.created ────────────────────────────────────────────────────────────

/**
 * Number of new leads created per day.
 * Buckets by createdAt date. Source indicator — queries leads table directly.
 */
export const leadsCreated: Indicator = {
  id: "leads.created",
  description: "Number of new leads created per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${leads.createdAt})`.as("day"),
        cnt: count(),
      })
      .from(leads)
      .where(and(gte(leads.createdAt, from), lte(leads.createdAt, to)))
      .groupBy(sql`date_trunc('day', ${leads.createdAt})`)
      .orderBy(sql`date_trunc('day', ${leads.createdAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── leads.converted ──────────────────────────────────────────────────────────

/**
 * Number of leads converted to users per day.
 * Buckets by convertedAt date.
 */
export const leadsConverted: Indicator = {
  id: "leads.converted",
  description: "Number of leads converted to users per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${leads.convertedAt})`.as("day"),
        cnt: count(),
      })
      .from(leads)
      .where(
        and(
          gte(leads.convertedAt, from),
          lte(leads.convertedAt, to),
          eq(leads.status, LeadStatus.SIGNED_UP),
        ),
      )
      .groupBy(sql`date_trunc('day', ${leads.convertedAt})`)
      .orderBy(sql`date_trunc('day', ${leads.convertedAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── leads.active ─────────────────────────────────────────────────────────────

/**
 * Total active leads (not bounced, not unsubscribed, not invalid) — snapshot per day.
 * Walks day buckets, counting leads with status not in terminal states.
 */
export const leadsActive: Indicator = {
  id: "leads.active",
  description: "Total active lead count (snapshot per day)",
  resolution: GraphResolution.ONE_DAY,
  persist: "snapshot",

  async query({ from, to }) {
    // Count all leads created before each day bucket that are still active
    const buckets = dayBuckets(from, to);
    const points: DataPoint[] = [];

    for (const bucket of buckets) {
      const next = new Date(bucket);
      next.setUTCDate(next.getUTCDate() + 1);

      const [row] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(
          and(
            lt(leads.createdAt, next),
            notInArray(leads.status, [
              LeadStatus.BOUNCED,
              LeadStatus.UNSUBSCRIBED,
              LeadStatus.INVALID,
            ]),
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

// ─── leads.bounced ────────────────────────────────────────────────────────────

/**
 * Number of leads that bounced per day.
 */
export const leadsBounced: Indicator = {
  id: "leads.bounced",
  description: "Number of lead email bounces per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${leads.bouncedAt})`.as("day"),
        cnt: count(),
      })
      .from(leads)
      .where(and(gte(leads.bouncedAt, from), lte(leads.bouncedAt, to)))
      .groupBy(sql`date_trunc('day', ${leads.bouncedAt})`)
      .orderBy(sql`date_trunc('day', ${leads.bouncedAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── leads.engagements ────────────────────────────────────────────────────────

/**
 * Total lead engagement events per day (opens + clicks).
 */
export const leadsEngagements: Indicator = {
  id: "leads.engagements",
  description: "Total lead engagement events (opens + clicks) per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${leadEngagements.timestamp})`.as(
          "day",
        ),
        cnt: count(),
      })
      .from(leadEngagements)
      .where(
        and(
          gte(leadEngagements.timestamp, from),
          lte(leadEngagements.timestamp, to),
        ),
      )
      .groupBy(sql`date_trunc('day', ${leadEngagements.timestamp})`)
      .orderBy(sql`date_trunc('day', ${leadEngagements.timestamp})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── leads.emails_sent ────────────────────────────────────────────────────────

/**
 * Number of campaign emails sent per day.
 */
export const leadsEmailsSent: Indicator = {
  id: "leads.emails_sent",
  description: "Number of campaign emails sent per day",
  resolution: GraphResolution.ONE_DAY,
  persist: "always",
  retention: { maxAgeDays: 365 },

  async query({ from, to }) {
    const rows = await db
      .select({
        day: sql<string>`date_trunc('day', ${emailCampaigns.sentAt})`.as("day"),
        cnt: count(),
      })
      .from(emailCampaigns)
      .where(
        and(gte(emailCampaigns.sentAt, from), lte(emailCampaigns.sentAt, to)),
      )
      .groupBy(sql`date_trunc('day', ${emailCampaigns.sentAt})`)
      .orderBy(sql`date_trunc('day', ${emailCampaigns.sentAt})`);

    return rows.map(
      (r): DataPoint => ({
        timestamp: new Date(r.day),
        value: Number(r.cnt),
      }),
    );
  },
};

// ─── leads.created_ma7 ────────────────────────────────────────────────────────

/**
 * 7-day moving average of leads created.
 * Derived from leads.created with lookback: 7.
 */
export const leadsCreatedMA7: DerivedIndicator = {
  id: "leads.created_ma7",
  description: "7-day moving average of new leads",
  inputs: ["leads.created"],
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
