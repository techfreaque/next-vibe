import { getMessagesInPath } from "./message-tree";
import type { ChatMessage, ChatState, ChatThread } from "./types";

/**
 * Search result with relevance score
 */
export interface SearchResult {
  thread: ChatThread;
  score: number;
  matchedMessages: Array<{
    message: ChatMessage;
    snippet: string;
  }>;
}

/**
 * Normalize text for searching (lowercase, trim, remove extra spaces)
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Extract a snippet around the matched text
 */
function extractSnippet(
  text: string,
  query: string,
  contextLength = 50,
): string {
  const normalized = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalized.indexOf(normalizedQuery);

  if (index === -1) {
    return `${text.substring(0, contextLength * 2)}...`;
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(
    text.length,
    index + normalizedQuery.length + contextLength,
  );

  let snippet = text.substring(start, end);
  if (start > 0) {
    snippet = `...${snippet}`;
  }
  if (end < text.length) {
    snippet = `${snippet}...`;
  }

  return snippet;
}

/**
 * Calculate relevance score for a thread based on query
 */
function calculateScore(
  thread: ChatThread,
  messages: ChatMessage[],
  query: string,
): {
  score: number;
  matchedMessages: Array<{ message: ChatMessage; snippet: string }>;
} {
  const normalizedQuery = normalizeText(query);
  const queryTerms = normalizedQuery.split(" ").filter((t) => t.length > 0);

  let score = 0;
  const matchedMessages: Array<{ message: ChatMessage; snippet: string }> = [];

  // Title match (highest weight)
  const normalizedTitle = normalizeText(thread.title);
  if (normalizedTitle.includes(normalizedQuery)) {
    score += 100;
  } else {
    // Partial title match
    const titleMatches = queryTerms.filter((term) =>
      normalizedTitle.includes(term),
    ).length;
    score += titleMatches * 30;
  }

  // Preview match
  if (thread.metadata?.preview) {
    const normalizedPreview = normalizeText(thread.metadata.preview);
    if (normalizedPreview.includes(normalizedQuery)) {
      score += 50;
    } else {
      const previewMatches = queryTerms.filter((term) =>
        normalizedPreview.includes(term),
      ).length;
      score += previewMatches * 15;
    }
  }

  // Message content match
  for (const message of messages) {
    const normalizedContent = normalizeText(message.content);

    // Exact phrase match in message
    if (normalizedContent.includes(normalizedQuery)) {
      score += 20;
      matchedMessages.push({
        message,
        snippet: extractSnippet(message.content, query),
      });
    } else {
      // Partial match - count how many query terms appear
      const contentMatches = queryTerms.filter((term) =>
        normalizedContent.includes(term),
      ).length;
      if (contentMatches > 0) {
        score += contentMatches * 5;
        if (contentMatches >= queryTerms.length * 0.5) {
          // If at least half the terms match, include as matched message
          matchedMessages.push({
            message,
            snippet: extractSnippet(message.content, queryTerms[0]),
          });
        }
      }
    }
  }

  // Recency bonus (newer threads get slight boost)
  const daysSinceUpdate =
    (Date.now() - thread.updatedAt) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 1) {
    score += 10;
  } else if (daysSinceUpdate < 7) {
    score += 5;
  } else if (daysSinceUpdate < 30) {
    score += 2;
  }

  return { score, matchedMessages };
}

/**
 * Search threads with sophisticated relevance scoring
 */
export function searchThreads(state: ChatState, query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results: SearchResult[] = [];

  // Search through all threads
  for (const thread of Object.values(state.threads)) {
    const messages = getMessagesInPath(thread);
    const { score, matchedMessages } = calculateScore(thread, messages, query);

    // Only include threads with a score > 0
    if (score > 0) {
      results.push({
        thread,
        score,
        matchedMessages,
      });
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Quick search that returns just the threads (for backward compatibility)
 */
export function quickSearchThreads(
  state: ChatState,
  query: string,
): ChatThread[] {
  const results = searchThreads(state, query);
  return results.map((r) => r.thread);
}
