/**
 * Drop causes for the WS client samples seen in the prod error log
 * (2026-11-25): hidden tabs, frozen timers, resumed tabs, deploy drains.
 */

import { describe, expect, it } from "vitest";

import type { WsDropEvidence } from "./drop-cause";
import { classifyWsDrop } from "./drop-cause";

const base: WsDropEvidence = {
  code: 1006,
  wasClean: false,
  online: true,
  hiddenAtClose: false,
  connectedForMs: 456_448,
  msSinceVisibilityChange: null,
  msSinceNetworkChange: null,
  maxReconnectTimerOverrunMs: 0,
};

describe("classifyWsDrop", () => {
  it("names a deploy drain before anything else", () => {
    expect(classifyWsDrop({ ...base, code: 1012, wasClean: true, hiddenAtClose: true })).toBe(
      "server-restart",
    );
  });

  it("separates a failed handshake, offline browser and network change", () => {
    expect(classifyWsDrop({ ...base, connectedForMs: null })).toBe("handshake-failed");
    expect(classifyWsDrop({ ...base, online: false })).toBe("browser-offline");
    expect(classifyWsDrop({ ...base, msSinceNetworkChange: 2_000 })).toBe("network-change");
  });

  it("splits hidden tabs by whether timers were suspended", () => {
    expect(
      classifyWsDrop({ ...base, hiddenAtClose: true, maxReconnectTimerOverrunMs: 276_257 }),
    ).toBe("background-suspended");
    expect(classifyWsDrop({ ...base, hiddenAtClose: true, maxReconnectTimerOverrunMs: 295 })).toBe(
      "background-tab",
    );
  });

  it("recognizes a close surfaced right after the tab came back", () => {
    expect(classifyWsDrop({ ...base, msSinceVisibilityChange: 125 })).toBe("detected-on-resume");
  });

  it("names a visible page whose device slept or froze it", () => {
    expect(classifyWsDrop({ ...base, deviceSuspendedMs: 74_000 })).toBe("device-suspended");
    expect(classifyWsDrop({ ...base, msSinceDeviceResume: 4_000 })).toBe("device-suspended");
    expect(classifyWsDrop({ ...base, deviceSuspendedMs: 900, msSinceDeviceResume: 60_000 })).toBe(
      "silent-drop",
    );
  });

  it("leaves visible mid-session cuts as silent drops", () => {
    expect(classifyWsDrop(base)).toBe("silent-drop");
    expect(classifyWsDrop({ ...base, code: 1011, wasClean: true })).toBe("server-close");
  });
});
