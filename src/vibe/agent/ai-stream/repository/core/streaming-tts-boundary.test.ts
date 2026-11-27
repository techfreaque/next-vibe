import { describe, expect, it } from "bun:test";

import {
  findTtsChunkBoundary,
  TTS_CHUNK_HARD_MAX,
} from "./streaming-tts-boundary";

/** Feed text token by token and collect the chunks the handler would emit. */
function chunkStream(tokens: string[]): string[] {
  const chunks: string[] = [];
  let buffer = "";
  for (const token of tokens) {
    buffer += token;
    for (;;) {
      const cut = findTtsChunkBoundary(buffer, chunks.length === 0);
      if (cut <= 0) {
        break;
      }
      const text = buffer.slice(0, cut).trim();
      buffer = buffer.slice(cut);
      if (text) {
        chunks.push(text);
      }
    }
  }
  if (buffer.trim()) {
    chunks.push(buffer.trim());
  }
  return chunks;
}

describe("findTtsChunkBoundary", () => {
  it("cuts the first chunk at the first short sentence, even mid-token", () => {
    // The period arrives in the same token as the next word.
    const tokens = ["Sure, here", " is the", " plan. Next", " we", " go on."];
    const chunks = chunkStream(tokens);
    expect(chunks[0]).toBe("Sure, here is the plan.");
  });

  it("keeps buffering a first sentence shorter than the minimum", () => {
    expect(findTtsChunkBoundary("Hi. ", true)).toBe(-1);
  });

  it("does not treat a decimal point as a sentence end", () => {
    expect(findTtsChunkBoundary("The price went up by 3.5", true)).toBe(-1);
  });

  it("cuts a long first sentence at a clause", () => {
    const text =
      "Well, if you think about it for a second, the whole system fits and";
    expect(findTtsChunkBoundary(text, true)).toBe(
      text.indexOf("second, ") + "second, ".length,
    );
  });

  it("never cuts inside an open code fence", () => {
    expect(
      findTtsChunkBoundary("Run this. ```bash\necho done. More text. ", true),
    ).toBe(-1);
  });

  it("bundles later sentences into fuller chunks", () => {
    const text =
      "First short one. Second sentence is right here. Third one ends now. ";
    // Later chunk: takes the last complete sentence boundary
    expect(findTtsChunkBoundary(text, false)).toBe(text.length);
  });

  it("forces a cut on a huge buffer without punctuation", () => {
    const text = "word ".repeat(120);
    const cut = findTtsChunkBoundary(text, false);
    expect(cut).toBeGreaterThan(0);
    expect(cut).toBeLessThanOrEqual(TTS_CHUNK_HARD_MAX + 1);
  });
});
