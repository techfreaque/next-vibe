/**
 * Vibe Sense - Run Config Repository
 * Executes a graph from an inline config without DB persistence
 */

import "server-only";

import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { runGraph } from "../engine/runner";
import { graphConfigSchema } from "../graph/schema";
import type { VibeSenseRunConfigT } from "./i18n";
import type { EndpointLogger } from "../../logger/types";

import type {
  RunConfigRequestOutput,
  RunConfigResponseOutput,
} from "./definition";

export class RunConfigRepository {
  static async execute(
    data: RunConfigRequestOutput,
    logger: EndpointLogger,
    t: VibeSenseRunConfigT,
  ): Promise<ResponseType<RunConfigResponseOutput>> {
    try {
      const parsed = graphConfigSchema.safeParse(data.config);
      if (!parsed.success) {
        // The `title`/`description` pair is the definition's declared
        // VALIDATION_ERROR label and renders param-free there.
        return fail({
          message: t("post.errors.validation.detail", {
            error: parsed.error.message,
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
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
        message: t("post.errors.server.detail", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
