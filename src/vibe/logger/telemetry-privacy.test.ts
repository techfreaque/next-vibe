import { describe, expect, it } from "bun:test";

import { sanitizeLogText } from "./telemetry-privacy";

describe("sanitizeLogText", () => {
  it("keeps a ws:// URL intact instead of reading //host as protocol-relative", () => {
    expect(sanitizeLogText("hub WS error ws://127.0.0.1:3000/ws")).toBe(
      "hub WS error ws://127.0.0.1:3000/ws",
    );
  });

  it("drops the query of a wss:// URL like an https:// one", () => {
    expect(sanitizeLogText("open wss://unbottled.ai/ws?token=abc")).toBe(
      "open wss://unbottled.ai/ws",
    );
  });

  it("still scrubs protocol-relative and http URLs", () => {
    expect(sanitizeLogText("see https://unbottled.ai/x?y=1")).toBe(
      "see https://unbottled.ai/x",
    );
  });
});
