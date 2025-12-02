/**
 * Text Chunking Utility for TTS
 * Splits text into chunks for sequential audio generation
 */

const MAX_CHUNK_SIZE = 800; // characters per chunk
const MIN_CHUNK_SIZE = 100; // minimum characters per chunk (combine small chunks)
const SENTENCE_ENDINGS = /[.!?]+\s+/g;

/**
 * Split text into chunks for TTS processing
 * Strategy:
 * 1. Split by newlines first (preserve paragraph structure)
 * 2. For each paragraph, split by sentences
 * 3. Group sentences into chunks up to MAX_CHUNK_SIZE
 * 4. Preserve sentence boundaries (don't split mid-sentence)
 *
 * @param text - The full text to chunk
 * @returns Array of text chunks
 */
export function chunkTextForTTS(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks: string[] = [];

  // Split by newlines to preserve paragraph structure
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);

  for (const paragraph of paragraphs) {
    // If paragraph is small enough, add it as a single chunk
    if (paragraph.length <= MAX_CHUNK_SIZE) {
      chunks.push(paragraph.trim());
      continue;
    }

    // Split paragraph into sentences
    const sentences: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Reset regex state
    SENTENCE_ENDINGS.lastIndex = 0;

    while ((match = SENTENCE_ENDINGS.exec(paragraph)) !== null) {
      const sentence = paragraph.slice(
        lastIndex,
        match.index + match[0].length,
      );
      sentences.push(sentence);
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text as last sentence
    if (lastIndex < paragraph.length) {
      sentences.push(paragraph.slice(lastIndex));
    }

    // Group sentences into chunks
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();

      // If single sentence exceeds max size, split it by words
      if (trimmedSentence.length > MAX_CHUNK_SIZE) {
        // Save current chunk if it has content
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }

        // Split long sentence by words
        const words = trimmedSentence.split(/\s+/);
        let wordChunk = "";

        for (const word of words) {
          if (`${wordChunk} ${word}`.length > MAX_CHUNK_SIZE) {
            if (wordChunk.trim().length > 0) {
              chunks.push(wordChunk.trim());
            }
            wordChunk = word;
          } else {
            wordChunk = wordChunk ? `${wordChunk} ${word}` : word;
          }
        }

        if (wordChunk.trim().length > 0) {
          chunks.push(wordChunk.trim());
        }
        continue;
      }

      // Check if adding this sentence would exceed max size
      const potentialChunk = currentChunk
        ? `${currentChunk} ${trimmedSentence}`
        : trimmedSentence;

      if (potentialChunk.length > MAX_CHUNK_SIZE) {
        // Save current chunk and start new one
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = trimmedSentence;
      } else {
        currentChunk = potentialChunk;
      }
    }

    // Add remaining chunk
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
  }

  // Post-process: Combine small chunks with next chunk
  const combinedChunks: string[] = [];
  let i = 0;

  while (i < chunks.length) {
    const currentChunk = chunks[i]!;

    // If current chunk is too small and there's a next chunk, try to combine
    if (
      currentChunk.length < MIN_CHUNK_SIZE &&
      i + 1 < chunks.length &&
      currentChunk.length + chunks[i + 1]!.length <= MAX_CHUNK_SIZE
    ) {
      // Combine with next chunk
      combinedChunks.push(`${currentChunk}\n${chunks[i + 1]!}`);
      i += 2; // Skip next chunk since we combined it
    } else {
      combinedChunks.push(currentChunk);
      i++;
    }
  }

  return combinedChunks;
}

/**
 * Calculate total character count across all chunks
 * Useful for cost estimation
 */
export function getTotalCharacterCount(chunks: string[]): number {
  return chunks.reduce((total, chunk) => total + chunk.length, 0);
}
