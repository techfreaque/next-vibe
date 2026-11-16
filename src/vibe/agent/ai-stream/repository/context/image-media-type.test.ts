/**
 * The declared media type of an image sent to a provider must match its bytes
 * (Anthropic 400s otherwise): generated JPEGs used to be declared image/png.
 */

import { describe, expect, it } from "bun:test";

import { ChatModelId } from "../../models-definitions";

import {
  resolveImageMediaType,
  sniffImageMediaType,
} from "./image-media-type";

const b64 = (bytes: number[]): string =>
  Buffer.from(Uint8Array.from(bytes)).toString("base64");

const PNG = b64([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]);
const JPEG = b64([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const GIF = b64([...Buffer.from("GIF89a"), 1, 0, 1, 0, 0, 0]);
const WEBP = b64([...Buffer.from("RIFF"), 36, 0, 0, 0, ...Buffer.from("WEBP")]);

describe("sniffImageMediaType", () => {
  it("recognizes png, jpeg, gif and webp", () => {
    expect(sniffImageMediaType(PNG)).toBe("image/png");
    expect(sniffImageMediaType(JPEG)).toBe("image/jpeg");
    expect(sniffImageMediaType(GIF)).toBe("image/gif");
    expect(sniffImageMediaType(WEBP)).toBe("image/webp");
  });

  it("returns null for unknown or invalid data", () => {
    expect(sniffImageMediaType(b64([1, 2, 3, 4, 5, 6]))).toBeNull();
    expect(sniffImageMediaType("%%%not base64%%%")).toBeNull();
    expect(sniffImageMediaType("")).toBeNull();
  });
});

describe("resolveImageMediaType", () => {
  it("lets the bytes override a wrong declared type", () => {
    expect(resolveImageMediaType(JPEG, "image/png")).toBe("image/jpeg");
  });

  it("falls back to the declared type, then png", () => {
    expect(resolveImageMediaType(b64([1, 2, 3]), "image/avif")).toBe(
      "image/avif",
    );
    expect(resolveImageMediaType(b64([1, 2, 3]), undefined)).toBe("image/png");
  });
});

describe("buildToolResultOutput: generated image media type", () => {
  it("declares a generated JPEG as image/jpeg, not image/png", async () => {
    const { buildToolResultOutput } = await import("./tool-output");
    const { getChatModelById } = await import("../../models");
    const { createEndpointLogger } = await import("next-vibe/logger/server");
    const visionModel = getChatModelById(ChatModelId.CLAUDE_SONNET_4_6);
    expect(visionModel?.inputs.some((input) => input === "image")).toBe(true);

    const output = await buildToolResultOutput(
      createEndpointLogger(false, "en-GLOBAL"),
      { imageUrl: `data:image/png;base64,${JPEG}`, creditCost: 1 },
      "generate_image",
      visionModel,
      true,
    );

    expect(output.type).toBe("content");
    const imagePart =
      output.type === "content"
        ? output.value.find((p) => p.type === "image-data")
        : undefined;
    expect(imagePart?.type === "image-data" && imagePart.mediaType).toBe(
      "image/jpeg",
    );
  });
});

// Prod 2026-11-16: venice-uncensored (vision, Venice provider) received two
// generated PNGs from history as base64 TEXT (the OpenAI-compatible converter
// stringifies `content` tool outputs): a 14.6M-character prompt.
describe("buildToolResultOutput: providers that stringify tool results", () => {
  it("gives a Venice vision model the URL, never image-data", async () => {
    const { buildToolResultOutput } = await import("./tool-output");
    const { getChatModelById } = await import("../../models");
    const { createEndpointLogger } = await import("next-vibe/logger/server");
    const veniceModel = getChatModelById(ChatModelId.VENICE_UNCENSORED);
    expect(String(veniceModel?.apiProvider)).toBe("venice-ai");
    expect(veniceModel?.inputs.some((input) => input === "image")).toBe(true);

    for (const isCurrentTurn of [true, false]) {
      const output = await buildToolResultOutput(
        createEndpointLogger(false, "en-GLOBAL"),
        {
          result: { imageUrl: `data:image/png;base64,${JPEG}`, creditCost: 1 },
        },
        "execute-tool",
        veniceModel,
        isCurrentTurn,
      );
      expect(output.type).toBe("json");
      expect(JSON.stringify(output)).not.toContain(JPEG);
    }

    const contentOutput = await buildToolResultOutput(
      createEndpointLogger(false, "en-GLOBAL"),
      {
        type: "content",
        value: [
          { type: "image-data", data: JPEG, mediaType: "image/jpeg" },
          { type: "text", text: "screenshot" },
        ],
      },
      "browser-take-screenshot",
      veniceModel,
      true,
    );
    expect(JSON.stringify(contentOutput)).not.toContain(JPEG);
  });
});

describe("summarizePromptSize", () => {
  it("names the part that blows the context", async () => {
    const { summarizePromptSize, isContextOverflowText } =
      await import("../loop/prompt-size");
    expect(
      isContextOverflowText(
        "This model's maximum context length is 131072 tokens.",
      ),
    ).toBe(true);
    expect(isContextOverflowText("rate limit exceeded")).toBe(false);

    const huge = "A".repeat(50_000);
    const summary = summarizePromptSize("system prompt", [
      { role: "user", content: [{ type: "text", text: "hi" }] },
      {
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: "c1",
            toolName: "generate_image",
            output: {
              type: "content",
              value: [{ type: "text", text: huge }],
            },
          },
        ],
      },
    ]);
    expect(summary.systemPromptChars).toBe(13);
    expect(summary.messageCount).toBe(2);
    expect(summary.largestParts[0]?.toolName).toBe("generate_image");
    expect(summary.largestParts[0]?.partType).toBe("tool-result:content");
    expect(summary.charsByRole["tool"]).toBeGreaterThan(50_000);
  });
});
