/**
 * `toolInputToJsonSchema`: tool schemas must never carry `$ref` loops.
 * Gemini rejects them ("ref loops are only supported if they include optional
 * or nullable property values"), which failed every Gemini request carrying
 * execute-tool (its `input` is a record of the recursive WidgetDataSchema).
 */
import { type JSONSchema7 } from "ai";
import { describe, expect, it } from "bun:test";
import { z } from "zod";

import { WidgetDataSchema } from "../../core/utils/json";
import { getUnavailableModelIds } from "../../agent/models/all-models";
import { TtsModelId } from "../../agent/text-to-speech/models";
import {
  dropEnumValues,
  inlineRecursiveRefs,
  toolInputToJsonSchema,
} from "./tool-json-schema";

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

describe("dropEnumValues", () => {
  it("removes unavailable ids from nested enums, never empties one", () => {
    const schema = toolInputToJsonSchema(
      z.object({
        voiceId: z.enum(["a", "b", "c"]),
        nested: z.object({ model: z.enum(["b", "d"]).optional() }),
        only: z.enum(["b"]),
      }),
    );
    dropEnumValues(schema, new Set(["b"]));
    const props = schema.properties ?? {};
    const voice = props.voiceId;
    const nested = props.nested;
    const only = props.only;
    expect(typeof voice === "object" ? voice.enum : null).toEqual(["a", "c"]);
    const model =
      typeof nested === "object" ? nested.properties?.model : undefined;
    expect(typeof model === "object" ? model.enum : null).toEqual(["d"]);
    expect(typeof only === "object" ? only.enum : null).toEqual(["b"]);
  });

  it("hides ElevenLabs voices from the TTS enum without the key", () => {
    const none = {
      openRouter: true,
      claudeCode: false,
      voice: true,
      braveSearch: false,
      kagiSearch: false,
      anySearch: false,
      uncensoredAI: false,
      freedomGPT: false,
      gabAI: false,
      veniceAI: false,
      nanoGPT: true,
      scrappey: false,
      openAiImages: false,
      openAiStt: false,
      replicate: false,
      falAi: false,
      modelsLab: false,
      edenAiStt: true,
      deepgram: false,
      openAiTts: false,
      edenAiTts: true,
      elevenlabs: false,
      unbottledSystem: false,
      unbottledForce: false,
    };
    const unavailable = getUnavailableModelIds(none);
    expect(unavailable.has(TtsModelId.ELEVENLABS_RACHEL)).toBe(true);
    // Served by Eden AI even without an OpenAI key
    expect(unavailable.has(TtsModelId.OPENAI_NOVA)).toBe(false);
    const schema = toolInputToJsonSchema(
      z.object({ voiceId: z.enum(TtsModelId) }),
    );
    dropEnumValues(schema, unavailable);
    const voice = schema.properties?.voiceId;
    const values = typeof voice === "object" ? (voice.enum ?? []) : [];
    expect(values).toContain(TtsModelId.OPENAI_NOVA);
    expect(values.some((v) => String(v).startsWith("elevenlabs-"))).toBe(
      false,
    );
    expect(
      getUnavailableModelIds({ ...none, elevenlabs: true }).has(
        TtsModelId.ELEVENLABS_RACHEL,
      ),
    ).toBe(false);
  });
});
