/**
 * Generate Key Repository
 * Returns a cryptographically secure random 64-char hex key
 */

import "server-only";

import { randomBytes } from "node:crypto";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { GenerateKeyT } from "next-vibe/env/settings/generate-key/i18n";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { GenerateKeyResponseOutput } from "./definition";

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
