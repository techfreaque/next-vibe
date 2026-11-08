import { describe, expect, it } from "bun:test";

import { normalizeExecuteToolArgs } from "./execute-tool-args";

describe("normalizeExecuteToolArgs", () => {
  it("unwraps a call nested one level too deep", () => {
    expect(
      normalizeExecuteToolArgs({
        callbackMode: "wait",
        input: { toolName: "cortex-write", input: { path: "/a.md" } },
      }),
    ).toEqual({
      callbackMode: "wait",
      toolName: "cortex-write",
      input: { path: "/a.md" },
    });
  });

  it("drops an invented callbackMode", () => {
    expect(
      normalizeExecuteToolArgs({
        callbackMode: "omit",
        toolName: "cortex-read",
        input: { path: "/a.md" },
      }),
    ).toEqual({ toolName: "cortex-read", input: { path: "/a.md" } });
  });

  it("keeps a real callbackMode sent in the wrong case", () => {
    expect(
      normalizeExecuteToolArgs({
        callbackMode: "Detach",
        toolName: "cortex-read",
        input: { path: "/a.md" },
      }),
    ).toEqual({
      callbackMode: "detach",
      toolName: "cortex-read",
      input: { path: "/a.md" },
    });
  });

  it("leaves valid and unrecoverable args unchanged", () => {
    const valid = {
      toolName: "rename-thread",
      input: { title: "t" },
      callbackMode: "endLoop",
    };
    expect(normalizeExecuteToolArgs(valid)).toEqual(valid);
    const noToolName = { callbackMode: "wait", input: { path: "/a.md" } };
    expect(normalizeExecuteToolArgs(noToolName)).toEqual(noToolName);
  });
});
