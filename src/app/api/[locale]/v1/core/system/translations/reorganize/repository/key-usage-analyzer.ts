import fs from "node:fs";
import path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import { scanDirectory } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/filesystem/directory-scanner";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import {
  FILE_EXTENSIONS,
  IGNORED_DIRS,
  IGNORED_FILES,
  SRC_DIR,
  TEST_FILE_PATTERN,
} from "../constants";

export interface TranslationObject {
  [key: string]: string | number | boolean | TranslationObject;
}

export class KeyUsageAnalyzer {
  /**
   * Extract all translation keys from the translation object recursively
   * @param translations - The translation object to extract keys from
   * @returns A set of all translation keys found in the object
   */
  extractAllTranslationKeys(translations: TranslationObject): Set<string> {
    const keys = new Set<string>();

    const extractKeys = (obj: TranslationObject, prefix = ""): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // Recursively extract keys from nested objects
          extractKeys(value, fullKey);
        } else {
          // This is a leaf value - add the key
          keys.add(fullKey);
        }
      }
    };

    extractKeys(translations);
    return keys;
  }

  /**
   * Scan the codebase to find where each translation key is actually used
   * @param allKeys - Set of all translation keys to search for
   * @param logger - Logger instance for debugging
   * @returns Map of translation keys to arrays of file paths where they are used
   */
  scanCodebaseForKeyUsage(
    allKeys: Set<string>,
    logger: EndpointLogger,
  ): Map<string, string[]> {
    const keyUsageMap = new Map<string, string[]>();

    logger.debug(
      `Scanning codebase for usage of ${allKeys.size} translation keys`,
    );

    // Get all source files to scan
    const sourceFiles = this.findFiles(SRC_DIR, FILE_EXTENSIONS);

    logger.debug(`Found ${sourceFiles.length} source files to scan`);

    // Scan each file for key usage
    for (const filePath of sourceFiles) {
      // Skip translation files themselves, test files, and backup files
      if (
        filePath.includes("/i18n/") ||
        filePath.includes("/__tests__/") ||
        filePath.includes(TEST_FILE_PATTERN) ||
        filePath.includes("/.tmp/")
      ) {
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, "utf8");

        // Check each key for usage in this file
        for (const key of allKeys) {
          if (this.isKeyUsedInFile(key, content)) {
            if (!keyUsageMap.has(key)) {
              keyUsageMap.set(key, []);
            }
            keyUsageMap.get(key)?.push(filePath);
          }
        }
      } catch (error) {
        logger.debug(`Could not read file ${filePath}: ${parseError(error)}`);
      }
    }

    const usedKeysCount = Array.from(keyUsageMap.keys()).length;
    logger.debug(
      `Found usage for ${usedKeysCount} keys across ${sourceFiles.length} files`,
    );

    return keyUsageMap;
  }

  /**
   * Check if a translation key is used in a file by searching for the key as a string literal
   * @param key - The translation key to search for
   * @param content - The file content to search in
   * @returns True if the key is found in the content
   */
  private isKeyUsedInFile(key: string, content: string): boolean {
    // eslint-disable-next-line i18next/no-literal-string
    return content.includes(`"${key}"`);
  }

  /**
   * Find all files with specified extensions in a directory recursively
   * @param dir - Directory to search in
   * @param extensions - Array of file extensions to include (e.g., ['.ts', '.tsx'])
   * @returns Array of file paths matching the extensions
   */
  private findFiles(dir: string, extensions: string[]): string[] {
    // Use consolidated directory scanner
    const results = scanDirectory(dir, {
      extensions,
      excludeDirs: IGNORED_DIRS,
      excludeFiles: IGNORED_FILES,
    });

    return results.map((r) => r.fullPath);
  }
}
