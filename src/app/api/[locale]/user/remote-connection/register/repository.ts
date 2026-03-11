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
 * The unique constraint (userId, instanceId) on user_remote_connections enforces
 * this at DB level too, but we check first for a clear error message.
 */

import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { envClient } from "@/config/env-client";

import { userRemoteConnections } from "../db";
import { invalidateInstanceIdCache } from "../repository";
import type { RemoteRegisterPostRequestInput } from "./definition";

/**
 * Derive a default instanceId for this host from its app URL.
 * - localhost:3001 (preview) → "hermes"
 * - localhost:3000 (main dev) → "hermes-dev"
 * - In production → "thea"
 * This is only used as the initial self-identity — can be renamed by user.
 */
function deriveDefaultSelfInstanceId(): string {
  // IS_PREVIEW_MODE is set at runtime by vibe start (not baked in at build time
  // like NEXT_PUBLIC_* vars), so it correctly reflects which server is running.
  if (process.env["IS_PREVIEW_MODE"] === "true") {
    return "hermes";
  }

  // In production (real cloud instance)
  try {
    const parsed = new URL(envClient.NEXT_PUBLIC_APP_URL);
    const hostname = parsed.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "thea";
    }
  } catch {
    // ignore
  }

  // Local dev (vibe dev, port 3000)
  return "hermes-dev";
}

export async function registerLocalInstance(
  data: RemoteRegisterPostRequestInput,
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
): Promise<ResponseType<{ registered: boolean; remoteInstanceId: string }>> {
  const { instanceId, localUrl } = data;

  // Upsert cloud-side record: token=null (cloud never calls local), localUrl set.
  // remoteInstanceId = instanceId: the connecting client's own identity, used by
  // execute-tool to set targetInstance correctly when routing tasks back to this client.
  // Reconnect is allowed — update localUrl/isActive if the record already exists.
  await db
    .insert(userRemoteConnections)
    .values({
      userId: user.id,
      instanceId,
      friendlyName: instanceId,
      remoteUrl: localUrl, // from cloud's perspective, the local IS the remote
      localUrl,
      token: null,
      isActive: true,
      remoteInstanceId: instanceId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userRemoteConnections.userId, userRemoteConnections.instanceId],
      set: {
        localUrl,
        remoteUrl: localUrl,
        isActive: true,
        remoteInstanceId: instanceId,
        updatedAt: new Date(),
      },
    });

  logger.info("Registered local instance on cloud", {
    userId: user.id,
    instanceId,
    localUrl,
  });

  // ── Also set the cloud's own self-identity record (if not already set) ──
  // token = "self" is a sentinel — not a real JWT, but non-empty so
  // getLocalInstanceId() (which filters token IS NOT NULL AND token != '')
  // can discover this instance's own ID from DB.
  const selfInstanceId = deriveDefaultSelfInstanceId();
  const cloudUrl = envClient.NEXT_PUBLIC_APP_URL;

  await db
    .insert(userRemoteConnections)
    .values({
      userId: user.id,
      instanceId: selfInstanceId,
      friendlyName: selfInstanceId,
      remoteUrl: cloudUrl,
      localUrl: null,
      token: "self",
      isActive: true,
      updatedAt: new Date(),
    })
    .onConflictDoNothing(); // if self-record already exists, keep it (overridable by user)

  invalidateInstanceIdCache();

  return success({ registered: true, remoteInstanceId: selfInstanceId });
}
