"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type {
  ChatFolder,
  ChatState,
  ChatThread,
} from "../../lib/storage/types";
import { ChatSidebar } from "../sidebar/chat-sidebar";

interface SidebarWrapperProps {
  state: ChatState;
  activeThreadId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onCreateThread: (folderId?: string | null) => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
  onMoveThread: (threadId: string, folderId: string | null) => void;
  onCreateFolder: (name: string, parentId?: string | null) => void;
  onUpdateFolder: (folderId: string, updates: Partial<ChatFolder>) => void;
  onDeleteFolder: (folderId: string, deleteThreads: boolean) => void;
  onToggleFolderExpanded: (folderId: string) => void;
  onUpdateThreadTitle: (threadId: string, title: string) => void;
  searchThreads: (query: string) => ChatThread[];
}

export function SidebarWrapper({
  state,
  activeThreadId,
  collapsed,
  onToggle,
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
}: SidebarWrapperProps): JSX.Element {
  return (
    <>
      {/* Sidebar Container */}
      <div
        className={cn(
          // Desktop: flexible width with smooth transition, z-10 to stay below input (z-20)
          "hidden md:block transition-all duration-200 ease-in-out overflow-hidden border-r border-border flex-shrink-0",
          collapsed ? "w-0 border-r-0" : "w-64",
          // Mobile: fixed overlay with z-50 (same as top bar, above input z-20, above backdrop z-30)
          "md:relative md:z-10 fixed inset-y-0 left-0 z-50",
          !collapsed && "block",
        )}
      >
        <div className="h-full w-64 bg-background">
          <ChatSidebar
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
            searchThreads={searchThreads}
          />
        </div>
      </div>

      {/* Mobile Overlay Backdrop */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
}
