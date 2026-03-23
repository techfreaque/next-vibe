/**
 * Vibe Sense - Run Config Repository
 * Executes a graph from an inline config without DB persistence
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { runGraph } from "../engine/runner";
import { graphConfigSchema } from "../graph/schema";

import type {
  RunConfigRequestOutput,
  RunConfigResponseOutput,
} from "./definition";
import type { VibeSenseRunConfigT } from "./i18n";

export class RunConfigRepository {
  static async execute(
    data: RunConfigRequestOutput,
    logger: EndpointLogger,
    t: VibeSenseRunConfigT,
  ): Promise<ResponseType<RunConfigResponseOutput>> {
    try {
      const parsed = graphConfigSchema.safeParse(data.config);
      if (!parsed.success) {
        return fail({
          message: t("post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { error: parsed.error.message },
        });
      }

      const range = {
        from: new Date(data.rangeFrom),
        to: new Date(data.rangeTo),
      };

      const graphId = `inline-${Date.now().toString()}`;
      const result = await runGraph(graphId, parsed.data, range);

      return success({
        nodeCount: result.series.size + result.signals.size,
        errorCount: result.errors.length,
        errors: result.errors,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("[vibe-sense] run-config failed", parsedError);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
