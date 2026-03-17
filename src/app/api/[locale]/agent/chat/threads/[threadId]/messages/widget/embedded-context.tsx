"use client";

import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";

/**
 * When messages are rendered inside another group/message (e.g. as a tool-call
 * result inside an assistant message), the outer group-hover leaks into inner
 * action buttons. Embedded mode uses group/embed to isolate hover scopes.
 *
 * Reads isEmbedded from the nearest ChatNavigationProvider.
 */

const EMBEDDED_GROUP = {
  group: "group/embed" as const,
  groupHover: "group-hover/embed:opacity-100" as const,
};
const MESSAGE_GROUP = {
  group: "group/message" as const,
  groupHover: "group-hover/message:opacity-100" as const,
};

export function useMessageGroupName(): {
  group: "group/embed" | "group/message";
  groupHover:
    | "group-hover/embed:opacity-100"
    | "group-hover/message:opacity-100";
} {
  const isEmbedded = useChatNavigationStore((s) => s.isEmbedded);
  return isEmbedded ? EMBEDDED_GROUP : MESSAGE_GROUP;
}
