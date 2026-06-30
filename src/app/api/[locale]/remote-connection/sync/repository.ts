/**
 * Sync Repository
 * Cursor-based sync of cortex nodes, skills, favorites, and threads between instances.
 * Pull-on-connect + WS push events for real-time updates.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { SyncCursor } from "@/app/api/[locale]/remote-connection/db";
import {
  RemoteToolCapabilitySchema,
  StandardSyncCursorSchema,
  ThreadsSyncCursorSchema,
} from "@/app/api/[locale]/remote-connection/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

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
      await import("@/app/api/[locale]/system/generated/remote-capabilities/version").catch(
        () => ({ CAPABILITIES_VERSION: "unknown" }),
      );
    return CAPABILITIES_VERSION;
  }

  /**
   * Resolve the user's role slug (admin/customer/public) for capability loading.
   */
  private static async getUserRoleSlug(
    userId: string,
  ): Promise<"admin" | "customer" | "public"> {
    const { userRoles: userRolesTable } =
      await import("@/app/api/[locale]/user/db");
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
        ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/admin.json").catch(
            () => null,
          )
        : roleSlug === "customer"
          ? await import("@/app/api/[locale]/system/generated/remote-capabilities/en/customer.json").catch(
              () => null,
            )
          : await import("@/app/api/[locale]/system/generated/remote-capabilities/en/public.json").catch(
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
      await import("@/app/api/[locale]/remote-connection/repository");
    const { remoteConnections: connTable } =
      await import("@/app/api/[locale]/remote-connection/db");
    const { buildSyncPayloads } =
      await import("@/app/api/[locale]/remote-connection/sync/provider");

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
    // null syncScope = no allowlist configured → all domains enabled (open connection).
    const syncScope = connRow?.syncScope;
    const domainEnabled = (domain: string): boolean => {
      if (!syncScope) {
        return true;
      }
      return (
        (domain === "memories" && !!syncScope.memories) ||
        (domain === "documents" && !!syncScope.documents) ||
        (domain === "skills" && !!syncScope.skills) ||
        (domain === "favorites" && !!syncScope.favorites) ||
        (domain === "threads" && !!syncScope.threads)
      );
    };

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
        const scopedPushed: Record<string, string> = {};
        for (const [domain, payload] of Object.entries(pushed)) {
          if (domainEnabled(domain)) {
            scopedPushed[domain] = payload;
          }
        }
        if (Object.keys(scopedPushed).length > 0) {
          const { applySyncPayloads } =
            await import("@/app/api/[locale]/remote-connection/sync/provider");
          const counts = await applySyncPayloads(scopedPushed, user.id, logger);
          logger.debug("Applied pushed payloads", { instanceId, counts });
        }
      } catch (error) {
        logger.warn("Failed to apply pushed payloads", parseError(error));
      }
    }
    markPhase("applyPush");

    // Filter cursors to only enabled domains
    const filteredCursors: Record<string, SyncCursor> = {};
    for (const [domain, cursor] of Object.entries(incomingCursors)) {
      if (domainEnabled(domain)) {
        filteredCursors[domain] = cursor;
      }
    }

    const { syncPayloads, syncCounts, ourCursors } = await buildSyncPayloads(
      filteredCursors,
      user.id,
      logger,
    );
    markPhase("serialize");
    const totalPhaseMs = Object.values(phaseMs).reduce((a, b) => a + b, 0);
    if (totalPhaseMs > 5_000) {
      logger.warn("Slow sync exchange", { instanceId, totalPhaseMs, phaseMs });
    }

    // Filter payloads to only enabled domains
    const filteredPayloads: Record<string, string> = {};
    const filteredCounts: Record<string, number> = {};
    const filteredCursorResponse: Record<string, SyncCursor> = {};

    for (const key of Object.keys(syncPayloads)) {
      if (domainEnabled(key)) {
        filteredPayloads[key] = syncPayloads[key] ?? "[]";
        filteredCounts[key] = syncCounts[key] ?? 0;
        filteredCursorResponse[key] = ourCursors[key]!;
      }
    }

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
