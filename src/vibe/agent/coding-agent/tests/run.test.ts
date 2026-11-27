import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { z } from "zod";

import { incomingSchema, type JsonObject } from "../providers/codex/protocol";
import type { RpcTransport } from "../providers/codex/rpc";
import { AgentRun } from "../providers/codex/run";
import {
  callAgent,
  findRunning,
  listRunning,
  serveControl,
} from "../runtime/control";
import { removeTestDirs, testDir, testRoot } from "./test-paths.fixture";

after(removeTestDirs);

/** A `codex app-server` stand-in: answers requests, records them and lets a test push notifications. */
function fakeServer(
  handlers: Record<string, (params: JsonObject) => JsonObject> = {},
) {
  const lineListeners: ((line: string) => void)[] = [];
  const closeListeners: ((reason: string) => void)[] = [];
  const requests: { method: string; params: JsonObject }[] = [];
  const replies: JsonObject[] = [];
  const defaults: Record<string, (params: JsonObject) => JsonObject> = {
    initialize: () => ({}),
    "thread/start": () => ({ thread: { id: "thread-1" } }),
    "thread/resume": (params) => ({ thread: { id: params.threadId } }),
    "turn/start": () => ({ turn: { id: "turn-1" } }),
    ...handlers,
  };
  const push = (message: JsonObject): void =>
    lineListeners.forEach((listener) => listener(JSON.stringify(message)));
  const transport: RpcTransport = {
    write: (line) => {
      const message = incomingSchema.parse(JSON.parse(line));
      if (message.id === undefined) {
        return;
      }
      if (message.method === undefined) {
        replies.push(message);
        return;
      }
      const params = message.params ?? {};
      requests.push({ method: message.method, params });
      try {
        const result = (defaults[message.method] ?? (() => ({})))(params);
        queueMicrotask(() => push({ id: message.id, result }));
      } catch (error) {
        queueMicrotask(() =>
          push({
            id: message.id,
            error: {
              message: error instanceof Error ? error.message : String(error),
            },
          }),
        );
      }
    },
    close: () => closeListeners.forEach((listener) => listener("closed")),
    onLine: (listener) => void lineListeners.push(listener),
    onClose: (listener) => void closeListeners.push(listener),
  };
  return {
    transport,
    requests,
    replies,
    request: (id: number, method: string, params: JsonObject): void =>
      push({ id, method, params }),
    notify: (method: string, params: JsonObject): void =>
      push({ method, params }),
    crash: (): void => closeListeners.forEach((listener) => listener("exit 1")),
  };
}

function makeRun(
  server = fakeServer(),
  extra: { resume?: string; config?: () => JsonObject } = {},
) {
  const dir = testDir("coding-agent-test-");
  const run = new AgentRun(
    {
      dir,
      connect: () => server.transport,
      preamble: () => "PREAMBLE",
      ...(extra.config ? { config: extra.config } : {}),
    },
    {
      name: "a",
      prompt: "do it",
      cwd: testRoot(),
      sandbox: "danger-full-access",
      resume: extra.resume,
    },
  );
  return { run, dir, server };
}

const final = (text: string): JsonObject => ({
  threadId: "thread-1",
  item: { type: "agentMessage", text, phase: "final_answer" },
});
const completed = (
  status = "completed",
  error?: { message: string },
): JsonObject => ({
  threadId: "thread-1",
  turn: { id: "turn-1", status, error },
});

describe("AgentRun", () => {
  it("opens a thread with the preamble, no sandbox and no approvals, then starts the turn", async () => {
    const { run, server } = makeRun(fakeServer(), {
      config: () => ({
        mcp_servers: { pcv: { default_tools_approval_mode: "approve" } },
      }),
    });
    await run.start();
    assert.equal(run.thread, "thread-1");
    const params = server.requests.find(
      (request) => request.method === "thread/start",
    )?.params;
    assert.ok(params);
    assert.equal(params.developerInstructions, "PREAMBLE");
    assert.equal(params.approvalPolicy, "never");
    assert.equal(params.sandbox, "danger-full-access");
    assert.deepEqual(params.config, {
      mcp_servers: { pcv: { default_tools_approval_mode: "approve" } },
    });
    assert.equal(server.requests.at(-1)?.method, "turn/start");
    assert.equal(server.requests.at(-1)?.params.threadId, "thread-1");
  });

  it("resolves with the final message, not the progress messages", async () => {
    const { run, server } = makeRun();
    await run.start();
    server.notify("item/completed", {
      threadId: "thread-1",
      item: { type: "agentMessage", text: "looking", phase: "commentary" },
    });
    server.notify("item/completed", final("All done."));
    server.notify("turn/completed", completed());
    assert.deepEqual(await run.result(), {
      name: "a",
      threadId: "thread-1",
      status: "completed",
      message: "All done.",
      error: undefined,
    });
  });

  it("falls back to the last message when the agent marked none as final", async () => {
    const { run, server } = makeRun();
    await run.start();
    server.notify("item/completed", {
      threadId: "thread-1",
      item: { type: "agentMessage", text: "the answer" },
    });
    server.notify("turn/completed", completed());
    assert.equal((await run.result()).message, "the answer");
  });

  it("steers the running turn", async () => {
    const { run, server } = makeRun();
    await run.start();
    await run.say("also this");
    assert.equal(server.requests.at(-1)?.method, "turn/steer");
    assert.equal(server.requests.at(-1)?.params.threadId, "thread-1");
    assert.equal(server.requests.at(-1)?.params.expectedTurnId, "turn-1");
    await assert.rejects(run.say("  "), { code: "invalid" });
  });

  it("interrupts and reports it", async () => {
    const { run, server } = makeRun();
    await run.start();
    assert.equal(await run.interrupt(), true);
    assert.equal(server.requests.at(-1)?.method, "turn/interrupt");
    assert.equal(server.requests.at(-1)?.params.turnId, "turn-1");
    server.notify("turn/completed", completed("interrupted"));
    assert.equal((await run.result()).status, "interrupted");
    assert.equal(await run.interrupt(), false);
  });

  it("does not restore a completed turn when its start response arrives late", async () => {
    const server = fakeServer({
      "turn/start": () => {
        server.notify("turn/completed", completed());
        return { turn: { id: "turn-1" } };
      },
    });
    const { run } = makeRun(server);
    await run.start();
    assert.equal((await run.result()).status, "completed");
    assert.equal(await run.interrupt(), false);
    await assert.rejects(run.say("late"), { code: "conflict" });
  });

  it("cancels startup before opening a connection", async () => {
    const { run, server } = makeRun();
    run.cancel();
    await run.start();
    assert.deepEqual(server.requests, []);
    assert.equal((await run.result()).status, "interrupted");
  });

  it("cancels while the app-server is not answering initialization", async () => {
    const server = fakeServer();
    server.transport.write = () => undefined;
    const { run } = makeRun(server);
    const starting = run.start();
    run.cancel();
    await starting;
    assert.equal((await run.result()).status, "interrupted");
  });

  it("ignores errors and completions belonging to other threads", async () => {
    const { run, server } = makeRun();
    await run.start();
    server.notify("error", {
      threadId: "other",
      error: { message: "unrelated failure" },
    });
    server.notify("turn/completed", {
      threadId: "other",
      turn: { status: "failed" },
    });
    server.notify("turn/completed", completed("failed"));
    assert.equal((await run.result()).error, "turn failed");
  });

  it("fails on an unknown terminal status instead of reporting success", async () => {
    const { run, server } = makeRun();
    await run.start();
    server.notify("turn/completed", completed("unknown"));
    const result = await run.result();
    assert.equal(result.status, "failed");
    assert.equal(result.error, "Unexpected turn status: unknown");
  });

  it("reports a failed turn and an app-server that died", async () => {
    const failed = makeRun();
    await failed.run.start();
    failed.server.notify(
      "turn/completed",
      completed("failed", { message: "usage limit reached" }),
    );
    const failedResult = await failed.run.result();
    assert.equal(failedResult.status, "failed");
    assert.equal(failedResult.error, "usage limit reached");

    const crashed = makeRun();
    await crashed.run.start();
    crashed.server.crash();
    const crashedResult = await crashed.run.result();
    assert.equal(crashedResult.status, "failed");
    assert.equal(crashedResult.error, "app-server exited: exit 1");
  });

  it("resumes a thread instead of starting one", async () => {
    const { run, server } = makeRun(fakeServer(), { resume: "old-thread" });
    await run.start();
    assert.ok(
      server.requests
        .map((request) => request.method)
        .includes("thread/resume"),
    );
    assert.ok(
      !server.requests
        .map((request) => request.method)
        .includes("thread/start"),
    );
    assert.equal(run.thread, "old-thread");
  });

  it("names --fresh when the thread to continue cannot be resumed", async () => {
    const server = fakeServer({
      "thread/resume": () => {
        // oxlint-disable-next-line restricted-syntax -- intentional mock rpc error
        throw new Error("no rollout found");
      },
    });
    const { run } = makeRun(server, { resume: "gone-thread" });
    await assert.rejects(run.start(), /no rollout found.*gone-thread.*--fresh/);
  });

  it("declines approvals and refuses other requests of the server", async () => {
    const { run, server } = makeRun();
    await run.start();
    server.request(900, "item/commandExecution/requestApproval", {
      threadId: "thread-1",
    });
    server.request(901, "item/tool/requestUserInput", { threadId: "thread-1" });
    await new Promise((resolve) => {
      setTimeout(resolve, 5);
    });
    assert.deepEqual(server.replies.find((reply) => reply.id === 900)?.result, {
      decision: "decline",
    });
    assert.notEqual(
      server.replies.find((reply) => reply.id === 901)?.error,
      undefined,
    );
  });
});

describe("control channel", () => {
  it("reaches a running agent by name and forgets it when it ends", async () => {
    const { run, dir, server } = makeRun();
    await run.start();
    const control = await serveControl(
      dir,
      { name: "a", cwd: testRoot(), threadId: run.thread },
      {
        say: (message) => run.say(message),
        interrupt: () => run.interrupt(),
        tail: (lines) => run.tail(lines),
      },
    );
    assert.deepEqual(
      (await listRunning(dir)).map((info) => info.name),
      ["a"],
    );
    await callAgent(dir, "a", "say", { message: "hello" }, z.object({}));
    assert.equal(server.requests.at(-1)?.method, "turn/steer");
    assert.ok(
      (
        await callAgent(dir, "a", "status", {}, z.object({ tail: z.string() }))
      ).tail.includes("hello"),
    );
    control.close();
    assert.equal(await findRunning(dir, "a"), undefined);
    await assert.rejects(
      callAgent(dir, "a", "say", { message: "x" }, z.object({})),
      {
        code: "not_found",
      },
    );
  });
});
