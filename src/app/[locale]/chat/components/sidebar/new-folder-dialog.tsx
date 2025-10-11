"use client";

import type { JSX } from "react";
import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
} from "@/packages/next-vibe-ui/web/ui";
import { FolderIconSelector } from "./folder-icon-selector";

interface NewFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, icon: string) => void;
}

export function NewFolderDialog({
  open,
  onOpenChange,
  onSave,
}: NewFolderDialogProps): JSX.Element {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setIcon("folder");
    }
  }, [open]);

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
          <DialogTitle>Create New Folder</DialogTitle>
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
              autoFocus
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
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

