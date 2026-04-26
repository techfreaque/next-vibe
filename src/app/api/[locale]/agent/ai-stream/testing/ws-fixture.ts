/**
 * WebSocket Fixture - Record & Replay for unbottled remote mode tests.
 *
 * Intercepts `globalThis.WebSocket` in test environments.
 * On first run (cache miss): connects to the real server, records all incoming
 * messages to a fixture file, and also passes them through to the caller.
 * On subsequent runs (cache hit): replays the recorded messages via a mock WS.
 *
 * Fixture file format:
 *   fixtures/ws-cache/{testCase}/{context-slug}-{index}-events.json
 *
 * The context slug is derived from the WS URL's channel param (or URL path).
 * Multiple WS connections within one test get counter suffixes.
 *
 * Integration:
 *   Call installWsFixture() once at module level (before any imports that may
 *   use WebSocket). Call setWsFixtureContext(testCase) at the start of each
 *   test (same context name as setFetchCacheContext).
 *
 * Strict mode: setWsFixtureStrictMode(true) throws when a WS connection is
 * opened without a matching fixture — proving fully offline test execution.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { WsWireMessage } from "@/app/api/[locale]/system/unified-interface/websocket/types";
import { registerWsContextHook, registerWsStrictHook } from "./fetch-cache";

const WS_CACHE_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "ws-cache",
);

// ── State ─────────────────────────────────────────────────────────────────────

let currentTestCase = "unknown";
let strictMode = false;
let wsInstalled = false;
const wsCallCounters = new Map<string, number>();

// ── Public API ─────────────────────────────────────────────────────────────────

/** Set the active test case context. Must match the fetch-cache context name. */
export function setWsFixtureContext(testCase: string): void {
  currentTestCase = slugify(testCase);
  wsCallCounters.clear();
}

/**
 * When strict mode is enabled, any WebSocket connection without a cached fixture
 * will throw instead of making a real connection.
 */
export function setWsFixtureStrictMode(strict: boolean): void {
  strictMode = strict;
}

// ── Types ──────────────────────────────────────────────────────────────────────

/** A single recorded server→client message */
interface WsMessageRecord {
  /** Raw JSON string of the WsWireMessage */
  data: string;
}

/** Fixture file format */
interface WsFixtureFile {
  /** Original WS URL (with channel/token redacted) */
  url: string;
  /** Channel name extracted from URL */
  channel: string;
  /** All server→client messages in order */
  messages: WsMessageRecord[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Extract the channel param from a WS URL */
function extractChannel(url: string): string {
  try {
    // WS URLs: ws://host/path?channel=...&token=...
    const u = new URL(url.replace(/^wss?:/, "http:"));
    const channel = u.searchParams.get("channel");
    if (channel) {
      return channel;
    }
    return u.pathname;
  } catch {
    return url.slice(0, 60);
  }
}

/** Redact auth params from URL for safe storage */
function redactWsUrl(url: string): string {
  try {
    const u = new URL(url.replace(/^wss?:/, "http:"));
    u.searchParams.delete("token");
    u.searchParams.delete("leadId");
    return url.startsWith("wss:")
      ? u.toString().replace("http:", "wss:")
      : u.toString().replace("http:", "ws:");
  } catch {
    return url;
  }
}

function cacheDir(testCase: string): string {
  return join(WS_CACHE_DIR, testCase);
}

function nextWsCallIndex(contextSlug: string): number {
  const n = (wsCallCounters.get(contextSlug) ?? 0) + 1;
  wsCallCounters.set(contextSlug, n);
  return n;
}

function fixtureStem(contextSlug: string, index: number): string {
  return index === 1 ? contextSlug : `${contextSlug}-${index}`;
}

// ── Mock WebSocket ─────────────────────────────────────────────────────────────

type WsEventHandler = (event: MessageEvent | Event) => void;

interface WsEventListeners {
  open: Set<WsEventHandler>;
  message: Set<WsEventHandler>;
  close: Set<WsEventHandler>;
  error: Set<WsEventHandler>;
}

/** Minimal mock WebSocket that replays recorded events */
class MockWebSocket {
  readonly url: string;
  readyState = 0; // CONNECTING

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  private readonly listeners: WsEventListeners = {
    open: new Set(),
    message: new Set(),
    close: new Set(),
    error: new Set(),
  };

  private closed = false;

  constructor(
    url: string,
    private readonly messages: WsMessageRecord[],
  ) {
    this.url = url;
    // Schedule open + replay on next tick
    setTimeout(() => {
      void this.replay();
    }, 0);
  }

  private async replay(): Promise<void> {
    // Transition to OPEN
    this.readyState = MockWebSocket.OPEN;
    this.dispatchEvent("open", new Event("open"));

    // Replay messages with async ticks between them (same as sseEventsToTickingStream)
    for (const record of this.messages) {
      if (this.closed) {
        break;
      }
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
      if (this.closed) {
        break;
      }
      const evt = new MessageEvent("message", { data: record.data });
      this.dispatchEvent("message", evt);
    }

    if (!this.closed) {
      this.close();
    }
  }

  addEventListener(
    type: "open" | "message" | "close" | "error",
    handler: WsEventHandler,
  ): void {
    this.listeners[type].add(handler);
  }

  removeEventListener(
    type: "open" | "message" | "close" | "error",
    handler: WsEventHandler,
  ): void {
    this.listeners[type].delete(handler);
  }

  send(): void {
    // No-op in replay mode: we don't record sent messages for WS fixtures
    // (subscribe/unsubscribe are implicit in the fixture)
  }

  close(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.readyState = MockWebSocket.CLOSED;
    this.dispatchEvent("close", new Event("close"));
  }

  private dispatchEvent(type: string, event: Event | MessageEvent): void {
    const handlers = this.listeners[type as keyof WsEventListeners];
    if (handlers) {
      for (const handler of handlers) {
        handler(event as MessageEvent & Event);
      }
    }
  }
}

// ── Recording WebSocket ────────────────────────────────────────────────────────

/** Wraps a real WebSocket to intercept and record all server→client messages */
class RecordingWebSocket {
  readonly url: string;
  readyState = 0;

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  private readonly realWs: WebSocket;
  private readonly recordedMessages: WsMessageRecord[] = [];
  private readonly fixtureFile: string;
  private readonly fixtureUrl: string;
  private readonly channel: string;

  constructor(
    OriginalWebSocket: typeof WebSocket,
    url: string,
    fixtureFile: string,
    fixtureUrl: string,
    channel: string,
  ) {
    this.url = url;
    this.fixtureFile = fixtureFile;
    this.fixtureUrl = fixtureUrl;
    this.channel = channel;
    this.realWs = new OriginalWebSocket(url);

    // Mirror readyState
    this.realWs.addEventListener("open", () => {
      this.readyState = RecordingWebSocket.OPEN;
    });
    this.realWs.addEventListener("close", () => {
      this.readyState = RecordingWebSocket.CLOSED;
      this.writeFixture();
    });
    this.realWs.addEventListener("error", () => {
      this.readyState = RecordingWebSocket.CLOSED;
    });
  }

  private writeFixture(): void {
    try {
      const dir = dirname(this.fixtureFile);
      mkdirSync(dir, { recursive: true });
      const fixture: WsFixtureFile = {
        url: this.fixtureUrl,
        channel: this.channel,
        messages: this.recordedMessages,
      };
      writeFileSync(
        this.fixtureFile,
        JSON.stringify(fixture, null, 2),
        "utf-8",
      );
      // eslint-disable-next-line no-console
      console.log(
        "[WsFixture] WROTE",
        this.fixtureFile.split("/").slice(-3).join("/"),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[WsFixture] Failed to write fixture", err);
    }
  }

  addEventListener(
    type: string,
    handler: (event: MessageEvent | Event) => void,
  ): void {
    if (type === "message") {
      // Intercept message events to record them
      const wrappedHandler = (event: MessageEvent): void => {
        const data =
          typeof event.data === "string"
            ? event.data
            : new TextDecoder().decode(event.data as ArrayBuffer);
        this.recordedMessages.push({ data });
        (handler as (e: MessageEvent) => void)(event);
      };
      this.realWs.addEventListener("message", wrappedHandler as EventListener);
    } else {
      this.realWs.addEventListener(type, handler as EventListener);
    }
  }

  removeEventListener(
    type: string,
    handler: (event: MessageEvent | Event) => void,
  ): void {
    this.realWs.removeEventListener(type, handler as EventListener);
  }

  send(data: string): void {
    this.realWs.send(data);
  }

  close(): void {
    this.realWs.close();
  }
}

// ── Main install ───────────────────────────────────────────────────────────────

/**
 * Install the WebSocket interceptor. Call once at module level.
 * Works in Bun/Node test environments where WebSocket is available globally.
 */
export function installWsFixture(): void {
  if (wsInstalled) {
    return;
  }
  wsInstalled = true;
  mkdirSync(WS_CACHE_DIR, { recursive: true });

  // Register context sync hook so setFetchCacheContext() also updates WS fixture context
  registerWsContextHook(setWsFixtureContext);
  // Register strict mode sync hook
  registerWsStrictHook(setWsFixtureStrictMode);

  const RealWebSocket = globalThis.WebSocket as typeof WebSocket | undefined;

  if (!RealWebSocket) {
    // eslint-disable-next-line no-console
    console.warn(
      "[WsFixture] WebSocket not available globally - skipping install",
    );
    return;
  }

  // Capture in a const so the class closure can reference it without the
  // `| undefined` widening that TS would apply to a mutable variable.
  const RealWs = RealWebSocket;

  // Replace globalThis.WebSocket with our interceptor class.
  // Routes to MockWebSocket (cache hit) or RecordingWebSocket (cache miss).
  // No `implements WebSocket` — DOM interface has internal slots that can't be
  // structurally satisfied. We match the runtime shape the unbottled handler uses:
  // addEventListener, removeEventListener, send, close, readyState, url.
  class WsInterceptor {
    static readonly CONNECTING = 0 as const;
    static readonly OPEN = 1 as const;
    static readonly CLOSING = 2 as const;
    static readonly CLOSED = 3 as const;

    readonly CONNECTING = 0 as const;
    readonly OPEN = 1 as const;
    readonly CLOSING = 2 as const;
    readonly CLOSED = 3 as const;

    readonly url: string;
    private readonly inner: MockWebSocket | RecordingWebSocket;

    constructor(url: string | URL) {
      const urlStr = typeof url === "string" ? url : url.toString();
      this.url = urlStr;
      const channel = extractChannel(urlStr);
      const contextSlug = slugify(channel.split("/").slice(-3).join("-"));
      const callIndex = nextWsCallIndex(contextSlug);
      const stem = fixtureStem(contextSlug, callIndex);
      const fixtureFile = join(
        cacheDir(currentTestCase),
        `${stem}-events.json`,
      );

      if (existsSync(fixtureFile)) {
        // eslint-disable-next-line no-console
        console.log("[WsFixture] HIT", {
          file: fixtureFile.split("/").slice(-3).join("/"),
          channel,
          index: callIndex,
        });
        const fixture = JSON.parse(
          readFileSync(fixtureFile, "utf-8"),
        ) as WsFixtureFile;
        this.inner = new MockWebSocket(urlStr, fixture.messages);
        return;
      }

      // eslint-disable-next-line no-console
      console.log("[WsFixture] MISS", {
        file: fixtureFile.split("/").slice(-3).join("/"),
        channel,
        index: callIndex,
      });

      if (strictMode) {
        // oxlint-disable-next-line restricted-syntax -- intentional throw in test
        throw new Error(
          `[WsFixture STRICT] No fixture for WebSocket channel: ${channel} (context: ${currentTestCase})`,
        );
      }

      this.inner = new RecordingWebSocket(
        RealWs,
        urlStr,
        fixtureFile,
        redactWsUrl(urlStr),
        channel,
      );
    }

    get readyState(): number {
      return this.inner.readyState;
    }

    addEventListener(
      type: string,
      handler: (event: MessageEvent | Event) => void,
    ): void {
      this.inner.addEventListener(
        type as "open" | "message" | "close" | "error",
        handler,
      );
    }

    removeEventListener(
      type: string,
      handler: (event: MessageEvent | Event) => void,
    ): void {
      this.inner.removeEventListener(
        type as "open" | "message" | "close" | "error",
        handler,
      );
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
      this.inner.send(typeof data === "string" ? data : "");
    }

    close(): void {
      this.inner.close();
    }
  }

  // Object.defineProperty bypasses TS type checking on globalThis assignments.
  // WsInterceptor matches the runtime contract used by unbottled-stream-handler.
  Object.defineProperty(globalThis, "WebSocket", {
    value: WsInterceptor,
    writable: true,
    configurable: true,
  });
}

/**
 * Returns the most recent set of WS messages recorded for a given context slug.
 * Useful for debugging or asserting specific events were received.
 * Only works after the WS connection has closed (fixture written).
 */
export function readWsFixture(
  testCase: string,
  channelSlug: string,
  index = 1,
): WsWireMessage[] | null {
  const stem = fixtureStem(slugify(channelSlug), index);
  const fixtureFile = join(cacheDir(slugify(testCase)), `${stem}-events.json`);
  if (!existsSync(fixtureFile)) {
    return null;
  }
  const fixture = JSON.parse(
    readFileSync(fixtureFile, "utf-8"),
  ) as WsFixtureFile;
  return fixture.messages.map((m) => JSON.parse(m.data) as WsWireMessage);
}
