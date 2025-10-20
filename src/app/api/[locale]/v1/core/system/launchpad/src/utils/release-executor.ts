import { execSync, spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import inquirer from "inquirer";

import { simpleT } from "@/i18n/core/shared";

import type {
  ReleaseOrchestrationOptions,
  ReleaseState,
  ReleaseTarget,
  VersionBumpType,
} from "../types/types.js";
import { logger, loggerError } from "./logger.js";
import { discoverReleaseTargets } from "./release-discovery.js";
import { StateManager } from "./state-manager.js";

const { t } = simpleT("en-GLOBAL");

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
    logger(
      t("app.api.v1.core.system.launchpad.releaseExecutor.processing", {
        directory: target.directory,
      }),
    );

    try {
      // Build the release command
      const command = this.buildReleaseCommand(target, options);
      logger(
        t("app.api.v1.core.system.launchpad.releaseExecutor.executing", {
          command,
        }),
      );

      // Execute the release command
      execSync(command, {
        cwd: fullPath,
        stdio: "inherit",
        env: { ...process.env },
      });

      logger(
        t("app.api.v1.core.system.launchpad.releaseExecutor.completed", {
          directory: target.directory,
        }),
      );
      return true;
    } catch (error) {
      loggerError(
        t("app.api.v1.core.system.launchpad.releaseExecutor.failed", {
          directory: target.directory,
        }),
        error,
      );
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
    const baseCommand = t(
      "app.api.v1.core.system.launchpad.releaseExecutor.baseCommand",
    );
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
        logger(
          t(
            "app.api.v1.core.system.launchpad.releaseExecutor.state.continuing",
          ),
        );
        logger(this.stateManager.getStateSummary(state));
      } else {
        logger(
          t("app.api.v1.core.system.launchpad.releaseExecutor.state.noState"),
        );
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
      logger(
        t(
          "app.api.v1.core.system.launchpad.releaseExecutor.state.allCompleted",
        ),
      );
      this.stateManager.clearState();
      return;
    }

    // Handle retry logic
    if (failedTargets.length > 0 && options.allowRetry) {
      const { retryFailed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "retryFailed",
          message: t(
            "app.api.v1.core.system.launchpad.releaseExecutor.prompts.retryFailed",
            { count: failedTargets.length },
          ),
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
            message: t(
              "app.api.v1.core.system.launchpad.releaseExecutor.prompts.targetAction",
              { directory: target.directory },
            ),
            choices: [
              {
                name: t(
                  "app.api.v1.core.system.launchpad.releaseExecutor.prompts.processTarget",
                ),
                value: "process",
              },
              {
                name: t(
                  "app.api.v1.core.system.launchpad.releaseExecutor.prompts.skipTarget",
                ),
                value: "skip",
              },
              {
                name: t(
                  "app.api.v1.core.system.launchpad.releaseExecutor.prompts.abortOperation",
                ),
                value: "abort",
              },
            ],
          },
        ]);

        if (action === "skip") {
          this.stateManager.markSkipped(state, target.directory);
          logger(
            t(
              "app.api.v1.core.system.launchpad.releaseExecutor.actions.skipped",
              {
                directory: target.directory,
              },
            ),
          );
          continue;
        }

        if (action === "abort") {
          logger(
            t(
              "app.api.v1.core.system.launchpad.releaseExecutor.actions.aborted",
            ),
          );
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
              message: t(
                "app.api.v1.core.system.launchpad.releaseExecutor.prompts.continueAfterFailure",
              ),
              default: true,
            },
          ]);

          if (!continueAfterFailure) {
            logger(
              t(
                "app.api.v1.core.system.launchpad.releaseExecutor.actions.stopped",
              ),
            );
            return;
          }
        } else {
          // In CI mode, continue processing other targets
          logger(
            t(
              "app.api.v1.core.system.launchpad.releaseExecutor.actions.continuing",
            ),
          );
        }
      }
    }

    // Final summary
    const finalState = this.stateManager.loadState();
    if (finalState) {
      logger(
        `\n📊 ${t("app.api.v1.core.system.launchpad.releaseExecutor.summary.title")}`,
      );
      logger(this.stateManager.getStateSummary(finalState));

      if (finalState.failed.length === 0) {
        logger(
          t(
            "app.api.v1.core.system.launchpad.releaseExecutor.summary.allSuccess",
          ),
        );
        this.stateManager.clearState();
      } else {
        logger(
          t(
            "app.api.v1.core.system.launchpad.releaseExecutor.summary.failedTargets",
            { count: finalState.failed.length },
          ),
        );
      }
    }
  }

  /**
   * Execute force update for all targets
   */
  async executeForceUpdateAll(targets: ReleaseTarget[]): Promise<void> {
    logger(
      `🔄 ${t("app.api.v1.core.system.launchpad.releaseExecutor.forceUpdate.starting")}`,
    );

    for (const target of targets) {
      const fullPath = join(this.rootDir, target.directory);
      logger(
        `\n📦 ${t("app.api.v1.core.system.launchpad.releaseExecutor.forceUpdate.updating", { directory: target.directory })}`,
      );

      try {
        // Use release tool with force update
        execSync(
          t(
            "app.api.v1.core.system.launchpad.releaseExecutor.forceUpdateCommand",
          ),
          {
            cwd: fullPath,
            stdio: "inherit",
            env: { ...process.env },
          },
        );

        logger(
          `✅ ${t("app.api.v1.core.system.launchpad.releaseExecutor.forceUpdate.updated", { directory: target.directory })}`,
        );
      } catch (error) {
        loggerError(
          `❌ ${t("app.api.v1.core.system.launchpad.releaseExecutor.forceUpdate.failed", { directory: target.directory })}:`,
          error,
        );
        // Continue with other targets
      }
    }

    logger(
      t(
        "app.api.v1.core.system.launchpad.releaseExecutor.forceUpdate.completed",
      ),
    );
  }

  /**
   * Execute force release with version bump
   */
  async executeForceRelease(
    targets: ReleaseTarget[],
    versionBump: VersionBumpType,
  ): Promise<void> {
    logger(
      t(
        "app.api.v1.core.system.launchpad.releaseExecutor.forceRelease.starting",
        { versionBump },
      ),
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
    logger(
      `📅 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.starting")}`,
    );
    logger(
      t(
        "app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.targetBranch",
        { branchName },
      ),
    );

    try {
      // 1. Create and switch to update branch
      logger(
        `🌿 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.creatingBranch")}`,
      );
      execSync(
        t(
          "app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.gitCheckout",
          { branchName },
        ),
        {
          cwd: this.rootDir,
          stdio: "inherit",
        },
      );

      // 2. Force update all packages
      logger(
        `🔄 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.updatingPackages")}`,
      );
      const targets = this.discoverTargets();
      await this.executeForceUpdateAll(targets);

      // 3. Run Snyk monitoring for all packages
      logger(
        `🔍 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.runningSnyk")}`,
      );
      await this.runSnykMonitoring(branchName);

      // 4. Check for changes
      const hasChanges = this.checkForGitChanges();

      if (!hasChanges) {
        logger(
          `📝 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.noChanges")}`,
        );
        return;
      }

      // 5. Commit changes
      logger(
        `💾 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.committing")}`,
      );
      this.commitWeeklyUpdate();

      // 6. Push branch
      logger(
        `📤 ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.pushing")}`,
      );
      execSync(
        t(
          "app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.gitPush",
          {
            branchName,
          },
        ),
        {
          cwd: this.rootDir,
          stdio: "inherit",
        },
      );

      // 7. Create or update PR
      logger(
        t(
          "app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.creatingPR",
        ),
      );
      await this.createOrUpdatePR(branchName);

      logger(
        t(
          "app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.completed",
        ),
      );
    } catch (error) {
      loggerError(
        `❌ ${t("app.api.v1.core.system.launchpad.releaseExecutor.weeklyUpdate.failed")}:`,
        error,
      );
      throw error;
    }
  }

  private discoverTargets(): ReleaseTarget[] {
    return discoverReleaseTargets(this.rootDir);
  }

  private async runSnykMonitoring(branchName: string): Promise<void> {
    const snykToken = process.env.SNYK_TOKEN;
    const snykOrgKey = process.env.SNYK_ORG_KEY;

    if (!snykToken || !snykOrgKey) {
      logger(
        `⚠️  ${t("app.api.v1.core.system.launchpad.releaseExecutor.snyk.noCredentials")}`,
      );
      return;
    }

    // Find all package.json files
    const packageFiles = execSync(
      t("app.api.v1.core.system.launchpad.releaseExecutor.git.findCommand"),
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
        ) as { name?: string };
        const packageName = packageJson.name || "unknown";

        logger(
          `🔍 ${t("app.api.v1.core.system.launchpad.releaseExecutor.snyk.monitoring", { packageName })}`,
        );

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
        logger(
          `⚠️  ${t("app.api.v1.core.system.launchpad.releaseExecutor.snyk.failed", { packageFile })}`,
        );
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
      logger(
        `⚠️  ${t("app.api.v1.core.system.launchpad.releaseExecutor.github.noToken")}`,
      );
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
      logger(
        `⚠️  ${t("app.api.v1.core.system.launchpad.releaseExecutor.github.prFailed")}`,
      );
      loggerError(
        t("app.api.v1.core.system.launchpad.releaseExecutor.github.prError"),
        error,
      );
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
          logger(
            `✅ ${t("app.api.v1.core.system.launchpad.releaseExecutor.github.prSuccess")}`,
          );
          resolve();
        } else {
          reject(new Error(`curl exited with code ${code}`));
        }
      });

      curl.on("error", reject);
    });
  }
}
