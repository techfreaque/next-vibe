/**
 * SSH Connections List Repository
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { sshConnections } from "../../db";
import type { ConnectionsListResponseOutput } from "./definition";

export class ConnectionsListRepository {
  static async list(
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<ResponseType<ConnectionsListResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: sshConnections.id,
          label: sshConnections.label,
          host: sshConnections.host,
          port: sshConnections.port,
          username: sshConnections.username,
          authType: sshConnections.authType,
          isDefault: sshConnections.isDefault,
          fingerprint: sshConnections.fingerprint,
          notes: sshConnections.notes,
          createdAt: sshConnections.createdAt,
        })
        .from(sshConnections)
        .where(eq(sshConnections.userId, user.id!));

      const connections: ConnectionsListResponseOutput["connections"] =
        rows.map((r) => ({
          id: r.id,
          label: r.label,
          host: r.host,
          port: r.port,
          username: r.username,
          authType: r.authType,
          isDefault: r.isDefault,
          fingerprint: r.fingerprint ?? null,
          notes: r.notes ?? null,
          createdAt: r.createdAt.toISOString(),
        }));

      logger.debug(
        `Listed ${connections.length} SSH connections for user ${user.id!}`,
      );
      return success({ connections });
    } catch (error) {
      logger.error("Failed to list SSH connections", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
