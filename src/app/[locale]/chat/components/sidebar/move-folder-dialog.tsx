"use client";

import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "@/packages/next-vibe-ui/web/ui";

import { getIconComponent } from "../../lib/config/icons";
import { getFolderDisplayName } from "../../lib/storage/thread-manager";
import type { ChatFolder, ChatState } from "../../lib/storage/types";

interface MoveFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: ChatFolder;
  state: ChatState;
  onMove: (targetFolderId: string | null) => void;
  locale: CountryLanguage;
}

export function MoveFolderDialog({
  open,
  onOpenChange,
  folder,
  state,
  onMove,
  locale,
}: MoveFolderDialogProps): JSX.Element {
  const { t } = simpleT(locale);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Get list of valid target folders (excluding the folder itself and its descendants)
  const availableFolders = useMemo(() => {
    const getDescendantIds = (folderId: string): string[] => {
      const descendants: string[] = [folderId];
      const folder = state.folders[folderId];
      if (folder?.childrenIds) {
        folder.childrenIds.forEach((childId) => {
          descendants.push(...getDescendantIds(childId));
        });
      }
      return descendants;
    };

    const excludedIds = getDescendantIds(folder.id);
    const validFolders = Object.values(state.folders).filter(
      (f) => !excludedIds.includes(f.id),
    );

    return validFolders;
  }, [folder.id, state.folders]);

  const handleMove = (): void => {
    onMove(selectedFolderId);
    onOpenChange(false);
  };

  const renderFolderOption = (
    targetFolder: ChatFolder,
    depth = 0,
  ): JSX.Element => {
    const Icon = getIconComponent(targetFolder.icon ?? "folder");
    const isSelected = selectedFolderId === targetFolder.id;
    const displayName = getFolderDisplayName(targetFolder, locale);

    return (
      <div key={targetFolder.id}>
        <button
          onClick={() => setSelectedFolderId(targetFolder.id)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
            isSelected ? "bg-accent border-2 border-primary" : ""
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">{displayName}</span>
        </button>
        {targetFolder.childrenIds.map((childId) => {
          const childFolder = state.folders[childId];
          if (!childFolder || !availableFolders.find((f) => f.id === childId)) {
            return null;
          }
          return renderFolderOption(childFolder, depth + 1);
        })}
      </div>
    );
  };

  const rootFolders = availableFolders.filter((f) => f.parentId === null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("app.chat.moveFolder.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {t("app.chat.moveFolder.description")}
          </div>

          {/* Root option */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              selectedFolderId === null
                ? "bg-accent border-2 border-primary"
                : ""
            }`}
          >
            <span className="text-sm font-medium">
              {t("app.chat.moveFolder.rootLevel")}
            </span>
          </button>

          {/* Available folders */}
          <ScrollArea className="h-[300px] border rounded-md p-2">
            <div className="space-y-1">
              {rootFolders.map((f) => renderFolderOption(f))}
            </div>
          </ScrollArea>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.moveFolder.cancel")}
            </Button>
            <Button onClick={handleMove}>
              {t("app.chat.moveFolder.move")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
