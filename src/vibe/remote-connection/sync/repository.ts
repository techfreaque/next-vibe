/**
 * Sync Repository
 * Cursor-based sync of cortex nodes, skills, favorites, and threads between instances.
 * Pull-on-connect + WS push events for real-time updates.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import {
  type CountryLanguage,
  defaultLocale,
} from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { JwtPayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import { z } from "zod";

import type { SyncCursor } from "../db";
import {
  RemoteToolCapabilitySchema,
  StandardSyncCursorSchema,
  ThreadsSyncCursorSchema,
} from "../db";
import type { SyncRequestOutput, SyncResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const syncCursorSchema = z.union([
  StandardSyncCursorSchema,
  ThreadsSyncCursorSchema,
]);

/**
 * One sync exchange per connection at a time. Connect-time pull and any
 * explicit pull share this registry — a second caller skips instead of
 * running a duplicate exchange concurrently.
 */
const inFlightSyncs = new Set<string>();

export function claimSyncSlot(key: string): boolean {
  if (inFlightSyncs.has(key)) {
    return false;
  }
  inFlightSyncs.add(key);
  return true;
}

export function releaseSyncSlot(key: string): void {
  inFlightSyncs.delete(key);
}

/** True while a sync exchange for this connection is in flight (test-settle probes). */
export function isSyncSlotBusy(key: string): boolean {
  return inFlightSyncs.has(key);
}

/**
 * Force-clear a sync slot, e.g. when a connection is closed while a pull is in flight.
 * The abandoned in-flight pull will hit releaseSyncSlot() in its finally block — that's
 * a harmless no-op since the key won't be present. The new connection can now claim
 * the slot immediately without waiting for the abandoned pull to finish.
 */
export function forceReleaseSyncSlot(key: string): void {
  inFlightSyncs.delete(key);
}

export class TaskSyncRepository {
  /**
   * Load the capabilities version constant from the generated file.
   */
  private static async getCapabilitiesVersion(): Promise<string> {
    const { CAPABILITIES_VERSION } =
      await import("@/generated/remote-capabilities/version").catch(() => ({
        CAPABILITIES_VERSION: "unknown",
      }));
    return CAPABILITIES_VERSION;
  }

  /**
   * Resolve the user's role slug (admin/customer/public) for capability loading.
   */
  private static async getUserRoleSlug(
    userId: string,
  ): Promise<"admin" | "customer" | "public"> {
    const { userRoles: userRolesTable } =
      await import("../../identity/user/db");
    const userRoleRows = await db
      .select({ role: userRolesTable.role })
      .from(userRolesTable)
      .where(eq(userRolesTable.userId, userId));
    const roles = userRoleRows.map((r) => r.role);
    return roles.includes(UserPermissionRole.ADMIN)
      ? "admin"
      : roles.includes(UserPermissionRole.CUSTOMER)
        ? "customer"
        : "public";
  }

  /**
   * Load capabilities JSON for a given role. Returns parsed + validated array, or null.
   */
  private static async loadCapabilities(
    roleSlug: "admin" | "customer" | "public",
  ): Promise<z.infer<typeof RemoteToolCapabilitySchema>[] | null> {
    const capFileImport =
      roleSlug === "admin"
        ? await import("@/generated/remote-capabilities/en/admin.json").catch(
            () => null,
          )
        : roleSlug === "customer"
          ? await import("@/generated/remote-capabilities/en/customer.json").catch(
              () => null,
            )
          : await import("@/generated/remote-capabilities/en/public.json").catch(
              () => null,
            );
    if (!capFileImport) {
      return null;
    }
    return z.array(RemoteToolCapabilitySchema).parse(capFileImport.default);
  }

  /**
   * Build the remote API URL for an endpoint from its definition path.
   */
  private static buildRemoteEndpointUrl(
    remoteBaseUrl: string,
    endpoint: CreateApiEndpointAny,
  ): string {
    return `${remoteBaseUrl}/api/${defaultLocale}/${endpoint.path.join("/")}`;
  }

  /**
   * Cursor-based sync handler — server side.
   *
   * Protocol:
   * 1. Local sends: syncCursors (per-domain), capabilitiesVersion, capabilitiesJson (if changed)
   * 2. Server returns: syncPayloads (records newer than cursors), remoteCursors (server's current state),
   *    syncCounts, capabilities (if diff), serverTime
   */
  static async syncTasks(
    data: SyncRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): Promise<ResponseType<SyncResponseOutput>> {
    const { t: syncT } = scopedTranslation.scopedT(locale);

    if (user.isPublic || !user.id) {
      return fail({
        message: syncT("taskSync.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const { RemoteConnectionRepository: RemoteRepoReport } =
      await import("../repository");
    const { remoteConnections: connTable } = await import("../db");
    const { buildSyncPayloads } = await import("./provider");

    // Find the connection record for this user
    const conditions = [
      eq(connTable.userId, user.id),
      eq(connTable.isActive, true),
    ];
    if (data.instanceId) {
      conditions.push(eq(connTable.instanceId, data.instanceId));
    }
    const [connRow] = await db
      .select()
      .from(connTable)
      .where(and(...conditions))
      .limit(1);

    const instanceId = connRow?.instanceId ?? data.instanceId ?? "unknown";

    // Phase timings: exchanges over 5s are logged with a per-phase breakdown
    // so slow syncs are diagnosable from the server log.
    const phaseMs: Record<string, number> = {};
    let phaseStart = Date.now();
    const markPhase = (name: string): void => {
      phaseMs[name] = Date.now() - phaseStart;
      phaseStart = Date.now();
    };

    // ── 1. Process incoming capability snapshot + always touch lastSyncedAt ────
    // touchLastSynced is called unconditionally so tests can poll lastSyncedAt to
    // confirm a sync completed. Capabilities opts are merged in only when version changed.
    let capabilityOpts:
      | {
          capabilities: z.infer<typeof RemoteToolCapabilitySchema>[];
          capabilitiesVersion?: string;
        }
      | undefined;
    if (data.capabilitiesJson) {
      try {
        let capabilities: z.infer<typeof RemoteToolCapabilitySchema>[];
        if (typeof data.capabilitiesJson === "string") {
          capabilities = z
            .array(RemoteToolCapabilitySchema)
            .parse(JSON.parse(data.capabilitiesJson));
        } else if (Array.isArray(data.capabilitiesJson)) {
          capabilities = z
            .array(RemoteToolCapabilitySchema)
            .parse(data.capabilitiesJson);
        } else {
          capabilities = [];
        }
        const incomingVersion =
          data.senderCapabilitiesVersion ?? data.capabilitiesVersion;
        const storedVersion = connRow?.capabilitiesVersion;
        if (storedVersion !== incomingVersion) {
          capabilityOpts = {
            capabilities,
            capabilitiesVersion: incomingVersion,
          };
          logger.debug("Stored updated capability snapshot", {
            instanceId,
            version: incomingVersion,
            count: capabilities.length,
          });
        }
      } catch (error) {
        logger.warn("Failed to store capabilities snapshot", parseError(error));
      }
    }
    await RemoteRepoReport.touchLastSynced(user.id, instanceId, capabilityOpts);
    markPhase("capabilities");

    // ── 2. Parse incoming cursors ─────────────────────────────────────────────
    // Accept null cursor values (meaning "no cursor — return full domain")
    const incomingCursorsSchema = z
      .record(z.string(), syncCursorSchema.nullable())
      .transform((rec) => {
        const out: Record<string, SyncCursor> = {};
        for (const [k, v] of Object.entries(rec)) {
          if (v !== null) {
            out[k] = v;
          }
        }
        return out;
      });
    let incomingCursors: Record<string, SyncCursor> = {};
    if (data.syncCursors) {
      if (typeof data.syncCursors === "string") {
        incomingCursors = incomingCursorsSchema.parse(
          JSON.parse(data.syncCursors),
        );
      } else {
        incomingCursors = incomingCursorsSchema.parse(data.syncCursors);
      }
    }

    // ── 3. Build payloads for enabled domains only ────────────────────────────
    // null syncScope = no allowlist configured → all domains enabled (open
    // connection). The scope is passed to buildSyncPayloads/applySyncPayloads,
    // which gate each domain through the typed isSyncDomainEnabled helper — the
    // serve + apply sides are the authoritative scope gates.
    const syncScope = connRow?.syncScope ?? null;

    // ── 2b. Apply pushed payloads BEFORE serializing the response ────────────
    // Bidirectional push-pull in one round trip (sync/spec.md): the caller's
    // changes land first, then we serialize ours. Scope is enforced on the
    // serving side too — disabled domains are dropped.
    if (data.pushPayloads) {
      try {
        const pushedSchema = z.record(z.string(), z.string());
        const pushed: Record<string, string> =
          typeof data.pushPayloads === "string"
            ? pushedSchema.parse(JSON.parse(data.pushPayloads))
            : pushedSchema.parse(data.pushPayloads);
        // applySyncPayloads gates each domain by the typed syncScope — disabled
        // domains are dropped inside the provider dispatch, so a mis-scoped peer
        // can never land a disabled domain in our DB.
        const { applySyncPayloads } = await import("./provider");
        const counts = await applySyncPayloads(
          pushed,
          user.id,
          logger,
          syncScope,
        );
        logger.debug("Applied pushed payloads", { instanceId, counts });
      } catch (error) {
        logger.warn("Failed to apply pushed payloads", parseError(error));
      }
    }
    markPhase("applyPush");

    let syncPayloads;
    let syncCounts;
    let ourCursors;
    try {
      // buildSyncPayloads serves ONLY the domains enabled in the typed syncScope
      // (absent-cursor "full history" for a disabled domain is never served).
      ({ syncPayloads, syncCounts, ourCursors } = await buildSyncPayloads(
        incomingCursors,
        user.id,
        logger,
        syncScope,
      ));
    } catch (buildErr) {
      logger.error("[Sync] buildSyncPayloads threw", parseError(buildErr));
      return fail({
        message: syncT("taskSync.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    markPhase("serialize");
    const totalPhaseMs = Object.values(phaseMs).reduce((a, b) => a + b, 0);
    if (totalPhaseMs > 5_000) {
      logger.warn("Slow sync exchange", { instanceId, totalPhaseMs, phaseMs });
    }

    // buildSyncPayloads already served ONLY the scope-enabled domains, so its
    // output maps ARE the scoped response — no second filtering pass needed.
    const filteredPayloads = syncPayloads;
    const filteredCounts = syncCounts;
    const filteredCursorResponse = ourCursors;

    // ── 4. Build capabilities payload (only if version differs) ───────────────
    let capabilitiesPayload: string | null = null;
    const CAPABILITIES_VERSION =
      await TaskSyncRepository.getCapabilitiesVersion();

    const capVersionDiffers = data.capabilitiesVersion !== CAPABILITIES_VERSION;

    if (capVersionDiffers) {
      const roleSlug = await TaskSyncRepository.getUserRoleSlug(user.id);
      const caps = await TaskSyncRepository.loadCapabilities(roleSlug);
      if (caps) {
        capabilitiesPayload = JSON.stringify(caps);
      }
    }

    const serverTime = new Date();

    return success({
      syncPayloads: filteredPayloads,
      syncCounts: filteredCounts,
      remoteCursors: filteredCursorResponse,
      remoteCapabilitiesVersion: CAPABILITIES_VERSION,
      capabilities: capabilitiesPayload,
      serverTime,
    });
  }
}
