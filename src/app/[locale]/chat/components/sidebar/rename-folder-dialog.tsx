"use client";

import type { JSX } from "react";
import React, { useEffect, useState } from "react";

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

interface RenameFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  folderIcon: string;
  onSave: (name: string, icon: string) => void;
}

export function RenameFolderDialog({
  open,
  onOpenChange,
  folderName,
  folderIcon,
  onSave,
}: RenameFolderDialogProps): JSX.Element {
  const [name, setName] = useState(folderName);
  const [icon, setIcon] = useState(folderIcon);

  // Update local state when props change
  useEffect(() => {
    setName(folderName);
    setIcon(folderIcon);
  }, [folderName, folderIcon, open]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), icon);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Folder Icon</Label>
            <FolderIconSelector value={icon} onChange={setIcon} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
