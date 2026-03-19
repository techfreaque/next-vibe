/**
 * Generate tRPC Router Repository
 * Handles tRPC router generation from API routes
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
// Import types from the endpoint definition
import type {
  GenerateTrpcRouterRequestOutput,
  GenerateTrpcRouterResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

/**
 * Generate tRPC Router Repository
 */
export class GenerateTrpcRouterRepository {
  static async generateTrpcRouter(
    data: GenerateTrpcRouterRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GenerateTrpcRouterResponseOutput>> {
    try {
      // Execute tRPC router generation based on the original logic
      const result =
        await GenerateTrpcRouterRepository.executeTrpcRouterGeneration(
          data,
          logger,
        );

      const response: GenerateTrpcRouterResponseOutput = {
        success: result.success,
        generationCompleted: result.generationCompleted,
        output: result.output,
        generationStats: result.generationStats,
      };

      return success(response);
    } catch (error) {
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Execute tRPC router generation using the original logic from generate-trpc-router.ts
   */
  private static async executeTrpcRouterGeneration(
    data: GenerateTrpcRouterRequestOutput,
    logger: EndpointLogger,
  ): Promise<{
    success: boolean;
    generationCompleted: boolean;
    output: string;
    generationStats: {
      totalRoutes: number;
      validRoutes: number;
      invalidRoutes: number;
      routesWithWarnings: number;
      routerGenerated: boolean;
      executionTimeMs: number;
    };
  }> {
    const SCANNING_ROUTES = "🔍 Scanning API routes for tRPC generation...";
    const GENERATING_ROUTER = "📝 Generating tRPC router...";
    const GENERATION_SUCCESS = "✅ tRPC router generated successfully!";
    const WARNINGS_FOUND = "⚠️  Found";
    const ROUTES_WITH_WARNINGS = "routes with warnings";

    const outputLines: string[] = [];
    const startTime = Date.now();
    let totalRoutes = 0;
    let validRoutes = 0;
    let invalidRoutes = 0;
    let routesWithWarnings = 0;
    let routerGenerated = false;

    try {
      outputLines.push(SCANNING_ROUTES);

      // Import the tRPC router generator
      const { generateTRPCRouter } =
        await import("./trpc-trpc-router-generator");

      // Prepare options for the generator
      const generatorOptions = {
        apiDir: data.apiDir,
        outputFile: data.outputFile,
        includeWarnings: data.includeWarnings,
        excludePatterns: data.excludePatterns,
      };

      // Execute the tRPC router generation
      const generationResult = await generateTRPCRouter(
        generatorOptions,
        logger,
      );

      // Extract statistics from the generation result
      totalRoutes = generationResult.routeFiles?.length || 0;
      validRoutes = totalRoutes - (generationResult.errors?.length || 0);
      invalidRoutes = generationResult.errors?.length || 0;
      routesWithWarnings = generationResult.warnings?.length || 0;

      if (routesWithWarnings > 0 && data.includeWarnings) {
        outputLines.push(
          `${WARNINGS_FOUND} ${routesWithWarnings} ${ROUTES_WITH_WARNINGS}`,
        );
      }

      outputLines.push(GENERATING_ROUTER);

      // Check if router was generated successfully
      routerGenerated =
        await GenerateTrpcRouterRepository.checkRouterFileExists(
          data.outputFile || "src/app/api/[locale]/trpc/[...trpc]/router.ts",
        );

      outputLines.push(GENERATION_SUCCESS);

      const executionTimeMs = Date.now() - startTime;

      return {
        success: true,
        generationCompleted: true,
        output: outputLines.join("\n"),
        generationStats: {
          totalRoutes,
          validRoutes,
          invalidRoutes,
          routesWithWarnings,
          routerGenerated,
          executionTimeMs,
        },
      };
    } catch (error) {
      // tRPC router generation failed
      // eslint-disable-next-line i18next/no-literal-string
      const errorMessage = `tRPC router generation failed: ${String(error)}`;
      outputLines.push(errorMessage);

      const executionTimeMs = Date.now() - startTime;

      return {
        success: false,
        generationCompleted: false,
        output: outputLines.join("\n"),
        generationStats: {
          totalRoutes,
          validRoutes,
          invalidRoutes,
          routesWithWarnings,
          routerGenerated,
          executionTimeMs,
        },
      };
    }
  }

  /**
   * Check if the router file was generated
   */
  private static async checkRouterFileExists(
    outputFile: string,
  ): Promise<boolean> {
    try {
      const fs = await import("node:fs");
      return fs.existsSync(outputFile);
    } catch {
      return false;
    }
  }
}
