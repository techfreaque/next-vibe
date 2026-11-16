/**
 * Inline <think> splitter. Regression: models that stream reasoning inside
 * the answer text (`<think>…</think>answer`) showed the tag and their
 * reasoning in the visible answer (and counted reasoning as answer text).
 */

import { describe, expect, it } from "bun:test";

import {
  type InlineThinkEvent,
  InlineThinkSplitter,
  splitInlineThink,
} from "./inline-think-splitter";

/** Feed chunks, flush, and fold adjacent deltas so chunking does not matter. */
function run(chunks: string[]): string[] {
  const splitter = new InlineThinkSplitter();
  const events: InlineThinkEvent[] = [];
  for (const chunk of chunks) {
    events.push(...splitter.push(chunk));
  }
  events.push(...splitter.flush());
  const folded: string[] = [];
  for (const event of events) {
    const label =
      event.type === "text"
        ? `T:${event.text}`
        : event.type === "reasoning-delta"
          ? `R:${event.text}`
          : event.type === "reasoning-start"
            ? "START"
            : "END";
    const prev = folded.at(-1);
    if (prev?.startsWith("T:") && label.startsWith("T:")) {
      folded[folded.length - 1] = prev + label.slice(2);
    } else if (prev?.startsWith("R:") && label.startsWith("R:")) {
      folded[folded.length - 1] = prev + label.slice(2);
    } else {
      folded.push(label);
    }
  }
  return folded;
}

/** Every way to cut `text` into two chunks gives the same result. */
function expectChunkInvariant(text: string, expected: string[]): void {
  expect(run([text])).toEqual(expected);
  for (let i = 1; i < text.length; i++) {
    expect(run([text.slice(0, i), text.slice(i)])).toEqual(expected);
  }
  expect(run([...text])).toEqual(expected);
}

describe("InlineThinkSplitter", () => {
  it("passes plain text through", () => {
    expectChunkInvariant("Hello <b>world</b> a < b", [
      "T:Hello <b>world</b> a < b",
    ]);
  });

  it("splits a complete inline block from the answer", () => {
    expectChunkInvariant("<think>plan it</think>The answer.", [
      "START",
      "R:plan it",
      "END",
      "T:The answer.",
    ]);
  });

  it("matches tags case-insensitively", () => {
    expectChunkInvariant("<THINK>r</Think>a", ["START", "R:r", "END", "T:a"]);
  });

  it("keeps text before the block as answer text", () => {
    expectChunkInvariant("Sure. <think>r</think>Done", [
      "T:Sure. ",
      "START",
      "R:r",
      "END",
      "T:Done",
    ]);
  });

  it("closes an unclosed block on flush", () => {
    expectChunkInvariant("<think>still reasoning", [
      "START",
      "R:still reasoning",
      "END",
    ]);
  });

  it("drops an orphaned closing tag in answer text", () => {
    expectChunkInvariant("</think>Answer", ["T:Answer"]);
  });

  it("drops a nested opening tag inside reasoning", () => {
    expectChunkInvariant("<think>a<think>b</think>c", [
      "START",
      "R:ab",
      "END",
      "T:c",
    ]);
  });

  it("handles several blocks", () => {
    expectChunkInvariant("<think>a</think>x<think>b</think>y", [
      "START",
      "R:a",
      "END",
      "T:x",
      "START",
      "R:b",
      "END",
      "T:y",
    ]);
  });

  it("holds back a partial tag until the next chunk decides it", () => {
    const splitter = new InlineThinkSplitter();
    expect(splitter.push("Hi <thi")).toEqual([{ type: "text", text: "Hi " }]);
    expect(splitter.push("nk>r")).toEqual([
      { type: "reasoning-start" },
      { type: "reasoning-delta", text: "r" },
    ]);
    expect(splitter.isInReasoning).toBe(true);
    expect(splitter.push("</th")).toEqual([]);
    expect(splitter.push("ink>ok")).toEqual([
      { type: "reasoning-end" },
      { type: "text", text: "ok" },
    ]);
  });

  it("releases a held-back non-tag as text", () => {
    const splitter = new InlineThinkSplitter();
    expect(splitter.push("a <t")).toEqual([{ type: "text", text: "a " }]);
    expect(splitter.push("able>")).toEqual([
      { type: "text", text: "<table>" },
    ]);
    expect(splitter.push("x <")).toEqual([{ type: "text", text: "x " }]);
    expect(splitter.flushBuffer()).toEqual([{ type: "text", text: "<" }]);
    expect(splitter.flush()).toEqual([]);
  });
});

describe("splitInlineThink", () => {
  it("splits full text into answer and reasoning", () => {
    expect(splitInlineThink("<think>why</think>Because.")).toEqual({
      text: "Because.",
      reasoning: "why",
    });
    expect(splitInlineThink("No tags")).toEqual({
      text: "No tags",
      reasoning: "",
    });
  });
});
