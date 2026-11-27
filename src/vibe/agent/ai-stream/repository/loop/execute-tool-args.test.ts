import { describe, expect, it } from "bun:test";

import {
  describeExecuteToolInputEncoding,
  describeExecuteToolValidationStage,
  describeNestedExecuteToolArgs,
  describeToolArgShape,
  normalizeExecuteToolArgs,
} from "./execute-tool-args";

describe("describeExecuteToolInputEncoding", () => {
  it("distinguishes invalid JSON, plain text, and code fences", () => {
    expect(describeExecuteToolInputEncoding('{"title":')).toBe("malformed-json");
    expect(describeExecuteToolInputEncoding("a title")).toBe("plain-text");
    expect(describeExecuteToolInputEncoding('  ```json\n{}\n```')).toBe("code-fence");
    expect(describeExecuteToolInputEncoding('{"title":"a title"}')).toBe("json-object");
    expect(describeExecuteToolInputEncoding('["a title"]')).toBe("json-non-object");
    expect(describeExecuteToolInputEncoding("  ")).toBe("empty-string");
    expect(describeExecuteToolInputEncoding({ title: "a title" })).toBeUndefined();
  });
});

describe("describeToolArgShape", () => {
  it("distinguishes missing, empty and malformed model arguments", () => {
    expect(describeToolArgShape(undefined)).toBe("missing");
    expect(describeToolArgShape(null)).toBe("null");
    expect(describeToolArgShape({})).toBe("empty-record");
    expect(describeToolArgShape({ input: "private text" })).toBe("record");
    expect(describeToolArgShape('{"input":{}}')).toBe("string");
    expect(describeToolArgShape([])).toBe("array");
  });
});

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

  it("retains an invented callbackMode for validation", () => {
    expect(
      normalizeExecuteToolArgs({
        callbackMode: "omit",
        toolName: "cortex-read",
        input: { path: "/a.md" },
      }),
    ).toEqual({ callbackMode: "omit", toolName: "cortex-read", input: { path: "/a.md" } });
  });

  it("unwraps a redundant local dispatcher and retains the nested endLoop intent", () => {
    const inner = { toolName: "rename-thread", input: { title: "Plans" }, callbackMode: "endLoop" };
    const raw = { toolName: "execute-tool", input: inner };
    expect(normalizeExecuteToolArgs(raw)).toEqual(inner);
    expect(raw.input).toBe(inner);
    expect(normalizeExecuteToolArgs({ ...raw, instanceId: "other" })).toEqual({ ...raw, instanceId: "other" });
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

  it("parses a standalone JSON code block as wrapper input", () => {
    expect(normalizeExecuteToolArgs({
      toolName: "rename-thread",
      input: '```json\n{"title":"Example"}\n```',
    })).toEqual({
      toolName: "rename-thread",
      input: { title: "Example" },
    });
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

  it("retains direct target fields in a nested envelope without an input field", () => {
    expect(
      normalizeExecuteToolArgs({
        input: {
          toolName: "rename-thread",
          threadId: "sample-thread",
          title: "Sample title",
          instanceId: "sample-instance",
          callbackMode: "detach",
        },
      }),
    ).toEqual({
      toolName: "rename-thread",
      input: { threadId: "sample-thread", title: "Sample title" },
      instanceId: "sample-instance",
      callbackMode: "detach",
    });
  });

  it("repairs an encoded input object that was closed too early or sent twice", () => {
    expect(
      normalizeExecuteToolArgs({
        toolName: "cortex-write",
        input: '{"path":"/a.md"}, "content":"hi"}',
      }),
    ).toEqual({ toolName: "cortex-write", input: { path: "/a.md", content: "hi" } });
    expect(
      normalizeExecuteToolArgs({
        toolName: "cortex-read",
        input: '{"path":"/a.md"}{"path":"/a.md"}',
      }),
    ).toEqual({ toolName: "cortex-read", input: { path: "/a.md" } });
    expect(
      normalizeExecuteToolArgs({ toolName: "cortex-read", input: '{"path":' }),
    ).toEqual({ toolName: "cortex-read", input: '{"path":' });
  });

  it("keeps malformed explicit inner input available for validation", () => {
    expect(
      normalizeExecuteToolArgs({
        input: { toolName: "rename-thread", input: "truncated JSON" },
      }),
    ).toEqual({ toolName: "rename-thread", input: "truncated JSON" });
  });

  it("reports the nested envelope's shapes without leaking field values", () => {
    expect(describeNestedExecuteToolArgs({ input: [], threadId: "sample-thread" })).toEqual({
      nestedExecuteToolTargetShape: "missing",
      nestedExecuteToolInputShape: "array",
      nestedExecuteToolSiblingFields: true,
    });
  });
});

describe("describeExecuteToolValidationStage", () => {
  it("locates invalid wrapper fields after normalization", () => {
    expect(describeExecuteToolValidationStage({ input: { prompt: "sample" } }))
      .toBe("wrapper-target");
    expect(describeExecuteToolValidationStage({ toolName: "sample", input: [] }))
      .toBe("wrapper-input");
    expect(describeExecuteToolValidationStage(normalizeExecuteToolArgs({
      input: { toolName: "sample", input: {} },
    }))).toBe("wrapper-target-and-input-valid");
  });
});
