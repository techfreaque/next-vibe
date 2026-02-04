"use client";

import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import updateCharacterEndpoint from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import { useCharacter } from "@/app/api/[locale]/agent/chat/characters/[id]/hooks";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useFavorite } from "../../favorites/[id]/hooks";

interface EditCharacterModalProps {
  onBack: () => void;
  onCharacterEdited: () => void;
  // Character ID to fetch and edit
  characterId: string;
  editingFavoriteId: string | null;
  isAuthenticated: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function EditCharacter({
  onBack,
  characterId,
  isAuthenticated,
  locale,
  logger,
  user,
  editingFavoriteId,
  onCharacterEdited,
}: EditCharacterModalProps): JSX.Element {
  const { t } = simpleT(locale);

  // Fetch favorite data only when editing an existing favorite (not when creating new)
  const favoriteEndpoint = useFavorite(editingFavoriteId, user, logger);
  const favoriteData = useMemo(
    () => favoriteEndpoint.read?.data ?? null,
    [favoriteEndpoint.read?.data],
  );

  const handleCharacterEdited = useCallback(
    async (newCharacterId: string) => {
      if (editingFavoriteId && favoriteData) {
        await favoriteEndpoint.updateFavorite({
          characterId: newCharacterId,
          character: {
            info: {
              icon: favoriteData.character.info.icon,
            },
          },
          modelSelection: favoriteData.modelSelection,
        });
      }
      onCharacterEdited();
    },
    [editingFavoriteId, favoriteData, favoriteEndpoint, onCharacterEdited],
  );

  // Fetch full character data using domain hook
  const characterEndpoint = useCharacter(characterId, user, logger);
  const characterData = useMemo(() => {
    return characterEndpoint.read?.data;
  }, [characterEndpoint.read?.data]);

  const isLoading = characterEndpoint.read?.isLoading ?? false;

  // Transform ownershipType and nullable fields for form compatibility
  // PATCH form only accepts "user" | "public", not "system"
  // PATCH form doesn't accept null values, convert to undefined
  const formDefaults = useMemo(() => {
    if (!characterData) {
      return undefined;
    }

    return {
      ...characterData,
      name: characterData.name ?? undefined,
      description: characterData.description ?? undefined,
      tagline: characterData.tagline ?? undefined,
      icon: characterData.icon ?? undefined,
      ownershipType:
        characterData.ownershipType ===
        "app.api.agent.chat.characters.enums.ownershipType.system"
          ? undefined
          : characterData.ownershipType,
    };
  }, [characterData]);

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
            {t("app.chat.editCharacter.title")}
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
        ) : isLoading || !characterData ? (
          <Div className="flex items-center justify-center p-8">
            <Span className="text-muted-foreground">
              {t("app.chat.selector.loading")}
            </Span>
          </Div>
        ) : (
          <EndpointsPage
            endpoint={updateCharacterEndpoint}
            locale={locale}
            user={user}
            endpointOptions={{
              urlPathParams: { id: characterId },
              create: {
                formOptions: {
                  defaultValues: formDefaults,
                },
                mutationOptions: {
                  onSuccess: () => {
                    handleCharacterEdited(characterId);
                    onBack();
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
