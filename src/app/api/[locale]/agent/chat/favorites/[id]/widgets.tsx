/**
 * Custom Widgets for Favorite Edit and View
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import { CompactTriggerEdit } from "@/app/api/[locale]/agent/chat/_shared/compact-trigger-widget";
import { NO_CHARACTER_ID } from "@/app/api/[locale]/agent/chat/characters/config";
import { ModelSelector } from "@/app/api/[locale]/agent/models/components/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type { ModelSelectionSimple } from "../../../models/components/types";
import { useCharacter } from "../../characters/[id]/hooks";
import { useChatSettings } from "../../settings/hooks";
import { ChatSettingsRepositoryClient } from "../../settings/repository-client";
import type definitionPatch from "./definition";
import type { FavoriteUpdateResponseOutput } from "./definition";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: FavoriteUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
  fieldName: string;
}

/**
 * Custom container widget for favorite editing
 */
export function FavoriteEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm();
  const t = useWidgetTranslation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const router = useRouter();
  const isSubmitting = useWidgetIsSubmitting();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const characterId = form?.watch("characterId");
  const isNoCharacter = characterId === NO_CHARACTER_ID;
  const isPublic = user.isPublic;

  const favoriteModelSelection: ModelSelectionSimple | undefined =
    form?.watch("modelSelection");

  const characterEndpoint = useCharacter(characterId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;

  // Get settings to check if this favorite is active
  const settingsOps = useChatSettings(user, logger);

  // Check if this favorite is currently active
  const favoriteId = form?.watch("id");
  const isActiveFavorite =
    settingsOps.settings?.activeFavoriteId === favoriteId;

  const handleCustomizeCharacter = async (): Promise<void> => {
    if (!characterId || isNoCharacter) {
      return;
    }

    // Check if user is logged in
    if (isPublic) {
      // Show signup prompt for public users
      setShowSignupPrompt(true);
    } else {
      // Navigate to character edit for authenticated users
      const characterDefinitions =
        await import("../../characters/[id]/definition");

      navigation.push(characterDefinitions.default.PATCH, {
        urlPathParams: { id: characterId },
        getEndpoint: characterDefinitions.default.GET,
        popNavigationOnSuccess: 1,
        prefillFromGet: true,
      });
    }
  };

  const handleSignup = (): void => {
    router.push(`/${locale}/user/signup`);
  };

  const handleLogin = (): void => {
    router.push(`/${locale}/user/login`);
  };

  const handleUseThisFavorite = async (): Promise<void> => {
    const favoriteId = navigation.current?.params?.urlPathParams?.id as
      | string
      | undefined;

    if (!favoriteId) {
      logger.error("Cannot activate favorite - missing favorite ID");
      return;
    }

    // Get modelId from the favorites list
    // We need to fetch it from the favorites list GET endpoint
    const { apiClient } =
      await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
    const favoritesDefinition = await import("../definition");

    const favoritesData = apiClient.getEndpointData(
      favoritesDefinition.default.GET,
      logger,
      undefined,
    );

    const favorite = favoritesData?.success
      ? favoritesData.data.favorites.find((fav) => fav.id === favoriteId)
      : undefined;

    const modelId = favorite?.modelId ?? null;
    const currentCharacterId = favorite?.characterId ?? null;
    const currentVoice = favorite?.voice ?? null;

    await ChatSettingsRepositoryClient.selectFavorite({
      favoriteId,
      modelId,
      characterId: currentCharacterId,
      voice: currentVoice,
      logger,
      locale,
      user,
    });
  };

  // Show signup prompt if public user clicked customize character
  if (isPublic && showSignupPrompt) {
    return (
      <Div className="flex flex-col gap-0">
        {/* Top Actions: Back */}
        <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setShowSignupPrompt(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("app.api.agent.chat.favorites.id.patch.signupPrompt.backButton")}
          </Button>
        </Div>

        {/* Signup Prompt */}
        <Div className="overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
          <Div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <Div className="text-xl font-semibold">
              {t("app.api.agent.chat.favorites.id.patch.signupPrompt.title")}
            </Div>
            <Div className="text-muted-foreground">
              {t(
                "app.api.agent.chat.favorites.id.patch.signupPrompt.description",
              )}
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
                  "app.api.agent.chat.favorites.id.patch.signupPrompt.signupButton",
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
                  "app.api.agent.chat.favorites.id.patch.signupPrompt.loginButton",
                )}
              </Button>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget
          field={{
            icon: "arrow-left",
            variant: "outline",
          }}
        />
        <NavigateButtonWidget
          field={{
            ...children.deleteButton,
            label: undefined,
          }}
        />
        {(form?.formState.isDirty || isSubmitting) && (
          <>
            <SubmitButtonWidget
              field={{
                text: "app.api.agent.chat.favorites.id.patch.saveButton.label",
                loadingText:
                  "app.api.agent.chat.favorites.id.patch.saveButton.loadingText",
                icon: "save",
                variant: "outline",
              }}
            />
            {!isActiveFavorite && (
              <SaveAndUseButton
                form={form}
                navigation={navigation}
                logger={logger}
                locale={locale}
                user={user}
                isSubmitting={isSubmitting}
                t={t}
              />
            )}
          </>
        )}
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        <FormAlertWidget field={{}} />

        <AlertWidget
          fieldName="success"
          field={withValue(children.success, field.value?.success, null)}
        />

        <Div className="flex flex-col gap-4">
          {/* Character Info Card with Editable Icon integrated */}
          {!isNoCharacter && (
            <Div className="flex flex-col gap-3">
              <Div className="flex items-start gap-4 p-6 rounded-xl border bg-card transition-colors">
                {/* Editable Icon Field in icon position */}
                <Div className="flex-shrink-0">
                  <IconFieldWidget fieldName="icon" field={children.icon} />
                </Div>

                {/* Character Content */}
                <Div className="flex-1 min-w-0 space-y-2">
                  <Div className="flex items-baseline gap-2 flex-wrap">
                    <Span className="text-lg font-semibold text-foreground">
                      {characterData?.name ? (
                        t(characterData.name)
                      ) : (
                        <Skeleton className="h-6 w-48" />
                      )}
                    </Span>
                    <Span className="text-sm text-muted-foreground">
                      {characterData?.tagline ? (
                        t(characterData.tagline)
                      ) : (
                        <Skeleton className="h-4 w-64" />
                      )}
                    </Span>
                  </Div>
                  <Div className="text-sm text-foreground/80">
                    {characterData?.description ? (
                      t(characterData.description)
                    ) : (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </>
                    )}
                  </Div>
                </Div>
              </Div>

              {/* Action Buttons */}
              <Div className="flex flex-col gap-2">
                {/* Customize Character Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={handleCustomizeCharacter}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {t(
                    "app.api.agent.chat.favorites.id.patch.customizeCharacterButton.label",
                  )}
                </Button>
              </Div>
            </Div>
          )}

          {/* Use This Favorite Button - always show */}
          <Button
            type="button"
            variant={isActiveFavorite ? "outline" : "default"}
            size="default"
            onClick={handleUseThisFavorite}
            disabled={isActiveFavorite}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {isActiveFavorite
              ? t(
                  "app.api.agent.chat.favorites.id.patch.currentlyActiveButton.label",
                )
              : isNoCharacter
                ? t(
                    "app.api.agent.chat.favorites.id.patch.useThisModelButton.label",
                  )
                : t(
                    "app.api.agent.chat.favorites.id.patch.useThisCharacterButton.label",
                  )}
          </Button>

          <SelectFieldWidget fieldName="voice" field={children.voice} />
          {form && (
            <ModelSelector
              modelSelection={favoriteModelSelection}
              onChange={(selection) =>
                form.setValue("modelSelection", selection, {
                  shouldDirty: true,
                })
              }
              characterModelSelection={
                isNoCharacter ? undefined : characterData?.modelSelection
              }
              t={t}
              locale={locale}
            />
          )}

          {/* Context Memory Budget — per-slot override */}
          {form && (
            <CompactTriggerEdit
              value={form.watch("compactTrigger") ?? null}
              onChange={(v) =>
                form.setValue("compactTrigger", v, { shouldDirty: true })
              }
              modelSelection={favoriteModelSelection ?? null}
              /* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */
              label="Override for this slot"
            />
          )}

          {/* Context Memory Budget — global fallback default */}
          <CompactTriggerEdit
            value={settingsOps.settings?.compactTrigger ?? null}
            onChange={(v) => {
              void settingsOps.setCompactTrigger(v);
            }}
            modelSelection={favoriteModelSelection ?? null}
            /* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */
            label="My default (fallback)"
          />
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Save & Use Button Component
 * Saves the form and then activates the favorite
 */
function SaveAndUseButton({
  form,
  navigation,
  logger,
  locale,
  user,
  isSubmitting,
  t,
}: {
  form: ReturnType<typeof useWidgetForm>;
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetLogger>;
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetUser>;
  isSubmitting: boolean | undefined;
  t: ReturnType<typeof useWidgetTranslation>;
}): JSX.Element {
  const [isActivating, setIsActivating] = useState(false);

  const handleSaveAndUse = async (): Promise<void> => {
    if (!form) {
      return;
    }

    // Trigger form validation
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    // Submit the form
    await form.handleSubmit(async () => {
      // After successful save, activate the favorite
      setIsActivating(true);
      try {
        const favoriteId = navigation?.current?.params?.urlPathParams?.id as
          | string
          | undefined;
        if (!favoriteId) {
          return;
        }

        // Get the saved favorite data
        const favoriteData = form.getValues();
        if (!favoriteData) {
          return;
        }

        // Determine the model to use
        let modelId = null;
        if (favoriteData.modelSelection) {
          const { CharactersRepositoryClient } =
            await import("../../characters/repository-client");
          const bestModel = CharactersRepositoryClient.getBestModelForFavorite(
            favoriteData.modelSelection,
            undefined,
          );
          modelId = bestModel?.id || null;
        }

        // Activate this favorite
        await ChatSettingsRepositoryClient.selectFavorite({
          favoriteId,
          modelId,
          characterId: favoriteData.characterId || null,
          voice: favoriteData.voice || null,
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
    })();
  };

  return (
    <Button
      type="button"
      variant="default"
      size="default"
      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={handleSaveAndUse}
      disabled={isSubmitting || isActivating}
    >
      {isSubmitting || isActivating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t(
            "app.api.agent.chat.favorites.id.patch.saveAndUseButton.loadingText",
          )}
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          {t("app.api.agent.chat.favorites.id.patch.saveAndUseButton.label")}
        </>
      )}
    </Button>
  );
}
