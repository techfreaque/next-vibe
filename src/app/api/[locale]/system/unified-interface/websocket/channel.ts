/**
 * WebSocket Channel Utilities
 *
 * Shared channel name builder used by both server-side emitter and client-side hooks.
 * Mirrors React Query's queryKey pattern: the channel is the resolved endpoint path
 * with URL path params substituted.
 */

/**
 * Build a WebSocket channel name from an endpoint path and URL path params.
 *
 * Resolves `[paramName]` segments using the provided params object.
 * For endpoints without path params (like `["agent", "ai-stream"]`),
 * pass an additional `scope` to differentiate channels (e.g. threadId).
 *
 * @param path - Endpoint path segments (e.g. ["agent", "chat", "threads", "[threadId]", "messages"])
 * @param urlPathParams - Resolved URL path params (e.g. { threadId: "abc123" })
 * @param scope - Optional additional scope suffix (for endpoints without path params)
 * @returns Channel string like "agent/chat/threads/abc123/messages"
 *
 * @example
 * // Endpoint with path params - params resolve the channel
 * buildWsChannel(["agent", "chat", "threads", "[threadId]", "messages"], { threadId: "abc" })
 * // → "agent/chat/threads/abc/messages"
 *
 * @example
 * // Endpoint without path params - scope adds context
 * buildWsChannel(["agent", "ai-stream"], {}, "thread-abc")
 * // → "agent/ai-stream/thread-abc"
 */
/**
 * Build the user-scoped channel for a single-connection-per-tab model.
 * All endpoint events are routed through this channel; the `channel` field
 * in each WsWireMessage still carries the original path-based channel so
 * client-side routing (channels.get(msg.channel)) works transparently.
 *
 * userId is the authenticated user's ID, or leadId for anonymous users.
 */
export function buildUserChannel(userId: string): string {
  return `user/${userId}`;
}

export function buildWsChannel(
  path: readonly string[],
  urlPathParams: Record<string, string>,
  scope?: string,
): string {
  const resolved = path
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const paramName = segment.slice(1, -1);
        return urlPathParams[paramName] ?? segment;
      }
      return segment;
    })
    .join("/");

  if (scope) {
    // eslint-disable-next-line i18next/no-literal-string
    return `${resolved}/${scope}`;
  }

  return resolved;
}
