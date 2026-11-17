"use client";

/**
 * Cross-tab identity sync.
 *
 * Auth cookies are shared by every tab of the browser, but each open tab
 * rendered its user (props, React Query caches, the WS socket's identity) at
 * load time. When one tab signs up, logs in or logs out, the others would keep
 * acting as the old identity: guest credits, user channels denied on the guest
 * socket, a stale sidebar. The acting tab announces the change here; every
 * other tab of the same origin switches without a reload (see
 * TabIdentitySync: new WS socket, session/page data refetched, caches
 * refetched).
 *
 * Transport: BroadcastChannel, with the localStorage `storage` event as the
 * fallback where BroadcastChannel is missing. Same-origin only by design, like
 * the cookies it mirrors.
 */

import { addWindowListener } from "next-vibe/ui/lib/dom";
import { setLocalItem } from "next-vibe/ui/lib/storage";
import { z } from "zod";

import type { EndpointLogger } from "../../logger/types";

const CHANNEL_NAME = "vibe-auth";
const STORAGE_KEY = "vibe-auth-changed";

const authChangeKindSchema = z.enum(["login", "signup", "logout"]);
export type AuthChangeKind = z.infer<typeof authChangeKindSchema>;

const authChangeMessageSchema = z.object({
  type: z.literal("auth-changed"),
  kind: authChangeKindSchema,
  /** Sender tab: a tab never reacts to its own announcement. */
  tabId: z.string(),
  at: z.number(),
});
type AuthChangeMessage = z.infer<typeof authChangeMessageSchema>;

const tabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

let channel: BroadcastChannel | null | undefined;

function getChannel(): BroadcastChannel | null {
  if (channel === undefined) {
    channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

/**
 * Tell every other tab that this browser's identity just changed. Call it
 * right after the server confirmed the login/signup/logout (cookies already
 * swapped), before this tab navigates away.
 */
export function broadcastAuthChange(
  kind: AuthChangeKind,
  logger: EndpointLogger,
): void {
  const message: AuthChangeMessage = {
    type: "auth-changed",
    kind,
    tabId,
    at: Date.now(),
  };
  const bc = getChannel();
  if (bc) {
    // BroadcastChannel is same-origin by definition; it has no targetOrigin.
    // oxlint-disable-next-line unicorn/require-post-message-target-origin -- BroadcastChannel, not window.postMessage
    bc.postMessage(message);
    return;
  }
  // Fallback: other tabs receive a `storage` event for this write.
  setLocalItem(STORAGE_KEY, JSON.stringify(message), logger);
}

/**
 * Listen for identity changes announced by OTHER tabs. Returns the
 * unsubscribe function.
 */
export function onAuthChangeInOtherTab(
  handler: (kind: AuthChangeKind) => void,
): () => void {
  const deliver = (raw: MessageEvent["data"]): void => {
    const parsed = authChangeMessageSchema.safeParse(raw);
    if (parsed.success && parsed.data.tabId !== tabId) {
      handler(parsed.data.kind);
    }
  };

  const bc = getChannel();
  if (bc) {
    const onMessage = (event: MessageEvent): void => {
      deliver(event.data);
    };
    bc.addEventListener("message", onMessage);
    return (): void => {
      bc.removeEventListener("message", onMessage);
    };
  }

  return addWindowListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return;
    }
    try {
      deliver(JSON.parse(event.newValue));
    } catch {
      // Not ours / malformed - ignore
    }
  });
}
