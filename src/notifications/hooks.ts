/**
 * Notification bell state - unread count (polled + on focus) and a short
 * recent list (fetched when the dropdown opens). Real-time WS push is not
 * wired: the count refreshes every 60s while the tab is visible, and on
 * focus / when the tab becomes visible again.
 *
 * At most one count request is in flight per bell. Without that guard a
 * dead connection (2026-11-13: a sleeping laptop, 4 tabs) piled up one
 * never-settling request per minute for hours, all failing at once on wake
 * (586 error rows).
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  addDocumentListener,
  addWindowListener,
  getVisibilityState,
} from "next-vibe/ui/lib/dom";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useCallback, useEffect, useRef, useState } from "react";

import listDefinitions, { type NotificationItem } from "./list/definition";
import readDefinitions from "./read/definition";
import unreadCountDefinitions from "./unread-count/definition";

const POLL_INTERVAL_MS = 60_000;
const BELL_LIST_LIMIT = 8;

export interface UseNotificationBellReturn {
  unreadCount: number;
  items: NotificationItem[];
  isLoading: boolean;
  /** Load the recent list (call when the dropdown opens) */
  loadItems: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export function useNotificationBell(
  user: JwtPayloadType,
  logger: EndpointLogger,
  locale: CountryLanguage,
): UseNotificationBellReturn {
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const enabled = !user.isPublic;
  const countInFlight = useRef(false);

  const refreshCount = useCallback(async (): Promise<void> => {
    if (!enabled || countInFlight.current) {
      return;
    }
    countInFlight.current = true;
    try {
      const response = await apiClient.fetch(
        unreadCountDefinitions.GET,
        logger,
        user,
        undefined,
        undefined,
        locale,
      );
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } finally {
      countInFlight.current = false;
    }
  }, [enabled, logger, user, locale]);

  const loadItems = useCallback(async (): Promise<void> => {
    if (!enabled) {
      return;
    }
    setIsLoading(true);
    const response = await apiClient.fetch(
      listDefinitions.GET,
      logger,
      user,
      { paginationInfo: { page: 1, limit: BELL_LIST_LIMIT } },
      undefined,
      locale,
    );
    if (response.success) {
      setItems(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    }
    setIsLoading(false);
  }, [enabled, logger, user, locale]);

  const markRead = useCallback(
    async (id: string): Promise<void> => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await apiClient.mutate(
        readDefinitions.POST,
        logger,
        user,
        { id },
        undefined,
        locale,
      );
      await refreshCount();
    },
    [logger, user, locale, refreshCount],
  );

  const markAllRead = useCallback(async (): Promise<void> => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
    await apiClient.mutate(
      readDefinitions.POST,
      logger,
      user,
      { all: true },
      undefined,
      locale,
    );
    await refreshCount();
  }, [logger, user, locale, refreshCount]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    // Deferred first fetch: keeps setState out of the effect's synchronous body
    const first = setTimeout(() => {
      void refreshCount();
    }, 0);
    const interval = setInterval(() => {
      // Background tabs don't poll; they catch up when shown again.
      if (getVisibilityState() === "visible") {
        void refreshCount();
      }
    }, POLL_INTERVAL_MS);
    const removeFocus = addWindowListener("focus", () => {
      void refreshCount();
    });
    const removeVisibility = addDocumentListener("visibilitychange", () => {
      if (getVisibilityState() === "visible") {
        void refreshCount();
      }
    });
    return (): void => {
      clearTimeout(first);
      clearInterval(interval);
      removeFocus();
      removeVisibility();
    };
  }, [enabled, refreshCount]);

  return { unreadCount, items, isLoading, loadItems, markRead, markAllRead };
}
