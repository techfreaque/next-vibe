import { expect, it, jest } from "bun:test";

import type { EndpointLogger, LoggerMetadata } from "../../logger/types";

/**
 * A WebSocket stand-in WITHOUT the static readyState constants, like the
 * wrapper classes some extensions install over window.WebSocket.
 */
class WrappedSocket extends EventTarget {
  static readonly sockets: WrappedSocket[] = [];

  readyState = 0;
  closeRequest: { code: number; reason: string } | null = null;
  readonly sent: string[] = [];

  constructor(readonly url: string) {
    super();
    WrappedSocket.sockets.push(this);
  }

  send(frame: string): void {
    this.sent.push(frame);
  }

  close(code: number, reason: string): void {
    this.closeRequest = { code, reason };
    this.readyState = 2;
  }

  open(): void {
    this.readyState = 1;
    this.dispatchEvent(new Event("open"));
  }

  frame(data: string): void {
    this.dispatchEvent(Object.assign(new Event("message"), { data }));
  }

  drop(code: number, reason: string, wasClean = false): void {
    this.readyState = 3;
    this.dispatchEvent(
      Object.assign(new Event("close"), { code, reason, wasClean }),
    );
  }
}

it("parks a quiet hidden socket, keeps an active one, and survives a wrapped WebSocket global", async () => {
  const originalSocket = globalThis.WebSocket;
  const fakeWindow = Object.assign(new EventTarget(), {
    location: { protocol: "https:", host: "example.com" },
  });
  const fakeDocument = Object.assign(new EventTarget(), {
    visibilityState: "visible",
  });
  const onlineDescriptor = Object.getOwnPropertyDescriptor(navigator, "onLine");
  const errors: LoggerMetadata[] = [];
  const warnings: LoggerMetadata[] = [];
  const logger: EndpointLogger = {
    isDebugEnabled: false,
    debug: () => undefined,
    info: () => undefined,
    warn: (message, context) => {
      warnings.push({ message, context });
    },
    vibe: () => undefined,
    error: (message, context) => {
      errors.push({ message, context });
    },
  };
  const hide = (): void => {
    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
  };
  const show = (): void => {
    fakeDocument.visibilityState = "visible";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
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
    value: WrappedSocket,
  });
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value: true,
  });
  try {
    const { subscribeToChannel } = await import("./client");
    // Subscribing before the socket opened used to read `null.send` when the
    // global had no OPEN constant.
    subscribeToChannel("idle", "__event__", () => undefined, "en-US", logger);
    expect(WrappedSocket.sockets).toHaveLength(1);
    const first = WrappedSocket.sockets[0];
    first?.open();
    first?.frame(
      JSON.stringify({
        type: "subscribed",
        channel: "idle",
        cursor: 7,
        complete: true,
      }),
    );
    expect(first?.sent).toHaveLength(1);

    // Hidden after the socket went quiet: closed by us, right away.
    jest.advanceTimersByTime(6_000);
    hide();
    expect(first?.closeRequest).toEqual({
      code: 1000,
      reason: "background-park",
    });
    first?.drop(1000, "background-park", true);
    jest.advanceTimersByTime(120_000);
    expect(WrappedSocket.sockets).toHaveLength(1);

    // Back in view: reconnect at once and resubscribe from the cursor.
    show();
    expect(WrappedSocket.sockets).toHaveLength(2);
    const second = WrappedSocket.sockets[1];
    expect(new URL(second?.url ?? "").searchParams.has("retry")).toBe(false);
    second?.open();
    expect(second?.sent).toContain(
      JSON.stringify({
        type: "subscribe",
        channel: "idle",
        locale: "en-US",
        replay: true,
        since: 7,
      }),
    );

    // Hidden while traffic flows: the socket stays until it goes quiet.
    hide();
    for (let i = 0; i < 4; i++) {
      jest.advanceTimersByTime(3_000);
      second?.frame(
        JSON.stringify({
          channel: "idle",
          event: "__event__",
          data: { payload: {} },
          seq: 8 + i,
        }),
      );
    }
    expect(second?.closeRequest).toBeNull();
    jest.advanceTimersByTime(5_000);
    expect(second?.closeRequest).toEqual({
      code: 1000,
      reason: "background-park",
    });
    show();
    const third = WrappedSocket.sockets[2];
    third?.open();

    // A hidden drop of an active socket retries in the background.
    hide();
    third?.frame(
      JSON.stringify({
        channel: "idle",
        event: "__event__",
        data: { payload: {} },
        seq: 20,
      }),
    );
    third?.drop(1006, "");
    jest.advanceTimersByTime(1_000);
    expect(WrappedSocket.sockets).toHaveLength(4);
    WrappedSocket.sockets[3]?.open();
    expect(errors.at(-1)).toMatchObject({
      message: "[WS Client] Connection lost",
      context: { hiddenAtClose: true, recovered: true, noticeableDownMs: 0 },
    });
    expect(errors).toHaveLength(1);
    expect(warnings).toEqual([]);
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
