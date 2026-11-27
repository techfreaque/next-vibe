/**
 * JSON-RPC 2.0 over line-delimited JSON, the transport of `codex app-server` on stdio. The wire format leaves out the
 * `jsonrpc` member, so it is not required on input.
 */

import type { z } from "zod";

import { incomingSchema, type Json, type JsonObject } from "./protocol";

export interface RpcTransport {
  write(line: string): void;
  close(): void | Promise<void>;
  onLine(listener: (line: string) => void): void;
  onClose(listener: (reason: string) => void): void;
}

export interface RpcHandlers {
  onNotification(method: string, params: JsonObject): void;
  /** A request of the server (an approval, a question). The returned object is the result. */
  onRequest(method: string): Promise<JsonObject>;
}

export class RpcError extends Error {
  readonly code: number | undefined;
  constructor(message: string, code?: number) {
    super(message);
    this.name = "RpcError";
    this.code = code;
  }
}

interface Waiter {
  resolve(value: Json): void;
  reject(error: Error): void;
  timer: ReturnType<typeof setTimeout>;
}

export class JsonRpcClient {
  private nextId = 1;
  private readonly pending = new Map<number | string, Waiter>();
  private closed = false;

  constructor(
    private readonly transport: RpcTransport,
    private readonly handlers: RpcHandlers,
    private readonly requestTimeoutMs = 30_000,
  ) {
    transport.onLine((line) => this.receive(line));
    transport.onClose((reason) => this.fail(reason));
  }

  request(
    method: string,
    params: JsonObject = {},
    timeoutMs = this.requestTimeoutMs,
  ): Promise<Json> {
    if (this.closed) {
      return Promise.reject(new RpcError("app-server is not running"));
    }
    const id = this.nextId++;
    return new Promise<Json>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(
          new RpcError(
            `${method}: app-server did not answer within ${timeoutMs}ms`,
          ),
        );
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      try {
        this.transport.write(JSON.stringify({ id, method, params }));
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  /** A request whose result is checked against a schema. */
  async requestAs<T>(
    method: string,
    params: JsonObject,
    schema: z.ZodType<T>,
    timeoutMs?: number,
  ): Promise<T> {
    const parsed = schema.safeParse(
      await this.request(method, params, timeoutMs),
    );
    if (!parsed.success) {
      return Promise.reject(
        new RpcError(
          `${method}: unexpected result (${parsed.error.issues[0]?.message ?? "invalid"})`,
        ),
      );
    }
    return parsed.data;
  }

  notify(method: string, params?: JsonObject): void {
    if (!this.closed) {
      this.transport.write(
        JSON.stringify(params === undefined ? { method } : { method, params }),
      );
    }
  }

  async close(): Promise<void> {
    this.fail("closed by the runner");
    await this.transport.close();
  }

  private fail(reason: string): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    for (const waiter of this.pending.values()) {
      clearTimeout(waiter.timer);
      waiter.reject(new RpcError(`app-server exited: ${reason}`));
    }
    this.pending.clear();
  }

  private receive(line: string): void {
    let json: Json;
    try {
      json = JSON.parse(line);
    } catch {
      return;
    }
    const parsed = incomingSchema.safeParse(json);
    if (!parsed.success) {
      return;
    }
    const message = parsed.data;
    if (this.closed) {
      return;
    }
    if (message.method !== undefined) {
      if (message.id === undefined) {
        this.handlers.onNotification(message.method, message.params ?? {});
        return;
      }
      const id = message.id;
      this.handlers
        .onRequest(message.method)
        .then((result) => {
          if (!this.closed) {
            this.transport.write(JSON.stringify({ id, result }));
          }
          return undefined;
        })
        .catch((error) => {
          if (!this.closed) {
            this.transport.write(
              JSON.stringify({
                id,
                error: {
                  code: -32601,
                  message:
                    error instanceof Error ? error.message : String(error),
                },
              }),
            );
          }
        });
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
        new RpcError(
          message.error.message ?? "request failed",
          message.error.code,
        ),
      );
    } else {
      waiter.resolve(message.result ?? null);
    }
  }
}
