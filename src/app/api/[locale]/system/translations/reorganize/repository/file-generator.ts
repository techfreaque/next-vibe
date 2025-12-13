import fs from "node:fs";
import * as path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { I18N_PATH, INDEX_FILE } from "../constants";
import type { TranslationObject } from "./key-usage-analyzer";

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
        this.allLocations.add(location);
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
      const srcDir = path.resolve(process.cwd(), "src");
      this.removeOldI18nFiles(srcDir, language, logger);
    } catch (error) {
      logger.error(`Failed to cleanup old generated files for ${language}`, {
        error: parseError(error).message,
      });
    }
  }

  /**
   * Recursively remove old i18n files for a specific language
   * Removes all generated i18n directories except the root src/i18n
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

    const rootSrcI18nDir = path.resolve(process.cwd(), "src", I18N_PATH);

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === I18N_PATH) {
          // Found an i18n directory
          const absoluteI18nPath = path.resolve(fullPath);

          // Only remove if this is NOT the root src/i18n directory
          if (absoluteI18nPath !== rootSrcI18nDir) {
            const languageDir = path.join(fullPath, language);
            if (fs.existsSync(languageDir)) {
              fs.rmSync(languageDir, { recursive: true, force: true });
            }

            // If the i18n directory is now empty, remove it entirely
            const remainingEntries = fs.readdirSync(fullPath);
            if (remainingEntries.length === 0) {
              fs.rmSync(fullPath, { recursive: true, force: true });
            }
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
      } else {
        const escapedValue =
          typeof value === "string"
            ? // eslint-disable-next-line i18next/no-literal-string
              JSON.stringify(value.replaceAll(/\n/g, "\\n"))
            : JSON.stringify(value);
        return `${nextIndentStr}${keyStr}: ${escapedValue}`;
      }
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
      const filePath = path.join(
        process.cwd(),
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
    const translationsObject = this.objectToString(nestedTranslations, 0);
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
    key = key.replace(/\/\[locale\]/g, "");

    // Convert kebab-case folder names to camelCase
    // e.g., unified-interface -> unifiedInterface, react-native -> reactNative
    key = key.replace(/\/([a-z0-9-]+)/g, (fullMatch: string, segment: string) => {
      // Convert kebab-case to camelCase (use fullMatch to verify it starts with /)
      const camelCased = segment.replace(
        /-([a-z0-9])/g,
        (hyphenAndChar: string, letter: string) =>
          hyphenAndChar.length > 1 ? letter.toUpperCase() : hyphenAndChar,
      );
      return fullMatch.startsWith("/") ? `/${camelCased}` : camelCased;
    });

    // Convert to dot notation
    key = key.replaceAll(/\//g, ".");

    return key;
  }

  /**
   * Public wrapper for locationToFlatKey
   */
  locationToFlatKeyPublic(location: string): string {
    return this.locationToFlatKey(location);
  }

  /**
   * Convert folder name to valid JavaScript identifier in camelCase
   */
  private sanitizeIdentifier(name: string): string {
    // Remove parentheses: (site) -> site
    let sanitized = name.replace(/[()]/g, "");

    // Remove brackets and dots: [...notFound] -> notFound, [locale] -> locale
    sanitized = sanitized.replace(/[[\].]/g, "");

    // Remove leading underscore: _components -> components
    sanitized = sanitized.replace(/^_/, "");

    // Convert kebab-case to camelCase: unified-interface -> unifiedUi
    // oxlint-disable-next-line no-unused-vars
    sanitized = sanitized.replace(/-([a-z])/g, (_, letter: string) =>
      letter.toUpperCase(),
    );

    // Replace remaining invalid characters with empty string (remove them)
    sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, "");

    // Ensure it starts with a letter or underscore
    if (!/^[a-zA-Z_]/.test(sanitized)) {
      sanitized = `_${sanitized}`;
    }

    return sanitized;
  }

  /**
   * Clean up existing language directory except core utilities
   */
  private cleanupLanguageDirectory(language: string): void {
    const languageDir = path.join(process.cwd(), "src", I18N_PATH, language);

    if (!fs.existsSync(languageDir)) {
      return;
    }

    // Get all items in the language directory
    const items = fs.readdirSync(languageDir);

    for (const item of items) {
      const itemPath = path.join(languageDir, item);
      const stat = fs.statSync(itemPath);

      // Keep core directory and index.ts, remove everything else
      if (item !== "core" && item !== INDEX_FILE) {
        if (stat.isDirectory()) {
          fs.rmSync(itemPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(itemPath);
        }
      }
    }
  }

  /**
   * Generate hierarchical index files in source folders (next to the code)
   * Creates parent index files that import their direct children
   * Uses two-pass approach:
   * 1. First pass: Generate all leaf files and track which were created
   * 2. Second pass: Generate parent aggregators that only import existing children
   */
  private generateSourceHierarchy(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Track which files were actually generated
    // Pre-populate with all leaf locations (these were generated by generateLeafTranslationFile)
    const generatedFiles = new Set<string>(groups.keys());

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
    const indexPath = path.join(
      process.cwd(),
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

    // Import from direct children - but only if they have generated files
    for (const child of directChildren) {
      const childLocation = `${sourcePath}/${child}`;

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

      // Only spread [locale] folders, use keyed exports for everything else
      if (child === "[locale]") {
        exports.push(`  ...${importName}`);
      } else {
        // Quote keys that contain special characters
        const exportKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child)
          ? child
          : // eslint-disable-next-line i18next/no-literal-string
            `"${child}"`;
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

        // Add own translations as spread entries in the exports
        // BUT exclude translations that belong to child directories
        for (const [key, value] of Object.entries(nestedTranslations)) {
          // Check if this key matches a child directory name
          if (directChildren.has(key)) {
            // This is a child directory import, skip it (will be imported separately)
            continue;
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
    const mainIndexPath = path.join(
      process.cwd(),
      "src",

      I18N_PATH,
      language,
      INDEX_FILE,
    );

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
      const sectionIndexPath = path.join(
        process.cwd(),
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
        .replaceAll(/\\/g, "/")
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
