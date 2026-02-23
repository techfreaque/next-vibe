/**
 * Linux Users Create Repository
 */

import "server-only";

import { exec } from "node:child_process";
import { promisify } from "node:util";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  LinuxUserCreateRequestOutput,
  LinuxUserCreateResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const execAsync = promisify(exec);

export class LinuxUserCreateRepository {
  static async create(
    data: LinuxUserCreateRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<LinuxUserCreateResponseOutput>> {
    const isLocalMode = process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "false";
    if (!isLocalMode) {
      return fail({
        message: t("errors.localModeOnly.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const username = data.username;
    if (!/^[a-z][a-z0-9-]*$/.test(username) || username.length > 32) {
      return fail({
        message: t("errors.invalidUsername"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const shell = data.loginShell ?? "/bin/bash";
    const homeDir = data.homeDir ?? `/home/${username}`;
    const groups = data.groups ?? [];
    if (data.sudoAccess) {
      groups.push("sudo");
    }

    const groupsArg = groups.length > 0 ? `--groups ${groups.join(",")}` : "";
    const cmd =
      `useradd --create-home --shell ${shell} --home-dir ${homeDir} ${groupsArg} ${username}`.trim();

    try {
      logger.info(`Creating Linux user: ${username}`);
      await execAsync(cmd);

      // Get uid/gid
      const { stdout: idOut } = await execAsync(
        `id -u ${username} && id -g ${username}`,
      );
      const [uidStr, gidStr] = idOut.trim().split("\n");
      const uid = parseInt(uidStr ?? "0", 10);
      const gid = parseInt(gidStr ?? "0", 10);

      return success({
        ok: true,
        uid,
        gid,
        homeDirectory: homeDir,
        shellPath: shell,
      });
    } catch (error) {
      const errMsg = String(parseError(error));
      if (
        errMsg.includes("already exists") ||
        errMsg.includes("uid is already in use")
      ) {
        return fail({
          message: t("errors.userAlreadyExists"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      logger.error("Failed to create Linux user", errMsg);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
