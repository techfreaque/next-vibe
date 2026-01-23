"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { H3, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { CharacterBrowserCore } from "@/app/api/[locale]/agent/chat/characters/components/character-browser";
import type { CharacterListItem } from "@/app/api/[locale]/agent/chat/characters/definition";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SpecialistStepProps {
  selectedCharacterId: string;
  onAddSpecialist: (characterId: string) => Promise<void>;
  onCustomize: (characterId: string) => void;
  onStartChatting: () => void;
  favorites: FavoriteCard[];
  characters: Record<string, CharacterListItem>;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function SpecialistStep({
  selectedCharacterId,
  onAddSpecialist,
  onCustomize,
  onStartChatting,
  favorites,
  characters,
  locale,
  logger,
}: SpecialistStepProps): JSX.Element {
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
          logger={logger}
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
