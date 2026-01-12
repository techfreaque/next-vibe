/**
 * Release Tool Constants
 * All message constants and configuration defaults
 */

// ============================================================================
// Configuration Defaults
// ============================================================================

export const DEFAULT_CONFIG_PATH = "release.config.ts";
export const DEFAULT_TAG_PREFIX = "v";
export const DEFAULT_PACKAGE_MANAGER = "npm";
export const DEFAULT_MAIN_BRANCH = "main";
export const DEFAULT_REMOTE = "origin";

// ============================================================================
// Timeouts (in milliseconds)
// ============================================================================

export const TIMEOUTS = {
  /** Default command timeout */
  DEFAULT: 120_000,
  /** Short timeout for quick operations */
  SHORT: 30_000,
  /** Long timeout for builds and installs */
  LONG: 300_000,
  /** Very long timeout for complex operations */
  EXTRA_LONG: 600_000,
  /** Lockfile verification timeout */
  LOCKFILE: 60_000,
  /** Git operations timeout */
  GIT: 60_000,
  /** Hook execution timeout (default) */
  HOOK: 120_000,
  /** Notification timeout */
  NOTIFICATION: 30_000,
} as const;

// ============================================================================
// Retry Configuration
// ============================================================================

export const RETRY_DEFAULTS = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,
  /** Initial delay between retries in ms */
  INITIAL_DELAY: 1000,
  /** Backoff multiplier for exponential backoff */
  BACKOFF_MULTIPLIER: 2,
  /** Maximum delay between retries in ms */
  MAX_DELAY: 30_000,
} as const;

// ============================================================================
// Registry URLs
// ============================================================================

export const REGISTRIES = {
  NPM: "https://registry.npmjs.org",
  NPM_PACKAGE_URL: "https://www.npmjs.com/package",
  JSR: "https://jsr.io",
  GITHUB_NPM: "https://npm.pkg.github.com",
  GITHUB_PACKAGES: "https://ghcr.io",
} as const;

// ============================================================================
// Message Constants
// ============================================================================

export const MESSAGES = {
  // -------------------------------------------------------------------------
  // Configuration
  // -------------------------------------------------------------------------
  CONFIG_NOT_FOUND: "Config file not found",
  CONFIG_INVALID: "Invalid config format",
  CONFIG_LOADED: "Successfully loaded config",
  CONFIG_VALIDATING: "Validating configuration...",
  CONFIG_VALID: "Configuration is valid",

  // -------------------------------------------------------------------------
  // Package.json
  // -------------------------------------------------------------------------
  PACKAGE_JSON_NOT_FOUND: "Package.json not found",
  PACKAGE_JSON_INVALID: "Invalid package.json format",
  PACKAGE_JSON_READING: "Reading package.json...",
  PACKAGE_JSON_UPDATED: "Package.json updated",

  // -------------------------------------------------------------------------
  // Release Process
  // -------------------------------------------------------------------------
  RELEASE_START: "Starting release process...",
  RELEASE_CI_MODE: "Running release in CI mode...",
  RELEASE_LOCAL_MODE: "Running release in local mode...",
  RELEASE_FORCE_UPDATE: "Force updating dependencies...",
  RELEASE_COMPLETE: "Release process completed",
  RELEASE_FAILED: "Release process failed",
  RELEASE_ABORTED: "Release process aborted",
  RELEASE_DRY_RUN: "Dry run mode - no changes will be made",

  // -------------------------------------------------------------------------
  // Package Processing
  // -------------------------------------------------------------------------
  PROCESSING_PACKAGE: "Processing package",
  PACKAGE_SKIPPED: "Package skipped",
  PACKAGE_COMPLETE: "Package complete",
  PACKAGE_FAILED: "Package failed",
  PACKAGE_NOT_FOUND: "Package not found",

  // -------------------------------------------------------------------------
  // Quality Checks - Linting
  // -------------------------------------------------------------------------
  LINTING: "Running linting...",
  LINT_PASSED: "Linting passed",
  LINT_FAILED: "Linting failed",
  LINT_WARNINGS: "Linting passed with warnings",
  LINT_SKIPPED: "Linting skipped",
  LINT_FIXING: "Auto-fixing lint issues...",

  // -------------------------------------------------------------------------
  // Quality Checks - Type Checking
  // -------------------------------------------------------------------------
  TYPECHECKING: "Running type check...",
  TYPECHECK_PASSED: "Type check passed",
  TYPECHECK_FAILED: "Type check failed",
  TYPECHECK_SKIPPED: "Type check skipped (no tsconfig.json)",

  // -------------------------------------------------------------------------
  // Quality Checks - Building
  // -------------------------------------------------------------------------
  BUILDING: "Building package...",
  BUILD_PASSED: "Build passed",
  BUILD_FAILED: "Build failed",
  BUILD_SKIPPED: "Build skipped",
  BUILD_CACHED: "Using cached build",

  // -------------------------------------------------------------------------
  // Quality Checks - Testing
  // -------------------------------------------------------------------------
  TESTING: "Running tests...",
  TESTS_PASSED: "Tests passed",
  TESTS_FAILED: "Tests failed",
  TESTS_SKIPPED: "Tests skipped",
  TESTS_COVERAGE: "Generating test coverage...",

  // -------------------------------------------------------------------------
  // Security - Snyk
  // -------------------------------------------------------------------------
  SNYK_TESTING: "Running Snyk vulnerability test...",
  SNYK_TEST_PASSED: "Snyk test passed",
  SNYK_TEST_FAILED: "Snyk test failed",
  SNYK_MONITORING: "Running Snyk monitor...",
  SNYK_MONITOR_PASSED: "Snyk monitor completed",
  SNYK_MONITOR_FAILED: "Snyk monitor failed",
  SNYK_CLI_NOT_FOUND: "Snyk CLI not found, skipping security scan",
  SNYK_TOKEN_REQUIRED:
    "SNYK_TOKEN environment variable required for monitoring",
  SNYK_ORG_REQUIRED: "SNYK_ORG_KEY environment variable required",

  // -------------------------------------------------------------------------
  // Security - Audit
  // -------------------------------------------------------------------------
  AUDIT_RUNNING: "Running security audit...",
  AUDIT_PASSED: "Security audit passed",
  AUDIT_FAILED: "Security audit failed",
  AUDIT_VULNERABILITIES: "Vulnerabilities found",

  // -------------------------------------------------------------------------
  // Dependencies
  // -------------------------------------------------------------------------
  UPDATING_DEPS: "Updating dependencies...",
  DEPS_UPDATED: "Dependencies updated",
  DEPS_FAILED: "Dependency update failed",
  DEPS_CHECKING_OUTDATED: "Checking for outdated dependencies...",
  DEPS_ALL_UP_TO_DATE: "All dependencies are up to date",

  // -------------------------------------------------------------------------
  // Git - General
  // -------------------------------------------------------------------------
  GIT_INFO_FETCHING: "Fetching git information...",
  GIT_COMMITS_SINCE_TAG: "commits since last tag",
  GIT_NO_TAGS: "No git tags found, using 0.0.0 as initial version",
  GIT_UNCOMMITTED_CHANGES: "Uncommitted changes detected",
  GIT_NOT_ON_MAIN: "Not on main branch",
  GIT_REPO_NOT_FOUND: "Not a git repository",

  // -------------------------------------------------------------------------
  // Git - Tags
  // -------------------------------------------------------------------------
  GIT_TAG_CREATING: "Creating git tag...",
  GIT_TAG_CREATED: "Git tag created",
  GIT_TAG_EXISTS: "Git tag already exists",
  GIT_TAG_DELETED: "Git tag deleted",
  GIT_NO_COMMITS: "No new commits since last tag",

  // -------------------------------------------------------------------------
  // Git - Push/Pull
  // -------------------------------------------------------------------------
  GIT_PUSHING: "Pushing to remote...",
  GIT_PUSH_SUCCESS: "Pushed to remote",
  GIT_PUSH_FAILED: "Push to remote failed",
  GIT_PULLING: "Pulling from remote...",
  GIT_PULL_SUCCESS: "Pulled from remote",

  // -------------------------------------------------------------------------
  // Git - Commits
  // -------------------------------------------------------------------------
  GIT_COMMITTING: "Creating commit...",
  GIT_COMMIT_CREATED: "Commit created",
  GIT_COMMIT_FAILED: "Commit failed",
  GIT_STAGING: "Staging changes...",

  // -------------------------------------------------------------------------
  // Version
  // -------------------------------------------------------------------------
  VERSION_BUMPING: "Bumping version...",
  VERSION_BUMPED: "Version bumped",
  VERSION_FILE_UPDATED: "Version file updated",
  VERSION_NO_CHANGE: "No version change needed",
  VERSION_CALCULATING: "Calculating next version...",

  // -------------------------------------------------------------------------
  // CI/CD
  // -------------------------------------------------------------------------
  CI_COMMAND_RUNNING: "Running CI release command...",
  CI_COMMAND_SUCCESS: "CI release command completed",
  CI_COMMAND_FAILED: "CI release command failed",
  CI_COMMAND_REQUIRED: "CI mode requires ciReleaseCommand configuration",
  CI_ENV_DETECTED: "CI environment detected",
  CI_ENV_NOT_DETECTED: "Not running in CI environment",

  // -------------------------------------------------------------------------
  // Publishing - NPM
  // -------------------------------------------------------------------------
  NPM_PUBLISHING: "Publishing to npm...",
  NPM_PUBLISH_SUCCESS: "Published to npm",
  NPM_PUBLISH_FAILED: "npm publish failed",
  NPM_PUBLISH_SKIPPED: "npm publish skipped (private package)",
  NPM_PROVENANCE: "Publishing with provenance attestation",
  NPM_CHECKING_EXISTING: "Checking if version exists on npm...",
  NPM_VERSION_EXISTS: "Version already exists on npm",

  // -------------------------------------------------------------------------
  // Publishing - JSR
  // -------------------------------------------------------------------------
  JSR_PUBLISHING: "Publishing to JSR...",
  JSR_PUBLISH_SUCCESS: "Published to JSR",
  JSR_PUBLISH_FAILED: "JSR publish failed",
  JSR_PUBLISH_SKIPPED: "JSR publish skipped",

  // -------------------------------------------------------------------------
  // Publishing - GitHub Packages
  // -------------------------------------------------------------------------
  GITHUB_PKG_PUBLISHING: "Publishing to GitHub Packages...",
  GITHUB_PKG_SUCCESS: "Published to GitHub Packages",
  GITHUB_PKG_FAILED: "GitHub Packages publish failed",

  // -------------------------------------------------------------------------
  // Hooks
  // -------------------------------------------------------------------------
  HOOK_RUNNING: "Running hook",
  HOOK_SUCCESS: "Hook completed",
  HOOK_FAILED: "Hook failed",
  HOOK_TIMEOUT: "Hook timed out",
  HOOK_SKIPPED: "Hook skipped (dry run)",
  HOOK_CONTINUE_ON_ERROR: "Hook failed but continuing (continueOnError)",

  // -------------------------------------------------------------------------
  // Archives
  // -------------------------------------------------------------------------
  ZIPPING_FOLDERS: "Zipping folders...",
  ZIP_COMPLETE: "Zip complete",
  ZIP_FAILED: "Zip failed",
  TAR_CREATING: "Creating tar archive...",
  TAR_COMPLETE: "Tar archive created",
  ARCHIVE_SKIPPED: "Archive skipped (input not found)",

  // -------------------------------------------------------------------------
  // Changelog
  // -------------------------------------------------------------------------
  CHANGELOG_GENERATING: "Generating changelog...",
  CHANGELOG_GENERATED: "Changelog generated",
  CHANGELOG_FAILED: "Changelog generation failed",
  CHANGELOG_SKIPPED: "Changelog generation skipped",
  CHANGELOG_NO_CHANGES: "No changes to document",

  // -------------------------------------------------------------------------
  // GitHub/GitLab Releases
  // -------------------------------------------------------------------------
  GITHUB_RELEASE_CREATING: "Creating GitHub release...",
  GITHUB_RELEASE_SUCCESS: "GitHub release created",
  GITHUB_RELEASE_FAILED: "GitHub release failed",
  GITHUB_CLI_NOT_FOUND: "GitHub CLI (gh) not found",
  GITLAB_RELEASE_CREATING: "Creating GitLab release...",
  GITLAB_RELEASE_SUCCESS: "GitLab release created",
  GITLAB_RELEASE_FAILED: "GitLab release failed",
  GITLAB_CLI_NOT_FOUND: "GitLab CLI (glab) not found",
  BITBUCKET_RELEASE_CREATING: "Creating Bitbucket download...",
  BITBUCKET_RELEASE_SUCCESS: "Bitbucket download created",
  BITBUCKET_RELEASE_FAILED: "Bitbucket download creation failed",

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------
  VALIDATION_STARTING: "Running validations...",
  VALIDATION_BRANCH_CHECK: "Checking branch configuration...",
  VALIDATION_BRANCH_NOT_ALLOWED: "Release from branch not allowed",
  VALIDATION_DIRTY_WORKING_DIR: "Working directory has uncommitted changes",
  VALIDATION_PASSED: "All validations passed",
  VALIDATION_FAILED: "Validation failed",

  // -------------------------------------------------------------------------
  // Lockfile
  // -------------------------------------------------------------------------
  LOCKFILE_CHECKING: "Checking lockfile integrity...",
  LOCKFILE_VALID: "Lockfile is valid",
  LOCKFILE_INVALID: "Lockfile integrity check failed",
  LOCKFILE_MISSING: "No lockfile found",
  LOCKFILE_OUTDATED: "Lockfile is outdated",

  // -------------------------------------------------------------------------
  // Install/Clean
  // -------------------------------------------------------------------------
  INSTALLING: "Installing dependencies...",
  INSTALL_SUCCESS: "Dependencies installed",
  INSTALL_FAILED: "Install failed",
  CLEANING: "Cleaning build artifacts...",
  CLEAN_SUCCESS: "Clean completed",
  CLEAN_FAILED: "Clean failed",

  // -------------------------------------------------------------------------
  // Dry Run
  // -------------------------------------------------------------------------
  DRY_RUN_MODE: "[DRY RUN] Would execute:",
  DRY_RUN_SKIP: "[DRY RUN] Skipping:",
  DRY_RUN_ENABLED: "Dry run mode enabled - no actual changes will be made",

  // -------------------------------------------------------------------------
  // Verbose
  // -------------------------------------------------------------------------
  VERBOSE_ENABLED: "Verbose logging enabled",

  // -------------------------------------------------------------------------
  // Parallel Processing
  // -------------------------------------------------------------------------
  PARALLEL_PROCESSING: "Processing packages in parallel",
  PARALLEL_COMPLETE: "Parallel processing complete",
  PARALLEL_FAILED: "Parallel processing failed",
  SEQUENTIAL_PROCESSING: "Processing packages sequentially",

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  SUMMARY_HEADER: "Release Summary",
  SUMMARY_SUCCESS_COUNT: "packages released successfully",
  SUMMARY_SKIP_COUNT: "packages skipped",
  SUMMARY_FAIL_COUNT: "packages failed",
  SUMMARY_DURATION: "Total duration",

  // -------------------------------------------------------------------------
  // Retry
  // -------------------------------------------------------------------------
  RETRY_ATTEMPT: "Retry attempt",
  RETRY_FAILED: "All retry attempts failed",
  RETRY_SUCCESS: "Operation succeeded after retry",
  RETRY_WAITING: "Waiting before retry...",

  // -------------------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------------------
  NOTIFICATION_SENDING: "Sending notification...",
  NOTIFICATION_SENT: "Notification sent successfully",
  NOTIFICATION_FAILED: "Failed to send notification",
  NOTIFICATION_SKIPPED: "Notification skipped",
  NOTIFICATION_RETRYING: "Retrying notification...",

  // -------------------------------------------------------------------------
  // Rollback
  // -------------------------------------------------------------------------
  ROLLBACK_STARTING: "Starting rollback...",
  ROLLBACK_COMPLETE: "Rollback completed",
  ROLLBACK_FAILED: "Rollback failed",
  ROLLBACK_GIT: "Rolling back git changes...",
  ROLLBACK_VERSION: "Rolling back version changes...",
  ROLLBACK_NOT_NEEDED: "No rollback needed",

  // -------------------------------------------------------------------------
  // Timings
  // -------------------------------------------------------------------------
  TIMING_REPORT: "Timing breakdown",
  TIMING_PHASE_START: "Starting phase",
  TIMING_PHASE_END: "Phase completed",

  // -------------------------------------------------------------------------
  // Registry URLs (for logging)
  // -------------------------------------------------------------------------
  NPM_REGISTRY_URL: "https://www.npmjs.com/package",
  JSR_REGISTRY_URL: "https://jsr.io",
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type MessageKey = keyof typeof MESSAGES;
export type TimeoutKey = keyof typeof TIMEOUTS;
export type RetryDefaultKey = keyof typeof RETRY_DEFAULTS;
export type RegistryKey = keyof typeof REGISTRIES;
