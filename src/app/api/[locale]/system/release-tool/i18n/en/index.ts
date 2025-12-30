export const translations = {
  title: "Release Tool",
  description:
    "Manage package releases with version bumping, git tagging, and CI/CD integration",
  category: "Release Tool",
  tags: {
    release: "Release",
  },
  enums: {
    versionIncrement: {
      patch: "Patch",
      minor: "Minor",
      major: "Major",
      prepatch: "Pre-patch",
      preminor: "Pre-minor",
      premajor: "Pre-major",
      prerelease: "Prerelease",
    },
    packageManager: {
      bun: "Bun",
      npm: "NPM",
      yarn: "Yarn",
      pnpm: "PNPM",
      deno: "Deno",
    },
    webhookType: {
      slack: "Slack",
      discord: "Discord",
      teams: "Microsoft Teams",
      custom: "Custom",
    },
    npmAccess: {
      public: "Public",
      restricted: "Restricted",
    },
    changelogPreset: {
      "conventional-commits": "Conventional Commits",
      angular: "Angular",
      atom: "Atom",
      eslint: "ESLint",
      ember: "Ember",
    },
  },
  form: {
    title: "Release Configuration",
    description: "Configure release options for your packages",
  },
  fields: {
    configPath: {
      title: "Config Path",
      description:
        "Path to release.config.ts file (default: release.config.ts)",
    },
    ci: {
      title: "CI Mode",
      description:
        "Run in CI mode (no interactive prompts, uses ciReleaseCommand)",
    },
    forceUpdate: {
      title: "Force Update Dependencies",
      description:
        "Force update all dependencies without prompting (skip all other steps)",
    },
    dryRun: {
      title: "Dry Run",
      description: "Simulate the release without making any changes",
    },
    skipLint: {
      title: "Skip Lint",
      description: "Skip linting step",
    },
    skipTypecheck: {
      title: "Skip Type Check",
      description: "Skip TypeScript type checking step",
    },
    skipBuild: {
      title: "Skip Build",
      description: "Skip build step",
    },
    skipTests: {
      title: "Skip Tests",
      description: "Skip test execution step",
    },
    skipSnyk: {
      title: "Skip Snyk",
      description: "Skip Snyk vulnerability scanning",
    },
    skipPublish: {
      title: "Skip Publish",
      description: "Skip publishing to npm/registry",
    },
    skipChangelog: {
      title: "Skip Changelog",
      description: "Skip changelog generation",
    },
    prereleaseId: {
      title: "Prerelease ID",
      description:
        "Prerelease identifier (alpha, beta, rc) for version bumping",
    },
    versionIncrement: {
      title: "Version Increment",
      description:
        "Version increment type (patch, minor, major) - only used in local mode",
    },
    targetPackage: {
      title: "Target Package",
      description:
        "Target specific package directory (optional, defaults to all packages)",
    },
    inlineConfig: {
      title: "Inline Config",
      description:
        "Provide release configuration inline instead of using config file",
    },
    skipGitTag: {
      title: "Skip Git Tag",
      description: "Skip creating git tag during release",
    },
    skipGitPush: {
      title: "Skip Git Push",
      description: "Skip pushing to remote repository",
    },
    verbose: {
      title: "Verbose",
      description: "Enable verbose logging for detailed output",
    },
    skipInstall: {
      title: "Skip Install",
      description: "Skip dependency installation step",
    },
    skipClean: {
      title: "Skip Clean",
      description: "Skip clean step before build",
    },
    commitMessage: {
      title: "Commit Message",
      description:
        // eslint-disable-next-line no-template-curly-in-string -- Intentional template placeholder documentation
        "Custom commit message for version bump (supports ${version} placeholder)",
    },
    notifyWebhook: {
      title: "Notification Webhook",
      description:
        "Webhook URL to send release notifications to (Slack, Discord, Teams, or custom)",
    },
    configObject: {
      title: "Configuration Object",
      description: "Release configuration settings",
    },
    packageManager: {
      title: "Package Manager",
      description:
        "Package manager to use for releases (bun, npm, yarn, pnpm, deno)",
    },
    globalVersion: {
      title: "Global Version",
      description: "Set a global version for all packages in monorepo",
    },
    parallel: {
      title: "Parallel Execution",
      description: "Enable parallel package processing",
    },
    maxParallelJobs: {
      title: "Max Parallel Jobs",
      description: "Maximum number of parallel jobs to run",
    },
    continueOnError: {
      title: "Continue on Error",
      description: "Continue processing remaining packages if one fails",
    },
    verifyGitStatus: {
      title: "Verify Git Status",
      description: "Verify git status before release",
    },
    requireCleanWorkingDir: {
      title: "Require Clean Working Directory",
      description: "Require clean working directory before release",
    },
    verifyLockfile: {
      title: "Verify Lockfile",
      description: "Verify lockfile integrity before release",
    },
    branch: {
      title: "Branch Configuration",
      description: "Git branch configuration settings",
    },
    branchMain: {
      title: "Main Branch",
      description: "Name of the main/production branch",
    },
    branchDevelop: {
      title: "Develop Branch",
      description: "Name of the development branch",
    },
    allowNonMain: {
      title: "Allow Non-Main Releases",
      description: "Allow releases from branches other than main",
    },
    protectedBranches: {
      title: "Protected Branches",
      description: "List of protected branch names",
    },
    notifications: {
      title: "Notifications",
      description: "Notification configuration for release events",
    },
    notificationsEnabled: {
      title: "Enable Notifications",
      description: "Enable release notifications",
    },
    webhookUrl: {
      title: "Webhook URL",
      description: "URL for webhook notifications",
    },
    webhookType: {
      title: "Webhook Type",
      description: "Type of webhook (Slack, Discord, Teams, Custom)",
    },
    onSuccess: {
      title: "Notify on Success",
      description: "Send notification on successful release",
    },
    onFailure: {
      title: "Notify on Failure",
      description: "Send notification on failed release",
    },
    messageTemplate: {
      title: "Message Template",
      description: "Custom message template for notifications",
    },
    includeTimings: {
      title: "Include Timings",
      description: "Include timing information in notifications",
    },
    retry: {
      title: "Retry Configuration",
      description: "Retry settings for failed operations",
    },
    maxAttempts: {
      title: "Max Attempts",
      description: "Maximum number of retry attempts",
    },
    delayMs: {
      title: "Retry Delay",
      description: "Initial delay between retries in milliseconds",
    },
    backoffMultiplier: {
      title: "Backoff Multiplier",
      description: "Multiplier for exponential backoff",
    },
    maxDelayMs: {
      title: "Max Delay",
      description: "Maximum delay between retries in milliseconds",
    },
    rollback: {
      title: "Rollback Configuration",
      description: "Automatic rollback settings on failure",
    },
    rollbackEnabled: {
      title: "Enable Rollback",
      description: "Enable automatic rollback on failure",
    },
    rollbackGit: {
      title: "Rollback Git Changes",
      description: "Rollback git commits and tags on failure",
    },
    rollbackVersion: {
      title: "Rollback Version Changes",
      description: "Rollback version changes on failure",
    },
    packages: {
      title: "Packages",
      description: "List of packages to release",
    },
    package: {
      title: "Package Configuration",
    },
    directory: {
      title: "Directory",
    },
    name: {
      title: "Name",
    },
    updateDeps: {
      title: "Update Dependencies",
      description: "Update dependencies in dependent packages",
    },
    clean: {
      title: "Clean Command",
      description: "Command or script to clean package",
    },
    lint: {
      title: "Lint Command",
      description: "Command or script to lint package",
    },
    typecheck: {
      title: "Typecheck Command",
      description: "Command or script to typecheck package",
    },
    build: {
      title: "Build Command",
      description: "Command or script to build package",
    },
    test: {
      title: "Test Command",
      description: "Command or script to test package",
    },
    snyk: {
      title: "Snyk Scan",
      description: "Enable Snyk security scanning",
    },
    install: {
      title: "Install Command",
      description: "Command or script to install dependencies",
    },
    release: {
      title: "Release Configuration",
    },
    releaseVersion: {
      title: "Release Version",
    },
    tagPrefix: {
      title: "Tag Prefix",
    },
    tagSuffix: {
      title: "Tag Suffix",
    },
    ciReleaseCommand: {
      title: "CI Release Command",
      description: "Command to run in CI mode for releasing",
    },
    ciCommand: {
      title: "Command",
      description: "Command array to execute",
    },
    ciEnvMapping: {
      title: "Environment Mapping",
      description: "Environment variable mappings for CI",
    },
    gitOps: {
      title: "Git Operations",
    },
    skipTag: {
      title: "Skip Tag",
    },
    skipPush: {
      title: "Skip Push",
    },
    skipCommit: {
      title: "Skip Commit",
    },
    signCommit: {
      title: "Sign Commit",
    },
    signTag: {
      title: "Sign Tag",
    },
    remote: {
      title: "Remote",
    },
    npm: {
      title: "NPM Configuration",
    },
    npmEnabled: {
      title: "Enable NPM Publishing",
    },
    npmRegistry: {
      title: "NPM Registry",
    },
    npmTag: {
      title: "NPM Tag",
    },
    npmAccess: {
      title: "NPM Access",
    },
    otpEnvVar: {
      title: "OTP Environment Variable",
    },
    provenance: {
      title: "Provenance",
    },
    ignoreScripts: {
      title: "Ignore Scripts",
    },
    npmDryRun: {
      title: "NPM Dry Run",
    },
    jsr: {
      title: "JSR Configuration",
    },
    jsrEnabled: {
      title: "Enable JSR Publishing",
    },
    allowSlowTypes: {
      title: "Allow Slow Types",
    },
    allowDirty: {
      title: "Allow Dirty",
    },
    jsrDryRun: {
      title: "JSR Dry Run",
    },
    changelog: {
      title: "Changelog Configuration",
    },
    changelogEnabled: {
      title: "Enable Changelog",
    },
    changelogFile: {
      title: "Changelog File",
    },
    changelogHeader: {
      title: "Changelog Header",
    },
    compareUrlFormat: {
      title: "Compare URL Format",
    },
    commitUrlFormat: {
      title: "Commit URL Format",
    },
    includeBody: {
      title: "Include Body",
    },
    changelogPreset: {
      title: "Changelog Preset",
    },
    gitRelease: {
      title: "Git Release Configuration",
    },
    gitReleaseEnabled: {
      title: "Enable Git Release",
    },
    releaseTitle: {
      title: "Release Title",
    },
    generateNotes: {
      title: "Generate Notes",
    },
    releaseBody: {
      title: "Release Body",
    },
    draft: {
      title: "Draft",
    },
    prerelease: {
      title: "Prerelease",
    },
    discussionCategory: {
      title: "Discussion Category",
    },
    target: {
      title: "Target",
    },
    assets: {
      title: "Assets",
      description: "Release assets to upload",
    },
    foldersToZip: {
      title: "Folders to Zip",
      description: "Folders to zip for release",
    },
    versionBumper: {
      title: "Version Bumper",
      description: "Version bumping configuration for non-package.json files",
    },
    hooks: {
      title: "Lifecycle Hooks",
      description: "Commands to run at different stages",
    },
    preInstall: {
      title: "Pre-Install Hook",
    },
    postInstall: {
      title: "Post-Install Hook",
    },
    preClean: {
      title: "Pre-Clean Hook",
    },
    postClean: {
      title: "Post-Clean Hook",
    },
    preLint: {
      title: "Pre-Lint Hook",
    },
    postLint: {
      title: "Post-Lint Hook",
    },
    preBuild: {
      title: "Pre-Build Hook",
    },
    postBuild: {
      title: "Post-Build Hook",
    },
    preTest: {
      title: "Pre-Test Hook",
    },
    postTest: {
      title: "Post-Test Hook",
    },
    prePublish: {
      title: "Pre-Publish Hook",
    },
    postPublish: {
      title: "Post-Publish Hook",
    },
    preRelease: {
      title: "Pre-Release Hook",
    },
    postRelease: {
      title: "Post-Release Hook",
    },
    globalHooks: {
      title: "Global Hooks",
      description: "Global lifecycle hooks for entire release process",
    },
  },
  response: {
    status: "Status",
    success: "Release Status",
    output: "Release Log",
    duration: "Duration",
    packages: "Packages",
    packagesProcessed: "Packages Processed",
    ciEnvironment: "CI Environment",
    errors: "Errors",
    warnings: "Warnings",
    gitInfo: "Git Information",
    published: "Published Packages",
    publishedPackages: "Published Packages",
    timings: "Performance",
    rollbackPerformed: "Rollback Performed",
    notificationsSent: "Notifications",
  },
  table: {
    name: "Package",
    directory: "Directory",
    version: "Version",
    tag: "Tag",
    status: "Status",
    message: "Message",
    registry: "Registry",
    url: "URL",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid release configuration",
    },
    notFound: {
      title: "Not Found",
      description: "Config file or package not found",
    },
    server: {
      title: "Server Error",
      description: "An error occurred during the release process",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network error during release process",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Not authorized to perform release",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access denied for release operation",
    },
    conflict: {
      title: "Conflict",
      description: "Release conflict detected (tag may already exist)",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes that must be committed first",
    },
    packageNotFound: "Package '{{targetPackage}}' not found in configuration",
    gitOperationFailed: "Git operation failed: {{error}}",
    gitAddFailed: "Git add failed: {{error}}",
    gitTagFailed: "Git tag '{{tag}}' failed: {{error}}",
    gitPushFailed: "Git push to '{{remote}}' failed: {{error}}",
    gitPushTagFailed:
      "Git push tag '{{tag}}' to '{{remote}}' failed: {{error}}",
  },
  success: {
    title: "Release Complete",
    description: "Release process completed successfully",
  },
  config: {
    fileNotFound: "Config file not found: {{path}}",
    invalidFormat:
      "Invalid config format. Ensure the config exports a default object with a 'packages' array. Check the docs for more info.",
    errorLoading: "Error loading config: {{error}}",
  },
  packageJson: {
    notFound: "Package.json not found: {{path}}",
    invalidFormat: "Invalid package.json format: {{path}}",
    errorReading: "Error reading package.json: {{error}}",
    errorUpdatingDeps:
      "Error updating dependencies for {{directory}}: {{error}}",
    errorUpdatingVersion:
      "Error updating package version for {{directory}}: {{error}}",
  },
  scripts: {
    invalidPackageJson: "Invalid package.json format in {{path}}",
    testsFailed: "Tests failed in {{path}}: {{error}}",
    lintFailed: "Linting failed in {{path}}",
    typecheckFailed: "Type checking failed in {{path}}: {{error}}",
    buildFailed: "Build failed in {{path}}: {{error}}",
    packageJsonNotFound: "Package.json not found in {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI not found. Install with: npm install -g snyk",
    testFailed: "Snyk vulnerability test failed for {{packageName}}: {{error}}",
    tokenRequired:
      "SNYK_TOKEN environment variable required for {{packageName}}",
    orgKeyRequired:
      "SNYK_ORG_KEY environment variable required for {{packageName}}",
    monitorFailed: "Snyk monitor failed for {{packageName}}: {{error}}",
  },
  git: {
    tagCreated: "Git tag '{{tag}}' created successfully",
    tagExists: "Git tag '{{tag}}' already exists",
    pushSuccess: "Changes pushed to remote",
    noCommits: "No new commits since tag '{{lastTag}}'",
    uncommittedChanges: "Uncommitted changes detected",
    notOnMain: "Not on main branch (current: {{currentBranch}})",
    commitFailed: "Failed to commit changes",
    tagFailed: "Failed to create tag",
    pushFailed: "Failed to push to remote",
  },
  version: {
    bumped: "Version bumped from {{from}} to {{to}} ({{increment}})",
    fileUpdated: "Version updated in {{file}} to {{newVersion}}",
    invalidFormat: "Invalid version format: {{version}}",
  },
  ci: {
    commandRunning: "Running CI release command for {{package}}: {{command}}",
    commandSuccess: "CI release command completed for {{package}}",
    commandFailed: "CI release command failed for {{package}}: {{error}}",
    commandRequired:
      "CI mode requires ciReleaseCommand configuration for {{package}}",
    envVarMissing:
      "Required environment variable '{{variable}}' not set for {{package}}",
  },
  zip: {
    starting: "Zipping folders...",
    complete: "Successfully zipped {{input}} to {{output}} ({{bytes}} bytes)",
    failed: "Failed to zip {{input}}: {{error}}",
    noFolders: "No folders to zip in configuration",
    inputNotFound: "Input folder {{input}} does not exist",
  },
  dryRun: {
    prefix: "[DRY RUN]",
    wouldExecute: "Would execute: {{action}}",
  },
  release: {
    starting: "Starting release process...",
    ciMode: "Running release in CI mode...",
    localMode: "Running release in local mode...",
    forceUpdate: "Force updating dependencies...",
    complete: "Release process completed",
    failed: "Release process failed",
    processingPackage: "Processing package: {{name}}",
    packageSkipped: "Package '{{name}}' skipped: {{reason}}",
    packageComplete: "Package '{{name}}' completed",
    packageFailed: "Package '{{name}}' failed: {{error}}",
    firstRelease: "No previous tags found. This will be the first release.",
  },
  qualityChecks: {
    linting: "Running linting for {{package}}...",
    lintPassed: "Linting passed for {{package}}",
    lintFailed: "Linting failed for {{package}}",
    typeChecking: "Running type check for {{package}}...",
    typeCheckPassed: "Type check passed for {{package}}",
    typeCheckFailed: "Type check failed for {{package}}",
    building: "Building {{package}}...",
    buildPassed: "Build passed for {{package}}",
    buildFailed: "Build failed for {{package}}",
    testing: "Running tests for {{package}}...",
    testsPassed: "Tests passed for {{package}}",
    testsFailed: "Tests failed for {{package}}",
    snykTesting: "Running Snyk test for {{package}}...",
    snykTestPassed: "Snyk test passed for {{package}}",
    snykTestFailed: "Snyk test failed for {{package}}",
    snykMonitoring: "Running Snyk monitor for {{package}}...",
    snykMonitorPassed: "Snyk monitor completed for {{package}}",
    snykMonitorFailed: "Snyk monitor failed for {{package}}",
  },
  dependencies: {
    updating: "Updating dependencies for {{directory}}...",
    updated: "Dependencies updated for {{directory}}",
    failed: "Dependency update failed for {{directory}}: {{error}}",
    skipped: "Skipping dependency updates for {{directory}}",
    dedupeFailed:
      "Failed to deduplicate dependencies for {{directory}}: {{error}}",
  },
  security: {
    auditFailed: "Security audit failed for {{directory}}: {{error}}",
  },
  hooks: {
    running: "Running {{hook}} hook for {{package}}...",
    completed: "Hook {{hook}} completed for {{package}}",
    failed: "Hook {{hook}} failed for {{package}}: {{error}}",
    skipped: "Skipping {{hook}} hook (continueOnError)",
  },
  npm: {
    publishing: "Publishing {{package}} to npm...",
    published: "Successfully published {{package}}@{{version}} to npm",
    publishFailed: "Failed to publish {{package}} to npm: {{error}}",
    registry: "Using npm registry: {{registry}}",
    dryRun: "[DRY RUN] Would publish {{package}}@{{version}} to npm",
  },
  changelog: {
    generating: "Generating changelog for {{package}}...",
    generated: "Changelog generated for {{package}}",
    failed: "Failed to generate changelog for {{package}}: {{error}}",
    noChanges: "No changes to add to changelog for {{package}}",
  },
  branch: {
    checking: "Checking branch status...",
    notAllowed:
      "Releases from branch '{{branch}}' not allowed (main: {{main}})",
    isProtected: "Branch '{{branch}}' is protected",
  },
  gitRelease: {
    creating: "Creating GitHub release for {{tag}}...",
    created: "GitHub release created successfully: {{url}}",
    failed: "Failed to create GitHub release: {{error}}",
    ghNotFound: "GitHub CLI (gh) not found - skipping GitHub release",
    notGitHub: "GitHub release only supported for GitHub repositories",
  },
  validation: {
    branchNotAllowed: "Release from branch '{{branch}}' is not allowed",
    dirtyWorkingDir: "Working directory has uncommitted changes",
    passed: "All validations passed",
  },
  summary: {
    header: "Release Summary",
    successCount: "{{count}} packages released successfully",
    skipCount: "{{count}} packages skipped",
    failCount: "{{count}} packages failed",
  },
  jsr: {
    publishing: "Publishing {{package}} to JSR...",
    published: "Successfully published {{package}} to JSR",
    failed: "Failed to publish {{package}} to JSR: {{error}}",
  },
  gitlab: {
    creating: "Creating GitLab release for {{tag}}...",
    created: "GitLab release created successfully: {{url}}",
    failed: "Failed to create GitLab release: {{error}}",
    glabNotFound: "GitLab CLI (glab) not found - skipping GitLab release",
  },
  lockfile: {
    checking: "Checking lockfile integrity...",
    valid: "Lockfile is valid",
    invalid: "Lockfile integrity check failed: {{error}}",
    missing: "No lockfile found (expected: {{expected}})",
  },
  notifications: {
    sending: "Sending notification...",
    sent: "Notification sent successfully",
    failed: "Failed to send notification: {{error}}",
    disabled: "Notifications disabled",
  },
  retry: {
    attempt: "Retry attempt {{attempt}} of {{maxAttempts}} for {{operation}}",
    failed: "All retry attempts failed for {{operation}}",
    success: "Operation {{operation}} succeeded after retry",
  },
  rollback: {
    starting: "Starting rollback...",
    complete: "Rollback completed successfully",
    failed: "Rollback failed: {{error}}",
    git: "Rolling back git changes...",
    version: "Rolling back version changes...",
  },
  timings: {
    report: "Timing breakdown",
    validation: "Validation",
    install: "Install",
    clean: "Clean",
    lint: "Lint",
    typecheck: "Typecheck",
    build: "Build",
    test: "Test",
    publish: "Publish",
    changelog: "Changelog",
    gitOperations: "Git Operations",
  },
};
