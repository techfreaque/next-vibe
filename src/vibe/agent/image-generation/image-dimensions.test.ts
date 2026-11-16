import { describe, expect, it } from "bun:test";

import { readImageDimensions } from "./image-dimensions";

function png(width: number, height: number): Uint8Array {
  const bytes = new Uint8Array(33);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  const view = new DataView(bytes.buffer);
  view.setUint32(8, 13);
  bytes.set([0x49, 0x48, 0x44, 0x52], 12); // IHDR
  view.setUint32(16, width);
  view.setUint32(20, height);
  return bytes;
}

function jpeg(width: number, height: number): Uint8Array {
  // SOI, APP0 (len 16), SOF0 (len 17)
  const bytes = new Uint8Array(2 + 18 + 19 + 2);
  const view = new DataView(bytes.buffer);
  bytes.set([0xff, 0xd8], 0);
  bytes.set([0xff, 0xe0], 2);
  view.setUint16(4, 16);
  bytes.set([0xff, 0xc0], 20);
  view.setUint16(22, 17);
  bytes[24] = 8;
  view.setUint16(25, height);
  view.setUint16(27, width);
  return bytes;
}

function webpVp8x(width: number, height: number): Uint8Array {
  const bytes = new Uint8Array(30);
  bytes.set([0x52, 0x49, 0x46, 0x46], 0); // RIFF
  bytes.set([0x57, 0x45, 0x42, 0x50], 8); // WEBP
  bytes.set([0x56, 0x50, 0x38, 0x58], 12); // VP8X
  const w = width - 1;
  const h = height - 1;
  bytes.set([w & 0xff, (w >> 8) & 0xff, (w >> 16) & 0xff], 24);
  bytes.set([h & 0xff, (h >> 8) & 0xff, (h >> 16) & 0xff], 27);
  return bytes;
}

function webpVp8l(width: number, height: number): Uint8Array {
  const bytes = new Uint8Array(30);
  bytes.set([0x52, 0x49, 0x46, 0x46], 0);
  bytes.set([0x57, 0x45, 0x42, 0x50], 8);
  bytes.set([0x56, 0x50, 0x38, 0x4c], 12); // VP8L
  bytes[20] = 0x2f;
  const bits = (width - 1) | ((height - 1) << 14);
  bytes.set(
    [bits & 0xff, (bits >> 8) & 0xff, (bits >> 16) & 0xff, (bits >> 24) & 0xff],
    21,
  );
  return bytes;
}

describe("readImageDimensions", () => {
  it("reads PNG, JPEG and WebP headers", () => {
    expect(readImageDimensions(png(2048, 1152))).toEqual({
      width: 2048,
      height: 1152,
    });
    expect(readImageDimensions(jpeg(1792, 1024))).toEqual({
      width: 1792,
      height: 1024,
    });
    expect(readImageDimensions(webpVp8x(1344, 768))).toEqual({
      width: 1344,
      height: 768,
    });
    expect(readImageDimensions(webpVp8l(1024, 1792))).toEqual({
      width: 1024,
      height: 1792,
    });
  });

  it("returns null for unknown or truncated data", () => {
    expect(readImageDimensions(new Uint8Array([1, 2, 3]))).toBeNull();
    expect(readImageDimensions(new Uint8Array(0))).toBeNull();
  });
});
