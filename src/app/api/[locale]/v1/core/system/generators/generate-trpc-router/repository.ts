/**
 * Generate tRPC Router Repository
 * Handles tRPC router generation from API routes
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

// Import types from the endpoint definition
import type generateTrpcRouterEndpoints from "./definition";

type GenerateTrpcRouterRequestType =
  typeof generateTrpcRouterEndpoints.POST.types.RequestOutput;
type GenerateTrpcRouterResponseType =
  typeof generateTrpcRouterEndpoints.POST.types.ResponseOutput;

/**
 * Generate tRPC Router Repository Interface
 */
export interface GenerateTrpcRouterRepository {
  generateTrpcRouter(
    data: GenerateTrpcRouterRequestType,
    locale: CountryLanguage,
  ): Promise<ResponseType<GenerateTrpcRouterResponseType>>;
}

/**
 * Generate tRPC Router Repository Implementation
 */
export class GenerateTrpcRouterRepositoryImpl
  implements GenerateTrpcRouterRepository
{
  async generateTrpcRouter(
    data: GenerateTrpcRouterRequestType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<GenerateTrpcRouterResponseType>> {
    try {
      // Execute tRPC router generation based on the original logic
      const result = await this.executeTrpcRouterGeneration(data);

      const response: GenerateTrpcRouterResponseType = {
        success: result.success,
        generationCompleted: result.generationCompleted,
        output: result.output,
        generationStats: result.generationStats,
      };

      return createSuccessResponse(response);
    } catch (error) {
      return createErrorResponse(
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Execute tRPC router generation using the original logic from generate-trpc-router.ts
   */
  private async executeTrpcRouterGeneration(
    data: GenerateTrpcRouterRequestType,
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
      const { generateTRPCRouter } = await import(
        "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/trpc/trpc-router-generator"
      );

      // Prepare options for the generator
      const generatorOptions = {
        apiDir: data.apiDir,
        outputFile: data.outputFile,
        includeWarnings: data.includeWarnings,
        excludePatterns: data.excludePatterns,
        verbose: data.verbose,
      };

      // Execute the tRPC router generation
      const generationResult = await generateTRPCRouter(generatorOptions);

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
      routerGenerated = await this.checkRouterFileExists(
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
  private async checkRouterFileExists(outputFile: string): Promise<boolean> {
    try {
      const fs = await import("node:fs");
      return fs.existsSync(outputFile);
    } catch {
      return false;
    }
  }
}

/**
 * Export repository instance
 */
export const generateTrpcRouterRepository =
  new GenerateTrpcRouterRepositoryImpl();
