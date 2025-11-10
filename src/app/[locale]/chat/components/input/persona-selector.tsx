"use client";

import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";
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
import React, { useEffect, useState } from "react";

import {
  getIconComponent,
  type IconValue,
} from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PERSONAS,
  type Persona,
  type PersonaCategory,
  type PersonaCategoryId,
} from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SelectorBase, type SelectorOption } from "./selector-base";
import { useFavorites } from "./use-favorites";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onModelChange?: (model: ModelId) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  showTextAt?: "always" | "sm" | "md" | "lg" | "never";
}

const STORAGE_KEY_PERSONAS = "chat-personas";
const STORAGE_KEY_FAVORITES = "chat-favorite-personas";
const STORAGE_KEY_CATEGORIES = "chat-persona-categories";

const DEFAULT_FAVORITES = ["professional", "creative", "technical"];

export function PersonaSelector({
  value,
  onChange,
  onModelChange,
  locale,
  logger,
  className,
  buttonClassName,
  triggerSize,
  showTextAt,
}: PersonaSelectorProps): JSX.Element {
  const { t } = simpleT(locale);
  const defaultIcon = t("app.chat.personaSelector.defaultIcon");
  const [personas, setPersonas] = useState<Persona[]>([...DEFAULT_PERSONAS]);
  const [categories, setCategories] = useState<PersonaCategory[]>([
    ...DEFAULT_CATEGORIES,
  ]);
  const [favorites, toggleFavorite, setFavorites] = useFavorites(
    STORAGE_KEY_FAVORITES,
    DEFAULT_FAVORITES,
    logger,
  );
  const [addPersonaOpen, setAddPersonaOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newPersona, setNewPersona] = useState<{
    name: string;
    description: string;
    icon: string;
    systemPrompt: string;
    category: PersonaCategoryId;
    suggestedPrompts: string[];
  }>({
    name: "",
    description: "",
    icon: defaultIcon,
    systemPrompt: "",
    category: "general",
    suggestedPrompts: ["", "", "", ""],
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: defaultIcon,
  });

  // Load personas from storage
  useEffect(() => {
    async function loadPersonas(): Promise<void> {
      const storedPersonas = await storage.getItem(STORAGE_KEY_PERSONAS);
      if (storedPersonas) {
        try {
          const parsed = JSON.parse(storedPersonas) as Persona[];
          if (Array.isArray(parsed)) {
            setPersonas([...DEFAULT_PERSONAS, ...parsed]);
          }
        } catch (e) {
          logger.error("Storage", "Failed to load personas", parseError(e));
        }
      }
    }
    void loadPersonas();
  }, [logger]);

  // Load custom categories from storage
  useEffect(() => {
    async function loadCategories(): Promise<void> {
      const storedCategories = await storage.getItem(STORAGE_KEY_CATEGORIES);
      if (storedCategories) {
        try {
          const parsed = JSON.parse(storedCategories) as PersonaCategory[];
          if (Array.isArray(parsed)) {
            setCategories([...DEFAULT_CATEGORIES, ...parsed]);
          }
        } catch (e) {
          logger.error("Storage", "Failed to load categories", parseError(e));
        }
      }
    }
    void loadCategories();
  }, [logger]);

  // Save custom personas to storage
  const savePersonas = (newPersonas: Persona[]): void => {
    const customPersonas = newPersonas.filter(
      (p) => !DEFAULT_PERSONAS.find((dp) => dp.id === p.id),
    );
    async function save(): Promise<void> {
      await storage.setItem(
        STORAGE_KEY_PERSONAS,
        JSON.stringify(customPersonas),
      );
    }
    void save();
    setPersonas(newPersonas);
  };

  // Save custom categories to storage
  const saveCustomCategories = (newCategories: PersonaCategory[]): void => {
    const customCategories = newCategories.filter(
      (c) => !DEFAULT_CATEGORIES.find((dc) => dc.id === c.id),
    );
    async function save(): Promise<void> {
      await storage.setItem(
        STORAGE_KEY_CATEGORIES,
        JSON.stringify(customCategories),
      );
    }
    void save();
    setCategories(newCategories);
  };

  const handleAddCategory = (): void => {
    if (!newCategory.name.trim()) {
      return;
    }

    const category: PersonaCategory = {
      id: `custom-${Date.now()}`,
      name: newCategory.name,
      icon: newCategory.icon,
    };

    saveCustomCategories([...categories, category]);
    setNewCategory({
      name: "",
      icon: t("app.chat.personaSelector.defaultIcon"),
    });
    setAddCategoryOpen(false);
  };

  const handleAddPersona = (): void => {
    if (!newPersona.name.trim()) {
      return;
    }

    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name,
      description: newPersona.description,
      icon: newPersona.icon,
      systemPrompt: newPersona.systemPrompt,
      category: newPersona.category,
      source: "my",
      suggestedPrompts: newPersona.suggestedPrompts.filter((p) => p.trim()),
    };

    savePersonas([...personas, persona]);
    setFavorites([...favorites, persona.id]);
    onChange(persona.id);
    setAddPersonaOpen(false);
    setNewPersona({
      name: "",
      description: "",
      icon: defaultIcon,
      systemPrompt: "",
      category: "general",
      suggestedPrompts: ["", "", "", ""],
    });
  };

  // Handle persona change - switch model if persona has preferred model
  const handlePersonaChange = (personaId: string): void => {
    onChange(personaId);

    // If persona has a preferred model and onModelChange is provided, switch to it
    if (onModelChange) {
      const selectedPersona = personas.find((p) => p.id === personaId);
      if (selectedPersona?.preferredModel) {
        onModelChange(selectedPersona.preferredModel);
      }
    }
  };

  // Helper to render icon - handles IconValue (string or component)
  const renderIcon = (icon: IconValue): React.ReactNode => {
    const Icon = getIconComponent(icon);
    return React.createElement(Icon, { className: "text-base leading-none" });
  };

  // Get source group info (for "provider" mode in SelectorBase)
  const getSourceGroupInfo = (
    persona: Persona,
  ): { group: string; groupIcon: IconValue } => {
    const sourceLabels = {
      "built-in": t("app.chat.personaSelector.grouping.sourceLabels.builtIn"),
      my: t("app.chat.personaSelector.grouping.sourceLabels.my"),
      community: t("app.chat.personaSelector.grouping.sourceLabels.community"),
    };
    const sourceIcons = {
      "built-in": t("app.chat.personaSelector.grouping.sourceIcons.builtIn"),
      my: t("app.chat.personaSelector.grouping.sourceIcons.my"),
      community: t("app.chat.personaSelector.grouping.sourceIcons.community"),
    };
    return {
      group: sourceLabels[persona.source],
      groupIcon: sourceIcons[persona.source],
    };
  };

  // Build utility icons map for category grouping (for "utility" mode in SelectorBase)
  const categoryUtilityIcons: Record<string, IconValue> = {};
  categories.forEach((cat) => {
    categoryUtilityIcons[cat.id] = cat.icon;
  });

  // Convert personas to selector options
  const options: SelectorOption<string>[] = personas.map((persona) => {
    const sourceInfo = getSourceGroupInfo(persona);
    return {
      id: persona.id,
      name: persona.name,
      description: persona.description,
      icon: persona.icon,
      group: sourceInfo.group,
      groupIcon: sourceInfo.groupIcon,
      utilities: [persona.category], // Category as utility for "utility" mode
      utilityIcons: categoryUtilityIcons,
    };
  });

  return (
    <>
      <SelectorBase
        value={value}
        onChange={handlePersonaChange}
        options={options}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddNew={() => setAddPersonaOpen(true)}
        placeholder={t("app.chat.personaSelector.placeholder")}
        addNewLabel={t("app.chat.personaSelector.addNewLabel")}
        locale={locale}
        groupModeLabels={{
          provider: t("app.chat.personaSelector.grouping.bySource"),
          utility: t("app.chat.personaSelector.grouping.byCategory"),
        }}
        className={className}
        buttonClassName={buttonClassName}
        triggerSize={triggerSize}
        showTextAt={showTextAt}
      />

      {/* Add Custom Persona Dialog */}
      <Dialog open={addPersonaOpen} onOpenChange={setAddPersonaOpen}>
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
                    setNewPersona({ ...newPersona, icon: e.target.value })
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
                    onClick={() => setAddCategoryOpen(true)}
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
            <Button variant="outline" onClick={() => setAddPersonaOpen(false)}>
              {t("app.chat.personaSelector.addDialog.cancel")}
            </Button>
            <Button
              onClick={handleAddPersona}
              disabled={!newPersona.name.trim()}
            >
              {t("app.chat.personaSelector.addDialog.create")}
            </Button>
          </Div>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
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
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                maxLength={2}
              />
            </Div>
          </Div>

          <Div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>
              {t("app.chat.personaSelector.addCategoryDialog.cancel")}
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!newCategory.name.trim()}
            >
              {t("app.chat.personaSelector.addCategoryDialog.create")}
            </Button>
          </Div>
        </DialogContent>
      </Dialog>
    </>
  );
}
