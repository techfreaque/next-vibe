/**
 * SSH Connections Create Repository
 * Stores encrypted SSH credentials
 */

import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

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

import { env } from "@/config/env";
import { sshConnections } from "../../db";
import { SshAuthType } from "../../enum";
import type {
  ConnectionCreateRequestOutput,
  ConnectionCreateResponseOutput,
} from "./definition";
import type { ConnectionsCreateT } from "./i18n";

export class ConnectionCreateRepository {
  private static getSecretKey(): Buffer | null {
    const raw = env.JWT_SECRET_KEY;
    if (!raw || raw.length < 64) {
      return null;
    }
    return Buffer.from(raw.slice(0, 64), "hex");
  }

  static encryptSecret(plaintext: string): string | null {
    const key = ConnectionCreateRepository.getSecretKey();
    if (!key) {
      return null;
    }
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  static decryptSecret(ciphertext: string): string | null {
    const key = ConnectionCreateRepository.getSecretKey();
    if (!key) {
      return null;
    }
    const parts = ciphertext.split(":");
    if (parts.length !== 3) {
      return null;
    }
    const [ivHex, tagHex, encHex] = parts;
    const iv = Buffer.from(ivHex!, "hex");
    const authTag = Buffer.from(tagHex!, "hex");
    const encrypted = Buffer.from(encHex!, "hex");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    return `${decipher.update(encrypted)}${decipher.final("utf8")}`;
  }

  static async create(
    data: ConnectionCreateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: ConnectionsCreateT,
  ): Promise<ResponseType<ConnectionCreateResponseOutput>> {
    const isLocal = data.authType === SshAuthType.LOCAL;

    if (!isLocal) {
      const secretKey = ConnectionCreateRepository.getSecretKey();
      if (!secretKey) {
        return fail({
          message: t("errors.sshSecretKeyNotSet"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
    }

    try {
      if (data.isDefault) {
        await db
          .update(sshConnections)
          .set({ isDefault: false })
          .where(eq(sshConnections.userId, user.id!));
      }

      let encryptedSecret = "";
      let encryptedPassphrase: string | null = null;

      if (!isLocal) {
        const rawSecret = data.secret ?? "";
        const enc = ConnectionCreateRepository.encryptSecret(rawSecret);
        if (!enc) {
          return fail({
            message: t("errors.encryptionFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        encryptedSecret = enc;
        encryptedPassphrase = data.passphrase
          ? (ConnectionCreateRepository.encryptSecret(data.passphrase) ?? null)
          : null;
      }

      const [row] = await db
        .insert(sshConnections)
        .values({
          userId: user.id!,
          label: data.label,
          host: data.host ?? "localhost",
          port: data.port ?? (isLocal ? 0 : 22),
          username: data.username,
          authType: data.authType,
          encryptedSecret,
          encryptedPassphrase,
          isDefault: data.isDefault ?? false,
          notes: data.notes ?? null,
        })
        .returning({ id: sshConnections.id });

      if (!row) {
        return fail({
          message: t("errors.noRowReturned"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info(`Created SSH connection ${row.id} for user ${user.id!}`);
      return success({ id: row.id });
    } catch (error) {
      logger.error("Failed to create SSH connection", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
