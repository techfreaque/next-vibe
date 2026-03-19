/**
 * Linux Users List Repository
 * Parses /etc/passwd and groups
 */

import "server-only";

import { exec } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "../../../client";
import type { LinuxUsersListResponseOutput } from "./definition";
import type { LinuxUsersListRequestOutput } from "./definition";
import type { UsersListT } from "./i18n";

export class LinuxUsersListRepository {
  private static readonly execAsync = promisify(exec);

  static async list(
    data: LinuxUsersListRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: UsersListT,
  ): Promise<ResponseType<LinuxUsersListResponseOutput>> {
    if (data.connectionId) {
      return LinuxUsersListRepository.listSsh(
        data.connectionId,
        user,
        logger,
        t,
      );
    }

    const isLocalMode = process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "false";
    if (!isLocalMode) {
      return fail({
        message: t("errors.localModeOnly.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    try {
      const passwd = await readFile("/etc/passwd", "utf8");
      const lines = passwd.split("\n").filter(Boolean);

      const users: LinuxUsersListResponseOutput["users"] = [];

      for (const line of lines) {
        const parts = line.split(":");
        if (parts.length < 7) {
          continue;
        }
        const username = parts[0] ?? "";
        const uid = parseInt(parts[2] ?? "0", 10);
        const gid = parseInt(parts[3] ?? "0", 10);
        const homeDir = parts[5] ?? "";
        const shell = parts[6] ?? "";

        if (uid < 1000 || uid >= 65534) {
          continue;
        }

        let groups: string[] = [];
        let locked = false;

        try {
          const { stdout: groupsOut } =
            await LinuxUsersListRepository.execAsync(`groups ${username}`);
          const groupParts = groupsOut.trim().split(/\s+/);
          const colonIdx = groupParts.indexOf(":");
          groups = colonIdx >= 0 ? groupParts.slice(colonIdx + 1) : groupParts;
        } catch {
          /* ignore */
        }

        try {
          const { stdout: passwdStatus } =
            await LinuxUsersListRepository.execAsync(`passwd -S ${username}`);
          locked = passwdStatus.includes(" L ");
        } catch {
          /* ignore */
        }

        users.push({ username, uid, gid, homeDir, shell, groups, locked });
      }

      logger.debug(`Listed ${users.length} Linux users`);
      return success({ users });
    } catch (error) {
      logger.error("Failed to list Linux users", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async listSsh(
    connectionId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: UsersListT,
  ): Promise<ResponseType<LinuxUsersListResponseOutput>> {
    const credsResult = await getConnectionCredentials(
      connectionId,
      user.id!,
      t,
    );
    if (!credsResult.success) {
      return fail({
        message: credsResult.message,
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const clientResult = await openSshClient(credsResult.data, t);
    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { client } = clientResult.data;
    try {
      // Get passwd entries for uid >= 1000 and < 65534
      const { stdout: passwdOut } = await sshExecCommand(
        client,
        "awk -F: '$3 >= 1000 && $3 < 65534 {print}' /etc/passwd",
        30000,
      );

      const lines = passwdOut.split("\n").filter(Boolean);
      const users: LinuxUsersListResponseOutput["users"] = [];

      for (const line of lines) {
        const parts = line.split(":");
        if (parts.length < 7) {
          continue;
        }
        const username = parts[0] ?? "";
        const uid = parseInt(parts[2] ?? "0", 10);
        const gid = parseInt(parts[3] ?? "0", 10);
        const homeDir = parts[5] ?? "";
        const shell = parts[6] ?? "";

        let groups: string[] = [];
        let locked = false;

        try {
          const { stdout: groupsOut } = await sshExecCommand(
            client,
            `groups ${username} 2>/dev/null`,
            5000,
          );
          const groupParts = groupsOut.trim().split(/\s+/);
          const colonIdx = groupParts.indexOf(":");
          groups = colonIdx >= 0 ? groupParts.slice(colonIdx + 1) : groupParts;
        } catch {
          /* ignore */
        }

        try {
          const { stdout: passwdStatus } = await sshExecCommand(
            client,
            `passwd -S ${username} 2>/dev/null`,
            5000,
          );
          locked = passwdStatus.includes(" L ");
        } catch {
          /* ignore */
        }

        users.push({ username, uid, gid, homeDir, shell, groups, locked });
      }

      logger.debug(
        `Listed ${users.length} Linux users on ${credsResult.data.host}`,
      );
      return success({ users });
    } catch (error) {
      logger.error("Failed to list remote Linux users", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
