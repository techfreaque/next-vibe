import assert from "node:assert/strict";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";

import { defaultLocale } from "next-vibe/core/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { CodingAgentRepository, mcpConfig } from "../repository";
import { findRunning, listRunning } from "../runtime/control";
import { stateDir } from "../runtime/paths";
import { removeTestDirs, testDir, testRoot } from "./test-paths.fixture";

const FIXTURE = join(import.meta.dirname, "fake-codex.fixture.mjs");
const AGY_FIXTURE = join(import.meta.dirname, "fake-agy.fixture.mjs");
const never = new AbortController().signal;
const { t } = scopedTranslation.scopedT(defaultLocale);

const runPersistent = (
  data: Parameters<typeof CodingAgentRepository.runPersistent>[0],
  signal: AbortSignal = never,
) => CodingAgentRepository.runPersistent(data, signal, t);
const interrupt = (
  data: Parameters<typeof CodingAgentRepository.interrupt>[0],
) => CodingAgentRepository.interrupt(data, t);
const say = (data: Parameters<typeof CodingAgentRepository.say>[0]) =>
  CodingAgentRepository.say(data, t);
const list = (data: Parameters<typeof CodingAgentRepository.list>[0]) =>
  CodingAgentRepository.list(data, t);

const saved = {
  codex: process.env.PCV_CODEX_BIN,
  agy: process.env.PCV_AGY_BIN,
  home: process.env.PCV_SUBAGENTS_HOME,
};

/** An executable that starts a fake provider server, the way the real binary is started. */
function fakeBinary(script = FIXTURE, name = "fake-codex"): string {
  const dir = testDir("coding-agent bin with spaces-");
  if (process.platform === "win32") {
    const file = join(dir, `${name}.cmd`);
    writeFileSync(file, `@echo off\r\nnode "${script}" %*\r\n`);
    return file;
  }
  const file = join(dir, name);
  writeFileSync(file, `#!/bin/sh\nexec node "${script}" "$@"\n`);
  chmodSync(file, 0o755);
  return file;
}

let n = 0;
const nextName = (prefix: string): string => `${prefix}-${++n}`;

async function waitRunning(name: string): Promise<void> {
  for (let i = 0; i < 100; i++) {
    if ((await findRunning(stateDir(), name))?.threadId) {
      return;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  return Promise.reject(new Error(`Agent ${name} never started`));
}

before(() => {
  process.env.PCV_CODEX_BIN = fakeBinary(FIXTURE, "fake-codex");
  process.env.PCV_AGY_BIN = fakeBinary(AGY_FIXTURE, "fake-agy");
  process.env.PCV_SUBAGENTS_HOME = testDir("coding-agent-home-");
});

after(() => {
  for (const [key, value] of [
    ["PCV_CODEX_BIN", saved.codex],
    ["PCV_AGY_BIN", saved.agy],
    ["PCV_SUBAGENTS_HOME", saved.home],
  ] as const) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  removeTestDirs();
});

describe("coding-agent persistent verbs", () => {
  it("returns the final message, and the same name continues the thread unless fresh", async () => {
    const name = nextName("resume");
    const first = await runPersistent({
      name,
      prompt: "one",
      cwd: testRoot(),
    });
    assert.equal(first.success, true);
    assert.equal(first.data.status, "completed");
    assert.equal(first.data.nameOut, name);
    const thread = first.data.threadId;
    assert.ok(thread);
    assert.equal(first.data.output, `new:${thread}:one`);

    const second = await runPersistent({
      name,
      prompt: "two",
      cwd: testRoot(),
    });
    assert.equal(
      second.success && second.data.output,
      `resumed:${thread}:two`,
    );

    const fresh = await runPersistent({
      name,
      prompt: "three",
      cwd: testRoot(),
      fresh: true,
    });
    assert.equal(fresh.success && fresh.data.output.startsWith("new:"), true);
  });

  it("fails with the reason and the thread when the turn fails, and surfaces error in list", async () => {
    const name = nextName("fail");
    const result = await runPersistent({
      name,
      prompt: "FAIL",
      cwd: testRoot(),
    });
    assert.equal(result.success, false);
    assert.match(result.message, /usage limit reached.*thread-/);
    const inspected = await list({ name });
    assert.equal(inspected.success && inspected.data.agents[0]?.status, "failed");
    assert.equal(
      inspected.success && inspected.data.lastError,
      "usage limit reached",
    );
  });

  it("rejects a bad name and an empty task without starting anything", async () => {
    assert.equal(
      (await runPersistent({ name: "bad name", prompt: "x" })).success,
      false,
    );
    assert.equal(
      (await runPersistent({ name: nextName("empty"), prompt: " " })).success,
      false,
    );
  });

  it("validates names for every verb and rejects empty files", async () => {
    assert.equal(
      (await say({ name: "../outside", message: "x" })).success,
      false,
    );
    assert.equal((await interrupt({ name: "../outside" })).success, false);
    assert.equal((await list({ name: "../outside" })).success, false);
    assert.equal(
      (await runPersistent({ name: "CON", prompt: "x" })).success,
      false,
    );
    const file = join(stateDir(), "empty.txt");
    writeFileSync(file, " \n");
    assert.equal(
      (
        await runPersistent({
          name: nextName("empty-file"),
          promptFile: file,
        })
      ).success,
      false,
    );
  });

  it("allows only one simultaneous run of a name, including startup", async () => {
    const name = nextName("duplicate");
    const abort = new AbortController();
    const first = runPersistent(
      { name, prompt: "HOLD", cwd: testRoot() },
      abort.signal,
    );
    try {
      const second = await runPersistent({
        name,
        prompt: "other",
        cwd: testRoot(),
      });
      assert.equal(second.success, false);
      assert.ok(second.message.includes("is running"));
    } finally {
      abort.abort();
    }
    const result = await first;
    assert.equal(result.success, true);
    assert.equal(result.data.status, "interrupted");
    assert.equal(await findRunning(stateDir(), name), undefined);
  });

  it("cancels the command and rejects an already aborted invocation", async () => {
    const name = nextName("cancel");
    const abort = new AbortController();
    const running = runPersistent(
      { name, prompt: "HOLD", cwd: testRoot() },
      abort.signal,
    );
    await waitRunning(name);
    abort.abort();
    const result = await running;
    assert.equal(result.success, true);
    assert.equal(result.data.status, "interrupted");
    assert.equal(await findRunning(stateDir(), name), undefined);
    const again = await runPersistent(
      { name, prompt: "HOLD", cwd: testRoot() },
      abort.signal,
    );
    assert.equal(again.success, false);
    assert.equal(await findRunning(stateDir(), name), undefined);
  });

  it("steers a running Codex agent through say and lists it with transcript tail & lastMessage", async () => {
    const name = nextName("steer");
    const running = runPersistent({
      name,
      prompt: "HOLD",
      cwd: testRoot(),
    });
    await waitRunning(name);
    const listed = await list({});
    assert.equal(listed.success, true);
    assert.ok(listed.data.agents.map((agent) => agent.name).includes(name));
    const delivered = await say({ name, message: "go on" });
    assert.equal(delivered.success, true);
    assert.deepEqual(delivered.data, { delivered: true });
    const result = await running;
    assert.equal(result.success && result.data.output, "steered:go on");
    assert.equal((await say({ name, message: "late" })).success, false);
    assert.equal((await listRunning(stateDir())).length, 0);
    const ended = await list({ name, lines: 8 });
    assert.equal(ended.success && ended.data.agents[0]?.status, "completed");
    assert.equal(ended.success && ended.data.lastMessage, "steered:go on");
    assert.equal(ended.success && ended.data.tail?.includes("go on"), true);
  });

  it("interrupts a running Codex agent", async () => {
    const name = nextName("stop");
    const running = runPersistent({
      name,
      prompt: "HOLD",
      cwd: testRoot(),
    });
    await waitRunning(name);
    const interrupted = await interrupt({ name });
    assert.equal(interrupted.success, true);
    assert.deepEqual(interrupted.data, { interrupted: true });
    const result = await running;
    assert.equal(result.success, true);
    assert.equal(result.data.status, "interrupted");
  });

  it("steers, lists, interrupts and resumes an Antigravity agent via ACP", async () => {
    const name = nextName("agy-steer");
    const running = runPersistent({
      name,
      provider: "antigravity",
      prompt: "HOLD",
      cwd: testRoot(),
    });
    await waitRunning(name);
    const listed = await list({});
    assert.equal(listed.success, true);
    const live = listed.data.agents.find((agent) => agent.name === name);
    assert.equal(live?.provider, "antigravity");
    assert.equal(live?.status, "running");

    const delivered = await say({
      name,
      message: "stop counting and write DONE",
    });
    assert.equal(delivered.success, true);
    assert.deepEqual(delivered.data, { delivered: true });

    const result = await running;
    assert.equal(result.success, true);
    assert.equal(result.data.status, "completed");
    assert.equal(result.data.output, "steered:stop counting and write DONE");
    const sessionId = result.data.threadId;
    assert.ok(sessionId?.startsWith("agy-session-"));

    // Next turn resumes the saved Antigravity session without repeating --provider.
    const followUp = await runPersistent({
      name,
      prompt: "follow-up",
      cwd: testRoot(),
    });
    assert.equal(followUp.success, true);
    assert.equal(followUp.data.output, `resumed:${sessionId}:follow-up`);

    // Switching providers without --fresh is rejected with conflict.
    const conflict = await runPersistent({
      name,
      provider: "codex",
      prompt: "switch",
      cwd: testRoot(),
    });
    assert.equal(conflict.success, false);
    assert.match(conflict.message, /--fresh/);

    // Interrupt works on a running Antigravity turn too.
    const stopName = nextName("agy-stop");
    const stopping = runPersistent({
      name: stopName,
      provider: "antigravity",
      prompt: "HOLD",
      cwd: testRoot(),
    });
    await waitRunning(stopName);
    const stopped = await interrupt({ name: stopName });
    assert.equal(stopped.success, true);
    assert.deepEqual(stopped.data, { interrupted: true });
    const stopRes = await stopping;
    assert.equal(stopRes.success, true);
    assert.equal(stopRes.data.status, "interrupted");
  });
});

function config(dir: string, name: string): void {
  mkdirSync(join(dir, ".codex"), { recursive: true });
  writeFileSync(
    join(dir, ".codex", "config.toml"),
    `[mcp_servers."${name}"]\ncommand = "x"\n\n[mcp_servers.${name}.env]\nA = "1"\n`,
  );
}

describe("mcpConfig", () => {
  it("approves the servers of the configs up to the git root, not beyond", () => {
    const outer = testDir("coding-agent-mcp-");
    const root = join(outer, "repo");
    const sub = join(root, "sub");
    mkdirSync(join(root, ".git"), { recursive: true });
    mkdirSync(sub);
    config(outer, "outside");
    config(root, "pcv");
    config(sub, "local-tool");
    assert.deepEqual(mcpConfig(sub), {
      mcp_servers: {
        pcv: { default_tools_approval_mode: "approve" },
        "local-tool": { default_tools_approval_mode: "approve" },
      },
    });
    assert.deepEqual(mcpConfig(outer), {
      mcp_servers: { outside: { default_tools_approval_mode: "approve" } },
    });
  });
});
