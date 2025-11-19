/**
 * TypeScript checker utilities for file discovery, caching, and path handling
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { extname, join, relative, resolve } from "node:path";

import { parseJsonWithComments } from "@/app/api/[locale]/v1/core/shared/utils/parse-json";

/**
 * TypeScript file extensions
 */
export const TS_EXTENSIONS = [".ts", ".tsx"] as const;

/**
 * Cache entry for file discovery
 */
export interface FileDiscoveryCache {
  files: string[];
  timestamp: number;
  hash: string;
}

/**
 * Path type for different TypeScript checking scenarios
 */
export enum PathType {
  NO_PATH = "no_path",
  SINGLE_FILE = "single_file",
  FOLDER = "folder",
}

/**
 * TypeScript checking configuration
 */
export interface TypecheckConfig {
  pathType: PathType;
  targetPath?: string;
  cacheKey: string;
  buildInfoFile: string;
  tempConfigFile?: string;
}

/**
 * Determine the path type for TypeScript checking
 */
export function determinePathType(path?: string): PathType {
  if (!path || path.trim() === "") {
    return PathType.NO_PATH;
  }

  const resolvedPath = resolve(path);

  if (!existsSync(resolvedPath)) {
    // If path doesn't exist, treat as folder for better error messages
    return PathType.FOLDER;
  }

  const stat = statSync(resolvedPath);

  if (stat.isFile()) {
    const ext = extname(resolvedPath);
    if ((TS_EXTENSIONS as readonly string[]).includes(ext)) {
      return PathType.SINGLE_FILE;
    }
    // Non-TS file, treat as folder
    return PathType.FOLDER;
  }

  return PathType.FOLDER;
}

/**
 * Read tsconfig exclude patterns
 */
function getTsConfigExcludePatterns(): string[] {
  try {
    const tsconfig = parseJsonWithComments(
      readFileSync("tsconfig.json", "utf8"),
    ) as {
      exclude?: string[];
    };
    return tsconfig.exclude ?? [];
  } catch {
    return [];
  }
}

/**
 * Check if a path matches any exclude pattern
 */
function isExcludedByTsConfig(
  filePath: string,
  excludePatterns: string[],
): boolean {
  const relativePath = relative(process.cwd(), filePath);

  for (const pattern of excludePatterns) {
    // Handle glob patterns - for now, simple string matching and prefix matching
    if (pattern.endsWith("/**/*")) {
      // Pattern like "to_migrate/**/*" - check if path starts with the prefix
      const prefix = pattern.slice(0, -6); // Remove "/**/*"
      if (relativePath.startsWith(`${prefix}/`) || relativePath === prefix) {
        return true;
      }
    } else if (pattern.endsWith("**/*.ts") || pattern.endsWith("**/*.tsx")) {
      // Pattern like "to_migrate/**/*.ts" - check if path starts with the prefix
      const prefix = pattern.slice(0, -8); // Remove "**/*.ts" or "**/*.tsx"
      if (relativePath.startsWith(prefix)) {
        return true;
      }
    } else {
      // Exact match or directory match
      if (relativePath === pattern || relativePath.startsWith(`${pattern}/`)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Find all TypeScript files in a directory recursively
 */
export function findTypeScriptFiles(
  directory: string,
  excludePatterns: string[] = [
    "node_modules",
    ".next",
    ".tmp",
    "dist",
    "build",
  ],
): string[] {
  const files: string[] = [];

  // Get tsconfig exclude patterns and merge with default excludes
  const tsConfigExcludes = getTsConfigExcludePatterns();
  // Merge exclude patterns for comprehensive filtering
  const allExcludePatterns = [...excludePatterns, ...tsConfigExcludes];

  const resolvedDirectory = resolve(directory);

  if (!existsSync(resolvedDirectory)) {
    return files;
  }

  const scanDirectory = (dir: string): void => {
    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);

        // Skip excluded patterns (simple pattern matching)
        if (allExcludePatterns.some((pattern) => item.includes(pattern))) {
          continue;
        }

        // Check if this path is excluded by tsconfig
        if (isExcludedByTsConfig(fullPath, tsConfigExcludes)) {
          continue;
        }

        try {
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile()) {
            const ext = extname(fullPath);
            if ((TS_EXTENSIONS as readonly string[]).includes(ext)) {
              // Return relative path from current working directory for TypeScript config
              const relativePath = relative(process.cwd(), fullPath);
              files.push(relativePath);
            }
          }
        } catch {
          // Skip files/directories we can't access
          continue;
        }
      }
    } catch {
      // Skip directories we can't read
      return;
    }
  };

  scanDirectory(resolvedDirectory);
  return files;
}

/**
 * Generate a cache key based on path type and content
 * Note: Cache keys are internal identifiers, not user-facing strings
 */
export function generateCacheKey(
  pathType: PathType,
  targetPath?: string,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  const baseKey = `typecheck_${pathType}`;

  if (!targetPath) {
    // For no-path scenario, create a cache key based on tsconfig.json modification time
    try {
      const tsconfigPath = resolve("tsconfig.json");
      const stat = statSync(tsconfigPath);
      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_project`;
    } catch {
      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_project`;
    }
  }

  // Create hash of the path for consistent cache keys
  // eslint-disable-next-line i18next/no-literal-string
  const pathHash = createHash("md5")
    .update(targetPath)
    .digest("hex")
    .slice(0, 8);

  if (pathType === PathType.SINGLE_FILE) {
    // For single files, include file modification time in cache key
    try {
      const stat = statSync(resolve(targetPath));
      const mtime = stat.mtime.getTime();
      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_file_${pathHash}_${mtime}`;
    } catch {
      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_file_${pathHash}`;
    }
  }

  if (pathType === PathType.FOLDER) {
    // For folders, create hash based on all TS files and their modification times
    try {
      const files = findTypeScriptFiles(resolve(targetPath));
      const fileHashes = files
        .map((file) => {
          try {
            const stat = statSync(file);
            const relativePath = relative(process.cwd(), file);

            return `${relativePath}:${stat.mtime.getTime()}`;
          } catch {
            return file;
          }
        })
        .toSorted();

      // eslint-disable-next-line i18next/no-literal-string
      const contentHash = createHash("md5")
        // eslint-disable-next-line i18next/no-literal-string
        .update(fileHashes.join("|"))
        .digest("hex")
        .slice(0, 8);

      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_folder_${pathHash}_${contentHash}`;
    } catch {
      // eslint-disable-next-line i18next/no-literal-string
      return `${baseKey}_folder_${pathHash}`;
    }
  }

  return baseKey;
}

/**
 * Create TypeScript checking configuration
 */
export function createTypecheckConfig(path?: string): TypecheckConfig {
  const pathType = determinePathType(path);
  const cacheKey = generateCacheKey(pathType, path);

  // Ensure .tmp directory exists
  const tmpDir = "./.tmp";
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  const config: TypecheckConfig = {
    pathType,
    targetPath: path,
    cacheKey,
    buildInfoFile: join(
      pathType === PathType.NO_PATH ? "." : tmpDir,
      // eslint-disable-next-line i18next/no-literal-string
      `tsconfig.${cacheKey}.tsbuildinfo`,
    ),
  };

  // Create temporary config file for single files and folders (not for no-path scenario)
  if (pathType === PathType.SINGLE_FILE || pathType === PathType.FOLDER) {
    // eslint-disable-next-line i18next/no-literal-string
    config.tempConfigFile = join(tmpDir, `tsconfig.${cacheKey}.json`);
  }

  return config;
}

/**
 * Check if a file path should be included in results based on target path
 */
export function shouldIncludeFile(
  filePath: string,
  targetPath?: string,
  disableFilter = false,
): boolean {
  if (disableFilter || !targetPath || targetPath.trim() === "") {
    return true;
  }

  try {
    const normalizedFilePath = resolve(filePath);
    const normalizedTargetPath = resolve(targetPath);

    // Check if the file is the exact target or within the target directory
    return (
      normalizedFilePath === normalizedTargetPath ||
      normalizedFilePath.startsWith(`${normalizedTargetPath}/`)
    );
  } catch {
    // If path resolution fails, include the file to be safe
    return true;
  }
}

/**
 * Get relative path for display purposes
 */
export function getDisplayPath(filePath: string): string {
  try {
    return relative(process.cwd(), filePath);
  } catch {
    return filePath;
  }
}
