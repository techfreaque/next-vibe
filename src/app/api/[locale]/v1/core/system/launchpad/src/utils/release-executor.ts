import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import inquirer from "inquirer";

import type {
  ReleaseOrchestrationOptions,
  ReleaseState,
  ReleaseTarget,
  VersionBumpType,
} from "../types/types.js";
import { logger, loggerError } from "./logger.js";
import { StateManager } from "./state-manager.js";

export class ReleaseExecutor {
  private rootDir: string;
  private stateManager: StateManager;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.stateManager = new StateManager(rootDir);
  }

  /**
   * Execute release for a single target
   */
  async executeReleaseTarget(
    target: ReleaseTarget,
    options: ReleaseOrchestrationOptions,
  ): Promise<boolean> {
    const fullPath = join(this.rootDir, target.directory);
    logger(`\n🚀 Processing: ${target.directory}`);

    try {
      // Build the release command
      const command = this.buildReleaseCommand(target, options);
      logger(`Executing: ${command}`);

      // Execute the release command
      execSync(command, {
        cwd: fullPath,
        stdio: "inherit",
        // eslint-disable-next-line node/no-process-env
        env: process.env,
      });

      logger(`✅ Successfully completed: ${target.directory}`);
      return true;
    } catch (error) {
      loggerError(`❌ Failed to process ${target.directory}:`, error);
      return false;
    }
  }

  /**
   * Build the appropriate release command based on options
   */
  private buildReleaseCommand(
    target: ReleaseTarget,
    options: ReleaseOrchestrationOptions,
  ): string {
    const baseCommand = "bun pub release";
    const flags: string[] = [];

    if (options.ciMode) {
      flags.push("--ci");
    }

    // Add config path if not default
    if (target.configPath !== join(target.directory, "release.config.ts")) {
      flags.push(`--config ${target.configPath}`);
    }

    return `${baseCommand} ${flags.join(" ")}`.trim();
  }

  /**
   * Execute release orchestration for multiple targets
   */
  async executeReleaseOrchestration(
    targets: ReleaseTarget[],
    options: ReleaseOrchestrationOptions,
  ): Promise<void> {
    let state: ReleaseState;

    // Load or initialize state
    if (options.continueFromState) {
      const existingState = this.stateManager.loadState();
      if (existingState) {
        state = existingState;
        logger("Continuing from previous state...");
        logger(this.stateManager.getStateSummary(state));
      } else {
        logger("No existing state found, starting fresh...");
        state = this.stateManager.initializeState(targets);
      }
    } else {
      // Clear any existing state and start fresh
      this.stateManager.clearState();
      state = this.stateManager.initializeState(targets);
    }

    // Get targets to process
    const remainingTargets = this.stateManager.getRemainingTargets(state);
    const failedTargets = this.stateManager.getFailedTargets(state);

    if (remainingTargets.length === 0 && failedTargets.length === 0) {
      logger("All targets have been processed successfully!");
      this.stateManager.clearState();
      return;
    }

    // Handle retry logic
    if (failedTargets.length > 0 && options.allowRetry) {
      const { retryFailed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "retryFailed",
          message: `Retry ${failedTargets.length} failed targets?`,
          default: true,
        },
      ]);

      if (retryFailed) {
        this.stateManager.resetFailedTargets(state);
      }
    }

    // Process targets
    const targetsToProcess = this.stateManager.getRemainingTargets(state);

    for (let i = 0; i < targetsToProcess.length; i++) {
      const target = targetsToProcess[i];
      this.stateManager.updateCurrentIndex(state, i);

      logger(
        `\n📦 Processing ${i + 1}/${targetsToProcess.length}: ${target.directory}`,
      );

      // Handle skip option
      if (options.allowSkip && !options.ciMode) {
        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: `What would you like to do with ${target.directory}?`,
            choices: [
              { name: "Process this target", value: "process" },
              { name: "Skip this target", value: "skip" },
              { name: "Abort entire operation", value: "abort" },
            ],
          },
        ]);

        if (action === "skip") {
          this.stateManager.markSkipped(state, target.directory);
          logger(`⏭️  Skipped: ${target.directory}`);
          continue;
        }

        if (action === "abort") {
          logger("Operation aborted by user");
          return;
        }
      }

      // Execute the release
      const success = await this.executeReleaseTarget(target, options);

      if (success) {
        this.stateManager.markCompleted(state, target.directory);
      } else {
        this.stateManager.markFailed(state, target.directory);

        if (!options.ciMode) {
          const { continueAfterFailure } = await inquirer.prompt([
            {
              type: "confirm",
              name: "continueAfterFailure",
              message: "Continue with remaining targets?",
              default: true,
            },
          ]);

          if (!continueAfterFailure) {
            logger("Operation stopped due to failure");
            return;
          }
        } else {
          // In CI mode, continue processing other targets
          logger("Continuing with remaining targets...");
        }
      }
    }

    // Final summary
    const finalState = this.stateManager.loadState();
    if (finalState) {
      logger("\n📊 Final Summary:");
      logger(this.stateManager.getStateSummary(finalState));

      if (finalState.failed.length === 0) {
        logger("🎉 All targets processed successfully!");
        this.stateManager.clearState();
      } else {
        logger(
          `⚠️  ${finalState.failed.length} targets failed. Use --continue to retry.`,
        );
      }
    }
  }

  /**
   * Execute force update for all targets
   */
  async executeForceUpdateAll(targets: ReleaseTarget[]): Promise<void> {
    logger("🔄 Force updating dependencies for all targets...");

    for (const target of targets) {
      const fullPath = join(this.rootDir, target.directory);
      logger(`\n📦 Updating: ${target.directory}`);

      try {
        // Use release tool with force update
        execSync("bun pub release --force-update", {
          cwd: fullPath,
          stdio: "inherit",
          env: process.env,
        });

        logger(`✅ Updated: ${target.directory}`);
      } catch (error) {
        loggerError(`❌ Failed to update ${target.directory}:`, error);
        // Continue with other targets
      }
    }

    logger("🎉 Force update completed for all targets!");
  }

  /**
   * Execute force release with version bump
   */
  async executeForceRelease(
    targets: ReleaseTarget[],
    versionBump: VersionBumpType,
  ): Promise<void> {
    logger(
      `🚀 Force releasing all targets with ${versionBump} version bump...`,
    );

    const options: ReleaseOrchestrationOptions = {
      forceRelease: true,
      versionBump,
      allowSkip: false,
      allowRetry: false,
    };

    // Execute orchestration without prompts
    await this.executeReleaseOrchestration(targets, options);
  }

  /**
   * Execute weekly update - updates all packages, creates branch, runs Snyk, creates PR
   */
  async executeWeeklyUpdate(branchName: string): Promise<void> {
    logger(`📅 Starting weekly update process...`);
    logger(`Target branch: ${branchName}`);

    try {
      // 1. Create and switch to update branch
      logger("🌿 Creating update branch...");
      execSync(`git checkout -b ${branchName} || git checkout ${branchName}`, {
        cwd: this.rootDir,
        stdio: "inherit",
      });

      // 2. Force update all packages
      logger("🔄 Updating all package dependencies...");
      const targets = this.discoverTargets();
      await this.executeForceUpdateAll(targets);

      // 3. Run Snyk monitoring for all packages
      logger("🔍 Running Snyk security monitoring...");
      await this.runSnykMonitoring(branchName);

      // 4. Check for changes
      const hasChanges = this.checkForGitChanges();

      if (!hasChanges) {
        logger("📝 No changes detected, skipping commit and PR creation");
        return;
      }

      // 5. Commit changes
      logger("💾 Committing changes...");
      this.commitWeeklyUpdate();

      // 6. Push branch
      logger("📤 Pushing branch...");
      execSync(`git push origin ${branchName}`, {
        cwd: this.rootDir,
        stdio: "inherit",
      });

      // 7. Create or update PR
      logger("📝 Creating/updating pull request...");
      await this.createOrUpdatePR(branchName);

      logger("🎉 Weekly update completed successfully!");
    } catch (error) {
      loggerError("❌ Weekly update failed:", error);
      throw error;
    }
  }

  private discoverTargets(): ReleaseTarget[] {
    // Import here to avoid circular dependency
    const { discoverReleaseTargets } = require("./release-discovery.js");
    return discoverReleaseTargets(this.rootDir) as ReleaseTarget[];
  }

  private async runSnykMonitoring(branchName: string): Promise<void> {
    const snykToken = process.env.SNYK_TOKEN;
    const snykOrgKey = process.env.SNYK_ORG_KEY;

    if (!snykToken || !snykOrgKey) {
      logger("⚠️  Snyk credentials not found, skipping security monitoring");
      return;
    }

    // Find all package.json files
    const packageFiles = execSync(
      'find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.git/*"',
      { cwd: this.rootDir, encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const packageFile of packageFiles) {
      const packageDir = join(this.rootDir, dirname(packageFile));

      try {
        // Get package name
        const packageJson = JSON.parse(
          readFileSync(join(packageDir, "package.json"), "utf8"),
        );
        const packageName = packageJson.name || "unknown";

        logger(`🔍 Monitoring ${packageName}...`);

        // Run snyk monitor with branch prefix
        execSync(
          `snyk monitor --org=${snykOrgKey} --project-name="${branchName}/${packageName}" --target-reference=${branchName}`,
          {
            cwd: packageDir,
            stdio: "inherit",
            env: { ...process.env, SNYK_TOKEN: snykToken },
          },
        );
      } catch (error) {
        logger(`⚠️  Snyk monitoring failed for ${packageFile}, continuing...`);
      }
    }
  }

  private checkForGitChanges(): boolean {
    try {
      execSync("git diff --quiet && git diff --cached --quiet", {
        cwd: this.rootDir,
        stdio: "pipe",
      });
      return false; // No changes
    } catch {
      return true; // Has changes
    }
  }

  private commitWeeklyUpdate(): void {
    const timestamp = new Date().toISOString();
    const commitMessage = `chore: weekly dependency updates

- Updated dependencies across all packages
- Snyk monitoring enabled for next_version_candidates branch
- Automated update on ${timestamp}

This is an automated update. Please review changes before merging.`;

    execSync("git add .", { cwd: this.rootDir, stdio: "inherit" });
    execSync(`git commit -m "${commitMessage}"`, {
      cwd: this.rootDir,
      stdio: "inherit",
    });
  }

  private async createOrUpdatePR(branchName: string): Promise<void> {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      logger("⚠️  GITHUB_TOKEN not found, skipping PR creation");
      return;
    }

    // Use GitHub CLI if available, otherwise skip
    try {
      const title = "🔄 Weekly Dependency Updates";
      const body = `## Weekly Dependency Updates

This PR contains automated dependency updates for all packages in the monorepo.

### What's included:
- ⬆️ Updated dependencies across all packages
- 🔍 Snyk security monitoring enabled
- 📊 Security reports available in Snyk dashboard

### Security Monitoring:
All packages have been monitored with Snyk using the \`${branchName}\` prefix.
Check the [Snyk dashboard](https://app.snyk.io) for security vulnerabilities before merging.

### Review Checklist:
- [ ] Check Snyk dashboard for new vulnerabilities
- [ ] Review major version updates
- [ ] Test critical functionality
- [ ] Verify CI passes

---
*This PR was automatically created by the weekly dependency update workflow.*
*Generated on: ${new Date().toISOString()}*`;

      // Try to create PR using GitHub API via curl
      const repoInfo = this.getRepoInfo();
      if (repoInfo) {
        await this.createPRWithAPI(
          repoInfo,
          branchName,
          title,
          body,
          githubToken,
        );
      }
    } catch (error) {
      logger("⚠️  PR creation failed, continuing...");
      loggerError("PR creation error:", error);
    }
  }

  private getRepoInfo(): { owner: string; repo: string } | null {
    try {
      const remoteUrl = execSync("git remote get-url origin", {
        cwd: this.rootDir,
        encoding: "utf8",
      }).trim();

      // Parse GitHub URL
      const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    } catch {
      // Ignore errors
    }
    return null;
  }

  private async createPRWithAPI(
    repoInfo: { owner: string; repo: string },
    branchName: string,
    title: string,
    body: string,
    token: string,
  ): Promise<void> {
    const { spawn } = require("child_process");

    const curlArgs = [
      "-X",
      "POST",
      "-H",
      `Authorization: token ${token}`,
      "-H",
      "Accept: application/vnd.github.v3+json",
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/pulls`,
      "-d",
      JSON.stringify({
        title,
        head: branchName,
        base: "main",
        body,
      }),
    ];

    return await new Promise<void>((resolve, reject) => {
      const curl = spawn("curl", curlArgs, { stdio: "pipe" });

      curl.on("close", (code: number | null) => {
        if (code === 0) {
          logger("✅ PR created/updated successfully");
          resolve();
        } else {
          reject(new Error(`curl exited with code ${code}`));
        }
      });

      curl.on("error", reject);
    });
  }
}
