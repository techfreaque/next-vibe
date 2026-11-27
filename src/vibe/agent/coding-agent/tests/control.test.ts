import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createConnection, createServer } from "node:net";
import { join } from "node:path";
import { after, describe, it } from "node:test";

import { z } from "zod";

import {
  callAgent,
  type ControlHandlers,
  findRunning,
  listRunning,
  serveControl,
} from "../runtime/control";
import { runningDir, runningFile } from "../runtime/paths";
import { removeTestDirs, testDir, testRoot } from "./test-paths.fixture";

const meta = { name: "a", cwd: testRoot(), threadId: "" };
const handlers: ControlHandlers = {
  say: () => Promise.resolve(),
  interrupt: () => Promise.resolve(false),
  tail: () => "tail",
};
const home = (): string => testDir("control-");

after(removeTestDirs);

function rawRequest(port: number, raw: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    let reply = "";
    socket.setTimeout(1000, () =>
      socket.destroy(new Error("test control request timed out")),
    );
    socket.on("error", reject);
    socket.on("data", (chunk) => {
      reply += chunk.toString();
    });
    socket.on("close", () => resolve(reply));
    socket.on("connect", () => socket.write(raw));
  });
}

describe("control lifecycle", () => {
  it("claims a name exclusively and publishes thread updates", async () => {
    const dir = home();
    const results = await Promise.allSettled([
      serveControl(dir, meta, handlers),
      serveControl(dir, meta, handlers),
    ]);
    try {
      assert.equal(
        results.filter((result) => result.status === "fulfilled").length,
        1,
      );
      const loser = results.find((result) => result.status === "rejected");
      assert.ok(loser);
      assert.equal(loser.reason.code, "conflict");
      const winner = results.find((result) => result.status === "fulfilled");
      assert.ok(winner);
      const publication = readFileSync(runningFile(dir, "a"), "utf-8");
      winner.value.update("thread-1", testRoot());
      assert.equal((await findRunning(dir, "a"))?.threadId, "thread-1");
      assert.equal(readFileSync(runningFile(dir, "a"), "utf-8"), publication);
    } finally {
      for (const result of results) {
        if (result.status === "fulfilled") {
          result.value.close();
        }
      }
    }
    assert.equal(existsSync(runningFile(dir, "a")), false);
  });

  it("rejects a bad token and oversized requests without executing them", async () => {
    const dir = home();
    let calls = 0;
    const control = await serveControl(dir, meta, {
      ...handlers,
      say: () => {
        calls++;
        return Promise.resolve();
      },
    });
    try {
      const info = await findRunning(dir, "a");
      assert.ok(info);
      assert.ok(
        (
          await rawRequest(
            info.port,
            `${JSON.stringify({ token: "wrong", op: "say", args: { message: "hello" } })}\n`,
          )
        ).includes("Bad token"),
      );
      assert.equal(
        await rawRequest(info.port, `${"x".repeat(1024 * 1024 + 1)}\n`),
        "",
      );
      assert.equal(calls, 0);
      assert.deepEqual(
        await callAgent(
          dir,
          "a",
          "status",
          { lines: 2 },
          z.object({ tail: z.string() }),
        ),
        { tail: "tail" },
      );
    } finally {
      control.close();
    }
  });

  it("closes idle sockets when the runner ends", async () => {
    const dir = home();
    const control = await serveControl(dir, meta, handlers);
    const info = await findRunning(dir, "a");
    assert.ok(info);
    const socket = createConnection({ host: "127.0.0.1", port: info.port });
    try {
      await new Promise<void>((resolve, reject) => {
        socket.once("connect", resolve);
        socket.once("error", reject);
      });
      const closed = new Promise<void>((resolve) => {
        socket.once("close", () => resolve());
      });
      control.close();
      await closed;
      assert.equal(socket.destroyed, true);
    } finally {
      socket.destroy();
      control.close();
    }
  });

  it("does not prune a live owner's file on EOF or overwrite a newer publication on close", async () => {
    const dir = home();
    const server = createServer((socket) => socket.end());
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    try {
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      mkdirSync(runningDir(dir), { recursive: true });
      const content = JSON.stringify({
        ...meta,
        pid: process.pid,
        port: address.port,
        token: "a".repeat(48),
        startedAt: "now",
      });
      writeFileSync(runningFile(dir, "a"), content);
      await assert.rejects(findRunning(dir, "a"), { code: "unavailable" });
      assert.equal(readFileSync(runningFile(dir, "a"), "utf-8"), content);
    } finally {
      server.close();
    }

    const otherDir = home();
    const control = await serveControl(otherDir, meta, handlers);
    writeFileSync(runningFile(otherDir, "a"), "new owner");
    control.close();
    assert.equal(
      readFileSync(runningFile(otherDir, "a"), "utf-8"),
      "new owner",
    );
  });

  it("lists the reachable agents past a corrupt record and a foreign file", async () => {
    const dir = home();
    const control = await serveControl(dir, meta, handlers);
    try {
      writeFileSync(join(runningDir(dir), "broken.json"), "{");
      writeFileSync(join(runningDir(dir), "not a name.json"), "{}");
      assert.deepEqual(
        (await listRunning(dir)).map((info) => info.name),
        ["a"],
      );
    } finally {
      control.close();
    }
  });

  it("prunes a record whose owner is dead", async () => {
    const dir = home();
    mkdirSync(runningDir(dir), { recursive: true });
    writeFileSync(
      runningFile(dir, "a"),
      JSON.stringify({
        ...meta,
        pid: 2147483647,
        port: 1,
        token: "a".repeat(48),
        startedAt: "now",
      }),
    );
    assert.equal(await findRunning(dir, "a"), undefined);
    assert.equal(existsSync(runningFile(dir, "a")), false);
  });

  it("prunes a refused port even when the old PID has been reused", async () => {
    const dir = home();
    const server = createServer();
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    mkdirSync(runningDir(dir), { recursive: true });
    writeFileSync(
      runningFile(dir, "a"),
      JSON.stringify({
        ...meta,
        pid: process.pid,
        port: address.port,
        token: "a".repeat(48),
        startedAt: "now",
      }),
    );
    assert.equal(await findRunning(dir, "a"), undefined);
    assert.equal(existsSync(runningFile(dir, "a")), false);
  });
});
