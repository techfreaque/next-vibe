"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { CharacterBrowserCore } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { useFavoriteCreate } from "../../../../../favorites/create/hooks";
import { PickStep } from "./pick-step";
import { StoryStep } from "./story-step";

type OnboardingStep = "story" | "pick" | "specialists";

interface SelectorOnboardingProps {
  initialSelectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  favorites: FavoriteCard[];
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function SelectorOnboarding({
  initialSelectedId = null,
  onSelectedIdChange,
  favorites,
  locale,
  logger,
}: SelectorOnboardingProps): JSX.Element {
  // Local state
  const [onboardingStep, setOnboardingStep] = useState<
    "story" | "pick" | "specialists"
  >("story");
  // Get chat context and characters
  const { characters, setActiveFavorite, ttsVoice, user } = useChatContext();
  const { addFavorite } = useFavoriteCreate({
    user,
    logger,
  });

  const [step, setStep] = useState<OnboardingStep>(onboardingStep);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Notify parent when step changes
  const changeStep = useCallback(
    (newStep: OnboardingStep) => {
      setStep(newStep);
      setOnboardingStep?.(newStep);
    },
    [setOnboardingStep],
  );

  // Notify parent when selected ID changes
  const changeSelectedId = useCallback(
    (newId: string | null) => {
      setSelectedId(newId);
      onSelectedIdChange?.(newId);
    },
    [onSelectedIdChange],
  );

  const handleContinueToTeam = useCallback(() => {
    changeStep("pick");
  }, [changeStep]);

  const handleContinueToSpecialists = useCallback(async () => {
    if (!selectedId) {
      return;
    }

    const character = characters[selectedId];
    if (!character) {
      logger.error("Character not found", { characterId: selectedId });
      return;
    }

    // Change step FIRST, synchronously, before any async operations
    changeStep("specialists");

    // Create favorite and activate it (companion selection)
    setIsSaving(true);
    try {
      const createdId = await addFavorite({
        characterId: selectedId,
        icon: character.icon,
        name: character.name,
        tagline: character.tagline,
        description: character.description,
        voice: null,
        modelSelection: {
          currentSelection: {
            selectionType: ModelSelectionType.CHARACTER_BASED,
          },
        },
      });

      if (createdId) {
        setActiveFavorite(createdId, selectedId, character.modelId, ttsVoice);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedId,
    changeStep,
    addFavorite,
    characters,
    logger,
    setActiveFavorite,
    ttsVoice,
  ]);

  const handleAddSpecialist = useCallback(
    async (characterId: string) => {
      const character = characters[characterId];
      if (!character) {
        logger.error("Character not found", { characterId });
        return;
      }

      // Only save, don't activate - this is for adding specialists to list
      await addFavorite({
        characterId,
        icon: character.icon,
        name: character.name,
        tagline: character.tagline,
        description: character.description,
        voice: null,
        modelSelection: {
          currentSelection: {
            selectionType: ModelSelectionType.CHARACTER_BASED,
          },
        },
      });
    },
    [addFavorite, characters, logger],
  );

  return (
    <Div
      className={cn(
        "flex flex-col overflow-hidden",
        // Only specialists step needs fixed height for scrolling
        step === "specialists" ? "h-[80vh] max-h-200" : "",
      )}
    >
      {step === "story" && (
        <StoryStep onContinue={handleContinueToTeam} locale={locale} />
      )}

      {step === "pick" && (
        <PickStep
          onSelect={handleContinueToSpecialists}
          selectedId={selectedId}
          setSelectedId={changeSelectedId}
          isSaving={isSaving}
          characters={characters}
          locale={locale}
        />
      )}

      {step === "specialists" && selectedId && (
        <CharacterBrowserCore
          onAdd={handleAddSpecialist}
          favorites={favorites}
          locale={locale}
          hideCompanions={true}
          logger={logger}
          user={user}
          selectedCharacterId={selectedId}
          characters={characters}
          showSpecialistWrapper={true}
        />
      )}
    </Div>
  );
}
