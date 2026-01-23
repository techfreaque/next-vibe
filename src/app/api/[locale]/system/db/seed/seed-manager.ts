import { parseError } from "next-vibe/shared/utils";

import {
  getAllSeedModuleNames,
  getSeedModule,
} from "@/app/api/[locale]/system/generated/seeds";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatDatabase,
  formatDuration,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type { CountryLanguage } from "@/i18n/core/config";

export type SeedFn = (
  logger: EndpointLogger,
  locale: CountryLanguage,
) => Promise<void> | void;
export interface EnvironmentSeeds {
  dev?: SeedFn;
  test?: SeedFn;
  prod?: SeedFn;
  priority?: number; // Higher number = higher priority (runs first)
}

// Registry for all seed functions
const seedRegistry: Record<string, EnvironmentSeeds> = {};

/**
 * Load all seed modules using the generated index
 */
async function loadSeedModules(logger: EndpointLogger): Promise<void> {
  const moduleNames = getAllSeedModuleNames();

  // Load each seed module dynamically
  for (const moduleName of moduleNames) {
    try {
      const seedModule = await getSeedModule(moduleName);

      if (seedModule) {
        // Register the seed module
        seedRegistry[moduleName] = seedModule;
      } else {
        logger.warn(`⚠️  Seed module ${moduleName} returned null`);
      }
    } catch (error) {
      logger.error(
        `❌ Error loading seed module ${moduleName}:`,
        parseError(error),
      );
    }
  }

  logger.debug(`Loaded ${Object.keys(seedRegistry).length} seed modules`);
}

/**
 * Run all registered seed functions for the specified environment
 */
export async function runSeeds(
  environment: keyof EnvironmentSeeds,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  const startTime = Date.now();

  // Load seed modules from generated index
  await loadSeedModules(logger);

  // Sort modules by priority (higher priority runs first)
  const sortedModules = Object.entries(seedRegistry).toSorted(
    ([, a], [, b]) => (b.priority ?? 0) - (a.priority ?? 0),
  );

  const seedResults: { success: string[]; failed: string[] } = {
    success: [],
    failed: [],
  };

  for (const [moduleId, seeds] of sortedModules) {
    const seedFn = seeds[environment];
    if (seedFn) {
      if (typeof seedFn === "function") {
        try {
          await seedFn(logger, locale);
          seedResults.success.push(moduleId);
        } catch (error) {
          logger.error(`Error seeding ${moduleId}:`, parseError(error));
          seedResults.failed.push(moduleId);
          // Re-throw to propagate seeding errors to the main process
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Seed infrastructure needs to propagate errors
          throw error;
        }
      } else {
        logger.warn(`No seed function found for ${moduleId}`);
      }
    }
  }

  const duration = Date.now() - startTime;
  logger.info(
    formatDatabase(
      `${environment} seeds: ${seedResults.success.length} modules in ${formatDuration(duration)}`,
      "🌱",
    ),
  );
}

/**
 * Main seed execution function
 */
export async function seedDatabase(
  environment: keyof EnvironmentSeeds = "dev",
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  try {
    await runSeeds(environment, logger, locale);
  } catch (error) {
    logger.error("❌ Error seeding database:", parseError(error));
    // Don't call process.exit here - let the caller handle the error
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Seed infrastructure needs to propagate errors
    throw error;
  }
  // Don't close database here - it needs to stay open for the application
}
