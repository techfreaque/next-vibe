import "server-only";

import { and, eq } from "drizzle-orm";
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
import type { ConnectionDetailResponseOutput } from "./definition";

export class ConnectionDetailRepository {
  static async get(
    logger: EndpointLogger,
    user: JwtPayloadType,
    id: string,
  ): Promise<ResponseType<ConnectionDetailResponseOutput>> {
    try {
      const [row] = await db
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
        .where(
          and(eq(sshConnections.id, id), eq(sshConnections.userId, user.id!)),
        );

      if (!row) {
        return fail({
          message: "Connection not found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        id: row.id,
        label: row.label,
        host: row.host,
        port: row.port,
        username: row.username,
        authType: row.authType,
        isDefault: row.isDefault,
        fingerprint: row.fingerprint ?? null,
        notes: row.notes ?? null,
        createdAt: row.createdAt.toISOString(),
      });
    } catch (error) {
      logger.error("Failed to get SSH connection", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
