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

const execAsync = promisify(exec);

export class LinuxUserDeleteRepository {
  static async delete(
    data: LinuxUserDeleteRequestOutput,
    logger: EndpointLogger,
    username: string,
  ): Promise<ResponseType<LinuxUserDeleteResponseOutput>> {
    const isLocalMode = process.env["NEXT_PUBLIC_LOCAL_MODE"] !== "false";
    if (!isLocalMode) {
      return fail({
        message: "Linux user management is only available in LOCAL_MODE",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Refuse to delete current process user
    const currentUser = userInfo().username;
    if (username === currentUser) {
      return fail({
        message: "Cannot delete the current process user",
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    try {
      const { stdout: uidStr } = await execAsync(`id -u ${username}`);
      const uid = parseInt(uidStr.trim(), 10);
      if (uid < 1000) {
        return fail({
          message: "Cannot delete system users (uid < 1000)",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    } catch {
      return fail({
        message: `User '${username}' not found`,
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const removeHome = data.removeHome ? "--remove" : "";
    try {
      logger.info(`Deleting Linux user: ${username}`);
      await execAsync(`userdel ${removeHome} ${username}`);
      return success({ ok: true });
    } catch (error) {
      logger.error("Failed to delete Linux user", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
