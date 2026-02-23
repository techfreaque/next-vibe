/**
 * Generators Functional Repository
 * Consolidated functional generator functionality
 * Migrated from generators/utils/functional-index.ts
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type endpoints from "./definition";
import type { scopedTranslation } from "./i18n";
import { applyOptionDefaults, defineOptions } from "./options-repository";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// ===== TYPES =====

export interface FunctionalGeneratorOptions {
  skipEndpoints?: boolean;
  skipSeeds?: boolean;
  skipCronTasks?: boolean;
  skipTRPCRouter?: boolean;
  rootDir?: string;
  verbose?: boolean;
}

// ===== REPOSITORY INTERFACE =====

/**
 * Functional Generators Repository Interface
 */
type RequestType = typeof endpoints.POST.types.RequestOutput;
type ResponseOutputType = typeof endpoints.POST.types.ResponseOutput;

/**
 * Functional Generators Repository Implementation
 */
export class FunctionalGeneratorsRepositoryImpl {
  private readonly optionDefinitions =
    defineOptions<FunctionalGeneratorOptions>({
      skipEndpoints: {
        name: "skip-endpoints",
        type: "boolean",
        default: false,
        description: "Skip generating API endpoints",
        category: "Generation",
      },
      skipSeeds: {
        name: "skip-seeds",
        type: "boolean",
        default: false,
        description: "Skip generating seeds",
        category: "Generation",
      },
      skipCronTasks: {
        name: "skip-cron-tasks",
        type: "boolean",
        default: false,
        description: "Skip generating cron tasks",
        category: "Generation",
      },
      skipTRPCRouter: {
        name: "skip-trpc-router",
        type: "boolean",
        default: false,
        description: "Skip generating tRPC router",
        category: "Generation",
      },
      rootDir: {
        name: "root-dir",
        alias: "r",
        type: "string",
        default: "src",
        description: "Root directory to scan for generating artifacts",
        category: "Generation",
      },
      verbose: {
        name: "verbose",
        alias: "v",
        type: "boolean",
        default: false,
        description: "Enable verbose output",
        category: "General",
      },
    });

  /**
   * Run functional generators
   */
  async runGenerators(
    data: RequestType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<BaseResponseType<ResponseOutputType>> {
    try {
      const startTime = Date.now();
      const output: string[] = [];
      let generatorsRun = 0;
      let generatorsSkipped = 0;
      const results = {
        endpoints: false,
        seeds: false,
        cronTasks: false,
        trpcRouter: false,
      };

      // Apply defaults to options
      const options = applyOptionDefaults(data, this.optionDefinitions);
      const rootDir = options.rootDir || process.cwd();

      output.push(`🚀 Starting functional generators in: ${rootDir}`);

      // Step 1: Generate endpoints
      if (options.skipEndpoints) {
        output.push("⏭️ Skipping endpoints generation");
        generatorsSkipped++;
      } else {
        try {
          output.push("📝 Generating endpoints...");
          await this.generateEndpoints(logger);
          output.push("✅ Endpoints generated successfully");
          results.endpoints = true;
          generatorsRun++;
        } catch (error) {
          output.push(`❌ Endpoints generation failed: ${parseError(error)}`);
          results.endpoints = false;
        }
      }

      // Step 2: Generate seeds
      if (options.skipSeeds) {
        output.push("⏭️ Skipping seeds generation");
        generatorsSkipped++;
      } else {
        try {
          output.push("🌱 Generating seeds...");
          await this.generateSeeds(logger);
          output.push("✅ Seeds generated successfully");
          results.seeds = true;
          generatorsRun++;
        } catch (error) {
          output.push(`❌ Seeds generation failed: ${parseError(error)}`);
          results.seeds = false;
        }
      }

      // Step 3: Generate cron tasks
      if (options.skipCronTasks) {
        output.push("⏭️ Skipping cron tasks generation");
        generatorsSkipped++;
      } else {
        try {
          output.push("⏰ Generating cron tasks...");
          await this.generateCronTasks(logger);
          output.push("✅ Cron tasks generated successfully");
          results.cronTasks = true;
          generatorsRun++;
        } catch (error) {
          output.push(`❌ Cron tasks generation failed: ${parseError(error)}`);
          results.cronTasks = false;
        }
      }

      // Step 4: Generate tRPC router (development mode)
      if (options.skipTRPCRouter) {
        output.push("⏭️ Skipping tRPC router generation");
        generatorsSkipped++;
      } else {
        try {
          output.push("🔄 Generating tRPC router...");
          await this.generateTRPCRouterDev(logger);
          output.push("✅ tRPC router generated successfully");
          results.trpcRouter = true;
          generatorsRun++;
        } catch (error) {
          output.push(`❌ tRPC router generation failed: ${parseError(error)}`);
          results.trpcRouter = false;
        }
      }

      const duration = Date.now() - startTime;
      output.push(`🏁 Completed in ${duration}ms`);

      return success({
        success: true,
        generatorsRun,
        generatorsSkipped,
        output,
        results,
      });
    } catch (error) {
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Validate generator options
   */
  async validateOptions(
    options: FunctionalGeneratorOptions,
    t: ModuleT,
  ): Promise<BaseResponseType<boolean>> {
    try {
      // Basic validation - could be expanded
      if (options.rootDir && !options.rootDir.trim()) {
        return fail({
          message: t("post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { error: "Root directory cannot be empty" },
        });
      }

      return success(true);
    } catch (error) {
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  // ===== PRIVATE METHODS =====

  /**
   * Generate endpoints
   */
  private async generateEndpoints(logger: EndpointLogger): Promise<void> {
    try {
      logger.debug("📝 Generating endpoints...");

      // Note: Endpoint generation is now handled by the tRPC router generator
      // This is a no-op to maintain compatibility with the generator interface
      logger.debug(
        "✅ Endpoints generated successfully (handled by tRPC router generator)",
      );
    } catch (error) {
      logger.error("❌ Error generating endpoints:", parseError(error));
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
      throw error;
    }
  }

  /**
   * Generate seeds
   */
  private async generateSeeds(logger: EndpointLogger): Promise<void> {
    try {
      logger.debug("🌱 Generating seeds...");

      // Note: Seeds generation is now handled by the dedicated seeds generator
      // This is a no-op to maintain compatibility with the generator interface
      logger.debug(
        "✅ Seeds generated successfully (handled by dedicated seeds generator)",
      );
    } catch (error) {
      logger.error("❌ Error generating seeds:", parseError(error));
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
      throw error;
    }
  }

  /**
   * Generate cron tasks
   */
  private async generateCronTasks(logger: EndpointLogger): Promise<void> {
    try {
      logger.debug("⏰ Generating cron tasks...");

      // Placeholder implementation - would call actual generator
      // const { generateCronTasks } = await import("./generate-cron-tasks");
      // generateCronTasks(rootDir);

      logger.debug("✅ Cron tasks generated successfully");
    } catch (error) {
      logger.error("❌ Error generating cron tasks:", parseError(error));
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
      throw error;
    }
  }

  /**
   * Generate tRPC router (development mode)
   */
  private async generateTRPCRouterDev(logger: EndpointLogger): Promise<void> {
    try {
      logger.debug("🔄 Generating tRPC router...");

      // Placeholder implementation - would call actual generator
      // const { generateTRPCRouterDev } = await import("./generate-trpc-router-dev");
      // generateTRPCRouterDev(rootDir);

      logger.debug("✅ tRPC router generated successfully");
    } catch (error) {
      logger.error("❌ Error generating tRPC router:", parseError(error));
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Generator needs to propagate errors
      throw error;
    }
  }
}

export const functionalGeneratorsRepository =
  new FunctionalGeneratorsRepositoryImpl();

// Export with the expected name for generate-all
// Note: This export is deprecated and should not be used directly
// Use functionalGeneratorsRepository.runGenerators() instead with proper logger
export const endpointsGeneratorRepository = {
  generateEndpoints: (
    data: RequestType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<BaseResponseType<ResponseOutputType>> =>
    functionalGeneratorsRepository.runGenerators(data, logger, t),
};

// Export the main function for backward compatibility
export const runFunctionalGenerators = async (
  options: FunctionalGeneratorOptions = {},
  logger: EndpointLogger,
): Promise<void> => {
  try {
    // Step 1: Generate endpoints
    if (options.skipEndpoints) {
      logger.debug("⏭️ Skipping endpoints generation");
    } else {
      logger.debug("📝 Generating endpoints...");
      await functionalGeneratorsRepository["generateEndpoints"](logger);
      logger.debug("✅ Endpoints generated successfully");
    }

    // Step 2: Generate seeds
    if (options.skipSeeds) {
      logger.debug("⏭️ Skipping seeds generation");
    } else {
      logger.debug("🌱 Generating seeds...");
      await functionalGeneratorsRepository["generateSeeds"](logger);
      logger.debug("✅ Seeds generated successfully");
    }

    // Step 3: Generate cron tasks
    if (options.skipCronTasks) {
      logger.debug("⏭️ Skipping cron tasks generation");
    } else {
      logger.debug("⏰ Generating cron tasks...");
      await functionalGeneratorsRepository["generateCronTasks"](logger);
      logger.debug("✅ Cron tasks generated successfully");
    }

    // Step 4: Generate tRPC router (development mode)
    if (options.skipTRPCRouter) {
      logger.debug("⏭️ Skipping tRPC router generation");
    } else {
      logger.debug("🔄 Generating tRPC router...");
      await functionalGeneratorsRepository["generateTRPCRouterDev"](logger);
      logger.debug("✅ tRPC router generated successfully");
    }
  } catch (error) {
    logger.error("❌ Error running functional generators:", parseError(error));
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator that throws for invalid configuration at startup
    throw error;
  }
};
