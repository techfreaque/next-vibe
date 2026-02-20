/**
 * Gmail-style Sidebar Widget for IMAP Folders List
 * Compact folder tree with unread counts, clickable to filter messages
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  Edit,
  FolderOpen,
  Inbox,
  Loader2,
  RefreshCw,
  Send,
  Settings,
  Star,
  Trash2,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { ImapSpecialUseType } from "../../enum";
import type definition from "./definition";
import type { ImapFoldersListResponseOutput } from "./definition";

type ImapFolder = NonNullable<ImapFoldersListResponseOutput["folders"]>[number];

const SPECIAL_USE_ORDER: Record<string, number> = {
  [ImapSpecialUseType.INBOX]: 0,
  [ImapSpecialUseType.SENT]: 1,
  [ImapSpecialUseType.DRAFTS]: 2,
  [ImapSpecialUseType.ARCHIVE]: 3,
  [ImapSpecialUseType.JUNK]: 4,
  [ImapSpecialUseType.TRASH]: 5,
};

interface CustomWidgetProps {
  field: {
    value: ImapFoldersListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

function getFolderIcon(
  specialUseType: string | null | undefined,
): React.ComponentType<{ className?: string }> {
  switch (specialUseType) {
    case ImapSpecialUseType.INBOX:
      return Inbox;
    case ImapSpecialUseType.SENT:
      return Send;
    case ImapSpecialUseType.DRAFTS:
      return Edit;
    case ImapSpecialUseType.TRASH:
      return Trash2;
    case ImapSpecialUseType.ARCHIVE:
      return Archive;
    case ImapSpecialUseType.JUNK:
      return Star;
    default:
      return FolderOpen;
  }
}

function FolderItem({
  folder,
  isActive,
  onSelect,
}: {
  folder: ImapFolder;
  isActive: boolean;
  onSelect: (folder: ImapFolder) => void;
}): React.JSX.Element {
  const Icon = getFolderIcon(folder.specialUseType);
  const displayName = folder.displayName ?? folder.name;
  const hasUnread = folder.unseenCount > 0;

  return (
    <Div
      className={cn(
        "group flex items-center gap-3 mx-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors text-sm",
        isActive
          ? "bg-primary/15 text-primary font-semibold"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
      onClick={() => onSelect(folder)}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <Span
        className={cn(
          "flex-1 truncate",
          hasUnread && "font-semibold text-foreground",
        )}
      >
        {displayName}
      </Span>
      {hasUnread && (
        <Span
          className={cn(
            "flex-shrink-0 text-xs font-semibold min-w-[18px] text-right",
            isActive ? "text-primary" : "text-blue-600 dark:text-blue-400",
          )}
        >
          {folder.unseenCount > 99 ? "99+" : folder.unseenCount}
        </Span>
      )}
    </Div>
  );
}

export function ImapFoldersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();

  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const folders = useMemo(
    () => field.value?.folders ?? [],
    [field.value?.folders],
  );
  const isLoading = field.value === null || field.value === undefined;

  const sortedFolders = useMemo(() => {
    return [...folders].toSorted((a, b) => {
      const aOrder =
        a.specialUseType !== null && a.specialUseType !== undefined
          ? (SPECIAL_USE_ORDER[a.specialUseType] ?? 10)
          : 10;
      const bOrder =
        b.specialUseType !== null && b.specialUseType !== undefined
          ? (SPECIAL_USE_ORDER[b.specialUseType] ?? 10)
          : 10;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return (a.displayName ?? a.name).localeCompare(b.displayName ?? b.name);
    });
  }, [folders]);

  const visibleFolders = showAll ? sortedFolders : sortedFolders.slice(0, 8);
  const hasMore = sortedFolders.length > 8;

  const handleSelectFolder = useCallback(
    (folder: ImapFolder): void => {
      setActiveFolderId(folder.id);
      // Navigate to messages filtered by this folder
      router.push(
        `/${locale}/admin/emails/imap/messages?folderId=${folder.id}`,
      );
    },
    [router, locale],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleSync = useCallback((): void => {
    router.push(`/${locale}/admin/emails/imap/sync`);
  }, [router, locale]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Section header */}
      <Div className="flex items-center gap-1 px-5 py-2">
        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-1">
          {t("app.api.emails.imapClient.folders.list.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleRefresh}
          title={t("app.api.emails.imapClient.folders.list.refresh")}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleSync}
          title={t("app.api.emails.imapClient.folders.list.sync")}
        >
          <Settings className="h-3 w-3" />
        </Button>
      </Div>

      {/* Folder list */}
      {isLoading ? (
        <Div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </Div>
      ) : folders.length === 0 ? (
        <Div className="px-5 py-2 text-xs text-muted-foreground">
          {t("app.api.emails.imapClient.folders.list.empty")}
        </Div>
      ) : (
        <Div className="flex flex-col gap-0.5 pb-2">
          {visibleFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              isActive={activeFolderId === folder.id}
              onSelect={handleSelectFolder}
            />
          ))}
          {hasMore && (
            <Div
              className="flex items-center gap-2 mx-2 px-3 py-1.5 rounded-full cursor-pointer text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              <Span>
                {showAll
                  ? t("app.api.emails.imapClient.folders.list.showLess")
                  : `${String(sortedFolders.length - 8)} ${t("app.api.emails.imapClient.folders.list.more")}`}
              </Span>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
