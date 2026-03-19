import "server-only";

import { exec } from "node:child_process";
import { userInfo } from "node:os";
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
  LinuxUserDeleteRequestOutput,
  LinuxUserDeleteResponseOutput,
} from "./definition";
import type { UsersUsernameT } from "./i18n";

export class LinuxUserDeleteRepository {
  private static readonly execAsync = promisify(exec);
  static async delete(
    data: LinuxUserDeleteRequestOutput,
    logger: EndpointLogger,
    username: string,
    t: UsersUsernameT,
  ): Promise<ResponseType<LinuxUserDeleteResponseOutput>> {
    const isLocalMode = process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "false";
    if (!isLocalMode) {
      return fail({
        message: t("errors.localModeOnly.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Refuse to delete current process user
    const currentUser = userInfo().username;
    if (username === currentUser) {
      return fail({
        message: t("errors.cannotDeleteCurrentUser"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    try {
      const { stdout: uidStr } = await LinuxUserDeleteRepository.execAsync(
        `id -u ${username}`,
      );
      const uid = parseInt(uidStr.trim(), 10);
      if (uid < 1000) {
        return fail({
          message: t("errors.cannotDeleteSystemUser"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    } catch {
      return fail({
        message: t("errors.userNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const removeHome = data.removeHome ? "--remove" : "";
    try {
      logger.info(`Deleting Linux user: ${username}`);
      await LinuxUserDeleteRepository.execAsync(
        `userdel ${removeHome} ${username}`,
      );
      return success({ ok: true });
    } catch (error) {
      logger.error("Failed to delete Linux user", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
