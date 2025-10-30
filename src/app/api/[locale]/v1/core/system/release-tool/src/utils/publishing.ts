/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import archiver from "archiver";
import inquirer from "inquirer";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { PackageJson, ReleasePackage } from "../types/index.js";
import {
  checkTagExists,
  createGitTag,
  ensureMainBranch,
  hasNewCommitsSinceTag,
} from "./git.js";

export async function publishPackage({
  newTag,
  lastTag,
  packageJson,
  pkg,
  logger,
}: {
  newTag: string; // version + optional tag prefix
  lastTag: string; // version + optional tag prefix
  packageJson: PackageJson;
  pkg: ReleasePackage;
  logger: EndpointLogger;
}): Promise<void> {
  logger.info(`Processing tag release (${newTag}) for ${packageJson.name}...`);
  if (await checkTagExists(newTag, logger)) {
    logger.info(`Skipping ${packageJson.name}: tag ${newTag} already exists.`);
    return;
  }
  await ensureMainBranch(logger);

  // Special handling for repositories with no existing tags
  if (lastTag === "0.0.0") {
    logger.info("No previous tags found. This will be the first release.");
  } else if (!hasNewCommitsSinceTag(lastTag, pkg.directory, logger)) {
    logger.info(`No new commits since ${lastTag}, skipping release.`);
    return;
  }

  // Ask user if they want to publish with default "Yes"
  const { shouldPublish } = await inquirer.prompt<{
    shouldPublish: boolean;
  }>([
    {
      type: "confirm",
      name: "shouldPublish",
      // eslint-disable-next-line i18next/no-literal-string
      message: `Publish ${packageJson.name} with tag ${newTag}?`,
      default: true, // Default to Yes
    },
  ]);

  if (!shouldPublish) {
    logger.info(`Skipping release of ${packageJson.name}`);
    return;
  }

  logger.info(`Releasing ${packageJson.name}...`);
  createGitTag(newTag, pkg.directory, logger);
}

export async function zipFolders({
  newTag,
  packageJson,
  foldersToZip,
  logger,
}: {
  newTag: string;
  lastTag: string;
  packageJson: PackageJson;
  pkg: ReleasePackage;
  foldersToZip: {
    input: string;
    output: string;
  }[];
  logger: EndpointLogger;
}): Promise<void> {
  if (foldersToZip.length > 0) {
    logger.info("Starting to zip folders");

    for (const zipConfig of foldersToZip) {
      const inputPath = resolve(process.cwd(), zipConfig.input);

      // Process template variables in output filename
      let outputFileName = basename(zipConfig.output);

      outputFileName = outputFileName
        .replace(/%NAME%/g, packageJson.name)
        .replace(/%VERSION%/g, newTag)
        .replace(
          /%TIMESTAMP%/g,
          new Date()
            .toISOString()
            .replace(/[:.T]/g, "-")
            .split("-")
            .slice(0, 6)
            .join("-"),
        );

      const outputDir = dirname(resolve(process.cwd(), zipConfig.output));
      const outputPath = join(outputDir, outputFileName);

      // Ensure output directory exists
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      if (!existsSync(inputPath)) {
        // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Validation failures must throw to halt execution with invalid state
        throw new Error(`Input folder ${inputPath} does not exist, cannot zip`);
      }

      try {
        // Create a file to stream archive data to
        const output = createWriteStream(outputPath);
        const archive = archiver("zip", {
          zlib: { level: 9 }, // Maximum compression level
        });

        // Listen for all archive data to be written
        await new Promise<void>((resolve, reject) => {
          output.on("close", () => {
            logger.info(
              `Successfully zipped ${inputPath} to ${outputPath} (${archive.pointer()} total bytes)`,
            );
            resolve();
          });

          archive.on("warning", (err) => {
            if (err.code === "ENOENT") {
              // Log warning

              logger.warn(`Warning while zipping: ${err.message}`);
            } else {
              // Throw error
              reject(err);
            }
          });

          archive.on("error", (err) => {
            reject(err);
          });

          // Pipe archive data to the file
          archive.pipe(output);

          // Add the directory to the archive
          archive.directory(inputPath, false);

          // Finalize the archive
          archive.finalize().then(resolve).catch(reject);
        });
      } catch (error) {
        logger.error(
          `Error zipping folder ${inputPath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    logger.info("Finished zipping folders");
  } else {
    logger.info("No folders to zip in your config");
  }
}
