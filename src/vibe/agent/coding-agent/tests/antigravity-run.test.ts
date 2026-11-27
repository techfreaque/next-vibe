import assert from "node:assert/strict";
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, join } from "node:path";
import { after, describe, it } from "node:test";

import {
  AntigravityRun,
  DEFAULT_ANTIGRAVITY_MODEL,
} from "../providers/antigravity/run";
import type { RunInput } from "../providers/codex/run";
import { agentDir, transcriptTail } from "../runtime/paths";
import { removeTestDirs, testDir } from "./test-paths.fixture";

const FIXTURE = join(import.meta.dirname, "fake-agy.fixture.mjs");
const originalPath = process.env.PATH;
const originalAgyBin = process.env.PCV_AGY_BIN;
const originalProbe = process.env.AGY_FIXTURE_ENV;
const originalProbeFile = process.env.AGY_PROBE_FILE;

after(() => {
  for (const [key, value] of [
    ["PATH", originalPath],
    ["PCV_AGY_BIN", originalAgyBin],
    ["AGY_FIXTURE_ENV", originalProbe],
    ["AGY_PROBE_FILE", originalProbeFile],
  ] as const) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  removeTestDirs();
});

interface ProbeEntry {
  kind: string;
  cwd?: string;
  argv?: string[];
  envProbe?: string | null;
  message?: {
    method?: string;
    params?: {
      sessionId?: string;
      modelId?: string;
      configId?: string;
      value?: string;
      prompt?: Array<{ text?: string }>;
    };
  };
}

function readProbe(file: string): ProbeEntry[] {
  return readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ProbeEntry);
}

function fixture(options: Partial<RunInput> = {}): {
  dir: string;
  probeFile: string;
  run: AntigravityRun;
  threads: string[];
} {
  const dir = testDir("agy-");
  const bin = join(dir, "agy");
  writeFileSync(bin, `#!/bin/sh\nexec node "${FIXTURE}" "$@"\n`);
  chmodSync(bin, 0o755);
  const probeFile = join(dir, "probe.jsonl");
  delete process.env.PCV_AGY_BIN;
  process.env.PATH = [dir, originalPath].join(delimiter);
  process.env.AGY_PROBE_FILE = probeFile;
  const input: RunInput = {
    name: "test",
    prompt: "task",
    cwd: dir,
    sandbox: "danger-full-access",
    ...options,
  };
  mkdirSync(agentDir(dir, input.name), { recursive: true });
  const threads: string[] = [];
  const run = new AntigravityRun(
    dir,
    input,
    (value) => {
      threads.push(value);
    },
    "Standard brief instructions.",
  );
  return { dir, probeFile, run, threads };
}

describe(
  "Antigravity ACP runner",
  { skip: process.platform === "win32" },
  () => {
    it("runs a turn over agy acp with preamble, defaults, usage logging and caller env", async () => {
      process.env.AGY_FIXTURE_ENV = "synthetic-inherited-value";
      const { dir, probeFile, run, threads } = fixture({ prompt: "hello" });
      try {
        await run.start();
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.equal(threads.length, 1);
        assert.equal(
          result.message,
          `new:${threads[0]}:Standard brief instructions.\n\n## Task\n\nhello`,
        );
        assert.match(transcriptTail(dir, "test", 20), /hello[\s\S]+new:/);

        const usage: { usage: { total_tokens: number; input_tokens: number } } =
          JSON.parse(
            readFileSync(
              join(agentDir(dir, "test"), "agy-usage.jsonl"),
              "utf8",
            ),
          );
        assert.equal(usage.usage.total_tokens, 25);
        assert.equal(usage.usage.input_tokens, 10);

        const probe = readProbe(probeFile);
        const boot = probe.find((entry) => entry.kind === "boot");
        assert.equal(boot?.cwd, dir);
        assert.equal(boot?.envProbe, "synthetic-inherited-value");
        assert.deepEqual(boot?.argv, ["acp", "--dangerously-skip-permissions"]);

        const methods = probe
          .filter((entry) => entry.kind === "in")
          .map((entry) => entry.message?.method);
        assert.deepEqual(methods, [
          "initialize",
          "session/new",
          "session/set_model",
          "session/prompt",
        ]);
        const setModel = probe.find(
          (entry) => entry.message?.method === "session/set_model",
        );
        assert.equal(
          setModel?.message?.params?.modelId,
          DEFAULT_ANTIGRAVITY_MODEL,
        );
      } finally {
        await run.close();
      }
    });

    it("resumes a saved session and applies model and effort config", async () => {
      const { probeFile, run, threads } = fixture({
        prompt: "continue work",
        model: "gemini-4-neon-medium",
        effort: "medium",
        resume: "session-saved-42",
      });
      try {
        await run.start();
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.deepEqual(threads, ["session-saved-42"]);
        assert.equal(result.message, "resumed:session-saved-42:continue work");

        const probe = readProbe(probeFile);
        const resumeCall = probe.find(
          (entry) => entry.message?.method === "session/resume",
        );
        assert.equal(
          resumeCall?.message?.params?.sessionId,
          "session-saved-42",
        );
        const effortCall = probe.find(
          (entry) => entry.message?.method === "session/set_config_option",
        );
        assert.equal(effortCall?.message?.params?.configId, "thought_level");
        assert.equal(effortCall?.message?.params?.value, "medium");
      } finally {
        await run.close();
      }
    });

    it("steers a running turn mid-flight via concurrent session/prompt", async () => {
      const { dir, probeFile, run } = fixture({ prompt: "HOLD" });
      try {
        await run.start();
        await run.say("stop counting and write DONE");
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.equal(result.message, "steered:stop counting and write DONE");
        const tail = transcriptTail(dir, "test", 20);
        assert.match(tail, /orchestrator \(mid-turn\)/);
        assert.match(tail, /stop counting and write DONE/);

        const prompts = readProbe(probeFile).filter(
          (entry) => entry.message?.method === "session/prompt",
        );
        assert.equal(prompts.length, 2);
        assert.equal(
          prompts[0]?.message?.params?.sessionId,
          prompts[1]?.message?.params?.sessionId,
        );
        assert.equal(
          prompts[1]?.message?.params?.prompt?.[0]?.text,
          "stop counting and write DONE",
        );

        await assert.rejects(run.say("too late"), { code: "conflict" });
        await assert.rejects(run.say("   "), { code: "invalid" });
      } finally {
        await run.close();
      }
    });

    it("supports multiple consecutive mid-turn steers on the same session", async () => {
      const { run } = fixture({ prompt: "HOLD_DOUBLE" });
      try {
        await run.start();
        await run.say("first steer");
        await run.say("second steer");
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.equal(result.message, "steered:second steer");
      } finally {
        await run.close();
      }
    });

    it("interrupts a running turn via session/cancel without losing the session ID", async () => {
      const { probeFile, run, threads } = fixture({ prompt: "HOLD" });
      try {
        await run.start();
        assert.equal(await run.interrupt(), true);
        const result = await run.result();
        assert.equal(result.status, "interrupted");
        assert.equal(result.threadId, threads[0]);
        const cancelled = readProbe(probeFile).find(
          (entry) => entry.message?.method === "session/cancel",
        );
        assert.equal(cancelled?.message?.params?.sessionId, threads[0]);
      } finally {
        await run.close();
      }
    });

    it("records tool updates in transcript and returns the final answer after tools", async () => {
      const { dir, run } = fixture({ prompt: "TOOL_THEN" });
      try {
        await run.start();
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.equal(result.message, "Final after tool");
        const tail = transcriptTail(dir, "test", 20);
        assert.match(tail, /echo 1 >> count\.txt/);
        assert.match(tail, /Final after tool/);
      } finally {
        await run.close();
      }
    });

    it("auto-approves session/request_permission server requests", async () => {
      const { run } = fixture({ prompt: "PERM" });
      try {
        await run.start();
        const result = await run.result();
        assert.equal(result.status, "completed");
        assert.equal(result.message, "perm:allow-all");
      } finally {
        await run.close();
      }
    });

    it("reports JSON-RPC failures, auth errors and unexpected process exit", async () => {
      const failed = fixture({ prompt: "FAIL" });
      try {
        await failed.run.start();
        const res = await failed.run.result();
        assert.equal(res.status, "failed");
        assert.match(res.error ?? "", /model execution failed/);
      } finally {
        await failed.run.close();
      }

      const auth = fixture({ prompt: "AUTH_FAIL" });
      try {
        await auth.run.start();
        const res = await auth.run.result();
        assert.equal(res.status, "failed");
        assert.match(res.error ?? "", /agy acp --login/);
      } finally {
        await auth.run.close();
      }

      const crashed = fixture({ prompt: "CRASH" });
      try {
        await crashed.run.start();
        const res = await crashed.run.result();
        assert.equal(res.status, "failed");
        assert.match(res.error ?? "", /fatal acp crash/);
      } finally {
        await crashed.run.close();
      }
    });

    it("does not spawn after cancellation", async () => {
      const { run } = fixture({ prompt: "CRASH" });
      run.cancel();
      await run.start();
      assert.equal((await run.result()).status, "interrupted");
    });
  },
);
