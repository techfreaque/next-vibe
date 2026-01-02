/**
 * Version Service
 * Version management and semantic versioning operations
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type {
  PackageJson,
  ReleaseConfig,
  ReleaseOptions,
  ReleasePackage,
  VersionIncrement,
  VersionInfo,
} from "../definition";
import { MESSAGES } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IVersionService {
  /**
   * Get the last version from git tags
   */
  getLastVersionFromGitTag(
    tagPrefix: string,
    mainPackagePath: string,
    logger: EndpointLogger,
  ): string;

  /**
   * Bump version based on increment type
   */
  bumpVersion(currentVersion: string, increment: VersionIncrement, prereleaseId?: string): string;

  /**
   * Compare two version strings
   */
  compareVersions(a: string, b: string): number;

  /**
   * Get version info for a package
   */
  getVersionInfo(
    logger: EndpointLogger,
    pkg: ReleasePackage,
    packageJson: PackageJson,
    config: ReleaseConfig,
    releaseConfig: ReleaseOptions,
    requestedIncrement?: VersionIncrement,
    prereleaseId?: string,
  ): VersionInfo;

  /**
   * Update version in files using version bumper config
   */
  updateVariableStringValue(
    logger: EndpointLogger,
    newVersion: string,
    releaseConfig: ReleaseOptions,
  ): void;
}

// ============================================================================
// Implementation
// ============================================================================

export class VersionService implements IVersionService {
  getLastVersionFromGitTag(
    tagPrefix: string,
    mainPackagePath: string,
    logger: EndpointLogger,
  ): string {
    try {
      const tagsExist = execSync("git tag", { cwd: mainPackagePath }).toString().trim().length > 0;

      if (!tagsExist) {
        logger.debug(MESSAGES.GIT_NO_TAGS);
        return "0.0.0";
      }

      const lastGitTag = execSync(`git describe --tags --abbrev=0 --match="${tagPrefix}*"`, {
        cwd: mainPackagePath,
      })
        .toString()
        .trim();

      return lastGitTag.replace(tagPrefix, "");
    } catch {
      logger.debug(MESSAGES.GIT_NO_TAGS);
      return "0.0.0";
    }
  }

  private parseVersionString(v: string): {
    main: number[];
    pre: string | null;
  } {
    const [main, pre] = v.split("-");
    return {
      main: (main ?? "0.0.0").split(".").map(Number),
      pre: pre ?? null,
    };
  }

  compareVersions(a: string, b: string): number {
    const va = this.parseVersionString(a);
    const vb = this.parseVersionString(b);

    // Compare main version parts
    for (let i = 0; i < 3; i++) {
      const diff = (va.main[i] ?? 0) - (vb.main[i] ?? 0);
      if (diff !== 0) {
        return diff;
      }
    }

    // If main versions are equal, compare prerelease
    if (va.pre === null && vb.pre === null) {
      return 0;
    }
    if (va.pre === null) {
      return 1;
    } // Release > prerelease
    if (vb.pre === null) {
      return -1;
    }

    return va.pre.localeCompare(vb.pre);
  }

  bumpVersion(currentVersion: string, increment: VersionIncrement, prereleaseId?: string): string {
    // Parse current version
    const [mainPart, prePart] = currentVersion.split("-");
    const parts = (mainPart ?? "0.0.0").split(".").map(Number);
    const [major = 0, minor = 0, patch = 0] = parts;

    const id = prereleaseId ?? "alpha";

    switch (increment) {
      case "major":
        return `${major + 1}.0.0`;

      case "minor":
        return `${major}.${minor + 1}.0`;

      case "patch":
        return `${major}.${minor}.${patch + 1}`;

      case "premajor":
        return `${major + 1}.0.0-${id}.0`;

      case "preminor":
        return `${major}.${minor + 1}.0-${id}.0`;

      case "prepatch":
        return `${major}.${minor}.${patch + 1}-${id}.0`;

      case "prerelease": {
        if (prePart) {
          // Already a prerelease, bump the prerelease number
          const preMatch = prePart.match(/^(.+)\.(\d+)$/);
          if (preMatch) {
            const preId = preMatch[1];
            const preNum = parseInt(preMatch[2] ?? "0", 10);
            return `${mainPart}-${preId}.${preNum + 1}`;
          }
          return `${mainPart}-${id}.0`;
        }
        // Not a prerelease, make it one
        return `${major}.${minor}.${patch + 1}-${id}.0`;
      }

      default:
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  getVersionInfo(
    logger: EndpointLogger,
    pkg: ReleasePackage,
    packageJson: PackageJson,
    config: ReleaseConfig,
    releaseConfig: ReleaseOptions,
    requestedIncrement?: VersionIncrement,
    prereleaseId?: string,
  ): VersionInfo {
    const tagPrefix = releaseConfig.tagPrefix ?? "v";
    const currentGitVersion = this.getLastVersionFromGitTag(tagPrefix, pkg.directory, logger);

    // Priority: globalVersion > releaseConfig.version > package.json version
    const currentVersion = config.globalVersion ?? releaseConfig.version ?? packageJson.version;

    const lastTag = `${tagPrefix}${currentGitVersion}`;

    let finalVersion: string;

    if (requestedIncrement) {
      // User specified an increment - bump from whichever is newer: git tag or configured version
      const baseVersion =
        this.compareVersions(currentVersion, currentGitVersion) > 0
          ? currentVersion
          : currentGitVersion;
      finalVersion = this.bumpVersion(
        baseVersion,
        requestedIncrement,
        prereleaseId ?? releaseConfig.prereleaseId,
      );
    } else if (this.compareVersions(currentVersion, currentGitVersion) > 0) {
      // Config version is newer than git version
      finalVersion = currentVersion;
    } else {
      // Default to patch bump
      finalVersion = this.bumpVersion(currentGitVersion, "patch");
    }

    const newTag = `${tagPrefix}${finalVersion}`;

    return { newVersion: finalVersion, lastTag, newTag };
  }

  updateVariableStringValue(
    logger: EndpointLogger,
    newVersion: string,
    releaseConfig: ReleaseOptions,
  ): void {
    if (!releaseConfig.versionBumper) {
      return;
    }

    for (const fileInfo of releaseConfig.versionBumper) {
      if (!existsSync(fileInfo.filePath)) {
        logger.warn(`Version bumper file not found: ${fileInfo.filePath}`);
        continue;
      }

      const fileContent = readFileSync(fileInfo.filePath, "utf8");
      let updatedContent = fileContent;

      const isPhpFile = fileInfo.filePath.toLowerCase().endsWith(".php");
      const isJsonFile = fileInfo.filePath.toLowerCase().endsWith(".json");

      if (isPhpFile) {
        const phpDefineRegex = new RegExp(
          `(define\\s*\\(\\s*["']${fileInfo.varName}["']\\s*,\\s*["'])([^"']*)(["'])`,
          "g",
        );
        updatedContent = fileContent.replace(phpDefineRegex, `$1${newVersion}$3`);
      } else if (isJsonFile) {
        const jsonRegex = new RegExp(`("${fileInfo.varName}"\\s*:\\s*")([^"]*)(")`, "g");
        updatedContent = fileContent.replace(jsonRegex, `$1${newVersion}$3`);
      } else {
        const constRegex = new RegExp(
          `(const\\s+${fileInfo.varName}\\s*=\\s*["'])([^"']*)(["'])`,
          "g",
        );
        updatedContent = fileContent.replace(constRegex, `$1${newVersion}$3`);
      }

      if (updatedContent !== fileContent) {
        writeFileSync(fileInfo.filePath, updatedContent);
        logger.debug(MESSAGES.VERSION_FILE_UPDATED, {
          filePath: fileInfo.filePath,
          newVersion,
        });
      }
    }
  }
}

// Singleton instance
export const versionService = new VersionService();
