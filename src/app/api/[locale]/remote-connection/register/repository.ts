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

import { and, eq, isNull } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { SyncScope } from "../db";
import { instanceIdentities, remoteConnections } from "../db";
import { RemoteConnectionRepository } from "../repository";

/**
 * Reverse entries default to serving every sync domain. The passive side has
 * no UI to choose a scope; it mirrors whatever the initiator chose to pull.
 * A null/all-false scope makes the server-side serve filter return nothing.
 */
const REVERSE_ENTRY_SYNC_SCOPE: SyncScope = {
  memories: true,
  documents: true,
  skills: true,
  favorites: true,
  threads: true,
};
import type { RemoteRegisterPostRequestInput } from "./definition";
import type { RemoteRegisterT } from "./i18n";

export class RemoteConnectionRegisterRepository {
  /**
   * Ping a localUrl to check if it is directly reachable via HTTP.
   * Uses executeRemote() with proper auth against the server health endpoint.
   * Returns true if the remote responds (even with an error), false on network failure.
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
    try {
      const { executeRemote } =
        await import("@/app/api/[locale]/remote-connection/dispatch");
      const healthDef =
        await import("@/app/api/[locale]/system/server/health/definition");
      const result = await executeRemote({
        definition: healthDef.default.GET,
        data: {},
        token,
        leadId,
        remoteUrl: localUrl,
        locale,
        logger,
      });
      return result.success;
    } catch {
      logger.debug(
        "[REGISTER] Accessibility ping failed (expected for NAT/private networks)",
        { localUrl },
      );
      return false;
    }
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
    }>
  > {
    const { instanceId, localUrl, reverseToken, reverseLeadId } = data;

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
    // remoteInstanceId = instanceId: the connecting client's own identity, used by
    // execute-tool to set targetInstance correctly when routing tasks back to this client.
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
        remoteInstanceId: instanceId,
        // Mirror threads on both sides by default so remote folder shows history.
        threadMirrorMode: "both",
        // The passive side serves whatever the initiator pulls. Default ALL
        // domains on — a null syncScope makes the server-side serve filter
        // drop everything, so the initiator's pull returns nothing.
        syncScope: REVERSE_ENTRY_SYNC_SCOPE,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [remoteConnections.userId, remoteConnections.instanceId],
        set: {
          localUrl,
          remoteUrl: localUrl,
          isActive: true,
          isReverseEntry: true,
          remoteInstanceId: instanceId,
          token: encryptedReverseToken,
          leadId: reverseLeadId,
          // Backfill the scope on re-register if a prior row stored null.
          syncScope: REVERSE_ENTRY_SYNC_SCOPE,
          updatedAt: new Date(),
        },
      });

    logger.info("Registered local instance on cloud", {
      userId: user.id,
      instanceId,
      localUrl,
    });

    // Transport detection — ONE ordered async block (spec: register never
    // opens outbound sockets; reverse entries dispatch toward their initiator
    // via local hub publish on system/tool-dispatch/{userId}, where the
    // initiator's persistent WS is subscribed).
    //   1. Ping localUrl with the reverse token (authenticated health check)
    //   2. Persist the detected transport hint
    // Fire-and-forget: registration succeeds regardless of ping result.
    void (async (): Promise<void> => {
      const reachable =
        await RemoteConnectionRegisterRepository.checkDirectAccessibility(
          localUrl,
          logger,
          locale,
          reverseToken,
          reverseLeadId,
        );
      if (reachable) {
        try {
          await db
            .update(remoteConnections)
            .set({ transportMode: "direct-http", updatedAt: new Date() })
            .where(
              and(
                eq(remoteConnections.userId, user.id),
                eq(remoteConnections.instanceId, instanceId),
              ),
            );
          logger.info("[REGISTER] Local instance is directly accessible", {
            instanceId,
            localUrl,
          });
        } catch (updateErr) {
          logger.warn("[REGISTER] Failed to update transportMode (non-fatal)", {
            instanceId,
            error:
              updateErr instanceof Error
                ? updateErr.message
                : String(updateErr),
          });
        }
      } else {
        logger.debug("[REGISTER] Local instance not directly accessible", {
          instanceId,
          localUrl,
        });
      }
    })();

    // ── Also set the cloud's own self-identity record (if not already set) ──
    // Reuses selfInstanceId from the collision check above.
    await db
      .insert(instanceIdentities)
      .values({
        userId: user.id,
        instanceId: selfInstanceId,
        isDefault: true,
        updatedAt: new Date(),
      })
      .onConflictDoNothing();

    // ── Create a remote subfolder for this instance + set routing rule ──────
    // Awaited: must exist before register() returns so the first relay can
    // resolve it immediately. Mirrors connect/repository.ts Step 6b.
    try {
      const { chatFolders } = await import("@/app/api/[locale]/agent/chat/db");
      const { DefaultFolderId } =
        await import("@/app/api/[locale]/agent/chat/config");
      const [existing] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, user.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, instanceId),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);
      let folderId: string;
      if (existing) {
        folderId = existing.id;
      } else {
        const [inserted] = await db
          .insert(chatFolders)
          .values({
            userId: user.id,
            rootFolderId: DefaultFolderId.REMOTE,
            name: instanceId,
            parentId: null,
          })
          .returning({ id: chatFolders.id });
        folderId = inserted!.id;
      }

      logger.debug("[REGISTER] Created remote subfolder", {
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
    });
  }
}
