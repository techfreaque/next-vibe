"use client";

import { Search, MessageSquarePlus, X } from "lucide-react";
import type { JSX } from "react";
import React, { useState } from "react";

import type { ChatThread } from "../lib/storage/types";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/packages/next-vibe-ui/web/ui";
import { cn } from "next-vibe/shared/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateThread: () => void;
  onSelectThread: (threadId: string) => void;
  searchThreads: (query: string) => ChatThread[];
}

export function SearchModal({
  open,
  onOpenChange,
  onCreateThread,
  onSelectThread,
  searchThreads,
}: SearchModalProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.length > 0 ? searchThreads(searchQuery) : [];

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleCreateThread = () => {
    onCreateThread();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search & Create</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* New Thread Button */}
          <Button
            onClick={handleCreateThread}
            className="w-full"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors",
                      "text-sm truncate"
                    )}
                  >
                    {thread.title}
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No threads found
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

