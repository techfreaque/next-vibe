/**
 * Remote connection health (single source for "unhealthy").
 * Reads stored state only: never contacts a remote.
 * Used by the connection health report (list/) and the admin business overview.
 */

import "server-only";

import { desc, eq, inArray, max, ne, or, sql } from "drizzle-orm";

import { CAPABILITIES_VERSION } from "@/generated/remote-capabilities/version";

import { db } from "../database";
import { UserPermissionRole } from "../identity/roles/enum";
import { userRoles, users } from "../identity/user/db";
import type { ConnectionHealth, SyncScope, TransportMode } from "./db";
import {
  remoteConnectionAudit,
  type RemoteConnectionAuditAction,
  remoteConnections,
} from "./db";
import type { ConnectionIssue } from "./health-types";

/** Severity of each issue. Only critical/warning make an active row unhealthy. */
const ISSUE_SEVERITY: Record<ConnectionIssue, "critical" | "warning" | "info"> =
  {
    reauthRequired: "critical",
    inactive: "info",
    noToken: "critical",
    accessDenied: "critical",
    neverSynced: "warning",
    transportDrift: "warning",
    transportMismatch: "warning",
    peerToolsStale: "info",
  };

/** A denial counts as open for this long unless the peer got through since. */
export const OPEN_DENIAL_MS = 7 * 86_400_000;

export interface HealthInputRow {
  isActive: boolean;
  isReverseEntry: boolean;
  hasToken: boolean;
  lastSyncedAt: Date | null;
  transportMode: TransportMode;
  lastTransportUsed: TransportMode | null;
  sentCapabilitiesVersion: string | null;
  /** Latest denied / rate-limited audit event for this owner + instance. */
  lastDeniedAt?: Date | null;
  lastContactAt?: Date | null;
}

export interface HealthAssessment {
  status: ConnectionHealth;
  issues: ConnectionIssue[];
}

/**
 * Pure classifier. `pairMismatch` is decided by the caller (needs both rows).
 * Status: inactive -> disconnected; any critical issue -> critical;
 * any warning issue -> warning; else healthy.
 */
export function assessConnectionHealth(
  row: HealthInputRow,
  localCapabilitiesVersion: string,
  pairMismatch: boolean,
): HealthAssessment {
  const issues: ConnectionIssue[] = [];
  if (!row.isActive) {
    // Disconnect deletes the row; an inactive outbound row that still holds a
    // token exists only because the peer rejected the saved session: broken,
    // not a chosen disconnect.
    if (!row.isReverseEntry && row.hasToken) {
      return { status: "critical", issues: ["reauthRequired"] };
    }
    return { status: "disconnected", issues: ["inactive"] };
  }
  if (!row.hasToken) {
    issues.push("noToken");
  }
  if (!row.lastSyncedAt) {
    issues.push("neverSynced");
  }
  if (
    row.lastDeniedAt &&
    Date.now() - row.lastDeniedAt.getTime() < OPEN_DENIAL_MS &&
    (!row.lastContactAt || row.lastDeniedAt > row.lastContactAt)
  ) {
    issues.push("accessDenied");
  }
  if (row.lastTransportUsed && row.lastTransportUsed !== row.transportMode) {
    issues.push("transportDrift");
  }
  if (pairMismatch) {
    issues.push("transportMismatch");
  }
  if (
    !row.isReverseEntry &&
    row.sentCapabilitiesVersion !== localCapabilitiesVersion
  ) {
    issues.push("peerToolsStale");
  }
  const severities = issues.map((i) => ISSUE_SEVERITY[i]);
  const status: ConnectionHealth = severities.includes("critical")
    ? "critical"
    : severities.includes("warning")
      ? "warning"
      : "healthy";
  return { status, issues };
}

/** Self-identity rows (no peer) are not connections. */
export const isPeerRow = or(
  ne(remoteConnections.remoteUrl, ""),
  ne(remoteConnections.token, ""),
);

/** Stored fleet row plus its owner and assessment. */
export interface FleetConnection {
  id: string;
  userId: string;
  ownerEmail: string;
  ownerName: string;
  /** Owner holds the admin role: the peer acts with admin rights here. */
  ownerIsAdmin: boolean;
  instanceId: string;
  remoteUrl: string;
  remoteUserId: string | null;
  isActive: boolean;
  isReverseEntry: boolean;
  hasToken: boolean;
  isInferenceProvider: boolean;
  forceSystemProvider: boolean;
  transportMode: TransportMode;
  remoteTransportMode: TransportMode;
  lastTransportUsed: TransportMode | null;
  lastTransportUsedAt: Date | null;
  wsConnectedAt: Date | null;
  lastSyncedAt: Date | null;
  lastContactAt: Date | null;
  capabilitiesCount: number;
  capabilitiesVersion: string | null;
  sentCapabilitiesVersion: string | null;
  syncScope: SyncScope;
  loopLocation: "target" | "caller";
  createdAt: Date;
  /** The other side's row, when both live in this DB. */
  /** Latest "disconnected" audit event for this owner + instance. */
  lastDisconnectAt: Date | null;
  lastDenial: {
    action: RemoteConnectionAuditAction;
    reason: string | null;
    createdAt: Date;
  } | null;
  pairedPeer: {
    instanceId: string;
    transportMode: TransportMode;
    remoteTransportMode: TransportMode;
  } | null;
  health: HealthAssessment;
}

const STATUS_RANK: Record<ConnectionHealth, number> = {
  critical: 0,
  warning: 1,
  disconnected: 2,
  healthy: 3,
};

function latest(dates: ReadonlyArray<Date | null>): Date | null {
  let best: Date | null = null;
  for (const d of dates) {
    if (d && (!best || d > best)) {
      best = d;
    }
  }
  return best;
}

/**
 * Every peer connection on this instance (all owners), assessed and sorted:
 * critical, warning, disconnected, healthy; newest contact first within a status.
 * Both sides' rows only meet here when they live in the same DB: those pairs
 * (A.remoteUserId = B.userId and back) are checked for transport mismatch.
 */
export async function loadFleetHealth(): Promise<{
  connections: FleetConnection[];
  localCapabilitiesVersion: string;
}> {
  const rows = await db
    .select({
      id: remoteConnections.id,
      userId: remoteConnections.userId,
      ownerEmail: users.email,
      ownerName: users.publicName,
      ownerIsAdmin: sql<boolean>`exists (select 1 from ${userRoles} where ${userRoles.userId} = ${remoteConnections.userId} and ${userRoles.role} = ${UserPermissionRole.ADMIN})`,
      instanceId: remoteConnections.instanceId,
      remoteUrl: remoteConnections.remoteUrl,
      remoteUserId: remoteConnections.remoteUserId,
      isActive: remoteConnections.isActive,
      isReverseEntry: remoteConnections.isReverseEntry,
      hasToken: sql<boolean>`${remoteConnections.token} <> ''`,
      isInferenceProvider: remoteConnections.isInferenceProvider,
      forceSystemProvider: remoteConnections.forceSystemProvider,
      transportMode: remoteConnections.transportMode,
      remoteTransportMode: remoteConnections.remoteTransportMode,
      lastTransportUsed: remoteConnections.lastTransportUsed,
      lastTransportUsedAt: remoteConnections.lastTransportUsedAt,
      wsConnectedAt: remoteConnections.wsConnectedAt,
      lastSyncedAt: remoteConnections.lastSyncedAt,
      capabilitiesCount: sql<number>`coalesce(jsonb_array_length(${remoteConnections.capabilities}), 0)::int`,
      capabilitiesVersion: remoteConnections.capabilitiesVersion,
      sentCapabilitiesVersion: remoteConnections.sentCapabilitiesVersion,
      syncScope: remoteConnections.syncScope,
      loopLocation: remoteConnections.loopLocation,
      createdAt: remoteConnections.createdAt,
    })
    .from(remoteConnections)
    .innerJoin(users, eq(users.id, remoteConnections.userId))
    .where(isPeerRow);
  // A (re)registration is contact too: the peer reached us with credentials.
  const registrations = await db
    .select({
      userId: remoteConnectionAudit.userId,
      instanceId: remoteConnectionAudit.instanceId,
      at: max(remoteConnectionAudit.createdAt),
    })
    .from(remoteConnectionAudit)
    .where(
      inArray(remoteConnectionAudit.action, ["registered", "reregistered"]),
    )
    .groupBy(remoteConnectionAudit.userId, remoteConnectionAudit.instanceId);
  const disconnects = await db
    .select({
      userId: remoteConnectionAudit.userId,
      instanceId: remoteConnectionAudit.instanceId,
      at: max(remoteConnectionAudit.createdAt),
    })
    .from(remoteConnectionAudit)
    .where(eq(remoteConnectionAudit.action, "disconnected"))
    .groupBy(remoteConnectionAudit.userId, remoteConnectionAudit.instanceId);
  const denials = await db
    .selectDistinctOn(
      [remoteConnectionAudit.userId, remoteConnectionAudit.instanceId],
      {
        userId: remoteConnectionAudit.userId,
        instanceId: remoteConnectionAudit.instanceId,
        action: remoteConnectionAudit.action,
        reason: remoteConnectionAudit.reason,
        createdAt: remoteConnectionAudit.createdAt,
      },
    )
    .from(remoteConnectionAudit)
    .where(inArray(remoteConnectionAudit.action, ["denied", "rate_limited"]))
    .orderBy(
      remoteConnectionAudit.userId,
      remoteConnectionAudit.instanceId,
      desc(remoteConnectionAudit.createdAt),
    );

  const connections: FleetConnection[] = rows.map((r) => {
    const peer = r.remoteUserId
      ? rows.find(
          (o) =>
            o.id !== r.id &&
            o.userId === r.remoteUserId &&
            o.remoteUserId === r.userId,
        )
      : undefined;
    const pairMismatch =
      peer !== undefined &&
      r.isActive &&
      peer.isActive &&
      (r.transportMode !== peer.remoteTransportMode ||
        r.remoteTransportMode !== peer.transportMode);
    const registeredAt =
      registrations.find(
        (g) => g.userId === r.userId && g.instanceId === r.instanceId,
      )?.at ?? null;
    const lastContactAt = latest([
      r.wsConnectedAt,
      r.lastSyncedAt,
      r.lastTransportUsedAt,
      registeredAt,
    ]);
    const denial = denials.find(
      (d) => d.userId === r.userId && d.instanceId === r.instanceId,
    );
    const lastDisconnectAt =
      disconnects.find(
        (g) => g.userId === r.userId && g.instanceId === r.instanceId,
      )?.at ?? null;
    return {
      ...r,
      lastContactAt,
      lastDisconnectAt,
      lastDenial: denial
        ? {
            action: denial.action,
            reason: denial.reason,
            createdAt: denial.createdAt,
          }
        : null,
      pairedPeer: peer
        ? {
            instanceId: peer.instanceId,
            transportMode: peer.transportMode,
            remoteTransportMode: peer.remoteTransportMode,
          }
        : null,
      health: assessConnectionHealth(
        {
          ...r,
          lastDeniedAt: denial?.createdAt ?? null,
          lastContactAt,
        },
        CAPABILITIES_VERSION,
        pairMismatch,
      ),
    };
  });

  connections.sort((a, b) => {
    const rank = STATUS_RANK[a.health.status] - STATUS_RANK[b.health.status];
    if (rank !== 0) {
      return rank;
    }
    return (
      (b.lastContactAt?.getTime() ?? 0) - (a.lastContactAt?.getTime() ?? 0)
    );
  });
  return { connections, localCapabilitiesVersion: CAPABILITIES_VERSION };
}

/** Count of connections that are not healthy (warning, critical, disconnected). */
/** Assess one stored row (no pairing: pairs need the whole fleet). */
export function assessStoredConnection(row: {
  isActive: boolean;
  isReverseEntry: boolean;
  token: string;
  lastSyncedAt: Date | null;
  transportMode: TransportMode;
  lastTransportUsed: TransportMode | null;
  sentCapabilitiesVersion: string | null;
}): HealthAssessment {
  return assessConnectionHealth(
    { ...row, hasToken: row.token.length > 0 },
    CAPABILITIES_VERSION,
    false,
  );
}

export async function getUnhealthyConnectionCount(): Promise<number> {
  const { connections } = await loadFleetHealth();
  return connections.filter((c) => c.health.status !== "healthy").length;
}
