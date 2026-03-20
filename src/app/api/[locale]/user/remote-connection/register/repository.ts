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
import {
  ErrorResponseTypes,
  type ResponseType,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { instanceIdentities, remoteConnections } from "../db";
import { RemoteConnectionRepository } from "../repository";
import type { RemoteRegisterPostRequestInput } from "./definition";
import type { RemoteRegisterT } from "./i18n";

export class RemoteConnectionRegisterRepository {
  /**
   * Ping a localUrl to check if it is directly reachable via HTTP.
   * Used at connect time and on re-sync to set isDirectlyAccessible.
   * Tries GET /api/health with a 5s timeout. Returns true only if 2xx response.
   */
  static async checkDirectAccessibility(
    localUrl: string | null | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<boolean> {
    if (!localUrl) {
      return false;
    }
    try {
      const healthUrl = `${localUrl.replace(/\/$/, "")}/api/${locale}/user/private/me`;
      const resp = await fetch(healthUrl, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      return resp.ok;
    } catch {
      logger.debug(
        "[REGISTER] Accessibility ping failed (expected for NAT/private networks)",
        {
          localUrl,
        },
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
    // Reconnect is allowed — update localUrl/isActive if the record already exists.
    const encryptedReverseToken = reverseToken
      ? RemoteConnectionRepository.encryptToken(reverseToken)
      : null;

    await db
      .insert(remoteConnections)
      .values({
        userId: user.id,
        instanceId,
        remoteUrl: localUrl, // from cloud's perspective, the local IS the remote
        localUrl,
        token: encryptedReverseToken,
        leadId: reverseLeadId ?? null,
        isActive: true,
        remoteInstanceId: instanceId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [remoteConnections.userId, remoteConnections.instanceId],
        set: {
          localUrl,
          remoteUrl: localUrl,
          isActive: true,
          remoteInstanceId: instanceId,
          ...(encryptedReverseToken ? { token: encryptedReverseToken } : {}),
          ...(reverseLeadId ? { leadId: reverseLeadId } : {}),
          updatedAt: new Date(),
        },
      });

    logger.info("Registered local instance on cloud", {
      userId: user.id,
      instanceId,
      localUrl,
    });

    // Ping localUrl to check direct accessibility.
    // If reachable: set isDirectlyAccessible=true so execute-tool can use direct HTTP.
    // If not reachable (NAT, firewall): keep false, fall back to task-queue pull.
    // Fire-and-forget: registration succeeds regardless of ping result.
    void (async (): Promise<void> => {
      const isDirectlyAccessible =
        await RemoteConnectionRegisterRepository.checkDirectAccessibility(
          localUrl,
          logger,
          locale,
        );
      if (isDirectlyAccessible) {
        try {
          await db
            .update(remoteConnections)
            .set({ isDirectlyAccessible: true, updatedAt: new Date() })
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
          logger.warn(
            "[REGISTER] Failed to update isDirectlyAccessible (non-fatal)",
            {
              instanceId,
              error:
                updateErr instanceof Error
                  ? updateErr.message
                  : String(updateErr),
            },
          );
        }
      } else {
        logger.info(
          "[REGISTER] Local instance not directly accessible — using task-queue",
          {
            instanceId,
            localUrl,
          },
        );
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

    return success({
      registered: true,
      remoteInstanceId: selfInstanceId,
    });
  }
}
