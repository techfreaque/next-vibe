"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import type { IconValue } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { IconSelector } from "./icon-selector";

interface RenameFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  folderIcon: IconValue | null;
  onSave: (name: string, icon: IconValue | null) => void;
  locale: CountryLanguage;
}

export function RenameFolderDialog({
  open,
  onOpenChange,
  folderName,
  folderIcon,
  onSave,
  locale,
}: RenameFolderDialogProps): JSX.Element {
  const { t } = simpleT(locale);
  const [name, setName] = useState(folderName);
  const [icon, setIcon] = useState<IconValue | null>(folderIcon);

  // Update local state when props change
  useEffect(() => {
    setName(folderName);
    setIcon(folderIcon);
  }, [folderName, folderIcon, open]);

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
          <DialogTitle>{t("app.chat.renameFolder.title")}</DialogTitle>
        </DialogHeader>
        <Div className="flex flex-col gap-4">
          <Div className="flex flex-col gap-2">
            <Label htmlFor="folder-name">{t("app.chat.renameFolder.folderName")}</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("app.chat.renameFolder.placeholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </Div>
          <Div className="flex flex-col gap-2">
            <Label>{t("app.chat.renameFolder.folderIcon")}</Label>
            <IconSelector value={icon ?? "folder"} onChange={setIcon} locale={locale} />
          </Div>
          <Div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.renameFolder.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {t("app.chat.renameFolder.save")}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
