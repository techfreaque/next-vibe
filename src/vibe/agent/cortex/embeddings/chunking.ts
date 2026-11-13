/**
 * Token-safe chunking for the embedding model.
 *
 * baai/bge-m3 (XLM-RoBERTa SentencePiece tokenizer) accepts at most 8192
 * tokens per input; one token over and the provider rejects the whole request
 * with a 400. We have no bge-m3 tokenizer in the repo, so token counts are
 * estimated conservatively per character class:
 *
 * - ASCII:                      1 token per 3 chars (code, JSON, URLs run ~3:1)
 * - Latin-ext/Greek/Cyrillic/
 *   Hebrew/Arabic (U+0080-07FF): 1 token per 2 chars
 * - everything else (CJK, Thai,
 *   Devanagari, emoji, ...):     1 token per char
 *
 * Chunks target EMBEDDING_CHUNK_TOKEN_BUDGET, well under the hard limit, so an
 * estimate that runs a bit low still lands inside it. If the provider still
 * rejects a chunk as too long, the caller splits it and retries.
 */

/** bge-m3 hard input limit (tokens). */
export const EMBEDDING_MODEL_MAX_TOKENS = 8192;

/** Estimated-token budget per chunk (~25% headroom under the hard limit). */
export const EMBEDDING_CHUNK_TOKEN_BUDGET = 6000;

/** Smallest chunk we still split further after a too-long rejection. */
export const EMBEDDING_MIN_SPLIT_CHARS = 200;

/** Conservative token weight of one UTF-16 code unit. */
function charTokenWeight(code: number): number {
  if (code < 0x80) {
    return 1 / 3;
  }
  if (code < 0x800) {
    return 1 / 2;
  }
  // Surrogate halves: an astral char (emoji, rare CJK) is two code units and
  // counts as ~1 token total.
  if (code >= 0xd800 && code <= 0xdfff) {
    return 1 / 2;
  }
  return 1;
}

/** Conservative token estimate for bge-m3. */
export function estimateEmbeddingTokens(text: string): number {
  let tokens = 0;
  for (let i = 0; i < text.length; i++) {
    tokens += charTokenWeight(text.charCodeAt(i));
  }
  return Math.ceil(tokens);
}

/** Never cut between the two halves of a surrogate pair. */
function safeCut(text: string, index: number): number {
  if (index <= 0 || index >= text.length) {
    return index;
  }
  const code = text.charCodeAt(index);
  // Low surrogate at the cut point means a pair would be split: back off one.
  return code >= 0xdc00 && code <= 0xdfff ? index - 1 : index;
}

/**
 * Within the last 10% of a chunk, prefer cutting after a paragraph break,
 * then a line break, then whitespace, so chunks keep whole sentences.
 */
function preferredCut(text: string, start: number, hardEnd: number): number {
  const window = Math.max(1, Math.floor((hardEnd - start) / 10));
  const minEnd = hardEnd - window;
  const slice = text.slice(minEnd, hardEnd);
  for (const sep of ["\n\n", "\n", " "]) {
    const idx = slice.lastIndexOf(sep);
    if (idx !== -1) {
      return minEnd + idx + sep.length;
    }
  }
  return hardEnd;
}

/**
 * Split text into chunks whose estimated token count stays within budget.
 * Returns [text] when it already fits.
 */
export function chunkTextForEmbedding(
  text: string,
  tokenBudget: number = EMBEDDING_CHUNK_TOKEN_BUDGET,
): string[] {
  if (estimateEmbeddingTokens(text) <= tokenBudget) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let tokens = 0;
    let end = start;
    while (end < text.length) {
      const weight = charTokenWeight(text.charCodeAt(end));
      if (tokens + weight > tokenBudget) {
        break;
      }
      tokens += weight;
      end++;
    }

    if (end >= text.length) {
      chunks.push(text.slice(start));
      break;
    }

    let cut = safeCut(text, preferredCut(text, start, end));
    if (cut <= start) {
      // Degenerate budget: always make progress.
      cut = start + 1;
    }
    chunks.push(text.slice(start, cut));
    start = cut;
  }

  return chunks.filter((chunk) => chunk.trim().length > 0);
}

/** Split a chunk in two halves at a whitespace boundary near the middle. */
export function splitChunkInHalf(text: string): [string, string] {
  const mid = Math.floor(text.length / 2);
  const cut = safeCut(text, preferredCut(text, 0, mid));
  const safe = cut <= 0 || cut >= text.length ? safeCut(text, mid) : cut;
  return [text.slice(0, safe), text.slice(safe)];
}

/**
 * True when a provider error says the input exceeded the token limit.
 * OpenRouter forwards provider errors in different shapes, so match loosely.
 * Any 413 counts; a 400 counts when its body mentions length/tokens/context.
 */
export function isInputTooLongError(status: number, body: string): boolean {
  if (status === 413) {
    return true;
  }
  if (status !== 400) {
    return false;
  }
  return /token|too long|too large|length|context|maximum|exceed/i.test(body);
}
