/**
 * Streaming utilities for handling AI response streams
 */

/**
 * Parse a streaming chunk from the AI response
 * Handles Vercel AI SDK format: "0:"content"\n
 */
export function parseStreamChunk(line: string): string | null {
  if (!line.trim()) return null;

  // Handle Vercel AI SDK format: "0:"content"\n
  if (line.startsWith('0:"')) {
    try {
      // Extract the JSON string between 0:" and the closing "
      const jsonStr = line.slice(2); // Remove '0:'
      const parsed = JSON.parse(jsonStr);
      return parsed || null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Read a stream and call onChunk for each parsed chunk
 * Returns the complete content
 */
export async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  let fullContent = "";
  let buffer = "";

  try {
    while (true) {
      // Check if aborted
      if (signal?.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        const content = parseStreamChunk(line);
        if (content) {
          fullContent += content;
          onChunk(content);
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const content = parseStreamChunk(buffer);
      if (content) {
        fullContent += content;
        onChunk(content);
      }
    }
  } catch (error) {
    // If stream was interrupted, return partial content
    if (error instanceof Error && error.name === "AbortError") {
      return fullContent;
    }
    throw error;
  }

  return fullContent;
}

/**
 * Debounce function for limiting update frequency
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Create a debounced update function for streaming
 * Ensures updates happen at most every `interval` ms
 */
export function createDebouncedStreamUpdate(
  updateFn: (content: string) => void,
  interval: number = 100
): {
  update: (content: string) => void;
  flush: () => void;
} {
  let pendingContent: string | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  const flush = () => {
    if (pendingContent !== null) {
      updateFn(pendingContent);
      pendingContent = null;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const update = (content: string) => {
    pendingContent = content;

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        flush();
      }, interval);
    }
  };

  return { update, flush };
}

