"use client";

import { cn } from "next-vibe/shared/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Div,
  Input,
} from "next-vibe-ui/ui";
import { MessageSquarePlus, Search } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatThread } from "../shared/types";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateThread: () => void;
  onSelectThread: (threadId: string) => void;
  threads: Record<string, ChatThread>;
  locale: CountryLanguage;
}

export function SearchModal({
  open,
  onOpenChange,
  onCreateThread,
  onSelectThread,
  threads,
  locale,
}: SearchModalProps): JSX.Element {
  const { t } = simpleT(locale);
  const [searchQuery, setSearchQuery] = useState("");

  // Search threads by title
  const searchResults =
    searchQuery.length > 0
      ? Object.values(threads).filter((thread) =>
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

  const handleSelectThread = (threadId: string): void => {
    onSelectThread(threadId);
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleCreateThread = (): void => {
    onCreateThread();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t("app.chat.common.searchModal.searchAndCreate")}
          </DialogTitle>
        </DialogHeader>

        <Div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* New Thread Button */}
          <Button onClick={handleCreateThread} className="w-full flex-shrink-0">
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            {t("app.chat.common.searchModal.newChat")}
          </Button>

          {/* Search Input */}
          <Div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t(
                "app.chat.common.searchModal.searchThreadsPlaceholder",
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </Div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <Div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {searchResults.length > 0 ? (
                searchResults.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors",
                      "text-sm truncate min-h-[44px] flex items-center",
                    )}
                  >
                    {thread.title}
                  </button>
                ))
              ) : (
                <Div className="text-center py-8 text-muted-foreground text-sm">
                  {t("app.chat.common.searchModal.noThreadsFound")}
                </Div>
              )}
            </Div>
          )}
        </Div>
      </DialogContent>
    </Dialog>
  );
}
