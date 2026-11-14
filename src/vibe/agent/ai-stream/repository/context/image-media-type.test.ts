/**
 * The declared media type of an image sent to a provider must match its bytes
 * (Anthropic 400s otherwise): generated JPEGs used to be declared image/png.
 */

import { describe, expect, it } from "bun:test";

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
    const visionModel = getChatModelById("claude-sonnet-4.6");
    expect(visionModel?.inputs).toContain("image");

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
