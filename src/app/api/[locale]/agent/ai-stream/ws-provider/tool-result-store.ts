/**
 * WS Provider — Pending Tool Result Store
 *
 * In-process Map shared between the stream repository (creates Promises when
 * AI calls a client tool) and the tool-result endpoint (resolves them when
 * the client sends back the result).
 *
 * Each pending entry has a 5-minute timeout. Expired entries are cleaned up
 * lazily on access and via a periodic sweep.
 */

import "server-only";

import type { ToolCallResult } from "@/app/api/[locale]/agent/chat/db";

const TOOL_RESULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

interface PendingToolResult {
  resolve: (result: ToolCallResult) => void;
  reject: (error: Error) => void;
  createdAt: number;
}

const pendingToolResults = new Map<string, PendingToolResult>();

// Periodic cleanup of expired entries
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanupRunning(): void {
  if (cleanupInterval) {
    return;
  }
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [toolCallId, pending] of pendingToolResults) {
      if (now - pending.createdAt > TOOL_RESULT_TIMEOUT_MS) {
        pending.reject(
          new Error(`Tool call ${toolCallId} timed out after 5 minutes`),
        );
        pendingToolResults.delete(toolCallId);
      }
    }
    // Stop interval when no pending results
    if (pendingToolResults.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Create a pending tool result Promise.
 * Called by the stream repository when AI invokes a client-provided tool.
 * Returns a Promise that resolves when the client sends the result via POST.
 */
export function createPendingToolResult(
  toolCallId: string,
): Promise<ToolCallResult> {
  ensureCleanupRunning();

  return new Promise<ToolCallResult>((resolve, reject) => {
    pendingToolResults.set(toolCallId, {
      resolve,
      reject,
      createdAt: Date.now(),
    });
  });
}

/**
 * Resolve a pending tool result.
 * Called by the tool-result endpoint when the client sends back a result.
 * Returns true if the toolCallId was found and resolved, false otherwise.
 */
export function resolvePendingToolResult(
  toolCallId: string,
  result: ToolCallResult,
): boolean {
  const pending = pendingToolResults.get(toolCallId);
  if (!pending) {
    return false;
  }
  pendingToolResults.delete(toolCallId);
  pending.resolve(result);
  return true;
}

/**
 * Get the count of pending tool results (for diagnostics).
 */
export function getPendingToolResultCount(): number {
  return pendingToolResults.size;
}
