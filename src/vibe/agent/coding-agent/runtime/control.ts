/**
 * The control channel of a running agent: a loopback TCP port with a token, published in `running/<name>.json` for as
 * long as the agent runs. `coding-agent-say`, `coding-agent-interrupt` and `coding-agent-list` find the agent there.
 * There is no daemon and no other state: when the command running the agent ends, the file goes with it (and a stale
 * file of a killed one is pruned when its owning process is dead or its port refuses connections).
 */

import { randomBytes, timingSafeEqual } from "node:crypto";
import {
  existsSync,
  linkSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import {
  createConnection,
  createServer,
  type Server,
  type Socket,
} from "node:net";
import { createInterface } from "node:readline";

import { z } from "zod";

import { codingAgentProviderSchema } from "../enum";
import {
  type Json,
  type JsonObject,
  jsonObjectSchema,
  jsonSchema,
} from "../providers/codex/protocol";
import {
  AgentError,
  agentErrorCodeSchema,
  type RunningInfo,
  runningInfoSchema,
} from "../types";
import { isValidName, runningDir, runningFile } from "./paths";

export interface ControlHandlers {
  say(message: string): Promise<void>;
  interrupt(): Promise<boolean>;
  tail(lines: number): string;
}

const requestSchema = z.object({
  token: z.string(),
  op: z.string(),
  args: jsonObjectSchema.optional(),
});

const replySchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: jsonSchema }),
  z.object({
    ok: z.literal(false),
    code: agentErrorCodeSchema,
    message: z.string(),
  }),
]);
type Reply = z.infer<typeof replySchema>;

export interface ControlServer {
  update(
    threadId: string,
    cwd: string,
    provider?: RunningInfo["provider"],
  ): void;
  close(): void;
}

const liveInfoSchema = z.object({
  threadId: z.string(),
  cwd: z.string(),
  provider: codingAgentProviderSchema.optional(),
});
type LiveInfo = z.infer<typeof liveInfoSchema>;

const MAX_MESSAGE_BYTES = 1024 * 1024;

/** Publishes the agent and serves `say`, `interrupt` and `status` until closed. */
export async function serveControl(
  dir: string,
  meta: Omit<RunningInfo, "pid" | "port" | "token" | "startedAt">,
  handlers: ControlHandlers,
): Promise<ControlServer> {
  if (!isValidName(meta.name)) {
    return Promise.reject(new AgentError("invalid", "Invalid agent name."));
  }
  const file = runningFile(dir, meta.name);
  const token = randomBytes(24).toString("hex");
  let current: LiveInfo = {
    threadId: meta.threadId,
    cwd: meta.cwd,
    provider: meta.provider,
  };
  const sockets = new Set<Socket>();
  const server: Server = createServer((socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
    socket.setTimeout(30_000, () => socket.destroy());
    let bytes = 0;
    socket.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_MESSAGE_BYTES) {
        socket.destroy();
      }
    });
    const reader = createInterface({ input: socket });
    reader.on("error", () => undefined);
    socket.once("close", () => reader.close());
    socket.on("error", () => undefined);
    reader.once("line", (raw) => {
      if (Buffer.byteLength(raw) > MAX_MESSAGE_BYTES) {
        socket.destroy();
        return;
      }
      void answer(raw, token, handlers, current).then((reply) =>
        socket.end(`${JSON.stringify(reply)}\n`),
      );
    });
  });
  const port = await new Promise<number>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        reject(new Error("no port"));
        return;
      }
      resolve(address.port);
    });
  });
  const info: RunningInfo = {
    ...meta,
    pid: process.pid,
    port,
    token,
    startedAt: new Date().toISOString(),
  };
  const temporary = `${file}.${token}.tmp`;
  try {
    mkdirSync(runningDir(dir), { recursive: true, mode: 0o700 });
    writeFileSync(temporary, JSON.stringify(info), { mode: 0o600, flag: "wx" });
    // Linking a complete file both claims the name exclusively and prevents partial reads during publication.
    linkSync(temporary, file);
  } catch (error) {
    server.close();
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
      return Promise.reject(
        new AgentError(
          "conflict",
          `Agent "${meta.name}" is running. Use coding-agent-say to steer it or choose another name.`,
        ),
      );
    }
    return Promise.reject(error);
  } finally {
    removeQuietly(temporary);
  }
  let closed = false;
  return {
    update: (threadId, cwd, provider = current.provider) => {
      current = { threadId, cwd, ...(provider && { provider }) };
    },
    close: () => {
      if (closed) {
        return;
      }
      closed = true;
      server.close();
      for (const socket of sockets) {
        socket.destroy();
      }
      removeIfUnchanged(file, JSON.stringify(info));
    },
  };
}

async function answer(
  raw: string,
  token: string,
  handlers: ControlHandlers,
  current: LiveInfo,
): Promise<Reply> {
  let json: Json;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, code: "invalid", message: "Malformed request." };
  }
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Malformed request." };
  }
  const request = parsed.data;
  const supplied = Buffer.from(request.token);
  const expected = Buffer.from(token);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return { ok: false, code: "invalid", message: "Bad token." };
  }
  const args = request.args ?? {};
  try {
    switch (request.op) {
      case "ping":
        return { ok: true, data: current };
      case "say":
        await handlers.say(
          typeof args.message === "string" ? args.message : "",
        );
        return { ok: true, data: {} };
      case "interrupt":
        return { ok: true, data: { interrupted: await handlers.interrupt() } };
      case "status":
        return {
          ok: true,
          data: {
            tail: handlers.tail(
              z
                .number()
                .int()
                .nonnegative()
                .parse(args.lines ?? 20),
            ),
          },
        };
      default:
        return {
          ok: false,
          code: "invalid",
          message: `Unknown operation "${request.op}".`,
        };
    }
  } catch (error) {
    return error instanceof AgentError
      ? { ok: false, code: error.code, message: error.message }
      : {
          ok: false,
          code: "unavailable",
          message: error instanceof Error ? error.message : String(error),
        };
  }
}

function removeQuietly(file: string): void {
  try {
    unlinkSync(file);
  } catch {
    // Already gone.
  }
}

function removeIfUnchanged(file: string, content: string): void {
  try {
    if (readFileSync(file, "utf-8") === content) {
      unlinkSync(file);
    }
  } catch {
    // Already gone or replaced; never remove a newer run's publication.
  }
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // Permission failures are not evidence that a process has died.
    return !(
      error instanceof Error &&
      "code" in error &&
      error.code === "ESRCH"
    );
  }
}

function send<T>(
  info: RunningInfo,
  op: string,
  args: JsonObject,
  schema: z.ZodType<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const socket = createConnection({ host: "127.0.0.1", port: info.port });
    socket.once("close", () => {
      clearTimeout(timer);
      reject(
        new AgentError(
          "unavailable",
          `Agent "${info.name}" closed the control channel.`,
        ),
      );
    });
    const timer = setTimeout(() => {
      socket.destroy();
      reject(
        new AgentError(
          "unavailable",
          `Agent "${info.name}" did not answer ${op}.`,
        ),
      );
    }, 30_000);
    const reader = createInterface({ input: socket });
    reader.on("error", () => undefined);
    socket.once("close", () => reader.close());
    let bytes = 0;
    socket.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_MESSAGE_BYTES) {
        socket.destroy();
      }
    });
    reader.once("line", (raw) => {
      clearTimeout(timer);
      socket.destroy();
      let json: Json;
      try {
        json = JSON.parse(raw);
      } catch {
        reject(
          new AgentError(
            "unavailable",
            `Agent "${info.name}" sent an unreadable answer.`,
          ),
        );
        return;
      }
      const reply = replySchema.safeParse(json);
      if (!reply.success) {
        reject(
          new AgentError(
            "unavailable",
            `Agent "${info.name}" sent an unexpected answer.`,
          ),
        );
      } else if (!reply.data.ok) {
        reject(new AgentError(reply.data.code, reply.data.message));
      } else {
        const data = schema.safeParse(reply.data.data);
        if (data.success) {
          resolve(data.data);
        } else {
          reject(
            new AgentError(
              "unavailable",
              `Agent "${info.name}" sent an unexpected answer to ${op}.`,
            ),
          );
        }
      }
    });
    socket.on("error", (error) => {
      clearTimeout(timer);
      reject(
        new AgentError(
          "code" in error && error.code === "ECONNREFUSED"
            ? "not_found"
            : "unavailable",
          `Cannot reach agent "${info.name}": ${error.message}`,
        ),
      );
    });
    socket.on("connect", () =>
      socket.write(`${JSON.stringify({ token: info.token, op, args })}\n`),
    );
  });
}

/** The running agent of that name, or `undefined`; a file whose agent is gone is removed. */
export async function findRunning(
  dir: string,
  name: string,
): Promise<RunningInfo | undefined> {
  if (!isValidName(name)) {
    return Promise.reject(new AgentError("invalid", "Invalid agent name."));
  }
  const file = runningFile(dir, name);
  if (!existsSync(file)) {
    return undefined;
  }
  let content: string;
  try {
    content = readFileSync(file, "utf-8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return undefined;
    }
    return Promise.reject(error);
  }
  let info: RunningInfo;
  try {
    info = runningInfoSchema.parse(JSON.parse(content));
  } catch {
    return Promise.reject(
      new AgentError("unavailable", `Invalid running-agent file: ${file}`),
    );
  }
  if (info.name.toLowerCase() !== name.toLowerCase()) {
    return Promise.reject(
      new AgentError("unavailable", `Invalid running-agent file: ${file}`),
    );
  }
  if (!isAlive(info.pid)) {
    removeIfUnchanged(file, content);
    return undefined;
  }
  try {
    const current = await send(info, "ping", {}, liveInfoSchema);
    return { ...info, ...current };
  } catch (error) {
    // A refused connection also handles a stale PID that the OS has reused. A timeout, EOF or bad token is not proof.
    if (error instanceof AgentError && error.code === "not_found") {
      removeIfUnchanged(file, content);
      return undefined;
    }
    return Promise.reject(error);
  }
}

export async function listRunning(dir: string): Promise<RunningInfo[]> {
  const folder = runningDir(dir);
  if (!existsSync(folder)) {
    return [];
  }
  const names = readdirSync(folder)
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => entry.slice(0, -".json".length))
    .filter(isValidName);
  // One unreadable or unresponsive entry must not hide the other agents.
  const found = await Promise.allSettled(
    names.map((name) => findRunning(dir, name)),
  );
  return found.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : [],
  );
}

/** Calls an op of a running agent; "not running" is a not_found error naming the way to continue it. */
export async function callAgent<T>(
  dir: string,
  name: string,
  op: string,
  args: JsonObject,
  schema: z.ZodType<T>,
): Promise<T> {
  const info = await findRunning(dir, name);
  if (!info) {
    return Promise.reject(
      new AgentError(
        "not_found",
        `No agent "${name}" is running. Run the same name with coding-agent to continue its conversation.`,
      ),
    );
  }
  return send(info, op, args, schema);
}
