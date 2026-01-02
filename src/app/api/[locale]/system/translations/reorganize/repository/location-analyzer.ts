import path from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { FOLDER_TRANSFORMATIONS, SKIP_FOLDERS, UNUSED_KEYS_LOCATION } from "../constants";
import type { TranslationObject } from "./key-usage-analyzer";

export class LocationAnalyzer {
  /**
   * Determine the target location for a translation key based on its usage
   * Location-based co-location: Place translations at deepest/most specific usage location
   * @param keyPath - The translation key path
   * @param usageFiles - Array of file paths where the key is used
   * @param logger - Logger instance for debugging
   * @returns The target location path for the translation
   */
  determineTargetLocationFromUsage(
    keyPath: string,
    usageFiles: string[],
    logger: EndpointLogger,
  ): string {
    logger.debug(
      `Determining target location for key: ${keyPath}, used in ${usageFiles.length} files`,
    );

    // If key is not used anywhere, determine a reasonable default location
    if (usageFiles.length === 0) {
      // Default to a common location in the project structure
      return path.resolve(process.cwd(), "src/app/[locale]/common");
    }

    // If key is used in only one file, place it co-located with that file
    if (usageFiles.length === 1) {
      const filePath = usageFiles[0];
      const targetDir = path.dirname(filePath);
      const relativeDir = this.makeRelativePath(targetDir);

      logger.debug(`Key ${keyPath} used in single file, co-locating in: ${relativeDir}`);

      return relativeDir;
    }

    // Multi-location handling - prefer deepest/most specific location
    const targetLocation = this.findMostSpecificLocation(usageFiles, logger);
    const relativeLocation = this.makeRelativePath(targetLocation);

    logger.debug(
      `Key ${keyPath} used in ${usageFiles.length} files, most specific location: ${relativeLocation}`,
    );

    return relativeLocation;
  }

  /**
   * Convert absolute path to relative path from project root
   * @param absolutePath - The absolute path to convert
   * @returns The relative path from project root
   */
  private makeRelativePath(absolutePath: string): string {
    const projectRoot = process.cwd();

    if (absolutePath.startsWith(projectRoot)) {
      return path.relative(projectRoot, absolutePath);
    }

    return absolutePath;
  }

  /**
   * Find the most specific location for multi-location usage
   * Prefers deeper/more specific paths over generic common ancestors
   * @param usageFiles - Array of file paths where the key is used
   * @param logger - Logger instance for debugging
   * @returns The most specific location path
   */
  private findMostSpecificLocation(usageFiles: string[], logger: EndpointLogger): string {
    if (usageFiles.length === 0) {
      return path.resolve(process.cwd(), UNUSED_KEYS_LOCATION);
    }

    if (usageFiles.length === 1) {
      return path.dirname(usageFiles[0]);
    }

    // Convert to directory paths and sort by depth (deepest first)
    const directories = usageFiles
      .map((filePath) => path.dirname(filePath))
      .map((dir) => path.resolve(dir))
      .toSorted((a, b) => b.split(path.sep).length - a.split(path.sep).length);

    logger.debug(`Analyzing ${directories.length} directories for most specific location`);

    // Prefer API-specific locations over generic app locations
    const apiDirs = directories.filter((dir) => dir.includes("/api/"));
    const appDirs = directories.filter((dir) => dir.includes("/app/") && !dir.includes("/api/"));

    // If we have API directories, prefer the deepest API directory
    if (apiDirs.length > 0) {
      const deepestApiDir = apiDirs[0]; // Already sorted by depth
      logger.debug(`Selected deepest API directory: ${deepestApiDir}`);
      return deepestApiDir;
    }

    // If we have app directories, prefer the deepest app directory
    if (appDirs.length > 0) {
      const deepestAppDir = appDirs[0]; // Already sorted by depth
      logger.debug(`Selected deepest app directory: ${deepestAppDir}`);
      return deepestAppDir;
    }

    // Fallback to the deepest directory overall
    const deepestDir = directories[0];
    logger.debug(`Selected deepest directory overall: ${deepestDir}`);
    return deepestDir;
  }

  /**
   * Transform a translation key based on its target location with smart flattening
   * Folder-level organization: Keys based on folder hierarchy only
   * @param originalKey - The original translation key
   * @param targetLocation - The target location for the key
   * @param keyUsageFrequency - Map of key usage frequency for smart flattening
   * @returns The transformed key for the target location
   */
  transformKeyForLocation(
    originalKey: string,
    targetLocation: string,
    keyUsageFrequency: Map<string, number>,
  ): string {
    // Convert the target location to a key path following spec rules
    const locationKey = this.locationToKeyPath(targetLocation);

    // Apply smart flattening per spec rules
    const flattenedKey = this.applySmartFlattening(originalKey, keyUsageFrequency);

    // Smart key optimization
    // If this is a single key usage, keep the full flattened key
    // If multiple keys share the same path, use folder-level organization
    if (this.isSingleKeyUsage(originalKey, keyUsageFrequency)) {
      // Single key: keep full path like "app.(site).imprint.printButton"
      return locationKey ? `${locationKey}.${flattenedKey}` : flattenedKey;
    }
    // Multiple keys: use folder-level organization
    // Extract just the final key part for folder-level grouping
    const keyParts = flattenedKey.split(".");
    const finalKey = keyParts[keyParts.length - 1];
    return locationKey ? `${locationKey}.${finalKey}` : finalKey;
  }

  /**
   * Check if this is a single key usage scenario
   * @param originalKey - The original translation key
   * @param keyUsageFrequency - Map of key usage frequency
   * @returns True if this is a single key usage scenario
   */
  private isSingleKeyUsage(originalKey: string, keyUsageFrequency: Map<string, number>): boolean {
    const keyPath = originalKey.split(".").slice(0, -1).join(".");
    const siblingCount = [...keyUsageFrequency.keys()].filter(
      (key) => key.startsWith(`${keyPath}.`) && key !== originalKey,
    ).length;

    return siblingCount === 0;
  }

  /**
   * Apply smart flattening rules
   * Flatten single-use: If app.(site).imprint.buttons.printButton has only one child → app.(site).imprint.printButton
   * Keep multi-use: If buttons has multiple children, preserve structure
   * @param originalKey - The original translation key
   * @param keyUsageFrequency - Map of key usage frequency
   * @returns The flattened key
   */
  private applySmartFlattening(
    originalKey: string,
    keyUsageFrequency: Map<string, number>,
  ): string {
    const parts = originalKey.split(".");
    const result: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const currentPart = parts[i];
      const parentPath = parts.slice(0, i + 1).join(".");

      // Count how many sibling keys exist at this level
      const siblingCount = this.countSiblingKeys(parentPath, keyUsageFrequency);

      // Keep the part if it's the last part OR has multiple children
      if (i === parts.length - 1 || siblingCount > 1) {
        result.push(currentPart);
      }
      // Skip intermediate parts with only one child (flatten single-use)
    }

    // Ensure we always have at least the final key part
    if (result.length === 0 && parts.length > 0) {
      result.push(parts[parts.length - 1]);
    }

    return result.join(".");
  }

  /**
   * Count sibling keys at the same level
   * @param parentPath - The parent path to count siblings for
   * @param keyUsageFrequency - Map of key usage frequency
   * @returns The number of sibling keys
   */
  private countSiblingKeys(parentPath: string, keyUsageFrequency: Map<string, number>): number {
    const parentPrefix = `${parentPath}.`;
    let count = 0;

    for (const key of keyUsageFrequency.keys()) {
      if (key.startsWith(parentPrefix)) {
        // Count direct children only (not nested grandchildren)
        const remainingPath = key.slice(parentPrefix.length);
        if (!remainingPath.includes(".")) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Convert a file location to a key path
   * (site) → preserved as (site), [locale] → skipped, _components → transformed to components
   * Example: src/app/[locale]/(site)/imprint/_components -> app.(site).imprint.components
   * @param location - The file location to convert
   * @returns The key path for the location
   */
  private locationToKeyPath(location: string): string {
    const parts = location.split("/").filter((part) => part && part !== ".");

    // Apply transformation rules
    let filteredParts = parts.filter((part) => !SKIP_FOLDERS.includes(part));

    // Transform special folders
    const transformedParts = filteredParts.map((part) => {
      // Apply folder transformations from constants
      if (part in FOLDER_TRANSFORMATIONS) {
        return FOLDER_TRANSFORMATIONS[part as keyof typeof FOLDER_TRANSFORMATIONS];
      }
      // "(site) → preserved as (site)"
      // Keep parentheses and other special characters as-is
      return part;
    });

    // Remove duplicate "app" entries (keep only the first one)
    const appIndices = transformedParts
      .map((part, index) => (part === "app" ? index : -1))
      .filter((i) => i !== -1);
    if (appIndices.length > 1) {
      // Remove all but the first "app"
      const firstAppIndex = appIndices[0];
      transformedParts.splice(
        1,
        transformedParts.length - 1,
        ...transformedParts
          .slice(1)
          .filter((part, index) => part !== "app" || index + 1 === firstAppIndex),
      );
    }

    return transformedParts.join(".");
  }

  /**
   * Find the common ancestor directory for multiple file paths
   * Multi-location handling: Move to common ancestor
   * @param filePaths - Array of file paths to find common ancestor for
   * @returns The common ancestor directory path
   */
  findCommonAncestorDirectory(filePaths: string[]): string {
    if (filePaths.length === 0) {
      // Default to a reasonable common location
      return path.resolve(process.cwd(), UNUSED_KEYS_LOCATION);
    }

    if (filePaths.length === 1) {
      return path.dirname(filePaths[0]);
    }

    // Convert all paths to absolute paths for consistent comparison
    const absolutePaths = filePaths.map((p) => path.resolve(p));

    // Split all paths into segments
    const pathSegments = absolutePaths.map((p) => p.split(path.sep));

    // Find the shortest path to avoid index out of bounds
    const minLength = Math.min(...pathSegments.map((p) => p.length));

    // Find common prefix
    const commonSegments: string[] = [];
    for (let i = 0; i < minLength; i++) {
      const segment = pathSegments[0][i];
      const allMatch = pathSegments.every((p) => p[i] === segment);

      if (allMatch) {
        commonSegments.push(segment);
      } else {
        break;
      }
    }

    // Ensure we have a meaningful common ancestor
    const commonPath = commonSegments.join(path.sep);

    // If the common ancestor is too high up (like just /home/user),
    // fall back to a sensible default based on the file types
    if (this.isCommonAncestorTooGeneric(commonPath, filePaths)) {
      return this.determineDefaultLocationForMultipleFiles(filePaths);
    }

    return commonPath;
  }

  /**
   * Check if the common ancestor is too generic to be useful
   * @param commonPath - The common ancestor path to check
   * @param filePaths - Array of file paths being analyzed
   * @returns True if the common ancestor is too generic
   */
  private isCommonAncestorTooGeneric(commonPath: string, filePaths: string[]): boolean {
    // If common path doesn't include 'src', it's too generic
    if (!commonPath.includes("src")) {
      return true;
    }

    // If all files are in completely different domains (api vs app),
    // the common ancestor might be too high
    const hasApiFiles = filePaths.some((p) => p.includes("/api/"));
    const hasAppFiles = filePaths.some((p) => p.includes("/app/") && !p.includes("/api/"));

    return hasApiFiles && hasAppFiles && !commonPath.includes("/app/");
  }

  /**
   * Determine default location when files are in multiple different domains
   * @param filePaths - Array of file paths to analyze
   * @returns The default location path for multiple files
   */
  private determineDefaultLocationForMultipleFiles(filePaths: string[]): string {
    // Prefer API location if most files are API files
    const apiFiles = filePaths.filter((p) => p.includes("/api/[locale]/"));
    const appFiles = filePaths.filter((p) => p.includes("/app/[locale]/") && !p.includes("/api/"));

    if (apiFiles.length >= appFiles.length) {
      // Most files are API files, use API common location
      return this.findCommonApiLocation(apiFiles);
    }
    // Most files are app files, use app common location
    return this.findCommonAppLocation(appFiles);
  }

  /**
   * Generate new key structure based on target location
   * Keys should match folder structure with proper special folder handling
   * @param originalKeyPath - The original translation key path
   * @param targetLocation - The target location for the key
   * @param logger - Logger instance for debugging
   * @returns The new key structure for the target location
   */
  generateNewKeyStructure(
    originalKeyPath: string,
    targetLocation: string,
    logger: EndpointLogger,
  ): string {
    // Use the same transformation logic as locationToKeyPath for consistency
    const locationKey = this.locationToKeyPath(targetLocation);

    // Extract the field name from the original key (last part)
    const originalParts = originalKeyPath.split(".");
    const fieldName = originalParts[originalParts.length - 1];

    // Create the new key path that matches the folder structure
    // folder structure with proper transformations applied
    const newKeyPath = locationKey ? `${locationKey}.${fieldName}` : fieldName;

    logger.debug(
      `Generated key path: ${originalKeyPath} -> ${newKeyPath} (location: ${targetLocation})`,
    );

    return newKeyPath;
  }

  /**
   * Analyze key usage frequency across all translation keys
   * @param translations - The translation object to analyze
   * @returns Map of key paths to their usage frequency
   */
  analyzeKeyUsageFrequency(translations: TranslationObject): Map<string, number> {
    const frequency = new Map<string, number>();

    this.countKeyUsage(translations, "", frequency);

    return frequency;
  }

  /**
   * Recursively count usage of each key path
   * @param obj - The translation object to count usage for
   * @param currentPath - The current key path being processed
   * @param frequency - Map to store frequency counts
   */
  private countKeyUsage(
    obj: TranslationObject,
    currentPath: string,
    frequency: Map<string, number>,
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;

      // Increment count for this path
      frequency.set(fullPath, (frequency.get(fullPath) || 0) + 1);

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // Recursively count nested objects
        this.countKeyUsage(value, fullPath, frequency);
      }
    }
  }

  /**
   * Find common location for API files by analyzing their paths
   * @param apiFiles - Array of API file paths
   * @returns Common location path for API files
   */
  private findCommonApiLocation(apiFiles: string[]): string {
    if (apiFiles.length === 0) {
      return path.resolve(process.cwd(), "src/app/api/[locale]/v1/common");
    }

    // Find the common API path by analyzing the actual file paths
    const commonPath = this.findCommonAncestorDirectory(apiFiles);

    // If the common path is too generic, use a sensible API default
    if (!commonPath.includes("/api/")) {
      return path.resolve(process.cwd(), "src/app/api/[locale]/v1/common");
    }

    return commonPath;
  }

  /**
   * Find common location for app files by analyzing their paths
   * @param appFiles - Array of app file paths
   * @returns Common location path for app files
   */
  private findCommonAppLocation(appFiles: string[]): string {
    if (appFiles.length === 0) {
      return path.resolve(process.cwd(), "src/app/[locale]/common");
    }

    // Find the common app path by analyzing the actual file paths
    const commonPath = this.findCommonAncestorDirectory(appFiles);

    // If the common path is too generic, use a sensible app default
    if (!commonPath.includes("/app/") || commonPath.includes("/api/")) {
      return path.resolve(process.cwd(), "src/app/[locale]/common");
    }

    return commonPath;
  }
}
