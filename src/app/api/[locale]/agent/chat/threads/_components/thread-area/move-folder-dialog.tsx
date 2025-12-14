"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { ChatFolder } from "@/app/api/[locale]/agent/chat/hooks/store";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface MoveFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: ChatFolder;
  folders: Record<string, ChatFolder>;
  onMove: (targetFolderId: string | null) => void;
  locale: CountryLanguage;
}

export function MoveFolderDialog({
  open,
  onOpenChange,
  folder,
  folders,
  onMove,
  locale,
}: MoveFolderDialogProps): JSX.Element {
  const { t } = simpleT(locale);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Get list of valid target folders (excluding the folder itself and its descendants)
  const availableFolders = useMemo(() => {
    const getDescendantIds = (folderId: string): string[] => {
      const descendants: string[] = [folderId];
      // Find all folders that have this folder as parent (direct or indirect)
      Object.values(folders).forEach((f) => {
        if (f.parentId && descendants.includes(f.parentId)) {
          descendants.push(...getDescendantIds(f.id));
        }
      });
      return descendants;
    };

    const excludedIds = getDescendantIds(folder.id);
    const validFolders = Object.values(folders).filter(
      (f) => !excludedIds.includes(f.id),
    );

    return validFolders;
  }, [folder.id, folders]);

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
    const displayName = targetFolder.name;

    // Get children of this folder
    const children = availableFolders.filter(
      (f) => f.parentId === targetFolder.id,
    );

    return (
      <Div key={targetFolder.id}>
        <Div style={{ paddingLeft: `${depth * 16 + 12}px` }}>
          <Button
            variant="ghost"
            size="unset"
            onClick={() => setSelectedFolderId(targetFolder.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              isSelected ? "bg-accent border-2 border-primary" : ""
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <Span className="text-sm truncate">{displayName}</Span>
          </Button>
        </Div>
        {children.map((childFolder) =>
          renderFolderOption(childFolder, depth + 1),
        )}
      </Div>
    );
  };

  const rootFolders = availableFolders.filter((f) => f.parentId === null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("app.chat.moveFolder.title")}</DialogTitle>
        </DialogHeader>
        <Div className="flex flex-col gap-4">
          <Div className="text-sm text-muted-foreground">
            {t("app.chat.moveFolder.description")}
          </Div>

          {/* Root option */}
          <Button
            variant="ghost"
            size="unset"
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors ${
              selectedFolderId === null
                ? "bg-accent border-2 border-primary"
                : ""
            }`}
          >
            <Span className="text-sm font-medium">
              {t("app.chat.moveFolder.rootLevel")}
            </Span>
          </Button>

          {/* Available folders */}
          <ScrollArea className="h-[300px] border rounded-md p-2">
            <Div className="flex flex-col gap-1">
              {rootFolders.map((f) => renderFolderOption(f))}
            </Div>
          </ScrollArea>

          <Div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.moveFolder.cancel")}
            </Button>
            <Button onClick={handleMove}>
              {t("app.chat.moveFolder.move")}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
