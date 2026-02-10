"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import { type JSX, useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import {
  type Character,
  COMPANION_CHARACTERS,
} from "../../../../../characters/config";
import { useFavoriteCreate } from "../../../../../favorites/create/hooks";
import { useChatContext } from "../../../../../hooks/context";
import { useChatSettings } from "../../../../../settings/hooks";

interface PickStepProps {
  selectedId: string | null;
  locale: CountryLanguage;
  setSelectedId: (id: string | null) => void;
  onContinue: () => void;
}

export function PickStep({
  selectedId,
  locale,
  setSelectedId,
  onContinue,
}: PickStepProps): JSX.Element {
  const { t } = simpleT(locale);

  const [isSaving, setIsSaving] = useState(false);
  const { user, logger } = useChatContext();

  const { settings, setActiveFavorite } = useChatSettings(user, logger);
  const { addFavorite } = useFavoriteCreate(user, logger);

  const handleContinueToSpecialists = useCallback(async () => {
    if (!selectedId || !settings?.ttsVoice) {
      if (!selectedId) {
        logger.error("No selected ID");
      }
      if (!settings?.ttsVoice) {
        logger.error("No TTS voice");
      }
      return;
    }
    setIsSaving(true);
    const character = COMPANION_CHARACTERS.find((c) => c.id === selectedId)!;

    // Change step FIRST, synchronously, before any async operations
    onContinue();

    // Create favorite and activate it (companion selection)
    try {
      const { CharactersRepositoryClient } =
        await import("../../../../../characters/repository-client");

      const createdId = await addFavorite({
        characterId: selectedId,
        icon: character.icon,
        name: character.name,
        tagline: character.tagline,
        description: character.description,
        voice: character.voice,
        modelSelection: null,
      });

      if (createdId && character.modelSelection) {
        const bestModel = CharactersRepositoryClient.getBestModelForCharacter(
          character.modelSelection,
        );

        if (bestModel) {
          setActiveFavorite(
            createdId,
            selectedId,
            bestModel.id,
            settings.ttsVoice,
          );
        }
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedId,
    addFavorite,
    setActiveFavorite,
    settings?.ttsVoice,
    onContinue,
    logger,
  ]);

  return (
    <Div className="flex flex-col p-5 overflow-y-auto">
      {/* Header */}
      <Div className="text-center mb-5 shrink-0">
        <H3 className="text-lg font-bold mb-1">
          {t("app.chat.onboarding.pick.title")}
        </H3>
        <P className="text-sm text-muted-foreground">
          {t("app.chat.onboarding.pick.subtitle")}
        </P>
      </Div>

      {/* Companion cards */}
      <Div className="grid grid-cols-2 gap-3 mb-5">
        {COMPANION_CHARACTERS.map((character) => (
          <CompanionCard
            key={character.id}
            character={character}
            onSelect={() => setSelectedId(character.id)}
            isSelected={selectedId === character.id}
            locale={locale}
          />
        ))}
      </Div>

      {/* Action */}
      <Div className="shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base"
          disabled={!selectedId || isSaving}
          onClick={handleContinueToSpecialists}
        >
          {isSaving
            ? t("app.chat.onboarding.pick.saving")
            : selectedId
              ? t("app.chat.onboarding.pick.continue")
              : t("app.chat.onboarding.pick.selectFirst")}
        </Button>
      </Div>
    </Div>
  );
}

interface CompanionCardProps {
  character: Character;
  onSelect: () => void;
  isSelected: boolean;
  locale: CountryLanguage;
}

function CompanionCard({
  character,
  onSelect,
  isSelected,
  locale,
}: CompanionCardProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div
      className={cn(
        "flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer",
        "hover:shadow-lg active:scale-[0.98]",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        "group",
      )}
      onClick={onSelect}
    >
      {/* Avatar with selection indicator */}
      <Div className="flex justify-center mb-3 relative">
        <Div
          className={cn(
            "w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/10",
            "flex items-center justify-center ring-2 transition-all shadow-sm overflow-hidden",
            isSelected
              ? "ring-primary"
              : "ring-transparent group-hover:ring-primary/40",
          )}
        >
          <Icon icon={character.icon} className="h-8 w-8 text-primary" />
        </Div>
        {isSelected && (
          <Div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Check className="h-4 w-4 text-primary-foreground" />
          </Div>
        )}
      </Div>

      {/* Name */}
      <Span className="text-lg font-bold text-center mb-2">
        {t(character.name)}
      </Span>

      {/* Tagline */}
      <Span className="text-sm font-medium text-primary text-center mb-2">
        {t(character.tagline)}
      </Span>
      {/* Description */}
      <P className="text-xs text-muted-foreground text-center leading-relaxed">
        {t(character.description)}
      </P>
    </Div>
  );
}
