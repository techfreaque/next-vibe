"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import type { JSX } from "react";
import React from "react";

import type { IconKey } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCategory: {
    name: string;
    icon: IconKey;
  };
  setNewCategory: React.Dispatch<
    React.SetStateAction<{
      name: string;
      icon: IconKey;
    }>
  >;
  onAddCategory: () => void;
  locale: CountryLanguage;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  newCategory,
  setNewCategory,
  onAddCategory,
  locale,
}: AddCategoryDialogProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("app.chat.personaSelector.addCategoryDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <Div className="flex flex-col gap-4 py-4">
          <Div className="flex flex-col gap-2">
            <Label htmlFor="category-name">
              {t(
                "app.chat.personaSelector.addCategoryDialog.fields.name.label",
              )}
            </Label>
            <Input
              id="category-name"
              placeholder={t(
                "app.chat.personaSelector.addCategoryDialog.fields.name.placeholder",
              )}
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
          </Div>
          <Div className="flex flex-col gap-2">
            <Label htmlFor="category-icon">
              {t(
                "app.chat.personaSelector.addCategoryDialog.fields.icon.label",
              )}
            </Label>
            <Input
              id="category-icon"
              placeholder={t(
                "app.chat.personaSelector.addCategoryDialog.fields.icon.placeholder",
              )}
              value={newCategory.icon}
              onChange={(e) =>
                setNewCategory({ ...newCategory, icon: e.target.value as IconKey })
              }
              maxLength={2}
            />
          </Div>
        </Div>

        <Div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("app.chat.personaSelector.addCategoryDialog.cancel")}
          </Button>
          <Button onClick={onAddCategory} disabled={!newCategory.name.trim()}>
            {t("app.chat.personaSelector.addCategoryDialog.create")}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
