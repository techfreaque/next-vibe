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

import { sshConnections } from "../../db";
import type {
  ConnectionCreateRequestOutput,
  ConnectionCreateResponseOutput,
} from "./definition";

function getSecretKey(): Buffer | null {
  const raw = process.env["SSH_SECRET_KEY"];
  if (!raw || raw.length < 64) {
    return null;
  }
  return Buffer.from(raw.slice(0, 64), "hex");
}

export function encryptSecret(plaintext: string): string | null {
  const key = getSecretKey();
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

export function decryptSecret(ciphertext: string): string | null {
  const key = getSecretKey();
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

export class ConnectionCreateRepository {
  static async create(
    data: ConnectionCreateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
  ): Promise<ResponseType<ConnectionCreateResponseOutput>> {
    const secretKey = getSecretKey();
    if (!secretKey) {
      return fail({
        message:
          "SSH_SECRET_KEY env var not set. Add a 32-byte hex value to enable SSH mode.",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      if (data.isDefault) {
        await db
          .update(sshConnections)
          .set({ isDefault: false })
          .where(eq(sshConnections.userId, user.id!));
      }

      // Encrypt secret (required), store empty encrypted string if no secret provided
      const rawSecret = data.secret ?? "";
      const encryptedSecretOrNull = encryptSecret(rawSecret);
      if (!encryptedSecretOrNull) {
        return fail({
          message: "Encryption failed — SSH_SECRET_KEY may be invalid",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const encryptedSecret = encryptedSecretOrNull;
      const encryptedPassphrase = data.passphrase
        ? encryptSecret(data.passphrase)
        : null;

      const [row] = await db
        .insert(sshConnections)
        .values({
          userId: user.id!,
          label: data.label,
          host: data.host,
          port: data.port ?? 22,
          username: data.username,
          authType: data.authType,
          encryptedSecret,
          encryptedPassphrase: encryptedPassphrase ?? null,
          isDefault: data.isDefault ?? false,
          notes: data.notes ?? null,
        })
        .returning({ id: sshConnections.id });

      if (!row) {
        return fail({
          message: "No row returned from insert",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info(`Created SSH connection ${row.id} for user ${user.id!}`);
      return success({ id: row.id });
    } catch (error) {
      logger.error("Failed to create SSH connection", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
