/**
 * Unit tests for the pre-build deploy safety gate (`deploy-gate.ts`).
 */

import { describe, expect, it } from "bun:test";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

import { createEndpointLogger } from "../../logger/server";
import {
  buildGateChildEnv,
  checkedMarkerPath,
  type DeployGateDeps,
  decideDeployGateAction,
  evaluateVibeCheckResult,
  evaluateVibeGenResult,
  type GateCommandResult,
  gateDirtyMarkerPath,
  parsePorcelainPaths,
  runDeployGate,
  stripAnsi,
} from "./deploy-gate";
import { scopedTranslation } from "./i18n";

const TEST_SHA = "a".repeat(40);
const TEST_SHORT = TEST_SHA.slice(0, 10);
const { t } = scopedTranslation.scopedT("en-US");

function createStubLogger(): {
  logger: ReturnType<typeof createEndpointLogger>;
  warnings: string[];
  infos: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const infos: string[] = [];
  const errors: string[] = [];
  const base = createEndpointLogger(false, "en-US");
  const logger: ReturnType<typeof createEndpointLogger> = {
    ...base,
    warn: (message: string): void => {
      warnings.push(message);
    },
    info: (message: string): void => {
      infos.push(message);
    },
    error: (message: string): void => {
      errors.push(message);
    },
    debug: (): void => undefined,
  };
  return { logger, warnings, infos, errors };
}

function makeFakeDeps(options: {
  existingFiles?: Set<string>;
  commandHandler: (
    command: string,
    args: string[],
  ) => GateCommandResult | Promise<GateCommandResult>;
}): {
  deps: DeployGateDeps;
  calls: { command: string; args: string[]; cwd: string }[];
  written: Map<string, string>;
  symlinks: { target: string; path: string }[];
  renames: { oldPath: string; newPath: string }[];
} {
  const existing = options.existingFiles ?? new Set<string>();
  const calls: { command: string; args: string[]; cwd: string }[] = [];
  const written = new Map<string, string>();
  const symlinks: { target: string; path: string }[] = [];
  const renames: { oldPath: string; newPath: string }[] = [];

  const deps: DeployGateDeps = {
    runCommand: async (command, args, cmdOpts) => {
      calls.push({ command, args, cwd: cmdOpts.cwd });
      return await options.commandHandler(command, args);
    },
    exists: (path) => existing.has(path),
    lstatExists: (path) => existing.has(path),
    mkdir: () => undefined,
    writeFile: (path, content) => {
      existing.add(path);
      written.set(path, content);
    },
    copyFile: (_src, dest) => {
      existing.add(dest);
    },
    symlink: (target, path) => {
      existing.add(path);
      symlinks.push({ target, path });
    },
    rename: (oldPath, newPath) => {
      existing.delete(oldPath);
      existing.add(newPath);
      renames.push({ oldPath, newPath });
    },
    now: () => 1700000000000,
    isoNow: () => "2026-11-26T20:00:00.000Z",
    bunExecutable: "bun",
  };

  return { deps, calls, written, symlinks, renames };
}

describe("deploy-gate pure helpers", () => {
  it("strips ANSI color sequences and OSC-8 hyperlinks", () => {
    const esc = String.fromCharCode(27);
    const bel = String.fromCharCode(7);
    const colored = `${esc}[31m❌ TypeScript ${esc}]8;;vscode://file/a.ts${bel}FAILED TO RUN${esc}]8;;${bel}${esc}[0m`;
    expect(stripAnsi(colored)).toBe("❌ TypeScript FAILED TO RUN");
  });

  it("parses git status --porcelain paths without losing leading status spaces", () => {
    const status = [
      " M src/generated/endpoints/meta/en.ts",
      "?? src/generated/new-file.ts",
      " D src/generated/removed.ts",
      "R  src/generated/old.ts -> src/generated/renamed.ts",
      ' M "src/generated/with space.ts"',
      "",
    ].join("\n");
    expect(parsePorcelainPaths(status)).toEqual([
      "src/generated/endpoints/meta/en.ts",
      "src/generated/new-file.ts",
      "src/generated/removed.ts",
      "src/generated/renamed.ts",
      "src/generated/with space.ts",
    ]);
    expect(parsePorcelainPaths("")).toEqual([]);
  });

  it("decides between skipCheck, cached marker, and full run", () => {
    expect(
      decideDeployGateAction({
        skipCheck: "  emergency hotfix  ",
        hasCheckedMarker: false,
      }),
    ).toEqual({ action: "skip", reason: "emergency hotfix" });
    expect(
      decideDeployGateAction({
        skipCheck: "   ",
        hasCheckedMarker: true,
      }),
    ).toEqual({ action: "cached" });
    expect(
      decideDeployGateAction({
        skipCheck: undefined,
        hasCheckedMarker: false,
      }),
    ).toEqual({ action: "run" });
  });

  it("clears parent-process root and mode overrides in child env", () => {
    const env = buildGateChildEnv({
      PATH: "/usr/bin",
      HOME: "/home/max",
      PROJECT_ROOT: "/repo",
      VIBE_START_TIME: "123",
      IS_PREVIEW_MODE: "true",
      VIBE_BUILD_PLACEHOLDER_ENV: "true",
    });
    expect(env.PATH).toBe("/usr/bin");
    expect(env.HOME).toBe("/home/max");
    expect(env.PROJECT_ROOT).toBeUndefined();
    expect(env.VIBE_START_TIME).toBeUndefined();
    expect(env.IS_PREVIEW_MODE).toBeUndefined();
    expect(env.VIBE_BUILD_PLACEHOLDER_ENV).toBeUndefined();
  });
});

describe("evaluateVibeCheckResult", () => {
  it("passes when exit code is 0 and output confirms no issues", () => {
    expect(
      evaluateVibeCheckResult({
        exitCode: 0,
        signal: null,
        output: "✓ Oxlint 0 issues 1.2s\n✓ TypeScript 0 issues 4.3s\n✓ No issues found\n",
      }),
    ).toEqual({ ok: true });
  });

  it("passes when exit code is 0 with completed checkers and 0 errors", () => {
    expect(
      evaluateVibeCheckResult({
        exitCode: 0,
        signal: null,
        output: "✓ Oxlint 2 issues 1.2s\n✓ TypeScript 0 issues 4.3s\nSummary\nFiles: 1\nIssues: 2\n",
      }),
    ).toEqual({ ok: true });
  });

  it("fails as incomplete when output contains FAILED TO RUN even with exit code 0", () => {
    const esc = String.fromCharCode(27);
    const verdict = evaluateVibeCheckResult({
      exitCode: 0,
      signal: null,
      output: `❌ TypeScript ${esc}[31mFAILED TO RUN${esc}[0m - result unknown, NOT a pass`,
    });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("incomplete");
      expect(verdict.detail).toContain("FAILED TO RUN");
    }
  });

  it("fails as incomplete on OOM SIGKILL signal or exit code 137", () => {
    const sigkill = evaluateVibeCheckResult({
      exitCode: null,
      signal: "SIGKILL",
      output: "",
    });
    expect(sigkill.ok).toBe(false);
    if (!sigkill.ok) {
      expect(sigkill.kind).toBe("incomplete");
      expect(sigkill.detail).toContain("SIGKILL");
    }

    const code137 = evaluateVibeCheckResult({
      exitCode: 137,
      signal: null,
      output: "",
    });
    expect(code137.ok).toBe(false);
    if (!code137.ok) {
      expect(code137.kind).toBe("incomplete");
    }
  });

  it("fails as incomplete when oxlint reports no files found to lint", () => {
    const verdict = evaluateVibeCheckResult({
      exitCode: 0,
      signal: null,
      output: "No files found to lint.\n✓ No issues found\n",
    });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("incomplete");
    }
  });

  it("fails on non-zero exit code with errors", () => {
    const verdict = evaluateVibeCheckResult({
      exitCode: 1,
      signal: null,
      output: "❌ TypeScript 3 issues\nErrors: 3\n",
    });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("errors");
      expect(verdict.detail).toContain("3 error(s)");
    }
  });

  it("fails as incomplete when exit code is 0 with empty output", () => {
    const verdict = evaluateVibeCheckResult({
      exitCode: 0,
      signal: null,
      output: "",
    });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("incomplete");
    }
  });
});

describe("evaluateVibeGenResult", () => {
  it("passes when vibe gen succeeds and git status is clean", () => {
    expect(
      evaluateVibeGenResult(
        { exitCode: 0, signal: null, output: "✅ All generators completed\n" },
        "",
      ),
    ).toEqual({ ok: true });
  });

  it("fails as stale when vibe gen modifies or adds generated files", () => {
    const verdict = evaluateVibeGenResult(
      { exitCode: 0, signal: null, output: "✅ All generators completed\n" },
      " M src/generated/endpoints/meta/en.ts\n?? src/generated/new.ts\n",
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("stale");
      expect(verdict.staleFiles).toEqual([
        "src/generated/endpoints/meta/en.ts",
        "src/generated/new.ts",
      ]);
    }
  });

  it("fails when vibe gen exits non-zero", () => {
    const verdict = evaluateVibeGenResult(
      { exitCode: 1, signal: null, output: "Generators failed: endpoints\n" },
      "",
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("errors");
    }
  });
});

describe("runDeployGate orchestration", () => {
  const repoRoot = "/fake/repo";
  const buildRoot = "/fake/repo/.tmp/image-build";
  const contextDir = join(buildRoot, TEST_SHA);
  const runtimePath = join(
    contextDir,
    "src",
    "vibe",
    "platforms",
    "cli",
    "vibe-runtime.ts",
  );
  const baseExisting = (): Set<string> =>
    new Set([
      join(repoRoot, "node_modules"),
      runtimePath,
      join(contextDir, ".env.example"),
    ]);

  it("skips checks with --skipCheck=<reason>, logs the reason, and never writes .checked", async () => {
    const { logger, warnings } = createStubLogger();
    const { deps, calls, written } = makeFakeDeps({
      existingFiles: baseExisting(),
      commandHandler: () => ({ exitCode: 0, signal: null, output: "" }),
    });

    const result = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir,
        buildRoot,
        repoRoot,
        skipCheck: "urgent rollback hotfix",
      },
      logger,
      t,
      deps,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        status: "skipped",
        reason: "urgent rollback hotfix",
      });
    }
    expect(calls).toHaveLength(0);
    expect(warnings.some((line) => line.includes("urgent rollback hotfix"))).toBe(
      true,
    );
    expect(written.has(checkedMarkerPath(buildRoot, TEST_SHA))).toBe(false);
  });

  it("skips checks when <fullsha>.checked marker already exists", async () => {
    const { logger, infos } = createStubLogger();
    const existing = baseExisting();
    existing.add(checkedMarkerPath(buildRoot, TEST_SHA));
    const { deps, calls } = makeFakeDeps({
      existingFiles: existing,
      commandHandler: () => ({ exitCode: 0, signal: null, output: "" }),
    });

    const result = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir,
        buildRoot,
        repoRoot,
        skipCheck: undefined,
      },
      logger,
      t,
      deps,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ status: "cached" });
    }
    expect(calls).toHaveLength(0);
    expect(infos.some((line) => line.includes("already passed"))).toBe(true);
  });

  it("runs vibe gen + vibe check, restores export artifacts, and writes .checked on pass", async () => {
    const { logger } = createStubLogger();
    const existing = baseExisting();
    const { deps, calls, written, symlinks, renames } = makeFakeDeps({
      existingFiles: existing,
      commandHandler: (command, args) => {
        if (command === "git" && args[0] === "init") {
          existing.add(join(contextDir, ".git"));
          return { exitCode: 0, signal: null, output: "" };
        }
        if (command === "bun" && args[1] === "gen") {
          existing.add(join(contextDir, ".tmp"));
          return { exitCode: 0, signal: null, output: "✅ done\n" };
        }
        if (command === "bun" && args[1] === "check") {
          return {
            exitCode: 0,
            signal: null,
            output: "✓ Oxlint 0 issues\n✓ TypeScript 0 issues\n✓ No issues found\n",
          };
        }
        return { exitCode: 0, signal: null, output: "" };
      },
    });

    const result = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir,
        buildRoot,
        repoRoot,
        skipCheck: undefined,
      },
      logger,
      t,
      deps,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ status: "passed" });
    }
    expect(symlinks).toEqual([
      {
        target: join(repoRoot, "node_modules"),
        path: join(contextDir, "node_modules"),
      },
    ]);
    expect(
      calls.some((call) => call.command === "bun" && call.args[1] === "gen"),
    ).toBe(true);
    expect(
      calls.some((call) => call.command === "bun" && call.args[1] === "check"),
    ).toBe(true);
    expect(written.has(checkedMarkerPath(buildRoot, TEST_SHA))).toBe(true);
    // Gate artifacts and dirty marker were parked (never left in contextDir).
    expect(renames.some((r) => r.oldPath === join(contextDir, "node_modules"))).toBe(
      true,
    );
    expect(renames.some((r) => r.oldPath === join(contextDir, ".git"))).toBe(
      true,
    );
    expect(renames.some((r) => r.oldPath === join(contextDir, ".tmp"))).toBe(
      true,
    );
    expect(
      renames.some((r) => r.oldPath === gateDirtyMarkerPath(buildRoot, TEST_SHA)),
    ).toBe(true);
  });

  it("blocks deploy on stale generated output without running vibe check or writing .checked", async () => {
    const { logger } = createStubLogger();
    const existing = baseExisting();
    let statusCalls = 0;
    const { deps, calls, written } = makeFakeDeps({
      existingFiles: existing,
      commandHandler: (command, args) => {
        if (command === "git" && args[0] === "init") {
          existing.add(join(contextDir, ".git"));
          return { exitCode: 0, signal: null, output: "" };
        }
        if (command === "git" && args[0] === "status") {
          statusCalls += 1;
          return {
            exitCode: 0,
            signal: null,
            output:
              statusCalls === 1
                ? " M src/generated/routes/handlers-dev.ts\n"
                : "",
          };
        }
        return { exitCode: 0, signal: null, output: "" };
      },
    });

    const result = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir,
        buildRoot,
        repoRoot,
        skipCheck: undefined,
      },
      logger,
      t,
      deps,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("stale");
      expect(result.message).toContain("src/generated/routes/handlers-dev.ts");
    }
    expect(
      calls.some((call) => call.command === "bun" && call.args[1] === "check"),
    ).toBe(false);
    expect(written.has(checkedMarkerPath(buildRoot, TEST_SHA))).toBe(false);
  });

  it("blocks deploy when vibe check outputs FAILED TO RUN and never writes .checked", async () => {
    const { logger } = createStubLogger();
    const existing = baseExisting();
    const { deps, written } = makeFakeDeps({
      existingFiles: existing,
      commandHandler: (command, args) => {
        if (command === "git" && args[0] === "init") {
          existing.add(join(contextDir, ".git"));
          return { exitCode: 0, signal: null, output: "" };
        }
        if (command === "bun" && args[1] === "check") {
          return {
            exitCode: 1,
            signal: null,
            output:
              "✓ Oxlint 0 issues 1.0s\n❌ TypeScript FAILED TO RUN - result unknown, NOT a pass\n",
          };
        }
        return { exitCode: 0, signal: null, output: "" };
      },
    });

    const result = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir,
        buildRoot,
        repoRoot,
        skipCheck: undefined,
      },
      logger,
      t,
      deps,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("FAILED TO RUN");
    }
    expect(written.has(checkedMarkerPath(buildRoot, TEST_SHA))).toBe(false);
  });

  it("restores real exported files and cleans temporary artifacts on disk", async () => {
    const sandboxRoot = join(
      process.cwd(),
      ".tmp",
      "todelete",
      `deploy-gate-fs-test-${String(Date.now())}`,
    );
    const fakeRepoRoot = join(sandboxRoot, "repo");
    const fakeBuildRoot = join(fakeRepoRoot, ".tmp", "image-build");
    const fakeExportDir = join(fakeBuildRoot, TEST_SHA);
    const fakeRuntime = join(
      fakeExportDir,
      "src",
      "vibe",
      "platforms",
      "cli",
      "vibe-runtime.ts",
    );
    const generatedFile = join(fakeExportDir, "src", "generated", "sample.ts");

    mkdirSync(join(fakeRepoRoot, "node_modules"), { recursive: true });
    mkdirSync(join(fakeExportDir, "src", "vibe", "platforms", "cli"), {
      recursive: true,
    });
    mkdirSync(join(fakeExportDir, "src", "generated"), { recursive: true });
    writeFileSync(join(fakeExportDir, ".gitignore"), "node_modules\n/.tmp\n/.env\n");
    writeFileSync(join(fakeExportDir, ".env.example"), "FOO=bar\n");
    writeFileSync(fakeRuntime, "// stub runtime\n");
    writeFileSync(generatedFile, "export const v = 1;\n");

    const { logger } = createStubLogger();

    // Simulate vibe gen mutating a tracked file and creating an untracked file.
    const staleResult = await runDeployGate(
      {
        sha: TEST_SHA,
        shortSha: TEST_SHORT,
        contextDir: fakeExportDir,
        buildRoot: fakeBuildRoot,
        repoRoot: fakeRepoRoot,
        skipCheck: undefined,
      },
      logger,
      t,
      {
        runCommand: async (command, args, opts) => {
          if (command === "bun" && args[1] === "gen") {
            writeFileSync(generatedFile, "export const v = 2;\n");
            writeFileSync(
              join(fakeExportDir, "src", "generated", "extra.ts"),
              "export const extra = true;\n",
            );
            return { exitCode: 0, signal: null, output: "✅ gen ran\n" };
          }
          // Let real `git` commands execute on the sandbox export.
          const proc = Bun.spawn([command, ...args], {
            cwd: opts.cwd,
            stdout: "pipe",
            stderr: "pipe",
          });
          const [stdout, stderr, exitCode] = await Promise.all([
            new Response(proc.stdout).text(),
            new Response(proc.stderr).text(),
            proc.exited,
          ]);
          return { exitCode, signal: null, output: `${stdout}${stderr}` };
        },
        bunExecutable: "bun",
      },
    );

    expect(staleResult.success).toBe(false);
    // Export dir was restored to exact original content with no gate leftovers.
    expect(readFileSync(generatedFile, "utf-8")).toBe("export const v = 1;\n");
    expect(existsSync(join(fakeExportDir, "src", "generated", "extra.ts"))).toBe(
      false,
    );
    expect(existsSync(join(fakeExportDir, ".git"))).toBe(false);
    expect(existsSync(join(fakeExportDir, ".env"))).toBe(false);
    expect(existsSync(join(fakeExportDir, ".tmp"))).toBe(false);
    expect(() => lstatSync(join(fakeExportDir, "node_modules"))).toThrow();
    expect(existsSync(gateDirtyMarkerPath(fakeBuildRoot, TEST_SHA))).toBe(false);
    expect(existsSync(checkedMarkerPath(fakeBuildRoot, TEST_SHA))).toBe(false);
  });
});
