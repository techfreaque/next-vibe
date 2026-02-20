/**
 * SSH Connections Test Repository
 * Tests SSH connectivity using ssh2 (stub for now — SSH backend not yet implemented)
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { sshConnections } from "../../db";
import type {
  ConnectionTestRequestOutput,
  ConnectionTestResponseOutput,
} from "./definition";

export class ConnectionTestRepository {
  static async test(
    data: ConnectionTestRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<ResponseType<ConnectionTestResponseOutput>> {
    try {
      const [row] = await db
        .select({
          id: sshConnections.id,
          host: sshConnections.host,
          fingerprint: sshConnections.fingerprint,
        })
        .from(sshConnections)
        .where(
          and(
            eq(sshConnections.id, data.connectionId),
            eq(sshConnections.userId, user.id!),
          ),
        );

      if (!row) {
        return fail({
          message: "Connection not found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // SSH backend not yet implemented — return a stub response indicating not-yet-connected
      logger.info(`SSH test stub for connection ${row.id} to ${row.host}`);

      return fail({
        message:
          "SSH backend not yet implemented. Cannot test remote connections yet.",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    } catch (error) {
      logger.error("Failed to test SSH connection", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
