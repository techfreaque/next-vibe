import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { accessSync, appendFileSync, constants, statSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, isAbsolute, join } from "node:path";
import { createInterface } from "node:readline";

import { z } from "zod";

import { agentDir } from "../../runtime/paths";
import { AgentError, type RunResult } from "../../types";
import { oneLine } from "../codex/events";
import { type Json, type JsonObject, jsonSchema } from "../codex/protocol";
import type { RunInput } from "../codex/run";

export const DEFAULT_ANTIGRAVITY_MODEL = "gemini-4-neon-high";

const INIT_TIMEOUT_MS = 60_000;
const SESSION_OPEN_TIMEOUT_MS = 180_000;
const CONFIG_TIMEOUT_MS = 30_000;
const STEER_ACK_TIMEOUT_MS = 500;
const SHUTDOWN_KILL_TIMEOUT_MS = 1_000;

const acpIncomingSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  method: z.string().optional(),
  params: z.record(z.string(), jsonSchema).optional(),
  result: jsonSchema.optional(),
  error: z
    .object({ code: z.number().optional(), message: z.string().optional() })
    .optional(),
});

const sessionOpenedSchema = z.object({
  sessionId: z.string(),
});

const usageSchema = z.object({
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
  thoughtTokens: z.number().int().nonnegative().optional(),
  cachedReadTokens: z.number().int().nonnegative().optional(),
  totalTokens: z.number().int().nonnegative().optional(),
  input_tokens: z.number().int().nonnegative().optional(),
  output_tokens: z.number().int().nonnegative().optional(),
  thinking_tokens: z.number().int().nonnegative().optional(),
  cache_read_tokens: z.number().int().nonnegative().optional(),
  total_tokens: z.number().int().nonnegative().optional(),
});
type AcpUsage = z.infer<typeof usageSchema>;

const promptResultSchema = z.object({
  stopReason: z.string().optional(),
  usage: usageSchema.optional(),
});

const sessionUpdateSchema = z.object({
  sessionId: z.string().optional(),
  update: z
    .object({
      sessionUpdate: z.string(),
      content: z
        .object({
          type: z.string().optional(),
          text: z.string().optional(),
        })
        .optional(),
      title: z.string().optional(),
      status: z.string().optional(),
      toolCallId: z.string().optional(),
    })
    .optional(),
});

const permissionRequestSchema = z.object({
  options: z
    .array(
      z.object({
        optionId: z.string(),
        kind: z.string().optional(),
      }),
    )
    .optional(),
});

interface PendingRpc {
  resolve(value: Json): void;
  reject(error: Error): void;
  timer?: ReturnType<typeof setTimeout> | undefined;
}

interface ActivePrompt {
  seq: number;
  settled: Promise<void>;
  failed: Promise<never>;
}

const AUTH_ERROR_PATTERN =
  /authenticat|oauth|sign[ -]in|log[ -]?in|unauthori[sz]ed|credential|access[_ -]token|refresh[_ -]token|ya29\./i;

function isExecutableFile(path: string): boolean {
  try {
    accessSync(
      path,
      process.platform === "win32" ? constants.F_OK : constants.X_OK,
    );
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function resolveAgyBinary(): string | AgentError {
  const override = process.env.PCV_AGY_BIN;
  if (override) {
    if (!isAbsolute(override) || !isExecutableFile(override)) {
      return new AgentError(
        "unavailable",
        "PCV_AGY_BIN must be an existing executable at an absolute path.",
      );
    }
    return override;
  }
  const searchPath = (process.env.PATH ?? "")
    .split(delimiter)
    .filter(isAbsolute);
  if (process.platform !== "win32") {
    searchPath.push(join(homedir(), ".local", "bin"));
  }
  const binary = Bun.which(process.platform === "win32" ? "agy.exe" : "agy", {
    PATH: searchPath.join(delimiter),
  });
  return (
    binary ??
    new AgentError(
      "unavailable",
      "Antigravity CLI was not found. Install agy and add it to PATH.",
    )
  );
}

function normalizeUsage(usage: AcpUsage): JsonObject {
  const input = usage.inputTokens ?? usage.input_tokens;
  const output = usage.outputTokens ?? usage.output_tokens;
  const thinking = usage.thoughtTokens ?? usage.thinking_tokens;
  const cacheRead = usage.cachedReadTokens ?? usage.cache_read_tokens;
  const total =
    usage.totalTokens ??
    usage.total_tokens ??
    (input ?? 0) + (output ?? 0) + (thinking ?? 0);
  return {
    ...(input !== undefined && { input_tokens: input }),
    ...(output !== undefined && { output_tokens: output }),
    ...(thinking !== undefined && { thinking_tokens: thinking }),
    ...(cacheRead !== undefined && { cache_read_tokens: cacheRead }),
    total_tokens: total,
  };
}

function selectPermissionOption(params: JsonObject): JsonObject {
  const parsed = permissionRequestSchema.safeParse(params);
  const options = parsed.success ? (parsed.data.options ?? []) : [];
  const preferred =
    options.find((option) => option.kind === "allow_always") ??
    options.find((option) => option.kind === "allow_once") ??
    options[0];
  return preferred
    ? { outcome: { outcome: "selected", optionId: preferred.optionId } }
    : { outcome: { outcome: "cancelled" } };
}

/**
 * One Antigravity sub-agent run over `agy acp` (Agent Client Protocol stdio JSON-RPC 2.0 server).
 * Supports true mid-turn steering via concurrent `session/prompt` injection on the active session,
 * clean turn cancellation via `session/cancel`, and cross-run continuation via `session/resume`.
 */
export class AntigravityRun {
  private child: ChildProcessWithoutNullStreams | undefined;
  private nextRpcId = 1;
  private readonly pending = new Map<number | string, PendingRpc>();
  private threadId = "";
  private promptSeq = 0;
  private activePrompt: ActivePrompt | undefined;
  private output = "";
  private lastNonEmptyOutput = "";
  private sawToolSinceText = false;
  private needsResponseHeading = false;
  private stderr = "";
  private error: string | undefined;
  private interrupted = false;
  private ended = false;
  private processClosed = false;
  private closing: Promise<void> | undefined;
  private readonly exited = Promise.withResolvers<void>();
  private readonly finished = Promise.withResolvers<RunResult>();
  private readonly transcript: string;
  private readonly usageFile: string;

  constructor(
    dir: string,
    private readonly input: RunInput,
    private readonly onThread: (thread: string) => void,
    private readonly preamble = "",
  ) {
    const folder = agentDir(dir, input.name);
    this.transcript = join(folder, "transcript.md");
    this.usageFile = join(folder, "agy-usage.jsonl");
  }

  get thread(): string {
    return this.threadId;
  }

  async start(): Promise<void> {
    if (this.interrupted || this.ended) {
      this.end("interrupted");
      return;
    }
    const binary = resolveAgyBinary();
    if (binary instanceof AgentError) {
      return Promise.reject(binary);
    }

    const child = spawn(binary, ["acp", "--dangerously-skip-permissions"], {
      cwd: this.input.cwd,
      stdio: "pipe",
      detached: process.platform !== "win32",
    });
    this.child = child;

    const killOnExit = (): void => {
      this.signal("SIGKILL");
    };
    process.once("exit", killOnExit);
    child.once("close", (code, signal) => {
      process.removeListener("exit", killOnExit);
      this.processClosed = true;
      this.exited.resolve();
      const reason = this.failure(code, signal);
      this.rejectPending(reason);
      if (!this.ended) {
        this.end(
          this.interrupted ? "interrupted" : "failed",
          this.interrupted ? undefined : reason,
        );
      }
    });
    child.once("error", (error) => {
      this.error ??= error.message;
      this.rejectPending(error.message);
      if (!this.ended) {
        this.end("failed", this.formatDiagnostic(error.message));
      }
    });
    child.stdin.on("error", (error) => {
      if (!("code" in error) || error.code !== "EPIPE") {
        this.error ??= error.message;
      }
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      this.stderr = (this.stderr + chunk).slice(-8192);
    });
    createInterface({ input: child.stdout, crlfDelay: Infinity })
      .on("error", (error) => {
        this.error ??= error.message;
        void this.close();
      })
      .on("line", (line) => this.onLine(line));

    try {
      await this.rpcRequest(
        "initialize",
        {
          protocolVersion: 1,
          clientCapabilities: {},
          clientInfo: { name: "vibe-coding-agent", version: "0.2.0" },
        },
        INIT_TIMEOUT_MS,
      );

      if (this.input.resume) {
        const resumed = await this.rpcRequest(
          "session/resume",
          {
            sessionId: this.input.resume,
            cwd: this.input.cwd,
            mcpServers: [],
          },
          SESSION_OPEN_TIMEOUT_MS,
        );
        const parsed = sessionOpenedSchema.safeParse(resumed);
        this.threadId = parsed.success
          ? parsed.data.sessionId
          : this.input.resume;
      } else {
        const opened = sessionOpenedSchema.parse(
          await this.rpcRequest(
            "session/new",
            {
              cwd: this.input.cwd,
              mcpServers: [],
            },
            SESSION_OPEN_TIMEOUT_MS,
          ),
        );
        this.threadId = opened.sessionId;
      }

      this.onThread(this.threadId);

      await this.rpcRequest(
        "session/set_model",
        {
          sessionId: this.threadId,
          modelId: this.input.model ?? DEFAULT_ANTIGRAVITY_MODEL,
        },
        CONFIG_TIMEOUT_MS,
      );

      if (this.input.effort) {
        await this.rpcRequest(
          "session/set_config_option",
          {
            sessionId: this.threadId,
            configId: "thought_level",
            value: this.input.effort,
          },
          CONFIG_TIMEOUT_MS,
        );
      }

      if (this.interrupted || this.ended) {
        this.end("interrupted");
        return;
      }

      this.append(
        `\n## orchestrator\n\n${this.input.prompt}\n\n## antigravity\n\n`,
      );
      this.needsResponseHeading = false;

      const content =
        this.input.resume || !this.preamble.trim()
          ? this.input.prompt
          : `${this.preamble.trimEnd()}\n\n## Task\n\n${this.input.prompt}`;
      this.launchPrompt(content);
    } catch (error) {
      if (this.ended) {
        return;
      }
      await this.close();
      const raw = error instanceof Error ? error.message : String(error);
      const hint =
        this.input.resume && !this.threadId
          ? ` (continuing session ${this.input.resume}; --fresh starts a new conversation)`
          : "";
      return Promise.reject(
        new AgentError("unavailable", `${this.formatDiagnostic(raw)}${hint}`),
      );
    }
  }

  result(): Promise<RunResult> {
    return this.finished.promise;
  }

  /**
   * Steers a running Antigravity turn by sending a concurrent `session/prompt` on the same ACP session.
   * `agy acp` supersedes the previous prompt request immediately and injects the new message at the
   * agent's next step without killing an in-progress tool call or losing conversation context.
   */
  async say(message: string): Promise<void> {
    if (message.trim() === "") {
      return Promise.reject(new AgentError("invalid", "The message is empty."));
    }
    if (
      this.ended ||
      this.processClosed ||
      !this.threadId ||
      !this.activePrompt
    ) {
      return Promise.reject(
        new AgentError(
          "conflict",
          `Agent "${this.input.name}" has no running turn.`,
        ),
      );
    }
    const previous = this.activePrompt;
    this.append(
      `\n\n## orchestrator (mid-turn)\n\n${message}\n\n## antigravity\n\n`,
    );
    this.needsResponseHeading = false;
    this.sawToolSinceText = true;
    const next = this.launchPrompt(message);

    let ackTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        previous.settled,
        next.failed,
        new Promise<void>((resolve) => {
          ackTimer = setTimeout(resolve, STEER_ACK_TIMEOUT_MS);
        }),
      ]);
    } catch (error) {
      return Promise.reject(
        new AgentError(
          "unavailable",
          `Steering "${this.input.name}" failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    } finally {
      clearTimeout(ackTimer);
    }
    if (this.error || (this.processClosed && !this.ended)) {
      return Promise.reject(
        new AgentError(
          "unavailable",
          `Steering "${this.input.name}" failed: ${this.error ?? "the agent exited."}`,
        ),
      );
    }
  }

  async interrupt(): Promise<boolean> {
    if (this.ended || this.processClosed) {
      return false;
    }
    this.interrupted = true;
    if (this.threadId && this.activePrompt) {
      this.rpcNotify("session/cancel", { sessionId: this.threadId });
      return true;
    }
    return this.signal("SIGTERM");
  }

  cancel(): void {
    this.interrupted = true;
    if (this.threadId && !this.processClosed) {
      this.rpcNotify("session/cancel", { sessionId: this.threadId });
    }
    this.end("interrupted");
    void this.close();
  }

  async close(): Promise<void> {
    const child = this.child;
    if (!child || this.processClosed) {
      return;
    }
    this.closing ??= (async (): Promise<void> => {
      try {
        child.stdin.end();
      } catch {
        // Stdin already closed.
      }
      this.signal("SIGTERM");
      const timer = setTimeout(() => {
        this.signal("SIGKILL");
      }, SHUTDOWN_KILL_TIMEOUT_MS);
      try {
        await this.exited.promise;
      } finally {
        clearTimeout(timer);
        if (process.platform !== "win32") {
          this.signal("SIGKILL");
        }
      }
    })();
    await this.closing;
  }

  private launchPrompt(content: string): ActivePrompt {
    const seq = ++this.promptSeq;
    const settled = Promise.withResolvers<void>();
    const failed = Promise.withResolvers<never>();
    // Prevent unhandled rejection if no caller races on `failed`.
    failed.promise.catch(() => undefined);

    const request = this.rpcRequest(
      "session/prompt",
      {
        sessionId: this.threadId,
        prompt: [{ type: "text", text: content }],
      },
      undefined,
    );

    const handle: ActivePrompt = {
      seq,
      settled: settled.promise,
      failed: failed.promise,
    };
    this.activePrompt = handle;

    void request.then(
      (result) => {
        settled.resolve();
        this.onPromptSettled(seq, result);
        return undefined;
      },
      (error: Error) => {
        settled.resolve();
        failed.reject(error);
        this.onPromptFailed(seq, error);
        return undefined;
      },
    );
    return handle;
  }

  private onPromptSettled(seq: number, rawResult: Json): void {
    const parsed = promptResultSchema.safeParse(rawResult);
    const usage = parsed.success ? parsed.data.usage : undefined;
    if (usage) {
      appendFileSync(
        this.usageFile,
        `${JSON.stringify({ captured_at: Math.floor(Date.now() / 1000), usage: normalizeUsage(usage) })}\n`,
        { mode: 0o600 },
      );
    }
    // Superseded by a newer mid-turn `say()` prompt: keep the run alive for the newer turn.
    if (seq !== this.promptSeq || this.ended) {
      return;
    }
    const stopReason = parsed.success ? parsed.data.stopReason : undefined;
    if (this.interrupted || stopReason === "cancelled") {
      this.end("interrupted");
      return;
    }
    this.end("completed");
  }

  private onPromptFailed(seq: number, error: Error): void {
    if (seq !== this.promptSeq || this.ended) {
      return;
    }
    if (this.interrupted) {
      this.end("interrupted");
      return;
    }
    this.error ??= error.message;
    this.end("failed", this.formatDiagnostic(error.message));
  }

  private rpcRequest(
    method: string,
    params: JsonObject,
    timeoutMs: number | undefined,
  ): Promise<Json> {
    if (!this.child || this.processClosed) {
      return Promise.reject(
        new Error("Antigravity ACP server is not running."),
      );
    }
    const id = this.nextRpcId++;
    return new Promise<Json>((resolve, reject) => {
      const timer =
        timeoutMs === undefined
          ? undefined
          : setTimeout(() => {
              this.pending.delete(id);
              reject(
                new Error(
                  `${method}: Antigravity ACP did not answer within ${timeoutMs}ms`,
                ),
              );
            }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      try {
        this.writeJson({ jsonrpc: "2.0", id, method, params });
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private rpcNotify(method: string, params: JsonObject): void {
    if (!this.child || this.processClosed) {
      return;
    }
    try {
      this.writeJson({ jsonrpc: "2.0", method, params });
    } catch {
      // Transport is closing.
    }
  }

  private writeJson(payload: JsonObject): void {
    if (!this.child || this.processClosed) {
      return;
    }
    this.child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  private onLine(line: string): void {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    let json: Json;
    try {
      json = JSON.parse(trimmed);
    } catch {
      return;
    }
    const parsed = acpIncomingSchema.safeParse(json);
    if (!parsed.success) {
      return;
    }
    const message = parsed.data;
    if (message.method !== undefined) {
      if (message.id === undefined) {
        try {
          this.onNotification(message.method, message.params ?? {});
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          this.error ??= reason;
          this.end("failed", reason);
          void this.close();
        }
        return;
      }
      this.onServerRequest(message.id, message.method, message.params ?? {});
      return;
    }
    if (message.id === undefined) {
      return;
    }
    const waiter = this.pending.get(message.id);
    if (!waiter) {
      return;
    }
    this.pending.delete(message.id);
    clearTimeout(waiter.timer);
    if (message.error) {
      waiter.reject(
        new Error(
          message.error.message ?? `ACP error ${message.error.code ?? ""}`,
        ),
      );
    } else {
      waiter.resolve(message.result ?? null);
    }
  }

  private onNotification(method: string, params: JsonObject): void {
    if (this.ended || method !== "session/update") {
      return;
    }
    const parsed = sessionUpdateSchema.safeParse(params);
    if (!parsed.success) {
      return;
    }
    const { sessionId, update } = parsed.data;
    if (sessionId && this.threadId && sessionId !== this.threadId) {
      return;
    }
    if (!update) {
      return;
    }
    switch (update.sessionUpdate) {
      case "agent_message_chunk": {
        const text = update.content?.text;
        if (!text) {
          return;
        }
        if (this.sawToolSinceText) {
          this.output = "";
          this.sawToolSinceText = false;
        }
        if (this.needsResponseHeading) {
          this.append("\n## antigravity\n\n");
          this.needsResponseHeading = false;
        }
        this.append(text);
        this.output += text;
        if (this.output.trim()) {
          this.lastNonEmptyOutput = this.output;
        }
        break;
      }
      case "tool_call": {
        if (this.output.trim()) {
          this.lastNonEmptyOutput = this.output;
          this.sawToolSinceText = true;
        }
        if (update.title) {
          this.append(
            `\n- \`${oneLine(update.title, 200)}\` (${update.status ?? "running"})\n`,
          );
          this.needsResponseHeading = true;
        }
        break;
      }
      case "tool_call_update": {
        if (update.title && update.status && update.status !== "in_progress") {
          this.append(
            `- \`${oneLine(update.title, 200)}\` -> ${update.status}\n`,
          );
          this.needsResponseHeading = true;
        }
        break;
      }
    }
  }

  private onServerRequest(
    id: number | string,
    method: string,
    params: JsonObject,
  ): void {
    if (this.processClosed) {
      return;
    }
    if (method === "session/request_permission") {
      this.writeJson({
        jsonrpc: "2.0",
        id,
        result: selectPermissionOption(params),
      });
      return;
    }
    this.writeJson({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: `${method} is not supported by the sub-agent runner`,
      },
    });
  }

  private rejectPending(reason: string): void {
    for (const waiter of this.pending.values()) {
      clearTimeout(waiter.timer);
      waiter.reject(new Error(reason));
    }
    this.pending.clear();
  }

  private append(text: string): void {
    appendFileSync(this.transcript, text, { mode: 0o600 });
  }

  private end(status: RunResult["status"], error?: string): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.activePrompt = undefined;
    this.finished.resolve({
      name: this.input.name,
      threadId: this.threadId,
      status,
      message: (this.output.trim()
        ? this.output
        : this.lastNonEmptyOutput
      ).trim(),
      error,
    });
  }

  private formatDiagnostic(diagnostic: string): string {
    const text = diagnostic || this.stderr.trim();
    if (AUTH_ERROR_PATTERN.test(text)) {
      return "Antigravity authentication failed. Run agy acp --login in a terminal.";
    }
    return text;
  }

  private failure(code: number | null, signal: NodeJS.Signals | null): string {
    const diagnostic = this.formatDiagnostic(this.error || this.stderr.trim());
    return (
      diagnostic ||
      `Antigravity ACP exited with ${code ?? signal} before the turn completed.`
    );
  }

  private signal(signal: NodeJS.Signals): boolean {
    const child = this.child;
    if (child?.pid === undefined) {
      return false;
    }
    try {
      if (process.platform !== "win32") {
        process.kill(-child.pid, signal);
        return true;
      }
      return child.kill(signal);
    } catch {
      return false;
    }
  }
}
