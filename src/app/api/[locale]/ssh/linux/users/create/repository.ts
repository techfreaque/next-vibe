/**
 * Linux Users Create Repository
 */

import "server-only";

import { exec, spawn } from "node:child_process";
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
import type { UsersCreateT } from "./i18n";

export class LinuxUserCreateRepository {
  private static readonly execAsync = promisify(exec);

  /** Map LoginShell enum values to actual shell paths */
  private static readonly SHELL_PATHS: Record<string, string> = {
    [LoginShell.BASH]: "/bin/bash",
    [LoginShell.ZSH]: "/usr/bin/zsh",
    [LoginShell.SH]: "/bin/sh",
    [LoginShell.FISH]: "/usr/bin/fish",
    [LoginShell.DASH]: "/bin/dash",
    [LoginShell.NOLOGIN]: "/usr/sbin/nologin",
  };

  private static resolveShell(loginShell: string | undefined): string {
    if (!loginShell) {
      return "/bin/bash";
    }
    return LinuxUserCreateRepository.SHELL_PATHS[loginShell] ?? loginShell;
  }

  static async create(
    data: LinuxUserCreateRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: UsersCreateT,
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

    const shell = LinuxUserCreateRepository.resolveShell(data.loginShell);
    const homeDir = data.homeDir ?? `/home/${username}`;
    const groups = data.groups ?? [];
    if (data.sudoAccess) {
      groups.push("sudo");
    }

    const groupsArg = groups.length > 0 ? `--groups ${groups.join(",")}` : "";
    const useraddCmd =
      `useradd --create-home --shell ${shell} --home-dir ${homeDir} ${groupsArg} ${username}`.trim();
    const isRoot = process.getuid?.() === 0;
    const needsSudo = !isRoot;
    const sudoPassword = data.sudoPassword;

    try {
      logger.info(`Creating Linux user: ${username}`);
      if (!needsSudo) {
        await LinuxUserCreateRepository.execAsync(useraddCmd);
      } else if (sudoPassword) {
        await new Promise<void>((resolve, reject) => {
          const args = useraddCmd.split(" ").filter(Boolean);
          const proc = spawn("sudo", ["-S", ...args], {
            stdio: ["pipe", "pipe", "pipe"],
          });
          proc.stdin.write(`${sudoPassword}\n`);
          proc.stdin.end();
          let stderr = "";
          proc.stderr.on("data", (d: Buffer) => {
            stderr += d.toString();
          });
          proc.on("close", (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(stderr));
            }
          });
        });
      } else {
        await LinuxUserCreateRepository.execAsync(`sudo ${useraddCmd}`);
      }

      // Get uid/gid
      const { stdout: idOut } = await LinuxUserCreateRepository.execAsync(
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
      // Extract only stderr, never log the command itself (may contain password)
      const raw = error instanceof Error ? error.message : String(error);
      const stderr = raw
        .split("\n")
        .filter((l) => !l.startsWith("Command failed:"))
        .join("\n");
      if (
        stderr.includes("already exists") ||
        stderr.includes("uid is already in use")
      ) {
        return fail({
          message: t("errors.userAlreadyExists"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      if (
        stderr.includes("hat nicht funktioniert") ||
        stderr.includes("Sorry, try again") ||
        stderr.includes("incorrect password") ||
        stderr.includes("is not allowed to execute")
      ) {
        return fail({
          message: t("errors.sudoAuthFailed"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (
        stderr.includes("Permission denied") ||
        stderr.includes("cannot lock")
      ) {
        return fail({
          message: t("errors.permissionDenied"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("Failed to create Linux user", stderr.slice(0, 200));
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
    t: UsersCreateT,
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

    const shell = LinuxUserCreateRepository.resolveShell(data.loginShell);
    const homeDir = data.homeDir ?? `/home/${username}`;
    const groups = [...(data.groups ?? [])];
    if (data.sudoAccess) {
      groups.push("sudo");
    }

    const groupsArg = groups.length > 0 ? `--groups ${groups.join(",")}` : "";
    const useraddCmd =
      `useradd --create-home --shell ${shell} --home-dir ${homeDir} ${groupsArg} ${username}`.trim();
    const sudoPassword = data.sudoPassword;
    const cmd = sudoPassword
      ? `echo ${JSON.stringify(sudoPassword)} | sudo -S ${useraddCmd}`
      : `sudo ${useraddCmd}`;

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
        if (
          stderr.includes("incorrect password") ||
          stderr.includes("3 incorrect password") ||
          stderr.includes("Sorry, try again") ||
          stderr.includes("is not allowed to execute")
        ) {
          return fail({
            message: t("errors.sudoAuthFailed"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        logger.error("useradd failed", stderr);
        return fail({
          message: t("post.errors.server.title", { error: stderr }),
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
