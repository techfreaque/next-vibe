import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { mkdirSync, mkdtempSync, renameSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { SystemSettingsRepository } from "../settings/repository";
import { InstallerAction, InstallerStepStatus } from "./enum";
import { scopedTranslation } from "./i18n";
import {
  InstallerRepository,
  isUpstreamNextVibeRemote,
  readPersistedState,
  resolveInstallerStatePath,
  writePersistedState,
} from "./repository";

const createdDirs: string[] = [];

function makeDiskTempDir(prefix: string): string {
  const base = path.join(os.homedir(), ".cache", "next-vibe-installer-unit");
  mkdirSync(base, { recursive: true });
  const dir = mkdtempSync(path.join(base, prefix));
  createdDirs.push(dir);
  return dir;
}

afterEach(() => {
  delete process.env["VIBE_INSTALLER_STATE_FILE"];
  const trashBase = path.join(
    process.cwd(),
    ".tmp",
    "todelete",
    "installer-unit",
  );
  mkdirSync(trashBase, { recursive: true });
  while (createdDirs.length > 0) {
    const dir = createdDirs.pop();
    if (!dir) {
      continue;
    }
    try {
      renameSync(dir, path.join(trashBase, `${path.basename(dir)}-${Date.now()}`));
    } catch {
      // Already cleaned up
    }
  }
});

describe("InstallerRepository helpers", () => {
  it("recognizes upstream next-vibe remotes in HTTPS and SSH forms", () => {
    expect(
      isUpstreamNextVibeRemote("https://github.com/techfreaque/next-vibe.git"),
    ).toBe(true);
    expect(
      isUpstreamNextVibeRemote("https://github.com/techfreaque/next-vibe"),
    ).toBe(true);
    expect(
      isUpstreamNextVibeRemote("git@github.com:techfreaque/next-vibe.git"),
    ).toBe(true);
    expect(
      isUpstreamNextVibeRemote("https://github.com/alice/my-next-vibe.git"),
    ).toBe(false);
    expect(isUpstreamNextVibeRemote("")).toBe(false);
  });

  it("writes and reads resumable installer state atomically", () => {
    const dir = makeDiskTempDir("state-");
    const statePath = path.join(dir, ".tmp", "installer-state.json");
    writePersistedState(statePath, {
      version: 1,
      os: "linux",
      arch: "x86_64",
      installDir: dir,
      checkoutMode: "cloned",
      port: 3099,
      github: {
        status: "skipped",
        repoUrl: "",
        skipped: true,
      },
      lastError: "",
    });

    const loaded = readPersistedState(statePath, dir);
    expect(loaded).not.toBeNull();
    expect(loaded?.checkoutMode).toBe("cloned");
    expect(loaded?.port).toBe(3099);
    expect(loaded?.github?.skipped).toBe(true);
  });

  it("honors VIBE_INSTALLER_STATE_FILE override", () => {
    const dir = makeDiskTempDir("env-");
    const customPath = path.join(dir, "custom-state.json");
    process.env["VIBE_INSTALLER_STATE_FILE"] = customPath;
    expect(resolveInstallerStatePath(dir)).toBe(customPath);
  });
});

describe("InstallerRepository status and actions", () => {
  beforeEach(() => {
    spyOn(SystemSettingsRepository, "isDevMode").mockReturnValue(true);
  });
  afterEach(() => {
    mock.restore();
  });

  it("probes live local status and persists skip/reset idempotently", async () => {
    const dir = makeDiskTempDir("live-");
    const statePath = path.join(dir, "installer-state.json");
    process.env["VIBE_INSTALLER_STATE_FILE"] = statePath;

    const logger = createEndpointLogger(false, defaultLocale);
    const { t } = scopedTranslation.scopedT(defaultLocale);

    const statusRes = await InstallerRepository.getStatus(logger, t);
    expect(statusRes.success).toBe(true);
    if (!statusRes.success) {
      return;
    }

    const stepIds = statusRes.data.steps.map((s) => s.id);
    expect(stepIds).toEqual([
      "git",
      "bun",
      "clone",
      "dependencies",
      "github",
      "server",
    ]);
    const gitStep = statusRes.data.steps.find((s) => s.id === "git");
    const bunStep = statusRes.data.steps.find((s) => s.id === "bun");
    expect(gitStep?.status).toBe(InstallerStepStatus.DONE);
    expect(bunStep?.status).toBe(InstallerStepStatus.DONE);

    const skipRes = await InstallerRepository.runAction(
      { action: InstallerAction.GITHUB_SKIP },
      logger,
      t,
    );
    expect(skipRes.success).toBe(true);
    if (!skipRes.success) {
      return;
    }
    expect(skipRes.data.github.skipped).toBe(true);
    const githubAfterSkip = skipRes.data.steps.find((s) => s.id === "github");
    expect(githubAfterSkip?.status).toBe(InstallerStepStatus.SKIPPED);

    const resetRes = await InstallerRepository.runAction(
      { action: InstallerAction.GITHUB_RESET },
      logger,
      t,
    );
    expect(resetRes.success).toBe(true);
    if (!resetRes.success) {
      return;
    }
    expect(resetRes.data.github.skipped).toBe(false);
  });

  it("rejects invalid repository names before running gh", async () => {
    const logger = createEndpointLogger(false, defaultLocale);
    const { t } = scopedTranslation.scopedT(defaultLocale);

    const badRes = await InstallerRepository.runAction(
      {
        action: InstallerAction.GITHUB_CREATE_PRIVATE_REPO,
        repoName: "bad repo; rm -rf /",
      },
      logger,
      t,
    );
    expect(badRes.success).toBe(false);
  });
});
