/**
 * Remote Connection Rename Repository
 * PATCH — update the friendly name
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { remoteConnections } from "../../db";
import type { RemoteConnectionRenameT } from "./i18n";

export async function renameConnection(
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteConnectionRenameT,
  instanceId: string,
  friendlyName: string,
): Promise<ResponseType<{ updated: boolean }>> {
  const result = await db
    .update(remoteConnections)
    .set({ friendlyName, updatedAt: new Date() })
    .where(
      and(
        eq(remoteConnections.userId, user.id),
        eq(remoteConnections.instanceId, instanceId),
      ),
    )
    .returning({ instanceId: remoteConnections.instanceId });

  if (result.length === 0) {
    return fail({
      message: t("patch.errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  logger.info("Renamed remote connection", {
    userId: user.id,
    instanceId,
    friendlyName,
  });
  return success({ updated: true });
}
