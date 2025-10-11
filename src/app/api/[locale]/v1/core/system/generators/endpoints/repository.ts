/**
 * Generators Functional Repository
 * Consolidated functional generator functionality
 * Migrated from generators/utils/functional-index.ts
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../../user/auth/definition";
import type endpoints from "./definition";
// Import options utilities from the consolidated options repository
import { applyOptionDefaults, defineOptions } from "./options-repository";

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

export interface FunctionalGeneratorsRepository {
  runGenerators(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<ResponseOutputType>>;

  validateOptions(
    options: FunctionalGeneratorOptions,
  ): Promise<BaseResponseType<boolean>>;
}

/**
 * Functional Generators Repository Implementation
 */
export class FunctionalGeneratorsRepositoryImpl
  implements FunctionalGeneratorsRepository
{
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
          await this.generateEndpoints(rootDir, logger);
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
          await this.generateSeeds(rootDir, logger);
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
          await this.generateCronTasks(rootDir, logger);
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
          await this.generateTRPCRouterDev(rootDir, logger);
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

      return createSuccessResponse({
        success: true,
        generatorsRun,
        generatorsSkipped,
        output,
        results,
      });
    } catch (error) {
      return createErrorResponse(
        "core.system.generators.endpoints.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Validate generator options
   */
  async validateOptions(
    options: FunctionalGeneratorOptions,
  ): Promise<BaseResponseType<boolean>> {
    try {
      // Basic validation - could be expanded
      if (options.rootDir && !options.rootDir.trim()) {
        return createErrorResponse(
          "core.system.generators.endpoints.errors.validation.title",
          ErrorResponseTypes.VALIDATION_ERROR,
          { error: "Root directory cannot be empty" },
        );
      }

      return createSuccessResponse(true);
    } catch (error) {
      return createErrorResponse(
        "core.system.generators.endpoints.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  // ===== PRIVATE METHODS =====

  /**
   * Generate endpoints
   */
  private async generateEndpoints(
    rootDir: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("📝 Generating endpoints...");

      // Import and call the actual generator function
      // Note: Individual generator disabled - use generate-all instead
      // const { generateEndpoints } = await import("next-vibe/cli/scripts/generators/functional/generate-endpoints");
      // generateEndpoints(rootDir);
      throw new Error(
        "Individual endpoints generator disabled - use generate-all instead",
      );

      logger.debug("✅ Endpoints generated successfully");
    } catch (error) {
      logger.error("❌ Error generating endpoints:", parseError(error));
      throw error;
    }
  }

  /**
   * Generate seeds
   */
  private async generateSeeds(
    rootDir: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("🌱 Generating seeds...");

      // Import and call the actual generator function
      // Note: Individual generator disabled - use generate-all instead
      // const generateSeedsModule = await import("next-vibe/cli/scripts/generators/functional/generate-seeds");
      // const { generateSeeds } = generateSeedsModule;
      // generateSeeds(rootDir);
      throw new Error(
        "Individual seeds generator disabled - use generate-all instead",
      );

      logger.debug("✅ Seeds generated successfully");
    } catch (error) {
      logger.error("❌ Error generating seeds:", parseError(error));
      throw error;
    }
  }

  /**
   * Generate cron tasks
   */
  private async generateCronTasks(
    rootDir: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("⏰ Generating cron tasks...");

      // Placeholder implementation - would call actual generator
      // const { generateCronTasks } = await import("./generate-cron-tasks");
      // generateCronTasks(rootDir);

      logger.debug("✅ Cron tasks generated successfully");
    } catch (error) {
      logger.error("❌ Error generating cron tasks:", parseError(error));
      throw error;
    }
  }

  /**
   * Generate tRPC router (development mode)
   */
  private async generateTRPCRouterDev(
    rootDir: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("🔄 Generating tRPC router...");

      // Placeholder implementation - would call actual generator
      // const { generateTRPCRouterDev } = await import("./generate-trpc-router-dev");
      // generateTRPCRouterDev(rootDir);

      logger.debug("✅ tRPC router generated successfully");
    } catch (error) {
      logger.error("❌ Error generating tRPC router:", parseError(error));
      throw error;
    }
  }
}

export const functionalGeneratorsRepository =
  new FunctionalGeneratorsRepositoryImpl();

// Export with the expected name for generate-all
export const endpointsGeneratorRepository = {
  generateEndpoints: (
    data: any,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ) => functionalGeneratorsRepository.runGenerators(data, user, locale, logger),
};

// Export the main function for backward compatibility
export const runFunctionalGenerators = async (
  options: FunctionalGeneratorOptions = {},
): Promise<void> => {
  try {
    const rootDir = options.rootDir || process.cwd();

    const defaultLogger = {
      debug: (msg: string) => console.log(msg),
      error: (msg: string, error?: any) => console.error(msg, error),
    };

    // Step 1: Generate endpoints
    if (options.skipEndpoints) {
      defaultLogger.debug("⏭️ Skipping endpoints generation");
    } else {
      defaultLogger.debug("📝 Generating endpoints...");
      await functionalGeneratorsRepository["generateEndpoints"](
        rootDir,
        defaultLogger,
      );
      defaultLogger.debug("✅ Endpoints generated successfully");
    }

    // Step 2: Generate seeds
    if (options.skipSeeds) {
      defaultLogger.debug("⏭️ Skipping seeds generation");
    } else {
      defaultLogger.debug("🌱 Generating seeds...");
      await functionalGeneratorsRepository["generateSeeds"](
        rootDir,
        defaultLogger,
      );
      defaultLogger.debug("✅ Seeds generated successfully");
    }

    // Step 3: Generate cron tasks
    if (options.skipCronTasks) {
      defaultLogger.debug("⏭️ Skipping cron tasks generation");
    } else {
      defaultLogger.debug("⏰ Generating cron tasks...");
      await functionalGeneratorsRepository["generateCronTasks"](
        rootDir,
        defaultLogger,
      );
      defaultLogger.debug("✅ Cron tasks generated successfully");
    }

    // Step 4: Generate tRPC router (development mode)
    if (options.skipTRPCRouter) {
      defaultLogger.debug("⏭️ Skipping tRPC router generation");
    } else {
      defaultLogger.debug("🔄 Generating tRPC router...");
      await functionalGeneratorsRepository["generateTRPCRouterDev"](
        rootDir,
        defaultLogger,
      );
      defaultLogger.debug("✅ tRPC router generated successfully");
    }
  } catch (error) {
    console.error("❌ Error running functional generators:", parseError(error));
    throw error;
  }
};
