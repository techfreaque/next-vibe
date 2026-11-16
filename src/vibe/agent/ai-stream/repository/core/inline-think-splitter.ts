/**
 * Inline <think> splitter.
 *
 * Some models/providers stream their reasoning INSIDE the answer text
 * (`<think>…</think>answer`) instead of as provider reasoning parts. Fed the
 * raw text deltas, this splitter turns that inline markup into ordered
 * reasoning events so reasoning never reaches the answer text, for any model.
 *
 * - Tags may be split across chunks (`<thi` + `nk>`): a trailing partial tag
 *   is held back until the next delta (or `flush`) decides it.
 * - An unclosed `<think>` keeps everything after it as reasoning; `flush`
 *   closes it.
 * - An orphaned `</think>` in answer text (reasoning came via the provider's
 *   reasoning field, then the model echoed the closer) is dropped.
 * - A nested/repeated `<think>` inside reasoning is dropped.
 * Matching is case-insensitive.
 */

export type InlineThinkEvent =
  | { readonly type: "text"; readonly text: string }
  | { readonly type: "reasoning-start" }
  | { readonly type: "reasoning-delta"; readonly text: string }
  | { readonly type: "reasoning-end" };

const OPEN_TAG = "<think>";
const CLOSE_TAG = "</think>";

/** Length of the longest suffix of `text` that is a proper prefix of a tag. */
function partialTagSuffixLength(text: string): number {
  const lower = text.toLowerCase();
  const maxLen = Math.min(lower.length, CLOSE_TAG.length - 1);
  for (let len = maxLen; len > 0; len--) {
    const suffix = lower.slice(lower.length - len);
    if (OPEN_TAG.startsWith(suffix) || CLOSE_TAG.startsWith(suffix)) {
      return len;
    }
  }
  return 0;
}

export class InlineThinkSplitter {
  private buffer = "";
  private inReasoning = false;

  /** True while an inline `<think>` block is open. */
  get isInReasoning(): boolean {
    return this.inReasoning;
  }

  /** Feed one text delta; returns the events it resolves, in order. */
  push(delta: string): InlineThinkEvent[] {
    const events: InlineThinkEvent[] = [];
    let rest = this.buffer + delta;
    this.buffer = "";

    while (rest.length > 0) {
      const lower = rest.toLowerCase();
      const openIdx = lower.indexOf(OPEN_TAG);
      const closeIdx = lower.indexOf(CLOSE_TAG);
      const tagIdx =
        openIdx === -1
          ? closeIdx
          : closeIdx === -1
            ? openIdx
            : Math.min(openIdx, closeIdx);

      if (tagIdx === -1) {
        const held = partialTagSuffixLength(rest);
        this.emit(events, rest.slice(0, rest.length - held));
        this.buffer = rest.slice(rest.length - held);
        break;
      }

      this.emit(events, rest.slice(0, tagIdx));
      const isOpen = tagIdx === openIdx;
      rest = rest.slice(tagIdx + (isOpen ? OPEN_TAG.length : CLOSE_TAG.length));

      if (isOpen && !this.inReasoning) {
        this.inReasoning = true;
        events.push({ type: "reasoning-start" });
      } else if (!isOpen && this.inReasoning) {
        this.inReasoning = false;
        events.push({ type: "reasoning-end" });
      }
      // else: nested <think> inside reasoning / orphaned </think> in text - dropped
    }

    return events;
  }

  /** Release a held-back partial tag as plain content (end of a text block). */
  flushBuffer(): InlineThinkEvent[] {
    const events: InlineThinkEvent[] = [];
    this.emit(events, this.buffer);
    this.buffer = "";
    return events;
  }

  /** End of the step/stream: release the buffer and close an open block. */
  flush(): InlineThinkEvent[] {
    const events = this.flushBuffer();
    if (this.inReasoning) {
      this.inReasoning = false;
      events.push({ type: "reasoning-end" });
    }
    return events;
  }

  private emit(events: InlineThinkEvent[], text: string): void {
    if (text.length === 0) {
      return;
    }
    events.push(
      this.inReasoning
        ? { type: "reasoning-delta", text }
        : { type: "text", text },
    );
  }
}

/** Split a complete (non-streamed) text into answer text and reasoning. */
export function splitInlineThink(text: string): {
  text: string;
  reasoning: string;
} {
  const splitter = new InlineThinkSplitter();
  let answer = "";
  let reasoning = "";
  for (const event of [...splitter.push(text), ...splitter.flush()]) {
    if (event.type === "text") {
      answer += event.text;
    } else if (event.type === "reasoning-delta") {
      reasoning += event.text;
    }
  }
  return { text: answer, reasoning };
}
