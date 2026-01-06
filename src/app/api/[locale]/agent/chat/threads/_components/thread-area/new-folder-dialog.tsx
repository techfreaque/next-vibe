"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import type { IconKey, IconValue } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { FolderIconSelector } from "./folder-icon-selector";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, icon: IconValue) => void;
  locale: CountryLanguage;
  /** Optional custom title translation key. If not provided, uses default "app.chat.newFolder.title" */
  titleKey?: TranslationKey;
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
  const [icon, setIcon] = useState<IconKey>("folder");

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

  const title = titleKey ? t(titleKey) : t("app.chat.newFolder.title");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Div className="flex flex-col gap-4">
          <Div className="flex flex-col gap-2">
            <Label htmlFor="folder-name">{t("app.chat.newFolder.folderName")}</Label>
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
            />
          </Div>
          <Div className="flex flex-col gap-2">
            <Label>{t("app.chat.newFolder.folderIcon")}</Label>
            <FolderIconSelector value={icon} onChange={setIcon} />
          </Div>
          <Div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.newFolder.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {t("app.chat.newFolder.create")}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
