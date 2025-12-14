/**
 * Release Tool Types
 * Internal type definitions for the release tool
 */

// ============================================================================
// Version Management Types
// ============================================================================

/**
 * Information about version changes during release
 */
export interface VersionInfo {
  /** The new version being released */
  newVersion: string;
  /** The previous git tag (e.g., "v1.0.0") */
  lastTag: string;
  /** The new git tag to create (e.g., "v1.1.0") */
  newTag: string;
}

/**
 * Parsed semantic version components
 */
export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  prereleaseNumber: number | null;
  buildMetadata: string | null;
}

// ============================================================================
// Package Processing Types
// ============================================================================

/**
 * Result of processing a single package
 */
export interface PackageResult {
  /** Package name from package.json */
  name: string;
  /** Directory path relative to project root */
  directory: string;
  /** Version that was released (if applicable) */
  version?: string;
  /** Git tag that was created (if applicable) */
  tag?: string;
  /** Processing outcome */
  status: "success" | "skipped" | "failed";
  /** Human-readable status message */
  message?: string;
}

/**
 * Information about a published package
 */
export interface PublishedPackage {
  /** Package name */
  name: string;
  /** Published version */
  version: string;
  /** Registry where published (npm, jsr, github) */
  registry: string;
  /** URL to view the published package */
  url?: string;
}

// ============================================================================
// Timing and Performance Types
// ============================================================================

/**
 * Timing breakdown for release phases
 */
export interface Timings {
  /** Total release duration in ms */
  total: number;
  /** Time spent on validation in ms */
  validation?: number;
  /** Time spent on dependency installation in ms */
  install?: number;
  /** Time spent on cleaning in ms */
  clean?: number;
  /** Time spent on linting in ms */
  lint?: number;
  /** Time spent on type checking in ms */
  typecheck?: number;
  /** Time spent on building in ms */
  build?: number;
  /** Time spent on testing in ms */
  test?: number;
  /** Time spent on publishing in ms */
  publish?: number;
  /** Time spent on changelog generation in ms */
  changelog?: number;
  /** Time spent on git operations in ms */
  gitOperations?: number;
}

// ============================================================================
// Notification Types
// ============================================================================

/**
 * Result of sending a notification
 */
export interface NotificationResult {
  /** Notification type (slack, discord, teams, custom) */
  type: string;
  /** Whether the notification was sent successfully */
  success: boolean;
  /** Error or status message */
  message?: string;
}

/**
 * Data payload for notifications
 */
export interface NotificationData {
  /** Whether the release succeeded */
  success: boolean;
  /** Name of the package released */
  packageName?: string;
  /** Version that was released */
  version?: string;
  /** Total duration in ms */
  duration?: number;
  /** Detailed timing breakdown */
  timings?: Timings;
  /** Error message if failed */
  error?: string;
  /** Release URL (GitHub/GitLab release) */
  releaseUrl?: string;
  /** NPM/JSR registry URLs */
  registryUrls?: string[];
  /** Git commit SHA */
  commitSha?: string;
  /** Git branch name */
  branch?: string;
}

// ============================================================================
// Git Types
// ============================================================================

/**
 * Comprehensive git repository information
 */
export interface GitInfo {
  /** Current branch name */
  currentBranch: string | null;
  /** Most recent git tag */
  lastTag: string | null;
  /** New tag created during release (if any) */
  newTag: string | null;
  /** Number of commits since last tag */
  commitsSinceLastTag: number | null;
  /** Whether working directory has uncommitted changes */
  hasUncommittedChanges: boolean;
}

/**
 * Repository hosting information
 */
export interface RepoInfo {
  /** Repository hosting type */
  type: "github" | "gitlab" | "bitbucket" | "azure" | "other";
  /** Repository URL (HTTPS format) */
  url: string;
  /** Repository owner/organization */
  owner?: string;
  /** Repository name */
  repo?: string;
  /** Default branch name */
  defaultBranch?: string;
}

/**
 * Git commit information
 */
export interface CommitInfo {
  /** Commit SHA (full) */
  sha: string;
  /** Commit SHA (short, 7 chars) */
  shortSha: string;
  /** Commit message subject (first line) */
  subject: string;
  /** Full commit message body */
  body?: string;
  /** Author name */
  authorName: string;
  /** Author email */
  authorEmail: string;
  /** Commit timestamp */
  timestamp: Date;
  /** Conventional commit type (if applicable) */
  conventionalType?: string;
  /** Conventional commit scope (if applicable) */
  conventionalScope?: string;
  /** Whether this is a breaking change */
  isBreaking?: boolean;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Context passed to release hooks
 */
export interface HookContext {
  /** Package manager being used */
  packageManager: string;
  /** Package name being processed */
  packageName?: string;
  /** Current or new version */
  version?: string;
  /** Package directory */
  directory?: string;
  /** Previous version (if upgrading) */
  previousVersion?: string;
  /** Git tag being created */
  tag?: string;
  /** Whether running in CI */
  isCI?: boolean;
  /** CI provider name */
  ciProvider?: string;
  /** Whether dry run mode is active */
  dryRun?: boolean;
}

/**
 * Result of executing a hook
 */
export interface HookResult {
  /** Whether the hook succeeded */
  success: boolean;
  /** Hook command that was run */
  command: string;
  /** Exit code */
  exitCode?: number;
  /** Standard output */
  stdout?: string;
  /** Standard error */
  stderr?: string;
  /** Duration in ms */
  duration?: number;
}

// ============================================================================
// Quality Check Types
// ============================================================================

/**
 * Result of a quality check (lint, typecheck, test, build)
 */
export interface QualityCheckResult {
  /** Check type */
  type: "lint" | "typecheck" | "build" | "test" | "clean" | "install";
  /** Whether the check passed */
  passed: boolean;
  /** Error or warning count */
  errorCount?: number;
  /** Warning count */
  warningCount?: number;
  /** Duration in ms */
  duration?: number;
  /** Output or error message */
  output?: string;
}

// ============================================================================
// Security Types
// ============================================================================

/**
 * Vulnerability information from security scan
 */
export interface VulnerabilityInfo {
  /** Severity level */
  severity: "critical" | "high" | "medium" | "low";
  /** Package with vulnerability */
  package: string;
  /** Vulnerable version range */
  vulnerableRange: string;
  /** Fixed version (if available) */
  fixedIn?: string;
  /** CVE identifier */
  cve?: string;
  /** Description */
  description?: string;
}

/**
 * Result of security scan
 */
export interface SecurityScanResult {
  /** Whether scan passed */
  passed: boolean;
  /** Number of vulnerabilities by severity */
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  /** Detailed vulnerability info */
  details?: VulnerabilityInfo[];
}

// ============================================================================
// Archive Types
// ============================================================================

/**
 * Configuration for zipping a folder
 */
export interface ZipConfig {
  /** Input directory path */
  input: string;
  /** Output file path (supports %NAME%, %VERSION%, %TIMESTAMP% placeholders) */
  output: string;
  /** Whether to include the base directory in the archive */
  includeBase?: boolean;
  /** Glob patterns to exclude */
  exclude?: string[];
  /** Archive format */
  format?: "zip" | "tar" | "tar.gz" | "tgz";
  /** Compression level (0-9) */
  compressionLevel?: number;
}

/**
 * Result of archive operation
 */
export interface ArchiveResult {
  /** Input path */
  input: string;
  /** Output path */
  output: string;
  /** Archive size in bytes */
  size: number;
  /** Number of files included */
  fileCount?: number;
  /** Duration in ms */
  duration?: number;
}

// ============================================================================
// Changelog Types
// ============================================================================

/**
 * Grouped commits for changelog generation
 */
export interface ChangelogCommits {
  feat: CommitInfo[];
  fix: CommitInfo[];
  docs: CommitInfo[];
  style: CommitInfo[];
  refactor: CommitInfo[];
  perf: CommitInfo[];
  test: CommitInfo[];
  build: CommitInfo[];
  ci: CommitInfo[];
  chore: CommitInfo[];
  other: CommitInfo[];
  breaking: CommitInfo[];
}

