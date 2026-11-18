import { expect, it, jest } from "bun:test";

import type { EndpointLogger, LoggerMetadata } from "../../logger/types";

class TestSocket extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 3;
  static readonly sockets: TestSocket[] = [];

  readyState = TestSocket.CONNECTING;

  constructor(readonly url: string) {
    super();
    TestSocket.sockets.push(this);
  }

  send(): void {
    // The fixture only checks connection lifecycle reports.
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
  const logger: EndpointLogger = {
    isDebugEnabled: false,
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
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
    const { preWarmChannel } = await import("./client");
    preWarmChannel("test", "en-US", logger);
    TestSocket.sockets[0]?.open();
    jest.advanceTimersByTime(250);
    TestSocket.sockets[0]?.drop(1012, "server drain");
    expect(errors).toEqual([]);

    jest.advanceTimersByTime(500);
    TestSocket.sockets[1]?.open();
    const firstSocketUrl = TestSocket.sockets[0]?.url ?? "";
    expect(errors).toMatchObject([
      {
        message: "[WS Client] Connection lost",
        context: {
          requestId: new URL(firstSocketUrl).searchParams.get("requestId"),
          code: 1012,
          reason: "server drain",
          attempts: 1,
          offlineMs: 500,
          recovered: true,
        },
      },
    ]);

    fakeDocument.visibilityState = "hidden";
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    TestSocket.sockets[1]?.drop(1006, "offline");
    jest.advanceTimersByTime(1000);
    TestSocket.sockets[2]?.drop(1006, "retry failed");
    jest.advanceTimersByTime(19_000);
    expect(errors[1]).toMatchObject({
      message: "[WS Client] Connection lost",
      context: {
        code: 1006,
        reason: "offline",
        attempts: 2,
        offlineMs: 20_000,
        hiddenAtClose: true,
        online: false,
        recovered: false,
      },
    });
    TestSocket.sockets[3]?.open();
    expect(errors).toHaveLength(2);
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
