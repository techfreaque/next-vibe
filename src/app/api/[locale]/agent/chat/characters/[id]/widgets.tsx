/**
 * Custom Widgets for Character Edit and View
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { Sparkles, User, Users, Volume2 } from "next-vibe-ui/ui/icons";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { useState } from "react";

import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { cn } from "@/app/api/[locale]/shared/utils";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { MarkdownWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  CharacterOwnershipType,
  type CharacterOwnershipTypeValue,
} from "../../characters/enum";
import type definitionGet from "./definition";
import type definitionPatch from "./definition";
import type {
  CharacterGetResponseOutput,
  CharacterUpdateResponseOutput,
} from "./definition";
import { useCharacter } from "./hooks";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: CharacterUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
  fieldName: string;
}

/**
 * Props for GET custom widget
 */
interface GetWidgetProps {
  field: {
    value: CharacterGetResponseOutput | null | undefined;
  } & (typeof definitionGet.GET)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for character editing
 */
export function CharacterEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const form = useWidgetForm<typeof definitionPatch.PATCH>();
  const characterId = form.watch("id");
  const characterHook = useCharacter(characterId, user, logger);
  const characterOwnership = characterHook.read?.data?.characterOwnership;

  const handleDelete = async (): Promise<void> => {
    const characterId = form?.getValues("id");
    if (!characterId) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: characterId },
      renderInModal: true,
      popNavigationOnSuccess: 2,
    });
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button */}
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />

        {/* Delete Button - only show if user owns the character */}
        {characterOwnership === CharacterOwnershipType.USER && (
          <Button
            type="button"
            variant="destructive"
            size="default"
            onClick={handleDelete}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            {t("app.api.agent.chat.characters.id.patch.deleteButton.label")}
          </Button>
        )}

        {/* Submit Button */}
        <SubmitButtonWidget
          field={{
            text: "app.api.agent.chat.characters.id.patch.submitButton.label",
            loadingText:
              "app.api.agent.chat.characters.id.patch.submitButton.loadingText",
            icon: "save",
            variant: "primary",
            className:
              characterOwnership !== CharacterOwnershipType.USER
                ? "ml-auto"
                : undefined,
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {/* Form Alert */}
        <FormAlertWidget field={{}} />

        {/* Success message (response only) */}
        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info Card */}
          <IconFieldWidget fieldName="icon" field={children.icon} />
          <TextFieldWidget fieldName="name" field={children.name} />
          <TextFieldWidget fieldName="tagline" field={children.tagline} />
          <TextFieldWidget
            fieldName="description"
            field={children.description}
          />

          {/* Additional Fields */}
          <SelectFieldWidget fieldName="category" field={children.category} />
          <BooleanFieldWidget fieldName="isPublic" field={children.isPublic} />
          <SelectFieldWidget fieldName="voice" field={children.voice} />
          <TextareaFieldWidget
            fieldName="systemPrompt"
            field={children.systemPrompt}
          />
          {form && (
            <ModelSelector
              modelSelection={form.watch("modelSelection")}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Custom container widget for character viewing
 */
export function CharacterViewContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const modelSelection = field.value?.modelSelection;
  const characterOwnership = field.value?.characterOwnership;
  const characterId = navigation?.current?.params?.urlPathParams?.id as
    | string
    | undefined;

  const handleEdit = async (): Promise<void> => {
    if (!characterId) {
      return;
    }

    // If user owns the character, go to edit page
    if (characterOwnership === CharacterOwnershipType.USER) {
      const patchDefinition = await import("./definition");
      navigation.push(patchDefinition.default.PATCH, {
        urlPathParams: { id: characterId },
        popNavigationOnSuccess: 1,
        prefillFromGet: true,
        getEndpoint: patchDefinition.default.GET,
      });
    } else {
      // Navigate to create favorite (allowed for all users)
      const favoritesCreateDefinition =
        await import("../../favorites/create/definition");

      navigation.push(favoritesCreateDefinition.default.POST, {
        data: {
          characterId: characterId,
          icon: field.value?.icon,
          name: field.value?.name,
          tagline: field.value?.tagline,
          description: field.value?.description,
          voice: field.value?.voice,
          modelSelection: field.value?.modelSelection,
        },
        popNavigationOnSuccess: 1,
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!characterId) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: characterId },
      renderInModal: true,
      popNavigationOnSuccess: 2,
    });
  };

  const editButtonLabel =
    characterOwnership === CharacterOwnershipType.USER
      ? t("app.api.agent.chat.characters.id.get.editButton.label")
      : t("app.api.agent.chat.characters.id.get.customizeButton.label");

  const isLoading = !field.value;

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Edit, Delete */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button */}
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />

        {/* Only show action buttons after data has loaded */}
        {!isLoading && (
          <>
            {/* Add to Favorites Button - only show for system/public characters */}
            {characterOwnership !== CharacterOwnershipType.USER &&
              characterId && <AddToFavoritesButton characterId={characterId} />}

            {/* Edit/Customize Button */}
            <Button
              type="button"
              variant="outline"
              size="default"
              className={
                characterOwnership === CharacterOwnershipType.USER
                  ? "ml-auto"
                  : ""
              }
              onClick={handleEdit}
            >
              {editButtonLabel}
            </Button>

            {/* Delete Button - only show if user owns the character */}
            {characterOwnership === CharacterOwnershipType.USER && (
              <Button
                type="button"
                variant="destructive"
                size="default"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                {t("app.api.agent.chat.characters.id.get.deleteButton.label")}
              </Button>
            )}
          </>
        )}
      </Div>

      {/* Scrollable Content Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4 flex flex-col gap-4">
        {/* Character Info Card */}
        <CharacterCard
          icon={field.value?.icon ?? null}
          name={field.value?.name ?? null}
          tagline={field.value?.tagline ?? null}
          description={field.value?.description ?? null}
          voice={field.value?.voice ?? null}
          characterOwnership={
            characterOwnership ?? CharacterOwnershipType.SYSTEM
          }
          locale={locale}
          isLoading={!field.value}
        />

        {/* System Prompt Collapsible */}
        {(field.value?.systemPrompt || !field.value) && (
          <Collapsible
            open={systemPromptOpen}
            onOpenChange={setSystemPromptOpen}
          >
            <Div className="rounded-lg border">
              <CollapsibleTrigger asChild>
                <Div className="flex items-start gap-4 p-4 cursor-pointer hover:bg-accent transition-colors">
                  <Div className="flex-1 flex items-center justify-between">
                    <Div className="text-base font-bold">
                      {t(
                        "app.api.agent.chat.characters.id.get.systemPrompt.label",
                      )}
                    </Div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        systemPromptOpen && "rotate-180",
                      )}
                    />
                  </Div>
                </Div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Div className="px-4 pb-4">
                  <MarkdownWidget
                    fieldName="systemPrompt"
                    field={withValue(
                      children.systemPrompt,
                      field.value?.systemPrompt,
                      null,
                    )}
                  />
                </Div>
              </CollapsibleContent>
            </Div>
          </Collapsible>
        )}

        {/* Model Selection - View Only */}
        <ModelSelector modelSelection={modelSelection} readOnly={true} t={t} />
      </Div>
    </Div>
  );
}

/**
 * Add to Favorites Button - adds character to favorites
 * Isolated component for loading state
 */
function AddToFavoritesButton({
  characterId,
}: {
  characterId: string;
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const context = useWidgetContext();
  const { logger, user, locale } = context;
  const t = useWidgetTranslation();

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const createFavoriteDefinition =
        await import("../../favorites/create/definition");
      const characterSingleDefinitions = await import("./definition");
      const favoritesDefinition = await import("../../favorites/definition");
      const charactersDefinition = await import("../../characters/definition");
      const { ChatFavoritesRepositoryClient } =
        await import("../../favorites/repository-client");

      // Get character data from cache (should already be loaded)
      const characterData = apiClient.getEndpointData(
        characterSingleDefinitions.default.GET,
        logger,
        { id: characterId },
      );

      if (!characterData?.success) {
        logger.error("Character data not found in cache");
        return;
      }

      const fullChar = characterData.data;

      // Create the favorite
      const createResponse = await apiClient.mutate(
        createFavoriteDefinition.default.POST,
        logger,
        user,
        {
          characterId: characterId,
          icon: fullChar.icon,
          name: fullChar.name,
          tagline: fullChar.tagline,
          description: fullChar.description,
          voice: null,
          modelSelection: null,
        },
        undefined,
        locale,
      );

      if (!createResponse.success) {
        logger.error("Failed to add to favorites");
        return;
      }

      // Optimistically update favorites list
      const newFavoriteConfig = {
        id: createResponse.data.id,
        characterId: characterId,
        customIcon: null,
        voice: null,
        modelSelection: null,
        position: 0,
      };

      apiClient.updateEndpointData(
        favoritesDefinition.default.GET,
        logger,
        (oldData) => {
          if (!oldData?.success) {
            return oldData;
          }

          const newFavorite =
            ChatFavoritesRepositoryClient.computeFavoriteDisplayFields(
              newFavoriteConfig,
              fullChar.modelSelection,
              fullChar.icon,
              fullChar.name,
              fullChar.tagline,
              fullChar.description,
              null,
            );

          return {
            success: true,
            data: {
              favorites: [...oldData.data.favorites, newFavorite],
            },
          };
        },
        undefined,
      );

      // Optimistically update characters list
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
              ...oldData.data,
              sections: oldData.data.sections.map((section) => ({
                ...section,
                characters: section.characters.map((char) =>
                  char.id === characterId
                    ? { ...char, addedToFav: true }
                    : char,
                ),
              })),
            },
          };
        },
        undefined,
      );
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
      type="button"
      variant="outline"
      size="default"
      onClick={handleClick}
      disabled={isLoading}
      className="ml-auto gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className="h-4 w-4" />
      )}
      {t("app.api.agent.chat.characters.id.get.addToFavoritesButton.label")}
    </Button>
  );
}

const ownershipIcon = {
  [CharacterOwnershipType.USER]: User,
  [CharacterOwnershipType.SYSTEM]: Sparkles,
  [CharacterOwnershipType.PUBLIC]: Users,
};

interface CharacterCardProps {
  icon: IconKey | null;
  name: TranslationKey | string | null;
  tagline: TranslationKey | string | null;
  description: TranslationKey | string | null;
  voice: typeof TtsVoiceValue | null;
  characterOwnership: typeof CharacterOwnershipTypeValue;
  locale: CountryLanguage;
  isLoading?: boolean;
  className?: string;
}

export function CharacterCard({
  icon,
  name,
  tagline,
  description,
  voice,
  characterOwnership,
  locale,
  isLoading = false,
  className = "",
}: CharacterCardProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const IconComponent = ownershipIcon[characterOwnership];
  return (
    <Div
      className={`group relative rounded-lg border bg-gradient-to-br from-card to-card/50 hover:shadow-sm transition-all ${className}`}
    >
      <Div className="p-5">
        {/* Main Content */}
        <Div className="flex gap-4 mb-4">
          {/* Large Icon */}
          <Div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-sm">
            {icon ? (
              <Icon icon={icon} className="w-7 h-7 text-primary" />
            ) : (
              <Skeleton className="h-7 w-7 rounded-full" />
            )}
          </Div>

          {/* Text Content */}
          <Div className="flex-1 min-w-0">
            {/* Name and Tagline on same line */}
            <Div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <Span className="font-semibold text-lg text-foreground">
                {name ? t(name) : <Skeleton className="h-[1.75rem] w-48" />}
              </Span>
              <Span className="text-sm text-muted-foreground/80">
                {tagline ? t(tagline) : <Skeleton className="h-5 w-32" />}
              </Span>
            </Div>

            {/* Description */}
            <Div className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-3">
              {description ? (
                t(description)
              ) : (
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </>
              )}
            </Div>
          </Div>
        </Div>

        {/* Footer Metadata */}
        <Div className="flex items-center gap-3 pt-3 border-t border-border/50">
          {/* Voice */}
          <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Volume2 className="w-3.5 h-3.5" />
            <Span className="font-medium">
              {voice ? t(voice) : <Skeleton className="h-5 w-24" />}
            </Span>
          </Div>

          {!isLoading ? (
            <Div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ml-auto ${
                characterOwnership === CharacterOwnershipType.USER
                  ? "bg-primary/10 text-primary"
                  : characterOwnership === CharacterOwnershipType.SYSTEM
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
              }`}
            >
              <IconComponent className="w-3 h-3" />
              <Span>{t(characterOwnership)}</Span>
            </Div>
          ) : (
            <Skeleton className="h-6 w-32 ml-auto rounded-md" />
          )}
        </Div>
      </Div>
    </Div>
  );
}
