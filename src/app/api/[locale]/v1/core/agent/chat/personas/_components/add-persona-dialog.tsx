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
import { P } from "next-vibe-ui/ui/typography";
import { ScrollArea } from "next-vibe-ui/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import type { JSX } from "react";
import React from "react";

import {
  getIconComponent,
  type IconKey,
} from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type {
  PersonaCategory,
  PersonaCategoryId,
} from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface AddPersonaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPersona: {
    name: string;
    description: string;
    icon: IconKey;
    systemPrompt: string;
    category: PersonaCategoryId;
    suggestedPrompts: string[];
  };
  setNewPersona: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      icon: IconKey;
      systemPrompt: string;
      category: PersonaCategoryId;
      suggestedPrompts: string[];
    }>
  >;
  categories: PersonaCategory[];
  onAddPersona: () => void;
  onAddCategoryClick: () => void;
  locale: CountryLanguage;
}

export function AddPersonaDialog({
  open,
  onOpenChange,
  newPersona,
  setNewPersona,
  categories,
  onAddPersona,
  onAddCategoryClick,
  locale,
}: AddPersonaDialogProps): JSX.Element {
  const { t } = simpleT(locale);

  // Helper to render icon - handles IconKey (string key from registry)
  const renderIcon = (icon: IconKey): React.ReactNode => {
    const Icon = getIconComponent(icon);
    return React.createElement(Icon, { className: "text-base leading-none" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {t("app.chat.personaSelector.addDialog.title")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Div className="flex flex-col gap-4">
            <Div className="flex flex-col gap-2">
              <Label htmlFor="persona-name">
                {t("app.chat.personaSelector.addDialog.fields.name.label")}
              </Label>
              <Input
                id="persona-name"
                placeholder={t(
                  "app.chat.personaSelector.addDialog.fields.name.placeholder",
                )}
                value={newPersona.name}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, name: e.target.value })
                }
              />
            </Div>
            <Div className="flex flex-col gap-2">
              <Label htmlFor="persona-icon">
                {t("app.chat.personaSelector.addDialog.fields.icon.label")}
              </Label>
              <Input
                id="persona-icon"
                placeholder={t(
                  "app.chat.personaSelector.addDialog.fields.icon.placeholder",
                )}
                value={newPersona.icon}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, icon: e.target.value as IconKey })
                }
                maxLength={2}
              />
            </Div>
            <Div className="flex flex-col gap-2">
              <Label htmlFor="persona-description">
                {t(
                  "app.chat.personaSelector.addDialog.fields.description.label",
                )}
              </Label>
              <Input
                id="persona-description"
                placeholder={t(
                  "app.chat.personaSelector.addDialog.fields.description.placeholder",
                )}
                value={newPersona.description}
                onChange={(e) =>
                  setNewPersona({
                    ...newPersona,
                    description: e.target.value,
                  })
                }
              />
            </Div>
            <Div className="flex flex-col gap-2">
              <Label htmlFor="persona-prompt">
                {t(
                  "app.chat.personaSelector.addDialog.fields.systemPrompt.label",
                )}
              </Label>
              <Textarea
                id="persona-prompt"
                placeholder={t(
                  "app.chat.personaSelector.addDialog.fields.systemPrompt.placeholder",
                )}
                value={newPersona.systemPrompt}
                onChange={(e) =>
                  setNewPersona({
                    ...newPersona,
                    systemPrompt: e.target.value,
                  })
                }
                rows={4}
              />
            </Div>

            {/* Category Selector */}
            <Div className="flex flex-col gap-2">
              <Div className="flex items-center justify-between">
                <Label htmlFor="persona-category">
                  {t(
                    "app.chat.personaSelector.addDialog.fields.category.label",
                  )}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddCategoryClick}
                  className="h-7 text-xs"
                >
                  {t("app.chat.personaSelector.addDialog.createCategory")}
                </Button>
              </Div>
              <Select
                value={newPersona.category}
                onValueChange={(value) =>
                  setNewPersona({
                    ...newPersona,
                    category: value as PersonaCategoryId,
                  })
                }
              >
                <SelectTrigger id="persona-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <Span className="flex items-center gap-2">
                        {renderIcon(cat.icon)}
                        <Span>{cat.name}</Span>
                      </Span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Div>

            {/* Suggested Prompts */}
            <Div className="flex flex-col gap-2">
              <Label>
                {t(
                  "app.chat.personaSelector.addDialog.fields.suggestedPrompts.label",
                )}
              </Label>
              <P className="text-sm text-muted-foreground">
                {t(
                  "app.chat.personaSelector.addDialog.fields.suggestedPrompts.description",
                )}
              </P>
              {newPersona.suggestedPrompts.map((prompt, index) => (
                <Input
                  key={index}
                  placeholder={t(
                    "app.chat.personaSelector.addDialog.fields.suggestedPrompts.placeholder",
                    { number: index + 1 },
                  )}
                  value={prompt}
                  onChange={(e) => {
                    const newPrompts = [...newPersona.suggestedPrompts];
                    newPrompts[index] = e.target.value;
                    setNewPersona({
                      ...newPersona,
                      suggestedPrompts: newPrompts,
                    });
                  }}
                />
              ))}
            </Div>
          </Div>
        </ScrollArea>

        <Div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("app.chat.personaSelector.addDialog.cancel")}
          </Button>
          <Button onClick={onAddPersona} disabled={!newPersona.name.trim()}>
            {t("app.chat.personaSelector.addDialog.create")}
          </Button>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
