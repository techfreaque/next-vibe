/**
 * TypeScript checker utilities for caching and path handling
 * File discovery is handled by TypeScript via tsconfig.json
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

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
 * @param path - Path to check
 */
export function determinePathType(path: string | undefined): PathType {
  if (!path || path.trim() === "") {
    return PathType.NO_PATH;
  }

  const resolvedPath = resolve(path);
  const cwd = process.cwd();

  // If path resolves to current working directory, treat as NO_PATH
  // This ensures we use the main tsconfig.json instead of creating a temp one
  if (resolvedPath === cwd) {
    return PathType.NO_PATH;
  }

  if (!existsSync(resolvedPath)) {
    // If path doesn't exist, treat as folder for better error messages
    return PathType.FOLDER;
  }

  const stat = statSync(resolvedPath);

  if (stat.isFile()) {
    return PathType.SINGLE_FILE;
  }

  return PathType.FOLDER;
}

/**
 * Generate a cache key based on path type
 * Note: Cache keys are internal identifiers, not user-facing strings
 * @param pathType - Type of path (file, folder, or no path)
 * @param targetPath - Target path to generate key for
 */
export function generateCacheKey(
  pathType: PathType,
  targetPath?: string,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  const baseKey = `typecheck_${pathType}`;

  if (!targetPath) {
    return `${baseKey}_project`;
  }

  // Create hash of the path for consistent cache keys
  // eslint-disable-next-line i18next/no-literal-string
  const pathHash = createHash("md5")
    .update(targetPath)
    .digest("hex")
    .slice(0, 8);

  if (pathType === PathType.SINGLE_FILE) {
    return `${baseKey}_file_${pathHash}`;
  }

  // eslint-disable-next-line i18next/no-literal-string
  return `${baseKey}_folder_${pathHash}`;
}

/**
 * Create TypeScript checking configuration
 * @param path - Path to check (file or directory)
 * @param cachePath - Path to cache directory
 */
export function createTypecheckConfig(
  path: string | undefined,
  cachePath: string,
): TypecheckConfig {
  const pathType = determinePathType(path);
  const cacheKey = generateCacheKey(pathType, path);

  if (!existsSync(cachePath)) {
    mkdirSync(cachePath, { recursive: true });
  }

  const result: TypecheckConfig = {
    pathType,
    targetPath: path,
    cacheKey,
    buildInfoFile: join(
      pathType === PathType.NO_PATH ? "." : cachePath,
      // eslint-disable-next-line i18next/no-literal-string
      pathType === PathType.NO_PATH
        ? "tsconfig.tsbuildinfo"
        : `tsconfig.${cacheKey}.tsbuildinfo`,
    ),
  };

  // Create temporary config file for single files and folders (not for no-path scenario)
  if (pathType === PathType.SINGLE_FILE || pathType === PathType.FOLDER) {
    // eslint-disable-next-line i18next/no-literal-string
    result.tempConfigFile = join(cachePath, `tsconfig.${cacheKey}.json`);
  }

  return result;
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
