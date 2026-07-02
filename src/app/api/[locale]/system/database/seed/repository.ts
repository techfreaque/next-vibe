/**
 * Run database seeds Repository
 * Handles run database seeds operations
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { SeedT } from "next-vibe/database/seed/i18n";
import { scopedTranslation } from "next-vibe/database/seed/i18n";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { SeedRequestOutput, SeedResponseOutput } from "./definition";
import type { EnvironmentSeeds } from "./seed-manager";
import { seedDatabase } from "./seed-manager";

/**
 * Run database seeds Repository
 */
export class SeedRepository {
  private static async runSeed(
    environment: keyof EnvironmentSeeds,
    t: SeedT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SeedResponseOutput>> {
    const startTime = Date.now();

    try {
      logger.debug(`🌱 Starting database seeding (${environment})...`);

      await seedDatabase(environment, logger, defaultLocale);

      const duration = Date.now() - startTime;
      logger.debug("✅ Database seeding completed successfully");

      return success({
        success: true,
        seedsExecuted: 1,
        collections: [],
        totalRecords: 0,
        duration,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("❌ Database seeding failed:", parsed);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsed.message },
      });
    }
  }

  /**
   * Called from route handler with data parsed from request.
   */
  static async execute(
    data: SeedRequestOutput,
    t: SeedT,
    logger: EndpointLogger,
  ): Promise<ResponseType<SeedResponseOutput>> {
    return SeedRepository.runSeed(data.environment, t, logger);
  }

  /**
   * Convenience wrapper for dev/start/build/rebuild repositories.
   */
  static async seed(
    environment: keyof EnvironmentSeeds,
    logger: EndpointLogger,
  ): Promise<ResponseType<SeedResponseOutput>> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return SeedRepository.runSeed(environment, t, logger);
  }
}
