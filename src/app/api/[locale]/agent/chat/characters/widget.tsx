/**
 * Custom Widget for Characters List
 */

"use client";

import { useRouter } from "next/navigation";
import { Badge } from "next-vibe-ui/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";
import { useMemo } from "react";

import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/components/model-credit-display";
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
import { Icon } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import { useTourState } from "../_components/welcome-tour/tour-state-context";
import { useChatFavorites } from "../favorites/hooks";
import { useAddToFavorites } from "../favorites/use-add-to-favorites";
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

  // Fetch favorites to calculate favoriteIds for each character
  const { favorites, activeFavoriteId } = useChatFavorites(logger);

  // Group favorites by character ID
  const favoritesByCharacter = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (favorites) {
      for (const fav of favorites) {
        if (!map[fav.characterId]) {
          map[fav.characterId] = [];
        }
        map[fav.characterId].push(fav.id);
      }
    }
    return map;
  }, [favorites]);

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

  // Loading state - show spinner that fills the scrollable area
  if (!field.value) {
    return (
      <Div className="flex flex-col gap-0 h-[min(800px,calc(100dvh-100px))]">
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

        {/* Loading Spinner - fills the scrollable space */}
        <Div className="border-t border-border flex-1 flex items-center justify-center min-h-0">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      </Div>
    );
  }

  // Both public and authenticated users see the same character list
  return (
    <Div className="flex flex-col gap-0 h-[min(800px,calc(100dvh-100px))]">
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
      <Div className="border-t border-border overflow-y-auto flex-1">
        <Div className="p-4">
          {/* Onboarding Success Banner */}
          {isOnboarding && companionCharacter && (
            <Div className="bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 rounded-lg px-4 py-4 mb-6 shadow-sm">
              <Div className="flex flex-col items-center text-center gap-3">
                <Div className="rounded-full bg-primary/20 p-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </Div>
                <Div className="flex flex-col gap-1">
                  <Div className="text-base font-semibold text-primary">
                    {t(
                      "app.api.agent.chat.characters.onboarding.success.title",
                      {
                        companion: t(companionCharacter.name),
                      },
                    )}
                  </Div>
                  <Div className="text-sm text-muted-foreground">
                    {t(
                      "app.api.agent.chat.characters.onboarding.success.subtitle",
                    )}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}
          {/* Direct Model Access Section */}
          <TextWidget field={children.title} fieldName="title" />
          <TextWidget field={children.description} fieldName="description" />

          {/* Direct Model Card - Optimized for narrow width */}
          <Div className="rounded-lg border border-primary/30 hover:border-primary/40 hover:shadow-md transition-colors mb-6 p-3">
            <Div className="flex flex-col gap-3">
              {/* Header: Icon + Name */}
              <Div className="flex items-center gap-2">
                <IconWidget field={children.icon} fieldName="icon" />
                <TextWidget field={children.name} fieldName="name" />
              </Div>

              {/* Description */}
              <TextWidget
                field={children.modelDescription}
                fieldName="modelDescription"
              />

              {/* Button - Full Width */}
              <NavigateButtonWidget field={children.selectButton} />
            </Div>
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

                {/* Characters with Show More */}
                {section.characters && section.characters.length > 0 && (
                  <CollapsibleCharacterSection
                    characters={section.characters}
                    idx={idx}
                    navigate={navigate}
                    logger={logger}
                    user={user}
                    locale={locale}
                    isTouch={isTouch}
                    t={t}
                    favoritesByCharacter={favoritesByCharacter}
                    activeFavoriteId={activeFavoriteId}
                  >
                    {children}
                  </CollapsibleCharacterSection>
                )}
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* Onboarding Sticky Bottom Section */}
      {isOnboarding && (
        <Div className="flex flex-row gap-2 px-4 py-4 shrink-0 border-t">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCreateCustomClick}
            className="ml-auto"
          >
            {t("app.api.agent.chat.characters.get.createButton.label")}
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              // Close the selector modal
              setModelSelectorOpen(false);
              logger.info("Onboarding complete");
            }}
          >
            {t("app.api.agent.chat.characters.onboarding.bottom.button")}
          </Button>
        </Div>
      )}
    </Div>
  );
}

/**
 * Collapsible Character Section Component
 *
 * Features:
 * - Shows first 3 characters by default
 * - Elegant "Show X more" button with smooth animation
 * - Gradient fade hint when collapsed
 * - Animated expand/collapse with height transition
 */
const INITIAL_VISIBLE_COUNT = 3;

function CollapsibleCharacterSection({
  characters,
  idx,
  children,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoritesByCharacter,
  activeFavoriteId,
}: {
  characters: CharacterListItem[];
  idx: number;
  children: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoritesByCharacter: Record<string, string[]>;
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalCount = characters.length;
  const hasMore = totalCount > INITIAL_VISIBLE_COUNT;
  const hiddenCount = totalCount - INITIAL_VISIBLE_COUNT;
  const visibleCharacters = isExpanded
    ? characters
    : characters.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <Div className="flex flex-col gap-3">
      {/* Character Cards */}
      <Div className="relative">
        <Div
          className={cn(
            "flex flex-col gap-3 transition-all duration-300 ease-out",
          )}
        >
          {visibleCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              char={char}
              idx={idx}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              isTouch={isTouch}
              t={t}
              favoriteIds={favoritesByCharacter[char.id] || []}
              activeFavoriteId={activeFavoriteId}
            >
              {children}
            </CharacterCard>
          ))}
        </Div>
      </Div>

      {/* Show More / Show Less Button */}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full h-9 gap-2 text-sm font-medium",
            "text-muted-foreground hover:text-foreground",
            "border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50",
            "rounded-lg transition-all duration-200",
            "hover:bg-muted/50",
            isExpanded && "-mt-1",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <Span>
                {t("app.api.agent.chat.characters.get.section.showLess")}
              </Span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <Span>
                {t("app.api.agent.chat.characters.get.section.showMore", {
                  count: String(hiddenCount),
                })}
              </Span>
            </>
          )}
        </Button>
      )}
    </Div>
  );
}

/**
 * Character Card Component
 *
 * Split Actions Bar design:
 * - Compact main content area (same as original height)
 * - Small action bar appears below on hover/touch
 * - Clear visual state with left border accent
 * - Actions slide in smoothly
 * - Status shown in action bar text
 */
function CharacterCard({
  char,
  idx,
  children,
  navigate,
  logger,
  user,
  locale,
  isTouch,
  t,
  favoriteIds,
  activeFavoriteId,
}: {
  char: CharacterListItem;
  idx: number;
  children: (typeof definition.GET)["fields"]["children"];
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  isTouch: boolean;
  t: ReturnType<typeof useWidgetTranslation>;
  favoriteIds: string[];
  activeFavoriteId: string | null;
}): React.JSX.Element {
  const isInCollection = favoriteIds.length > 0;
  const isActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);
  const [showActions, setShowActions] = useState(false);

  return (
    <Div
      key={char.id}
      className={cn(
        "group relative rounded-lg border overflow-hidden transition-all",
        isActive
          ? "border-l-4 border-l-primary border-primary/20 bg-primary/5"
          : isInCollection
            ? "border-l-2 border-l-primary/50 hover:shadow-sm"
            : "hover:shadow-sm",
      )}
      onMouseEnter={() => !isTouch && setShowActions(true)}
      onMouseLeave={() => !isTouch && setShowActions(false)}
    >
      {/* Main content - always visible, clickable */}
      <Div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() =>
          navigate(characterDetailDefinitions.GET, {
            urlPathParams: { id: char.id },
          })
        }
      >
        {/* Icon */}
        <Div className="flex-shrink-0 pt-0.5">
          <IconWidget
            field={withValue(
              children.sections.child.children.characters.child.children.icon,
              char.icon,
              char,
            )}
            fieldName={`sections.${idx}.characters.${char.id}.icon`}
          />
        </Div>

        {/* Content */}
        <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
          {/* Name + Tagline + Status badge */}
          <Div className="flex items-center gap-2 flex-wrap">
            <TextWidget
              field={withValue(
                children.sections.child.children.characters.child.children.name,
                char.name,
                char,
              )}
              fieldName={`sections.${idx}.characters.${char.id}.name`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.characters.child.children
                  .tagline,
                char.tagline,
                char,
              )}
              fieldName={`sections.${idx}.characters.${char.id}.tagline`}
            />
            {isInCollection && (
              <Div className="flex items-center gap-1 text-xs text-primary">
                <Star className={cn("h-3 w-3", isActive && "fill-primary")} />
              </Div>
            )}
          </Div>

          {/* Description */}
          <TextWidget
            field={withValue(
              children.sections.child.children.characters.child.children
                .description,
              char.description,
              char,
            )}
            fieldName={`sections.${idx}.characters.${char.id}.description`}
          />

          {/* Model info */}
          <Div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
            <IconWidget
              field={withValue(
                children.sections.child.children.characters.child.children
                  .modelIcon,
                char.modelIcon,
                char,
              )}
              fieldName={`sections.${idx}.characters.${char.id}.modelIcon`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.characters.child.children
                  .modelInfo,
                char.modelInfo,
                char,
              )}
              fieldName={`sections.${idx}.characters.${char.id}.modelInfo`}
            />
            <TextWidget
              field={
                children.sections.child.children.characters.child.children
                  .separator1
              }
              fieldName={`sections.${idx}.characters.${char.id}.separator1`}
            />
            <TextWidget
              field={withValue(
                children.sections.child.children.characters.child.children
                  .modelProvider,
                char.modelProvider,
                char,
              )}
              fieldName={`sections.${idx}.characters.${char.id}.modelProvider`}
            />
            <TextWidget
              field={
                children.sections.child.children.characters.child.children
                  .separator2
              }
              fieldName={`sections.${idx}.characters.${char.id}.separator2`}
            />
            <ModelCreditDisplay
              modelId={char.modelId}
              variant="text"
              className="text-xs text-muted-foreground"
              t={t}
              locale={locale}
            />
          </Div>
        </Div>

        {/* Touch device: show toggle button */}
        {isTouch && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showActions && "rotate-180",
              )}
            />
          </Button>
        )}
      </Div>

      {/* Action bar - slides in on hover/tap */}
      <Div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          showActions || isTouch ? "max-h-12" : "max-h-0",
          !isTouch && "group-hover:max-h-12",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-t min-h-[3rem]">
          {isInCollection ? (
            <CharacterFavoriteActions
              char={char}
              favoriteCount={favoriteIds.length}
              favoriteIds={favoriteIds}
              activeFavoriteId={activeFavoriteId}
              navigate={navigate}
              logger={logger}
              user={user}
              locale={locale}
              t={t}
            />
          ) : (
            <>
              <Div className="text-xs text-muted-foreground flex-shrink-0">
                {t(
                  "app.api.agent.chat.characters.get.card.actions.addToCollection",
                )}
              </Div>
              <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
                <AddToFavoritesButton
                  char={char}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="default"
                  className="h-7 gap-1.5 text-xs"
                  disabled={isInCollection}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {t("app.api.agent.chat.characters.get.card.actions.quick")}
                </AddToFavoritesButton>
                <EditFavBeforeAddButton
                  char={char}
                  navigate={navigate}
                  logger={logger}
                  user={user}
                  locale={locale}
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t(
                    "app.api.agent.chat.characters.get.card.actions.customize",
                  )}
                </EditFavBeforeAddButton>
              </Div>
            </>
          )}
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
  variant = "ghost",
  className = "",
  children,
}: {
  char: CharacterListItem;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  variant?: "ghost" | "outline" | "default";
  className?: string;
  children?: React.ReactNode;
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
      const editFavoriteDefinitions =
        await import("../favorites/[id]/definition");

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
        replaceOnSuccess: {
          endpoint: editFavoriteDefinitions.default.PATCH,
          getUrlPathParams: (responseData) => ({ id: responseData.id }),
          prefillFromGet: true,
          getEndpoint: editFavoriteDefinitions.default.GET,
        },
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
      variant={variant}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : children ? (
        children
      ) : (
        <Pencil className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Add to Favorites Button - adds character to favorites
 * Uses shared hook for consistent behavior across views
 */
function AddToFavoritesButton({
  char,
  logger,
  user,
  locale,
  variant = "ghost",
  className = "",
  children,
  disabled = false,
}: {
  char: CharacterListItem;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  variant?: "ghost" | "outline" | "default";
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}): React.JSX.Element {
  const { isLoading, addToFavorites } = useAddToFavorites({
    characterId: char.id,
    logger,
    user,
    locale,
  });

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={addToFavorites}
      disabled={isLoading || disabled}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : children ? (
        children
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * Character Favorite Actions - shows different UI based on how many favorites exist
 */
function CharacterFavoriteActions({
  char,
  favoriteCount,
  favoriteIds,
  activeFavoriteId,
  navigate,
  logger,
  user,
  locale,
  t,
}: {
  char: CharacterListItem;
  favoriteCount: number;
  favoriteIds: string[];
  activeFavoriteId: string | null;
  navigate: ReturnType<typeof useWidgetNavigation>["push"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: ReturnType<typeof useWidgetContext>["locale"];
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const [isActivating, setIsActivating] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isCurrentlyActive =
    activeFavoriteId !== null && favoriteIds.includes(activeFavoriteId);

  const handleActivateSingleFavorite = async (
    e: ButtonMouseEvent,
  ): Promise<void> => {
    e.stopPropagation();
    if (favoriteIds.length !== 1) {
      return;
    }

    setIsActivating(true);
    try {
      const { ChatSettingsRepositoryClient } =
        await import("../settings/repository-client");
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const favoritesDefinition = await import("../favorites/[id]/definition");

      // Fetch the favorite to get its data
      const favoriteResponse = await apiClient.fetch(
        favoritesDefinition.default.GET,
        logger,
        user,
        undefined,
        { id: favoriteIds[0] },
        locale,
      );

      if (!favoriteResponse.success) {
        logger.error("Failed to fetch favorite");
        return;
      }

      const favorite = favoriteResponse.data;

      // Determine the model to use
      let modelId = null;
      if (favorite.modelSelection) {
        const { CharactersRepositoryClient } =
          await import("./repository-client");
        const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
          favorite.modelSelection,
          undefined,
        );
        modelId = bestModel?.id || null;
      }

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: favoriteIds[0],
        modelId,
        characterId: char.id,
        voice: favorite.voice || null,
        logger,
        locale,
        user,
      });
    } catch (error) {
      logger.error("Failed to activate favorite", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleActivateFavorite = async (
    e: ButtonMouseEvent,
    favoriteId: string,
  ): Promise<void> => {
    e.stopPropagation();
    setIsActivating(true);
    setPopoverOpen(false);

    try {
      const { ChatSettingsRepositoryClient } =
        await import("../settings/repository-client");
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const favoritesDefinition = await import("../favorites/[id]/definition");

      // Fetch the favorite to get its data
      const favoriteResponse = await apiClient.fetch(
        favoritesDefinition.default.GET,
        logger,
        user,
        undefined,
        { id: favoriteId },
        locale,
      );

      if (!favoriteResponse.success) {
        logger.error("Failed to fetch favorite");
        return;
      }

      const favorite = favoriteResponse.data;

      // Determine the model to use
      let modelId = null;
      if (favorite.modelSelection) {
        const { CharactersRepositoryClient } =
          await import("./repository-client");
        const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
          favorite.modelSelection,
          undefined,
        );
        modelId = bestModel?.id || null;
      }

      // Activate this favorite
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId,
        modelId,
        characterId: char.id,
        voice: favorite.voice || null,
        logger,
        locale,
        user,
      });
    } catch (error) {
      logger.error("Failed to activate favorite", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleAddAnother = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const characterSingleDefinitions = await import("./[id]/definition");
    const createFavoriteDefinitions =
      await import("../favorites/create/definition");
    const { DEFAULT_TTS_VOICE } = await import("../../text-to-speech/enum");

    const cachedData = apiClient.getEndpointData(
      characterSingleDefinitions.default.GET,
      logger,
      { id: char.id },
    );
    let fullChar = cachedData?.success ? cachedData.data : undefined;

    if (!fullChar) {
      const characterResponse = await apiClient.fetch(
        characterSingleDefinitions.default.GET,
        logger,
        user,
        undefined,
        { id: char.id },
        locale,
      );
      if (!characterResponse.success) {
        return;
      }
      fullChar = characterResponse.data;
    }

    const editFavoriteDefinitions =
      await import("../favorites/[id]/definition");

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
      replaceOnSuccess: {
        endpoint: editFavoriteDefinitions.default.PATCH,
        getUrlPathParams: (responseData) => ({
          id: responseData.id,
        }),
        prefillFromGet: true,
        getEndpoint: editFavoriteDefinitions.default.GET,
      },
    });
  };

  if (favoriteCount === 1) {
    // Single favorite - show "Use Now" or "In Use" button
    return (
      <>
        <Div className="text-xs text-muted-foreground flex-shrink-0">
          {t("app.api.agent.chat.characters.get.card.actions.inCollection")}
        </Div>
        <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <Button
            variant={isCurrentlyActive ? "secondary" : "default"}
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleActivateSingleFavorite}
            disabled={isActivating || isCurrentlyActive}
          >
            {isActivating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isCurrentlyActive ? (
              <Star className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            {isCurrentlyActive
              ? t("app.api.agent.chat.characters.get.card.actions.inUse")
              : t("app.api.agent.chat.characters.get.card.actions.useNow")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={handleAddAnother}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("app.api.agent.chat.characters.get.card.actions.addAnother")}
          </Button>
        </Div>
      </>
    );
  }

  // Multiple favorites - show popover with list
  return (
    <>
      <Div className="text-xs text-muted-foreground flex-shrink-0">
        {t("app.api.agent.chat.characters.get.card.actions.inCollection")}
      </Div>
      <Div className="flex items-center gap-2 ml-auto flex-shrink-0">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpen(!popoverOpen);
              }}
            >
              <Star className="h-3.5 w-3.5" />
              {t(
                "app.api.agent.chat.characters.get.card.actions.chooseFavorite",
              )}{" "}
              ({favoriteCount})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <Div className="flex flex-col gap-2">
              <Div className="text-xs font-medium px-2 py-1 text-muted-foreground">
                {t(
                  "app.api.agent.chat.characters.get.card.actions.selectFavorite",
                )}
              </Div>
              <FavoritesList
                favoriteIds={favoriteIds}
                activeFavoriteId={activeFavoriteId}
                handleActivateFavorite={handleActivateFavorite}
                isActivating={isActivating}
                logger={logger}
                t={t}
                locale={locale}
              />
            </Div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleAddAnother}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("app.api.agent.chat.characters.get.card.actions.addAnother")}
        </Button>
      </Div>
    </>
  );
}

/**
 * Favorites List Component - displays favorite cards in popover
 */
function FavoritesList({
  favoriteIds,
  activeFavoriteId,
  handleActivateFavorite,
  isActivating,
  logger,
  t,
  locale,
}: {
  favoriteIds: string[];
  activeFavoriteId: string | null;
  handleActivateFavorite: (
    e: ButtonMouseEvent,
    favoriteId: string,
  ) => Promise<void>;
  isActivating: boolean;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  t: ReturnType<typeof useWidgetTranslation>;
  locale: ReturnType<typeof useWidgetContext>["locale"];
}): React.JSX.Element {
  const { favorites } = useChatFavorites(logger);

  // Get favorite cards for the IDs we have
  const favoriteCards = useMemo(() => {
    if (!favorites) {
      return [];
    }
    return favoriteIds
      .map((id) => favorites.find((fav) => fav.id === id))
      .filter((fav): fav is NonNullable<typeof fav> => fav !== undefined);
  }, [favorites, favoriteIds]);

  if (favoriteCards.length === 0) {
    return (
      <Div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <>
      {favoriteCards.map((fav) => {
        const isActive = fav.id === activeFavoriteId;
        return (
          <Div
            key={fav.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted cursor-pointer",
            )}
            onClick={(e) => {
              if (!isActive && !isActivating) {
                void handleActivateFavorite(
                  e as React.MouseEvent<HTMLButtonElement>,
                  fav.id,
                );
              }
            }}
          >
            <Icon icon={fav.icon} className="h-8 w-8 flex-shrink-0" />
            <Div className="flex-1 min-w-0 text-sm">
              <Div className="flex items-center gap-1.5 mb-0.5">
                <Span
                  className={cn(
                    "font-medium truncate",
                    isActive && "text-primary",
                  )}
                >
                  {t(fav.name)}
                </Span>
                <Badge variant="secondary">
                  {t(fav.voice || DEFAULT_TTS_VOICE)}
                </Badge>
              </Div>
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon icon={fav.modelIcon} className="h-3 w-3 flex-shrink-0" />
                <Span className="truncate">{t(fav.modelInfo)}</Span>
                {fav.modelId && (
                  <>
                    <Span>•</Span>
                    <ModelCreditDisplay
                      modelId={fav.modelId}
                      variant="text"
                      className="text-xs flex-shrink-0"
                      t={t}
                      locale={locale}
                    />
                  </>
                )}
              </Div>
            </Div>
            {isActivating ? (
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            ) : isActive ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
            ) : null}
          </Div>
        );
      })}
    </>
  );
}
