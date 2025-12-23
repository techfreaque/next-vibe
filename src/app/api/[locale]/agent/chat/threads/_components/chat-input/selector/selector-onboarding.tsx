"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Code } from "next-vibe-ui/ui/icons/Code";
import { GraduationCap } from "next-vibe-ui/ui/icons/GraduationCap";
import { MessageCircle } from "next-vibe-ui/ui/icons/MessageCircle";
import { PenTool } from "next-vibe-ui/ui/icons/PenTool";
import { Image } from "next-vibe-ui/ui/image";
import { Span } from "next-vibe-ui/ui/span";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import {
  type Character,
  getCharacterById,
} from "@/app/api/[locale]/agent/chat/characters/config";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SelectorOnboardingProps {
  onSelect: (characterId: string) => void;
  onSaveFavorite?: (characterId: string) => Promise<void>;
  onBrowseAll: () => void;
  locale: CountryLanguage;
}

type OnboardingStep = "story" | "pick" | "specialists";

// Featured characters for quick onboarding
const FEATURED_CHARACTER_IDS = ["thea", "hermes"] as const;

// Companion descriptions (personality-focused, not model-focused)
const COMPANION_INFO: Record<string, { tagline: string; description: string }> =
  {
    thea: {
      tagline: "app.chat.onboarding.thea.tagline",
      description: "app.chat.onboarding.thea.description",
    },
    hermes: {
      tagline: "app.chat.onboarding.hermes.tagline",
      description: "app.chat.onboarding.hermes.description",
    },
  };

/**
 * Get featured characters for onboarding
 */
function getFeaturedCharacters(): Character[] {
  return FEATURED_CHARACTER_IDS.map(getCharacterById).filter(
    (p): p is Character => p !== null,
  );
}

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
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 -ml-2"
          onClick={onBack}
        >
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
  character: Character;
  onSelect: () => void;
  isSelected: boolean;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const Icon = getIconComponent(character.icon);
  const info = COMPANION_INFO[character.id];

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
          {character.avatar ? (
            <Image
              src={character.avatar}
              alt={t(character.name)}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className="h-8 w-8 text-primary" />
          )}
        </Div>
        {isSelected && (
          <Div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Check className="h-4 w-4 text-primary-foreground" />
          </Div>
        )}
      </Div>

      {/* Name */}
      <Span className="text-lg font-bold text-center mb-1">
        {t(character.name)}
      </Span>

      {/* Tagline */}
      {info && (
        <Span className="text-sm font-medium text-primary text-center mb-2">
          {t(info.tagline)}
        </Span>
      )}

      {/* Description */}
      {info && (
        <P className="text-xs text-muted-foreground text-center leading-relaxed">
          {t(info.description)}
        </P>
      )}
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
        <H3 className="text-xl font-bold mb-2">
          {t("app.chat.onboarding.story.title")}
        </H3>
      </Div>

      {/* Story content */}
      <Div className="bg-muted/50 rounded-xl p-5 mb-6 shrink-0">
        <Div className="space-y-4 text-sm text-muted-foreground">
          <P>{t("app.chat.onboarding.story.line1")}</P>
          <P>{t("app.chat.onboarding.story.line2")}</P>
          <P className="font-medium text-foreground">
            {t("app.chat.onboarding.story.line3")}
          </P>
        </Div>
      </Div>

      {/* Continue button */}
      <Div className="shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base gap-2"
          onClick={onContinue}
        >
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
  locale,
}: {
  onSelect: () => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  isSaving: boolean;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const featuredCharacters = useMemo(() => getFeaturedCharacters(), []);

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
 * Screen 3: Specialist peek - show they exist
 */
function SpecialistStep({
  selectedCharacterId,
  onStartChatting,
  onBrowseAll,
  locale,
}: {
  selectedCharacterId: string;
  onStartChatting: () => void;
  onBrowseAll: () => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const character = getCharacterById(selectedCharacterId);
  const characterName = character ? t(character.name) : "";

  const specialists = [
    {
      icon: Code,
      name: t("app.chat.onboarding.specialists.technical"),
      desc: t("app.chat.onboarding.specialists.technicalDesc"),
    },
    {
      icon: PenTool,
      name: t("app.chat.onboarding.specialists.creative"),
      desc: t("app.chat.onboarding.specialists.creativeDesc"),
    },
    {
      icon: GraduationCap,
      name: t("app.chat.onboarding.specialists.teacher"),
      desc: t("app.chat.onboarding.specialists.teacherDesc"),
    },
    {
      icon: MessageCircle,
      name: t("app.chat.onboarding.specialists.challenger"),
      desc: t("app.chat.onboarding.specialists.challengerDesc"),
    },
  ];

  return (
    <Div className="flex flex-col p-5 overflow-y-auto">
      {/* Success header */}
      <Div className="text-center mb-4 shrink-0">
        <Div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-3">
          <Check className="h-4 w-4" />
          {t("app.chat.onboarding.specialists.chosen", { name: characterName })}
        </Div>
        <P className="text-sm text-muted-foreground">
          {t("app.chat.onboarding.specialists.intro")}
        </P>
      </Div>

      {/* Specialists list */}
      <Div className="bg-muted/50 rounded-xl p-4 mb-4 shrink-0">
        <Div className="flex items-center gap-2 mb-3">
          <Span className="text-sm font-medium">
            {t("app.chat.onboarding.specialists.title")}
          </Span>
        </Div>
        <Div className="space-y-2.5">
          {specialists.map((spec, i) => (
            <Div key={i} className="flex items-center gap-3">
              <Div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                <spec.icon className="h-4 w-4 text-primary" />
              </Div>
              <Div className="min-w-0">
                <Span className="text-sm font-medium">{spec.name}</Span>
                <Span className="text-xs text-muted-foreground ml-2">
                  {spec.desc}
                </Span>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Tip about switching */}
      <P className="text-xs text-muted-foreground text-center mb-4 shrink-0">
        {t("app.chat.onboarding.specialists.switchTip")}
      </P>

      {/* Actions */}
      <Div className="flex flex-col gap-2 shrink-0">
        <Button
          type="button"
          className="w-full h-11 text-base"
          onClick={onStartChatting}
        >
          {t("app.chat.onboarding.specialists.start")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={onBrowseAll}
        >
          {t("app.chat.onboarding.specialists.browseAll")}
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
  onBrowseAll,
  locale,
}: SelectorOnboardingProps): JSX.Element {
  const [step, setStep] = useState<OnboardingStep>("story");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stepIndex = step === "story" ? 0 : step === "pick" ? 1 : 2;

  const handleContinueToTeam = useCallback(() => {
    setStep("pick");
  }, []);

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

    setStep("specialists");
  }, [selectedId, onSaveFavorite]);

  const handleBack = useCallback(() => {
    if (step === "pick") {
      setStep("story");
    } else if (step === "specialists") {
      setStep("pick");
    }
  }, [step]);

  const handleStartChatting = useCallback(() => {
    if (selectedId) {
      onSelect(selectedId);
    }
  }, [selectedId, onSelect]);

  const handleBrowseAll = useCallback(() => {
    // Just go to browser - don't close the modal
    onBrowseAll();
  }, [onBrowseAll]);

  return (
    <Div className="flex flex-col max-h-[75vh]">
      <StepIndicator
        currentStep={stepIndex}
        totalSteps={3}
        onBack={step !== "story" ? handleBack : undefined}
        locale={locale}
      />

      {step === "story" && (
        <StoryStep onContinue={handleContinueToTeam} locale={locale} />
      )}

      {step === "pick" && (
        <PickStep
          onSelect={handleContinueToSpecialists}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isSaving={isSaving}
          locale={locale}
        />
      )}

      {step === "specialists" && selectedId && (
        <SpecialistStep
          selectedCharacterId={selectedId}
          onStartChatting={handleStartChatting}
          onBrowseAll={handleBrowseAll}
          locale={locale}
        />
      )}
    </Div>
  );
}
