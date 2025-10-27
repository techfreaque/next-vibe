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

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
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

      // 1. Endpoints Generator - Generate endpoints and tRPC routers
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("📝 Running endpoints generator...");
              const { functionalGeneratorsRepository } = await import(
                "../endpoints/repository"
              );

              const result = await functionalGeneratorsRepository.runGenerators(
                {
                  skipEndpoints: false,
                  skipSeeds: true,
                  skipCronTasks: true,
                  skipTRPCRouter: false,
                  rootDir: "src",
                  verbose: false,
                },
                user,
                locale,
                logger,
              );

              if (result.success) {
                outputLines.push(
                  "✅ Endpoints generator completed successfully",
                );
                generatorsRun++;
                return "endpoints";
              } else {
                outputLines.push(
                  `❌ Endpoints generator failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Endpoints generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        generatorsSkipped++;
      }

      // 2. Seeds Generator - Generate seed index
      if (!data.skipSeeds) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("🌱 Generating seeds...");
              const { seedsGeneratorRepository } = await import(
                "../seeds/repository"
              );

              const result = await seedsGeneratorRepository.generateSeeds(
                {
                  outputDir: "src/app/api/[locale]/v1/core/system/generated",
                  includeTestData: true,
                  includeProdData: true,
                  verbose: false,
                  dryRun: false,
                },
                user,
                locale,
                logger,
              );

              if (result.success) {
                outputLines.push("✅ Seeds generated successfully");
                generatorsRun++;
                return "seeds";
              } else {
                outputLines.push(
                  `❌ Seeds generator failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Seeds generator failed: ${parseError(error).message}`,
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
      const completedGenerators: string[] = [];

      for (const result of results) {
        if (result.status === "fulfilled" && result.value !== null) {
          completedGenerators.push(result.value);
        }
      }

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
        "app.api.v1.core.system.generators.generateAll.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage.message },
      );
    }
  }
}

export const generateAllRepository = new GenerateAllRepositoryImpl();
