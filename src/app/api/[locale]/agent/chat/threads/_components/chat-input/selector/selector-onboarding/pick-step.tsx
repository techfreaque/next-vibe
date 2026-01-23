"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CompanionCard } from "./companion-card";

interface PickStepProps {
  onSelect: () => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  isSaving: boolean;
  characters: Record<string, CharacterListItem>;
  locale: CountryLanguage;
}

export function PickStep({
  onSelect,
  selectedId,
  setSelectedId,
  isSaving,
  characters,
  locale,
}: PickStepProps): JSX.Element {
  const { t } = simpleT(locale);
  const featuredCharacters = useMemo(
    () =>
      ["thea", "hermes"]
        .map((id) => characters[id])
        .filter((c): c is CharacterListItem => c !== undefined),
    [characters],
  );

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
