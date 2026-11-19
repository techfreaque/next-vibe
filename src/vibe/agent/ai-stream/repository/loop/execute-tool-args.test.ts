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

  it("parses an input sent as a JSON string", () => {
    expect(
      normalizeExecuteToolArgs({
        toolName: "rename-thread",
        input: '{"title":"Image Generation Inquiry"}',
      }),
    ).toEqual({
      toolName: "rename-thread",
      input: { title: "Image Generation Inquiry" },
    });
  });

  it("leaves an unparseable input string for the validation error", () => {
    const args = {
      toolName: "rename-thread",
      input: '{"description":<arg_value>broken',
    };
    expect(normalizeExecuteToolArgs(args)).toEqual(args);
  });

  it("unwraps a nested call whose inner input is a JSON string", () => {
    expect(
      normalizeExecuteToolArgs({
        input: {
          input: '{"title":"POV Game","description":"Two endings"}',
          toolName: "rename-thread",
        },
      }),
    ).toEqual({
      toolName: "rename-thread",
      input: { title: "POV Game", description: "Two endings" },
    });
  });
});
