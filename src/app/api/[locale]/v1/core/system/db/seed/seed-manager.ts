import { parseError } from "next-vibe/shared/utils";

import {
  getAllSeedModuleNames,
  getSeedModule,
} from "@/app/api/[locale]/v1/core/system/generated/seeds";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
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
 * Registers seed functions for a module
 * @param moduleId - The unique identifier for the module
 * @param seeds - The seed functions for different environments
 * @param priority - Optional priority (higher number = higher priority, runs first)
 */
export function registerSeed(
  moduleId: string,
  seeds: EnvironmentSeeds,
  priority?: number,
): void {
  // Set priority if provided as a parameter or in the seeds object
  if (priority !== undefined) {
    seeds.priority = priority;
  } else if (seeds.priority === undefined) {
    // Default priority is 0 if not specified
    seeds.priority = 0;
  }

  seedRegistry[moduleId] = seeds;
}

/**
 * Load all seed modules using the generated index
 */
async function loadSeedModules(logger: EndpointLogger): Promise<void> {
  logger.debug("🔍 Loading seed modules from generated index...");

  const moduleNames = getAllSeedModuleNames();
  logger.debug(`📦 Found ${moduleNames.length} seed modules in index`);

  // Load each seed module dynamically
  for (const moduleName of moduleNames) {
    try {
      logger.debug(`📥 Loading seed module: ${moduleName}`);
      const seedModule = await getSeedModule(moduleName);

      if (seedModule) {
        // Register the seed module
        seedRegistry[moduleName] = seedModule;
        logger.debug(
          `✅ Loaded: ${moduleName} (priority: ${seedModule.priority ?? 0})`,
        );
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

  logger.debug(`📦 Total modules loaded: ${Object.keys(seedRegistry).length}`);
}

/**
 * Run all registered seed functions for the specified environment
 */
export async function runSeeds(
  environment: keyof EnvironmentSeeds,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  // First load seed modules from generated index
  logger.debug("🔍 Loading seed modules...");
  await loadSeedModules(logger);

  logger.debug(
    `📦 Seed registry has ${Object.keys(seedRegistry).length} modules`,
  );
  logger.info(`🌱 Running ${environment} seeds...`);

  // Sort modules by priority (higher priority runs first)
  const sortedModules = Object.entries(seedRegistry).toSorted(
    ([, a], [, b]) => (b.priority ?? 0) - (a.priority ?? 0),
  );

  for (const [moduleId, seeds] of sortedModules) {
    const seedFn = seeds[environment];
    if (seedFn) {
      logger.debug(
        `🌱 Seeding ${moduleId} (priority: ${seeds.priority ?? 0})...`,
      );
      if (typeof seedFn === "function") {
        try {
          await seedFn(logger, locale);
          logger.debug(`✅ Seeded ${moduleId} successfully`);
        } catch (error) {
          logger.error(`❌ Error seeding ${moduleId}:`, parseError(error));
          // Re-throw to propagate seeding errors to the main process
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Seed infrastructure needs to propagate errors
          throw error;
        }
      } else {
        logger.debug(`⚠️  No seed function found for ${moduleId}`);
      }
    } else {
      logger.debug(`⏭️  Skipping ${moduleId} (no ${environment} seed)`);
    }
  }

  logger.info(`✅ ${environment} seeds completed successfully!`);
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
