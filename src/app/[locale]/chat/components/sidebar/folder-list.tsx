"use client";

import { ChevronRight, ChevronDown, FolderPlus, MoreVertical, Trash2, Edit } from "lucide-react";
import type { JSX } from "react";
import React, { useMemo } from "react";

import type { ChatState, ChatFolder, ChatThread } from "../../lib/storage/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/packages/next-vibe-ui/web/ui";
import { ThreadList } from "./thread-list";
import { getIconComponent } from "./folder-icon-selector";
import { RenameFolderDialog } from "./rename-folder-dialog";

// Time grouping helpers
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

function groupThreadsByTime(threads: ChatThread[]): {
  today: ChatThread[];
  lastWeek: ChatThread[];
  lastMonth: ChatThread[];
} {
  const now = Date.now();
  const today: ChatThread[] = [];
  const lastWeek: ChatThread[] = [];
  const lastMonth: ChatThread[] = [];

  threads.forEach((thread) => {
    const age = now - thread.updatedAt;
    if (age < DAY_MS) {
      today.push(thread);
    } else if (age < WEEK_MS) {
      lastWeek.push(thread);
    } else if (age < MONTH_MS) {
      lastMonth.push(thread);
    }
  });

  return { today, lastWeek, lastMonth };
}

interface FolderListProps {
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
}

export function FolderList({
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
}: FolderListProps): JSX.Element {
  return (
    <div className="space-y-1 py-2">
      {state.rootFolderIds.map((folderId) => {
        const folder = state.folders[folderId];
        if (!folder) return null;

        return (
          <FolderItem
            key={folder.id}
            folder={folder}
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
        );
      })}
    </div>
  );
}

interface FolderItemProps {
  folder: ChatFolder;
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
  depth?: number;
}

function FolderItem({
  folder,
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
  depth = 0,
}: FolderItemProps): JSX.Element {
  const [isHovered, setIsHovered] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);

  const threadsInFolder = useMemo(() => {
    return Object.values(state.threads)
      .filter((t) => t.folderId === folder.id)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [state.threads, folder.id]);

  const groupedThreads = useMemo(() => {
    return groupThreadsByTime(threadsInFolder);
  }, [threadsInFolder]);

  const handleDeleteFolder = () => {
    setDropdownOpen(false);
    const hasThreads = threadsInFolder.length > 0;
    if (hasThreads) {
      const confirmed = window.confirm(
        `Delete folder "${folder.name}" and move ${threadsInFolder.length} chat(s) to General?`,
      );
      if (!confirmed) return;
    }
    onDeleteFolder(folder.id, false);
  };

  const handleCreateSubfolder = () => {
    setDropdownOpen(false);
    const name = window.prompt("Enter folder name:");
    if (name) {
      onCreateFolder(name, folder.id);
    }
  };

  const handleToggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFolderExpanded(folder.id);
  };

  const handleCreateThreadInFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateThread(folder.id);
  };

  const handleRenameFolder = () => {
    setDropdownOpen(false);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = (name: string, icon: string) => {
    onUpdateFolder(folder.id, { name, icon });
  };

  const FolderIcon = getIconComponent(folder.icon || "folder");

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors min-h-[36px]"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          // Don't remove hover state if dropdown is open
          if (!dropdownOpen) {
            setIsHovered(false);
          }
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleExpanded}
          className="h-5 w-5 p-0 hover:bg-transparent flex-shrink-0"
        >
          {folder.expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FolderIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{folder.name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            ({threadsInFolder.length})
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" style={{ width: isHovered ? 'auto' : '0px', opacity: isHovered ? 1 : 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCreateThreadInFolder}
            className="h-6 w-6"
            title="New chat in folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>

          <DropdownMenu
            open={dropdownOpen}
            onOpenChange={(open) => {
              setDropdownOpen(open);
              // Reset hover state when dropdown closes
              if (!open) {
                setIsHovered(false);
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(true);
                }}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem onSelect={handleRenameFolder}>
                <Edit className="h-4 w-4 mr-2" />
                Rename Folder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCreateSubfolder}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDeleteFolder} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {folder.expanded && (
        <div>
          {/* Child folders */}
          {folder.childrenIds.map((childId) => {
            const childFolder = state.folders[childId];
            if (!childFolder) return null;

            return (
              <FolderItem
                key={childId}
                folder={childFolder}
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
                depth={depth + 1}
              />
            );
          })}

          {/* Threads in folder - grouped by time */}
          {threadsInFolder.length > 0 && (
            <div style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
              {groupedThreads.today.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Today
                  </div>
                  <ThreadList
                    threads={groupedThreads.today}
                    activeThreadId={activeThreadId}
                    onSelectThread={onSelectThread}
                    onDeleteThread={onDeleteThread}
                    onUpdateTitle={onUpdateThreadTitle}
                    onMoveThread={onMoveThread}
                    state={state}
                  />
                </div>
              )}

              {groupedThreads.lastWeek.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Last 7 Days
                  </div>
                  <ThreadList
                    threads={groupedThreads.lastWeek}
                    activeThreadId={activeThreadId}
                    onSelectThread={onSelectThread}
                    onDeleteThread={onDeleteThread}
                    onUpdateTitle={onUpdateThreadTitle}
                    onMoveThread={onMoveThread}
                    state={state}
                  />
                </div>
              )}

              {groupedThreads.lastMonth.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Last 30 Days
                  </div>
                  <ThreadList
                    threads={groupedThreads.lastMonth}
                    activeThreadId={activeThreadId}
                    onSelectThread={onSelectThread}
                    onDeleteThread={onDeleteThread}
                    onUpdateTitle={onUpdateThreadTitle}
                    onMoveThread={onMoveThread}
                    state={state}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <RenameFolderDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        folderName={folder.name}
        folderIcon={folder.icon || "folder"}
        onSave={handleSaveRename}
      />
    </div>
  );
}

