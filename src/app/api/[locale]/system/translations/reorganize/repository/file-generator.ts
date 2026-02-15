import fs from "node:fs";
import * as path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { I18N_PATH, INDEX_FILE } from "../constants";
import type { TranslationObject } from "./key-usage-analyzer";

/**
 * Helper to build dynamic file paths at runtime.
 * This prevents Turbopack from statically analyzing the path patterns.
 * @param segments - Path segments to join
 * @returns The joined path
 */
function buildPath(...segments: string[]): string {
  // Using a variable for cwd prevents static path analysis
  const cwd = String(process.cwd());
  if (segments[0] === cwd || segments[0]?.startsWith(cwd)) {
    return path.join(...segments);
  }
  return path.join(cwd, ...segments);
}

export class FileGenerator {
  /**
   * Set of all locations across all languages
   * Used to ensure parent aggregators are generated even when a location has no translations in a specific language
   */
  private allLocations: Set<string> = new Set();

  /**
   * Register all locations from all languages before generating files
   * This ensures parent aggregators are created even when a location has no translations in a specific language
   */
  registerAllLocations(allGroups: Map<string, TranslationObject>[]): void {
    this.allLocations.clear();
    for (const groups of allGroups) {
      for (const location of groups.keys()) {
        // Skip scoped translation locations
        const i18nPath = buildPath("src", location, I18N_PATH);
        if (!this.hasScopedIndexFile(i18nPath)) {
          this.allLocations.add(location);
        }
      }
    }
  }

  /**
   * Generate translation files with proper location-based co-location
   * Creates files at target locations matching usage patterns
   * @param groups - Map of location paths to translation objects
   * @param language - The language code to generate files for
   * @param logger - Logger instance for debugging
   * @returns True if files were generated successfully
   */
  generateTranslationFiles(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): boolean {
    try {
      if (groups.size === 0) {
        return false;
      }

      // Clean up old generated files before creating new ones

      this.cleanupOldGeneratedFiles(language, logger);

      // Generate files directly at target locations (location-based co-location)
      this.generateLocationBasedFiles(groups, language, logger);
      return true;
    } catch (error) {
      logger.error(`Failed to generate translation files for ${language}`, {
        error: parseError(error).message,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return false;
    }
  }

  /**
   * Clean up old generated i18n files before creating new ones
   * @param language - The language code to clean up files for
   * @param logger - Logger instance for debugging
   */
  private cleanupOldGeneratedFiles(
    language: string,
    logger: EndpointLogger,
  ): void {
    try {
      const srcDir = buildPath("src");
      this.removeOldI18nFiles(srcDir, language, logger);
    } catch (error) {
      logger.error(`Failed to cleanup old generated files for ${language}`, {
        error: parseError(error).message,
      });
    }
  }

  /**
   * Check if an i18n directory has a scoped index file
   * Also checks parent directories to handle scoped modules with subdirectories
   */
  private hasScopedIndexFile(i18nDir: string): boolean {
    // First check the directory itself
    const indexPath = path.join(i18nDir, INDEX_FILE);
    if (fs.existsSync(indexPath)) {
      try {
        const content = fs.readFileSync(indexPath, "utf-8");
        if (content.includes("createScopedTranslation")) {
          return true;
        }
      } catch {
        // Continue to check parents
      }
    }

    // Check parent directories
    // Convert to relative path from cwd to extract location
    const relativePath = path.relative(process.cwd(), i18nDir);
    if (!relativePath.startsWith("src/")) {
      return false;
    }

    // Remove "src/" and "/i18n" to get the location path
    let locationPath = relativePath.slice(4); // Remove "src/"
    if (locationPath.endsWith("/i18n")) {
      locationPath = locationPath.slice(0, -5); // Remove "/i18n"
    }

    // Check each parent directory for scoped i18n
    const locationParts = locationPath.split("/");
    for (let i = locationParts.length - 1; i > 0; i--) {
      const parentLocation = locationParts.slice(0, i).join("/");
      const parentI18nPath = path.join(
        process.cwd(),
        "src",
        parentLocation,
        I18N_PATH,
        INDEX_FILE,
      );

      if (fs.existsSync(parentI18nPath)) {
        try {
          const content = fs.readFileSync(parentI18nPath, "utf-8");
          if (content.includes("createScopedTranslation")) {
            return true;
          }
        } catch {
          // Continue checking other parents
        }
      }
    }

    return false;
  }

  /**
   * Recursively remove old i18n files for a specific language
   * Removes all generated i18n directories except root src/i18n and scoped directories
   * @param dir - The directory to search for i18n files
   * @param language - The language code to remove files for
   * @param logger - Logger instance for debugging
   */
  private removeOldI18nFiles(
    dir: string,
    language: string,
    logger: EndpointLogger,
  ): void {
    if (!fs.existsSync(dir)) {
      return;
    }

    // Get the absolute path of the root src/i18n directory
    const rootSrcI18nDir = buildPath("src", I18N_PATH);

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === I18N_PATH) {
          // Found an i18n directory
          const absoluteI18nPath = path.resolve(fullPath);

          // Skip root src/i18n
          if (absoluteI18nPath === rootSrcI18nDir) {
            continue;
          }

          // Skip scoped translation directories
          if (this.hasScopedIndexFile(fullPath)) {
            logger.info(
              `Preserving scoped i18n directory: ${path.relative(process.cwd(), fullPath)}`,
            );
            continue;
          }

          // Remove language-specific files
          const languageDir = path.join(fullPath, language);
          if (fs.existsSync(languageDir)) {
            fs.rmSync(languageDir, { recursive: true, force: true });
          }

          // If the i18n directory is now empty, remove it entirely
          const remainingEntries = fs.readdirSync(fullPath);
          if (remainingEntries.length === 0) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          }
        } else {
          // Recursively search subdirectories
          this.removeOldI18nFiles(fullPath, language, logger);
        }
      }
    }
  }

  /**
   * Generate location-based files with proper hierarchical structure
   * Creates hundreds of location-specific files with parent-child imports
   * @param groups - Map of location paths to translation objects
   * @param language - The language code to generate files for
   * @param logger - Logger instance for debugging
   */
  private generateLocationBasedFiles(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Step 1: Generate leaf files (actual translation files)
    for (const [location, translations] of groups) {
      // Skip generating files for scoped translation directories
      const i18nPath = buildPath("src", location, I18N_PATH);
      if (this.hasScopedIndexFile(i18nPath)) {
        logger.info(
          `Skipping scoped translation location: ${path.relative(process.cwd(), i18nPath)}`,
        );
        continue;
      }

      this.generateLeafTranslationFile(
        location,
        translations,
        language,
        logger,
      );
    }

    // Step 2: Generate parent index files that import their children
    this.generateParentIndexFiles(groups, language, logger);
  }

  /**
   * Convert flat dot-notation keys back to nested object structure
   * @param translations - The translation object with flat keys
   * @returns The nested translation object
   */
  private unflattenTranslationObject(
    translations: TranslationObject,
  ): TranslationObject {
    const nested: TranslationObject = {};

    keyLoop: for (const [key, value] of Object.entries(translations)) {
      const parts = key.split(".");
      let current = nested;

      // Navigate/create the nested structure
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        // Check if the property exists and is not an object
        if (part in current) {
          const existing = current[part];
          // If it's a primitive value (string/number/boolean), we have a key conflict
          // Skip this entire key to avoid errors
          if (typeof existing !== "object" || existing === null) {
            // Key conflict detected - this is expected when a parent key exists as both
            // a primitive value and an object path (e.g., "health" string vs "health.get.title")
            // The child directory import will override the primitive value, so we skip it here
            // Only log at debug level to reduce noise
            // Skip this entire key
            continue keyLoop;
          }
        } else {
          current[part] = {};
        }

        current = current[part] as TranslationObject;
      }

      // Set the final value
      const lastPart = parts[parts.length - 1];

      // Check if we're trying to overwrite an object with a primitive
      if (lastPart in current && typeof current[lastPart] === "object") {
        // Key conflict detected - trying to set a primitive value where an object already exists
        // This is expected and handled correctly - skip this key
        continue;
      }

      current[lastPart] = value;
    }

    return nested;
  }

  /**
   * Flatten single-child objects to avoid redundant nesting
   * If an object has only one child and that child is also an object,
   * flatten them together. This prevents duplication like:
   * { components: { navigation: { ... } } } -> { navigation: { ... } }
   * @param obj - The nested object to flatten
   * @param preserveKeys - Keys that should never be flattened (e.g., "common" for shared translations)
   * @returns The flattened object with single-child paths collapsed
   */
  private flattenSingleChildObjects(
    obj: TranslationObject,
    preserveKeys: Set<string> = new Set(["common"]),
  ): TranslationObject {
    const result: TranslationObject = {};

    for (const [key, value] of Object.entries(obj)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Check if this object has only one child
        const childKeys = Object.keys(value);

        if (childKeys.length === 1) {
          const childKey = childKeys[0];
          const childValue = value[childKey];

          // Never flatten if this key should be preserved
          if (preserveKeys.has(key)) {
            // Keep this level and recursively flatten the child
            result[key] = this.flattenSingleChildObjects(
              value as TranslationObject,
              preserveKeys,
            );
          } else if (
            // If the single child is also an object, skip this level (flatten it out)
            // and continue processing from the child
            typeof childValue === "object" &&
            childValue !== null &&
            !Array.isArray(childValue)
          ) {
            // Skip the current key and process the child's content directly
            // Recursively flatten the child value
            result[childKey] = this.flattenSingleChildObjects(
              childValue as TranslationObject,
              preserveKeys,
            );
          } else {
            // Single child is a primitive value - keep the structure
            result[key] = value;
          }
        } else {
          // Multiple children - recursively flatten each child but keep this level
          const flattenedValue: TranslationObject = {};
          for (const [childKey, childValue] of Object.entries(value)) {
            if (
              typeof childValue === "object" &&
              childValue !== null &&
              !Array.isArray(childValue)
            ) {
              flattenedValue[childKey] = this.flattenSingleChildObjects(
                childValue as TranslationObject,
                preserveKeys,
              );
            } else {
              flattenedValue[childKey] = childValue;
            }
          }
          result[key] = flattenedValue;
        }
      } else {
        // Primitive value - keep as is
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Flatten a nested translation object into dot-notation keys
   * @param obj - The nested translation object to flatten
   * @param prefix - Optional prefix for the keys
   * @returns Flattened object with dot-notation keys
   */
  private flattenTranslationObject(
    obj: TranslationObject,
    prefix = "",
  ): Record<string, string | number | boolean> {
    const result: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(result, this.flattenTranslationObject(value, fullKey));
      } else {
        result[fullKey] = value;
      }
    }

    return result;
  }

  /**
   * Convert object to formatted string with proper indentation
   * @param obj - The object to convert to string
   * @param indent - Current indentation level
   * @returns The formatted object string
   */
  private objectToString(obj: TranslationObject, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const nextIndentStr = "  ".repeat(indent + 1);

    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
      return JSON.stringify(obj);
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) {
      // eslint-disable-next-line i18next/no-literal-string
      return "{}";
    }

    const lines = entries.map(([key, value]) => {
      // Use unquoted key if it's a valid JavaScript identifier
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : JSON.stringify(key);

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const valueStr = this.objectToString(value, indent + 1);
        return `${nextIndentStr}${keyStr}: ${valueStr}`;
      }
      const escapedValue =
        typeof value === "string"
          ? // eslint-disable-next-line i18next/no-literal-string
            JSON.stringify(value.replaceAll("\n", "\\n"))
          : JSON.stringify(value);
      return `${nextIndentStr}${keyStr}: ${escapedValue}`;
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `{\n${lines.join(",\n")},\n${indentStr}}`;
  }

  /**
   * Generate a leaf translation file for a specific location
   * Co-locates translations with the code (e.g., src/app/[locale]/admin/i18n/en/index.ts)
   */
  private generateLeafTranslationFile(
    location: string,
    translations: TranslationObject,
    language: string,
    logger: EndpointLogger,
  ): void {
    try {
      // Generate co-located file path (next to the code, not in src/i18n)
      // Location is relative to src/, so prepend "src"
      const filePath = buildPath(
        "src",
        location,
        I18N_PATH,
        language,
        INDEX_FILE,
      );

      // Create directory
      const dir = filePath.slice(0, filePath.lastIndexOf("/"));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Generate content with nested objects (not flat keys)
      const content = this.generateLeafFileContent(
        translations,
        language,
        location,
      );

      // Write file
      fs.writeFileSync(filePath, content, "utf8");
    } catch (error) {
      const errorDetails = parseError(error);
      logger.error(`Failed to generate leaf translation file for ${location}`, {
        error: errorDetails.message,
        location,
        language,
      });
      logger.error("File generation failed", errorDetails);
      return;
    }
  }

  /**
   * Generate proper hierarchical structure with co-located files
   * Creates hierarchical index files in source folders + clean main index
   */
  private generateParentIndexFiles(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Clean up existing language directory first
    this.cleanupLanguageDirectory(language);

    // Generate hierarchical index files in source folders
    this.generateSourceHierarchy(groups, language, logger);

    // Generate clean main index that imports only top-level sections
    this.generateCleanMainIndex(groups, language);
  }

  /**
   * Generate content for leaf translation file
   */
  private generateLeafFileContent(
    translations: TranslationObject,
    language: string,
    location: string,
  ): string {
    const isMainLanguage = language === "en";
    let imports = "";

    // Add type import for non-English languages
    if (!isMainLanguage) {
      // eslint-disable-next-line i18next/no-literal-string
      imports = `import type { translations as enTranslations } from "../en/index";\n\n`;
    }

    // Strip the location prefix from keys for the leaf file
    // E.g., location="app/[locale]/admin", key="app.admin.nav.dashboard" -> "nav.dashboard"
    const locationPrefix = this.locationToFlatKey(location);
    const strippedTranslations: TranslationObject = {};

    for (const [key, value] of Object.entries(translations)) {
      // Remove location prefix from key
      let strippedKey = key;
      if (locationPrefix && key.startsWith(`${locationPrefix}.`)) {
        strippedKey = key.slice(locationPrefix.length + 1);
      }
      strippedTranslations[strippedKey] = value;
    }

    // Convert to nested structure
    const nestedTranslations =
      this.unflattenTranslationObject(strippedTranslations);

    // Flatten single-child objects to avoid redundant nesting
    const flattenedTranslations =
      this.flattenSingleChildObjects(nestedTranslations);

    const translationsObject = this.objectToString(flattenedTranslations, 0);
    // eslint-disable-next-line i18next/no-literal-string
    const typeAnnotation = isMainLanguage ? "" : ": typeof enTranslations";

    // eslint-disable-next-line i18next/no-literal-string
    return `${imports}export const translations${typeAnnotation} = ${translationsObject};\n`;
  }

  /**
   * Convert location path to flat key for main index
   * src/app/[locale]/admin/cron -> app.admin.cron
   * src/app/api/[locale]/contact/_components -> app.api.contact._components
   * Note: _components is kept in the key path as per i18n spec
   */
  private locationToFlatKey(location: string): string {
    // Normalize to relative path from project root
    const projectRoot = process.cwd();
    let normalizedLocation = location;

    // If it's an absolute path, make it relative to project root
    if (location.startsWith(projectRoot)) {
      normalizedLocation = location.slice(projectRoot.length + 1); // +1 for the slash
    }

    // Remove src/ prefix or src itself
    let key = normalizedLocation.replace(/^src(\/|$)/, "");

    // Remove [locale] segments
    key = key.replaceAll("/[locale]", "");

    // Convert kebab-case folder names to camelCase
    // e.g., unified-interface -> unifiedInterface, react-native -> reactNative
    key = key.replaceAll(
      /\/([a-z0-9-]+)/g,
      (fullMatch: string, segment: string) => {
        // Convert kebab-case to camelCase (use fullMatch to verify it starts with /)
        const camelCased = segment.replaceAll(
          /-([a-z0-9])/g,
          (hyphenAndChar: string, letter: string) =>
            hyphenAndChar.length > 1 ? letter.toUpperCase() : hyphenAndChar,
        );
        return fullMatch.startsWith("/") ? `/${camelCased}` : camelCased;
      },
    );

    // Replace / with . to create dot notation
    key = key.replaceAll("/", ".");

    // Special handling: app-native stays as app-native (not appNative)
    // because it's a top-level folder that might be needed for routing purposes
    return key;
  }

  /**
   * Public version of locationToFlatKey for external use
   */
  public locationToFlatKeyPublic(location: string): string {
    return this.locationToFlatKey(location);
  }

  /**
   * Simulate what a key will look like after location prefix stripping and flattening
   * This helps the reorganizer predict the final key structure
   * @param fullKey - The full key path
   * @param locationPrefix - The location prefix to strip
   * @returns The key after stripping and flattening
   */
  public simulateFlattenedKey(fullKey: string, locationPrefix: string): string {
    // Strip location prefix
    let strippedKey = fullKey;
    if (locationPrefix && fullKey.startsWith(`${locationPrefix}.`)) {
      strippedKey = fullKey.slice(locationPrefix.length + 1);
    }

    // Simulate unflatten + flatten by building temp object
    const tempObj: TranslationObject = {};
    const parts = strippedKey.split(".");
    let current = tempObj;
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = {};
      current = current[parts[i]] as TranslationObject;
    }
    current[parts[parts.length - 1]] = "value";

    // Flatten single-child objects
    const flattened = this.flattenSingleChildObjects(tempObj);

    // Convert back to dot notation to get the final key
    const flattenedKeys = Object.keys(this.flattenTranslationObject(flattened));
    return flattenedKeys[0] || strippedKey;
  }

  /**
   * Sanitize identifier to be valid JavaScript identifier
   * Replaces non-alphanumeric characters with underscores and ensures it doesn't start with a number
   * @param name - The identifier to sanitize
   * @returns A valid JavaScript identifier
   */
  private sanitizeIdentifier(name: string): string {
    // Replace non-alphanumeric characters with nothing (remove them)
    let sanitized = name.replaceAll(/[^a-zA-Z0-9]/g, "");

    // If starts with number, prepend underscore
    if (/^[0-9]/.test(sanitized)) {
      sanitized = `_${sanitized}`;
    }

    // If empty after sanitization, return a default
    if (sanitized === "") {
      // eslint-disable-next-line i18next/no-literal-string
      sanitized = "default";
    }

    return sanitized;
  }

  /**
   * Clean up existing language directory in src/i18n
   * @param language - The language code to clean up
   */
  private cleanupLanguageDirectory(language: string): void {
    const langDir = buildPath("src", I18N_PATH, language);
    if (fs.existsSync(langDir)) {
      fs.rmSync(langDir, { recursive: true, force: true });
    }
  }

  /**
   * Generate hierarchical index files in source folders
   * Creates parent aggregators that import their children
   */
  private generateSourceHierarchy(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Track which files were actually generated
    // Pre-populate with all leaf locations (these were generated by generateLeafTranslationFile)
    // Exclude scoped translation locations
    const generatedFiles = new Set<string>();
    for (const location of groups.keys()) {
      const i18nPath = buildPath("src", location, I18N_PATH);
      if (!this.hasScopedIndexFile(i18nPath)) {
        generatedFiles.add(location);
      }
    }

    // Build hierarchy of all source paths
    // Use allLocations (from all languages) instead of just current language's groups
    // This ensures parent aggregators are created even when a location has no translations in this language
    const sourcePaths = new Set<string>();

    // Use allLocations if available, otherwise fall back to current groups
    const locationsToProcess =
      this.allLocations.size > 0 ? this.allLocations : new Set(groups.keys());

    for (const location of locationsToProcess) {
      // Add the location itself (leaf node)
      sourcePaths.add(location);

      // Get all parent paths for this location
      const parts = location.split("/").filter((p) => p.length > 0);

      for (let i = 1; i < parts.length; i++) {
        const parentPath = parts.slice(0, i).join("/");
        sourcePaths.add(parentPath);
      }
    }

    // PASS 2: Generate index files for parent paths, bottom-up (deepest first)
    // Sort by depth (deepest first) so children are generated before parents
    const sortedPaths = [...sourcePaths].toSorted((a, b) => {
      const depthA = a.split("/").length;
      const depthB = b.split("/").length;
      return depthB - depthA; // Descending order (deepest first)
    });

    // Pass generatedFiles so we only import from children that exist
    for (const sourcePath of sortedPaths) {
      this.generateSourceIndexFile(
        sourcePath,
        groups,
        language,
        logger,
        generatedFiles,
      );
    }
  }

  /**
   * Generate index file for a source path that imports its direct children
   */
  private generateSourceIndexFile(
    sourcePath: string,
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
    generatedFiles: Set<string>,
  ): void {
    // Skip generating index files for scoped translation directories
    const i18nPath = buildPath("src", sourcePath, I18N_PATH);
    if (this.hasScopedIndexFile(i18nPath)) {
      logger.info(
        `Skipping scoped translation import: ${path.relative(process.cwd(), i18nPath)}`,
      );
      return;
    }

    const indexPath = buildPath(
      "src",
      sourcePath,
      I18N_PATH,
      language,
      INDEX_FILE,
    );

    // Find ALL direct children (both with translations and intermediate directories)
    // Use allLocations (from all languages) to ensure we find children even if current language has no translations
    const directChildren = new Set<string>();

    // Use allLocations if available, otherwise fall back to current groups
    const locationsToCheck =
      this.allLocations.size > 0 ? this.allLocations : new Set(groups.keys());

    for (const location of locationsToCheck) {
      if (location.startsWith(`${sourcePath}/`)) {
        const relativePath = location.slice(sourcePath.length + 1);

        if (relativePath.includes("/")) {
          // Has nested path - add first segment as direct child
          const firstSegment = relativePath.split("/")[0];
          directChildren.add(firstSegment);
        } else {
          // This is a direct child (leaf location) - we should create an index file
          // even if there are no subdirectories, because this directory has translations
          directChildren.add(relativePath);
        }
      }
    }

    // Generate imports and exports with correct logic
    const imports: string[] = [];
    const exports: string[] = [];
    const usedImportNames = new Set<string>();
    const hasSpreadChild = directChildren.has("[locale]");

    // Import from direct children - but only if they have generated files
    for (const child of directChildren) {
      const childLocation = `${sourcePath}/${child}`;

      // Skip scoped translation directories - they should not be imported into global schema
      const childI18nPath = buildPath("src", childLocation, I18N_PATH);
      if (this.hasScopedIndexFile(childI18nPath)) {
        logger.info(
          `Skipping scoped translation import: ${path.relative(process.cwd(), childI18nPath)}`,
        );
        continue;
      }

      // Check if this child has a generated file OR will generate one (has children with files)
      const hasGeneratedFile = generatedFiles.has(childLocation);
      const hasChildrenWithFiles = [...generatedFiles].some((loc) =>
        loc.startsWith(`${childLocation}/`),
      );

      if (!hasGeneratedFile && !hasChildrenWithFiles) {
        continue;
      }

      const sanitizedName = this.sanitizeIdentifier(child);
      // eslint-disable-next-line i18next/no-literal-string
      let importName = `${sanitizedName}Translations`;

      // Ensure unique import name
      let counter = 1;
      while (usedImportNames.has(importName)) {
        // eslint-disable-next-line i18next/no-literal-string
        importName = `${sanitizedName}${counter}Translations`;
        counter++;
      }
      usedImportNames.add(importName);

      const importPath = `../../${child}/i18n/${language}/index`;
      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${importPath}";`,
      );

      // Track which children are spread vs keyed
      const isSpread = child === "[locale]";

      // Only spread [locale] folders, use keyed exports for everything else
      if (isSpread) {
        exports.push(`  ...${importName}`);
      } else {
        // Convert kebab-case folder names to camelCase for export keys
        // e.g., speech-to-text -> speechToText
        let exportKey = child;

        // Convert kebab-case to camelCase
        exportKey = exportKey.replaceAll(
          /-([a-z0-9])/g,
          (hyphenAndChar: string, letter: string) =>
            hyphenAndChar.length > 1 ? letter.toUpperCase() : hyphenAndChar,
        );

        // Quote keys that still contain special characters after camelCase conversion
        // (e.g., keys with other special chars besides hyphens)
        if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(exportKey)) {
          // eslint-disable-next-line i18next/no-literal-string
          exportKey = `"${exportKey}"`;
        }

        exports.push(`  ${exportKey}: ${importName}`);
      }
    }

    // Check if this location has its own translations
    const ownTranslations = groups.get(sourcePath);

    if (ownTranslations && Object.keys(ownTranslations).length > 0) {
      // This location has its own translations - include them
      // Strip the location prefix from keys first
      const locationPrefix = this.locationToFlatKey(sourcePath);
      const strippedTranslations: TranslationObject = {};

      for (const [key, value] of Object.entries(ownTranslations)) {
        let strippedKey = key;
        if (locationPrefix && key.startsWith(`${locationPrefix}.`)) {
          strippedKey = key.slice(locationPrefix.length + 1);
        }
        strippedTranslations[strippedKey] = value;
      }

      try {
        const nestedTranslations =
          this.unflattenTranslationObject(strippedTranslations);

        // Flatten single-child objects to avoid redundant nesting
        const flattenedTranslations =
          this.flattenSingleChildObjects(nestedTranslations);

        // Add own translations as spread entries in the exports
        // BUT exclude translations that belong to child directories
        // Strategy: Flatten both parent and child translations to check for overlaps
        const locationPrefix = this.locationToFlatKey(sourcePath);

        for (const [key, value] of Object.entries(flattenedTranslations)) {
          // ONLY skip this key if it matches a child directory AND all translations
          // under this key belong to that child's location
          // Don't skip if this is just a shared prefix with different structure
          const kebabKey = key.replaceAll(
            /[A-Z]/g,
            (letter: string) => `-${letter.toLowerCase()}`,
          );

          const matchingChild = directChildren.has(key)
            ? key
            : directChildren.has(kebabKey)
              ? kebabKey
              : null;

          if (matchingChild) {
            const childLocation = `${sourcePath}/${matchingChild}`;
            const hasGeneratedFile = generatedFiles.has(childLocation);
            const hasChildrenWithFiles = [...generatedFiles].some((loc) =>
              loc.startsWith(`${childLocation}/`),
            );

            if (hasGeneratedFile || hasChildrenWithFiles) {
              // Child exists with files - check if ALL keys under this top-level key
              // actually belong to the child's location prefix
              const childLocationPrefix = this.locationToFlatKey(childLocation);

              // Flatten this key's value to check all nested keys
              const flattenedValue =
                typeof value === "object" && value !== null
                  ? this.flattenTranslationObject(
                      value as TranslationObject,
                      key,
                    )
                  : { [key]: value };

              // Check if ALL keys belong to child's location prefix
              const allKeysMatchChild = Object.keys(flattenedValue).every(
                (fullKey) => {
                  const reconstitutedKey = locationPrefix
                    ? `${locationPrefix}.${fullKey}`
                    : fullKey;
                  return (
                    childLocationPrefix &&
                    reconstitutedKey.startsWith(`${childLocationPrefix}.`)
                  );
                },
              );

              if (allKeysMatchChild) {
                // All keys belong to child - skip to avoid duplicate
                continue;
              }

              // Some keys don't belong to child - include them inline
            }
          }

          // CRITICAL: If we're spreading [locale], only allow specific inline keys
          // - 'api': explicitly imported child
          // - 'common': shared translations at common ancestor
          // Everything else would overwrite what's in the [locale] spread
          if (hasSpreadChild && directChildren.has("[locale]")) {
            if (key !== "api" && key !== "common") {
              // Skip - would conflict with spread from [locale]
              continue;
            }
          }

          const valueStr =
            typeof value === "string"
              ? JSON.stringify(value)
              : this.objectToString(value as TranslationObject, 1);
          const exportKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
            ? key
            : `"${key}"`;
          exports.push(`  ${exportKey}: ${valueStr}`);
        }
      } catch (error) {
        logger.error(
          `Failed to unflatten translations for ${sourcePath} (${language})`,
          {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            keys: Object.keys(strippedTranslations).slice(0, 10).join(", "),
          },
        );
        // Continue without own translations - at least generate the imports
      }
    }

    // Skip generating file if there are no exports AND no imports
    // (Parent aggregators with only imports are still needed to re-export children)
    if (exports.length === 0 && imports.length === 0) {
      return;
    }

    try {
      // eslint-disable-next-line i18next/no-literal-string
      const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")},\n};\n`;

      // Create directory
      const dir = path.dirname(indexPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(indexPath, content, "utf8");

      // Mark this file as generated
      generatedFiles.add(sourcePath);
    } catch (error) {
      logger.error(
        `Failed to generate source hierarchy index for ${sourcePath} (${language})`,
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      );
    }
  }

  /**
   * Generate clean main index that imports only top-level sections
   */
  private generateCleanMainIndex(
    groups: Map<string, TranslationObject>,
    language: string,
  ): void {
    const mainIndexPath = buildPath("src", I18N_PATH, language, INDEX_FILE);

    // Find top-level sections (app, packages, app-native, etc.)
    // Locations are now relative to src/ (e.g., "app/[locale]/admin", "packages/...")
    const topLevelSections = new Set<string>();

    for (const [location] of groups) {
      if (!location) {
        continue;
      } // Skip empty location (root level)
      const parts = location.split("/").filter((p) => p.length > 0);
      if (parts.length > 0) {
        topLevelSections.add(parts[0]); // app, packages, app-native, etc.
      }
    }

    // Skip if no top-level sections found
    if (topLevelSections.size === 0) {
      return;
    }

    // Generate imports and exports for top-level sections only
    const imports: string[] = [];
    const exports: string[] = [];

    for (const section of topLevelSections) {
      const sanitizedName = this.sanitizeIdentifier(section);
      // eslint-disable-next-line i18next/no-literal-string
      const importName = `${sanitizedName}Translations`;

      // Import from source hierarchy - use relative path from main index to section
      const sectionIndexPath = buildPath(
        "src",
        section,
        I18N_PATH,
        language,
        INDEX_FILE,
      );

      // Check if the section index file actually exists
      if (!fs.existsSync(sectionIndexPath)) {
        continue;
      }

      // Check if the section index file exists or will be created
      const relativePath = path
        .relative(path.dirname(mainIndexPath), sectionIndexPath)
        .replaceAll("\\", "/")
        .replace(/\.ts$/, "")
        .replace(/\/index$/, ""); // Remove /index from the end

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${relativePath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${section}": ${importName}`);
    }

    // Skip if no exports
    if (exports.length === 0) {
      return;
    }

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")},\n};\n\nexport default translations;\n`;

    // Create directory
    const dir = path.dirname(mainIndexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(mainIndexPath, content, "utf8");
  }
}
