"use client";

import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX, useCallback } from "react";

import createCharacterEndpoint from "@/app/api/[locale]/agent/chat/characters/create/definition";
import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useFavoriteCreate } from "../../favorites/create/hooks";
import { useChatContext } from "../../hooks/context";

interface CreateCharacterFormProps {
  onBack: () => void;
  closeModal: () => void;
  isAuthenticated: boolean;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

/**
 * Form for creating custom characters using EndpointsPage pattern
 */
export function CreateCharacterForm({
  onBack,
  isAuthenticated,
  locale,
  user,
  logger,
  closeModal,
}: CreateCharacterFormProps): JSX.Element {
  const { t } = simpleT(locale);
  const chat = useChatContext();
  const characters = chat.characters;
  const { addFavorite } = useFavoriteCreate({
    user,
    logger,
  });

  const handleCharacterCreated = useCallback(
    async (characterId: string): Promise<void> => {
      // Characters will update automatically via useChat - no manual refetch needed

      const character = characters[characterId];
      if (!character) {
        logger.error("Character not found after creation", { characterId });
        return;
      }

      // Create favorite from character
      const favoriteData = {
        characterId: characterId,
        modelSelection: {
          selectionType: ModelSelectionType.CHARACTER_BASED,
        } as const,
      };

      const createdId = await addFavorite(favoriteData);

      if (createdId) {
        chat.setActiveFavorite(
          createdId,
          characterId,
          character.modelId,
          chat.ttsVoice,
        );
      }

      closeModal();
    },
    [closeModal, characters, logger, addFavorite, chat],
  );

  return (
    <Div className="flex flex-col max-h-[70vh] overflow-hidden">
      {/* Header */}
      <Div className="flex items-center gap-3 p-4 border-b bg-card shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <Span className="font-medium">
            {t("app.chat.createCharacter.title")}
          </Span>
        </Div>
      </Div>

      {/* Content */}
      <Div className="flex-1 overflow-y-auto">
        {!isAuthenticated ? (
          <Div className="flex flex-col items-center justify-center gap-4 p-8">
            <Div className="text-center text-muted-foreground">
              {t("app.chat.editCharacter.loginRequired")}
            </Div>
            <Div className="flex items-center gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href={`/${locale}/user/login`}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("app.chat.editCharacter.login")}
                </Link>
              </Button>
              <Button type="button" asChild>
                <Link href={`/${locale}/user/signup`}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("app.chat.editCharacter.signup")}
                </Link>
              </Button>
            </Div>
          </Div>
        ) : (
          <EndpointsPage
            endpoint={createCharacterEndpoint}
            locale={locale}
            user={user}
            endpointOptions={{
              queryOptions: { enabled: false },
              create: {
                mutationOptions: {
                  onSuccess: ({ responseData }) => {
                    if (responseData) {
                      handleCharacterCreated(responseData.id);
                      onBack();
                    }
                  },
                },
              },
            }}
          />
        )}
      </Div>
    </Div>
  );
}
