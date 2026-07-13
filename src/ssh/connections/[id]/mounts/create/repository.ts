import "server-only";

import { and, eq } from "drizzle-orm";
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
import type {
  MountCreateRequestOutput,
  MountCreateResponseOutput,
} from "./definition";

export class MountCreateRepository {
  static async create(
    data: MountCreateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    connectionId: string,
    t: SshMountsT,
  ): Promise<ResponseType<MountCreateResponseOutput>> {
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

      // If setting as default, clear existing default
      if (data.isDefault) {
        await db
          .update(sshConnectionMounts)
          .set({ isDefault: false })
          .where(eq(sshConnectionMounts.connectionId, connectionId));
      }

      const [row] = await db
        .insert(sshConnectionMounts)
        .values({
          userId: user.id!,
          connectionId,
          name: data.path.split("/").filter(Boolean).at(-1) ?? "mount",
          path: data.path,
          isDefault: data.isDefault,
        })
        .returning({ id: sshConnectionMounts.id })
        .onConflictDoNothing();

      if (!row) {
        return fail({
          message: t("create.errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      logger.info(`Created SSH mount ${row.id} for connection ${connectionId}`);
      return success({ mountId: row.id });
    } catch (error) {
      logger.error("Failed to create SSH mount", parseError(error));
      return fail({
        message: t("create.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
