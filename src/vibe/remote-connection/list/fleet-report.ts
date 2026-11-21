/**
 * Fleet health report for admins: every peer connection on this instance
 * (all owners) plus the audit trail in the requested window.
 * Reads stored DB state only. Never contacts a remote.
 */

import "server-only";

import { and, count, desc, eq, inArray, min, sql } from "drizzle-orm";

import { db } from "../../database";
import { users } from "../../identity/user/db";
import type { AnalyticsWindowInput } from "../../unified-ui/analytics/window";
import {
  fillBuckets,
  resolveAnalyticsWindow,
  serializeWindow,
} from "../../unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
} from "../../unified-ui/analytics/window-sql";
import { remoteConnectionAudit, RemoteConnectionAuditActionDB } from "../db";
import { type FleetConnection, loadFleetHealth } from "../health-summary";
import type { RemoteConnectionsListResponseOutput } from "./definition";
import { FleetStatusFilter, type FleetStatusFilterValue } from "./enum";

type FleetStatusValue = typeof FleetStatusFilterValue;

type FleetReport = NonNullable<RemoteConnectionsListResponseOutput["fleet"]>;

const FAILURE_ACTIONS = ["denied", "rate_limited"] as const;
const RECENT_LIMIT = 12;
const REASON_LIMIT = 12;

function matchesFilter(
  conn: FleetConnection,
  filter: FleetStatusValue | undefined,
): boolean {
  switch (filter) {
    case FleetStatusFilter.UNHEALTHY:
      return (
        conn.health.status === "critical" || conn.health.status === "warning"
      );
    case FleetStatusFilter.CRITICAL:
      return conn.health.status === "critical";
    case FleetStatusFilter.WARNING:
      return conn.health.status === "warning";
    case FleetStatusFilter.DISCONNECTED:
      return conn.health.status === "disconnected";
    case FleetStatusFilter.HEALTHY:
      return conn.health.status === "healthy";
    default:
      return true;
  }
}

const iso = (d: Date | null): string | null => d?.toISOString() ?? null;

export async function buildFleetReport(params: {
  viewerUserId: string;
  selfInstanceId: string;
  window: AnalyticsWindowInput;
  fleetStatus: FleetStatusValue | undefined;
}): Promise<FleetReport> {
  const [floorRow] = await db
    .select({ first: min(remoteConnectionAudit.createdAt) })
    .from(remoteConnectionAudit);
  const win = resolveAnalyticsWindow(
    params.window,
    new Date(),
    floorRow?.first ?? null,
  );
  const failureWhere = inArray(remoteConnectionAudit.action, [
    ...FAILURE_ACTIONS,
  ]);

  const [
    fleet,
    eventsNow,
    eventsPrev,
    failNow,
    failPrev,
    trendRows,
    reasons,
    recent,
  ] = await Promise.all([
    loadFleetHealth(),
    db
      .select({ n: count() })
      .from(remoteConnectionAudit)
      .where(inWindowSql(remoteConnectionAudit.createdAt, win)),
    db
      .select({ n: count() })
      .from(remoteConnectionAudit)
      .where(inPreviousWindowSql(remoteConnectionAudit.createdAt, win)),
    db
      .select({ n: count() })
      .from(remoteConnectionAudit)
      .where(
        and(inWindowSql(remoteConnectionAudit.createdAt, win), failureWhere),
      ),
    db
      .select({ n: count() })
      .from(remoteConnectionAudit)
      .where(
        and(
          inPreviousWindowSql(remoteConnectionAudit.createdAt, win),
          failureWhere,
        ),
      ),
    db
      .select({
        bucket: bucketSql(remoteConnectionAudit.createdAt, win.bucket),
        action: remoteConnectionAudit.action,
        value: count(),
      })
      .from(remoteConnectionAudit)
      .where(inWindowSql(remoteConnectionAudit.createdAt, win))
      .groupBy(sql`1`, remoteConnectionAudit.action),
    db
      .select({
        key: sql<string>`${remoteConnectionAudit.action} || coalesce(':' || ${remoteConnectionAudit.reason}, '')`,
        value: count(),
      })
      .from(remoteConnectionAudit)
      .where(inWindowSql(remoteConnectionAudit.createdAt, win))
      .groupBy(sql`1`)
      .orderBy(desc(count()))
      .limit(REASON_LIMIT),
    db
      .select({
        id: remoteConnectionAudit.id,
        createdAt: remoteConnectionAudit.createdAt,
        action: remoteConnectionAudit.action,
        reason: remoteConnectionAudit.reason,
        instanceId: remoteConnectionAudit.instanceId,
        ownerEmail: users.email,
      })
      .from(remoteConnectionAudit)
      .innerJoin(users, eq(users.id, remoteConnectionAudit.userId))
      .where(inWindowSql(remoteConnectionAudit.createdAt, win))
      .orderBy(desc(remoteConnectionAudit.createdAt))
      .limit(RECENT_LIMIT),
  ]);

  const all = fleet.connections;
  const tally = (status: FleetConnection["health"]["status"]): number =>
    all.reduce((n, c) => (c.health.status === status ? n + 1 : n), 0);
  const warning = tally("warning");
  const critical = tally("critical");
  const hasPrevious = win.previousFrom !== null;

  return {
    window: serializeWindow(win),
    localCapabilitiesVersion: fleet.localCapabilitiesVersion,
    selfInstanceId: params.selfInstanceId,
    counts: {
      total: all.length,
      active: all.reduce((n, c) => (c.isActive ? n + 1 : n), 0),
      healthy: tally("healthy"),
      warning,
      critical,
      disconnected: tally("disconnected"),
      unhealthy: warning + critical,
    },
    rows: all
      .filter((c) => matchesFilter(c, params.fleetStatus))
      .map((c) => ({
        id: c.id,
        instanceId: c.instanceId,
        ownerUserId: c.userId,
        ownerEmail: c.ownerEmail,
        ownerName: c.ownerName,
        ownerIsAdmin: c.ownerIsAdmin,
        isMine: c.userId === params.viewerUserId,
        remoteUrl: c.remoteUrl,
        status: c.health.status,
        issues: c.health.issues,
        isActive: c.isActive,
        isReverseEntry: c.isReverseEntry,
        hasToken: c.hasToken,
        transportMode: c.transportMode,
        remoteTransportMode: c.remoteTransportMode,
        lastTransportUsed: c.lastTransportUsed,
        lastTransportUsedAt: iso(c.lastTransportUsedAt),
        wsConnectedAt: iso(c.wsConnectedAt),
        lastSyncedAt: iso(c.lastSyncedAt),
        lastContactAt: iso(c.lastContactAt),
        lastDisconnectAt: iso(c.lastDisconnectAt),
        capabilitiesCount: c.capabilitiesCount,
        capabilitiesVersion: c.capabilitiesVersion,
        sentCapabilitiesVersion: c.sentCapabilitiesVersion,
        isInferenceProvider: c.isInferenceProvider,
        forceSystemProvider: c.forceSystemProvider,
        syncScope: c.syncScope,
        loopLocation: c.loopLocation,
        createdAt: c.createdAt.toISOString(),
        pairedPeer: c.pairedPeer,
        lastDenial: c.lastDenial
          ? { ...c.lastDenial, createdAt: c.lastDenial.createdAt.toISOString() }
          : null,
      })),
    audit: {
      events: {
        value: eventsNow[0]?.n ?? 0,
        previous: hasPrevious ? (eventsPrev[0]?.n ?? 0) : null,
      },
      failures: {
        value: failNow[0]?.n ?? 0,
        previous: hasPrevious ? (failPrev[0]?.n ?? 0) : null,
      },
      trend: {
        buckets: win.buckets,
        series: RemoteConnectionAuditActionDB.map((action) => ({
          key: action,
          values: fillBuckets(
            win.buckets,
            trendRows
              .filter((r) => r.action === action)
              .map((r) => ({ bucket: r.bucket, value: r.value })),
          ),
        })).filter((s) => s.values.some((v) => v > 0)),
      },
      byReason: reasons.map((r) => ({
        key: r.key,
        metrics: { events: r.value },
      })),
      recent: recent.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    },
  };
}
