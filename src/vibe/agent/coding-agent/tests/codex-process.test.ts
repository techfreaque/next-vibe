import assert from "node:assert/strict";
import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  realpathSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { delimiter, dirname, join, parse } from "node:path";
import { after, describe, it } from "node:test";

import {
  codexEnvironment,
  resolveCodexBinary,
  spawnCodexAppServer,
} from "../providers/codex/process";
import { AgentError } from "../types";
import { removeTestDirs, testDir } from "./test-paths.fixture";

const WIN = process.platform === "win32";
const NAME = WIN ? "codex.cmd" : "codex";

after(removeTestDirs);

function expectError(
  value: string | AgentError | Record<string, string | undefined>,
  pattern: RegExp,
): void {
  assert.ok(value instanceof AgentError);
  assert.match(value.message, pattern);
}

function binary(dir: string, name = NAME, body = ""): string {
  const file = join(dir, name);
  writeFileSync(file, body);
  chmodSync(file, 0o755);
  return realpathSync(file);
}

describe("resolving the Codex binary", () => {
  it("ignores empty and relative PATH entries, which resolve against the project CWD", () => {
    const install = testDir("codex-install-");
    const project = testDir("codex-project-");
    mkdirSync(join(project, "shadowbin"));
    binary(join(project, "shadowbin"));
    binary(project);
    const installed = binary(install);
    const env = {
      PATH: ["", ".", "shadowbin", install].join(delimiter),
      PATHEXT: ".cmd;.exe",
    };
    const original = process.cwd();
    process.chdir(project);
    try {
      for (const entry of ["", ".", "shadowbin"]) {
        expectError(
          resolveCodexBinary({ ...env, PATH: entry }),
          /not found on an absolute local PATH entry/,
        );
      }
      assert.equal(resolveCodexBinary(env), installed);
    } finally {
      process.chdir(original);
    }
  });

  it("follows absolute PATH entries in order, as the caller configured them", () => {
    const first = testDir("codex-first-");
    const second = testDir("codex-second-");
    const links = testDir("codex-links-");
    const linked = join(links, "first");
    symlinkSync(first, linked, WIN ? "junction" : "dir");
    const expected = binary(first);
    binary(second);
    assert.equal(
      resolveCodexBinary({ PATH: [linked, second].join(delimiter) }),
      expected,
    );
  });

  it("skips missing/non-executable candidates and fails clearly without an installation", () => {
    const empty = testDir("codex-empty-");
    mkdirSync(join(empty, NAME));
    expectError(
      resolveCodexBinary({ PATH: empty, PATHEXT: ".CMD" }),
      /not found on an absolute local PATH entry/,
    );
    if (!WIN) {
      const file = binary(testDir("codex-noexec-"));
      chmodSync(file, 0o644);
      expectError(
        resolveCodexBinary({ PCV_CODEX_BIN: file }),
        /existing executable/,
      );
    }
  });

  it("validates the explicit override", () => {
    for (const value of ["codex", ".", "codex app-server"]) {
      expectError(
        resolveCodexBinary({ PCV_CODEX_BIN: value }),
        /absolute local installation path/,
      );
    }
    const dir = testDir("codex-bin-");
    const file = binary(dir);
    assert.equal(resolveCodexBinary({ PCV_CODEX_BIN: file }), file);
    expectError(
      resolveCodexBinary({ PCV_CODEX_BIN: join(dir, "absent") }),
      /existing executable/,
    );
  });

  it(
    "uses case-insensitive Windows keys and only safe PATHEXT entries",
    { skip: !WIN },
    () => {
      const install = testDir("codex-install-");
      binary(install, "codex.ps1");
      binary(install, "codex.exe.cmd");
      const installed = binary(install);
      assert.equal(
        resolveCodexBinary({
          pAtH: `"${install}"`,
          pAtHeXt: ".PS1;.exe.cmd;.cMd",
        }),
        installed,
      );
      assert.equal(
        resolveCodexBinary({ pcv_codex_bin: installed }),
        installed,
      );
      expectError(
        resolveCodexBinary({ PATH: install, PATHEXT: ".PS1;.exe.cmd" }),
        /not found/,
      );
    },
  );

  it(
    "rejects Windows drive-relative, rooted, UNC and device paths",
    { skip: !WIN },
    () => {
      for (const path of [
        "C:codex.cmd",
        "\\codex.cmd",
        "\\\\server\\share\\codex.cmd",
        "\\\\?\\C:\\codex.cmd",
      ]) {
        expectError(
          resolveCodexBinary({ PCV_CODEX_BIN: path }),
          /absolute local installation path/,
        );
      }
      const install = testDir("codex-install-");
      const installed = binary(install);
      const rooted = install.slice(parse(install).root.length - 1);
      assert.equal(
        resolveCodexBinary({
          PATH: [rooted, "C:relative", install].join(delimiter),
        }),
        installed,
      );
    },
  );

  it("rejects Windows shell expansion in executable paths", { skip: !WIN }, () => {
    const dir = testDir("codex-%unsafe%-");
    expectError(
      resolveCodexBinary({ PCV_CODEX_BIN: binary(dir) }),
      /percent variables/,
    );
  });
});

describe("the environment Codex receives", () => {
  it("inherits authentication and non-secret settings without guessing from names", () => {
    const env = {
      PATH: "/bin",
      AWS_SECRET_ACCESS_KEY: "synthetic-aws",
      ATLASSIAN_API_TOKEN: "synthetic-atlassian",
      OPENAI_API_KEY: "synthetic-openai",
      CODEX_HOME: "/codex",
      PCV_CREDENTIALS_PATH: "/vault",
      SESSIONNAME: "Console",
      NPM_CONFIG_PREFIX: "/npm",
      CUSTOM_LOGIN: "synthetic-custom",
    };
    const clean = codexEnvironment(env);
    assert.ok(!(clean instanceof AgentError));
    for (const [key, value] of Object.entries(env)) {
      assert.equal(clean[key], value);
    }
    assert.equal(env.PATH, "/bin");
  });

  it(
    "normalizes Windows keys, rejects conflicts and forces the CWD lookup guard",
    { skip: !WIN },
    () => {
      assert.deepEqual(
        codexEnvironment({
          Path: "x",
          PATH: "x",
          noDefaultCurrentDirectoryInExePath: "0",
        }),
        {
          PATH: "x",
          NODEFAULTCURRENTDIRECTORYINEXEPATH: "1",
        },
      );
      expectError(
        codexEnvironment({ Path: "x", PATH: "y" }),
        /Conflicting Windows environment variable: PATH/,
      );
    },
  );
});

describe("spawning Codex", () => {
  it("starts the installation with fixed arguments in the agent CWD and inherits synthetic credentials", async () => {
    const install = testDir("codex install with spaces & bang!-");
    const project = testDir("codex-project-");
    const shadowMarker = join(project, "shadow-ran.txt");
    const script = join(install, "probe.mjs");
    writeFileSync(
      script,
      `import { spawnSync } from 'node:child_process';
      const keys = ['AWS_SECRET_ACCESS_KEY', 'ATLASSIAN_API_TOKEN', 'PCV_CREDENTIALS_PATH', 'CUSTOM_LOGIN'];
      const env = Object.fromEntries(keys.map(key => [key, process.env[key]]));
      const child = spawnSync(process.execPath, ['-e', 'process.stdout.write(process.env.ATLASSIAN_API_TOKEN)'], { encoding: 'utf8' });
      const path = process.env.PATH.split(${JSON.stringify(delimiter)});
      console.log(JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2), env, descendant: child.stdout, path }));
      process.stdin.resume();`,
    );
    binary(
      install,
      NAME,
      WIN
        ? `@echo off\r\nnode "${script}" %*\r\n`
        : `#!/bin/sh\nexec "${process.execPath}" "${script}" "$@"\n`,
    );
    const shadow = WIN
      ? `@echo shadow>"${shadowMarker}"\r\n`
      : `#!/bin/sh\nprintf shadow > "${shadowMarker}"\n`;
    const relativeEntry = "shadowbin";
    mkdirSync(join(project, relativeEntry));
    for (const dir of [project, join(project, relativeEntry)]) {
      binary(dir, NAME, shadow);
      binary(dir, WIN ? "node.cmd" : "node", shadow);
      binary(dir, WIN ? "cmd.exe" : "unused", shadow);
      binary(dir, WIN ? "taskkill.cmd" : "taskkill", shadow);
    }
    const env = codexEnvironment(process.env);
    assert.ok(!(env instanceof AgentError));
    delete env.PCV_CODEX_BIN;
    env.PATH = [
      "",
      ".",
      relativeEntry,
      install,
      dirname(process.execPath),
      env.PATH ?? "",
    ].join(delimiter);
    env.PATHEXT = ".CMD;.EXE";
    env.COMSPEC = join(project, "cmd.exe");
    env.AWS_SECRET_ACCESS_KEY = "synthetic-aws";
    env.ATLASSIAN_API_TOKEN = "synthetic-atlassian";
    env.PCV_CREDENTIALS_PATH = "synthetic-vault-path";
    env.CUSTOM_LOGIN = "synthetic-custom";
    const fd = openSync(join(install, "stderr.log"), "a");
    const transport = spawnCodexAppServer(fd, env, project);
    assert.ok(!(transport instanceof AgentError));
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const line = await new Promise<string>((resolve, reject) => {
        timer = setTimeout(() => reject(new Error("probe timed out")), 10_000);
        transport.onLine(resolve);
        transport.onClose((reason) => reject(new Error(reason)));
      });
      const { path, ...probe } = JSON.parse(line);
      assert.equal(path[0], install);
      for (const entry of ["", ".", relativeEntry]) {
        assert.equal(path.includes(entry), false);
      }
      assert.deepEqual(probe, {
        cwd: project,
        args: ["app-server"],
        env: {
          AWS_SECRET_ACCESS_KEY: "synthetic-aws",
          ATLASSIAN_API_TOKEN: "synthetic-atlassian",
          PCV_CREDENTIALS_PATH: "synthetic-vault-path",
          CUSTOM_LOGIN: "synthetic-custom",
        },
        descendant: "synthetic-atlassian",
      });
    } finally {
      clearTimeout(timer);
      await transport.close();
      closeSync(fd);
    }
    assert.equal(existsSync(shadowMarker), false);
  });
});
