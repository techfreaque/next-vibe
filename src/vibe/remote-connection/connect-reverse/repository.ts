/**
 * Remote Connection Register Repository
 *
 * Cloud-side: stores the local instance's info so the cloud knows which local
 * instances are connected per user. Called during the local connect flow.
 *
 * Also upserts the cloud's own self-identity record (if not already set for that user)
 * so `getLocalInstanceId()` returns the cloud's own instanceId on cloud instances.
 *
 * Collision detection: if instanceId already exists for this user → CONFLICT.
 * The unique constraint (userId, instanceId) on remote_connections enforces
 * this at DB level too, but we check first for a clear error message.
 */

import "server-only";

import { and, eq } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../core/route/response.schema";
import { db } from "../../database";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { instanceIdentities, remoteConnections, SyncScopeSchema } from "../db";
import { RemoteConnectionRepository } from "../repository";
import { RemoteTransport } from "../transport";
import type { RemoteRegisterPostRequestInput } from "./definition";
import type { RemoteRegisterT } from "./i18n";

export class RemoteConnectionRegisterRepository {
  /**
   * Probe a localUrl to decide whether the peer is directly reachable over HTTP.
   *
   * This is the transport-detection bootstrap: its result SETS the connection's
   * transportMode (direct-http vs reverse-ws). It therefore cannot go through the
   * transport-resolving remote-call path (runInProcessTyped) — there is no
   * connection/instanceId yet, and this probe is what decides the leg that path
   * will later pick. A minimal authenticated GET to the peer's health endpoint is
   * the irreducible primitive here.
   *
   * Returns true if the remote responds (even with an error), false on network
   * failure.
   */
  static async checkDirectAccessibility(
    localUrl: string | null | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
    token?: string,
    leadId?: string,
  ): Promise<boolean> {
    if (!localUrl || !token || !leadId) {
      return false;
    }
    const healthDef = await import("../../platforms/web/health/definition");
    // Deliberate over-the-wire reachability probe — the point is to prove the URL
    // is directly reachable, so it must go over HTTP (not runInProcessTyped, which
    // runs in-process and proves nothing).
    const { status, networkError } = await RemoteTransport.callEndpointDirect({
      connection: { remoteUrl: localUrl, token, leadId },
      definition: healthDef.default.GET,
      input: {
        detailed: false,
        includeDatabase: false,
        includeTasks: false,
        includeSystem: false,
      },
      locale,
      timeoutMs: 5000,
    });
    if (networkError) {
      logger.debug(
        "[REGISTER] Accessibility ping failed (expected for NAT/private networks)",
        { localUrl },
      );
      return false;
    }
    // Any HTTP answer (even an error status) proves direct reachability.
    return status > 0;
  }
  static async registerLocalInstance(
    data: RemoteRegisterPostRequestInput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteRegisterT,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      registered: boolean;
      remoteInstanceId: string;
      remoteUserId: string;
      transportMode: "reverse-ws" | "direct-http";
    }>
  > {
    const { instanceId, localUrl, reverseToken, reverseLeadId, selfUserId } =
      data;
    // Parse to a concrete scope (field defaults filled) for the DB row. When the
    // caller sent NO scope, this yields the schema defaults (threads:false) —
    // treat that as "no scope provided" below and PRESERVE the existing row's
    // scope rather than resetting it (a re-register / reconnect must never
    // silently downgrade an enabled domain).
    const scopeProvided = data.syncScope !== undefined;
    const syncScope = SyncScopeSchema.parse(data.syncScope);
    // The initiator's own transport toward us → our reverse entry's
    // remoteTransportMode (how the peer reaches us). Undefined for older
    // initiators → the column default (direct-http) applies.
    const remoteTransportMode = data.remoteTransportMode;

    const selfInstanceId = await RemoteConnectionRepository.getLocalInstanceId(
      user.id,
    );

    // Reject if the connecting instance's ID collides with our own self-identity.
    if (instanceId === selfInstanceId) {
      logger.warn("[REGISTER] Instance ID collides with self-identity", {
        userId: user.id,
        instanceId,
        selfInstanceId,
      });
      return fail({
        message: t("post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // Upsert cloud-side record with optional reverse token for bidirectional auth.
    // reverseToken: JWT from the connecting instance, encrypted before storage. Enables
    // this instance to call /report on the connector (push task completion status back).
    // Reconnect is allowed - update localUrl/isActive if the record already exists.
    if (!reverseToken || !reverseLeadId) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const encryptedReverseToken =
      RemoteConnectionRepository.encryptToken(reverseToken);

    await db
      .insert(remoteConnections)
      .values({
        userId: user.id,
        instanceId,
        remoteUrl: localUrl, // from cloud's perspective, the local IS the remote
        localUrl,
        token: encryptedReverseToken,
        leadId: reverseLeadId,
        isActive: true,
        isReverseEntry: true,
        remoteUserId: selfUserId ?? null,
        // The reverse entry MIRRORS the initiator's scope — both sides serve the
        // SAME domains. Kept in sync thereafter via connect-reverse/update.
        syncScope,
        // How the initiator reaches us (its own transport leg). Omitted → column
        // default (direct-http).
        ...(remoteTransportMode ? { remoteTransportMode } : {}),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [remoteConnections.userId, remoteConnections.instanceId],
        set: {
          localUrl,
          remoteUrl: localUrl,
          isActive: true,
          isReverseEntry: true,
          remoteUserId: selfUserId ?? null,
          token: encryptedReverseToken,
          leadId: reverseLeadId,
          // Re-register mirrors the initiator's current scope ONLY when it sent
          // one. An absent scope means "no change" — preserve the stored scope
          // (never reset an enabled domain to the schema default on reconnect).
          ...(scopeProvided ? { syncScope } : {}),
          // Re-register refreshes how the initiator reaches us.
          ...(remoteTransportMode ? { remoteTransportMode } : {}),
          updatedAt: new Date(),
        },
      });

    // Domains prepare their per-peer state (threads mirror scaffold etc.).
    const { notifyConnectionEstablished } = await import("../sync/provider");
    await notifyConnectionEstablished(user.id, instanceId, logger);
    logger.info("Registered local instance on cloud", {
      userId: user.id,
      instanceId,
      localUrl,
    });

    // Transport detection (spec: register never opens outbound sockets).
    // Ping localUrl with the reverse token (authenticated health check), persist
    // the verdict as this reverse entry's transportMode and hand it back to the
    // initiator, which records it as its remoteTransportMode. Unreachable (NAT /
    // loopback) means the only way to reach the initiator is its reverse-ws
    // connector. Bounded by the 5s probe timeout so register stays prompt.
    const reachable =
      await RemoteConnectionRegisterRepository.checkDirectAccessibility(
        localUrl,
        logger,
        locale,
        reverseToken,
        reverseLeadId,
      );
    const detectedTransportMode = reachable ? "direct-http" : "reverse-ws";
    try {
      await db
        .update(remoteConnections)
        .set({ transportMode: detectedTransportMode, updatedAt: new Date() })
        .where(
          and(
            eq(remoteConnections.userId, user.id),
            eq(remoteConnections.instanceId, instanceId),
          ),
        );
      logger.info("[REGISTER] Detected transport to initiator", {
        instanceId,
        localUrl,
        transportMode: detectedTransportMode,
      });
    } catch (updateErr) {
      logger.warn("[REGISTER] Failed to update transportMode (non-fatal)", {
        instanceId,
        error:
          updateErr instanceof Error ? updateErr.message : String(updateErr),
      });
    }

    // ── Also set the cloud's own self-identity record (if not already set) ──
    // Reuses selfInstanceId from the collision check above.
    await db
      .insert(instanceIdentities)
      .values({
        userId: user.id,
        instanceId: selfInstanceId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [instanceIdentities.userId],
        set: { instanceId: selfInstanceId, updatedAt: new Date() },
      });

    // ── Create a remote subfolder for this instance + set routing rule ──────
    // Awaited: must exist before register() returns so the first relay can
    // resolve it immediately. Mirrors connect/repository.ts Step 6b.
    try {
      const { ensureInstanceFolder } = await import("../instance-folder");
      const folderId = await ensureInstanceFolder(user.id, instanceId);

      logger.debug("[REGISTER] Ensured remote subfolder", {
        instanceId,
        folderId,
      });
    } catch (err) {
      logger.warn("[REGISTER] Failed to create remote subfolder (non-fatal)", {
        instanceId,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    return success({
      registered: true,
      remoteInstanceId: selfInstanceId,
      // Our own userId — the connecting instance stores it as its connection's
      // remoteUserId to target our `user/{userId}` channel for the bridge event.
      remoteUserId: user.id,
      transportMode: detectedTransportMode,
    });
  }
}
