import { expect, it, jest } from "bun:test";

import type { EndpointLogger, LoggerMetadata } from "../../logger/types";

class TestSocket extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 3;
  static readonly sockets: TestSocket[] = [];

  readyState = TestSocket.CONNECTING;
  closeRequest: { code: number; reason: string } | null = null;
  readonly sent: string[] = [];

  constructor(readonly url: string) {
    super();
    TestSocket.sockets.push(this);
  }

  send(frame: string): void {
    this.sent.push(frame);
  }

  close(code: number, reason: string): void {
    this.closeRequest = { code, reason };
  }

  open(): void {
    this.readyState = TestSocket.OPEN;
    this.dispatchEvent(new Event("open"));
  }

  drop(code: number, reason: string): void {
    this.readyState = TestSocket.CLOSED;
    this.dispatchEvent(
      Object.assign(new Event("close"), {
        code,
        reason,
        wasClean: false,
      }),
    );
  }
}

it("reports quick reconnects and times out hidden, offline drops", async () => {
  const originalSocket = globalThis.WebSocket;
  const fakeWindow = Object.assign(new EventTarget(), {
    location: { protocol: "https:", host: "example.com" },
  });
  const fakeDocument = Object.assign(new EventTarget(), {
    visibilityState: "visible",
  });
  const onlineDescriptor = Object.getOwnPropertyDescriptor(navigator, "onLine");
  const errors: LoggerMetadata[] = [];
  const info: LoggerMetadata[] = [];
  const warnings: LoggerMetadata[] = [];
  const logger: EndpointLogger = {
    isDebugEnabled: false,
    debug: () => undefined,
    info: (message, context) => { info.push({ message, context }); },
    warn: (message, context) => {
      warnings.push({ message, context });
    },
    vibe: () => undefined,
    error: (message, context) => {
      errors.push({ message, context });
    },
  };
  jest.useFakeTimers();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: fakeWindow,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: fakeDocument,
  });
  Object.defineProperty(globalThis, "WebSocket", {
    configurable: true,
    value: TestSocket,
  });
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value: true,
  });
  try {
    const { preWarmChannel, subscribeToChannel } = await import("./client");
    preWarmChannel("test", "en-US", logger);
    TestSocket.sockets[0]?.open();
    jest.advanceTimersByTime(250);
    TestSocket.sockets[0]?.drop(1012, "server drain");
    expect(errors).toEqual([]);

    jest.advanceTimersByTime(500);
    TestSocket.sockets[1]?.open();
    const firstSocketUrl = TestSocket.sockets[0]?.url ?? "";
    expect(new URL(firstSocketUrl).searchParams.has("retry")).toBe(false);
    expect(new URL(TestSocket.sockets[1]?.url ?? "").searchParams.get("retry")).toBe("1");
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
    expect(new URL(TestSocket.sockets[1]?.url ?? "").searchParams.get("restart")).toBe("1");
    expect(info).toMatchObject([
      {
        message: "[WS Client] Planned reconnect after server restart",
        context: {
          requestId: new URL(firstSocketUrl).searchParams.get("requestId"),
          closedAtMs: expect.any(Number),
          reconnectRequestId: new URL(
            TestSocket.sockets[1]?.url ?? "",
          ).searchParams.get("requestId"),
          code: 1012,
          reason: "server drain",
          plannedRestart: true,
          dropCause: "server-restart",
          attempts: 1,
          failedHandshakesDuringDrop: 0,
          maxReconnectTimerOverrunMs: 0,
          offlineMs: 500,
          recovered: true,
          dropReportTrigger: "reconnected",
        },
      },
    ]);

    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    fakeWindow.dispatchEvent(new Event("offline"));
    TestSocket.sockets[1]?.drop(1006, "offline");
    jest.advanceTimersByTime(1000);
    TestSocket.sockets[2]?.drop(1006, "retry failed");
    jest.advanceTimersByTime(19_000);
    expect(errors[0]).toMatchObject({
      message: "[WS Client] Connection lost",
      context: {
        code: 1006,
        reason: "offline",
        attempts: 2,
        failedHandshakesDuringDrop: 1,
        lastFailedHandshakeRequestId: new URL(TestSocket.sockets[2]?.url ?? "").searchParams.get(
          "requestId",
        ),
        lastFailedHandshakeMs: 0,
        lastFailedHandshakeCode: 1006,
        pendingHandshakeRequestId: new URL(TestSocket.sockets[3]?.url ?? "").searchParams.get("requestId"),
        pendingHandshakeMs: 17_000,
        retryScheduled: false,
        msSinceVisibilityChange: 0,
        msSinceNetworkChange: 0,
        offlineMs: 20_000,
        hiddenAtClose: true,
        online: false,
        recovered: false,
        dropReportTrigger: "deadline",
      },
    });
    TestSocket.sockets[3]?.open();
    expect(errors).toHaveLength(1);

    Object.defineProperty(navigator, "onLine", { value: true });
    fakeWindow.dispatchEvent(new Event("online"));
    fakeDocument.visibilityState = "visible";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    TestSocket.sockets[3]?.drop(1006, "connection interrupted");
    for (const delay of [1000, 2000, 4000, 8000, 16000, 30000]) {
      jest.advanceTimersByTime(delay);
      TestSocket.sockets.at(-1)?.drop(1006, "retry failed");
    }
    expect(errors).toHaveLength(3);
    expect(errors[2]).toMatchObject({
      message: "[WS Client] Fast reconnect attempts exhausted",
      context: {
        attempts: 6,
        failedHandshakesDuringDrop: 6,
        noticeableDownMs: 61_000,
        nextRetryMs: 60_000,
      },
    });
    const exhaustedSocketCount = TestSocket.sockets.length;
    jest.advanceTimersByTime(59_999);
    expect(TestSocket.sockets).toHaveLength(exhaustedSocketCount);
    jest.advanceTimersByTime(1);
    expect(TestSocket.sockets).toHaveLength(exhaustedSocketCount + 1);
    TestSocket.sockets.at(-1)?.drop(1006, "retry failed");
    expect(errors).toHaveLength(3);

    Object.defineProperty(navigator, "onLine", { value: false });
    fakeWindow.dispatchEvent(new Event("offline"));
    jest.advanceTimersByTime(60_000);
    expect(TestSocket.sockets).toHaveLength(exhaustedSocketCount + 1);
    Object.defineProperty(navigator, "onLine", { value: true });
    fakeWindow.dispatchEvent(new Event("online"));
    expect(TestSocket.sockets).toHaveLength(exhaustedSocketCount + 2);
    const recoveredSocket = TestSocket.sockets.at(-1);
    recoveredSocket?.open();
    expect(warnings.at(-1)).toMatchObject({
      message: "[WS Client] Reconnected after disconnect",
      context: {
        noticeableDownMs: 121_000,
        offlineMs: 181_000,
        reconnectRequestId: new URL(recoveredSocket?.url ?? "").searchParams.get(
          "requestId",
        ),
        reconnectHandshakeMs: 0,
      },
    });

    const socketBeforePagehide = TestSocket.sockets.at(-1);
    const socketCountBeforePagehide = TestSocket.sockets.length;
    socketBeforePagehide?.dispatchEvent(
      Object.assign(new Event("message"), {
        data: JSON.stringify({
          type: "subscribed",
          channel: "test",
          cursor: 42,
          complete: true,
        }),
      }),
    );
    fakeWindow.dispatchEvent(new Event("pagehide"));
    expect(socketBeforePagehide?.closeRequest).toEqual({
      code: 1000,
      reason: "pagehide",
    });
    subscribeToChannel(
      "during-pagehide",
      "__event__",
      () => undefined,
      "en-US",
      logger,
    )();
    expect(TestSocket.sockets).toHaveLength(socketCountBeforePagehide);
    fakeDocument.visibilityState = "hidden";
    fakeWindow.dispatchEvent(new Event("pageshow"));
    expect(TestSocket.sockets).toHaveLength(socketCountBeforePagehide);
    fakeDocument.visibilityState = "visible";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    expect(TestSocket.sockets).toHaveLength(socketCountBeforePagehide + 1);
    const restoredSocket = TestSocket.sockets.at(-1);
    restoredSocket?.open();
    socketBeforePagehide?.drop(1000, "pagehide");
    expect(restoredSocket?.sent).toContain(
      JSON.stringify({
        type: "subscribe",
        channel: "test",
        locale: "en-US",
        replay: true,
        since: 42,
      }),
    );
    expect(errors).toHaveLength(3);

    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    restoredSocket?.drop(1006, "");
    const beforeResume = TestSocket.sockets.length;
    fakeDocument.visibilityState = "visible";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    expect(TestSocket.sockets).toHaveLength(beforeResume + 1);
    TestSocket.sockets.at(-1)?.open();
    jest.advanceTimersByTime(1000);
    expect(TestSocket.sockets).toHaveLength(beforeResume + 1);

    TestSocket.sockets.at(-1)?.drop(1012, "server-draining");
    jest.advanceTimersByTime(500);
    const stalled = TestSocket.sockets.at(-1);
    jest.advanceTimersByTime(15_000);
    expect(stalled?.closeRequest).toEqual({
      code: 4003, reason: "reconnect-handshake-timeout",
    });
    stalled?.drop(1006, "");
    jest.advanceTimersByTime(2_000);
    expect(TestSocket.sockets.at(-1)).not.toBe(stalled);
    TestSocket.sockets.at(-1)?.open();
    expect(errors.at(-1)).toMatchObject({
      message: "[WS Client] Connection lost",
      context: { plannedRestart: true, failedHandshakesDuringDrop: 1,
        lastFailedHandshakeContext: { timedOut: true }, recovered: true },
    });

    TestSocket.sockets.at(-1)?.drop(1001, "going away");
    fakeWindow.dispatchEvent(new Event("pagehide"));
    expect(errors.at(-1)).toMatchObject({
      message: "[WS Client] Connection lost",
      context: {
        code: 1001,
        attempts: 0,
        recovered: false,
        dropReportTrigger: "pagehide",
      },
    });
    // The first upgrade on a restored page can stall before any drop exists.
    fakeWindow.dispatchEvent(new Event("pageshow"));
    TestSocket.sockets.at(-1)?.open();
    fakeWindow.dispatchEvent(new Event("pagehide"));
    fakeWindow.dispatchEvent(new Event("pageshow"));
    const firstUpgrade = TestSocket.sockets.at(-1);
    expect(new URL(firstUpgrade?.url ?? "").searchParams.has("retry")).toBe(false);
    jest.advanceTimersByTime(15_000);
    expect(firstUpgrade?.closeRequest?.code).toBe(4003);
    firstUpgrade?.drop(1006, "");
    jest.advanceTimersByTime(1_000);
    TestSocket.sockets.at(-1)?.open();
    expect(errors.at(-1)).toMatchObject({
      message: "[WS Client] Connection lost",
      context: { handshakeTimedOut: true, connectedForMs: null, recovered: true },
    });
  } finally {
    jest.useRealTimers();
    Object.defineProperty(globalThis, "WebSocket", {
      configurable: true,
      value: originalSocket,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(
      navigator,
      "onLine",
      onlineDescriptor ?? { configurable: true, value: undefined },
    );
  }
});
