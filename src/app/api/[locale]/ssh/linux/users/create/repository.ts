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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  openSshClient,
  sshExecCommand,
} from "../../../client";
import { LoginShell } from "../../../enum";
import type {
  LinuxUserCreateRequestOutput,
  LinuxUserCreateResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const execAsync = promisify(exec);

/** Map LoginShell enum values to actual shell paths */
const SHELL_PATHS: Record<string, string> = {
  [LoginShell.BASH]: "/bin/bash",
  [LoginShell.ZSH]: "/usr/bin/zsh",
  [LoginShell.SH]: "/bin/sh",
  [LoginShell.FISH]: "/usr/bin/fish",
  [LoginShell.DASH]: "/bin/dash",
  [LoginShell.NOLOGIN]: "/usr/sbin/nologin",
};

function resolveShell(loginShell: string | undefined): string {
  if (!loginShell) {
    return "/bin/bash";
  }
  return SHELL_PATHS[loginShell] ?? loginShell;
}

export class LinuxUserCreateRepository {
  static async create(
    data: LinuxUserCreateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: ModuleT,
  ): Promise<ResponseType<LinuxUserCreateResponseOutput>> {
    if (data.connectionId) {
      return LinuxUserCreateRepository.createSsh(data, user, logger, t);
    }

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

    const shell = resolveShell(data.loginShell);
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

  private static async createSsh(
    data: LinuxUserCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<LinuxUserCreateResponseOutput>> {
    const credsResult = await getConnectionCredentials(
      data.connectionId!,
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
    const username = data.username;

    if (!/^[a-z][a-z0-9-]*$/.test(username) || username.length > 32) {
      client.end();
      return fail({
        message: t("errors.invalidUsername"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const shell = resolveShell(data.loginShell);
    const homeDir = data.homeDir ?? `/home/${username}`;
    const groups = [...(data.groups ?? [])];
    if (data.sudoAccess) {
      groups.push("sudo");
    }

    const groupsArg = groups.length > 0 ? `--groups ${groups.join(",")}` : "";
    const cmd =
      `useradd --create-home --shell ${shell} --home-dir ${homeDir} ${groupsArg} ${username}`.trim();

    try {
      logger.info(
        `Creating Linux user ${username} on ${credsResult.data.host}`,
      );
      const { exitCode, stderr } = await sshExecCommand(client, cmd, 30000);
      if (exitCode !== 0) {
        if (
          stderr.includes("already exists") ||
          stderr.includes("uid is already in use")
        ) {
          return fail({
            message: t("errors.userAlreadyExists"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        logger.error("useradd failed", stderr);
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const { stdout: idOut } = await sshExecCommand(
        client,
        `id -u ${username} && id -g ${username}`,
        5000,
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
      logger.error("Failed to create remote Linux user", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
