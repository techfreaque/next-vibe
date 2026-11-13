/**
 * `toolInputToJsonSchema`: tool schemas must never carry `$ref` loops.
 * Gemini rejects them ("ref loops are only supported if they include optional
 * or nullable property values"), which failed every Gemini request carrying
 * execute-tool (its `input` is a record of the recursive WidgetDataSchema).
 */
import { describe, expect, it } from "bun:test";
import { type JSONSchema7 } from "ai";
import { z } from "zod";

import { WidgetDataSchema } from "../../core/utils/json";
import { inlineRecursiveRefs, toolInputToJsonSchema } from "./tool-json-schema";

describe("toolInputToJsonSchema", () => {
  it("leaves non-recursive schemas exactly as zod emits them", () => {
    const schema = z.object({
      name: z.string().describe("Name"),
      count: z.number().optional(),
      mode: z.enum(["a", "b"]),
    });
    expect(JSON.stringify(toolInputToJsonSchema(schema))).toBe(
      JSON.stringify(
        z.toJSONSchema(schema, {
          target: "draft-7",
          io: "input",
          unrepresentable: "any",
        }),
      ),
    );
  });

  it("inlines the recursive WidgetData record without any $ref or definitions", () => {
    const schema = z.object({
      toolName: z.string(),
      input: z.record(z.string(), WidgetDataSchema).default({}),
    });
    const result = toolInputToJsonSchema(schema);
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("$ref");
    expect(result.definitions).toBeUndefined();
    expect(result.required).toEqual(["toolName"]);

    const input = result.properties?.input;
    expect(typeof input).toBe("object");
    if (typeof input !== "object") {
      return;
    }
    expect(input.type).toBe("object");
    expect(input.default).toEqual({});
    const values = input.additionalProperties;
    expect(typeof values).toBe("object");
    if (typeof values !== "object") {
      return;
    }
    // One level of the JSON-value union is kept; the loop is cut with {}.
    const branches = values.anyOf ?? [];
    expect(branches).toContainEqual({ type: "string" });
    expect(branches).toContainEqual({ type: "array", items: {} });
    expect(branches).toContainEqual({
      type: "object",
      propertyNames: { type: "string" },
      additionalProperties: {},
    });
  });

  it("cuts mutual recursion and root self-references", () => {
    const result = inlineRecursiveRefs({
      type: "object",
      properties: {
        a: { $ref: "#/definitions/A", description: "kept" },
        self: { $ref: "#" },
      },
      definitions: {
        A: { type: "object", properties: { b: { $ref: "#/definitions/B" } } },
        B: { type: "object", properties: { a: { $ref: "#/definitions/A" } } },
      },
    });
    expect(result).toEqual({
      type: "object",
      properties: {
        a: {
          type: "object",
          description: "kept",
          properties: {
            b: { type: "object", properties: { a: {} } },
          },
        },
        self: {},
      },
    });
  });

  it("keeps unknown refs untouched", () => {
    const schema: JSONSchema7 = {
      type: "object",
      properties: { x: { $ref: "https://example.com/schema.json" } },
    };
    expect(inlineRecursiveRefs(schema)).toBe(schema);
  });
});
