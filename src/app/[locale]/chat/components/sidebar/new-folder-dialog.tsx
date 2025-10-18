"use client";

import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/packages/next-vibe-ui/web/ui";

import { FolderIconSelector } from "./folder-icon-selector";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, icon: string) => void;
  locale: CountryLanguage;
  /** Optional custom title translation key. If not provided, uses default "app.chat.newFolder.title" */
  titleKey?: string;
}

export function NewFolderDialog({
  open,
  onOpenChange,
  onSave,
  locale,
  titleKey,
}: NewFolderDialogProps): JSX.Element {
  const { t } = simpleT(locale);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setIcon("folder");
    }
  }, [open]);

  const handleSave = (): void => {
    if (name.trim()) {
      onSave(name.trim(), icon);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t((titleKey || "app.chat.newFolder.title") as any)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">
              {t("app.chat.newFolder.folderName")}
            </Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("app.chat.newFolder.placeholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>{t("app.chat.newFolder.folderIcon")}</Label>
            <FolderIconSelector value={icon} onChange={setIcon} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.newFolder.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {t("app.chat.newFolder.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
