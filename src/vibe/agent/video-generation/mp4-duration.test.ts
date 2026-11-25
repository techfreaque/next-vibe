import { describe, expect, test } from "bun:test";

import { billableVideoSeconds, readMp4DurationSeconds } from "./mp4-duration";

function box(type: string, payload: Uint8Array): Uint8Array {
  const out = new Uint8Array(8 + payload.length);
  new DataView(out.buffer).setUint32(0, out.length);
  for (let i = 0; i < 4; i++) {
    out[4 + i] = type.charCodeAt(i);
  }
  out.set(payload, 8);
  return out;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/** Minimal mp4: ftyp, mdat, then moov/mvhd (v0) like a non-faststart file. */
function mp4(timescale: number, duration: number): Uint8Array {
  const mvhd = new Uint8Array(100);
  const view = new DataView(mvhd.buffer);
  view.setUint32(12, timescale);
  view.setUint32(16, duration);
  return concat(
    box("ftyp", new Uint8Array(16)),
    box("mdat", new Uint8Array(64)),
    box("moov", box("mvhd", mvhd)),
  );
}

describe("readMp4DurationSeconds", () => {
  test("reads the 25-frame clip ModelsLab v6 delivered", () => {
    expect(readMp4DurationSeconds(mp4(16_000, 25_000))).toBeCloseTo(1.5625);
  });

  test("reads a 5 s clip", () => {
    expect(readMp4DurationSeconds(mp4(1000, 5000))).toBe(5);
  });

  test("returns undefined for non-mp4 bytes", () => {
    expect(
      readMp4DurationSeconds(new TextEncoder().encode('{"error":"x"}')),
    ).toBeUndefined();
  });
});

describe("billableVideoSeconds", () => {
  test("bills the delivered length when the clip is far short", () => {
    expect(billableVideoSeconds(5, 1.5625)).toBe(1.6);
  });

  test("keeps the requested length within tolerance", () => {
    expect(billableVideoSeconds(5, 4.96)).toBe(5);
    expect(billableVideoSeconds(6, 5.6)).toBe(6);
    expect(billableVideoSeconds(5, 5.04)).toBe(5);
  });

  test("keeps the requested length when unreadable", () => {
    expect(billableVideoSeconds(5, undefined)).toBe(5);
  });
});
