/**
 * Generators endpoint repository — the `vibe gen` surface.
 *
 * Thin endpoint handler over the domain generator (./generator): maps the endpoint's
 * skip flags to per-generator enable/opt-out overrides, runs the orchestrator, and
 * shapes the response.
 *
 * BOOTSTRAP FALLBACK: `bun src/app/api/[locale]/system/tooling/generators/repository.ts`
 * runs the full generation from scratch — even with zero generated files or a broken
 * CLI. The `import.meta.main` block below calls `runGenerators` directly (source-only,
 * never importing `src/generated/*`), so it always works to regenerate the codebase.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType as BaseResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  GenerateAllRequestOutput,
  GenerateAllResponseOutput,
} from "next-vibe/tooling/generators/definition";
import { GeneratorRunner } from "next-vibe/tooling/generators/generator";
import { scopedTranslation } from "next-vibe/tooling/generators/i18n";

export class GenerateAllRepository {
  /** Translate the endpoint's skip flags into per-generator enable overrides. */
  private static overridesFromFlags(
    data: GenerateAllRequestOutput,
  ): Partial<Record<string, boolean>> {
    const overrides: Partial<Record<string, boolean>> = {};
    if (data.skipEndpoints) {
      overrides["endpoint-framework"] = false;
      overrides["remote-capabilities"] = false;
    }
    if (data.skipSeeds) {
      overrides["seeds"] = false;
    }
    if (data.skipTaskIndex) {
      overrides["tasks"] = false;
    }
    return overrides;
  }

  /** Run all (enabled) generators. Called by the `gen` endpoint route. */
  static async generateAll(
    data: GenerateAllRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<BaseResponseType<GenerateAllResponseOutput>> {
    try {
      const result = await GeneratorRunner.runGenerators({
        logger,
        force: data.force,
        overrides: GenerateAllRepository.overridesFromFlags(data),
      });

      if (result.failed.length > 0) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: result.failed.map((f) => `${f.key}: ${f.error}`).join("; "),
          },
        });
      }

      return success({
        success: true,
        generationCompleted: true,
        output: result.output.join("\n"),
        generationStats: {
          totalGenerators: GeneratorRunner.REGISTRY.length,
          generatorsRun: result.ran.length,
          generatorsSkipped: result.skipped.length,
          outputDirectory: data.outputDir || "src/generated",
          functionalGeneratorsCompleted: result.ran.length > 0,
        },
      });
    } catch (error) {
      const errorMessage = parseError(error);
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage.message },
      });
    }
  }
}

/**
 * Bootstrap CLI entry: `bun repository.ts` regenerates everything from scratch.
 * Calls the orchestrator directly (no endpoint definition / no generated-file
 * imports) so it works even when the CLI or generated registry is broken.
 */
if (import.meta.main) {
  const logger = createEndpointLogger(false, "en-US");
  void GeneratorRunner.runGenerators({ logger }).then((r) => {
    logger.info(r.output.join("\n"));
    if (r.failed.length > 0) {
      logger.error(
        `Generation failed: ${r.failed.map((f) => f.key).join(", ")}`,
      );
    }
    return undefined;
  });
}
