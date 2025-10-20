import fs from "node:fs";
import * as path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { I18N_PATH, INDEX_FILE } from "../constants";
import type { TranslationObject } from "./key-usage-analyzer";

export class FileGenerator {
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
      logger.debug(
        `Generating translation files for language: ${language}, groups: ${groups.size}`,
      );

      if (groups.size === 0) {
        logger.debug(`No groups to process for language: ${language}`);
        return false;
      }

      // Clean up old generated files before creating new ones
      logger.debug(
        `Cleaning up old generated i18n files for language: ${language}`,
      );
      this.cleanupOldGeneratedFiles(language, logger);

      // Generate files directly at target locations (location-based co-location)
      logger.debug(`Starting location-based file generation`);
      this.generateLocationBasedFiles(groups, language, logger);

      logger.debug(`File generation completed for language: ${language}`);
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
              logger.debug("Removing old generated i18n directory", {
                path: languageDir,
              });
              fs.rmSync(languageDir, { recursive: true, force: true });
            }

            // If the i18n directory is now empty, remove it entirely
            const remainingEntries = fs.readdirSync(fullPath);
            if (remainingEntries.length === 0) {
              logger.debug("Removing empty i18n directory", { path: fullPath });
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
    logger.debug(
      `Generating ${groups.size} location-based files for ${language}`,
    );

    // Step 1: Generate leaf files (actual translation files)
    logger.debug(`Generating ${groups.size} leaf translation files`);
    for (const [location, translations] of groups) {
      logger.debug(`Generating leaf file for location: ${location}`);
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
   * Resolve target path from location string
   * Converts relative paths to absolute paths from project root
   * @param targetLocation - The target location string to resolve
   * @returns The absolute path for the target location
   */
  private resolveTargetPath(targetLocation: string): string {
    // If already absolute, use as-is
    if (path.isAbsolute(targetLocation)) {
      return targetLocation;
    }

    // Convert relative path to absolute from project root
    return path.resolve(process.cwd(), targetLocation);
  }

  /**
   * Generate file content for location-based files
   * Creates nested object structure (not flat keys)
   * @param translations - The translation object to generate content for
   * @param language - The language code for the file
   * @returns The generated file content as a string
   */
  private generateLocationBasedFileContent(
    translations: TranslationObject,
    language: string,
  ): string {
    const isMainLanguage = language === "en";
    let imports = "";
    let exports = "";

    // Add type import for non-English languages
    if (!isMainLanguage) {
      const englishImportPath = "../en/index";
      // eslint-disable-next-line i18next/no-literal-string
      imports = `import type { translations as enTranslations } from "${englishImportPath}";\n\n`;
    }

    // Generate nested translations object (not flat)
    const translationsObject =
      this.generateNestedTranslationsObject(translations);
    // eslint-disable-next-line i18next/no-literal-string
    const typeAnnotation = isMainLanguage ? "" : ": typeof enTranslations";

    // eslint-disable-next-line i18next/no-literal-string
    exports = `export const translations${typeAnnotation} = ${translationsObject} as const;\n\nexport default translations;\n`;

    return imports + exports;
  }

  /**
   * Generate nested translations object (not flat keys)
   * Creates proper nested object structure like the contact API example
   * @param translations - The translation object to process
   * @returns The nested translations object as a string
   */
  private generateNestedTranslationsObject(
    translations: TranslationObject,
  ): string {
    // Convert flat keys back to nested structure
    const nestedTranslations = this.unflattenTranslationObject(translations);
    return this.objectToString(nestedTranslations, 0);
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

    for (const [key, value] of Object.entries(translations)) {
      const parts = key.split(".");
      let current = nested;

      // Navigate/create the nested structure
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part] as TranslationObject;
      }

      // Set the final value
      const lastPart = parts[parts.length - 1];
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
              JSON.stringify(value.replace(/\n/g, "\\n"))
            : JSON.stringify(value);
        return `${nextIndentStr}${keyStr}: ${escapedValue}`;
      }
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `{\n${lines.join(",\n")},\n${indentStr}}`;
  }

  /**
   * Build hierarchical structure from flat location groups
   * Creates a tree structure where each node knows its children
   * Maps src/app/[locale]/... to app/... hierarchy
   */
  private buildHierarchicalStructure(
    groups: Map<string, TranslationObject>,
    logger: EndpointLogger,
  ): Map<string, { translations: TranslationObject; children: Set<string> }> {
    const hierarchy = new Map<
      string,
      { translations: TranslationObject; children: Set<string> }
    >();

    // Initialize all nodes
    for (const [location, translations] of groups) {
      // Convert location to hierarchy path
      const hierarchyPath = this.locationToHierarchyPath(location);
      const pathParts = hierarchyPath
        .split("/")
        .filter((part) => part.length > 0);

      // Create all parent paths
      for (let i = 0; i <= pathParts.length; i++) {
        const currentPath = pathParts.slice(0, i).join("/");
        if (!hierarchy.has(currentPath)) {
          hierarchy.set(currentPath, { translations: {}, children: new Set() });
        }
      }

      // Set translations for the leaf node
      const leafPath = pathParts.join("/");
      if (hierarchy.has(leafPath)) {
        hierarchy.get(leafPath)!.translations = translations;
      }
    }

    // Build parent-child relationships
    for (const [path] of hierarchy) {
      if (path === "") {
        continue;
      } // Skip root

      const pathParts = path.split("/");
      const parentPath = pathParts.slice(0, -1).join("/");

      if (hierarchy.has(parentPath)) {
        hierarchy.get(parentPath)!.children.add(path);
      }
    }

    logger.debug(`Built hierarchical structure with ${hierarchy.size} nodes`);
    return hierarchy;
  }

  /**
   * Generate files for hierarchical structure
   * Each level imports only its direct children
   */
  private generateHierarchicalFiles(
    hierarchy: Map<
      string,
      { translations: TranslationObject; children: Set<string> }
    >,
    language: string,
    logger: EndpointLogger,
  ): void {
    for (const [path, node] of hierarchy) {
      if (
        Object.keys(node.translations).length === 0 &&
        node.children.size === 0
      ) {
        continue; // Skip empty nodes
      }

      const filePath = this.getHierarchicalFilePath(path, language);
      const fileContent = this.generateHierarchicalFileContent(path, node);

      // Ensure directory exists
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(filePath, fileContent, "utf8");
      logger.debug(`Generated hierarchical file: ${filePath}`);
    }
  }

  /**
   * Get file path for hierarchical structure
   */
  private getHierarchicalFilePath(
    hierarchyPath: string,
    language: string,
  ): string {
    if (hierarchyPath === "") {
      // Root level - main index
      return path.join(process.cwd(), "src", I18N_PATH, language, INDEX_FILE);
    }

    // Child level - create index in the path
    return path.join(
      process.cwd(),
      "src",
      I18N_PATH,
      language,
      hierarchyPath,
      INDEX_FILE,
    );
  }

  /**
   * Generate content for hierarchical file
   */
  private generateHierarchicalFileContent(
    _currentPath: string,
    node: { translations: TranslationObject; children: Set<string> },
  ): string {
    const imports: string[] = [];
    const exports: string[] = [];

    // Import children
    for (const childPath of node.children) {
      const childName = childPath.split("/").pop() || "unknown";
      // eslint-disable-next-line i18next/no-literal-string
      const importName = `${childName}Translations`;
      const relativePath = `./${childName}`;

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${relativePath}";`,
      );
      exports.push(`  ${childName}: ${importName}`);
    }

    // Add own translations if any
    if (Object.keys(node.translations).length > 0) {
      const ownTranslations = this.objectToString(node.translations, 1);
      exports.push(`  ...${ownTranslations}`);
    }

    const importsSection =
      // eslint-disable-next-line i18next/no-literal-string
      imports.length > 0 ? `${imports.join("\n")}\n\n` : "";
    const exportsSection = exports.length > 0 ? exports.join(",\n") : "";

    // eslint-disable-next-line i18next/no-literal-string
    return `${importsSection}export const translations = {\n${exportsSection}\n} as const;\n\nexport default translations;\n`;
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
      const filePath = path.join(
        process.cwd(),
        location,
        I18N_PATH,
        language,
        INDEX_FILE,
      );

      // Create directory
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.debug(`Created directory: ${dir}`);
      }

      // Generate content with nested objects (not flat keys)
      const content = this.generateLeafFileContent(translations, language);

      // Write file
      fs.writeFileSync(filePath, content, "utf8");
      logger.debug(`Generated co-located file: ${filePath}`);
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
    this.cleanupLanguageDirectory(language, logger);

    // Generate hierarchical index files in source folders
    this.generateSourceHierarchy(groups, language, logger);

    // Generate clean main index that imports only top-level sections
    this.generateCleanMainIndex(groups, language, logger);
  }

  /**
   * Strip the path prefix from translation keys to get only the leaf keys
   * For example: "app.api.v1.core.system.check.typecheck.title" -> "title"
   */
  private stripPathPrefixFromKeys(
    translations: TranslationObject,
  ): TranslationObject {
    const stripped: TranslationObject = {};

    for (const [key, value] of Object.entries(translations)) {
      // Find the last meaningful part after the path
      const parts = key.split(".");

      // For keys like "app.api.v1.core.system.check.typecheck.title"
      // We want to keep everything after the location path
      // The location path typically ends with the directory name

      // Find where the actual translation keys start (after the path structure)
      let startIndex = 0;
      const COMMON_PATH_PARTS = [
        "api",
        "v1",
        "core",
        "system",
        "app",
        "locale",
      ] as const;
      for (let i = 0; i < parts.length; i++) {
        // Skip common path parts
        if (
          COMMON_PATH_PARTS.includes(
            parts[i] as (typeof COMMON_PATH_PARTS)[number],
          )
        ) {
          startIndex = i + 1;
        } else {
          // Once we hit a non-path part, we've found the start of actual keys
          break;
        }
      }

      // Take everything from the last path segment onwards
      const leafKey = parts.slice(startIndex).join(".");
      if (leafKey) {
        stripped[leafKey] = value;
      }
    }

    return stripped;
  }

  /**
   * Generate content for leaf translation file
   */
  private generateLeafFileContent(
    translations: TranslationObject,
    language: string,
  ): string {
    const isMainLanguage = language === "en";
    let imports = "";

    // Add type import for non-English languages
    if (!isMainLanguage) {
      // eslint-disable-next-line i18next/no-literal-string
      imports = `import type { translations as enTranslations } from "../en/index";\n\n`;
    }

    // For leaf files, strip the path prefix and only keep the leaf keys
    const leafTranslations = this.stripPathPrefixFromKeys(translations);
    const nestedTranslations =
      this.unflattenTranslationObject(leafTranslations);
    const translationsObject = this.objectToString(nestedTranslations, 0);
    // eslint-disable-next-line i18next/no-literal-string
    const typeAnnotation = isMainLanguage ? "" : ": typeof enTranslations";

    // eslint-disable-next-line i18next/no-literal-string
    return `${imports}export const translations${typeAnnotation} = ${translationsObject} as const;\n\nexport default translations;\n`;
  }

  /**
   * Generate main index file that imports from co-located translation files
   * Creates src/i18n/{language}/index.ts with imports from actual code locations
   */
  private generateMainIndexFile(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    const filePath = path.join(
      process.cwd(),
      "src",
      I18N_PATH,
      language,
      INDEX_FILE,
    );

    // Generate imports from co-located files
    const imports: string[] = [];
    const exports: string[] = [];
    let importIndex = 0;

    for (const [location] of groups) {
      // Create import from co-located file
      const relativePath = path
        .relative(
          path.dirname(filePath),
          path.join(process.cwd(), location, I18N_PATH, language, INDEX_FILE),
        )
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");

      const importName = `locationTranslations${importIndex}`;
      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${relativePath}";`,
      );

      // Create flat key from location path
      const flatKey = this.locationToFlatKey(location);
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${flatKey}": ${importName}`);

      importIndex++;
    }

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")}\n} as const;\n\nexport default translations;\n`;

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content, "utf8");
    logger.debug(`Generated main index file: ${filePath}`);
  }

  /**
   * Convert location path to flat key for main index
   * src/app/[locale]/admin/cron -> app.admin.cron
   * src/app/api/[locale]/v1/core/contact -> app.api.v1.core.contact
   */
  private locationToFlatKey(location: string): string {
    // Remove src/ prefix
    let key = location.replace(/^src\//, "");

    // Remove [locale] segments
    key = key.replace(/\/\[locale\]/g, "");

    // Remove _components suffix
    key = key.replace(/\/_components$/, "");

    // Convert to dot notation
    key = key.replace(/\//g, ".");

    return key;
  }

  /**
   * Build hierarchical structure from co-located file locations
   * Maps locations to their hierarchical paths for index generation
   */
  private buildHierarchyFromLocations(
    groups: Map<string, TranslationObject>,
    logger: EndpointLogger,
  ): Map<string, { children: Set<string>; locations: string[] }> {
    const hierarchy = new Map<
      string,
      { children: Set<string>; locations: string[] }
    >();

    // Process each location to build hierarchy
    for (const [location] of groups) {
      const hierarchyPath = this.locationToHierarchyPath(location);
      const parts = hierarchyPath.split("/").filter((p) => p.length > 0);

      // Create all parent paths
      for (let i = 0; i <= parts.length; i++) {
        const currentPath = parts.slice(0, i).join("/");
        if (!hierarchy.has(currentPath)) {
          hierarchy.set(currentPath, { children: new Set(), locations: [] });
        }

        // Add location to leaf node
        if (i === parts.length) {
          hierarchy.get(currentPath)!.locations.push(location);
        }
      }
    }

    // Build parent-child relationships
    for (const [path] of hierarchy) {
      if (path === "") {
        continue;
      } // Skip root

      const parts = path.split("/");
      const parentPath = parts.slice(0, -1).join("/");

      if (hierarchy.has(parentPath)) {
        hierarchy.get(parentPath)!.children.add(path);
      }
    }

    logger.debug(`Built hierarchy with ${hierarchy.size} nodes`);
    return hierarchy;
  }

  /**
   * Generate hierarchical index files for intermediate levels
   */
  private generateHierarchicalIndexFiles(
    hierarchy: Map<string, { children: Set<string>; locations: string[] }>,
    language: string,
    logger: EndpointLogger,
  ): void {
    for (const [hierarchyPath, node] of hierarchy) {
      if (hierarchyPath === "") {
        continue;
      } // Skip root - handled by main index
      if (node.children.size === 0) {
        continue;
      } // Skip leaf nodes - they're co-located files

      // Generate intermediate index file
      const filePath = path.join(
        process.cwd(),
        "src",
        I18N_PATH,
        language,
        hierarchyPath,
        INDEX_FILE,
      );
      const content = this.generateIntermediateIndexContent(
        hierarchyPath,
        node,
        language,
      );

      // Create directory
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, content, "utf8");
      logger.debug(`Generated intermediate index: ${filePath}`);
    }
  }

  /**
   * Generate main index file that imports only direct children
   */
  private generateMainIndexFromHierarchy(
    hierarchy: Map<string, { children: Set<string>; locations: string[] }>,
    language: string,
    logger: EndpointLogger,
  ): void {
    const rootNode = hierarchy.get("");
    if (!rootNode) {
      return;
    }

    const filePath = path.join(
      process.cwd(),
      "src",
      I18N_PATH,
      language,
      INDEX_FILE,
    );

    // Generate imports only for direct children
    const imports: string[] = [];
    const exports: string[] = [];

    for (const childPath of rootNode.children) {
      const childName = childPath.split("/").pop() || "unknown";
      const sanitizedName = this.sanitizeIdentifier(childName);

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${sanitizedName}Translations } from "./${childPath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${childName}": ${sanitizedName}Translations`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")}\n} as const;\n\nexport default translations;\n`;

    fs.writeFileSync(filePath, content, "utf8");
    logger.debug(
      `Generated main index with ${rootNode.children.size} direct children: ${filePath}`,
    );
  }

  /**
   * Generate content for intermediate index files
   */
  private generateIntermediateIndexContent(
    currentPath: string,
    node: { children: Set<string>; locations: string[] },
    language: string,
  ): string {
    const imports: string[] = [];
    const exports: string[] = [];

    // Import from children
    for (const childPath of node.children) {
      const childName = childPath.split("/").pop() || "unknown";
      const sanitizedName = this.sanitizeIdentifier(childName);
      const relativePath =
        path.relative(currentPath, childPath) || `./${childName}`;

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${sanitizedName}Translations } from "${relativePath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${childName}": ${sanitizedName}Translations`);
    }

    // Import from co-located files if any
    for (const location of node.locations) {
      const relativePath = path
        .relative(
          path.join("src", I18N_PATH, language, currentPath),
          path.join(location, I18N_PATH, language, INDEX_FILE),
        )
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");

      const locationKey = this.locationToFlatKey(location);
      const sanitizedName = `location${Math.random().toString(36).substr(2, 9)}`;

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${sanitizedName} } from "${relativePath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${locationKey}": ${sanitizedName}`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")}\n} as const;\n\nexport default translations;\n`;
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

    // Convert kebab-case to camelCase: unified-ui -> unifiedUi
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
   * Convert location path to hierarchy path for index structure
   */
  private locationToHierarchyPath(location: string): string {
    // Remove src/ prefix
    let path = location.replace(/^src\//, "");

    // Handle app routes: app/[locale]/... -> app/...
    path = path.replace(/^app\/\[locale\]\//, "app/");

    // Handle API routes: app/api/[locale]/... -> api/...
    path = path.replace(/^app\/api\/\[locale\]\//, "api/");

    // Remove _components suffix for cleaner hierarchy
    path = path.replace(/\/_components$/, "");

    return path;
  }

  /**
   * Clean up existing language directory except core utilities
   */
  private cleanupLanguageDirectory(
    language: string,
    logger: EndpointLogger,
  ): void {
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
          logger.debug(`Removed directory: ${itemPath}`);
        } else {
          fs.unlinkSync(itemPath);
          logger.debug(`Removed file: ${itemPath}`);
        }
      }
    }
  }

  /**
   * Build complete hierarchical structure from co-located files
   * Creates a tree where each node knows its children and co-located files
   */
  private buildCompleteHierarchy(
    groups: Map<string, TranslationObject>,
    logger: EndpointLogger,
  ): Map<string, { children: Set<string>; colocatedFiles: string[] }> {
    const hierarchy = new Map<
      string,
      { children: Set<string>; colocatedFiles: string[] }
    >();

    // Initialize root
    hierarchy.set("", { children: new Set(), colocatedFiles: [] });

    // Process each co-located file location
    for (const [location] of groups) {
      const hierarchyPath = this.locationToHierarchyPath(location);
      const parts = hierarchyPath.split("/").filter((p) => p.length > 0);

      // Create all parent paths in hierarchy
      for (let i = 0; i <= parts.length; i++) {
        const currentPath = parts.slice(0, i).join("/");

        if (!hierarchy.has(currentPath)) {
          hierarchy.set(currentPath, {
            children: new Set(),
            colocatedFiles: [],
          });
        }

        // Add co-located file to leaf node
        if (i === parts.length) {
          hierarchy.get(currentPath)!.colocatedFiles.push(location);
        }
      }
    }

    // Build parent-child relationships
    for (const [currentPath] of hierarchy) {
      if (currentPath === "") {
        continue;
      } // Skip root

      const parts = currentPath.split("/");
      const parentPath = parts.slice(0, -1).join("/");

      if (hierarchy.has(parentPath)) {
        hierarchy.get(parentPath)!.children.add(currentPath);
      }
    }

    logger.debug(`Built complete hierarchy with ${hierarchy.size} nodes`);
    return hierarchy;
  }

  /**
   * Generate complete hierarchical structure with proper parent-child imports
   */
  private generateHierarchicalStructure(
    hierarchy: Map<string, { children: Set<string>; colocatedFiles: string[] }>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Generate index file for each node in the hierarchy
    for (const [currentPath, node] of hierarchy) {
      // Skip nodes that have no children and no co-located files
      if (node.children.size === 0 && node.colocatedFiles.length === 0) {
        continue;
      }

      const filePath = this.getHierarchyFilePath(currentPath, language);
      const content = this.generateHierarchyIndexContent(
        currentPath,
        node,
        language,
      );

      // Create directory
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, content, "utf8");
      logger.debug(`Generated hierarchy index: ${filePath}`);
    }
  }

  /**
   * Get file path for hierarchy node
   */
  private getHierarchyFilePath(
    hierarchyPath: string,
    language: string,
  ): string {
    if (hierarchyPath === "") {
      // Root - main index
      return path.join(process.cwd(), "src", I18N_PATH, language, INDEX_FILE);
    }

    // Intermediate or leaf - create index in the hierarchy path
    return path.join(
      process.cwd(),
      "src",

      I18N_PATH,
      language,
      hierarchyPath,
      INDEX_FILE,
    );
  }

  /**
   * Generate content for hierarchy index file
   */
  private generateHierarchyIndexContent(
    currentPath: string,
    node: { children: Set<string>; colocatedFiles: string[] },
    language: string,
  ): string {
    const imports: string[] = [];
    const exports: string[] = [];

    // Import from direct children (other hierarchy nodes)
    for (const childPath of node.children) {
      const childName = childPath.split("/").pop() || "unknown";
      const sanitizedName = this.sanitizeIdentifier(childName);
      // eslint-disable-next-line i18next/no-literal-string
      const importName = `${sanitizedName}Translations`;

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "./${childName}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${childName}": ${importName}`);
    }

    // Import from co-located files
    for (const colocatedFile of node.colocatedFiles) {
      const relativePath = path
        .relative(
          path.join("src", I18N_PATH, language, currentPath),
          path.join(colocatedFile, I18N_PATH, language, INDEX_FILE),
        )
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");

      // Create a unique import name for co-located file
      const locationKey = this.locationToFlatKey(colocatedFile);
      const parts = locationKey.split(".");
      const lastPart = parts[parts.length - 1] || "translations";
      const sanitizedName = this.sanitizeIdentifier(lastPart);
      // eslint-disable-next-line i18next/no-literal-string
      const importName = `colocated${sanitizedName}Translations`;

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${relativePath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${locationKey}": ${importName}`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")}\n} as const;\n\nexport default translations;\n`;
    return content;
  }

  /**
   * Generate hierarchical index files in source folders (next to the code)
   * Creates parent index files that import their direct children
   */
  private generateSourceHierarchy(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    // Build hierarchy of all source paths
    const sourcePaths = new Set<string>();

    for (const [location] of groups) {
      // Get all parent paths for this location
      const parts = location.split("/").filter((p) => p.length > 0);

      for (let i = 1; i < parts.length; i++) {
        const parentPath = parts.slice(0, i).join("/");
        sourcePaths.add(parentPath);
      }
    }

    // Generate index file for each parent path
    for (const sourcePath of sourcePaths) {
      this.generateSourceIndexFile(sourcePath, groups, language, logger);
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
  ): void {
    const indexPath = path.join(
      process.cwd(),
      sourcePath,

      I18N_PATH,
      language,
      INDEX_FILE,
    );

    // Find ALL direct children (both with translations and intermediate directories)
    const directChildren = new Set<string>();

    for (const [location] of groups) {
      if (location.startsWith(`${sourcePath}/`)) {
        const relativePath = location.substring(sourcePath.length + 1);

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

    // Skip if no children
    if (directChildren.size === 0) {
      return;
    }

    // Generate imports and exports with correct logic
    const imports: string[] = [];
    const exports: string[] = [];
    const usedImportNames = new Set<string>();

    // Import from direct children
    for (const child of directChildren) {
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

      logger.debug(
        `Adding import for child: ${child} from ${importPath} in ${sourcePath}`,
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

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")},\n} as const;\n\nexport default translations;\n`;

    // Create directory
    const dir = path.dirname(indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(indexPath, content, "utf8");
    logger.debug(`Generated source hierarchy index: ${indexPath}`);
  }

  /**
   * Generate clean main index that imports only top-level sections
   */
  private generateCleanMainIndex(
    groups: Map<string, TranslationObject>,
    language: string,
    logger: EndpointLogger,
  ): void {
    const mainIndexPath = path.join(
      process.cwd(),
      "src",

      I18N_PATH,
      language,
      INDEX_FILE,
    );

    // Find top-level sections (src/app, src/api, src/packages)
    const topLevelSections = new Set<string>();

    for (const [location] of groups) {
      const parts = location.split("/").filter((p) => p.length > 0);
      if (parts.length > 1 && parts[0] === "src") {
        topLevelSections.add(parts[1]); // app, api, packages
      }
    }

    // Skip if no top-level sections found
    if (topLevelSections.size === 0) {
      logger.debug(
        "No top-level sections found, skipping main index generation",
      );
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

      // Check if the section index file exists or will be created
      const relativePath = path
        .relative(path.dirname(mainIndexPath), sectionIndexPath)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");

      imports.push(
        // eslint-disable-next-line i18next/no-literal-string
        `import { translations as ${importName} } from "${relativePath}";`,
      );
      // eslint-disable-next-line i18next/no-literal-string
      exports.push(`  "${section}": ${importName}`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${imports.join("\n")}\n\nexport const translations = {\n${exports.join(",\n")},\n} as const;\n\nexport default translations;\n`;

    // Create directory
    const dir = path.dirname(mainIndexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(mainIndexPath, content, "utf8");
    logger.debug(
      `Generated clean main index with ${topLevelSections.size} top-level sections: ${mainIndexPath}`,
    );
  }
}
