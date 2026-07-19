/**
 * tsgo LSP daemon client.
 *
 * Keeps a single warm `tsgo --lsp --stdio` process alive across vibe check
 * calls by running it as a detached background process bridged through a Unix
 * socket. The first caller spawns the bridge; subsequent callers connect to it.
 *
 * Architecture:
 *   [vibe check] ←→ Unix socket ←→ [bridge process] ←→ tsgo --lsp --stdio
 *
 * Bridge process (this file, when run as __DAEMON_MODE__):
 *   - Spawns tsgo --lsp --stdio as a child
 *   - Listens on a Unix socket
 *   - Multiplexes messages between all connected clients and the single tsgo process
 *
 * Client mode (normal import):
 *   - Connects to the socket
 *   - Performs LSP handshake on first connection
 *   - Pulls textDocument/diagnostic per file (no didOpen needed)
 *
 * tsgo discovers the project from tsconfig.json on the first pull (cold ~1-2s),
 * keeps the type graph in memory, then serves subsequent pulls from cache.
 */

import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import type { Socket } from "node:net";
import { createConnection, createServer } from "node:net";
import { dirname, join, relative, resolve as resolvePath } from "node:path";

// ============================================================
// LSP framing
// ============================================================

interface LspMessage {
  jsonrpc: "2.0";
  id?: number | string;
  method?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- LSP params are heterogeneous
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- LSP result is heterogeneous
  result?: any;
  error?: { code: number; message: string };
}

function encode(msg: LspMessage): Buffer {
  const body = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n`;
  return Buffer.from(header + body, "utf8");
}

class LspReader {
  private buf = Buffer.alloc(0);
  private readonly handlers: Array<(msg: LspMessage) => void> = [];

  onMessage(fn: (msg: LspMessage) => void): void {
    this.handlers.push(fn);
  }

  feed(chunk: Buffer): void {
    this.buf = Buffer.concat([this.buf, chunk]);
    this.drain();
  }

  private drain(): void {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const sep = this.buf.indexOf("\r\n\r\n");
      if (sep === -1) {
        return;
      }
      const header = this.buf.subarray(0, sep).toString("utf8");
      const lenMatch = /Content-Length:\s*(\d+)/i.exec(header);
      if (!lenMatch) {
        this.buf = this.buf.subarray(sep + 4);
        continue;
      }
      const len = parseInt(lenMatch[1], 10);
      if (this.buf.length < sep + 4 + len) {
        return;
      }
      const body = this.buf.subarray(sep + 4, sep + 4 + len).toString("utf8");
      this.buf = this.buf.subarray(sep + 4 + len);
      try {
        const msg = JSON.parse(body) as LspMessage;
        for (const h of this.handlers) {
          h(msg);
        }
      } catch {
        // malformed frame — skip
      }
    }
  }
}

// ============================================================
// Public types
// ============================================================

export interface LspIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

interface LspDiagnosticItem {
  range: { start: { line: number; character: number } };
  severity?: 1 | 2 | 3 | 4;
  code?: string | number;
  message: string;
}

// ============================================================
// Bridge (daemon mode) — runs as a detached background process
// ============================================================

function runBridge(
  tsgoPath: string,
  projectRoot: string,
  sockPath: string,
  pidPath: string,
): void {
  const tsgoChild = spawn(tsgoPath, ["--lsp", "--stdio"], {
    cwd: projectRoot,
    stdio: ["pipe", "pipe", "ignore"],
    detached: false,
  });

  const tsgoReader = new LspReader();
  const clients = new Set<Socket>();

  // Cached initialize result to replay for new clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- LSP InitializeResult is dynamic
  let initResult: any = null;
  let bridgeInitId: number | string | null = null;

  // Queued client initialize requests received before tsgo replied to the bridge's own initialize
  const pendingInits: Array<{ client: Socket; id: number | string }> = [];

  // Track which URIs tsgo has seen via didOpen — clients can skip didOpen + settle for these
  const openedUris = new Set<string>();

  // Cache of all publishDiagnostics received, keyed by URI — replayed to new clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- diagnostic items are heterogeneous
  const diagCache = new Map<string, any[]>();

  // Pending responses from tsgo keyed by id — routed back to originating client
  const pending = new Map<
    number | string,
    { client: Socket; clientId: number | string }
  >();

  // tsgo → clients (route responses back to originating client; broadcast notifications)
  tsgoChild.stdout?.on("data", (chunk: Buffer) => {
    tsgoReader.feed(chunk);
  });

  tsgoReader.onMessage((msg) => {
    const id = msg.id;
    const method = msg.method;

    // Response to the bridge's own initialize
    if (id !== undefined && id === bridgeInitId) {
      initResult = msg.result;
      bridgeInitId = null;
      if (tsgoChild.stdin) {
        tsgoChild.stdin.write(
          encode({ jsonrpc: "2.0", method: "initialized", params: {} }),
        );
        tsgoChild.stdin.write(
          encode({
            jsonrpc: "2.0",
            method: "workspace/didChangeConfiguration",
            params: { settings: null },
          }),
        );
      }
      // Flush any client initialize requests that arrived before we were ready
      for (const { client, id: clientId } of pendingInits) {
        if (!client.destroyed) {
          client.write(
            encode({ jsonrpc: "2.0", id: clientId, result: initResult }),
          );
        }
      }
      pendingInits.length = 0;
      return;
    }

    // Server→client requests during handshake — reply on behalf of all clients
    if (method === "workspace/configuration" && id !== undefined) {
      const items: Array<{ section?: string }> = msg.params?.items ?? [];
      if (tsgoChild.stdin) {
        tsgoChild.stdin.write(
          encode({
            jsonrpc: "2.0",
            id,
            result: Array.from({ length: items.length }, () => null),
          }),
        );
      }
      return;
    }

    if (method === "client/registerCapability" && id !== undefined) {
      if (tsgoChild.stdin) {
        tsgoChild.stdin.write(encode({ jsonrpc: "2.0", id, result: null }));
      }
      return;
    }

    // Response to a client request — route back to that client
    if (id !== undefined && id !== null && !method) {
      const entry = pending.get(id);
      if (entry) {
        pending.delete(id);
        if (!entry.client.destroyed) {
          entry.client.write(encode({ ...msg, id: entry.clientId }));
        }
      }
      return;
    }

    // Cache publishDiagnostics so new clients get replayed the full state
    if (method === "textDocument/publishDiagnostics") {
      const uri = msg.params?.uri as string | undefined;
      if (uri) {
        diagCache.set(uri, msg.params?.diagnostics ?? []);
      }
    }

    // Notification (publishDiagnostics, etc.) — broadcast to all clients
    const frame = encode(msg);
    for (const client of clients) {
      if (!client.destroyed) {
        client.write(frame);
      }
    }
  });

  tsgoChild.on("exit", () => {
    for (const client of clients) {
      client.destroy();
    }
    rmSync(sockPath, { force: true });
    rmSync(pidPath, { force: true });
    process.exit(0);
  });

  // Shared request counter for bridge → tsgo requests
  let bridgeReqId = 100_000;

  // clients → tsgo (intercept initialize, proxy everything else)
  const server = createServer((client) => {
    clients.add(client);

    // Notify the client which URIs are already open in tsgo — warm path optimization
    if (openedUris.size > 0) {
      client.write(
        encode({
          jsonrpc: "2.0",
          method: "$/bridge/openedUris",
          params: { uris: [...openedUris] },
        }),
      );
    }

    // Replay cached publishDiagnostics so new clients get the full diagnostic state,
    // then send a sentinel so the client knows replay is complete.
    for (const [uri, diagnostics] of diagCache) {
      client.write(
        encode({
          jsonrpc: "2.0",
          method: "textDocument/publishDiagnostics",
          params: { uri, diagnostics },
        }),
      );
    }
    client.write(
      encode({
        jsonrpc: "2.0",
        method: "$/bridge/diagReplayDone",
        params: { count: diagCache.size },
      }),
    );

    const clientReader = new LspReader();

    client.on("data", (chunk: Buffer) => {
      clientReader.feed(chunk);
    });

    clientReader.onMessage((msg) => {
      // Intercept initialize — reply from cache or queue until tsgo is ready
      if (msg.method === "initialize" && msg.id !== undefined) {
        if (initResult !== null) {
          client.write(
            encode({ jsonrpc: "2.0", id: msg.id, result: initResult }),
          );
        } else {
          pendingInits.push({ client, id: msg.id });
        }
        return;
      }

      // Swallow initialized / workspace/didChangeConfiguration — already sent once
      if (
        msg.method === "initialized" ||
        msg.method === "workspace/didChangeConfiguration"
      ) {
        return;
      }

      if (!tsgoChild.stdin || tsgoChild.killed) {
        return;
      }

      // Track opened URIs for warm-path optimization
      if (msg.method === "textDocument/didOpen") {
        const uri = msg.params?.textDocument?.uri as string | undefined;
        if (uri) {
          openedUris.add(uri);
        }
      }

      // For requests (have id): remap id to a unique bridge id, track for routing back
      if (msg.id !== undefined && msg.id !== null) {
        const bridgeId = bridgeReqId++;
        pending.set(bridgeId, { client, clientId: msg.id });
        tsgoChild.stdin.write(encode({ ...msg, id: bridgeId }));
      } else {
        // Notification — forward as-is
        tsgoChild.stdin.write(encode(msg));
      }
    });

    client.on("close", () => {
      clients.delete(client);
    });

    client.on("error", () => {
      clients.delete(client);
    });
  });

  if (existsSync(sockPath)) {
    rmSync(sockPath, { force: true });
  }

  server.listen(sockPath, () => {
    writeFileSync(pidPath, String(process.pid), "utf8");

    // Bridge performs the one-time initialize with tsgo.
    // Capabilities mirror what the VSCode native-preview extension sends so tsgo
    // pushes publishDiagnostics for source files (not just tsconfig.json).
    bridgeInitId = 1;
    const rootUri = `file://${projectRoot}`;
    if (tsgoChild.stdin) {
      tsgoChild.stdin.write(
        encode({
          jsonrpc: "2.0",
          id: bridgeInitId,
          method: "initialize",
          params: {
            processId: process.pid,
            rootUri,
            capabilities: {
              workspace: {
                workspaceFolders: true,
                didChangeConfiguration: { dynamicRegistration: true },
                configuration: true,
                diagnostics: { refreshSupport: true },
              },
              textDocument: {
                publishDiagnostics: {
                  relatedInformation: true,
                  versionSupport: false,
                  tagSupport: { valueSet: [1, 2] },
                  codeDescriptionSupport: true,
                  dataSupport: true,
                },
                diagnostic: {
                  relatedInformation: true,
                  tagSupport: { valueSet: [1, 2] },
                  codeDescriptionSupport: true,
                  dataSupport: true,
                  dynamicRegistration: true,
                  relatedDocumentSupport: false,
                  markupMessageSupport: false,
                },
              },
            },
            workspaceFolders: [{ uri: rootUri, name: "root" }],
          },
        }),
      );
    }
  });

  server.on("error", () => {
    process.exit(1);
  });
}

// ============================================================
// Client
// ============================================================

export class TsgoDaemon {
  private static instances = new Map<string, TsgoDaemon>();

  private socket: Socket | null = null;
  private reader = new LspReader();
  private nextId = 1;
  private initialized = false;

  private pendingRequests = new Map<
    number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- LSP results are heterogeneous
    { resolve: (r: any) => void; reject: (e: Error) => void }
  >();

  /** Resolves when bridge has finished replaying openedUris + diagCache */
  private replayDoneResolve: (() => void) | null = null;
  private replayDone = false;

  private constructor(
    private readonly pidPath: string,
    private readonly tsgoPath: string,
    private readonly projectRoot: string,
  ) {}

  static get(
    pidPath: string,
    tsgoPath: string,
    projectRoot: string,
  ): TsgoDaemon {
    const existing = TsgoDaemon.instances.get(pidPath);
    if (existing) {
      return existing;
    }
    const inst = new TsgoDaemon(pidPath, tsgoPath, projectRoot);
    TsgoDaemon.instances.set(pidPath, inst);
    return inst;
  }

  /** Kill the bridge process for the given pid file and clean up socket+pid. */
  static kill(pidPath: string): void {
    const sockPath = pidPath.replace(/\.pid$/, ".sock");
    try {
      if (existsSync(pidPath)) {
        const pid = parseInt(readFileSync(pidPath, "utf8").trim(), 10);
        if (pid && !isNaN(pid)) {
          try {
            process.kill(pid, "SIGTERM");
          } catch {
            // already dead
          }
        }
        rmSync(pidPath, { force: true });
      }
    } catch {
      // ignore
    }
    rmSync(sockPath, { force: true });
    // Drop any cached instance so the next call spawns fresh
    TsgoDaemon.instances.delete(pidPath);
  }

  // --------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------

  async ensureRunning(): Promise<void> {
    if (this.socket && !this.socket.destroyed && this.initialized) {
      return;
    }
    await this.connect();
  }

  private sockPath(): string {
    return this.pidPath.replace(/\.pid$/, ".sock");
  }

  private isBridgeAlive(): boolean {
    if (!existsSync(this.pidPath)) {
      return false;
    }
    try {
      const pid = parseInt(readFileSync(this.pidPath, "utf8").trim(), 10);
      if (!pid || isNaN(pid)) {
        return false;
      }
      // Signal 0 checks if the process exists without sending a signal
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  private spawnBridge(): void {
    // Spawn this same file as a background bridge process
    const bridgeArgs = [
      "--tsgo",
      this.tsgoPath,
      "--root",
      this.projectRoot,
      "--sock",
      this.sockPath(),
      "--pid",
      this.pidPath,
    ];

    const bridge = spawn(
      process.execPath, // bun or node
      [__filename, "__DAEMON_MODE__", ...bridgeArgs],
      {
        cwd: this.projectRoot,
        stdio: "ignore",
        detached: true,
      },
    );
    bridge.unref();
  }

  private async waitForSocket(timeoutMs = 10_000): Promise<boolean> {
    const sock = this.sockPath();
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (existsSync(sock)) {
        return true;
      }
      // eslint-disable-next-line no-promise-executor-return -- setTimeout doesn't return a meaningful value
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
    }
    return false;
  }

  private async connect(): Promise<void> {
    // Clean up stale socket if bridge died
    const sock = this.sockPath();

    if (!this.isBridgeAlive()) {
      rmSync(this.pidPath, { force: true });
      rmSync(sock, { force: true });
      this.spawnBridge();
      const appeared = await this.waitForSocket();
      if (!appeared) {
        return; // bridge failed to start; getDiagnostics will return empty
      }
    }

    // Retry loop: the socket file may appear slightly before the bridge is
    // actually listen()-ready, so retry a few times with a short backoff.
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (attempt > 0) {
        await new Promise<void>((resolve) => {
          // eslint-disable-next-line no-promise-executor-return -- setTimeout doesn't return a meaningful value
          setTimeout(resolve, 100 * attempt);
        });
      }
      try {
        await new Promise<void>((resolve, reject) => {
          const client = createConnection(sock);
          client.once("connect", resolve);
          client.once("error", reject);
          this.socket = client;
        });
        lastError = null;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        this.socket = null;
      }
    }
    if (lastError) {
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- propagating socket connect error; no ResponseType<T> layer here (low-level transport)
      throw lastError;
    }

    this.reader = new LspReader();
    this.initialized = false;
    this.replayDone = false;
    this.replayDoneResolve = null;

    this.socket!.on("data", (chunk: Buffer) => this.reader.feed(chunk));
    this.reader.onMessage((msg) => this.handleMessage(msg));

    // Wait for the bridge to finish replaying openedUris + diagCache to us.
    // The bridge sends $/bridge/diagReplayDone as a sentinel after all replays.
    await this.waitForReplay();

    // Disconnect clears state but doesn't kill the bridge
    this.socket!.on("close", () => {
      this.socket = null;
      this.initialized = false;
      TsgoDaemon.instances.delete(this.pidPath);
      for (const [, p] of this.pendingRequests) {
        p.reject(new Error("LSP socket closed"));
      }
      this.pendingRequests.clear();
    });

    this.socket!.on("error", (err) => {
      for (const [, p] of this.pendingRequests) {
        p.reject(err);
      }
      this.pendingRequests.clear();
    });

    await this.initialize();
  }

  private handleMessage(msg: LspMessage): void {
    const method = msg.method;
    const id = msg.id;

    // Response to one of our requests
    if (id !== undefined && id !== null && !method) {
      const numId = typeof id === "number" ? id : parseInt(String(id), 10);
      const pending = this.pendingRequests.get(numId);
      if (pending) {
        this.pendingRequests.delete(numId);
        if (msg.error) {
          pending.reject(new Error(msg.error.message));
        } else {
          pending.resolve(msg.result ?? null);
        }
      }
      return;
    }

    // Server → client requests we must respond to
    if (method === "workspace/configuration" && id !== undefined) {
      const items: Array<{ section?: string }> = msg.params?.items ?? [];
      this.sendResponse(
        id,
        Array.from({ length: items.length }, () => null),
      );
      return;
    }

    if (method === "client/registerCapability" && id !== undefined) {
      this.sendResponse(id, null);
      return;
    }

    // Bridge sends this after replaying all cached diagnostics
    if (method === "$/bridge/diagReplayDone") {
      this.replayDone = true;
      this.replayDoneResolve?.();
      this.replayDoneResolve = null;
      return;
    }
  }

  private waitForReplay(): Promise<void> {
    if (this.replayDone) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      let settled = false;
      const done = (): void => {
        if (settled) {
          return;
        }
        settled = true;
        this.replayDoneResolve = null;
        this.replayDone = true;
        resolve();
      };
      const timer = setTimeout(done, 5_000);
      this.replayDoneResolve = (): void => {
        clearTimeout(timer);
        done();
      };
    });
  }

  // --------------------------------------------------------
  // JSON-RPC helpers
  // --------------------------------------------------------

  private send(msg: LspMessage): boolean {
    if (!this.socket || this.socket.destroyed) {
      return false;
    }
    this.socket.write(encode(msg));
    return true;
  }

  private sendResponse(id: number | string, result: null | null[]): void {
    this.send({ jsonrpc: "2.0", id, result });
  }

  private request<T>(
    method: string,
    params: LspMessage["params"],
    timeoutMs = 30_000,
  ): Promise<T> {
    let outerResolve!: (r: T) => void;
    let outerReject!: (e: Error) => void;
    const promise = new Promise<T>((resolve, reject) => {
      outerResolve = resolve;
      outerReject = reject;
    });

    const id = this.nextId++;
    const timer = setTimeout(() => {
      if (this.pendingRequests.has(id)) {
        this.pendingRequests.delete(id);
        outerReject(
          new Error(`LSP '${method}' timed out after ${timeoutMs}ms`),
        );
      }
    }, timeoutMs);

    this.pendingRequests.set(id, {
      resolve: (r) => {
        clearTimeout(timer);
        outerResolve(r as T);
      },
      reject: (e) => {
        clearTimeout(timer);
        outerReject(e);
      },
    });

    if (!this.send({ jsonrpc: "2.0", id, method, params })) {
      clearTimeout(timer);
      this.pendingRequests.delete(id);
      outerReject(new Error("LSP socket not connected"));
    }

    return promise;
  }

  private async initialize(): Promise<void> {
    const rootUri = `file://${this.projectRoot}`;

    await this.request("initialize", {
      processId: process.pid,
      rootUri,
      capabilities: {
        workspace: {
          workspaceFolders: true,
          didChangeConfiguration: { dynamicRegistration: true },
          configuration: true,
          diagnostics: { refreshSupport: true },
        },
        textDocument: {
          publishDiagnostics: {
            relatedInformation: true,
            versionSupport: false,
            tagSupport: { valueSet: [1, 2] },
            codeDescriptionSupport: true,
            dataSupport: true,
          },
          diagnostic: {
            relatedInformation: true,
            tagSupport: { valueSet: [1, 2] },
            codeDescriptionSupport: true,
            dataSupport: true,
            dynamicRegistration: true,
            relatedDocumentSupport: false,
            markupMessageSupport: false,
          },
        },
      },
      workspaceFolders: [{ uri: rootUri, name: "root" }],
    });

    this.send({ jsonrpc: "2.0", method: "initialized", params: {} });
    this.send({
      jsonrpc: "2.0",
      method: "workspace/didChangeConfiguration",
      params: { settings: null },
    });
    this.initialized = true;
  }

  // --------------------------------------------------------
  // File discovery & filtering
  // --------------------------------------------------------

  /** Convert a glob pattern to a RegExp for matching relative paths. */
  private matchGlob(pattern: string, relativePath: string): boolean {
    const DOUBLE_STAR = "DOUBLESTAR";
    const escaped = pattern
      .replaceAll(/[.+^${}()|[\]\\]/g, "\\$&") // escape regex special chars (not * or ?)
      .replaceAll("**", DOUBLE_STAR) // placeholder for **
      .replaceAll("*", "[^/]*") // * matches within a segment
      .replaceAll("?", "[^/]") // ? matches one char
      .replaceAll(new RegExp(DOUBLE_STAR, "g"), ".*"); // ** matches anything including /
    const re = new RegExp(`^${escaped}$`);
    return re.test(relativePath);
  }

  private collectTsFiles(dir: string): string[] {
    const files: string[] = [];
    if (!existsSync(dir)) {
      return files;
    }
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === "node_modules" || entry.startsWith(".")) {
        continue;
      }
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        files.push(...this.collectTsFiles(full));
      } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
        files.push(full);
      }
    }
    return files;
  }

  // --------------------------------------------------------
  // Diagnostics
  // --------------------------------------------------------

  /** Read tsconfig.json exclude patterns from the project root (best-effort, returns [] on error). */
  private readTsconfigExcludes(): string[] {
    try {
      const raw = readFileSync(join(this.projectRoot, "tsconfig.json"), "utf8");
      // Strip line comments before parsing (tsconfig allows // comments)
      const stripped = raw.replaceAll(/\/\/[^\n]*/g, "");
      const parsed = JSON.parse(stripped) as { exclude?: string[] };
      return Array.isArray(parsed.exclude) ? parsed.exclude : [];
    } catch {
      return [];
    }
  }

  async getDiagnostics(
    filterPaths?: string | string[],
    ignorePatterns?: string[],
  ): Promise<LspIssue[]> {
    await this.ensureRunning();

    const cwd = this.projectRoot;

    const targets = filterPaths
      ? (Array.isArray(filterPaths) ? filterPaths : [filterPaths]).map((p) =>
          resolvePath(cwd, p),
        )
      : [cwd];

    const files: string[] = [];
    for (const target of targets) {
      if (!existsSync(target)) {
        continue;
      }
      if (statSync(target).isFile()) {
        files.push(target);
      } else {
        files.push(...this.collectTsFiles(target));
      }
    }

    // Combine tsconfig.json excludes with any caller-supplied ignore patterns so
    // we never pull diagnostics for files tsgo would skip in a batch build.
    const allIgnore = [
      ...this.readTsconfigExcludes(),
      ...(ignorePatterns ?? []),
    ];

    const filtered =
      allIgnore.length > 0
        ? files.filter((f) => {
            // Patterns are written with "/", so normalize Windows separators
            // before matching or the ignore list silently matches nothing.
            const rel = relative(cwd, f).replaceAll("\\", "/");
            return !allIgnore.some((pat) => {
              // Bare name with no separators or globs: match any path segment
              if (!pat.includes("/") && !pat.includes("*")) {
                return rel.split("/").includes(pat);
              }
              return this.matchGlob(pat, rel);
            });
          })
        : files;

    // Pull diagnostics directly — no didOpen needed.
    // tsgo discovers the project from tsconfig.json on the first pull (cold ~1-2s),
    // then keeps the type graph in memory for instant subsequent pulls.
    const allIssues: LspIssue[] = [];
    await Promise.all(
      filtered.map(async (f) => {
        const uri = `file://${f}`;
        const displayPath = relative(cwd, f);
        try {
          const result = await this.request<{
            kind: string;
            items: LspDiagnosticItem[];
          }>("textDocument/diagnostic", { textDocument: { uri } }, 120_000);
          if (result?.items) {
            for (const diag of result.items) {
              // severity 4 = hint — skip
              if (diag.severity === 4) {
                continue;
              }
              allIssues.push({
                file: displayPath,
                line: diag.range.start.line + 1,
                column: diag.range.start.character + 1,
                rule: diag.code !== undefined ? String(diag.code) : undefined,
                severity: diag.severity === 2 ? "warning" : "error",
                message: diag.message,
              });
            }
          }
        } catch {
          // ignore per-file errors
        }
      }),
    );

    return allIssues;
  }
}

// ============================================================
// Bridge entry point (when run as a standalone process)
// ============================================================

if (process.argv[2] === "__DAEMON_MODE__") {
  const args = process.argv.slice(3);
  const get = (flag: string): string => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? (args[idx + 1] ?? "") : "";
  };
  const tsgoPath = get("--tsgo");
  const projectRoot = get("--root");
  const sockPath = get("--sock");
  const pidPath = get("--pid");

  if (!tsgoPath || !projectRoot || !sockPath || !pidPath) {
    process.stderr.write("Bridge: missing required args\n");
    process.exit(1);
  }

  const dir = dirname(pidPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  runBridge(tsgoPath, projectRoot, sockPath, pidPath);
}
