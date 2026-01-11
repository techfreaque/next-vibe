"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { CharacterBrowserCore } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SelectorOnboardingProps {
  onSelect: (characterId: string) => void;
  onSaveFavorite?: (characterId: string) => Promise<void>;
  onCustomize: (characterId: string) => void;
  favorites: FavoriteCard[];
  characters: Record<string, CharacterListItem>;
  locale: CountryLanguage;
  initialStep?: OnboardingStep;
  onStepChange?: (step: OnboardingStep) => void;
  initialSelectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
}

type OnboardingStep = "story" | "pick" | "specialists";

/**
 * Step indicator dots
 */
function StepIndicator({
  currentStep,
  totalSteps,
  onBack,
  locale,
}: {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
      {onBack ? (
        <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("app.chat.onboarding.back")}
        </Button>
      ) : (
        <Div className="w-16" />
      )}
      <Div className="flex items-center gap-2">
        {/* eslint-disable-next-line no-unused-vars -- Index-only iteration */}
        {Array.from({ length: totalSteps }).map((_unused, i) => (
          <Div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              i === currentStep ? "bg-primary" : "bg-muted-foreground/30",
            )}
          />
        ))}
      </Div>
      <Div className="w-16" />
    </Div>
  );
}

/**
 * Companion card for selection - personality focused
 */
function CompanionCard({
  character,
  onSelect,
  isSelected,
  locale,
}: {
  character: CharacterListItem;
  onSelect: () => void;
  isSelected: boolean;
  locale: CountryLanguage;
}): JSX.Element {
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
            isSelected ? "ring-primary" : "ring-transparent group-hover:ring-primary/40",
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
      <Span className="text-lg font-bold text-center mb-2">{t(character.content.name)}</Span>

      {/* Tagline */}
      <Span className="text-sm font-medium text-primary text-center mb-2">
        {t(character.content.tagline)}
      </Span>
      {/* Description */}
      <P className="text-xs text-muted-foreground text-center leading-relaxed">
        {t(character.content.description)}
      </P>
    </Div>
  );
}

/**
 * Screen 1: Story - Explain the team concept
 */
function StoryStep({
  onContinue,
  locale,
}: {
  onContinue: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className="flex flex-col p-6 overflow-y-auto">
      {/* Wave emoji header */}
      <Div className="text-center mb-6 shrink-0">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        <Div className="text-5xl mb-4">{"\uD83D\uDC4B"}</Div>
        <H3 className="text-xl font-bold mb-2">{t("app.chat.onboarding.story.title")}</H3>
      </Div>

      {/* Story content */}
      <Div className="bg-muted/50 rounded-xl p-5 mb-6 shrink-0">
        <Div className="space-y-4 text-sm text-muted-foreground">
          <P>{t("app.chat.onboarding.story.line1")}</P>
          <P>{t("app.chat.onboarding.story.line2")}</P>
          <P className="font-medium text-foreground">{t("app.chat.onboarding.story.line3")}</P>
        </Div>
      </Div>

      {/* Continue button */}
      <Div className="shrink-0">
        <Button type="button" className="w-full h-11 text-base gap-2" onClick={onContinue}>
          {t("app.chat.onboarding.story.continue")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Div>
    </Div>
  );
}

/**
 * Screen 2: Pick your daily companion
 */
function PickStep({
  onSelect,
  selectedId,
  setSelectedId,
  isSaving,
  characters,
  locale,
}: {
  onSelect: () => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  isSaving: boolean;
  characters: Record<string, CharacterListItem>;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const featuredCharacters = useMemo(
    () => CharactersRepositoryClient.getFeaturedCharacters(characters),
    [characters],
  );

  return (
    <Div className="flex flex-col p-5 overflow-y-auto">
      {/* Header */}
      <Div className="text-center mb-5 shrink-0">
        <H3 className="text-lg font-bold mb-1">{t("app.chat.onboarding.pick.title")}</H3>
        <P className="text-sm text-muted-foreground">{t("app.chat.onboarding.pick.subtitle")}</P>
      </Div>

      {/* Companion cards */}
      <Div className="grid grid-cols-2 gap-3 mb-5">
        {featuredCharacters.map((character) => (
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
          onClick={onSelect}
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

/**
 * Screen 3: Add specialists to your team
 */
function SpecialistStep({
  selectedCharacterId,
  onAddSpecialist,
  onCustomize,
  onStartChatting,
  favorites,
  characters,
  locale,
}: {
  selectedCharacterId: string;
  onAddSpecialist: (characterId: string) => Promise<void>;
  onCustomize: (characterId: string) => void;
  onStartChatting: () => void;
  favorites: FavoriteCard[];
  characters: Record<string, CharacterListItem>;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const character = characters[selectedCharacterId];
  const characterName = character ? t(character.content.name) : "";

  return (
    <Div className="flex flex-col flex-1 overflow-hidden">
      {/* Scrollable content - includes header and character browser */}
      <Div className="flex-1 overflow-y-auto min-h-0">
        {/* Success indicator */}
        <Div className="flex justify-center p-3 border-b bg-card">
          <Div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
            <Check className="h-4 w-4" />
            {t("app.chat.onboarding.specialists.chosen", {
              name: characterName,
            })}
          </Div>
        </Div>

        {/* Title + Description - inside scroll */}
        <Div className="p-4 pb-2 border-b bg-card">
          <H3 className="text-base font-semibold mb-1 text-center">
            {t("app.chat.onboarding.specialists.title")}
          </H3>
          <P className="text-xs text-muted-foreground text-center">
            {t("app.chat.onboarding.specialists.subtitle")}
          </P>
        </Div>

        {/* Character browser core - NO internal scroll */}
        <CharacterBrowserCore
          onAdd={onAddSpecialist}
          onCustomize={onCustomize}
          favorites={favorites}
          locale={locale}
          hideCompanions={true}
        />
      </Div>

      {/* Sticky footer at bottom */}
      <Div className="p-4 border-t bg-card shrink-0">
        <Button type="button" className="w-full h-10" onClick={onStartChatting}>
          {t("app.chat.onboarding.specialists.start")}
        </Button>
      </Div>
    </Div>
  );
}

/**
 * Onboarding flow - story → pick → specialists
 */
export function SelectorOnboarding({
  onSelect,
  onSaveFavorite,
  onCustomize,
  favorites,
  characters,
  locale,
  initialStep = "story",
  onStepChange,
  initialSelectedId = null,
  onSelectedIdChange,
}: SelectorOnboardingProps): JSX.Element {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [isSaving, setIsSaving] = useState(false);

  const stepIndex = step === "story" ? 0 : step === "pick" ? 1 : 2;

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

    // Save favorite immediately when continuing from pick step
    if (onSaveFavorite) {
      setIsSaving(true);
      try {
        await onSaveFavorite(selectedId);
      } finally {
        setIsSaving(false);
      }
    }

    changeStep("specialists");
  }, [selectedId, onSaveFavorite, changeStep]);

  const handleAddSpecialist = useCallback(
    async (characterId: string) => {
      if (onSaveFavorite) {
        await onSaveFavorite(characterId);
      }
    },
    [onSaveFavorite],
  );

  const handleBack = useCallback(() => {
    if (step === "pick") {
      changeStep("story");
    } else if (step === "specialists") {
      changeStep("pick");
    }
  }, [step, changeStep]);

  const handleStartChatting = useCallback(() => {
    if (selectedId) {
      onSelect(selectedId);
    }
  }, [selectedId, onSelect]);

  return (
    <Div
      className={cn(
        "flex flex-col overflow-hidden",
        // Only specialists step needs fixed height for scrolling
        step === "specialists" ? "h-[75vh]" : "",
      )}
    >
      <StepIndicator
        currentStep={stepIndex}
        totalSteps={3}
        onBack={step !== "story" ? handleBack : undefined}
        locale={locale}
      />

      {step === "story" && <StoryStep onContinue={handleContinueToTeam} locale={locale} />}

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
        />
      )}
    </Div>
  );
}
