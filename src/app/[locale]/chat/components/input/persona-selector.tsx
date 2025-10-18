"use client";

import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
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
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/packages/next-vibe-ui/web/ui";

import { getIconComponent, type IconValue } from "../../lib/config/icons";
import type { ModelId } from "../../lib/config/models";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PERSONAS,
  type Persona,
  type PersonaCategory,
} from "../../lib/config/personas";
import { SelectorBase, type SelectorOption } from "./selector-base";
import { useFavorites } from "./use-favorites";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onModelChange?: (model: ModelId) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
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
}: PersonaSelectorProps): JSX.Element {
  const { t } = simpleT(locale);
  const defaultIcon = t("app.chat.personaSelector.defaultIcon");
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [categories, setCategories] =
    useState<PersonaCategory[]>(DEFAULT_CATEGORIES);
  const [favorites, toggleFavorite, setFavorites] = useFavorites(
    STORAGE_KEY_FAVORITES,
    DEFAULT_FAVORITES,
    logger,
  );
  const [addPersonaOpen, setAddPersonaOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
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

  // Load personas from localStorage
  useEffect(() => {
    const storedPersonas = localStorage.getItem(STORAGE_KEY_PERSONAS);
    if (storedPersonas) {
      try {
        const parsed = JSON.parse(storedPersonas) as Persona[];
        if (Array.isArray(parsed)) {
          setPersonas([...DEFAULT_PERSONAS, ...parsed]);
        }
      } catch (e) {
        logger.error("Storage", "Failed to load personas", e);
      }
    }
  }, [logger]);

  // Load custom categories from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories) as PersonaCategory[];
        if (Array.isArray(parsed)) {
          setCategories([...DEFAULT_CATEGORIES, ...parsed]);
        }
      } catch (e) {
        logger.error("Storage", "Failed to load categories", e);
      }
    }
  }, [logger]);

  // Save custom personas to localStorage
  const savePersonas = (newPersonas: Persona[]): void => {
    const customPersonas = newPersonas.filter(
      (p) => !DEFAULT_PERSONAS.find((dp) => dp.id === p.id),
    );
    localStorage.setItem(STORAGE_KEY_PERSONAS, JSON.stringify(customPersonas));
    setPersonas(newPersonas);
  };

  // Save custom categories to localStorage
  const saveCustomCategories = (newCategories: PersonaCategory[]): void => {
    const customCategories = newCategories.filter(
      (c) => !DEFAULT_CATEGORIES.find((dc) => dc.id === c.id),
    );
    localStorage.setItem(
      STORAGE_KEY_CATEGORIES,
      JSON.stringify(customCategories),
    );
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
      "my": t("app.chat.personaSelector.grouping.sourceLabels.my"),
      "community": t(
        "app.chat.personaSelector.grouping.sourceLabels.community",
      ),
    };
    const sourceIcons = {
      "built-in": t("app.chat.personaSelector.grouping.sourceIcons.builtIn"),
      "my": t("app.chat.personaSelector.grouping.sourceIcons.my"),
      "community": t("app.chat.personaSelector.grouping.sourceIcons.community"),
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
            <div className="space-y-4">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
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
                </div>
                <Select
                  value={newPersona.category}
                  onValueChange={(value) =>
                    setNewPersona({ ...newPersona, category: value })
                  }
                >
                  <SelectTrigger id="persona-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          {renderIcon(cat.icon)}
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Suggested Prompts */}
              <div className="space-y-2">
                <Label>
                  {t(
                    "app.chat.personaSelector.addDialog.fields.suggestedPrompts.label",
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "app.chat.personaSelector.addDialog.fields.suggestedPrompts.description",
                  )}
                </p>
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
              </div>
            </div>
          </ScrollArea>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setAddPersonaOpen(false)}>
              {t("app.chat.personaSelector.addDialog.cancel")}
            </Button>
            <Button
              onClick={handleAddPersona}
              disabled={!newPersona.name.trim()}
            >
              {t("app.chat.personaSelector.addDialog.create")}
            </Button>
          </div>
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

          <div className="space-y-4 py-4">
            <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
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
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>
              {t("app.chat.personaSelector.addCategoryDialog.cancel")}
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!newCategory.name.trim()}
            >
              {t("app.chat.personaSelector.addCategoryDialog.create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
