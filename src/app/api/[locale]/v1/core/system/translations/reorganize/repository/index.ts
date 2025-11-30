import fs from "node:fs";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { languageDefaults } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  API_TRANSLATIONS_IMPORT,
  API_TRANSLATIONS_KEY,
  BACKUP_DIR,
  BACKUP_PREFIX,
  COLON_SPACE,
  COMMA_NEWLINE,
  DOT_SLASH,
  FILE_PROTOCOL,
  I18N_PATH,
  IMPORT_CLOSE,
  IMPORT_TEMPLATE_END,
  IMPORT_TEMPLATE_START,
  INDEX_FILE_WITHOUT_EXTENSION,
  LOCATION_IMPORTS_PLACEHOLDER,
  LOCATION_TRANSLATIONS_PREFIX,
  MAIN_INDEX_TEMPLATE,
  OBJECT_CLOSE,
  OBJECT_OPEN,
  QUOTE,
  SPACE_SPACE,
  TMP_EXTENSION,
  TRANSLATIONS_DIR,
  TRANSLATIONS_OBJECT_PLACEHOLDER,
} from "../constants";
import type {
  TranslationReorganizeRequestOutput,
  TranslationReorganizeResponseOutput,
} from "../definition";
import { FileGenerator } from "./file-generator";
import { KeyUsageAnalyzer, type TranslationObject } from "./key-usage-analyzer";
import { LocationAnalyzer } from "./location-analyzer";

// Interface for translation module structure
interface TranslationModule {
  default?: TranslationObject;
  translations?: TranslationObject;
  [key: string]: TranslationObject | undefined;
}

export class TranslationReorganizeRepositoryImpl {
  private keyUsageAnalyzer = new KeyUsageAnalyzer();
  private locationAnalyzer = new LocationAnalyzer();
  private fileGenerator = new FileGenerator();

  /**
   * Reorganize translation files based on usage patterns and location-based co-location
   * @param request - The reorganization request parameters
   * @param locale - The locale for translations
   * @param logger - Logger instance for debugging and progress tracking
   * @returns Response containing reorganization results and statistics
   */
  async reorganizeTranslations(
    request: TranslationReorganizeRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<TranslationReorganizeResponseOutput>> {
    const startTime = Date.now();
    const { t } = simpleT(locale);
    const output: string[] = [];
    const changes: Array<{
      type: "removed" | "updated" | "created" | "regenerated";
      path: string;
      description: TranslationKey;
      descriptionParams?: Record<string, string | number>;
    }> = [];

    try {
      output.push(
        t(
          "app.api.v1.core.system.translations.reorganize.post.messages.starting",
        ),
      );

      // Create backup if requested
      let backupPath: string | undefined;
      if (request.backup && !request.dryRun) {
        backupPath = this.createBackup(logger);

        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.backupCreated",
            { path: backupPath },
          ),
        );
      }

      output.push(
        t(
          "app.api.v1.core.system.translations.reorganize.post.messages.scanningUsage",
        ),
      );

      // Load current translations

      output.push(
        t(
          "app.api.v1.core.system.translations.reorganize.post.messages.loadingFiles",
        ),
      );
      const currentTranslations = await this.loadCurrentTranslations(logger);

      // Analyze key usage
      const allKeys =
        this.keyUsageAnalyzer.extractAllTranslationKeys(currentTranslations);
      const keyUsageMap = this.keyUsageAnalyzer.scanCodebaseForKeyUsage(
        allKeys,
        logger,
      );

      const usedKeys = [...keyUsageMap.keys()].length;
      const unusedKeys = allKeys.size - usedKeys;

      output.push(
        t(
          "app.api.v1.core.system.translations.reorganize.post.messages.foundKeys",
          {
            used: usedKeys,
            total: allKeys.size,
          },
        ),
      );
      logger.debug(
        `Key scanning completed. usedKeys: ${usedKeys}, unusedKeys: ${unusedKeys}`,
      );

      // Handle unused key removal if requested
      let keysRemoved = 0;
      let filteredTranslations = currentTranslations;

      if (request.removeUnused && unusedKeys > 0) {
        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.removingKeys",
            { count: unusedKeys },
          ),
        );
        filteredTranslations = this.removeUnusedKeys(
          currentTranslations,
          keyUsageMap,
          logger,
        );
        keysRemoved = unusedKeys;
        logger.debug(`Removed ${keysRemoved} unused keys`);
      }

      logger.debug(`About to check dryRun: ${request.dryRun}`);

      if (request.dryRun) {
        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.dryRunCompleted",
          ),
        );
        if (request.removeUnused && unusedKeys > 0) {
          output.push(
            t(
              "app.api.v1.core.system.translations.reorganize.post.messages.removedKeysFromLanguage",
              {
                count: unusedKeys,
                language: t(
                  "app.api.v1.core.system.translations.reorganize.post.messages.unusedKeysLabel",
                ),
              },
            ),
          );
        }

        return success({
          response: {
            success: true,
            summary: {
              totalKeys: allKeys.size,
              usedKeys,
              unusedKeys: request.removeUnused ? 0 : unusedKeys,
              keysRemoved: 0, // Dry run, so no actual removal
              filesUpdated: 0,
              filesCreated: 0,
              backupCreated: !!backupPath,
            },
            output: output.join("\n"),
            duration: Date.now() - startTime,
            backupPath: backupPath || undefined,
            changes: changes || [],
          },
        });
      }

      // If removeUnused is enabled but regenerateStructure is not, we need to regenerate files based on usage
      if (
        request.removeUnused &&
        !request.regenerateStructure &&
        keysRemoved > 0
      ) {
        logger.debug(
          "Regenerating translation files based on usage locations (removeUnused without regenerateStructure)",
        );

        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.writingFilteredTranslations",
          ),
        );

        // Calculate key usage frequency for smart flattening
        const keyUsageFrequency = new Map<string, number>();
        for (const [key, files] of keyUsageMap) {
          keyUsageFrequency.set(key, files.length);
        }

        // Group translations by usage location
        logger.debug("Grouping translations by usage location");
        const { groups } = this.groupTranslationsByUsage(
          filteredTranslations,
          keyUsageMap,
          keyUsageFrequency,
          logger,
        );

        logger.debug(
          `Created ${groups.size} location-based translation groups`,
        );

        // Process each language
        const languages = this.getAvailableLanguages();
        let filesCreated = 0;

        for (const language of languages) {
          logger.debug(`Processing language: ${language}`);

          const languageTranslations = await this.loadLanguageTranslations(
            language,
            logger,
          );

          // Apply the new grouping to this language's translations
          const regroupedTranslations = this.regroupTranslationsForLanguage(
            languageTranslations,
            groups,
            keyUsageMap,
            logger,
          );

          logger.debug(
            `Regrouped translations for ${language}: ${regroupedTranslations.size} groups`,
          );

          // Generate files
          try {
            const generated = this.fileGenerator.generateTranslationFiles(
              regroupedTranslations,
              language,
              logger,
            );

            if (generated) {
              filesCreated++;
              changes.push({
                type: "updated",
                path: `i18n/${language}/**/*.ts`,
                description:
                  "app.api.v1.core.system.translations.reorganize.post.messages.removedUnusedKeys",
                descriptionParams: {
                  language,
                  count: keysRemoved,
                },
              });
              logger.debug(`Successfully generated files for ${language}`);
            } else {
              logger.debug(`File generation returned false for ${language}`);
            }
          } catch (fileGenError) {
            logger.error(`File generation failed for ${language}`, {
              error: parseError(fileGenError).message,
            });
          }
        }

        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.completed",
          ),
        );

        return success({
          response: {
            success: true,
            summary: {
              totalKeys: allKeys.size,
              usedKeys,
              unusedKeys: 0,
              keysRemoved,
              filesUpdated: 0,
              filesCreated,
              backupCreated: !!backupPath,
            },
            output: output.join("\n"),
            duration: Date.now() - startTime,
            backupPath: backupPath || undefined,
            changes: changes || [],
          },
        });
      }

      // Generate new structure if requested
      if (request.regenerateStructure) {
        logger.debug("Starting regenerateStructure block");

        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.regeneratingStructure",
          ),
        );

        // Analyze key usage frequency for smart flattening

        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.analyzingFrequency",
          ),
        );
        const keyUsageFrequency =
          this.locationAnalyzer.analyzeKeyUsageFrequency(currentTranslations);
        logger.debug(
          `Analyzed ${keyUsageFrequency.size} key paths for frequency`,
        );

        logger.debug("About to group translations by usage location");
        // Group translations by usage location
        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.groupingByLocation",
          ),
        );

        logger.debug("Calling groupTranslationsByUsage");
        const { groups } = this.groupTranslationsByUsage(
          filteredTranslations, // Use filtered translations (with unused keys removed if requested)
          keyUsageMap,
          keyUsageFrequency,
          logger,
        );

        logger.debug("groupTranslationsByUsage completed");

        logger.debug(`Created ${groups.size} translation groups`);
        for (const [location, translations] of groups) {
          logger.debug(
            `Group: ${location} - ${Object.keys(translations).length} keys`,
          );
        }

        // Generate files for each language
        output.push(
          t(
            "app.api.v1.core.system.translations.reorganize.post.messages.generatingFiles",
          ),
        );

        // Only generate files if there are actually used keys
        if (usedKeys > 0) {
          const languages = this.getAvailableLanguages();
          logger.debug(`Available languages: ${languages.join(", ")}`);
          let filesUpdated = 0;
          let filesCreated = 0;

          for (const language of languages) {
            logger.debug(`Processing language: ${language}`);

            const languageTranslations = await this.loadLanguageTranslations(
              language,
              logger,
            );

            // Apply the new grouping to this language's translations
            const regroupedTranslations = this.regroupTranslationsForLanguage(
              languageTranslations,
              groups,
              keyUsageMap,
              logger,
            );

            logger.debug(
              `Regrouped translations for ${language}: ${regroupedTranslations.size} groups`,
            );

            // Generate files
            try {
              const generated = this.fileGenerator.generateTranslationFiles(
                regroupedTranslations,
                language,
                logger,
              );

              if (generated) {
                filesUpdated++;
                changes.push({
                  type: "updated",
                  path: path.join(TRANSLATIONS_DIR, language, "index.ts"),
                  description:
                    "app.api.v1.core.system.translations.reorganize.post.messages.regeneratedStructure",
                  descriptionParams: { language },
                });
                logger.debug(`Successfully generated files for ${language}`);
              } else {
                logger.debug(`File generation returned false for ${language}`);
              }
            } catch (fileGenError) {
              logger.error(`File generation failed for ${language}`, {
                error: parseError(fileGenError).message,
              });
            }
          }

          // Main index structure is now handled by the hierarchical file generation
          // The new system generates proper hierarchical imports instead of flat location-based imports
          logger.debug(
            "Main index structure handled by hierarchical file generation",
          );

          output.push(
            t(
              "app.api.v1.core.system.translations.reorganize.post.messages.completed",
            ),
          );

          return success({
            response: {
              success: true,
              summary: {
                totalKeys: allKeys.size,
                usedKeys,
                unusedKeys: request.removeUnused ? 0 : unusedKeys,
                keysRemoved,
                filesUpdated,
                filesCreated,
                backupCreated: !!backupPath,
              },
              output: output.join("\n"),
              duration: Date.now() - startTime,
              backupPath: backupPath || undefined,
              changes: changes || [],
            },
          });
        } else {
          output.push(
            t(
              "app.api.v1.core.system.translations.reorganize.post.messages.noKeysInUse",
            ),
          );
        }
      }

      output.push(
        t(
          "app.api.v1.core.system.translations.reorganize.post.messages.completed",
        ),
      );

      return success({
        response: {
          success: true,
          summary: {
            totalKeys: allKeys.size,
            usedKeys,
            unusedKeys,
            keysRemoved: 0,
            filesUpdated: 0,
            filesCreated: 0,
            backupCreated: !!backupPath,
          },
          output: output.join("\n"),
          duration: Date.now() - startTime,
          backupPath: backupPath || undefined,
          changes: changes || [],
        },
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Translation reorganization failed", {
        error: errorMessage,
      });

      return fail({
        message:
          "app.api.v1.core.system.translations.reorganize.repository.error.internal_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Remove unused translation keys from the translation object
   * @param translations - The translation object to filter
   * @param keyUsageMap - Map of translation keys to their usage locations
   * @param logger - Logger instance for debugging
   * @returns The filtered translation object with only used keys
   */
  private removeUnusedKeys(
    translations: TranslationObject,
    keyUsageMap: Map<string, string[]>,
    logger: EndpointLogger,
  ): TranslationObject {
    logger.debug("Removing unused translation keys");

    const filteredTranslations: TranslationObject = {};
    this.filterUsedKeys(
      translations,
      filteredTranslations,
      "",
      keyUsageMap,
      logger,
    );

    logger.debug(
      `Filtered translations: ${Object.keys(filteredTranslations).length} top-level keys remaining`,
    );
    return filteredTranslations;
  }

  /**
   * Recursively filter out unused keys from translation object
   * @param source - The source translation object to filter from
   * @param target - The target translation object to filter to
   * @param currentPath - The current key path being processed
   * @param keyUsageMap - Map of translation keys to their usage locations
   * @param logger - Logger instance for debugging
   */
  private filterUsedKeys(
    source: TranslationObject,
    target: TranslationObject,
    currentPath: string,
    keyUsageMap: Map<string, string[]>,
    logger: EndpointLogger,
  ): void {
    for (const [key, value] of Object.entries(source)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // For nested objects, check if any child keys are used
        const nestedTarget: TranslationObject = {};
        this.filterUsedKeys(value, nestedTarget, fullPath, keyUsageMap, logger);

        // Only include the nested object if it has used children
        if (Object.keys(nestedTarget).length > 0) {
          target[key] = nestedTarget;
        } else {
          logger.debug(`Removing unused nested object: ${fullPath}`);
        }
      } else {
        // For leaf values, check if the key is used
        const usageFiles = keyUsageMap.get(fullPath) || [];
        if (usageFiles.length > 0) {
          target[key] = value;
          logger.debug(`Keeping used key: ${fullPath}`);
        } else {
          logger.debug(`Removing unused key: ${fullPath}`);
        }
      }
    }
  }

  /**
   * Create backup of current translation files
   * Backs up all i18n directories throughout the project
   * @param logger - Logger instance for debugging
   * @returns The backup directory path
   */
  private createBackup(logger: EndpointLogger): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(BACKUP_DIR, BACKUP_PREFIX + timestamp);

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create backup structure
    const srcDir = path.resolve(process.cwd(), "src");
    this.backupI18nFiles(srcDir, backupPath, logger);

    logger.debug("Created comprehensive backup", { path: backupPath });

    return backupPath;
  }

  /**
   * Recursively backup all i18n directories
   * @param sourceDir - The source directory to search for i18n files
   * @param backupRoot - The root backup directory
   * @param logger - Logger instance for debugging
   */
  private backupI18nFiles(
    sourceDir: string,
    backupRoot: string,
    logger: EndpointLogger,
  ): void {
    if (!fs.existsSync(sourceDir)) {
      return;
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "i18n") {
          // Found an i18n directory, backup it
          const relativePath = path.relative(
            path.resolve(process.cwd(), "src"),
            sourcePath,
          );
          const backupPath = path.join(backupRoot, relativePath);

          logger.debug("Backing up i18n directory", {
            source: sourcePath,
            backup: backupPath,
          });

          // Ensure backup directory exists
          fs.mkdirSync(path.dirname(backupPath), { recursive: true });

          // Copy the entire i18n directory
          fs.cpSync(sourcePath, backupPath, { recursive: true });
        } else {
          // Recursively search subdirectories
          this.backupI18nFiles(sourcePath, backupRoot, logger);
        }
      }
    }
  }

  /**
   * Restore translation files from a backup
   * @param backupPath - The backup directory path to restore from
   * @param logger - Logger instance for debugging
   */
  restoreFromBackup(backupPath: string, logger: EndpointLogger): void {
    if (!fs.existsSync(backupPath)) {
      logger.error(`Backup directory does not exist: ${backupPath}`);
      return;
    }

    logger.debug(`Starting restore from backup: ${backupPath}`);

    // First, remove all existing i18n directories
    this.removeAllI18nDirectories(logger);

    // Then restore from backup
    this.restoreI18nFiles(backupPath, logger);

    logger.debug("Restore completed successfully");
  }

  /**
   * Restore translation files from a backup via API endpoint
   * @param request - The restore request parameters
   * @param locale - The locale for translations
   * @param logger - Logger instance for debugging
   * @returns Response containing restore results and statistics
   */
  restoreFromBackupEndpoint(
    request: {
      backupPath: string;
      validateOnly?: boolean;
      createBackupBeforeRestore?: boolean;
    },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<{
    success: boolean;
    message: string;
    backupInfo: {
      backupPath: string;
      backupDate: string;
      filesRestored: number;
      newBackupCreated?: string;
    };
    duration: number;
  }> {
    const startTime = Date.now();
    const { t } = simpleT(locale);

    try {
      // Validate backup path exists
      if (!fs.existsSync(request.backupPath)) {
        return fail({
          message:
            "app.api.v1.core.system.translations.restoreBackup.post.messages.backupNotFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Extract backup date from path
      const backupDate = this.extractBackupDate(request.backupPath);

      // Count files in backup
      const filesInBackup = this.countFilesInBackup(request.backupPath);

      // If validation only, just check the backup and return
      if (request.validateOnly) {
        return success({
          success: true,
          message: t(
            "app.api.v1.core.system.translations.restoreBackup.post.messages.validationSuccessful",
          ),
          backupInfo: {
            backupPath: request.backupPath,
            backupDate,
            filesRestored: 0,
          },
          duration: Date.now() - startTime,
        });
      }

      // Create backup before restore if requested
      let newBackupPath: string | undefined;
      if (request.createBackupBeforeRestore) {
        newBackupPath = this.createBackup(logger);
        logger.debug(`Created backup before restore: ${newBackupPath}`);
      }

      // Perform the restore
      this.restoreFromBackup(request.backupPath, logger);

      return success({
        success: true,
        message: t(
          "app.api.v1.core.system.translations.restoreBackup.post.messages.restoreSuccessful",
        ),
        backupInfo: {
          backupPath: request.backupPath,
          backupDate,
          filesRestored: filesInBackup,
          newBackupCreated: newBackupPath,
        },
        duration: Date.now() - startTime,
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Translation backup restore failed", {
        error: errorMessage,
        backupPath: request.backupPath,
      });

      return fail({
        message:
          "app.api.v1.core.system.translations.reorganize.repository.error.internal_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Remove all i18n directories from the project
   * @param logger - Logger instance for debugging
   */
  private removeAllI18nDirectories(logger: EndpointLogger): void {
    const srcDir = path.resolve(process.cwd(), "src");
    this.removeI18nDirectoriesRecursive(srcDir, logger);
  }

  /**
   * Recursively remove all i18n directories
   * @param sourceDir - The directory to search for i18n directories
   * @param logger - Logger instance for debugging
   */
  private removeI18nDirectoriesRecursive(
    sourceDir: string,
    logger: EndpointLogger,
  ): void {
    if (!fs.existsSync(sourceDir)) {
      return;
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "i18n") {
          // Found an i18n directory, remove it
          logger.debug(`Removing i18n directory: ${sourcePath}`);
          fs.rmSync(sourcePath, { recursive: true, force: true });
        } else {
          // Recursively search subdirectories
          this.removeI18nDirectoriesRecursive(sourcePath, logger);
        }
      }
    }
  }

  /**
   * Restore i18n files from backup
   * @param backupRoot - The backup root directory
   * @param logger - Logger instance for debugging
   */
  private restoreI18nFiles(backupRoot: string, logger: EndpointLogger): void {
    if (!fs.existsSync(backupRoot)) {
      return;
    }

    const entries = fs.readdirSync(backupRoot, { withFileTypes: true });

    for (const entry of entries) {
      const backupPath = path.join(backupRoot, entry.name);

      if (entry.isDirectory()) {
        // Restore this i18n directory
        const relativePath = entry.name;
        const targetPath = path.join(
          path.resolve(process.cwd(), "src"),
          relativePath,
        );

        logger.debug("Restoring i18n directory", {
          backup: backupPath,
          target: targetPath,
        });

        // Ensure target directory parent exists
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });

        // Copy the entire i18n directory
        fs.cpSync(backupPath, targetPath, { recursive: true });
      }
    }
  }

  /**
   * Extract backup date from backup path
   * @param backupPath - The backup directory path
   * @returns ISO date string
   */
  private extractBackupDate(backupPath: string): string {
    // Extract timestamp from backup path like "translations-2025-11-30T12-45-17-439Z"
    const match = backupPath.match(
      /translations-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/,
    );
    if (match) {
      // Convert back to ISO format: YYYY-MM-DDTHH:MM:SS.mmmZ
      const [, year, month, day, hour, minute, second, millisecond] = match;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;
    }
    return new Date().toISOString();
  }

  /**
   * Count files in backup directory
   * @param backupPath - The backup directory path
   * @returns Number of files in backup
   */
  private countFilesInBackup(backupPath: string): number {
    let count = 0;

    const countRecursive = (dir: string): void => {
      if (!fs.existsSync(dir)) {
        return;
      }

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          countRecursive(fullPath);
        } else {
          count++;
        }
      }
    };

    countRecursive(backupPath);
    return count;
  }

  /**
   * Load current translations from the main language
   * @param logger - Logger instance for debugging
   * @returns Promise resolving to the current translation object
   */
  private async loadCurrentTranslations(
    logger: EndpointLogger,
  ): Promise<TranslationObject> {
    try {
      const mainLanguagePath = path.join(
        TRANSLATIONS_DIR,
        languageDefaults.language,
        "index.ts",
      );

      if (!fs.existsSync(mainLanguagePath)) {
        logger.debug(`Main language file not found: ${mainLanguagePath}`);
        return {};
      }

      logger.debug(`Loading translations from: ${mainLanguagePath}`);

      // Use dynamic import for proper ES module support
      let translationModule: TranslationModule;
      try {
        // Convert to file URL for dynamic import
        const fileUrl = FILE_PROTOCOL + mainLanguagePath;
        translationModule = (await import(fileUrl)) as TranslationModule;
      } catch (importError) {
        logger.error("Failed to import translation module", {
          path: mainLanguagePath,
          error: parseError(importError).message,
        });
        return {};
      }

      const translations =
        translationModule.default || translationModule.translations;

      if (!translations) {
        logger.error("No translations found in module", {
          path: mainLanguagePath,
          availableExports: Object.keys(translationModule),
        });
        return {};
      }

      logger.debug("Successfully loaded translations", {
        keyCount: Object.keys(translations).length,
        topLevelKeys: Object.keys(translations).slice(0, 10),
      });

      return translations;
    } catch (error) {
      logger.debug(
        `Failed to load current translations: ${parseError(error).message}`,
      );
      return {};
    }
  }

  /**
   * Get available languages from the translations directory
   * @returns Array of available language codes
   */
  private getAvailableLanguages(): string[] {
    try {
      if (!fs.existsSync(TRANSLATIONS_DIR)) {
        return [languageDefaults.language];
      }

      const entries = fs.readdirSync(TRANSLATIONS_DIR, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => !name.startsWith("."));
    } catch {
      return [languageDefaults.language];
    }
  }

  /**
   * Load translations for a specific language with improved error handling
   * @param language - The language code to load translations for
   * @param logger - Logger instance for debugging
   * @returns Promise resolving to the translation object for the language
   */
  private async loadLanguageTranslations(
    language: string,
    logger: EndpointLogger,
  ): Promise<TranslationObject> {
    try {
      const languagePath = path.join(TRANSLATIONS_DIR, language, "index.ts");

      if (!fs.existsSync(languagePath)) {
        logger.debug(`Language file not found: ${languagePath}`);
        return {};
      }

      // Try to use dynamic import first (proper ES module support)
      try {
        const fileUrl = FILE_PROTOCOL + languagePath;
        const translationModule = (await import(fileUrl)) as TranslationModule;
        const translations =
          translationModule.default || translationModule.translations;

        if (translations && typeof translations === "object") {
          logger.debug(
            `Successfully loaded translations for ${language} via import`,
          );
          return translations;
        }
      } catch (importError) {
        logger.debug(
          `Import failed for ${language}, trying file parsing: ${parseError(importError).message}`,
        );
      }

      // Fallback to file parsing
      const content = fs.readFileSync(languagePath, "utf8");

      // Extract the translation object (improved parsing)
      const match = content.match(
        /export\s+const\s+\w+\s*(?::\s*[^=]+)?\s*=\s*({[\s\S]*?})\s*as\s+const/,
      );
      if (match) {
        const translationString = match[1];
        try {
          // Attempt to parse as JSON (works for simple structures)
          const translations = JSON.parse(
            translationString,
          ) as TranslationObject;
          logger.debug(
            `Successfully parsed translations for ${language} via JSON`,
          );
          return translations;
        } catch (jsonError) {
          logger.debug(
            `JSON parsing failed for ${language}: ${parseError(jsonError).message}`,
          );
          // Could add more sophisticated parsing here if needed
          return {};
        }
      }

      logger.debug(`No translation object found in ${languagePath}`);
      return {};
    } catch (error) {
      logger.error(
        `Failed to load translations for ${language}: ${parseError(error).message}`,
      );
      return {};
    }
  }

  /**
   * Group translations by their actual usage locations using location-based co-location
   * Creates separate files for each specific usage location instead of finding common ancestors
   * @param translations - The translation object to group
   * @param keyUsageMap - Map of translation keys to their usage locations
   * @param keyUsageFrequency - Map of key usage frequency for smart flattening
   * @param logger - Logger instance for debugging
   * @returns Map of location paths to translation objects
   */
  private groupTranslationsByUsage(
    translations: TranslationObject,
    keyUsageMap: Map<string, string[]>,
    keyUsageFrequency: Map<string, number>,
    logger: EndpointLogger,
  ): {
    groups: Map<string, TranslationObject>;
    originalKeys: Map<
      string,
      Array<{ key: string; value: string | number | boolean }>
    >;
  } {
    const groups = new Map<string, TranslationObject>();
    const originalKeys = new Map<
      string,
      Array<{ key: string; value: string | number | boolean }>
    >();

    logger.debug("Grouping translations by location-based co-location");
    logger.debug(
      `Input translations keys: ${Object.keys(translations).join(", ")}`,
    );
    logger.debug(`Key usage map size: ${keyUsageMap.size}`);

    try {
      // Process each translation key and co-locate at ALL usage locations
      this.processTranslationKeysForCoLocation(
        translations,
        "",
        keyUsageMap,
        keyUsageFrequency,
        groups,
        originalKeys,
        logger,
      );

      logger.debug(`Created ${groups.size} location-based translation groups`);
      for (const [location, translations] of groups) {
        logger.debug(
          `Location: ${location} - ${Object.keys(translations).length} keys`,
        );
      }
      return { groups, originalKeys };
    } catch (error) {
      logger.error("Error in groupTranslationsByUsage", {
        error: parseError(error).message,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return { groups: new Map(), originalKeys: new Map() };
    }
  }

  /**
   * Process translation keys for location-based co-location
   * Co-locates each translation at ALL of its specific usage locations
   * @param obj - The translation object to process
   * @param currentPath - The current key path being processed
   * @param keyUsageMap - Map of translation keys to their usage locations
   * @param keyUsageFrequency - Map of key usage frequency for smart flattening
   * @param groups - Map to store the co-located translations
   * @param originalKeys - Map to store original key mappings for each location
   * @param logger - Logger instance for debugging
   */
  private processTranslationKeysForCoLocation(
    obj: TranslationObject,
    currentPath: string,
    keyUsageMap: Map<string, string[]>,
    keyUsageFrequency: Map<string, number>,
    groups: Map<string, TranslationObject>,
    originalKeys: Map<
      string,
      Array<{ key: string; value: string | number | boolean }>
    >,
    logger: EndpointLogger,
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recursively process nested objects
        this.processTranslationKeysForCoLocation(
          value,
          fullPath,
          keyUsageMap,
          keyUsageFrequency,
          groups,
          originalKeys,
          logger,
        );
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        // This is a leaf translation value
        const usageFiles = keyUsageMap.get(fullPath) || [];

        // Only process keys that are actually used in the codebase
        if (usageFiles.length === 0) {
          logger.debug(`Skipping unused translation key: ${fullPath}`);
          return;
        }

        // Co-locate at EACH specific usage location (not common ancestor)
        const specificLocations = this.getSpecificUsageLocations(
          usageFiles,
          logger,
        );

        for (const location of specificLocations) {
          // Transform the key based on the specific location
          const transformedKey = this.locationAnalyzer.transformKeyForLocation(
            fullPath,
            location,
            keyUsageFrequency,
          );

          logger.debug(
            `Co-locating key: ${fullPath} -> ${transformedKey} at location: ${location}`,
          );

          // Add the key to this specific location group
          if (!groups.has(location)) {
            groups.set(location, {});
          }

          // Store the translation directly - we'll build nested structure in file generation
          groups.get(location)![fullPath] = value;
        }
      }
    }
  }

  /**
   * Get specific usage locations for co-location
   * Returns all directory paths where the translation should be co-located
   * @param usageFiles - Array of file paths where the key is used
   * @param logger - Logger instance for debugging
   * @returns Array of specific directory paths for co-location
   */
  private getSpecificUsageLocations(
    usageFiles: string[],
    logger: EndpointLogger,
  ): string[] {
    if (usageFiles.length === 0) {
      return [];
    }

    // Convert file paths to directory paths and make them relative
    const directories = usageFiles
      .map((filePath) => path.dirname(filePath))
      .map((dir) => {
        const projectRoot = process.cwd();
        if (dir.startsWith(projectRoot)) {
          return path.relative(projectRoot, dir);
        }
        return dir;
      })
      .filter((dir, index, array) => array.indexOf(dir) === index); // Remove duplicates

    logger.debug(
      `Found ${directories.length} specific usage locations: ${directories.join(", ")}`,
    );

    // Filter out generic locations and prefer specific ones
    const filteredDirectories = this.filterSpecificLocations(
      directories,
      logger,
    );

    logger.debug(
      `After filtering: ${filteredDirectories.length} locations: ${filteredDirectories.join(", ")}`,
    );

    return filteredDirectories;
  }

  /**
   * Filter locations for true location-based co-location
   * Returns ALL specific usage locations without aggressive filtering
   * @param directories - Array of directory paths
   * @param logger - Logger instance for debugging
   * @returns All specific directory paths for co-location
   */
  private filterSpecificLocations(
    directories: string[],
    logger: EndpointLogger,
  ): string[] {
    // Remove duplicates and sort by specificity (deeper paths first)
    const uniqueDirs = [...new Set(directories)].toSorted((a, b) => {
      const depthA = a.split("/").length;
      const depthB = b.split("/").length;
      return depthB - depthA; // Deeper first
    });

    // For true location-based co-location, we want ALL specific locations
    // Only filter out obviously generic/root locations
    const filteredDirs = uniqueDirs.filter((dir) => {
      // Skip root-level directories that are too generic
      const parts = dir.split("/");
      if (parts.length <= 2) {
        logger.debug(`Skipping too generic location: ${dir}`);
        return false;
      }

      // Skip if it's just src/app or src/components etc.
      if (
        parts.length === 3 &&
        (parts[2] === "app" || parts[2] === "components")
      ) {
        logger.debug(`Skipping generic app/components location: ${dir}`);
        return false;
      }

      return true;
    });

    logger.debug(
      `Location-based co-location: keeping ${filteredDirs.length} specific locations out of ${directories.length} total`,
    );

    // Log first few locations for debugging
    const sampleLocations = filteredDirs.slice(0, 5);
    logger.debug(`Sample locations: ${sampleLocations.join(", ")}`);

    return filteredDirs;
  }

  /**
   * Regroup translations for a specific language based on the new structure
   * Extracts actual translation values and maps them to the new location-based structure
   */
  private regroupTranslationsForLanguage(
    languageTranslations: TranslationObject,
    groups: Map<string, TranslationObject>,
    keyUsageMap: Map<string, string[]>,
    logger: EndpointLogger,
  ): Map<string, TranslationObject> {
    logger.debug("Regrouping translations for language", {
      groupCount: groups.size,
      languageKeysCount: Object.keys(languageTranslations).length,
    });

    const regroupedTranslations = new Map<string, TranslationObject>();

    // For each location group, extract the corresponding translation values
    for (const [location, englishTranslations] of groups) {
      const locationTranslations: TranslationObject = {};

      // Extract translation values for each key in this location
      this.extractTranslationValuesForLocation(
        englishTranslations,
        languageTranslations,
        locationTranslations,
        "",
        keyUsageMap,
        logger,
      );

      if (Object.keys(locationTranslations).length > 0) {
        regroupedTranslations.set(location, locationTranslations);
        logger.debug(
          `Regrouped ${Object.keys(locationTranslations).length} translations for location: ${location}`,
        );
      }
    }

    logger.debug(
      `Regrouping completed: ${regroupedTranslations.size} location groups created`,
    );
    return regroupedTranslations;
  }

  /**
   * Extract translation values for a specific location from the source language translations
   */
  private extractTranslationValuesForLocation(
    englishTranslations: TranslationObject,
    sourceLanguageTranslations: TranslationObject,
    targetLocationTranslations: TranslationObject,
    currentPath: string,
    keyUsageMap: Map<string, string[]>,
    logger: EndpointLogger,
  ): void {
    for (const [key, englishValue] of Object.entries(englishTranslations)) {
      const fullKey = currentPath ? `${currentPath}.${key}` : key;

      if (
        typeof englishValue === "object" &&
        englishValue !== null &&
        !Array.isArray(englishValue)
      ) {
        // Recursively process nested objects
        this.extractTranslationValuesForLocation(
          englishValue,
          sourceLanguageTranslations,
          targetLocationTranslations,
          fullKey,
          keyUsageMap,
          logger,
        );
      } else {
        // This is a leaf translation value - find the corresponding value in source language
        const sourceValue = this.findTranslationValue(
          fullKey,
          sourceLanguageTranslations,
        );

        if (sourceValue !== undefined) {
          targetLocationTranslations[key] = sourceValue;
          logger.debug(`Extracted translation: ${fullKey} = ${sourceValue}`);
        }
      }
    }
  }

  /**
   * Find a translation value by key path in the source translations
   */
  private findTranslationValue(
    keyPath: string,
    sourceTranslations: TranslationObject,
  ): string | number | boolean | undefined {
    const keys = keyPath.split(".");
    let current: TranslationObject | string | number | boolean =
      sourceTranslations;

    for (const key of keys) {
      if (
        current &&
        typeof current === "object" &&
        !Array.isArray(current) &&
        key in current
      ) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === "string" ||
      typeof current === "number" ||
      typeof current === "boolean"
      ? current
      : undefined;
  }

  /**
   * Update main index structure: replace section imports with location-based imports
   * @param groups - Map of location paths to translation objects
   * @param _languages - Array of available languages (unused in current implementation)
   * @param logger - Logger instance for debugging
   * @returns True if the main index was successfully updated
   */
  private updateMainIndexStructure(
    groups: Map<string, TranslationObject>,
    _languages: string[],
    logger: EndpointLogger,
  ): boolean {
    try {
      const mainIndexPath = path.join(
        TRANSLATIONS_DIR,
        languageDefaults.language,
        "index.ts",
      );

      if (!fs.existsSync(mainIndexPath)) {
        logger.debug(`Main index file not found: ${mainIndexPath}`);
        return false;
      }

      // Read current main index content
      const currentContent = fs.readFileSync(mainIndexPath, "utf8");

      // Generate new main index content with location-based imports
      const newContent = this.generateMainIndexContent(groups);

      if (newContent === currentContent) {
        logger.debug("Main index content unchanged");
        return false;
      }

      // Write updated content atomically
      const tempPath = mainIndexPath + TMP_EXTENSION;
      fs.writeFileSync(tempPath, newContent, "utf8");
      fs.renameSync(tempPath, mainIndexPath);

      logger.debug("Successfully updated main index structure");
      return true;
    } catch (error) {
      logger.error("Failed to update main index structure", {
        error: parseError(error).message,
      });
      return false;
    }
  }

  /**
   * Generate new main index content with location-based imports
   * Keep structure intact, replace section imports with location-based imports
   * @param groups - Map of location paths to translation objects
   * @returns The generated main index content as a string
   */
  private generateMainIndexContent(
    groups: Map<string, TranslationObject>,
  ): string {
    // Extract the current structure but replace section imports
    const locationBasedImports = this.generateLocationBasedImports(groups);
    const translationsObject = this.generateMainTranslationsObject(groups);

    // Generate new content maintaining the same structure
    const newContent = MAIN_INDEX_TEMPLATE.replace(
      LOCATION_IMPORTS_PLACEHOLDER,
      locationBasedImports,
    ).replace(TRANSLATIONS_OBJECT_PLACEHOLDER, translationsObject);

    return newContent;
  }

  /**
   * Generate location-based imports for main index
   */
  private generateLocationBasedImports(
    groups: Map<string, TranslationObject>,
  ): string {
    const imports: string[] = [];

    // Keep API translations import (existing structure)
    imports.push(API_TRANSLATIONS_IMPORT);

    // Add location-based imports for each group
    let importIndex = 0;
    for (const [location] of groups) {
      const importName = LOCATION_TRANSLATIONS_PREFIX + importIndex++;
      const relativePath = this.generateRelativeImportPath(location);
      imports.push(
        IMPORT_TEMPLATE_START +
          importName +
          IMPORT_TEMPLATE_END +
          relativePath +
          IMPORT_CLOSE,
      );
    }

    return imports.join("\n");
  }

  /**
   * Generate relative import path for a location
   */
  private generateRelativeImportPath(location: string): string {
    // Convert absolute location to relative import path
    const relativePath = path.relative(
      path.join(TRANSLATIONS_DIR, languageDefaults.language),
      path.join(
        location,
        I18N_PATH,
        languageDefaults.language,
        INDEX_FILE_WITHOUT_EXTENSION,
      ),
    );

    // Ensure it starts with ./ or ../
    return relativePath.startsWith(".")
      ? relativePath
      : DOT_SLASH + relativePath;
  }

  /**
   * Generate main translations object structure
   */
  private generateMainTranslationsObject(
    groups: Map<string, TranslationObject>,
  ): string {
    const parts: string[] = [];

    // Keep API structure
    parts.push(API_TRANSLATIONS_KEY);

    // Add location-based translations
    let importIndex = 0;
    for (const [location] of groups) {
      const importName = LOCATION_TRANSLATIONS_PREFIX + importIndex++;
      const keyName = this.locationToObjectKey(location);
      parts.push(
        SPACE_SPACE + QUOTE + keyName + QUOTE + COLON_SPACE + importName,
      );
    }

    return OBJECT_OPEN + parts.join(COMMA_NEWLINE) + OBJECT_CLOSE;
  }

  /**
   * Convert location path to object key
   */
  private locationToObjectKey(location: string): string {
    return location
      .replace(/^src\//, "")
      .replace(/\//g, ".")
      .replace(/\[locale\]\.?/, "")
      .replace(/\.i18n.*$/, "");
  }

  /**
   * Get translation statistics
   * @param locale - The locale for translations
   * @param logger - Logger instance for debugging
   * @returns Response containing translation statistics
   */
  async getTranslationStats(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      stats: {
        totalKeys: number;
        usedKeys: number;
        unusedKeys: number;
        translationFiles: number;
        languages: string[];
        lastAnalyzedAt: string;
      };
    }>
  > {
    try {
      logger.info("Getting translation statistics");

      // Load current translations
      const currentTranslations = await this.loadCurrentTranslations(logger);

      // Analyze key usage
      const allKeys =
        this.keyUsageAnalyzer.extractAllTranslationKeys(currentTranslations);
      const keyUsageMap = this.keyUsageAnalyzer.scanCodebaseForKeyUsage(
        allKeys,
        logger,
      );

      const usedKeys = [...keyUsageMap.keys()].length;
      const unusedKeys = allKeys.size - usedKeys;

      // Count translation files
      const translationFiles = this.countTranslationFiles();

      // Get available languages
      const languages: string[] = ["en", "de", "pl"];

      return success({
        success: true,
        stats: {
          totalKeys: allKeys.size,
          usedKeys,
          unusedKeys,
          translationFiles,
          languages,
          lastAnalyzedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error("Error getting translation stats", {
        error: parseError(error),
      });
      return fail({
        message:
          "app.api.v1.core.system.translations.reorganize.repository.error.internal_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Count translation files in the i18n directory
   */
  private countTranslationFiles(): number {
    let count = 0;
    const TS_EXTENSION = ".ts";
    const countFilesRecursive = (dir: string): void => {
      if (!fs.existsSync(dir)) {
        return;
      }

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          countFilesRecursive(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(TS_EXTENSION)) {
          count++;
        }
      }
    };

    countFilesRecursive(I18N_PATH);
    return count;
  }
}

// Create a singleton instance of the repository
export const translationReorganizeRepository =
  new TranslationReorganizeRepositoryImpl();
