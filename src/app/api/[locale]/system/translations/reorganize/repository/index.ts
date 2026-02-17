import fs from "node:fs";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
  FILE_EXTENSIONS,
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
  SRC_DIR,
  TEST_FILE_PATTERN,
  TMP_EXTENSION,
  TRANSLATIONS_DIR,
  TRANSLATIONS_OBJECT_PLACEHOLDER,
} from "../constants";
import type {
  TranslationReorganizeRequestOutput,
  TranslationReorganizeResponseOutput,
} from "../definition";
import type { FileGenerator as FileGeneratorType } from "./file-generator";
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
  private fileGenerator: FileGeneratorType | null = null;

  /**
   * Get or create the FileGenerator instance (lazy-loaded to avoid Turbopack warnings)
   * The FileGenerator uses dynamic file paths that can't be statically analyzed
   */
  private async getFileGenerator(): Promise<FileGeneratorType> {
    if (!this.fileGenerator) {
      const { FileGenerator } = await import("./file-generator");
      this.fileGenerator = new FileGenerator();
    }
    return this.fileGenerator;
  }

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
      // Auto-enable removeUnused when regenerating structure
      const removeUnused = request.regenerateStructure;

      output.push(
        t(
          "app.api.system.translations.reorganize.repository.repository.messages.starting",
        ),
      );

      // Create backup if requested
      let backupPath: string | undefined;
      if (request.backup && !request.dryRun) {
        backupPath = this.createBackup(logger);

        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.api.messages.backupCreated",
            {
              path: backupPath,
            },
          ),
        );
      }

      output.push(
        t(
          "app.api.system.translations.reorganize.repository.repository.messages.scanningUsage",
        ),
      );

      // Load current translations

      output.push(
        t(
          "app.api.system.translations.reorganize.repository.repository.messages.loadingFiles",
        ),
      );
      const currentTranslations = await this.loadCurrentTranslations(logger);

      // Extract all known keys from current translation files
      const allKeys =
        this.keyUsageAnalyzer.extractAllTranslationKeys(currentTranslations);

      // Scan source files to check where each known key is actually used
      const keyUsageMap = this.keyUsageAnalyzer.scanCodebaseForKeyUsage(
        allKeys,
        logger,
      );

      // Keys in keyUsageMap have usage, keys not in map are unused
      const usedKeys = keyUsageMap.size;
      const unusedKeys = allKeys.size - usedKeys;

      // Add unused keys to map with empty usage arrays for downstream processing
      for (const key of allKeys) {
        if (!keyUsageMap.has(key)) {
          keyUsageMap.set(key, []);
        }
      }

      logger.info(
        `Key usage analysis: ${usedKeys} used / ${allKeys.size} total (${unusedKeys} unused)`,
      );

      output.push(
        t(
          "app.api.system.translations.reorganize.repository.repository.api.messages.foundKeys",
          {
            used: usedKeys,
            total: allKeys.size,
          },
        ),
      );

      // Handle unused key removal if requested
      let keysRemoved = 0;
      let filteredTranslations = currentTranslations;

      if (removeUnused && unusedKeys > 0) {
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.api.messages.removingKeys",
            {
              count: unusedKeys,
            },
          ),
        );
        filteredTranslations = this.removeUnusedKeys(
          currentTranslations,
          keyUsageMap,
          logger,
        );
        keysRemoved = unusedKeys;
      }

      if (request.dryRun) {
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.dryRunCompleted",
          ),
        );
        if (removeUnused && unusedKeys > 0) {
          output.push(
            t(
              "app.api.system.translations.reorganize.repository.repository.messages.removedKeysFromLanguage",
              {
                count: unusedKeys,
                language: t(
                  "app.api.system.translations.reorganize.repository.repository.messages.unusedKeysLabel",
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
              unusedKeys: removeUnused ? 0 : unusedKeys,
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
      if (removeUnused && !request.regenerateStructure && keysRemoved > 0) {
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.writingFilteredTranslations",
          ),
        );

        // Calculate key usage frequency for smart flattening
        const keyUsageFrequency = new Map<string, number>();
        for (const [key, files] of keyUsageMap) {
          keyUsageFrequency.set(key, files.length);
        }

        // Ensure fileGenerator is initialized before grouping (needed for locationToFlatKey)
        await this.getFileGenerator();

        // Group translations by usage location
        const { groups, keyMappings } = this.groupTranslationsByUsage(
          filteredTranslations,
          keyUsageMap,
          keyUsageFrequency,
          logger,
        );

        logger.info(`Created ${groups.size} location-based translation groups`);
        logger.info(
          `Key mappings: ${keyMappings.size} keys need to be updated`,
        );

        // Fix key mappings based on actual flattening that will happen during file generation
        if (this.fileGenerator) {
          this.fixKeyMappingsWithFlattening(groups, keyMappings, logger);
          logger.info(
            `After flattening correction: ${keyMappings.size} keys need to be updated`,
          );
        }

        // Update code files with new keys
        if (keyMappings.size > 0) {
          const filesUpdated = this.updateCodeFilesWithNewKeys(
            keyMappings,
            logger,
          );
          output.push(
            `Updated ${filesUpdated} code files with new translation keys`,
          );
        }

        // Process each language
        const languages = this.getAvailableLanguages();
        let filesCreated = 0;

        // First pass: Collect all regrouped translations for all languages
        const allRegroupedTranslations: Map<string, TranslationObject>[] = [];
        const languageTranslationsMap = new Map<
          string,
          Map<string, TranslationObject>
        >();

        for (const language of languages) {
          const languageTranslations = await this.loadLanguageTranslations(
            language,
            logger,
          );

          // Apply the new grouping to this language's translations
          const regroupedTranslations = this.regroupTranslationsForLanguage(
            languageTranslations,
            groups,
            keyUsageMap,
            logger, // No key mappings in removeUnused mode
          );

          allRegroupedTranslations.push(regroupedTranslations);
          languageTranslationsMap.set(language, regroupedTranslations);
        }

        // Register all locations from all languages so parent aggregators are created correctly
        const fileGen = await this.getFileGenerator();
        fileGen.registerAllLocations(allRegroupedTranslations);

        // Second pass: Generate files for each language
        for (const language of languages) {
          const regroupedTranslations = languageTranslationsMap.get(language)!;

          // Generate files
          try {
            const generated = fileGen.generateTranslationFiles(
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
                  "app.api.system.translations.reorganize.repository.repository.api.messages.removingKeys",
                descriptionParams: {
                  language,
                  count: keysRemoved,
                },
              });
            }
          } catch (fileGenError) {
            logger.error(`File generation failed for ${language}`, {
              error: parseError(fileGenError).message,
            });
          }
        }

        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.completed",
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
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.regeneratingStructure",
          ),
        );

        // Analyze key usage frequency for smart flattening

        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.analyzingFrequency",
          ),
        );
        const keyUsageFrequency =
          this.locationAnalyzer.analyzeKeyUsageFrequency(currentTranslations);

        // Group translations by usage location
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.groupingByLocation",
          ),
        );

        // Ensure fileGenerator is initialized before grouping (needed for locationToFlatKey)
        await this.getFileGenerator();

        const { groups, keyMappings } = this.groupTranslationsByUsage(
          filteredTranslations, // Use filtered translations (with unused keys removed if requested)
          keyUsageMap,
          keyUsageFrequency,
          logger,
        );

        logger.info(`Created ${groups.size} translation groups`);
        logger.info(
          `Key mappings: ${keyMappings.size} keys need to be updated`,
        );

        // Fix key mappings based on actual flattening that will happen during file generation
        if (this.fileGenerator) {
          this.fixKeyMappingsWithFlattening(groups, keyMappings, logger);
          logger.info(
            `After flattening correction: ${keyMappings.size} keys need to be updated`,
          );
        }

        // Update code files with new keys
        if (keyMappings.size > 0) {
          const codeFilesUpdated = this.updateCodeFilesWithNewKeys(
            keyMappings,
            logger,
          );
          output.push(
            `Updated ${codeFilesUpdated} code files with new translation keys`,
          );
        }

        // Generate files for each language
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.generatingFiles",
          ),
        );

        // Only generate files if there are actually used keys
        if (usedKeys > 0) {
          const languages = this.getAvailableLanguages();
          let filesUpdated = 0;
          let filesCreated = 0;

          // First pass: Collect all regrouped translations for all languages
          const allRegroupedTranslations: Map<string, TranslationObject>[] = [];
          const languageTranslationsMap = new Map<
            string,
            Map<string, TranslationObject>
          >();

          for (const language of languages) {
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
              keyMappings,
            );

            allRegroupedTranslations.push(regroupedTranslations);
            languageTranslationsMap.set(language, regroupedTranslations);
          }

          // Register all locations from all languages so parent aggregators are created correctly
          const fileGen2 = await this.getFileGenerator();
          fileGen2.registerAllLocations(allRegroupedTranslations);

          // Second pass: Generate files for each language
          for (const language of languages) {
            const regroupedTranslations =
              languageTranslationsMap.get(language)!;

            // Generate files
            try {
              const generated = fileGen2.generateTranslationFiles(
                regroupedTranslations,
                language,
                logger,
              );

              if (generated) {
                filesUpdated++;
                changes.push({
                  type: "updated",
                  path: path.join(TRANSLATIONS_DIR, language, "app.api.system.translations.reorganize.repository.index.ts"),
                  description:
                    "app.api.system.translations.reorganize.repository.repository.api.messages.regeneratedStructure",
                  descriptionParams: { language },
                });
              }
            } catch (fileGenError) {
              logger.error(`File generation failed for ${language}`, {
                error: parseError(fileGenError).message,
              });
            }
          }

          // Main index structure is now handled by the hierarchical file generation
          // The new system generates proper hierarchical imports instead of flat location-based imports
          output.push(
            t(
              "app.api.system.translations.reorganize.repository.repository.messages.completed",
            ),
          );

          return success({
            response: {
              success: true,
              summary: {
                totalKeys: allKeys.size,
                usedKeys,
                unusedKeys: removeUnused ? 0 : unusedKeys,
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
        }
        output.push(
          t(
            "app.api.system.translations.reorganize.repository.repository.messages.noKeysInUse",
          ),
        );
      }

      output.push(
        t(
          "app.api.system.translations.reorganize.repository.repository.messages.completed",
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
          "app.api.system.translations.reorganize.repository.repository.error.internalError",
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
    const filteredTranslations: TranslationObject = {};
    this.filterUsedKeys(
      translations,
      filteredTranslations,
      "",
      keyUsageMap,
      logger,
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
        }
      } else {
        // For leaf values, check if the key is used
        const usageFiles = keyUsageMap.get(fullPath) || [];
        if (usageFiles.length > 0) {
          target[key] = value;
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
    const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
    const backupPath = path.join(BACKUP_DIR, BACKUP_PREFIX + timestamp);

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create backup structure
    const srcDir = path.resolve(process.cwd(), "src");
    this.backupI18nFiles(srcDir, backupPath, logger);

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

    // First, remove all existing i18n directories
    this.removeAllI18nDirectories(logger);

    // Then restore from backup
    this.restoreI18nFiles(backupPath);
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
            "app.api.system.translations.reorganize.repository.repository.messages.backupNotFound",
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
            "app.api.system.translations.reorganize.repository.repository.messages.validationSuccessful",
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
      }

      // Perform the restore
      this.restoreFromBackup(request.backupPath, logger);

      return success({
        success: true,
        message: t(
          "app.api.system.translations.reorganize.repository.repository.messages.restoreSuccessful",
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
          "app.api.system.translations.reorganize.repository.repository.error.internalError",
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
  private restoreI18nFiles(backupRoot: string): void {
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
      // STEP 1: Load from flat structure
      const mainLanguagePath = path.join(
        TRANSLATIONS_DIR,
        languageDefaults.language,
        "app.api.system.translations.reorganize.repository.index.ts",
      );

      let flatTranslations: TranslationObject = {};

      if (!fs.existsSync(mainLanguagePath)) {
        logger.debug(`Main language file not found: ${mainLanguagePath}`);
      } else {
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
        } else {
          flatTranslations = translations;
        }
      }

      // STEP 2: Load from existing co-located i18n files and merge
      logger.info(
        `Loading existing co-located i18n files for ${languageDefaults.language}...`,
      );
      const colocatedTranslations = await this.loadColocatedTranslations(
        languageDefaults.language,
        logger,
      );

      // STEP 3: Merge flat and co-located translations (co-located takes precedence)
      const mergedTranslations = {
        ...flatTranslations,
        ...colocatedTranslations,
      };

      logger.info(
        `Loaded ${Object.keys(flatTranslations).length} keys from flat structure, ` +
          `${Object.keys(colocatedTranslations).length} keys from co-located files, ` +
          `${Object.keys(mergedTranslations).length} total keys for current translations`,
      );

      return mergedTranslations;
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
        .filter((name) => !name.startsWith("."))
        .filter((name) => name !== "core"); // Exclude infrastructure directories
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
      // STEP 1: Load from old flat structure
      const languagePath = path.join(TRANSLATIONS_DIR, language, "app.api.system.translations.reorganize.repository.index.ts");
      let flatTranslations: TranslationObject = {};

      if (!fs.existsSync(languagePath)) {
        logger.debug(`Language file not found: ${languagePath}`);
      } else {
        // Try to use dynamic import first (proper ES module support)
        try {
          const fileUrl = FILE_PROTOCOL + languagePath;
          const translationModule = (await import(
            fileUrl
          )) as TranslationModule;
          const translations =
            translationModule.default || translationModule.translations;

          if (translations && typeof translations === "object") {
            logger.debug(
              `Successfully loaded translations for ${language} via import`,
            );
            flatTranslations = translations;
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
            flatTranslations = translations;
          } catch (jsonError) {
            logger.debug(
              `JSON parsing failed for ${language}: ${parseError(jsonError).message}`,
            );
            // Could add more sophisticated parsing here if needed
          }
        }
      }

      // STEP 2: Load from existing co-located i18n files and merge
      logger.info(`Loading existing co-located i18n files for ${language}...`);
      const colocatedTranslations = await this.loadColocatedTranslations(
        language,
        logger,
      );

      // STEP 3: Merge flat and co-located translations (co-located takes precedence)
      const mergedTranslations = {
        ...flatTranslations,
        ...colocatedTranslations,
      };

      logger.info(
        `Loaded ${Object.keys(flatTranslations).length} keys from flat structure, ` +
          `${Object.keys(colocatedTranslations).length} keys from co-located files, ` +
          `${Object.keys(mergedTranslations).length} total keys for ${language}`,
      );

      return mergedTranslations;
    } catch (error) {
      logger.error(
        `Failed to load translations for ${language}: ${parseError(error).message}`,
      );
      return {};
    }
  }

  /**
   * Load all existing co-located i18n files and flatten them into a single object
   */
  private async loadColocatedTranslations(
    language: string,
    logger: EndpointLogger,
  ): Promise<TranslationObject> {
    const result: TranslationObject = {};
    const projectRoot = process.cwd();

    // Ensure fileGenerator is loaded
    await this.getFileGenerator();

    // Scan for i18n files in src/app and src/app/api
    const searchPaths = [
      path.join(projectRoot, "src/app"),
      path.join(projectRoot, "src/app/api"),
    ];

    for (const searchPath of searchPaths) {
      if (!fs.existsSync(searchPath)) {
        continue;
      }

      // Find all i18n/${language}/index.ts files
      const findI18nFiles = (dir: string): string[] => {
        const files: string[] = [];
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              // Check if this is an i18n/${language} directory
              if (entry.name === "i18n") {
                // NOTE: Must use template literal to prevent linter from auto-replacing with full path
                const indexFileName = `${"index"}.ts`;
                const langFile = path.join(fullPath, language, indexFileName);
                if (fs.existsSync(langFile)) {
                  files.push(langFile);
                }
              }
              // Recurse into subdirectories
              files.push(...findI18nFiles(fullPath));
            }
          }
        } catch (err) {
          // Skip directories we can't read
        }
        return files;
      };

      const i18nFiles = findI18nFiles(searchPath);
      logger.info(
        `Found ${i18nFiles.length} co-located i18n files for ${language} in ${searchPath}`,
      );

      // Load each file and merge into result
      for (const filePath of i18nFiles) {
        try {
          // Extract location prefix from file path
          // e.g., src/app/api/[locale]/agent/models/openrouter/i18n/en/index.ts
          //    -> app.api.agent.models.openrouter
          const relativePath = path.relative(projectRoot, filePath);
          const locationPath = path.dirname(
            path.dirname(path.dirname(relativePath)),
          ); // Remove /i18n/en/index.ts
          const locationPrefix = locationPath
            .replace(/^src\//, "")
            .replace(/\/\[locale\]/g, "") // Remove [locale] segment
            .replace(/\//g, ".");

          // Load the file
          const fileUrl = FILE_PROTOCOL + filePath;
          const translationModule = (await import(
            fileUrl
          )) as TranslationModule;
          const translations =
            translationModule.default || translationModule.translations;

          if (translations && typeof translations === "object") {
            // Flatten and prefix all keys with the location prefix
            const flattenedKeys =
              this.fileGenerator!.flattenTranslationObjectPublic(translations);

            for (const [key, value] of Object.entries(flattenedKeys)) {
              const fullKey = locationPrefix ? `${locationPrefix}.${key}` : key;
              result[fullKey] = value;
            }

            logger.debug(
              `Loaded ${Object.keys(flattenedKeys).length} keys from ${relativePath}`,
            );
          }
        } catch (err) {
          logger.debug(
            `Failed to load co-located file ${filePath}: ${parseError(err).message}`,
          );
        }
      }
    }

    return result;
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
    keyMappings: Map<string, string>;
  } {
    const groups = new Map<string, TranslationObject>();
    const originalKeys = new Map<
      string,
      Array<{ key: string; value: string | number | boolean }>
    >();
    const keyMappings = new Map<string, string>();

    try {
      // Process each translation key and co-locate at ALL usage locations
      this.processTranslationKeysForCoLocation(
        translations,
        "",
        keyUsageMap,
        keyUsageFrequency,
        groups,
        originalKeys,
        keyMappings,
        logger,
      );

      // CRITICAL: Apply flattening while resolving conflicts
      this.applyFlatteningWithConflictResolution(
        groups,
        originalKeys,
        keyMappings,
        logger,
      );

      // After reorganization, check for keys in source files that don't match new structure
      // Build flat map of all keys in new structure
      const newStructureKeys = new Map<string, string>(); // newKey -> location
      for (const [location, groupTrans] of groups) {
        this.extractKeysFromObject(groupTrans, "", newStructureKeys, location);
      }

      logger.info(`New structure has ${newStructureKeys.size} keys`);
      logger.info(`Source files have ${keyUsageMap.size} keys`);

      // Check all source file keys against new structure
      const missingKeys = new Map<string, string[]>(); // location -> missing keys

      for (const [sourceKey, usageFiles] of keyUsageMap) {
        // If source key exists in new structure with same name, no mapping needed
        if (newStructureKeys.has(sourceKey)) {
          continue;
        }

        // Source key doesn't exist in old translations
        // Create placeholder in the new structure based on usage location
        logger.warn(`Source key not found in old translations: "${sourceKey}"`);

        // Get usage location(s)
        const locations = this.getSpecificUsageLocations(usageFiles, logger);

        if (locations.length > 0) {
          // Use first location (or common ancestor if multiple)
          let location =
            locations.length === 1
              ? locations[0]
              : this.getCommonAncestorLocation(locations);

          // Strip src/ prefix if present (locations from getSpecificUsageLocations might include it)
          if (location.startsWith("src/")) {
            location = location.slice(4); // Remove "src/"
          } else if (location === "src" || location === "") {
            // Root level or no common ancestor - default to app for shared global keys
            location = "app";
          }

          // Add placeholder entry to groups
          const locationPrefix =
            this.fileGenerator!.locationToFlatKeyPublic(location);

          // Calculate the correct key for this location
          // The key should be: locationPrefix + suffix (where suffix is the part after locationPrefix)
          // If sourceKey doesn't start with locationPrefix, extract the non-location parts as suffix
          const keyParts = sourceKey.split(".");
          const locationParts = locationPrefix ? locationPrefix.split(".") : [];

          // Find common prefix between key and location prefix (not location path!)
          let commonPrefixLength = 0;
          for (
            let i = 0;
            i < Math.min(keyParts.length, locationParts.length);
            i++
          ) {
            if (keyParts[i] === locationParts[i]) {
              commonPrefixLength = i + 1;
            } else {
              break;
            }
          }

          // Get key remainder after common prefix
          const keyRemainder = keyParts.slice(commonPrefixLength);

          // Strip duplicate path segments from keyRemainder that appear in location
          // This handles cases where old keys have folder names that are now in the path
          // Example: location "app/[locale]/admin/_components" has prefix "app.api.system.translations.reorganize.repository.admin.Components"
          // Old key "app.api.system.translations.reorganize.repository.common.admin.dashboard" has remainder "app.api.system.translations.reorganize.repository.dashboard"
          // We need to filter out "components" since "_components" is in the location
          const locationRemainder = locationParts.slice(commonPrefixLength);
          const toCamelCase = (str: string) =>
            str.replace(/[-_]([a-z0-9])/g, (_, letter) => letter.toUpperCase());
          const locationRemainderCamel = locationRemainder.map(toCamelCase);

          const filteredRemainder = keyRemainder.filter((keyPart) => {
            const keyPartCamel = toCamelCase(keyPart);
            // Remove parts that match location segments (case-insensitive)
            const hasExactMatch = locationRemainderCamel.some(
              (locPart) =>
                !locPart.startsWith("[") && locPart.toLowerCase() === keyPartCamel.toLowerCase()
            );
            if (hasExactMatch) {
              return false; // Remove exact matches
            }
            return true; // Keep other parts
          });

          // Normalize snake_case to camelCase for each part
          const normalizedRemainder = filteredRemainder.map((part) =>
            part.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
          );
          let keySuffix = normalizedRemainder.join(".");

          // Build correct key with location prefix
          const correctPlaceholderKey = locationPrefix
            ? `${locationPrefix}.${keySuffix}`
            : keySuffix;

          // Check if the correct key exists in loaded translations
          // This handles the case where source code has old key but translations have new key
          const existingValue = translations[correctPlaceholderKey];
          const placeholderValue = existingValue !== undefined
            ? existingValue
            : `TODO: ${keySuffix}`;

          // Add to groups with value (existing or placeholder)
          if (!groups.has(location)) {
            groups.set(location, {});
          }
          const groupTranslations = groups.get(location)!;
          groupTranslations[correctPlaceholderKey] = placeholderValue;

          // Add to originalKeys so it gets processed in conflict resolution and regrouping
          if (!originalKeys.has(location)) {
            originalKeys.set(location, []);
          }
          originalKeys.get(location)!.push({
            key: correctPlaceholderKey,
            value: placeholderValue,
          });

          // Track missing keys for reporting
          if (!missingKeys.has(location)) {
            missingKeys.set(location, []);
          }
          missingKeys.get(location)!.push(sourceKey);

          logger.info(
            `Created placeholder for missing key: ${sourceKey} at ${location}`,
          );

          // Track key mapping for updating source files if source key differs from correct key
          if (sourceKey !== correctPlaceholderKey) {
            keyMappings.set(sourceKey, correctPlaceholderKey);
            logger.info(`MAPPING: "${sourceKey}" -> "${correctPlaceholderKey}"`);
          }
        }
      }

      // Report missing keys summary
      if (missingKeys.size > 0) {
        logger.warn(
          `Created placeholders for ${[...missingKeys.values()].flat().length} missing keys across ${missingKeys.size} locations`,
        );
      }

      logger.info(`Generated ${keyMappings.size} source file mappings`);

      return { groups, originalKeys, keyMappings };
    } catch (error) {
      logger.error("Error in groupTranslationsByUsage", {
        error: parseError(error).message,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        groups: new Map(),
        originalKeys: new Map(),
        keyMappings: new Map(),
      };
    }
  }

  /**
   * Get the common ancestor location for multiple usage files
   * @param usageFiles - Array of file paths where the key is used
   * @returns The common ancestor directory path
   */
  private getCommonAncestorLocation(usageFiles: string[]): string {
    if (usageFiles.length === 0) {
      return SRC_DIR;
    }

    if (usageFiles.length === 1) {
      // Single usage - use the directory containing the file
      return path.dirname(usageFiles[0]);
    }

    // Find common ancestor
    const dirs = usageFiles.map((f) => path.dirname(f));
    let commonPath = dirs[0];

    for (const dir of dirs.slice(1)) {
      // Find common prefix
      const parts1 = commonPath.split(path.sep);
      const parts2 = dir.split(path.sep);
      const common: string[] = [];

      for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
        if (parts1[i] === parts2[i]) {
          common.push(parts1[i]);
        } else {
          break;
        }
      }

      commonPath = common.join(path.sep);
    }

    return commonPath || SRC_DIR;
  }

  /**
   * Update code files to use new translation keys
   * @param keyMappings - Map of old keys to new keys
   * @param logger - Logger instance for debugging
   * @returns Number of files updated
   */
  private updateCodeFilesWithNewKeys(
    keyMappings: Map<string, string>,
    logger: EndpointLogger,
  ): number {
    let filesUpdated = 0;

    // Get all source files
    const sourceFiles = this.keyUsageAnalyzer.findFiles(
      SRC_DIR,
      FILE_EXTENSIONS,
    );

    for (const filePath of sourceFiles) {
      // Skip translation files, test files, and backup files
      if (
        filePath.includes("/i18n/") ||
        filePath.includes("/__tests__/") ||
        filePath.includes(TEST_FILE_PATTERN) ||
        filePath.includes("/.tmp/")
      ) {
        continue;
      }

      try {
        let content = fs.readFileSync(filePath, "utf8");
        let modified = false;

        // Replace each old key with the new key - exact double-quote matching
        for (const [oldKey, newKey] of keyMappings) {
          // Match exact double-quoted strings: "oldKey"
          const escapedOldKey = oldKey.replaceAll(".", "\\.");
          const pattern = new RegExp(`"${escapedOldKey}"`, "g");

          if (pattern.test(content)) {
            content = content.replace(pattern, `"${newKey}"`);
            modified = true;
            logger.debug(
              `Replacing "${oldKey}" with "${newKey}" in ${filePath}`,
            );
          }
        }

        if (modified) {
          fs.writeFileSync(filePath, content, "utf8");
          filesUpdated++;
        }
      } catch (error) {
        logger.error(`Failed to update file ${filePath}`, {
          error: parseError(error).message,
        });
      }
    }

    return filesUpdated;
  }

  /**
   * Fix key mappings based on actual flattening that will occur during file generation
   * This ensures that single-child intermediate levels are properly removed from keys
   */
  private fixKeyMappingsWithFlattening(
    groups: Map<string, TranslationObject>,
    keyMappings: Map<string, string>,
    logger: EndpointLogger,
  ): void {
    // For each location, simulate the complete flattening and update mappings
    for (const [location, translations] of groups.entries()) {
      // Get location prefix
      const locationPrefix =
        this.fileGenerator!.locationToFlatKeyPublic(location);

      // Strip location prefix from all keys
      const strippedTranslations: TranslationObject = {};
      for (const [key, value] of Object.entries(translations)) {
        let strippedKey = key;
        if (locationPrefix && key.startsWith(`${locationPrefix}.`)) {
          strippedKey = key.slice(locationPrefix.length + 1);
        }
        strippedTranslations[strippedKey] = value;
      }

      // Unflatten to nested structure
      const nested =
        this.fileGenerator!.unflattenTranslationObjectPublic(
          strippedTranslations,
        );

      // Identify folder segments in the stripped keys that should NEVER be flattened
      // These are segments that represent actual folder names, not just nested objects in a file
      const folderSegments = new Set<string>(["common"]); // Always preserve "common"

      // Extract ALL intermediate path segments from all keys at this location
      // For example, if we have keys like "[...slug].notFound", "[id].details.name", etc.
      // we need to preserve ALL segments except the last: "[...slug]", "[id]", "details"
      // because they ALL represent folder/file structure, not redundant nesting
      for (const key of Object.keys(strippedTranslations)) {
        const segments = key.split(".");
        // Add ALL segments except the last one (which is the actual leaf translation key)
        for (let i = 0; i < segments.length - 1; i++) {
          folderSegments.add(segments[i]);
        }
      }

      // Flatten single-child objects, but preserve folder segments
      const flattened =
        this.fileGenerator!.flattenSingleChildObjectsPublic(nested, folderSegments);

      // Flatten back to dot notation
      const flattenedKeys =
        this.fileGenerator!.flattenTranslationObjectPublic(flattened);

      // Now compare original keys to flattened keys and update mappings
      for (const [originalKey, value] of Object.entries(translations)) {
        // Find this key in the flattened structure
        let strippedOriginal = originalKey;
        if (locationPrefix && originalKey.startsWith(`${locationPrefix}.`)) {
          strippedOriginal = originalKey.slice(locationPrefix.length + 1);
        }

        // The flattened key should exist in flattenedKeys
        if (flattenedKeys[strippedOriginal] !== undefined) {
          // Key wasn't changed by flattening - it's already correct
          continue;
        }

        // Find the flattened version by comparing values
        // (This is safe because we're within the same location)
        for (const [flatKey, flatValue] of Object.entries(flattenedKeys)) {
          if (flatValue === value) {
            // Found the flattened version
            const correctKey = locationPrefix
              ? `${locationPrefix}.${flatKey}`
              : flatKey;

            if (originalKey !== correctKey) {
              // Update mapping
              // First, find any existing mapping for this original key
              let sourceKey = originalKey;
              for (const [oldKey, newKey] of keyMappings.entries()) {
                if (newKey === originalKey) {
                  sourceKey = oldKey;
                  break;
                }
              }

              // Update or create mapping
              keyMappings.set(sourceKey, correctKey);

              // CRITICAL: Also update the groups Map to use the flattened key
              // Otherwise regrouping will fail because it looks for the old intermediate key
              const locationTranslations = groups.get(location)!;
              if (locationTranslations[originalKey] !== undefined) {
                locationTranslations[correctKey] =
                  locationTranslations[originalKey];
                delete locationTranslations[originalKey];
              }

              logger.info(
                `[FLATTEN-FIX] ${sourceKey} -> ${correctKey} (was: ${originalKey})`,
              );
            }
            break;
          }
        }
      }
    }
  }

  /**
   * Extract all keys from a translation object
   */
  private extractKeysFromObject(
    obj: TranslationObject,
    prefix: string,
    keys: Map<string, string>,
    location: string,
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.extractKeysFromObject(value, fullKey, keys, location);
      } else {
        keys.set(fullKey, location);
      }
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
   * @param keyMappings - Map to store old key to new key mappings
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
    keyMappings: Map<string, string>,
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
        logger.debug(`Recursing into nested object: ${fullPath}`);
        this.processTranslationKeysForCoLocation(
          value,
          fullPath,
          keyUsageMap,
          keyUsageFrequency,
          groups,
          originalKeys,
          keyMappings,
          logger,
        );
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        // This is a leaf translation value
        let usageFiles = keyUsageMap.get(fullPath) || [];

        // If not found, try checking for old key variants where _folder -> folder
        // This handles loaded translations with new structure (app.admin._components.navigation)
        // when source code still uses old structure (app.admin.components.navigation)
        if (usageFiles.length === 0) {
          const oldKeyVariant = fullPath.replace(/\._([a-z])/g, ".$1");
          if (oldKeyVariant !== fullPath) {
            usageFiles = keyUsageMap.get(oldKeyVariant) || [];
            if (usageFiles.length > 0) {
              logger.debug(`Found usage for old key variant: ${oldKeyVariant} (new key: ${fullPath})`);
            }
          }
        }

        // Only process keys that are actually used in the codebase
        if (usageFiles.length === 0) {
          logger.debug(`Skipping unused translation key: ${fullPath}`);
          continue;
        }

        // Place translation at the FOLDER where the key is used
        let location: string;
        let isShared = false;

        if (usageFiles.length === 1) {
          // Single usage - place at the directory of that file
          location = path.dirname(usageFiles[0]);
        } else {
          // Multiple usages - check if one file is an enum definition
          // Enum definitions (enum.ts files) are the PRIMARY location
          const enumFile = usageFiles.find(
            (f) =>
              f.endsWith("/enum.ts") ||
              f.endsWith("/enums.ts") ||
              f.includes("/enum/"),
          );

          if (enumFile) {
            // Use enum definition location as primary
            location = path.dirname(enumFile);
            isShared = false;
          } else {
            // Find common ancestor
            location = this.getCommonAncestorLocation(usageFiles);
            isShared = true;
          }
        }

        // Convert absolute path to relative path from project root
        const projectRoot = process.cwd();
        if (location.startsWith(projectRoot)) {
          location = location.slice(projectRoot.length + 1); // +1 for the slash
        }

        // Strip src/ prefix since we only work inside src folder
        if (location.startsWith("src/")) {
          location = location.slice(4); // Remove "src/"
        } else if (location === "src") {
          location = ""; // Root level
        }

        // Special handling for root-level keys that should be mapped to specific folders
        // If location is empty (root level) and key starts with a known prefix, map it to that folder
        if (location === "") {
          const keyPrefix = fullPath.split(".")[0];
          // Map keys like config.* to config folder, app-native.* to app-native folder, etc.
          // Exclude "src" because it's the base directory and would create src/src/
          if (
            keyPrefix &&
            keyPrefix !== "app" &&
            keyPrefix !== "packages" &&
            keyPrefix !== "src"
          ) {
            location = keyPrefix;
            logger.debug(
              `Mapped root-level key ${fullPath} to folder: ${location}`,
            );
          }
        }

        // Calculate what the key SHOULD be based on the actual location
        const actualLocationPrefix = this.fileGenerator
          ? this.fileGenerator.locationToFlatKeyPublic(location)
          : "";

        // For shared keys, we need to insert "common" after the common ancestor location prefix
        // Example: key "app.api.system.translations.reorganize.repository.repository.api.common.tags.threads" shared at location "app/api/[locale]/agent/chat/threads"
        // The common ancestor part is what's shared: find the longest common prefix
        // Then insert "common" after that prefix
        let adjustedKey = fullPath;
        if (isShared && actualLocationPrefix) {
          const locationDotCommon = `${actualLocationPrefix}.common`;
          if (!adjustedKey.startsWith(`${locationDotCommon}.`)) {
            // Find the longest common prefix between the key and location prefix
            const keyParts = fullPath.split(".");
            const locationParts = actualLocationPrefix.split(".");

            let commonPrefixLength = 0;
            for (
              let i = 0;
              i < Math.min(keyParts.length, locationParts.length);
              i++
            ) {
              if (keyParts[i] === locationParts[i]) {
                commonPrefixLength = i + 1;
              } else {
                break;
              }
            }

            // Build the adjusted key with "common" inserted after the common prefix
            const commonPrefix = keyParts
              .slice(0, commonPrefixLength)
              .join(".");
            const remaining = keyParts.slice(commonPrefixLength).join(".");

            adjustedKey = commonPrefix
              ? `${commonPrefix}.common.${remaining}`
              : `common.${fullPath}`;

            logger.info(
              `Inserted "common" for shared key at ${location}: ${fullPath} -> ${adjustedKey} (common prefix: ${commonPrefix})`,
            );
          }
        }

        logger.info(
          `Co-locating key: ${adjustedKey} at location: ${location} (actual location prefix: ${actualLocationPrefix}, isShared: ${isShared})`,
        );

        // Determine the correct key structure based on actual location
        // The key should match the folder structure where it's used
        let correctKey: string;

        // Extract the suffix after the location prefix
        let keySuffix: string;

        // For shared keys at common ancestors, ensure "common" is preserved in the structure
        // This prevents flattening from breaking the key lookup
        const hasCommonInKey = adjustedKey.includes(".common.");
        const shouldPreserveCommon = isShared && hasCommonInKey;

        // Convert adjustedKey to camelCase for comparison with actualLocationPrefix
        const fullPathCamelCase = adjustedKey
          .split(".")
          .map((part) =>
            part.replace(/[-_]([a-z0-9])/g, (_, letter) =>
              letter.toUpperCase(),
            ),
          )
          .join(".");

        // Try to find where the key diverges from the actual location
        if (
          actualLocationPrefix &&
          fullPathCamelCase.startsWith(`${actualLocationPrefix}.`)
        ) {
          // Key already matches the location - it's correct!
          keySuffix = fullPathCamelCase.slice(actualLocationPrefix.length + 1);
          // Convert hyphenated/snake_case segments to camelCase
          keySuffix = keySuffix
            .split(".")
            .map((part) =>
              part.replace(/[-_]([a-z0-9])/g, (_, letter) =>
                letter.toUpperCase(),
              ),
            )
            .join(".");
          correctKey = `${actualLocationPrefix}.${keySuffix}`;

          // For shared keys, ensure they're under "common" in the file structure
          if (shouldPreserveCommon && !keySuffix.startsWith("common.")) {
            // Extract the common part and reconstruct
            const keyAfterPrefix = adjustedKey.slice(
              actualLocationPrefix.length + 1,
            );
            const parts = keyAfterPrefix.split(".");
            const commonIndex = parts.indexOf("common");
            if (commonIndex >= 0) {
              // Rebuild with common at the start
              keySuffix = ["common", ...parts.slice(commonIndex + 1)].join(".");
            }
          }
        } else {
          // Key doesn't match the actual location
          // We need to reconstruct the correct key
          // Strategy: Replace the location-related parts of the key with the actual location prefix
          // Then keep the rest as the suffix
          // For example:
          // - Key: app.admin.components.navigation.dashboard
          // - Location: app/[locale]/admin/_components → prefix: app.admin._components
          // - We replace "app.api.system.translations.reorganize.repository.admin.components" with "app.api.system.translations.reorganize.repository.admin.Components"
          // - Suffix: navigation.dashboard
          // - Correct key: app.admin._components.navigation.dashboard

          const keyParts = adjustedKey.split(".");
          const locationParts = actualLocationPrefix
            ? actualLocationPrefix.split(".")
            : [];

          // Find where key and location paths diverge
          // This handles cases where the key has a different structure than the location
          // Example: key "app.api.system.translations.reorganize.repository.repository.api.common.tags.threads" vs location "app.api.system.translations.reorganize.repository.repository.api.threads"
          // Common prefix: ["app", "api", "agent", "chat"]
          // Key continues with: ["tags", "threads"]
          // Location continues with: ["threads"]
          // The suffix should be the key parts after common prefix, minus any redundant overlap

          let commonPrefixLength = 0;
          for (
            let i = 0;
            i < Math.min(keyParts.length, locationParts.length);
            i++
          ) {
            if (keyParts[i] === locationParts[i]) {
              commonPrefixLength = i + 1;
            } else {
              break;
            }
          }

          // Get the key parts after the common prefix
          const keyRemainder = keyParts.slice(commonPrefixLength);

          // Get the location parts after the common prefix
          const locationRemainder = locationParts.slice(commonPrefixLength);

          // Remove any key parts that redundantly duplicate the location remainder
          // Example: if keyRemainder = ["tags", "threads"] and locationRemainder = ["threads"]
          // We should remove "threads" from keyRemainder if it appears at the end
          // Also handles: keyRemainder = ["tags", "files"] and locationRemainder = ["files", "[threadId]", "[filename]"]
          // Should remove "files" even though it's not at the end of locationRemainder
          let suffixParts = keyRemainder;

          if (locationRemainder.length > 0) {
            // First check for trailing overlap (most common case)
            const trailingOverlap = this.findTrailingOverlap(
              keyRemainder,
              locationRemainder,
            );
            if (trailingOverlap > 0) {
              // Remove the overlapping parts from the suffix
              suffixParts = keyRemainder.slice(0, -trailingOverlap);
            } else {
              // Check if any segments in keyRemainder also appear in locationRemainder
              // This handles cases where dynamic parameters like [threadId] appear in the middle
              // CRITICAL: Convert to camelCase for comparison since folders use kebab-case
              // ALSO: Check if key part is a "composite" that starts with a location part
              // (e.g., "cronSystem" starts with "cron" from folder) - these are old namespaces to remove
              const toCamelCase = (str: string) =>
                str.replace(/[-_]([a-z0-9])/g, (_, letter) =>
                  letter.toUpperCase(),
                );
              const locationRemainderCamel = locationRemainder.map(toCamelCase);

              suffixParts = keyRemainder.filter((keyPart) => {
                // Keep the part if it's NOT in the location remainder
                // But ignore parameter placeholders like [threadId] when checking
                const keyPartCamel = toCamelCase(keyPart);

                // Check for exact match (case-insensitive)
                const hasExactMatch = locationRemainderCamel.some(
                  (locPart) =>
                    !locPart.startsWith("[") && locPart.toLowerCase() === keyPartCamel.toLowerCase(),
                );
                if (hasExactMatch) {
                  return false; // Remove exact matches
                }

                // Check if keyPart is a composite that starts with any location part
                // e.g., "cronSystem" starts with "cron" -> remove it
                const isComposite = locationRemainderCamel.some((locPart) => {
                  if (locPart.startsWith("[")) {
                    return false;
                  } // Skip dynamic segments
                  // Check if keyPart starts with locPart and has more characters after
                  // This catches "cronSystem" starting with "cron"
                  return (
                    keyPartCamel.length > locPart.length &&
                    keyPartCamel.startsWith(locPart) &&
                    // Ensure the next character is uppercase (camelCase boundary)
                    keyPartCamel[locPart.length] ===
                      keyPartCamel[locPart.length].toUpperCase()
                  );
                });

                return !isComposite; // Keep only non-composite parts
              });
            }
          }

          keySuffix = suffixParts.join(".");
          // Convert to camelCase
          keySuffix = keySuffix
            .split(".")
            .map((part) =>
              part.replace(/[-_]([a-z0-9])/g, (_, letter) =>
                letter.toUpperCase(),
              ),
            )
            .join(".");

          // For shared keys with "common" in them, ensure "common" is at the start of the suffix
          if (shouldPreserveCommon) {
            // Check if "common" is in the key remainder
            const commonIndex = keyRemainder.indexOf("common");
            if (commonIndex >= 0) {
              // Reconstruct suffix with "common" at the beginning
              const partsAfterCommon = keyRemainder.slice(commonIndex + 1);
              // Apply camelCase normalization to the parts after "common"
              const normalizedParts = partsAfterCommon.map((part) =>
                part.replace(/[-_]([a-z0-9])/g, (_, letter) =>
                  letter.toUpperCase(),
                ),
              );
              keySuffix = ["common", ...normalizedParts].join(".");
            }
          }

          // The correct key is: location prefix + suffix
          // This preserves the full key structure after the location prefix
          if (actualLocationPrefix && keySuffix) {
            correctKey = `${actualLocationPrefix}.${keySuffix}`;
          } else if (actualLocationPrefix && !keySuffix) {
            // No suffix - the key's non-location parts were all filtered out
            // This shouldn't happen in normal cases, but if it does,
            // use the last part of the original key as suffix
            keySuffix = keyParts[keyParts.length - 1];
            correctKey = `${actualLocationPrefix}.${keySuffix}`;
          } else {
            // No location prefix (root level) - keep adjusted key unchanged
            // This happens when common ancestor is at src/ root, which means
            // the key is used across multiple top-level directories
            keySuffix = keyParts[keyParts.length - 1];
            correctKey = adjustedKey;
          }

          // NOTE: Flattening simulation removed - will be done after all keys collected
        }

        // Skip scoped translation locations - check if this location or any parent has a scoped i18n index
        let isScoped = false;
        const locationParts = location.split("/");
        for (let i = locationParts.length; i > 0; i--) {
          const parentLocation = locationParts.slice(0, i).join("/");
          const scopedCheckPath = path.join(
            process.cwd(),
            "src",
            parentLocation,
            "i18n",
            "app.api.system.translations.reorganize.repository.index.ts",
          );
          if (fs.existsSync(scopedCheckPath)) {
            try {
              const scopedContent = fs.readFileSync(scopedCheckPath, "utf-8");
              if (scopedContent.includes("createScopedTranslation")) {
                // This location or a parent is scoped - skip it entirely
                logger.info(
                  `[SCOPED-SKIP] Skipping scoped location: ${location} (parent: ${parentLocation}) for key: ${fullPath}`,
                );
                isScoped = true;
                break;
              }
            } catch {
              // If we can't read it, continue checking parents
            }
          }
        }
        if (isScoped) {
          continue;
        }

        // Safeguard: Never use "src" as a location since it's the base directory
        // Keys at root level should have empty string location
        if (location === "src") {
          location = "";
          logger.debug(
            `Converted location "src" to root level for key: ${fullPath}`,
          );
        }

        // Add the key to this location group with the CORRECT FULL key
        if (!groups.has(location)) {
          groups.set(location, {});
        }
        groups.get(location)![correctKey] = value;

        // Track key mapping for updating source files
        if (fullPath !== correctKey) {
          keyMappings.set(fullPath, correctKey);
          logger.info(`MAPPING: "${fullPath}" -> "${correctKey}"`);
        }

        // Track the original key for this location
        if (!originalKeys.has(location)) {
          originalKeys.set(location, []);
        }
        originalKeys.get(location)!.push({
          key: keySuffix,
          value: value,
        });
      }
    }
  }

  /**
   * Apply flattening while resolving conflicts
   */
  private applyFlatteningWithConflictResolution(
    groups: Map<string, TranslationObject>,
    originalKeys: Map<
      string,
      Array<{ key: string; value: string | number | boolean }>
    >,
    keyMappings: Map<string, string>,
    logger: EndpointLogger,
  ): void {
    for (const [location, originalKeysList] of originalKeys) {
      const locationPrefix = this.fileGenerator
        ? this.fileGenerator.locationToFlatKeyPublic(location)
        : "";

      const allKeys = originalKeysList.map(({ key }) => key);
      const conflicts = new Set<string>();

      for (const key of allKeys) {
        const hasChildren = allKeys.some(
          (otherKey) => otherKey !== key && otherKey.startsWith(`${key}.`),
        );

        if (hasChildren) {
          conflicts.add(key);
          logger.warn(
            `CONFLICT at ${location}: "${key}" has both value and children`,
          );

          const conflictIndex = originalKeysList.findIndex(
            ({ key: k }) => k === key,
          );
          if (conflictIndex !== -1) {
            const { value } = originalKeysList[conflictIndex];
            const newKey = `${key}._conflict_0`;
            originalKeysList[conflictIndex] = { key: newKey, value };

            const fullOldKey = locationPrefix
              ? `${locationPrefix}.${key}`
              : key;
            const fullNewKey = locationPrefix
              ? `${locationPrefix}.${newKey}`
              : newKey;
            const groupTranslations = groups.get(location);
            if (
              groupTranslations &&
              groupTranslations[fullOldKey] !== undefined
            ) {
              groupTranslations[fullNewKey] = groupTranslations[fullOldKey];
              delete groupTranslations[fullOldKey];
            }

            logger.info(
              `CONFLICT-FIX: Renamed "${fullOldKey}" -> "${fullNewKey}"`,
            );
          }
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
    keyMappings?: Map<string, string>,
  ): Map<string, TranslationObject> {
    logger.info("Regrouping translations for language", {
      groupCount: groups.size,
      languageKeysCount: Object.keys(languageTranslations).length,
    });

    const regroupedTranslations = new Map<string, TranslationObject>();

    // Create reverse mapping: NEW key → OLD key
    const reverseKeyMappings = new Map<string, string>();
    if (keyMappings) {
      for (const [oldKey, newKey] of keyMappings) {
        reverseKeyMappings.set(newKey, oldKey);
      }
    }

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
        reverseKeyMappings,
      );

      if (Object.keys(locationTranslations).length > 0) {
        regroupedTranslations.set(location, locationTranslations);
        logger.debug(
          `Regrouped ${Object.keys(locationTranslations).length} translations for location: ${location}`,
        );
      } else {
        // Only log at debug level - these are expected when location has no translations yet
        logger.debug(
          `No translations found for location: ${location} - Expected keys: ${Object.keys(englishTranslations).slice(0, 3).join(", ")}`,
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
    keyMappings?: Map<string, string>,
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
          keyMappings,
        );
      } else {
        // This is a leaf translation value - find the corresponding value in source language
        // fullKey already contains the complete path from the nested English translations structure
        // which was built using correctKey (includes location prefix + .common. for shared keys)
        const completeKey = fullKey;

        // If the key was remapped (NEW key in reverseKeyMappings), use the original key to look up the translation
        const lookupKey = keyMappings?.has(completeKey)
          ? keyMappings.get(completeKey)!
          : completeKey;

        // Try direct lookup first (for flat translation objects)
        let sourceValue = sourceLanguageTranslations[lookupKey] as string | number | boolean | undefined;

        // If not found, try nested lookup (for nested translation objects)
        if (sourceValue === undefined) {
          sourceValue = this.findTranslationValue(
            lookupKey,
            sourceLanguageTranslations,
          );
        }

        // If still not found with lookup key (old key), try with complete key (new key)
        // This handles loaded translations that already have the new key structure
        if (sourceValue === undefined && lookupKey !== completeKey) {
          // Try direct lookup with new key
          sourceValue = sourceLanguageTranslations[completeKey] as string | number | boolean | undefined;

          // If still not found, try nested lookup
          if (sourceValue === undefined) {
            sourceValue = this.findTranslationValue(
              completeKey,
              sourceLanguageTranslations,
            );
          }

          if (sourceValue !== undefined) {
            logger.debug(
              `Found translation with new key: ${completeKey} (old key ${lookupKey} not found)`,
            );
          }
        }

        if (sourceValue !== undefined) {
          targetLocationTranslations[key] = sourceValue;
          logger.debug(
            `Extracted translation: ${completeKey} (lookup: ${lookupKey}) = ${sourceValue}`,
          );
        } else {
          // Key doesn't exist in old translations
          // If the English value is a TODO placeholder, use it (for new keys)
          if (
            typeof englishValue === "string" &&
            englishValue.startsWith("TODO: ")
          ) {
            targetLocationTranslations[key] = englishValue;
            logger.info(
              `Using placeholder for new key: ${completeKey} = ${englishValue}`,
            );
          } else {
            // Only log at debug level - these are expected when keys are defined but not yet translated
            logger.debug(
              `Could not find translation for key: ${completeKey} (lookup: ${lookupKey})`,
            );
          }
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
   * @param logger - Logger instance for debugging
   * @returns True if the main index was successfully updated
   */
  private updateMainIndexStructure(
    groups: Map<string, TranslationObject>,
    logger: EndpointLogger,
  ): boolean {
    try {
      const mainIndexPath = path.join(
        TRANSLATIONS_DIR,
        languageDefaults.language,
        "app.api.system.translations.reorganize.repository.index.ts",
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
      .replaceAll("/", ".")
      .replace(/\[locale\]\.?/, "")
      .replace(/\.i18n.*$/, "");
  }

  /**
   * Get translation statistics
   * @param locale - The locale for translations
   * @param logger - Logger instance for debugging
   * @returns Response containing translation statistics
   */
  async getTranslationStats(logger: EndpointLogger): Promise<
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
          "app.api.system.translations.reorganize.repository.repository.error.internalError",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Find the length of trailing overlap between two arrays
   * Example: findTrailingOverlap(["tags", "threads"], ["threads"]) returns 1
   * Example: findTrailingOverlap(["a", "b", "c"], ["b", "c"]) returns 2
   * Example: findTrailingOverlap(["a", "b"], ["c", "d"]) returns 0
   */
  private findTrailingOverlap(arr1: string[], arr2: string[]): number {
    let overlap = 0;
    const minLength = Math.min(arr1.length, arr2.length);

    for (let i = 1; i <= minLength; i++) {
      // Check if the last i elements of arr1 match the last i elements of arr2
      let matches = true;
      for (let j = 0; j < i; j++) {
        if (arr1[arr1.length - i + j] !== arr2[arr2.length - i + j]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        overlap = i;
      } else {
        break;
      }
    }

    return overlap;
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
