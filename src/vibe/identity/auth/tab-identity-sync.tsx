"use client";

/**
 * TabIdentitySync — mounted once per tab (RootProviders). When another tab of
 * this browser signs up, logs in or logs out (see tab-sync.ts), this tab
 * switches to the new identity without a reload:
 *
 *   1. Replace the WS socket. Its identity was fixed by the cookies at upgrade
 *      time, so the new identity's user channels would be denied on it. Active
 *      channels resubscribe on the new socket.
 *   2. Re-run the route's loaders (router.refresh): the page's `user` prop
 *      comes from the server session, so every widget re-renders as the new
 *      identity and useEndpointSubscription moves to the new user channels
 *      (the old subscriptions are released by their effect cleanups, so there
 *      is still exactly one subscription per cache key).
 *   3. Mark every cached query stale right away (widgets that remount for the
 *      new identity fetch fresh data), and refetch the still-mounted ones
 *      (credits, sidebar lists...) only once the old identity's widgets are
 *      gone: when the tab is next shown, or shortly after the refresh settled
 *      if it is visible. Refetching earlier made the old identity's widgets
 *      fetch private data as a guest (403s).
 */

import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { addDocumentListener, getVisibilityState } from "next-vibe/ui/lib/dom";
import { useEffect, useLayoutEffect, useRef, useTransition } from "react";

import {
  onGuestSocketIdentityChange,
  reconnectForIdentityChange,
} from "../../realtime/client/client";
import { queryClient } from "../../unified-ui/hooks/store";
import { onAuthChangeInOtherTab } from "./tab-sync";

/** Several announcements in a burst (signup then auto-login) switch once. */
const SWITCH_DEBOUNCE_MS = 150;
/** Visible tab: let the re-rendered route settle before refetching. */
const VISIBLE_REFETCH_DELAY_MS = 1_500;
const GUEST_IDENTITY_REFRESH_COOLDOWN_MS = 5_000;

function refetchActiveQueries(): void {
  void queryClient.refetchQueries({ type: "active", stale: true });
}

export function TabIdentitySync(): null {
  const logger = useLogger();
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const awaitingRefresh = useRef(false);
  const lastGuestRefresh = useRef<number | null>(null);
  // The TanStack shim returns a fresh object per render; keep the listener
  // registered once and call the latest router.
  const routerRef = useRef(router);
  useLayoutEffect(() => {
    routerRef.current = router;
  });

  useEffect(() => {
    const pending: {
      timer: ReturnType<typeof setTimeout> | null;
      replaceSocket: boolean;
    } = {
      timer: null,
      replaceSocket: false,
    };
    const queueRefresh = (replaceSocket: boolean): void => {
      pending.replaceSocket ||= replaceSocket;
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      pending.timer = setTimeout(() => {
        pending.timer = null;
        if (pending.replaceSocket) {
          pending.replaceSocket = false;
          reconnectForIdentityChange(logger);
        }
        void queryClient.invalidateQueries({ refetchType: "none" });
        awaitingRefresh.current = true;
        startRefresh(async () => {
          // TanStack's refresh resolves once the loaders re-ran; Next's runs
          // inside this transition.
          await Promise.resolve(routerRef.current.refresh());
        });
      }, SWITCH_DEBOUNCE_MS);
    };
    const stopTabSync = onAuthChangeInOtherTab((kind) => {
      logger.info("[TabIdentitySync] Identity changed in another tab", {
        kind,
      });
      queueRefresh(true);
    });
    const stopSocketSync = onGuestSocketIdentityChange(() => {
      const now = Date.now();
      if (
        lastGuestRefresh.current !== null &&
        now - lastGuestRefresh.current < GUEST_IDENTITY_REFRESH_COOLDOWN_MS
      ) {
        return;
      }
      lastGuestRefresh.current = now;
      // This socket already uses the new cookie. The loader will rebuild the
      // channel names from that cookie, and the subscription effect will rebind.
      queueRefresh(false);
    });
    return (): void => {
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      stopTabSync();
      stopSocketSync();
    };
  }, [logger]);

  useEffect(() => {
    if (isRefreshing || !awaitingRefresh.current) {
      return undefined;
    }
    awaitingRefresh.current = false;
    if (getVisibilityState() === "visible") {
      const timer = setTimeout(refetchActiveQueries, VISIBLE_REFETCH_DELAY_MS);
      return (): void => {
        clearTimeout(timer);
      };
    }
    // Background tab (the usual case: the user acted in another tab): refetch
    // when they come back to this one.
    const stop = addDocumentListener("visibilitychange", () => {
      if (getVisibilityState() === "visible") {
        stop();
        refetchActiveQueries();
      }
    });
    return stop;
  }, [isRefreshing]);

  return null;
}
