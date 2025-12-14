"use client";

import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { TOUR_DATA_ATTRS } from "@/app/api/[locale]/agent/chat/_components/welcome-tour/tour-config";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import {
  type IconKey,
  type IconValue,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PERSONAS,
  type Persona,
  type PersonaCategory,
  type PersonaCategoryId,
} from "@/app/api/[locale]/agent/chat/personas/config";
import {
  SelectorBase,
  type SelectorOption,
} from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/selector-base";
import { useFavorites } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/use-favorites";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import { AddCategoryDialog } from "./add-category-dialog";
import { AddPersonaDialog } from "./add-persona-dialog";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  showTextAt?: "always" | "sm" | "md" | "lg" | "@sm" | "@md" | "@lg" | "@xl" | "never";
}

const STORAGE_KEY_PERSONAS = "chat-personas";
const STORAGE_KEY_FAVORITES = "chat-favorite-personas";
const STORAGE_KEY_CATEGORIES = "chat-persona-categories";

const DEFAULT_FAVORITES = ["professional", "creative", "technical"];

export function PersonaSelector({
  value,
  onChange,
  locale,
  logger,
  className,
  buttonClassName,
  triggerSize,
  showTextAt,
}: PersonaSelectorProps): JSX.Element {
  const { handleModelChange: onModelChange } = useChatContext();
  const { t } = simpleT(locale);
  const defaultIcon: IconKey = "robot-face";
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
    icon: IconKey;
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
  const [newCategory, setNewCategory] = useState<{
    name: string;
    icon: IconKey;
  }>({
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

    // User-provided category name treated as TranslationKey for API compatibility
    const category: PersonaCategory = {
      id: `custom-${Date.now()}`,
      name: newCategory.name as TranslationKey,
      icon: newCategory.icon,
    };

    saveCustomCategories([...categories, category]);
    setNewCategory({
      name: "",
      icon: defaultIcon,
    });
    setAddCategoryOpen(false);
  };

  const handleAddPersona = (): void => {
    if (!newPersona.name.trim()) {
      return;
    }

    // User-provided persona data treated as TranslationKey for API compatibility
    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name as TranslationKey,
      description: newPersona.description as TranslationKey,
      icon: newPersona.icon,
      systemPrompt: newPersona.systemPrompt,
      category: newPersona.category,
      source: "my",
      suggestedPrompts: newPersona.suggestedPrompts.filter((p) =>
        p.trim(),
      ) as TranslationKey[],
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

    // If persona has a preferred model, switch to it
    const selectedPersona = personas.find((p) => p.id === personaId);
    if (selectedPersona?.preferredModel) {
      onModelChange(selectedPersona.preferredModel);
    }
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
      groupIcon: sourceIcons[persona.source] as IconValue,
    };
  };

  // Convert personas to selector options
  const options: SelectorOption<string>[] = personas.map((persona) => {
    const sourceInfo = getSourceGroupInfo(persona);

    // Build utility icons map and utility labels for this persona's category
    const category = categories.find((cat) => cat.id === persona.category);
    const utilityIcons: Record<string, IconValue> = {};
    const utilityLabels: Record<string, string> = {};
    if (category) {
      utilityIcons[persona.category] = category.icon;
      utilityLabels[persona.category] = t(category.name);
    }

    return {
      id: persona.id,
      name: t(persona.name),
      description: t(persona.description),
      icon: persona.icon,
      group: sourceInfo.group,
      groupIcon: sourceInfo.groupIcon,
      utilities: [persona.category], // Category as utility for "utility" mode
      utilityIcons,
      utilityLabels,
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
        dataTour={TOUR_DATA_ATTRS.PERSONA_SELECTOR}
        dataTourPrefix={TOUR_DATA_ATTRS.PERSONA_SELECTOR}
      />

      {/* Add Custom Persona Dialog */}
      <AddPersonaDialog
        open={addPersonaOpen}
        onOpenChange={setAddPersonaOpen}
        newPersona={newPersona}
        setNewPersona={setNewPersona}
        categories={categories}
        onAddPersona={handleAddPersona}
        onAddCategoryClick={() => setAddCategoryOpen(true)}
        locale={locale}
      />

      {/* Create Category Dialog */}
      <AddCategoryDialog
        open={addCategoryOpen}
        onOpenChange={setAddCategoryOpen}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onAddCategory={handleAddCategory}
        locale={locale}
      />
    </>
  );
}
