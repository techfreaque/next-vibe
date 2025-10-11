"use client";

import { MoreVertical, Trash2, Edit2, FolderInput } from "lucide-react";
import type { JSX } from "react";
import React, { useState } from "react";

import type { ChatThread, ChatFolder, ChatState } from "../../lib/storage/types";
import { chatColors, chatTransitions } from "../../lib/design-tokens";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/packages/next-vibe-ui/web/ui";
import { cn } from "next-vibe/shared/utils";
import { formatRelativeTime } from "../../lib/utils/formatting";

interface ThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onUpdateTitle: (threadId: string, title: string) => void;
  onMoveThread?: (threadId: string, folderId: string | null) => void;
  state?: ChatState;
  compact?: boolean;
}

export function ThreadList({
  threads,
  activeThreadId,
  onSelectThread,
  onDeleteThread,
  onUpdateTitle,
  onMoveThread,
  state,
  compact = false,
}: ThreadListProps): JSX.Element {
  return (
    <div className="space-y-0.5">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelect={onSelectThread}
          onDelete={onDeleteThread}
          onUpdateTitle={onUpdateTitle}
          onMoveThread={onMoveThread}
          state={state}
          compact={compact}
        />
      ))}
    </div>
  );
}

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelect: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onUpdateTitle: (threadId: string, title: string) => void;
  onMoveThread?: (threadId: string, folderId: string | null) => void;
  state?: ChatState;
  compact?: boolean;
}

function ThreadItem({
  thread,
  isActive,
  onSelect,
  onDelete,
  onUpdateTitle,
  onMoveThread,
  state,
  compact = false,
}: ThreadItemProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(thread.title);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get model icon (fallback to default model if not set)
  // Model config removed - icons no longer shown in thread list for clean design

  const handleDelete = () => {
    setDropdownOpen(false);
    const confirmed = window.confirm(`Delete chat "${thread.title}"?`);
    if (confirmed) {
      onDelete(thread.id);
    }
  };

  const handleEdit = () => {
    setDropdownOpen(false);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdateTitle(thread.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(thread.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleMoveToFolder = (folderId: string | null) => {
    setDropdownOpen(false);
    if (onMoveThread) {
      onMoveThread(thread.id, folderId);
    }
  };

  // Get all folders for the move menu
  const allFolders = state ? Object.values(state.folders) : [];
  const currentFolderId = thread.folderId;

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer",
        chatTransitions.colors,
        isActive
          ? cn(chatColors.sidebar.active, "shadow-sm")
          : chatColors.sidebar.hover,
        compact && "py-1.5",
      )}
      onClick={() => !isEditing && onSelect(thread.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // Don't remove hover state if dropdown is open
        if (!dropdownOpen) {
          setIsHovered(false);
        }
      }}
    >
      {/* Removed AI provider icon for clean design */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm bg-background border border-border rounded"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium truncate", compact && "text-xs")}>
                    {thread.title}
                  </div>
                  {!compact && thread.metadata?.preview && (
                    <div className="text-xs text-muted-foreground truncate">
                      {thread.metadata.preview}
                    </div>
                  )}
                  {!compact && (
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(thread.updatedAt)}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="text-sm">{thread.title}</p>
                {thread.metadata?.preview && (
                  <p className="text-xs text-muted-foreground mt-1">{thread.metadata.preview}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {!isEditing && isHovered && (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
              <DropdownMenuItem onSelect={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>

              {onMoveThread && state && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderInput className="h-4 w-4 mr-2" />
                      Move to Folder
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {/* Option to move to root (no folder) */}
                      {currentFolderId !== null && (
                        <DropdownMenuItem onSelect={() => handleMoveToFolder(null)}>
                          <span className="text-sm">📁 Unfiled</span>
                        </DropdownMenuItem>
                      )}

                      {/* List all folders */}
                      {allFolders.length > 0 ? (
                        allFolders.map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onSelect={() => handleMoveToFolder(folder.id)}
                            disabled={currentFolderId === folder.id}
                          >
                            <span className="text-sm">
                              {folder.icon || "📁"} {folder.name}
                            </span>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          <span className="text-sm text-muted-foreground">No folders available</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {thread.metadata?.pinned && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </div>
  );
}

