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
  MULTIPLE_PATHS = "multiple_paths",
}

/**
 * TypeScript checking configuration
 */
export interface TypecheckConfig {
  pathType: PathType;
  targetPath?: string;
  /** Resolved list of paths when pathType is MULTIPLE_PATHS */
  targetPaths?: string[];
  cacheKey: string;
  buildInfoFile: string;
  tempConfigFile?: string;
}

/**
 * Determine the path type for TypeScript checking
 * @param path - Path to check (string or array of strings)
 */
export function determinePathType(
  path: string | string[] | undefined,
): PathType {
  if (!path || (Array.isArray(path) && path.length === 0)) {
    return PathType.NO_PATH;
  }

  if (Array.isArray(path)) {
    if (path.length === 1) {
      return determinePathType(path[0]);
    }
    return PathType.MULTIPLE_PATHS;
  }

  if (path.trim() === "") {
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
 * @param targetPath - Target path(s) to generate key for
 */
export function generateCacheKey(
  pathType: PathType,
  targetPath?: string | string[],
): string {
  // eslint-disable-next-line i18next/no-literal-string
  const baseKey = `typecheck_${pathType}`;

  if (!targetPath || (Array.isArray(targetPath) && targetPath.length === 0)) {
    return `${baseKey}_project`;
  }

  const pathForHash = Array.isArray(targetPath)
    ? targetPath.toSorted().join("|")
    : targetPath;

  // Create hash of the path for consistent cache keys
  // eslint-disable-next-line i18next/no-literal-string
  const pathHash = createHash("md5")
    .update(pathForHash)
    .digest("hex")
    .slice(0, 8);

  if (pathType === PathType.SINGLE_FILE) {
    return `${baseKey}_file_${pathHash}`;
  }

  if (pathType === PathType.MULTIPLE_PATHS) {
    return `${baseKey}_multi_${pathHash}`;
  }

  // eslint-disable-next-line i18next/no-literal-string
  return `${baseKey}_folder_${pathHash}`;
}

/**
 * Resolve a single path to a file/glob pattern for inclusion in tsconfig.
 * Files become exact paths; directories become glob patterns.
 */
function resolvePathToInclude(path: string): string {
  const resolvedPath = resolve(path);
  if (existsSync(resolvedPath) && statSync(resolvedPath).isFile()) {
    return path;
  }
  return `${path}/**/*`;
}

/**
 * Create TypeScript checking configuration
 * @param path - Path(s) to check (file, directory, or array of either)
 * @param cachePath - Path to cache directory
 */
export function createTypecheckConfig(
  path: string | string[] | undefined,
  cachePath: string,
): TypecheckConfig {
  const pathType = determinePathType(path);
  const cacheKey = generateCacheKey(pathType, path);

  if (!existsSync(cachePath)) {
    mkdirSync(cachePath, { recursive: true });
  }

  const needsTempConfig =
    pathType === PathType.SINGLE_FILE ||
    pathType === PathType.FOLDER ||
    pathType === PathType.MULTIPLE_PATHS;

  const result: TypecheckConfig = {
    pathType,
    // For single string paths keep targetPath for filtering; for arrays use targetPaths
    targetPath: Array.isArray(path) ? undefined : path,
    targetPaths: Array.isArray(path) ? path : undefined,
    cacheKey,
    buildInfoFile: join(
      pathType === PathType.NO_PATH ? "." : cachePath,
      // eslint-disable-next-line i18next/no-literal-string
      pathType === PathType.NO_PATH
        ? "tsconfig.tsbuildinfo"
        : `tsconfig.${cacheKey}.tsbuildinfo`,
    ),
  };

  if (needsTempConfig) {
    // eslint-disable-next-line i18next/no-literal-string
    result.tempConfigFile = join(cachePath, `tsconfig.${cacheKey}.json`);
  }

  return result;
}

/**
 * Resolve a list of paths to tsconfig include patterns.
 * Files become exact paths; directories become glob patterns.
 */
export function resolvePathsToIncludes(paths: string[]): string[] {
  return paths.map(resolvePathToInclude);
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
