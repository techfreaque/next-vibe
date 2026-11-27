import { appendFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { agentDir, transcriptTail } from "../../runtime/paths";
import { AgentError, type RunResult, type Sandbox } from "../../types";
import { isFinalAnswer, transcriptEntry } from "./events";
import {
  errorNotificationSchema,
  itemCompletedSchema,
  type JsonObject,
  threadOpenedSchema,
  turnCompletedSchema,
  type TurnResult,
  turnStartedResultSchema,
  turnStartedSchema,
} from "./protocol";
import { JsonRpcClient, type RpcTransport } from "./rpc";

export interface RunPorts {
  /** The state directory. */
  dir: string;
  /** Starts a `codex app-server` and returns its stdio as a transport. */
  connect(): RpcTransport | AgentError;
  /** The instructions every agent gets besides AGENTS.md and the skills. */
  preamble(): string;
  /** Extra Codex configuration for the thread, such as the approval mode of the MCP servers. */
  config?(): JsonObject | undefined;
  onThread?(threadId: string): void;
}

export interface RunInput {
  name: string;
  prompt: string;
  cwd: string;
  model?: string | undefined;
  effort?: string | undefined;
  sandbox: Sandbox;
  /** A saved provider conversation to continue. */
  resume?: string | undefined;
}

const text = (value: string): JsonObject[] => [
  { type: "text", text: value, text_elements: [] },
];

/** Opening a thread waits for the required MCP servers, which may take up to their `startup_timeout_sec` (120 s). */
const THREAD_OPEN_TIMEOUT_MS = 180_000;

/**
 * One Codex sub-agent: its own `codex app-server`, one thread, one turn. Lives as long as the command that runs it, so
 * it ends with that command: when the orchestrator waits for it, or when the background command is killed.
 */
export class AgentRun {
  private rpc?: JsonRpcClient;
  private threadId = "";
  private turnId?: string | undefined;
  private lastText = "";
  private finalText = "";
  private lastError?: string | undefined;
  private readonly finished = Promise.withResolvers<RunResult>();
  private ended = false;

  constructor(
    private readonly ports: RunPorts,
    private readonly input: RunInput,
  ) {
    mkdirSync(agentDir(ports.dir, input.name), {
      recursive: true,
      mode: 0o700,
    });
  }

  get thread(): string {
    return this.threadId;
  }

  /** Connects, opens (or resumes) the thread and starts the turn. The result comes from `result()`. */
  async start(): Promise<void> {
    if (this.ended) {
      return;
    }
    const { input } = this;
    if (!statSync(input.cwd, { throwIfNoEntry: false })?.isDirectory()) {
      return Promise.reject(
        new AgentError(
          "not_found",
          `Working directory ${input.cwd} is not a directory.`,
        ),
      );
    }
    const transport = this.ports.connect();
    if (transport instanceof AgentError) {
      return Promise.reject(transport);
    }
    const rpc = new JsonRpcClient(transport, {
      onNotification: (method, params): void => {
        try {
          this.onNotification(method, params);
        } catch (error) {
          this.end(
            "failed",
            `Cannot record the agent's output: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      },
      onRequest: (method): Promise<JsonObject> => this.onServerRequest(method),
    });
    this.rpc = rpc;
    transport.onClose((reason) =>
      this.end("failed", `app-server exited: ${reason}`),
    );
    try {
      await rpc.request("initialize", {
        clientInfo: {
          name: "vibe-coding-agent",
          title: null,
          version: "0.2.0",
        },
      });
      rpc.notify("initialized");
      const common: JsonObject = {
        cwd: input.cwd,
        model: input.model,
        sandbox: input.sandbox,
        approvalPolicy: "never",
        config: {
          ...this.ports.config?.(),
          ...(input.effort && { model_reasoning_effort: input.effort }),
        },
      };
      const opened = input.resume
        ? await rpc.requestAs(
            "thread/resume",
            { threadId: input.resume, excludeTurns: true, ...common },
            threadOpenedSchema,
            THREAD_OPEN_TIMEOUT_MS,
          )
        : await rpc.requestAs(
            "thread/start",
            {
              ...common,
              developerInstructions: this.ports.preamble(),
              serviceName: "vibe-coding-agent",
            },
            threadOpenedSchema,
            THREAD_OPEN_TIMEOUT_MS,
          );
      this.threadId = opened.thread.id;
      this.ports.onThread?.(this.threadId);
      this.transcript(`## orchestrator\n\n${input.prompt}\n`);
      const turn = await rpc.requestAs(
        "turn/start",
        {
          threadId: this.threadId,
          input: text(input.prompt),
          effort: input.effort,
        },
        turnStartedResultSchema,
      );
      if (!this.ended) {
        this.turnId ??= turn.turn.id;
        if (turn.turn.status && turn.turn.status !== "inProgress") {
          this.completeTurn({ ...turn.turn, status: turn.turn.status });
        }
      }
    } catch (error) {
      if (this.ended) {
        return;
      }
      await this.close();
      const hint =
        input.resume && !this.threadId
          ? ` (continuing thread ${input.resume}; --fresh starts a new conversation)`
          : "";
      return Promise.reject(
        new AgentError(
          "unavailable",
          `Cannot start the agent: ${error instanceof Error ? error.message : String(error)}${hint}`,
        ),
      );
    }
  }

  result(): Promise<RunResult> {
    return this.finished.promise;
  }

  /** Puts a message into the running turn. */
  async say(message: string): Promise<void> {
    if (message.trim() === "") {
      return Promise.reject(new AgentError("invalid", "The message is empty."));
    }
    if (this.ended || !this.rpc || !this.turnId) {
      return Promise.reject(
        new AgentError(
          "conflict",
          `Agent "${this.input.name}" has no running turn.`,
        ),
      );
    }
    try {
      await this.rpc.request("turn/steer", {
        threadId: this.threadId,
        expectedTurnId: this.turnId,
        input: text(message),
      });
    } catch (error) {
      return Promise.reject(
        new AgentError(
          "unavailable",
          `Steering "${this.input.name}" failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
    this.transcript(`## orchestrator (mid-turn)\n\n${message}\n`);
  }

  async interrupt(): Promise<boolean> {
    if (this.ended || !this.rpc || !this.turnId) {
      return false;
    }
    await this.rpc.request("turn/interrupt", {
      threadId: this.threadId,
      turnId: this.turnId,
    });
    return true;
  }

  /** Cancellation of the command must also stop startup or an unresponsive app-server. */
  cancel(): void {
    this.end("interrupted");
    void this.close();
  }

  async close(): Promise<void> {
    await this.rpc?.close();
  }

  tail(lines: number): string {
    return transcriptTail(this.ports.dir, this.input.name, lines);
  }

  // ---- notifications -----------------------------------------------------------------------------------------

  /** A notification of another thread (the app-server can serve several) is none of ours. */
  private isOurs(threadId: string): boolean {
    return threadId === this.threadId;
  }

  private onNotification(method: string, params: JsonObject): void {
    if (this.ended) {
      return;
    }
    switch (method) {
      case "turn/started": {
        const parsed = turnStartedSchema.safeParse(params);
        if (parsed.success && this.isOurs(parsed.data.threadId)) {
          this.turnId = parsed.data.turn.id;
        }
        break;
      }
      case "item/completed": {
        const parsed = itemCompletedSchema.safeParse(params);
        if (!parsed.success || !this.isOurs(parsed.data.threadId)) {
          break;
        }
        const { item } = parsed.data;
        const entry = transcriptEntry(item);
        if (entry) {
          this.transcript(entry);
        }
        if (item.type === "agentMessage" && item.text) {
          this.lastText = item.text;
          if (isFinalAnswer(item)) {
            this.finalText = item.text;
          }
        }
        break;
      }
      case "error": {
        const parsed = errorNotificationSchema.safeParse(params);
        if (
          parsed.success &&
          (parsed.data.threadId === undefined ||
            this.isOurs(parsed.data.threadId)) &&
          parsed.data.willRetry !== true
        ) {
          this.lastError = parsed.data.error?.message;
        }
        break;
      }
      case "turn/completed": {
        const parsed = turnCompletedSchema.safeParse(params);
        if (!parsed.success || !this.isOurs(parsed.data.threadId)) {
          break;
        }
        this.completeTurn(parsed.data.turn);
        break;
      }
    }
  }

  private completeTurn(turn: TurnResult): void {
    if (turn.id && this.turnId && turn.id !== this.turnId) {
      return;
    }
    // Completion can include a final answer even if item events were missed.
    const final = turn.items?.findLast(isFinalAnswer)?.text;
    if (final && final !== this.finalText) {
      this.finalText = final;
      if (final !== this.lastText) {
        this.transcript(`## agent\n\n${final}\n`);
      }
    }
    switch (turn.status) {
      case "interrupted":
        this.end("interrupted");
        break;
      case "failed":
        this.end(
          "failed",
          turn.error?.message ?? this.lastError ?? "turn failed",
        );
        break;
      case "completed":
        this.end("completed");
        break;
      default:
        this.end("failed", `Unexpected turn status: ${turn.status}`);
    }
  }

  private onServerRequest(method: string): Promise<JsonObject> {
    // Agents run without approvals; anything that still asks is refused rather than left hanging.
    if (method.endsWith("requestApproval")) {
      return Promise.resolve({ decision: "decline" });
    }
    return Promise.reject(
      new Error(`${method} is not supported by the sub-agent runner`),
    );
  }

  private end(status: RunResult["status"], error?: string): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.turnId = undefined;
    this.finished.resolve({
      name: this.input.name,
      threadId: this.threadId,
      status,
      message: this.finalText || this.lastText,
      error,
    });
  }

  private transcript(entry: string): void {
    appendFileSync(
      join(agentDir(this.ports.dir, this.input.name), "transcript.md"),
      `${entry}\n`,
      {
        mode: 0o600,
      },
    );
  }
}
