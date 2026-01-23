"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import type { FavoriteCreateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { PickStep } from "./pick-step";
import { SpecialistStep } from "./specialist-step";
import { StoryStep } from "./story-step";

type OnboardingStep = "story" | "pick" | "specialists";

interface SelectorOnboardingProps {
  initialStep: OnboardingStep;
  onStepChange: (step: OnboardingStep) => void;
  initialSelectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  favorites: FavoriteCard[];
  addFavorite: (data: FavoriteCreateRequestOutput) => Promise<string | null>;
  onOnboardingComplete: () => void;
  onCustomize: (characterId: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function SelectorOnboarding({
  initialStep = "story",
  onStepChange,
  initialSelectedId = null,
  onSelectedIdChange,
  favorites,
  addFavorite,
  onOnboardingComplete,
  onCustomize,
  locale,
  logger,
}: SelectorOnboardingProps): JSX.Element {
  // Get chat context and characters
  const chat = useChatContext();
  const characters = chat.characters;

  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Notify parent when step changes
  const changeStep = useCallback(
    (newStep: OnboardingStep) => {
      setStep(newStep);
      onStepChange?.(newStep);
    },
    [onStepChange],
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
        modelSelection: {
          selectionType: ModelSelectionType.CHARACTER_BASED,
        },
      });

      if (createdId) {
        chat.setActiveFavorite(
          createdId,
          selectedId,
          character.modelId,
          chat.ttsVoice,
        );
      }
    } finally {
      setIsSaving(false);
    }
  }, [selectedId, changeStep, addFavorite, chat, characters, logger]);

  const handleAddSpecialist = useCallback(
    async (characterId: string) => {
      // Only save, don't activate - this is for adding specialists to list
      await addFavorite({
        characterId,
        modelSelection: {
          selectionType: ModelSelectionType.CHARACTER_BASED,
        },
      });
    },
    [addFavorite],
  );

  const handleStartChatting = useCallback(async () => {
    if (!selectedId) {
      return;
    }

    const existingFavorite = favorites.find(
      (f) => f.characterId === selectedId,
    );

    if (!existingFavorite) {
      const character = characters[selectedId];
      if (!character) {
        logger.error("Character not found", { characterId: selectedId });
        return;
      }

      const createdId = await addFavorite({
        characterId: selectedId,
        modelSelection: {
          selectionType: ModelSelectionType.CHARACTER_BASED,
        },
      });

      if (createdId) {
        chat.setActiveFavorite(
          createdId,
          selectedId,
          character.modelId,
          chat.ttsVoice,
        );
      }
    } else {
      const character = characters[selectedId];
      if (character) {
        chat.setActiveFavorite(
          existingFavorite.id,
          selectedId,
          character.modelId,
          chat.ttsVoice,
        );
      }
    }

    onOnboardingComplete();
  }, [
    selectedId,
    favorites,
    characters,
    addFavorite,
    chat,
    logger,
    onOnboardingComplete,
  ]);

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
        <SpecialistStep
          selectedCharacterId={selectedId}
          onAddSpecialist={handleAddSpecialist}
          onCustomize={onCustomize}
          onStartChatting={handleStartChatting}
          favorites={favorites}
          characters={characters}
          locale={locale}
          logger={logger}
        />
      )}
    </Div>
  );
}
