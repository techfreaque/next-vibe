import path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { findSeedFiles as findSeedFilesUtil } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/filesystem/directory-scanner";
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
 * Find all seed files in the project
 * Looks for files named *.seeds.ts or *.seed.ts
 */
async function discoverSeedFiles(logger: EndpointLogger): Promise<void> {
  logger.debug("🔍 Discovering seed files...");

  // Start from the project root
  const projectRoot = process.cwd();
  const apiRoot = path.join(projectRoot, "src", "app", "api");

  logger.debug(`📂 Project root: ${projectRoot}`);
  logger.debug(`📂 API root: ${apiRoot}`);

  // Find all seed files
  const seedFiles = findSeedFiles(apiRoot);

  logger.debug(`📄 Found ${seedFiles.length} seed files`);

  // Import and register each seed file
  for (const seedFile of seedFiles) {
    try {
      // Convert to module path format
      const modulePath = seedFile
        .replace(projectRoot, "")
        .replace(/\\/g, "/")
        .replace(/^\//, "")
        .replace(/\.(ts|js)$/, "");

      // Dynamic import of the seed file
      const fullPath = path.join(projectRoot, modulePath);

      logger.debug(`📥 Importing seed file: ${fullPath}`);

      // This will execute the file which should call registerSeed
      await import(fullPath);
      logger.debug(`✅ Imported: ${modulePath}`);
    } catch (error) {
      logger.error(
        `❌ Error importing seed file ${seedFile}:`,
        parseError(error),
      );
    }
  }

  logger.debug(
    `📦 Total modules registered: ${Object.keys(seedRegistry).length}`,
  );
}
/**
 * Find all seed files in a directory and its subdirectories
 */
function findSeedFiles(dir: string): string[] {
  return findSeedFilesUtil(dir);
}

/**
 * Run all registered seed functions for the specified environment
 */
export async function runSeeds(
  environment: keyof EnvironmentSeeds,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  // First discover and load seed files
  logger.debug("🔍 Discovering seed files...");
  await discoverSeedFiles(logger);

  logger.debug(
    `📦 Seed registry has ${Object.keys(seedRegistry).length} modules`,
  );
  logger.info(`🌱 Running ${environment} seeds...`);

  for (const [moduleId, seeds] of Object.entries(seedRegistry)) {
    const seedFn = seeds[environment];
    if (seedFn) {
      logger.debug(`🌱 Seeding ${moduleId}...`);
      if (typeof seedFn === "function") {
        try {
          await seedFn(logger, locale);
          logger.debug(`✅ Seeded ${moduleId} successfully`);
        } catch (error) {
          logger.error(`❌ Error seeding ${moduleId}:`, parseError(error));
          // Re-throw to propagate seeding errors to the main process
          // eslint-disable-next-line no-restricted-syntax
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
    // eslint-disable-next-line no-restricted-syntax
    throw error;
  }
  // Don't close database here - it needs to stay open for the application
}
