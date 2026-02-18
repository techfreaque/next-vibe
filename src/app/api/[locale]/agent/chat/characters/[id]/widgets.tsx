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
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
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
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  CharacterOwnershipType,
  type CharacterOwnershipTypeValue,
} from "../../characters/enum";
import { useChatFavorites } from "../../favorites/hooks";
import { useAddToFavorites } from "../../favorites/use-add-to-favorites";
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
  const locale = useWidgetLocale();
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
            size="icon"
            onClick={handleDelete}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            {/* {t("app.api.agent.chat.characters.id.patch.deleteButton.label")} */}
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
              modelSelection={form.watch("modelSelection") ?? undefined}
              onChange={(selection) =>
                form.setValue("modelSelection", selection)
              }
              t={t}
              locale={locale}
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
  const context = useWidgetContext();
  const { logger, user } = context;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const modelSelection = field.value?.modelSelection;
  const characterOwnership = field.value?.characterOwnership;
  const characterId = navigation?.current?.params?.urlPathParams?.id as
    | string
    | undefined;

  const { addToFavorites } = useAddToFavorites({
    characterId: characterId ?? "",
    logger,
    user,
    locale,
  });

  // Check if character is in favorites by fetching favorites list
  const { favorites } = useChatFavorites(logger);
  const isAddedToFav = favorites.some((fav) => fav.characterId === characterId);

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

  const isOwner = characterOwnership === CharacterOwnershipType.USER;

  // Shared content section (system prompt + model)
  const ContentSection = (
    <>
      {/* System Prompt Collapsible */}
      {(field.value?.systemPrompt || !field.value) && (
        <Collapsible open={systemPromptOpen} onOpenChange={setSystemPromptOpen}>
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
      <ModelSelector
        modelSelection={modelSelection}
        readOnly={true}
        t={t}
        locale={locale}
      />
    </>
  );

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{ icon: "arrow-left", variant: "outline" }}
        />
      </Div>

      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4 flex flex-col gap-4">
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
          isAddedToFav={isAddedToFav}
          addToFavorites={addToFavorites}
          characterId={characterId ?? ""}
          field={field}
          navigation={navigation}
          logger={logger}
          user={user}
          t={t}
          isOwner={isOwner}
          handleDelete={handleDelete}
        />
        {ContentSection}
      </Div>
    </Div>
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
  isAddedToFav?: boolean;
  addToFavorites: (e?: ButtonMouseEvent) => Promise<void>;
  characterId: string;
  field: { value: CharacterGetResponseOutput | null | undefined };
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  t: ReturnType<typeof useWidgetTranslation>;
  isOwner: boolean;
  handleDelete: (e?: ButtonMouseEvent) => void;
}

/**
 * Default Character Card - Standard layout with side icon
 * Used by: current, design A
 */
export function CharacterCard({
  icon,
  name,
  tagline,
  description,
  voice,
  characterOwnership,
  locale,
  isLoading = false,
  isAddedToFav = false,
  addToFavorites,
  characterId,
  field,
  navigation,
  logger,
  user,
  t,
  isOwner,
  handleDelete,
}: CharacterCardProps): React.JSX.Element {
  const IconComponent =
    ownershipIcon[characterOwnership] ??
    ownershipIcon[CharacterOwnershipType.SYSTEM];

  return (
    <Div
      className={cn(
        "rounded-lg border bg-card p-5",
        isAddedToFav && "border-l-4 border-l-primary bg-primary/5",
      )}
    >
      <Div className="flex gap-4 mb-4">
        <Div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-sm">
          {icon ? (
            <Icon icon={icon} className="w-7 h-7 text-primary" />
          ) : (
            <Skeleton className="h-7 w-7 rounded-full" />
          )}
        </Div>
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2 mb-1">
            <Span className="font-semibold text-lg">
              {name ? t(name) : <Skeleton className="h-7 w-48" />}
            </Span>
            {isAddedToFav && (
              <Star className="h-4 w-4 fill-primary text-primary" />
            )}
          </Div>
          <Div className="text-sm text-muted-foreground mb-2">
            {tagline ? t(tagline) : <Skeleton className="h-5 w-32" />}
          </Div>
          <Div className="text-sm text-muted-foreground/70 line-clamp-2">
            {description ? (
              t(description)
            ) : (
              <Skeleton className="h-10 w-full" />
            )}
          </Div>
        </Div>
      </Div>
      <Div className="flex items-center gap-3 pt-3 border-t">
        <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Volume2 className="w-3.5 h-3.5" />
          <Span>{voice ? t(voice) : <Skeleton className="h-4 w-16" />}</Span>
        </Div>
        {!isLoading && (
          <Div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ml-auto",
              characterOwnership === CharacterOwnershipType.USER
                ? "bg-primary/10 text-primary"
                : characterOwnership === CharacterOwnershipType.SYSTEM
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            )}
          >
            <IconComponent className="w-3 h-3" />
            <Span>{t(characterOwnership)}</Span>
          </Div>
        )}
      </Div>
      {!isLoading && (
        <Div className="mt-2 pt-2 border-t bg-muted/10 flex items-center gap-1 flex-wrap">
          {!isAddedToFav && (
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={addToFavorites}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {t("app.api.agent.chat.characters.id.get.quickAdd")}
            </Button>
          )}
          <CustomizeAndAddButton
            characterId={characterId}
            field={field}
            navigation={navigation}
            logger={logger}
            user={user}
            locale={locale}
            t={t}
            variant={isAddedToFav ? "default" : "outline"}
            size="sm"
          />
          {isOwner ? (
            <>
              <Div className="flex-1" />
              <EditCharacterButton
                characterId={characterId}
                navigation={navigation}
                t={t}
                isOwner={true}
                variant="outline"
                size="sm"
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                {t("app.api.agent.chat.characters.id.get.delete")}
              </Button>
            </>
          ) : (
            <>
              <Div className="flex-1" />
              <EditCharacterButton
                characterId={characterId}
                navigation={navigation}
                t={t}
                isOwner={false}
                variant="outline"
                size="sm"
              />
            </>
          )}
        </Div>
      )}
    </Div>
  );
}

/**
 * Customize & Add Button - navigates to create favorite form with character data
 * Used for "Customize before add" - goes to create favorite for customization
 * Used by "current" design only
 */
function CustomizeAndAddButton({
  characterId,
  field,
  navigation,
  logger,
  user,
  locale,
  t,
  variant = "outline",
  className = "",
  size = "sm",
  iconOnly = false,
}: {
  characterId: string;
  field: { value: CharacterGetResponseOutput | null | undefined };
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation>;
  variant?: "outline" | "default" | "ghost";
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
  iconOnly?: boolean;
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const characterSingleDefinitions = await import("./definition");
      const createFavoriteDefinitions =
        await import("../../favorites/create/definition");
      const editFavoriteDefinitions =
        await import("../../favorites/[id]/definition");
      const { DEFAULT_TTS_VOICE } =
        await import("../../../text-to-speech/enum");

      // Use field data if available, otherwise fetch
      let fullChar = field.value;

      if (!fullChar) {
        const cachedData = apiClient.getEndpointData(
          characterSingleDefinitions.default.GET,
          logger,
          { id: characterId },
        );
        if (cachedData?.success) {
          fullChar = cachedData.data;
        } else {
          const characterResponse = await apiClient.fetch(
            characterSingleDefinitions.default.GET,
            logger,
            user,
            undefined,
            { id: characterId },
            locale,
          );
          if (!characterResponse.success) {
            return;
          }
          fullChar = characterResponse.data;
        }
      }

      navigation.push(createFavoriteDefinitions.default.POST, {
        data: {
          characterId: characterId,
          icon: fullChar.icon ?? undefined,
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
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <Button
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        !iconOnly && "gap-1.5",
        size === "sm" && !iconOnly && "h-8 text-xs",
        iconOnly && "h-9 w-9",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <Plus className={iconSize} />
      )}
      {!iconOnly && t("app.api.agent.chat.characters.id.get.tweakAndAdd")}
    </Button>
  );
}

/**
 * Edit Character Button - navigates to character edit form (owner only)
 */
function EditCharacterButton({
  characterId,
  navigation,
  t,
  isOwner = true,
  variant = "outline",
  className = "",
  size = "sm",
  iconOnly = false,
}: {
  characterId: string;
  navigation: ReturnType<typeof useWidgetNavigation>;
  t: ReturnType<typeof useWidgetTranslation>;
  isOwner?: boolean;
  variant?: "outline" | "default" | "ghost";
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
  iconOnly?: boolean;
}): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: ButtonMouseEvent): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      const patchDefinition = await import("./definition");
      navigation.push(patchDefinition.default.PATCH, {
        urlPathParams: { id: characterId },
        popNavigationOnSuccess: 1,
        prefillFromGet: true,
        getEndpoint: patchDefinition.default.GET,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <Button
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        !iconOnly && "gap-1.5",
        size === "sm" && !iconOnly && "h-8 text-xs",
        iconOnly && "h-9 w-9",
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <Pencil className={iconSize} />
      )}
      {!iconOnly &&
        t(
          isOwner
            ? "app.api.agent.chat.characters.id.get.edit"
            : "app.api.agent.chat.characters.id.get.copyAndCustomize",
        )}
    </Button>
  );
}
