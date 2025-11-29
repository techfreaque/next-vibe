/**
 * Generate All Repository
 * Orchestrates all generator operations in parallel
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  type EndpointLogger,
  createEndpointLogger,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type endpoints from "./definition";
import { defaultLocale } from "@/i18n/core/config";

type RequestType = typeof endpoints.POST.types.RequestOutput;
type GenerateAllResponseType = typeof endpoints.POST.types.ResponseOutput;

/**
 * Generate All Repository Interface
 */
interface GenerateAllRepository {
  generateAll(
    data: RequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<GenerateAllResponseType>>;
}

/**
 * Generate All Repository Implementation
 */
class GenerateAllRepositoryImpl implements GenerateAllRepository {
  async generateAll(
    data: RequestType,
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

      // 1. Endpoints Generator - Generate endpoints index (singleton pattern)
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("📝 Generating endpoints index (singleton)...");
              const { endpointsIndexGeneratorRepository } =
                await import("../endpoints-index/repository");

              const result =
                await endpointsIndexGeneratorRepository.generateEndpointsIndex(
                  {
                    outputFile:
                      "src/app/api/[locale]/v1/core/system/generated/endpoints.ts",
                    dryRun: false,
                  },
                  logger,
                );

              if (result.success) {
                outputLines.push("✅ Endpoints index generated successfully");
                generatorsRun++;
                return "endpoints";
              } else {
                outputLines.push(
                  `❌ Endpoints index generation failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Endpoints index generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        generatorsSkipped++;
      }

      // 1a. Endpoint Generator - Generate endpoint.ts with dynamic imports
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("📝 Generating endpoint (dynamic imports)...");
              const { endpointGeneratorRepository } =
                await import("../endpoint/repository");

              const result = await endpointGeneratorRepository.generateEndpoint(
                {
                  outputFile:
                    "src/app/api/[locale]/v1/core/system/generated/endpoint.ts",
                  dryRun: false,
                },
                logger,
              );

              if (result.success) {
                outputLines.push("✅ Endpoint generated successfully");
                generatorsRun++;
                return "endpoint";
              } else {
                outputLines.push(
                  `❌ Endpoint generation failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Endpoint generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 1b. Route Handlers Generator - Generate route-handlers.ts with dynamic imports
      if (!data.skipEndpoints) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push(
                "📝 Generating route handlers (dynamic imports)...",
              );
              const { routeHandlersGeneratorRepository } =
                await import("../route-handlers/repository");

              const result =
                await routeHandlersGeneratorRepository.generateRouteHandlers(
                  {
                    outputFile:
                      "src/app/api/[locale]/v1/core/system/generated/route-handlers.ts",
                    dryRun: false,
                  },
                  logger,
                );

              if (result.success) {
                outputLines.push("✅ Route handlers generated successfully");
                generatorsRun++;
                return "route-handlers";
              } else {
                outputLines.push(
                  `❌ Route handlers generation failed: ${result.message || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ Route handlers generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      }

      // 2. Seeds Generator - Generate seed index
      if (!data.skipSeeds) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("🌱 Generating seeds...");
              const { seedsGeneratorRepository } =
                await import("../seeds/repository");

              const result = await seedsGeneratorRepository.generateSeeds(
                {
                  outputDir: "src/app/api/[locale]/v1/core/system/generated",
                  includeTestData: true,
                  includeProdData: true,
                  dryRun: false,
                },
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
              const { taskIndexGeneratorRepository } =
                await import("../task-index/repository");

              const result =
                await taskIndexGeneratorRepository.generateTaskIndex(
                  {
                    outputFile:
                      "src/app/api/[locale]/v1/core/system/generated/tasks-index.ts",
                    dryRun: false,
                  },
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

      // 4. tRPC Router Generator
      if (!data.skipTrpc) {
        generatorPromises.push(
          (async (): Promise<string | null> => {
            try {
              outputLines.push("🔌 Generating tRPC router...");
              const { generateTrpcRouterRepository } =
                await import("../generate-trpc-router/repository");

              const result =
                await generateTrpcRouterRepository.generateTrpcRouter(
                  {
                    apiDir: "src/app/api",
                    outputFile:
                      "src/app/api/[locale]/v1/core/system/unified-interface/trpc/[...trpc]/router.ts",
                    includeWarnings: false,
                    excludePatterns: [],
                  },
                  logger,
                );

              if (result.success && result.data) {
                outputLines.push(
                  `✅ tRPC router generated successfully: ${result.data.output}`,
                );
                generatorsRun++;
                return "trpc-router";
              } else {
                outputLines.push(
                  `❌ tRPC router generation failed: ${result.errorType?.errorKey || "Unknown error"}`,
                );
                return null;
              }
            } catch (error) {
              outputLines.push(
                `❌ tRPC router generator failed: ${parseError(error).message}`,
              );
              return null;
            }
          })(),
        );
      } else {
        outputLines.push("⏭️  tRPC router generation skipped");
        generatorsSkipped++;
      }

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

      return success({
        success: true,
        generationCompleted: true,
        output: outputLines.join("\n"),
        generationStats: {
          totalGenerators: 6,
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

      return fail({
        message:
          "app.api.v1.core.system.generators.generateAll.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage.message },
      });
    }
  }
}

export const generateAllRepository = new GenerateAllRepositoryImpl();

if (import.meta.main && Bun.main === import.meta.path) {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  void generateAllRepository
    .generateAll(
      {
        skipEndpoints: false,
        skipSeeds: false,
        skipTaskIndex: false,
        skipTrpc: false,
        verbose: false,
        outputDir: "src/app/api/[locale]/v1/core/system/generated",
      },
      logger,
    )
    .then((result) => {
      if (result.success && result.data) {
        logger.info(result.data.output);
      }
      return;
    })
    .catch((error) => {
      logger.error("❌ Generation failed:", error);
    });
}
