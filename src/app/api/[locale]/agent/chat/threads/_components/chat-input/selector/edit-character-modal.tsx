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

import { POST as createCharacterEndpoint } from "@/app/api/[locale]/agent/chat/characters/create/definition";
import type { CharacterListResponseOutput } from "@/app/api/[locale]/agent/chat/characters/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointsPage";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

type CharacterFromResponse = CharacterListResponseOutput["characters"][number];

interface EditCharacterModalProps {
  onBack: () => void;
  onCharacterCreated: (characterId: string) => void;
  // Pre-fill data from existing character
  initialData: Pick<
    CharacterFromResponse,
    | "name"
    | "description"
    | "icon"
    | "systemPrompt"
    | "category"
    | "preferredModel"
    | "voice"
  >;
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
        ) : (
          <EndpointsPage
            endpoint={{ POST: createCharacterEndpoint }}
            locale={locale}
            endpointOptions={{
              queryOptions: { enabled: false },
              create: {
                formOptions: {
                  defaultValues: {
                    name: initialData.name,
                    description: initialData.description,
                    icon: initialData.icon,
                    systemPrompt: initialData.systemPrompt,
                    category: initialData.category,
                    modelSelection: initialData.preferredModel
                      ? {
                          selectionType: "manual" as const,
                          preferredModel: initialData.preferredModel,
                        }
                      : undefined,
                    voice: initialData.voice,
                  },
                },
                mutationOptions: {
                  onSuccess: ({ responseData }) => {
                    if (responseData && "id" in responseData) {
                      onCharacterCreated(responseData.id as string);
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
