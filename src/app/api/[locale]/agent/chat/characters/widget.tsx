/**
 * Custom Widget for Characters List
 */

"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";

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

import { cn } from "../../../shared/utils";
import { useTourState } from "../_components/welcome-tour/tour-state-context";
import { useSelectorOnboardingContext } from "../threads/_components/chat-input/selector/selector-onboarding/context";
import characterDetailDefinitions from "./[id]/definition";
import { COMPANION_CHARACTERS } from "./config";
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
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const router = useRouter();
  const { isOnboarding, companionCharacterId } = useSelectorOnboardingContext();
  const setModelSelectorOpen = useTourState(
    (state) => state.setModelSelectorOpen,
  );

  // Get companion character name for onboarding banner
  const companionCharacter = companionCharacterId
    ? COMPANION_CHARACTERS.find((c) => c.id === companionCharacterId)
    : null;

  const handleCreateCustomClick = async (): Promise<void> => {
    if (isPublic) {
      // Show signup prompt for public users
      setShowSignupPrompt(true);
    } else {
      // Navigate to character create for authenticated users
      const createCharacterDefinitions = await import("./create/definition");
      navigate(createCharacterDefinitions.default.POST, {
        replaceOnSuccess: {
          endpoint: characterDetailDefinitions.GET,
          getUrlPathParams: (responseData) => ({ id: responseData.id }),
          prefillFromGet: true,
          getEndpoint: characterDetailDefinitions.GET,
        },
      });
    }
  };

  const handleSignup = (): void => {
    router.push(`/${locale}/user/signup`);
  };

  const handleLogin = (): void => {
    router.push(`/${locale}/user/login`);
  };

  // Show signup prompt if public user clicked create
  if (isPublic && showSignupPrompt) {
    return (
      <Div className="flex flex-col gap-0">
        {/* Top Actions: Back */}
        <Div className="flex flex-row gap-2 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setShowSignupPrompt(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("app.api.agent.chat.characters.get.signupPrompt.backButton")}
          </Button>
        </Div>

        {/* Signup Prompt */}
        <Div className="border-t border-border p-6 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
          <Div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <Div className="text-xl font-semibold">
              {t("app.api.agent.chat.characters.get.signupPrompt.title")}
            </Div>
            <Div className="text-muted-foreground">
              {t("app.api.agent.chat.characters.get.signupPrompt.description")}
            </Div>

            {/* CTA Buttons */}
            <Div className="flex flex-col gap-3 mt-4">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleSignup}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {t(
                  "app.api.agent.chat.characters.get.signupPrompt.signupButton",
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t(
                  "app.api.agent.chat.characters.get.signupPrompt.loginButton",
                )}
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  // Both public and authenticated users see the same character list
  return (
    <Div className="flex flex-col gap-0 max-h-[min(800px,calc(100dvh-100px))]">
      {/* Top Actions: Back + Create */}
      {!isOnboarding && (
        <Div className="flex flex-row gap-2 px-4 py-4 shrink-0">
          <NavigateButtonWidget field={children.backButton} />
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCreateCustomClick}
            className="ml-auto"
          >
            {t("app.api.agent.chat.characters.get.createButton.label")}
          </Button>
        </Div>
      )}

      {/* Scrollable Content */}
      <Div className="border-t border-border p-4 overflow-y-auto max-h-[min(800px,calc(100dvh-180px))]">
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
                        <AddToFavoritesButton
                          char={char}
                          logger={logger}
                          user={user}
                          locale={locale}
                        />
                        <EditFavBeforeAddButton
                          char={char}
                          navigate={navigate}
                          logger={logger}
                          user={user}
                          locale={locale}
                        />
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

/**
 * Edit Character Button - navigates to create favorite with character data
 * Isolated component for loading state
 */
function EditFavBeforeAddButton({
  char,
  navigate,
  logger,
  user,
  locale,
}: {
  char: CharacterListItem;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
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
        },
        popNavigationOnSuccess: 1,
      });
    } catch (error) {
      logger.error("Failed to edit character", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Add to Favorites Button - adds character to favorites
 * Isolated component for loading state
 */
function AddToFavoritesButton({
  char,
  logger,
  user,
  locale,
}: {
  char: CharacterListItem;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
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

      // Create the favorite
      const createResponse = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          characterId: char.id,
          icon: fullChar.icon,
          name: fullChar.name,
          tagline: fullChar.tagline,
          description: fullChar.description,
          voice: fullChar.voice,
          modelSelection: fullChar.modelSelection,
        },
        undefined,
        locale,
      );

      if (!createResponse.success) {
        logger.error("Failed to add to favorites");
        return;
      }

      // Optimistically update characters list to mark as added to favorites
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
                characters: section.characters.map((c) =>
                  c.id === char.id ? { ...c, addedToFav: true } : c,
                ),
              })),
            },
          };
        },
        undefined,
      );

      // Refetch favorites list to update the cache
      void apiClient.refetchEndpoint(favoritesDefinition.default.GET, logger);
    } catch (error) {
      logger.error("Failed to add to favorites", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
}
