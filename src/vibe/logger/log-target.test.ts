/**
 * Log target resolution: a configured VIBE_LOG_TARGET wins, anything else falls
 * back to the computed default instead of "not db" (which silently disabled
 * error_logs persistence in prod processes that never loaded logger/env.ts).
 */

import { afterEach, describe, expect, it } from "bun:test";

import { defaultLogTarget, resolveLogTarget } from "./log-target";

const ORIGINAL = process.env["VIBE_LOG_TARGET"];

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env["VIBE_LOG_TARGET"];
  } else {
    process.env["VIBE_LOG_TARGET"] = ORIGINAL;
  }
});

describe("resolveLogTarget", () => {
  it("returns the configured target", () => {
    process.env["VIBE_LOG_TARGET"] = "db";
    expect(resolveLogTarget()).toBe("db");
    process.env["VIBE_LOG_TARGET"] = "none";
    expect(resolveLogTarget()).toBe("none");
  });

  it("falls back to the default when unset", () => {
    delete process.env["VIBE_LOG_TARGET"];
    expect(resolveLogTarget()).toBe(defaultLogTarget());
  });

  it("falls back to the default for garbage values", () => {
    process.env["VIBE_LOG_TARGET"] = "undefined";
    expect(resolveLogTarget()).toBe(defaultLogTarget());
  });

  it("defaults to file outside a prod server command", () => {
    // bun test argv has no start/build/rebuild alias
    expect(defaultLogTarget()).toBe("file");
  });
});
