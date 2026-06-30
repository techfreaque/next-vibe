import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { sshConnectionMounts } from "@/app/api/[locale]/ssh/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { SshMountsT } from "../i18n";
import type {
  MountDeleteResponseOutput,
  MountDetailResponseOutput,
  MountUpdateRequestOutput,
  MountUpdateResponseOutput,
} from "./definition";

export class MountDetailRepository {
  static async get(
    logger: EndpointLogger,
    user: JwtPayloadType,
    mountId: string,
    t: SshMountsT,
  ): Promise<ResponseType<MountDetailResponseOutput>> {
    try {
      const row = await db
        .select()
        .from(sshConnectionMounts)
        .where(
          and(
            eq(sshConnectionMounts.id, mountId),
            eq(sshConnectionMounts.userId, user.id!),
          ),
        )
        .limit(1);

      if (!row[0]) {
        return fail({
          message: t("errors.mountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        name: row[0].name,
        path: row[0].path,
        isDefault: row[0].isDefault,
        createdAt: row[0].createdAt,
      });
    } catch (error) {
      logger.error("Failed to get SSH mount", parseError(error));
      return fail({
        message: t("detail.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async update(
    data: MountUpdateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    mountId: string,
    t: SshMountsT,
  ): Promise<ResponseType<MountUpdateResponseOutput>> {
    try {
      const existing = await db
        .select()
        .from(sshConnectionMounts)
        .where(
          and(
            eq(sshConnectionMounts.id, mountId),
            eq(sshConnectionMounts.userId, user.id!),
          ),
        )
        .limit(1);

      if (!existing[0]) {
        return fail({
          message: t("errors.mountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const { connectionId } = existing[0];

      // If setting as default, clear others first
      if (data.isDefault) {
        await db
          .update(sshConnectionMounts)
          .set({ isDefault: false })
          .where(eq(sshConnectionMounts.connectionId, connectionId));
      }

      const updates: Partial<typeof sshConnectionMounts.$inferInsert> = {
        updatedAt: new Date(),
      };
      if (data.path !== undefined) {
        updates.path = data.path;
        updates.name = data.path.split("/").filter(Boolean).at(-1) ?? "mount";
      }
      if (data.isDefault !== undefined) {
        updates.isDefault = data.isDefault;
      }

      const [updated] = await db
        .update(sshConnectionMounts)
        .set(updates)
        .where(eq(sshConnectionMounts.id, mountId))
        .returning({ updatedAt: sshConnectionMounts.updatedAt });

      if (!updated) {
        return fail({
          message: t("errors.mountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ updatedAt: updated.updatedAt });
    } catch (error) {
      logger.error("Failed to update SSH mount", parseError(error));
      return fail({
        message: t("detail.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async delete(
    logger: EndpointLogger,
    user: JwtPayloadType,
    mountId: string,
    t: SshMountsT,
  ): Promise<ResponseType<MountDeleteResponseOutput>> {
    try {
      const deleted = await db
        .delete(sshConnectionMounts)
        .where(
          and(
            eq(sshConnectionMounts.id, mountId),
            eq(sshConnectionMounts.userId, user.id!),
          ),
        )
        .returning({ id: sshConnectionMounts.id });

      if (!deleted[0]) {
        return fail({
          message: t("errors.mountNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ deleted: true });
    } catch (error) {
      logger.error("Failed to delete SSH mount", parseError(error));
      return fail({
        message: t("detail.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
