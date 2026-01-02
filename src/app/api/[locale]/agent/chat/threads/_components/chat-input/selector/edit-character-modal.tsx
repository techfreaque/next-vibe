"use client";

import Link from "next/link";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Span } from "next-vibe-ui/ui/span";
import React, { type JSX } from "react";

import {
  type CharacterUpdateRequestOutput,
  PATCH as updateCharacterEndpoint,
} from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import type { CharacterListResponseOutput } from "@/app/api/[locale]/agent/chat/characters/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

type CharacterFromResponse = CharacterListResponseOutput["characters"][number];

interface EditCharacterModalProps {
  onBack: () => void;
  onCharacterCreated: (characterId: string) => void;
  // Pre-fill data from existing character
  initialData: CharacterFromResponse;
  isAuthenticated: boolean;
  locale: CountryLanguage;
}

export function EditCharacterModal({
  onBack,
  onCharacterCreated,
  initialData,
  isAuthenticated,
  locale,
}: EditCharacterModalProps): JSX.Element {
  const { t } = simpleT(locale);

  const defaultValues = React.useMemo<Partial<CharacterUpdateRequestOutput>>(() => {
    // For PATCH (partial update), only include fields that we want to pre-fill
    // All fields are optional in PATCH endpoint
    const result: Partial<CharacterUpdateRequestOutput> = {};

    if (initialData.name) {
      result.name = initialData.name;
    }
    if (initialData.description) {
      result.description = initialData.description;
    }
    if (initialData.icon) {
      result.icon = initialData.icon;
    }
    if (initialData.systemPrompt) {
      result.systemPrompt = initialData.systemPrompt;
    }
    if (initialData.category) {
      result.category = initialData.category;
    }
    if (initialData.voice) {
      result.voice = initialData.voice;
    }
    if (initialData.suggestedPrompts) {
      result.suggestedPrompts = initialData.suggestedPrompts;
    }

    // Determine modelSelection based on available data
    if (initialData.preferredModel) {
      // Manual selection variant
      result.modelSelection = {
        selectionType: "manual",
        preferredModel: initialData.preferredModel,
      };
    } else if (
      initialData.requirements?.minIntelligence &&
      initialData.requirements?.maxPrice &&
      initialData.requirements?.minContent
    ) {
      // Filters variant - only if all required fields exist
      result.modelSelection = {
        selectionType: "filters",
        intelligence: initialData.requirements.minIntelligence,
        maxPrice: initialData.requirements.maxPrice,
        contentLevel: initialData.requirements.minContent,
      };
    }

    return result;
  }, [initialData]);

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
          <Span className="font-medium">{t("app.chat.editCharacter.title")}</Span>
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
            endpoint={{ PATCH: updateCharacterEndpoint }}
            locale={locale}
            endpointOptions={{
              urlPathParams: { id: initialData.id },
              create: {
                formOptions: {
                  defaultValues,
                },
                mutationOptions: {
                  onSuccess: () => {
                    onCharacterCreated(initialData.id);
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
