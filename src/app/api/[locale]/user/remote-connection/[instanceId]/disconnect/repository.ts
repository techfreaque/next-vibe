/**
 * Remote Connection Disconnect Repository
 * DELETE — remove the connection record and notify remote
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
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { remoteConnections } from "../../db";
import { RemoteConnectionRepository } from "../../repository";
import type { RemoteConnectionDisconnectDeleteResponseOutput } from "./definition";
import type { RemoteConnectionDisconnectT } from "./i18n";

export class RemoteConnectionDisconnectRepository {
  static async disconnectConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectionDisconnectT,
    instanceId: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<RemoteConnectionDisconnectDeleteResponseOutput>> {
    // Fetch full record before deleting — need remoteUrl + token to notify cloud
    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    if (!row) {
      return fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    await db
      .delete(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    RemoteConnectionRepository.invalidateInstanceIdCache();
    logger.info("Disconnected remote connection locally", {
      userId: user.id,
      instanceId,
    });

    // Fire-and-forget: notify cloud to remove the registration record too
    if (row.token && row.remoteUrl) {
      const plainToken = RemoteConnectionRepository.decryptToken(row.token);
      const remoteDeleteUrl = `${row.remoteUrl}/api/${locale}/user/remote-connection/${instanceId}/disconnect`;
      fetch(remoteDeleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${plainToken}`,
          ...(row.leadId
            ? { Cookie: `${LEAD_ID_COOKIE_NAME}=${row.leadId}` }
            : {}),
        },
        signal: AbortSignal.timeout(10000),
      })
        .then((res) => {
          if (!res.ok) {
            logger.warn("Remote disconnect failed — cloud record may remain", {
              instanceId,
              status: res.status,
            });
          } else {
            logger.info("Remote disconnect acknowledged by cloud", {
              instanceId,
            });
          }
          return undefined;
        })
        .catch((err) => {
          logger.warn(
            "Remote disconnect request errored — cloud record may remain",
            {
              instanceId,
              error: String(err),
            },
          );
        });
    }

    return success({ disconnected: true });
  }
}
