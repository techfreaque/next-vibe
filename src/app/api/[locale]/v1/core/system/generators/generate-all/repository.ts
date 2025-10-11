/**
 * Generate All Repository
 * Orchestrates all generator operations in parallel
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/definition";
import type endpoints from "./definition";

type RequestType = typeof endpoints.POST.types.RequestOutput;
type GenerateAllResponseType = typeof endpoints.POST.types.ResponseOutput;

/**
 * Generate All Repository Interface
 */
interface GenerateAllRepository {
  generateAll(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<GenerateAllResponseType>>;
}

/**
 * Generate All Repository Implementation
 */
class GenerateAllRepositoryImpl implements GenerateAllRepository {
  async generateAll(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<GenerateAllResponseType>> {
    const GENERATING_VIBE = "🚀 Generating some vibe...";
    const RUNNING_GENERATORS = "Step 1: Running all generators in parallel...";
    const GENERATION_SUCCESS = "✅ Vibe generation completed successfully!";

    const outputLines: string[] = [];
    let generatorsRun = 0;
    let generatorsSkipped = 0;
    let functionalGeneratorsCompleted = false;

    try {
      outputLines.push(GENERATING_VIBE);
      outputLines.push(RUNNING_GENERATORS);

      // Run all generators in parallel
      const generatorPromises = [];

      // 1. Functional Generators - Call the full functional generator system
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("📝 Running functional generators...");
              const functionalModule = await import(
                "next-vibe/cli-do-not-import-from-here/scripts/generators/functional"
              );
              const { runFunctionalGenerators } = functionalModule;
              runFunctionalGenerators({
                rootDir: "src",
              });
              outputLines.push(
                "✅ Functional generators completed successfully",
              );
              generatorsRun++;
              return "functional-generators";
            } catch (error) {
              outputLines.push(
                `❌ Functional generators failed: ${parseError(error)}`,
              );
              return null;
            }
          })(),
        );
      } else {
        generatorsSkipped++;
      }

      // 2. Seeds Generator - Call the actual generator function directly
      if (!data.skipSeeds) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("🌱 Generating seeds...");
              const seedsModule = await import(
                "next-vibe/cli-do-not-import-from-here/scripts/generators/functional/generate-seeds"
              );
              const { generateSeeds } = seedsModule;
              generateSeeds("src");
              outputLines.push("✅ Seeds generated successfully");
              generatorsRun++;
              return "seeds";
            } catch (error) {
              outputLines.push(
                `❌ Seeds generator failed: ${parseError(error)}`,
              );
              return null;
            }
          })(),
        );
      } else {
        generatorsSkipped++;
      }

      // 3. Task Index Generator - Enhanced with better error handling
      if (!data.skipTaskIndex) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("📋 Generating task index...");
              const { taskIndexGeneratorRepository } = await import(
                "../task-index/repository"
              );

              const result =
                await taskIndexGeneratorRepository.generateTaskIndex(
                  {
                    outputFile:
                      "src/app/api/[locale]/v1/core/system/tasks/generated/tasks-index.ts",
                    dryRun: false,
                  },
                  user,
                  locale,
                  logger,
                );

              if (result.success) {
                outputLines.push(
                  `✅ Task index generated successfully: ${result.data.message}`,
                );
                generatorsRun++;
                return "task-index";
              } else {
                outputLines.push(
                  `❌ Task index generation failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Task index generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        outputLines.push("⏭️  Task index generation skipped");
        generatorsSkipped++;
      }

      // 4. tRPC Router Generator - Now handled by functional generators above
      // No separate tRPC generation needed

      // Wait for all generators to complete
      const results = await Promise.allSettled(generatorPromises);
      const completedGenerators = results
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      functionalGeneratorsCompleted = completedGenerators.length > 0;

      outputLines.push(GENERATION_SUCCESS);

      return createSuccessResponse({
        success: true,
        generationCompleted: true,
        output: outputLines.join("\n"),
        generationStats: {
          totalGenerators: 4,
          generatorsRun,
          generatorsSkipped,
          outputDirectory:
            data.outputDir || "src/app/api/[locale]/v1/core/system/generated",
          functionalGeneratorsCompleted,
        },
      });
    } catch (error) {
      // Generation failed
      const errorMessage = parseError(error);
      outputLines.push(`❌ Generation failed: ${errorMessage}`);

      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage.message },
      );
    }
  }
}

export const generateAllRepository = new GenerateAllRepositoryImpl();
