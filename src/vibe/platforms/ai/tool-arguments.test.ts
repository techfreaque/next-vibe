import { describe, expect, it } from "bun:test";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { z } from "zod";

import { normalizeExecuteToolArgs } from "../../agent/ai-stream/repository/loop/execute-tool-args";
import { CallbackModeDB } from "../../execute-tool/constants";
import {
  rawToolArgumentSchema,
  safeToolIssues,
  toolArgsForLog,
  unknownToolFields,
} from "./tool-arguments";
import { toolInputToJsonSchema } from "./tool-json-schema";
import { modelTargetIssues } from "./tools-loader";

const dispatch = z.object({
  toolName: z.string(),
  input: z.record(z.string(), z.json()).default({}),
  callbackMode: z.enum(CallbackModeDB).default("wait"),
});
const argumentsSchema = rawToolArgumentSchema(
  toolInputToJsonSchema(dispatch),
  dispatch,
  normalizeExecuteToolArgs,
);
const rename = z.object({
  title: z.string(),
  description: z.string().optional(),
});

describe("model tool arguments", () => {
  it("keeps omitted defaults and recognized spelling variants exactly as sent", () => {
    expect(argumentsSchema.parse({ toolName: "rename-thread" })).toEqual({
      toolName: "rename-thread",
    });
    const raw = {
      toolName: "rename-thread",
      input: { title: "Plans" },
      callbackMode: "end_loop",
    };
    expect(argumentsSchema.parse(raw)).toEqual(raw);
    expect(normalizeExecuteToolArgs(raw).callbackMode).toBe("endLoop");
    expect(raw.callbackMode).toBe("end_loop");
  });

  it("reports an unrecognized flag without silently changing it to wait", () => {
    const bad = {
      toolName: "rename-thread",
      endloop: true,
      input: { title: "Plans" },
    };
    const message = argumentsSchema.safeParse(bad).error?.message;
    expect(message).toContain("Unknown key 'endloop'");
    expect(message).toContain("endLoop");
    expect(
      argumentsSchema
        .safeParse({ ...bad, callbackMode: "omit" })
        .error?.issues.some((issue) => issue.path.includes("callbackMode")),
    ).toBe(true);
    const nested = {
      toolName: "rename-thread",
      input: { title: "Plans", callbackMode: "endLoop" },
    };
    expect(argumentsSchema.safeParse(nested).error?.message).toContain(
      "Misplaced callbackMode",
    );
  });

  it("names every misplaced target field and shows which fields are optional", () => {
    const issues = unknownToolFields(
      toolInputToJsonSchema(rename),
      { name: "Plans", extra: true },
      "input",
    );
    expect(issues).toEqual([
      "Unknown keys 'name', 'extra' in input. Expected { title: string, description?: string }",
    ]);
  });

  it("checks nested objects and arrays while allowing free-form record keys", () => {
    const schema = toolInputToJsonSchema(
      z.object({
        entries: z.array(rename),
        labels: z.record(z.string(), z.string()),
      }),
    );
    expect(
      unknownToolFields(
        schema,
        { entries: [{ title: "OK", extra: true }], labels: { custom: "OK" } },
        "input",
      ),
    ).toEqual([
      "Unknown key 'extra' in input.entries[0]. Expected { title: string, description?: string }",
    ]);
    expect(
      unknownToolFields(
        schema,
        { entries: '[{"title":"OK","extra":true}]' },
        "input",
      ),
    ).toHaveLength(1);
  });

  it("retains a conflicting nested envelope for the model to correct", () => {
    const ambiguous = {
      input: {
        toolName: "rename-thread",
        input: { title: "Plans" },
        name: "unaccounted",
      },
    };
    expect(normalizeExecuteToolArgs(ambiguous)).toEqual(ambiguous);
    expect(argumentsSchema.safeParse(ambiguous).success).toBe(false);
  });

  it("validates remote input against the receiver's AI fields while accepting a server-supplied threadId", async () => {
    const user: JWTPublicPayloadType = {
      isPublic: true,
      leadId: crypto.randomUUID(),
      roles: [UserPermissionRole.PUBLIC],
    };
    const input = {
      threadId: crypto.randomUUID(),
      title: "Plans",
      name: "Typo",
    };
    const issues = await modelTargetIssues(
      "rename-thread",
      input,
      user,
      "remote-dispatch",
    );
    expect(issues).toEqual([
      "Unknown key 'name' in input. Expected { title: string, description?: string }",
    ]);
  });

  it("redacts secrets in open-ended data and in validation messages", () => {
    const raw = {
      toolName: "rename-thread",
      input: {
        name: "private text",
        headers: { authorization: "Bearer private" },
        apiKey: 1234,
      },
      callbackMode: "endLoop",
    };
    expect(toolArgsForLog(raw)).toEqual({
      toolName: "rename-thread",
      input: {
        name: "[redacted]",
        headers: { authorization: "[redacted]" },
        apiKey: "[redacted]",
      },
      callbackMode: "endLoop",
    });
    expect(safeToolIssues("name: rejected private text", raw)).toBe(
      "name: rejected [redacted]",
    );
  });
});
