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

import { encryptSecret } from "../create/repository";
import type { NewSshConnection } from "../../db";
import { sshConnections } from "../../db";
import type {
  ConnectionDeleteResponseOutput,
  ConnectionDetailResponseOutput,
  ConnectionUpdateRequestOutput,
  ConnectionUpdateResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class ConnectionDetailRepository {
  static async get(
    logger: EndpointLogger,
    user: JwtPayloadType,
    id: string,
    t: ModuleT,
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
          message: t("errors.connectionNotFound"),
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
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async update(
    logger: EndpointLogger,
    user: JwtPayloadType,
    id: string,
    data: ConnectionUpdateRequestOutput,
    t: ModuleT,
  ): Promise<ResponseType<ConnectionUpdateResponseOutput>> {
    try {
      const [existing] = await db
        .select({ id: sshConnections.id })
        .from(sshConnections)
        .where(
          and(eq(sshConnections.id, id), eq(sshConnections.userId, user.id!)),
        );

      if (!existing) {
        return fail({
          message: t("errors.connectionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (data.isDefault) {
        await db
          .update(sshConnections)
          .set({ isDefault: false })
          .where(eq(sshConnections.userId, user.id!));
      }

      const updates: Partial<NewSshConnection> = {};
      if (data.label !== undefined) {
        updates.label = data.label;
      }
      if (data.host !== undefined) {
        updates.host = data.host;
      }
      if (data.port !== undefined) {
        updates.port = data.port;
      }
      if (data.username !== undefined) {
        updates.username = data.username;
      }
      if (data.authType !== undefined) {
        updates.authType = data.authType;
      }
      if (data.notes !== undefined) {
        updates.notes = data.notes;
      }
      if (data.isDefault !== undefined) {
        updates.isDefault = data.isDefault;
      }

      if (data.secret !== undefined && data.secret !== "") {
        const enc = encryptSecret(data.secret);
        if (!enc) {
          return fail({
            message: t("errors.encryptionFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        updates.encryptedSecret = enc;
      }
      if (data.passphrase !== undefined) {
        updates.encryptedPassphrase =
          data.passphrase === "" ? null : encryptSecret(data.passphrase);
      }

      const [updated] = await db
        .update(sshConnections)
        .set(updates)
        .where(
          and(eq(sshConnections.id, id), eq(sshConnections.userId, user.id!)),
        )
        .returning({ updatedAt: sshConnections.updatedAt });

      if (!updated) {
        return fail({
          message: t("errors.connectionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info(`Updated SSH connection ${id} for user ${user.id!}`);
      return success({ updatedAt: updated.updatedAt.toISOString() });
    } catch (error) {
      logger.error("Failed to update SSH connection", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async delete(
    logger: EndpointLogger,
    user: JwtPayloadType,
    id: string,
    t: ModuleT,
  ): Promise<ResponseType<ConnectionDeleteResponseOutput>> {
    try {
      const [deleted] = await db
        .delete(sshConnections)
        .where(
          and(eq(sshConnections.id, id), eq(sshConnections.userId, user.id!)),
        )
        .returning({ id: sshConnections.id });

      if (!deleted) {
        return fail({
          message: t("errors.connectionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info(`Deleted SSH connection ${id} for user ${user.id!}`);
      return success({ deleted: true });
    } catch (error) {
      logger.error("Failed to delete SSH connection", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
