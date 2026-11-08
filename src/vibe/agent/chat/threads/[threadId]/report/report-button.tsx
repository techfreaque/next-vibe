/**
 * ReportThreadButton
 * Toolbar action shown on public-feed and shared threads. Opens the report
 * form in a modal. Open to guests.
 */

"use client";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import { Button } from "next-vibe/ui/components/button";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import {
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useCallback } from "react";

import { useChatNavigationStore } from "../../../hooks/use-chat-navigation-store";
import { scopedTranslation } from "./i18n";

export function ReportThreadButton(): JSX.Element | null {
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const threadId = useChatNavigationStore((s) => s.activeThreadId);
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const { t } = scopedTranslation.scopedT(locale);

  const handleReport = useCallback(async (): Promise<void> => {
    if (!threadId) {
      return;
    }
    const reportDef = await import("./definition");
    navigation.push(reportDef.default.POST, {
      urlPathParams: { threadId },
      renderInModal: true,
    });
  }, [threadId, navigation]);

  if (
    !threadId ||
    (rootFolderId !== DefaultFolderId.PUBLIC &&
      rootFolderId !== DefaultFolderId.SHARED)
  ) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      data-testid="report-thread-button"
      onClick={() => void handleReport()}
      className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9"
      title={t("post.titleShort")}
    >
      <AlertTriangle className="h-5 w-5" />
    </Button>
  );
}
