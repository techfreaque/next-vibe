"use client";

import { FolderPlus, MessageSquarePlus, Search } from "lucide-react";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import { Button, Input, ScrollArea } from "@/packages/next-vibe-ui/web/ui";

import type { ChatFolder, ChatState } from "../../lib/storage/types";
import { FolderList } from "./folder-list";
import { NewFolderDialog } from "./new-folder-dialog";
import { ThreadList } from "./thread-list";

interface ChatSidebarProps {
  state: ChatState;
  activeThreadId: string | null;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onMoveThread: (threadId: string, folderId: string | null) => void;
  onCreateFolder: (name: string, parentId?: string | null) => void;
  onUpdateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  onDeleteFolder: (folderId: string, deleteThreads: boolean) => void;
  onToggleFolderExpanded: (folderId: string) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  searchThreads: (query: string) => Array<{ id: string; title: string }>;
}

export function ChatSidebar({
  state,
  activeThreadId,
  onCreateThread,
  onSelectThread,
  onDeleteThread,
  onMoveThread,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onToggleFolderExpanded,
  onUpdateThreadTitle,
  searchThreads,
}: ChatSidebarProps): JSX.Element {
  const { t } = useTranslation("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateFolder = (name: string) => {
    onCreateFolder(name, null);
  };

  // Get General folder
  const generalFolder = useMemo(() => {
    return Object.values(state.folders).find((f) => f.id === "folder-general");
  }, [state.folders]);

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching ? searchThreads(searchQuery) : [];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border bg-background space-y-0 pt-15">
        {/* New Chat Button */}
        <div className="px-3 pb-2">
          <Button
            onClick={() => onCreateThread(generalFolder?.id)}
            className="w-full h-10 sm:h-9"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            {t("common.newChat")}
          </Button>
        </div>

        {/* Search Bar + New Folder */}
        <div className="px-3 pb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder={t("common.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-10 sm:h-8 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setNewFolderDialogOpen(true)}
            className="h-10 w-10 sm:h-8 sm:w-8 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={t("actions.newFolder")}
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full">
          <div className="px-2 py-2">
            {isSearching ? (
              <div>
                <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t("common.searchResults")} ({searchResults.length})
                </div>
                <ThreadList
                  threads={searchResults
                    .map((result) => state.threads[result.id])
                    .filter(Boolean)}
                  activeThreadId={activeThreadId}
                  onSelectThread={onSelectThread}
                  onDeleteThread={onDeleteThread}
                  onUpdateTitle={onUpdateThreadTitle}
                  onMoveThread={onMoveThread}
                  state={state}
                  compact
                />
                {searchResults.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    {t("common.noChatsFound")}
                  </div>
                )}
              </div>
            ) : (
              <FolderList
                state={state}
                activeThreadId={activeThreadId}
                onCreateThread={onCreateThread}
                onSelectThread={onSelectThread}
                onDeleteThread={onDeleteThread}
                onMoveThread={onMoveThread}
                onCreateFolder={onCreateFolder}
                onUpdateFolder={onUpdateFolder}
                onDeleteFolder={onDeleteFolder}
                onToggleFolderExpanded={onToggleFolderExpanded}
                onUpdateThreadTitle={onUpdateThreadTitle}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      <NewFolderDialog
        open={newFolderDialogOpen}
        onOpenChange={setNewFolderDialogOpen}
        onSave={handleCreateFolder}
      />
    </div>
  );
}
