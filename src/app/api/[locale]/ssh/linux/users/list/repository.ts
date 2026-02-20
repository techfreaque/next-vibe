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

import type { LinuxUsersListResponseOutput } from "./definition";

const execAsync = promisify(exec);

export class LinuxUsersListRepository {
  static async list(
    logger: EndpointLogger,
  ): Promise<ResponseType<LinuxUsersListResponseOutput>> {
    const isLocalMode = process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "false";
    if (!isLocalMode) {
      return fail({
        message: "Linux user management is only available in LOCAL_MODE",
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
          const { stdout: groupsOut } = await execAsync(`groups ${username}`);
          const groupParts = groupsOut.trim().split(/\s+/);
          const colonIdx = groupParts.indexOf(":");
          groups = colonIdx >= 0 ? groupParts.slice(colonIdx + 1) : groupParts;
        } catch {
          /* ignore */
        }

        try {
          const { stdout: passwdStatus } = await execAsync(
            `passwd -S ${username}`,
          );
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
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
