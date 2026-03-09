/**
 * SSH2 Client Helper
 * Central module for all SSH2 remote operations.
 * Provides: credential lookup, client connect, exec, PTY, SFTP helpers.
 */

import "server-only";

import { createHash } from "node:crypto";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { Client as Ssh2Client, ClientChannel } from "ssh2";
import { Client } from "ssh2";

import { db } from "@/app/api/[locale]/system/db";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import { decryptSecret } from "./connections/create/repository";
import { sshConnections } from "./db";
import { SshAuthType, type SshAuthTypeType } from "./enum";

/**
 * Minimal translation interface for client.ts error messages.
 * All callers pass their scoped t() which covers these keys.
 */
export type ClientT = (
  key:
    | "errors.connectionNotFound"
    | "errors.encryptionFailed"
    | "errors.connectTimeout"
    | "errors.sshAuthFailed"
    | "errors.sshConnectionFailed"
    | "errors.fingerprintMismatch",
) => TranslatedKeyType;

export type { ClientChannel };
export type { Ssh2Client };

const SSH_CONNECT_TIMEOUT_MS = Number(
  process.env["SSH_CONNECT_TIMEOUT_MS"] ?? 10000,
);

export interface SshCredentials {
  id: string;
  host: string;
  port: number;
  username: string;
  authType: SshAuthTypeType;
  secret: string;
  passphrase: string | null;
  fingerprint: string | null;
}

/** Compute SHA256 fingerprint of host key buffer (hex string) */
export function computeFingerprint(hostKey: Buffer): string {
  return createHash("sha256").update(hostKey).digest("hex");
}

/**
 * Fetch connection row from DB and decrypt credentials.
 * Returns fail if not found or decryption fails.
 */
export async function getConnectionCredentials(
  connectionId: string,
  userId: string,
  t: ClientT,
): Promise<ResponseType<SshCredentials>> {
  const [row] = await db
    .select({
      id: sshConnections.id,
      host: sshConnections.host,
      port: sshConnections.port,
      username: sshConnections.username,
      authType: sshConnections.authType,
      encryptedSecret: sshConnections.encryptedSecret,
      encryptedPassphrase: sshConnections.encryptedPassphrase,
      fingerprint: sshConnections.fingerprint,
    })
    .from(sshConnections)
    .where(
      and(
        eq(sshConnections.id, connectionId),
        eq(sshConnections.userId, userId),
      ),
    );

  if (!row) {
    return fail({
      message: t("errors.connectionNotFound"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  const secret = decryptSecret(row.encryptedSecret);
  if (secret === null) {
    return fail({
      message: t("errors.encryptionFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const passphrase = row.encryptedPassphrase
    ? decryptSecret(row.encryptedPassphrase)
    : null;

  return success({
    id: row.id,
    host: row.host,
    port: row.port ?? 22,
    username: row.username,
    authType: row.authType as SshAuthTypeType,
    secret,
    passphrase,
    fingerprint: row.fingerprint ?? null,
  });
}

/**
 * Get the default connection ID for a user (or null if none).
 */
export async function getDefaultConnectionId(
  userId: string,
): Promise<string | null> {
  const [row] = await db
    .select({ id: sshConnections.id })
    .from(sshConnections)
    .where(
      and(
        eq(sshConnections.userId, userId),
        eq(sshConnections.isDefault, true),
      ),
    );
  return row?.id ?? null;
}

/**
 * Save or update the fingerprint for a connection.
 */
export async function saveFingerprint(
  connectionId: string,
  fingerprint: string,
): Promise<void> {
  await db
    .update(sshConnections)
    .set({ fingerprint })
    .where(eq(sshConnections.id, connectionId));
}

interface OpenClientResult {
  client: Ssh2Client;
  fingerprint: string;
  fingerprintChanged: boolean;
}

/**
 * Open a connected ssh2 Client.
 * Validates fingerprint if previously stored.
 * Set `acceptNewFingerprint=true` to accept and store a changed fingerprint.
 */
export async function openSshClient(
  creds: SshCredentials,
  t: ClientT,
  acceptNewFingerprint = false,
): Promise<ResponseType<OpenClientResult>> {
  return new Promise((resolve) => {
    const client = new Client();
    let capturedFingerprint = "";
    let fingerprintChanged = false;
    let settled = false;

    const settle = (result: ResponseType<OpenClientResult>): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      client.destroy();
      settle(
        fail({
          message: t("errors.connectTimeout"),
          errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        }),
      );
    }, SSH_CONNECT_TIMEOUT_MS);

    client.on("ready", () => {
      clearTimeout(timer);
      settle(
        success({
          client,
          fingerprint: capturedFingerprint,
          fingerprintChanged,
        }),
      );
    });

    client.on("error", (err) => {
      clearTimeout(timer);
      const errMsg = err.message ?? String(err);
      const isAuth =
        errMsg.includes("authentication") ||
        errMsg.includes("Authentication") ||
        errMsg.includes("auth");
      settle(
        fail({
          message: isAuth
            ? t("errors.sshAuthFailed")
            : t("errors.sshConnectionFailed"),
          errorType: isAuth
            ? ErrorResponseTypes.FORBIDDEN
            : ErrorResponseTypes.INTERNAL_ERROR,
        }),
      );
    });

    const connectConfig: Parameters<typeof client.connect>[0] = {
      host: creds.host,
      port: creds.port,
      username: creds.username,
      readyTimeout: SSH_CONNECT_TIMEOUT_MS,
      hostVerifier: (hostKey: Buffer) => {
        capturedFingerprint = computeFingerprint(hostKey);
        if (creds.fingerprint && creds.fingerprint !== capturedFingerprint) {
          if (!acceptNewFingerprint) {
            clearTimeout(timer);
            settle(
              fail({
                message: t("errors.fingerprintMismatch"),
                errorType: ErrorResponseTypes.FORBIDDEN,
              }),
            );
            return false;
          }
          fingerprintChanged = true;
        }
        return true;
      },
    };

    if (creds.authType === SshAuthType.PASSWORD) {
      connectConfig.password = creds.secret;
    } else if (creds.authType === SshAuthType.PRIVATE_KEY) {
      connectConfig.privateKey = creds.secret;
      if (creds.passphrase) {
        connectConfig.passphrase = creds.passphrase;
      }
    } else if (creds.authType === SshAuthType.KEY_AGENT) {
      connectConfig.agent = process.env["SSH_AUTH_SOCK"];
    }

    try {
      client.connect(connectConfig);
    } catch (err) {
      clearTimeout(timer);
      settle(
        fail({
          message: t("errors.sshConnectionFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }),
      );
      void parseError(err);
    }
  });
}

/**
 * Run a non-PTY exec command over SSH2.
 * Returns stdout, stderr, exitCode.
 */
export async function sshExecCommand(
  client: Ssh2Client,
  command: string,
  timeoutMs: number,
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    client.exec(command, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }

      let stdout = "";
      let stderr = "";
      let exitCode = 0;

      const timer = setTimeout(() => {
        stream.close();
        reject(new Error("SSH command timed out"));
      }, timeoutMs);

      stream.on("close", (code: number) => {
        clearTimeout(timer);
        exitCode = code ?? 0;
        resolve({ stdout, stderr, exitCode });
      });

      stream.on("data", (data: Buffer) => {
        stdout += data.toString("utf8");
      });

      stream.stderr.on("data", (data: Buffer) => {
        stderr += data.toString("utf8");
      });
    });
  });
}

/**
 * Open a PTY channel on an ssh2 Client.
 */
export async function openSshPty(
  client: Ssh2Client,
  cols: number,
  rows: number,
): Promise<ClientChannel> {
  return new Promise((resolve, reject) => {
    client.shell(
      {
        term: "xterm-256color",
        cols,
        rows,
      },
      (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stream);
      },
    );
  });
}

export interface SftpEntry {
  name: string;
  type: "dir" | "file" | "symlink";
  size: number | null;
  permissions: string | null;
  modifiedAt: string | null;
}

/**
 * SFTP: list directory contents.
 */
export async function sftpListDir(
  client: Ssh2Client,
  dirPath: string,
): Promise<SftpEntry[]> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err);
        return;
      }
      sftp.readdir(dirPath, (err2, list) => {
        if (err2) {
          reject(err2);
          return;
        }
        const entries: SftpEntry[] = list.map((item) => {
          const mode = item.attrs.mode ?? 0;
          const isDir = (mode & 0o170000) === 0o040000;
          const isSymlink = (mode & 0o170000) === 0o120000;
          const mtime = item.attrs.mtime
            ? new Date(item.attrs.mtime * 1000).toISOString()
            : null;
          return {
            name: item.filename,
            type: isDir ? "dir" : isSymlink ? "symlink" : "file",
            size: isDir ? null : (item.attrs.size ?? null),
            permissions: null,
            modifiedAt: mtime,
          };
        });
        entries.sort((a, b) => {
          if (a.type === "dir" && b.type !== "dir") {
            return -1;
          }
          if (b.type === "dir" && a.type !== "dir") {
            return 1;
          }
          return a.name.localeCompare(b.name);
        });
        resolve(entries);
      });
    });
  });
}

/**
 * SFTP: read file content (with offset and maxBytes).
 */
export async function sftpReadFile(
  client: Ssh2Client,
  filePath: string,
  offset: number,
  maxBytes: number,
): Promise<{ content: string; size: number; truncated: boolean }> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err);
        return;
      }
      sftp.stat(filePath, (err2, stats) => {
        if (err2) {
          reject(err2);
          return;
        }
        const size = stats.size ?? 0;
        const readSize = Math.min(maxBytes, size - offset);
        if (readSize <= 0) {
          resolve({ content: "", size, truncated: false });
          return;
        }
        const buf = Buffer.alloc(readSize);
        sftp.open(filePath, "r", (err3, handle) => {
          if (err3) {
            reject(err3);
            return;
          }
          sftp.read(handle, buf, 0, readSize, offset, (err4) => {
            sftp.close(handle, (_closeErr) => {
              void _closeErr;
            });
            if (err4) {
              reject(err4);
              return;
            }
            const content = buf.toString("utf8");
            const truncated = offset + readSize < size;
            resolve({ content, size, truncated });
          });
        });
      });
    });
  });
}

/**
 * SFTP: write file content (optionally create parent dirs).
 */
export async function sftpWriteFile(
  client: Ssh2Client,
  filePath: string,
  content: string,
  createDirs: boolean,
): Promise<{ bytesWritten: number }> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err);
        return;
      }

      const buf = Buffer.from(content, "utf8");

      const doWrite = (): void => {
        sftp.open(filePath, "w", (err2, handle) => {
          if (err2) {
            reject(err2);
            return;
          }
          sftp.write(handle, buf, 0, buf.length, 0, (err3) => {
            sftp.close(handle, (_closeErr) => {
              void _closeErr;
            });
            if (err3) {
              reject(err3);
              return;
            }
            resolve({ bytesWritten: buf.length });
          });
        });
      };

      if (!createDirs) {
        doWrite();
        return;
      }

      // mkdir -p the parent directory via exec (SFTP mkdir doesn't support recursive)
      const parentDir = filePath.split("/").slice(0, -1).join("/") || "/";
      client.exec(`mkdir -p "${parentDir}"`, (err2, stream) => {
        if (err2) {
          reject(err2);
          return;
        }
        stream.on("close", () => doWrite());
        stream.resume();
      });
    });
  });
}
