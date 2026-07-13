import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { sshConnectionMounts, sshConnections } from "@/app/api/[locale]/ssh/db";

import type { SshMountsT } from "../i18n";
import type { MountsListResponseOutput } from "./definition";

export class MountsListRepository {
  static async list(
    logger: EndpointLogger,
    user: JwtPayloadType,
    connectionId: string,
    t: SshMountsT,
  ): Promise<ResponseType<MountsListResponseOutput>> {
    try {
      // Verify the connection belongs to this user
      const conn = await db
        .select({ id: sshConnections.id })
        .from(sshConnections)
        .where(
          and(
            eq(sshConnections.id, connectionId),
            eq(sshConnections.userId, user.id!),
          ),
        )
        .limit(1);

      if (!conn[0]) {
        return fail({
          message: t("errors.notYourConnection"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const rows = await db
        .select({
          id: sshConnectionMounts.id,
          name: sshConnectionMounts.name,
          path: sshConnectionMounts.path,
          isDefault: sshConnectionMounts.isDefault,
          createdAt: sshConnectionMounts.createdAt,
        })
        .from(sshConnectionMounts)
        .where(
          and(
            eq(sshConnectionMounts.connectionId, connectionId),
            eq(sshConnectionMounts.userId, user.id!),
          ),
        )
        .orderBy(
          desc(sshConnectionMounts.isDefault),
          asc(sshConnectionMounts.path),
        );

      return success({
        mounts: rows.map((r) => ({
          id: r.id,
          name: r.name,
          path: r.path,
          isDefault: r.isDefault,
          createdAt: r.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      logger.error("Failed to list SSH mounts", parseError(error));
      return fail({
        message: t("list.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
