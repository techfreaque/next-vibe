/**
 * Custom Widget for Characters List
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Zap } from "next-vibe-ui/ui/icons/Zap";

import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import BadgeWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/badge/react";
import IconWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/icon/react";
import { SeparatorWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/separator/react";
import TextWidget from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/text/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { TranslationKey } from "@/i18n/core/static-types";

import { success } from "../../../shared/types/response.schema";
import { cn } from "../../../shared/utils";
import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { type ModelId, TOTAL_MODEL_COUNT } from "../../models/models";
import type { FavoritesListResponseOutput } from "../favorites/definition";
import characterDetailDefinitions from "./[id]/definition";
import type { CharacterListItem } from "./definition";
import type definition from "./definition";
import type { CharacterListResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: CharacterListResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for characters list
 */
export function CharactersListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { push: navigate } = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, locale, user } = context;
  const t = useWidgetTranslation();
  const isTouch = useTouchDevice();
  const isPublic = user.isPublic;

  const handleEditCharacter = async (
    char: CharacterListItem,
  ): Promise<void> => {
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const characterSingleDefinitions = await import("./[id]/definition");
    const createFavoriteDefinitions =
      await import("../favorites/create/definition");
    const { DEFAULT_TTS_VOICE } = await import("../../text-to-speech/enum");

    // Fetch full character data
    const characterResponse = await apiClient.fetch(
      characterSingleDefinitions.default.GET,
      logger,
      user,
      undefined,
      { id: char.id },
      locale,
    );

    if (!characterResponse.success) {
      logger.error("Failed to fetch character data");
      return;
    }

    const fullChar = characterResponse.data;

    // Navigate to create favorite with character data
    navigate(createFavoriteDefinitions.default.POST, {
      data: {
        characterId: char.id,
        icon: fullChar.icon,
        name: fullChar.name,
        tagline: fullChar.tagline,
        description: fullChar.description,
        voice: fullChar.voice ?? DEFAULT_TTS_VOICE,
        modelSelection: null,
        characterModelSelection: fullChar.modelSelection,
      },
    });
  };

  const handleAddToFavorites = async (char: {
    id: string;
    icon: string;
    modelId: ModelId;
    name: TranslationKey;
    tagline: TranslationKey;
    description: TranslationKey;
    modelIcon: IconKey;
    modelInfo: string;
    modelProvider: string;
    creditCost: string;
  }): Promise<void> => {
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const favoritesDefinition = await import("../favorites/definition");
    const createFavoriteDefinition =
      await import("../favorites/create/definition");
    const charactersDefinition = await import("./definition");
    const characterSingleDefinitions = await import("./[id]/definition");

    // Fetch full character data to get properly typed fields
    const characterResponse = await apiClient.fetch(
      characterSingleDefinitions.default.GET,
      logger,
      user,
      undefined,
      { id: char.id },
      locale,
    );

    if (!characterResponse.success) {
      logger.error("Failed to fetch character data");
      return;
    }

    const fullChar = characterResponse.data;

    // Optimistically update characters list addedToFav
    apiClient.updateEndpointData(
      charactersDefinition.default.GET,
      logger,
      (oldData) => {
        if (!oldData?.success) {
          return oldData;
        }

        return {
          success: true,
          data: {
            sections: oldData.data.sections.map((section) => ({
              ...section,
              characters: section.characters.map((character) =>
                character.id === char.id
                  ? {
                      ...character,
                      addedToFav: true,
                    }
                  : character,
              ),
            })),
          },
        };
      },
      undefined,
    );

    // Create favorite
    try {
      const response = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          characterId: char.id,
          icon: fullChar.icon,
          name: fullChar.name,
          tagline: fullChar.tagline,
          description: fullChar.description,
          voice: fullChar.voice ?? undefined,
          modelSelection: null,
          characterModelSelection: fullChar.modelSelection,
        },
        undefined,
        locale,
      );

      // Do optimistic update with real ID from server
      if (response.success) {
        apiClient.updateEndpointData(
          favoritesDefinition.default.GET,
          logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            const newFavorite: FavoritesListResponseOutput["favorites"][number] =
              {
                id: response.data.id,
                characterId: char.id,
                modelId: char.modelId,
                position: oldData.data.favorites.length,
                icon: fullChar.icon ?? char.modelIcon,
                name: fullChar.name ?? char.modelInfo,
                tagline: fullChar.tagline,
                activeBadge: null,
                description: fullChar.description,
                modelIcon: char.modelIcon,
                modelInfo: char.modelInfo,
                modelProvider: char.modelProvider,
                creditCost: char.creditCost,
              };

            return success<FavoritesListResponseOutput>({
              favorites: [...oldData.data.favorites, newFavorite],
            });
          },
          undefined,
        );
      }

      logger.info("Favorite created successfully");
    } catch (error) {
      logger.error("Failed to create favorite", {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      // Refetch to ensure consistency
      await apiClient.refetchEndpoint(favoritesDefinition.default.GET, logger);
      // Revert optimistic update on error
      await apiClient.refetchEndpoint(charactersDefinition.default.GET, logger);
    }
  };

  // Public user view - show marketing content
  if (isPublic) {
    const handleSignup = async (e: ButtonMouseEvent): Promise<void> => {
      e.stopPropagation();
      const signupDefinition =
        await import("../../../user/public/signup/definition");
      navigate(signupDefinition.default.POST, {});
    };

    const handleLogin = async (e: ButtonMouseEvent): Promise<void> => {
      e.stopPropagation();
      const loginDefinition =
        await import("../../../user/public/login/definition");
      navigate(loginDefinition.default.POST, {});
    };

    return (
      <Div className="flex flex-col gap-0">
        {/* Top Actions: Back only */}
        <Div className="flex flex-row gap-2 px-4 py-4">
          <NavigateButtonWidget field={children.backButton} />
        </Div>

        {/* Marketing Content */}
        <Div className="border-t border-border p-6 overflow-y-auto max-h-[calc(100dvh-180px)]">
          <Div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Hero Section */}
            <Div className="flex flex-col gap-3 text-center">
              <Div className="w-20 h-20 rounded-2xl flex items-center justify-center text-primary bg-primary/10 mx-auto">
                <Sparkles className="h-10 w-10" />
              </Div>
              <Div className="text-2xl font-bold">
                {t("app.api.agent.chat.characters.get.marketing.title")}
              </Div>
              <Div className="text-muted-foreground">
                {t("app.api.agent.chat.characters.get.marketing.description")}
              </Div>
            </Div>

            {/* Features Grid */}
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Div className="w-12 h-12 rounded-lg flex items-center justify-center text-primary bg-primary/10 shrink-0">
                  <Bot className="h-6 w-6" />
                </Div>
                <Div className="flex-1">
                  <Div className="font-semibold mb-1">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature1.title",
                    )}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature1.description",
                    )}
                  </Div>
                </Div>
              </Div>

              <Div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Div className="w-12 h-12 rounded-lg flex items-center justify-center text-primary bg-primary/10 shrink-0">
                  <Zap className="h-6 w-6" />
                </Div>
                <Div className="flex-1">
                  <Div className="font-semibold mb-1">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature2.title",
                    )}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature2.description",
                    )}
                  </Div>
                </Div>
              </Div>

              <Div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Div className="w-12 h-12 rounded-lg flex items-center justify-center text-primary bg-primary/10 shrink-0">
                  <Star className="h-6 w-6" />
                </Div>
                <Div className="flex-1">
                  <Div className="font-semibold mb-1">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature3.title",
                    )}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature3.description",
                    )}
                  </Div>
                </Div>
              </Div>

              <Div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Div className="w-12 h-12 rounded-lg flex items-center justify-center text-primary bg-primary/10 shrink-0">
                  <Globe className="h-6 w-6" />
                </Div>
                <Div className="flex-1">
                  <Div className="font-semibold mb-1">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature4.title",
                    )}{" "}
                    {TOTAL_MODEL_COUNT}
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature4.titleSuffix",
                    )}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.api.agent.chat.characters.get.marketing.feature4.description",
                    )}
                  </Div>
                </Div>
              </Div>
            </Div>

            {/* CTA Buttons */}
            <Div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={handleSignup}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t("app.api.agent.chat.characters.get.marketing.cta.signup")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t("app.api.agent.chat.characters.get.marketing.cta.login")}
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  // Authenticated user view
  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Create */}
      <Div className="flex flex-row gap-2 px-4 py-4">
        <NavigateButtonWidget field={children.backButton} />
        <NavigateButtonWidget field={children.createButton} />
      </Div>

      {/* Scrollable Content */}
      <Div className="border-t border-border p-4 overflow-y-auto max-h-[calc(100dvh-180px)]">
        {/* Direct Model Access Section */}
        <TextWidget field={children.title} fieldName="title" />
        <TextWidget field={children.description} fieldName="description" />

        {/* Direct Model Card */}
        <Div className="flex items-start gap-4 p-4 rounded-lg border border-primary/30 hover:border-primary/40 hover:shadow-md transition-colors mb-6">
          <IconWidget field={children.icon} fieldName="icon" />
          <Div className="flex-1 flex flex-col gap-1">
            <TextWidget field={children.name} fieldName="name" />
            <TextWidget
              field={children.modelDescription}
              fieldName="modelDescription"
            />
          </Div>
          <NavigateButtonWidget field={children.selectButton} />
        </Div>

        <SeparatorWidget field={children.separator} />

        {/* Characters Section */}
        <TextWidget
          field={children.charactersTitle}
          fieldName="charactersTitle"
        />
        <TextWidget
          field={children.charactersDesc}
          fieldName="charactersDesc"
        />

        {/* Sections */}
        <Div className="flex flex-col gap-6">
          {field.value?.sections?.map((section, idx) => (
            <Div key={idx} className="flex flex-col gap-4">
              {/* Section Header */}
              <Div className="flex items-center gap-2">
                <IconWidget
                  field={withValue(
                    children.sections.child.children.sectionIcon,
                    section.sectionIcon,
                    section,
                  )}
                  fieldName={`sections.${idx}.sectionIcon`}
                />
                <TextWidget
                  field={withValue(
                    children.sections.child.children.sectionTitle,
                    section.sectionTitle,
                    section,
                  )}
                  fieldName={`sections.${idx}.sectionTitle`}
                />
                <BadgeWidget
                  field={withValue(
                    children.sections.child.children.sectionCount,
                    section.sectionCount,
                    section,
                  )}
                  fieldName={`sections.${idx}.sectionCount`}
                />
              </Div>

              {/* Characters */}
              <Div className="flex flex-col gap-3">
                {section.characters?.map((char) => {
                  const isActive = char.addedToFav;
                  return (
                    <Div
                      key={char.id}
                      className={cn(
                        "group relative flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                        isActive
                          ? "bg-primary/5 border-primary/20"
                          : "hover:bg-accent",
                      )}
                      onClick={() =>
                        navigate(characterDetailDefinitions.GET, {
                          urlPathParams: { id: char.id },
                        })
                      }
                    >
                      <IconWidget
                        field={withValue(
                          children.sections.child.children.characters.child
                            .children.icon,
                          char.icon,
                          char,
                        )}
                        fieldName={`sections.${idx}.characters.${char.id}.icon`}
                      />
                      <Div className="flex-1 flex flex-col gap-1">
                        <Div className="inline-flex items-center gap-2 flex-wrap">
                          <TextWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.name,
                              char.name,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.name`}
                          />
                          <TextWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.tagline,
                              char.tagline,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.tagline`}
                          />
                        </Div>
                        <TextWidget
                          field={withValue(
                            children.sections.child.children.characters.child
                              .children.description,
                            char.description,
                            char,
                          )}
                          fieldName={`sections.${idx}.characters.${char.id}.description`}
                        />
                        <Div className="inline-flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                          <IconWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.modelIcon,
                              char.modelIcon,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.modelIcon`}
                          />
                          <TextWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.modelInfo,
                              char.modelInfo,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.modelInfo`}
                          />
                          <TextWidget
                            field={
                              children.sections.child.children.characters.child
                                .children.separator1
                            }
                            fieldName={`sections.${idx}.characters.${char.id}.separator1`}
                          />
                          <TextWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.modelProvider,
                              char.modelProvider,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.modelProvider`}
                          />
                          <TextWidget
                            field={
                              children.sections.child.children.characters.child
                                .children.separator2
                            }
                            fieldName={`sections.${idx}.characters.${char.id}.separator2`}
                          />
                          <TextWidget
                            field={withValue(
                              children.sections.child.children.characters.child
                                .children.creditCost,
                              char.creditCost,
                              char,
                            )}
                            fieldName={`sections.${idx}.characters.${char.id}.creditCost`}
                          />
                        </Div>
                      </Div>
                      <Div
                        className={cn(
                          "absolute top-1 right-1 flex gap-0.5",
                          isTouch
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 transition-opacity",
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleAddToFavorites(char);
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleEditCharacter(char);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Div>
                    </Div>
                  );
                })}
              </Div>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  );
}
