/**
 * Generate Key Repository
 * Returns a cryptographically secure random 64-char hex key
 */

import "server-only";

import { randomBytes } from "node:crypto";

import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import type { GenerateKeyResponseOutput } from "./definition";
import type { GenerateKeyT } from "./i18n";

export class GenerateKeyRepository {
  static generate(
    logger: EndpointLogger,
    t: GenerateKeyT,
  ): ResponseType<GenerateKeyResponseOutput> {
    try {
      const key = randomBytes(32).toString("hex");
      return success({ key });
    } catch (error) {
      logger.error("Failed to generate key", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
