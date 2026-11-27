/**
 * Streaming TTS chunk boundaries
 *
 * Decides where the streamed reply text is cut into TTS requests. The first
 * chunk is what the listener waits for, so it is cut at the first complete
 * short sentence (or clause); later chunks are bigger (fewer requests, more
 * natural prosody) and are generated while the previous one plays.
 *
 * A boundary anywhere in the buffer counts, not only at its end: tokens
 * rarely end exactly on the period ("lo. Next"), and waiting for one that does
 * delayed the first audio by whole sentences.
 */

/** First chunk: smallest sentence worth a TTS request. */
export const TTS_FIRST_CHUNK_MIN = 24;
/** First chunk: cut at a clause (,;:) once this much text waits. */
export const TTS_FIRST_CHUNK_CLAUSE_AT = 60;
/** Later chunks: minimum size. */
export const TTS_CHUNK_MIN = 50;
/** Prefer a natural break once the buffer is this large. */
export const TTS_CHUNK_SOFT_MAX = 300;
/** Force a cut at this size. */
export const TTS_CHUNK_HARD_MAX = 450;

/** Sentence end followed by whitespace (so "3.5" or "e.g" mid-token is not one). */
const SENTENCE_END = /[.!?…]+["'”’)\]]*\s+/g;
/** Sentence end at the very end of the buffer. */
const SENTENCE_END_AT_TAIL = /[.!?…]+["'”’)\]]*$/;
const CLAUSE_END = /[,;:]\s+|\n+/g;

function lastMatchEnd(text: string, pattern: RegExp, min: number): number {
  let best = -1;
  for (const match of text.matchAll(pattern)) {
    const end = (match.index ?? 0) + match[0].length;
    if (end >= min) {
      best = end;
    }
  }
  return best;
}

function firstMatchEnd(text: string, pattern: RegExp, min: number): number {
  for (const match of text.matchAll(pattern)) {
    const end = (match.index ?? 0) + match[0].length;
    if (end >= min) {
      return end;
    }
  }
  return -1;
}

/** An unclosed ``` fence: never cut (the markdown stripper needs it closed). */
function insideCodeFence(text: string): boolean {
  return (text.match(/```/g)?.length ?? 0) % 2 === 1;
}

/**
 * Index to cut the buffer at (text before it becomes one TTS chunk), or -1
 * to keep buffering.
 */
export function findTtsChunkBoundary(
  text: string,
  isFirstChunk: boolean,
): number {
  if (insideCodeFence(text)) {
    return -1;
  }
  const min = isFirstChunk ? TTS_FIRST_CHUNK_MIN : TTS_CHUNK_MIN;
  if (text.trim().length < min) {
    return -1;
  }

  // The first chunk takes the FIRST sentence that is long enough: lowest
  // latency. Later chunks take the LAST one: fewer, fuller requests.
  const sentenceEnd = isFirstChunk
    ? firstMatchEnd(text, SENTENCE_END, min)
    : lastMatchEnd(text, SENTENCE_END, min);
  if (sentenceEnd > 0) {
    return sentenceEnd;
  }
  if (SENTENCE_END_AT_TAIL.test(text)) {
    return text.length;
  }

  if (isFirstChunk && text.length >= TTS_FIRST_CHUNK_CLAUSE_AT) {
    const clauseEnd = firstMatchEnd(text, CLAUSE_END, min);
    if (clauseEnd > 0) {
      return clauseEnd;
    }
  }

  if (text.length >= TTS_CHUNK_SOFT_MAX) {
    const breakEnd = lastMatchEnd(text, CLAUSE_END, min);
    if (breakEnd > 0) {
      return breakEnd;
    }
  }

  if (text.length >= TTS_CHUNK_HARD_MAX) {
    const space = text.lastIndexOf(" ", TTS_CHUNK_HARD_MAX);
    return space > min ? space + 1 : text.length;
  }

  return -1;
}
