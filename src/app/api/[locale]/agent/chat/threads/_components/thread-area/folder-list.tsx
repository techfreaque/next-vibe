"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React, { useMemo } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { FolderItem } from "./folder-item";
import { groupThreadsByTime } from "./folder-list-helpers";
import { ThreadList } from "./thread-list";

interface FolderListProps {
  activeRootFolderId: DefaultFolderId;
  activeFolderId: string | null;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function FolderList({
  activeRootFolderId,
  activeFolderId,
  locale,
  logger,
}: FolderListProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get data and callbacks from context
  const { folders, threads } = useChatContext();

  // Memoize direct children folders of the active root folder
  const childFolders = useMemo(() => {
    return (
      Object.values(folders).filter(
        (folder) =>
          folder.rootFolderId === activeRootFolderId &&
          folder.parentId === null,
      ) || []
    ).toSorted((a, b) => {
      // First sort by sortOrder
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      // If sortOrder is the same, use createdAt as tiebreaker for stable ordering
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }, [folders, activeRootFolderId]);

  // Memoize threads in the active root folder (not in any subfolder)
  // Sort by pinned status (pinned first) and then by updatedAt (newest first)
  const childThreads = useMemo(() => {
    return (
      Object.values(threads).filter(
        (thread) =>
          thread.rootFolderId === activeRootFolderId &&
          thread.folderId === null,
      ) || []
    ).toSorted((a, b) => {
      // Pinned threads come first
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      // Then sort by updatedAt (newest first)
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [threads, activeRootFolderId]);

  // Memoize grouped threads by time
  const groupedThreads = useMemo(
    () => groupThreadsByTime(childThreads),
    [childThreads],
  );

  return (
    <Div className="flex flex-col gap-1 py-2">
      {/* Render child folders of the active root folder */}
      {childFolders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          activeFolderId={activeFolderId}
          locale={locale}
          depth={0}
          logger={logger}
        />
      ))}

      {/* Threads in the root folder (not in any subfolder) */}
      {childThreads.length > 0 && (
        <Div className="px-2">
          {groupedThreads.today.length > 0 && (
            <Div className="mb-2">
              <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t("app.chat.folderList.today")}
              </Div>
              <ThreadList
                threads={groupedThreads.today}
                locale={locale}
                logger={logger}
              />
            </Div>
          )}

          {groupedThreads.lastWeek.length > 0 && (
            <Div className="mb-2">
              <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t("app.chat.folderList.lastWeek")}
              </Div>
              <ThreadList
                threads={groupedThreads.lastWeek}
                locale={locale}
                logger={logger}
              />
            </Div>
          )}

          {groupedThreads.lastMonth.length > 0 && (
            <Div className="mb-2">
              <Div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t("app.chat.folderList.lastMonth")}
              </Div>
              <ThreadList
                threads={groupedThreads.lastMonth}
                locale={locale}
                logger={logger}
              />
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
