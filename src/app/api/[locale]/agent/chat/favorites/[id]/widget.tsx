/**
 * Custom Widgets for Favorite Edit and View
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
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
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { type ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  DEFAULT_CHAT_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import { getBestChatModel } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  getBestImageVisionModel,
  getBestVideoVisionModel,
  getBestAudioVisionModel,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { getBestChatModelForFavorite } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import { getBestImageGenModel } from "@/app/api/[locale]/agent/image-generation/models";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import { getBestSttModel } from "@/app/api/[locale]/agent/speech-to-text/models";
import { getBestTtsModel } from "@/app/api/[locale]/agent/text-to-speech/models";
import { getBestVideoGenModel } from "@/app/api/[locale]/agent/video-generation/models";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  chatManualModelSelectionSchema,
  chatModelSelectionSchema,
  type ChatModelSelection,
} from "../../../ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
  type AudioVisionModelSelection,
  type ImageVisionModelSelection,
  type VideoVisionModelSelection,
} from "../../../ai-stream/vision-models";
import {
  imageGenModelSelectionSchema,
  type ImageGenModelSelection,
} from "../../../image-generation/models";
import {
  musicGenModelSelectionSchema,
  type MusicGenModelSelection,
} from "../../../music-generation/models";
import {
  sttModelSelectionSchema,
  type SttModelSelection,
} from "../../../speech-to-text/models";
import {
  voiceModelSelectionSchema,
  type VoiceModelSelection,
} from "../../../text-to-speech/models";
import {
  videoGenModelSelectionSchema,
  type VideoGenModelSelection,
} from "../../../video-generation/models";
import {
  ToolsConfigEdit,
  type ToolEntry,
  type ToolsConfigValue,
} from "../../../tools/widget/tools-config-widget";

import { useChatSettings } from "../../settings/hooks";
import { ChatSettingsRepositoryClient } from "../../settings/repository-client";
import { CompactTriggerEdit } from "../../settings/widget";
import { useSkill } from "../../skills/[id]/hooks";
import { DEFAULT_SKILLS } from "../../skills/config";
import { ModelSelectionType } from "../../skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "../../skills/i18n";
import type { FavoriteUpdateResponseOutput } from "./definition";
import definitionPatch from "./definition";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: FavoriteUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
}

/**
 * Custom container widget for favorite editing
 */
export function FavoriteEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definitionPatch.PATCH>();
  const t = useWidgetTranslation<typeof definitionPatch.PATCH>();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();

  const navigation = useWidgetNavigation();
  const isSubmitting = useWidgetIsSubmitting();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const skillId = form.watch("skillId");
  const isNoSkill = skillId === NO_SKILL_ID;
  const isPublic = user.isPublic;

  const favoriteModelSelection: ChatModelSelection | undefined =
    form.watch("modelSelection") ?? undefined;

  const [activeSelector, setActiveSelector] = useState<
    | "chat"
    | "voice"
    | "imageGen"
    | "musicGen"
    | "videoGen"
    | "stt"
    | "imageVision"
    | "videoVision"
    | "audioVision"
    | null
  >(null);

  const voiceModelSelection = form.watch("voiceModelSelection");
  const imageGenModelSelection = form.watch("imageGenModelSelection");
  const musicGenModelSelection = form.watch("musicGenModelSelection");
  const videoGenModelSelection = form.watch("videoGenModelSelection");
  const sttModelSelection = form.watch("sttModelSelection");
  const imageVisionModelSelection = form.watch("imageVisionModelSelection");
  const videoVisionModelSelection = form.watch("videoVisionModelSelection");
  const audioVisionModelSelection = form.watch("audioVisionModelSelection");

  // characterModelSelection lives on the GET endpoint (not PATCH).
  // Use useEndpoint to read the cached GET response so we get the variant's selection.
  const favoriteId = form.watch("id");
  const favoriteGetEndpoint = useEndpoint(
    { GET: definitionPatch.GET },
    {
      read: {
        urlPathParams: { id: favoriteId ?? "" },
        queryOptions: { enabled: !!favoriteId, staleTime: 5 * 60 * 1000 },
      },
    },
    logger,
    user,
  );
  const favoriteCharacterModelSelection: ChatModelSelection | undefined =
    favoriteGetEndpoint.read?.data?.characterModelSelection ?? undefined;

  const variantId = favoriteGetEndpoint.read?.data?.variantId;
  const characterEndpoint = useSkill(skillId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;
  const characterVariant = variantId
    ? characterData?.variants?.find((v) => v.id === variantId)
    : characterData?.variants?.[0];
  const characterModelSelection = characterVariant?.modelSelection;

  // Get settings to check if this favorite is active
  const settingsOps = useChatSettings(user, logger);

  // Check if this favorite is currently active
  const isActiveFavorite =
    settingsOps.settings?.activeFavoriteId === favoriteId;

  // Stable props
  const emptyField = useMemo(() => ({}), []);

  const envAvailability = useEnvAvailability();

  // Platform-level default model selections (env-aware)
  const platformChatDefault = useMemo((): ChatModelSelection | undefined => {
    const m = getBestChatModel(
      DEFAULT_CHAT_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = chatModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformTtsDefault = useMemo((): VoiceModelSelection | undefined => {
    const m = getBestTtsModel(
      DEFAULT_TTS_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = voiceModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformImageGenDefault = useMemo(():
    | ImageGenModelSelection
    | undefined => {
    const m = getBestImageGenModel(
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = imageGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformMusicGenDefault = useMemo(():
    | MusicGenModelSelection
    | undefined => {
    const m = getBestMusicGenModel(
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = musicGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformVideoGenDefault = useMemo(():
    | VideoGenModelSelection
    | undefined => {
    const m = getBestVideoGenModel(
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = videoGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformSttDefault = useMemo((): SttModelSelection | undefined => {
    const m = getBestSttModel(
      DEFAULT_STT_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = sttModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformImageVisionDefault = useMemo(():
    | ImageVisionModelSelection
    | undefined => {
    const m = getBestImageVisionModel(
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = imageVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformVideoVisionDefault = useMemo(():
    | VideoVisionModelSelection
    | undefined => {
    const m = getBestVideoVisionModel(
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = videoVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const platformAudioVisionDefault = useMemo(():
    | AudioVisionModelSelection
    | undefined => {
    const m = getBestAudioVisionModel(
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const parsed = audioVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user, envAvailability]);

  const watchedAllowedTools = form.watch("availableTools") ?? null;
  const watchedPinnedTools = form.watch("pinnedTools") ?? null;
  const watchedDeniedTools = form.watch("deniedTools") ?? null;
  const watchedPromptAppend = form.watch("promptAppend") ?? "";

  const toolsValue = useMemo(
    () => ({
      availableTools: watchedAllowedTools,
      pinnedTools: watchedPinnedTools,
    }),
    [watchedAllowedTools, watchedPinnedTools],
  );

  const handleToolsChange = useCallback(
    ({ availableTools, pinnedTools }: ToolsConfigValue) => {
      form.setValue("availableTools", availableTools, { shouldDirty: true });
      form.setValue("pinnedTools", pinnedTools, { shouldDirty: true });
    },
    [form],
  );

  const handleDeniedToolsChange = useCallback(
    (denied: ToolEntry[] | null) => {
      form.setValue("deniedTools", denied, { shouldDirty: true });
    },
    [form],
  );

  const handlePromptAppendChange = useCallback(
    (value: string) => {
      form.setValue("promptAppend", value || null, { shouldDirty: true });
    },
    [form],
  );

  const handleCustomizeSkill = async (): Promise<void> => {
    if (!skillId || isNoSkill) {
      return;
    }

    // Check if user is logged in
    if (isPublic) {
      // Show signup prompt for public users
      setShowSignupPrompt(true);
    } else {
      // Navigate to character edit for authenticated users
      const characterDefinitions = await import("../../skills/[id]/definition");

      navigation.push(characterDefinitions.default.PATCH, {
        urlPathParams: { id: skillId },
        getEndpoint: characterDefinitions.default.GET,
        popNavigationOnSuccess: 1,
        prefillFromGet: true,
      });
    }
  };

  const handleSignup = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/signup/definition");
      navigation.push(def.default.POST);
    })();
  };

  const handleLogin = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/login/definition");
      navigation.push(def.default.POST);
    })();
  };

  const handleUseThisFavorite = async (): Promise<void> => {
    const activatingFavoriteId = navigation.current?.params?.urlPathParams?.id;

    if (!activatingFavoriteId) {
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
    );

    const favorite = favoritesData?.success
      ? favoritesData.data.favorites.find(
          (fav) => fav.id === activatingFavoriteId,
        )
      : undefined;

    const modelId = favorite?.modelId ?? null;
    const currentSkillId = favorite?.skillId ?? null;

    await ChatSettingsRepositoryClient.selectFavorite({
      favoriteId: activatingFavoriteId,
      modelId,
      skillId: currentSkillId,
      voiceId: favorite?.voiceId ?? null,
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
            {t("patch.signupPrompt.backButton")}
          </Button>
        </Div>

        {/* Signup Prompt */}
        <Div className="overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
          <Div className="max-w-md mx-auto flex flex-col gap-6 text-center">
            <Div className="text-xl font-semibold">
              {t("patch.signupPrompt.title")}
            </Div>
            <Div className="text-muted-foreground">
              {t("patch.signupPrompt.description")}
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
                {t("patch.signupPrompt.signupButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t("patch.signupPrompt.loginButton")}
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
        {activeSelector !== null ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setActiveSelector(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <NavigateButtonWidget field={children.backButton} />
        )}
        <NavigateButtonWidget
          field={{
            ...children.deleteButton,
            label: undefined,
          }}
        />
        {(form.formState.isDirty || isSubmitting) && (
          <>
            <SubmitButtonWidget<typeof definitionPatch.PATCH>
              field={children.saveButton}
            />
            {!isActiveFavorite && (
              <SaveAndUseButton
                form={form}
                navigation={navigation}
                logger={logger}
                locale={locale}
                user={user}
                envAvailability={envAvailability}
                isSubmitting={isSubmitting}
                t={t}
              />
            )}
          </>
        )}
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {activeSelector === "chat" && form ? (
          <ModelSelector
            modelSelection={favoriteModelSelection}
            onChange={(selection) => {
              const parsed = chatModelSelectionSchema
                .nullable()
                .safeParse(selection);
              form.setValue(
                "modelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = chatModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const charSel = isNoSkill
                ? undefined
                : (favoriteCharacterModelSelection ?? characterModelSelection);
              const isMatchingSkill =
                value !== null &&
                value.selectionType === ModelSelectionType.MANUAL &&
                charSel !== null &&
                charSel !== undefined &&
                charSel.selectionType === ModelSelectionType.MANUAL &&
                charSel.manualModelId === value.manualModelId;
              form.setValue("modelSelection", isMatchingSkill ? null : value, {
                shouldDirty: true,
              });
              setActiveSelector(null);
            }}
            characterModelSelection={
              isNoSkill
                ? undefined
                : (favoriteCharacterModelSelection ?? characterModelSelection)
            }
            locale={locale}
            user={user}
            chatOnly
          />
        ) : activeSelector === "voice" && form ? (
          <ModelSelector
            allowedRoles={["tts"]}
            modelSelection={voiceModelSelection ?? undefined}
            characterModelSelection={
              characterData?.voiceModelSelection ?? platformTtsDefault
            }
            onChange={(sel) => {
              const parsed = voiceModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "voiceModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = voiceModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformTtsDefault !== undefined &&
                "manualModelId" in platformTtsDefault &&
                platformTtsDefault.manualModelId === value.manualModelId;
              form.setValue("voiceModelSelection", isDefault ? null : value, {
                shouldDirty: true,
              });
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "imageGen" && form ? (
          <ModelSelector
            allowedRoles={["image-gen"]}
            modelSelection={imageGenModelSelection ?? undefined}
            characterModelSelection={
              characterData?.imageGenModelSelection ?? platformImageGenDefault
            }
            onChange={(sel) => {
              const parsed = imageGenModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "imageGenModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = imageGenModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformImageGenDefault !== undefined &&
                "manualModelId" in platformImageGenDefault &&
                platformImageGenDefault.manualModelId === value.manualModelId;
              form.setValue(
                "imageGenModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "musicGen" && form ? (
          <ModelSelector
            allowedRoles={["audio-gen"]}
            modelSelection={musicGenModelSelection ?? undefined}
            characterModelSelection={
              characterData?.musicGenModelSelection ?? platformMusicGenDefault
            }
            onChange={(sel) => {
              const parsed = musicGenModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "musicGenModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = musicGenModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformMusicGenDefault !== undefined &&
                "manualModelId" in platformMusicGenDefault &&
                platformMusicGenDefault.manualModelId === value.manualModelId;
              form.setValue(
                "musicGenModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "videoGen" && form ? (
          <ModelSelector
            allowedRoles={["video-gen"]}
            modelSelection={videoGenModelSelection ?? undefined}
            characterModelSelection={
              characterData?.videoGenModelSelection ?? platformVideoGenDefault
            }
            onChange={(sel) => {
              const parsed = videoGenModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "videoGenModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = videoGenModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformVideoGenDefault !== undefined &&
                "manualModelId" in platformVideoGenDefault &&
                platformVideoGenDefault.manualModelId === value.manualModelId;
              form.setValue(
                "videoGenModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "stt" && form ? (
          <ModelSelector
            allowedRoles={["stt"]}
            modelSelection={sttModelSelection ?? undefined}
            characterModelSelection={
              characterData?.sttModelSelection ?? platformSttDefault
            }
            onChange={(sel) => {
              const parsed = sttModelSelectionSchema.nullable().safeParse(sel);
              form.setValue(
                "sttModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = sttModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformSttDefault !== undefined &&
                "manualModelId" in platformSttDefault &&
                platformSttDefault.manualModelId === value.manualModelId;
              form.setValue("sttModelSelection", isDefault ? null : value, {
                shouldDirty: true,
              });
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "imageVision" && form ? (
          <ModelSelector
            allowedRoles={["image-vision"]}
            modelSelection={imageVisionModelSelection ?? undefined}
            characterModelSelection={
              characterData?.imageVisionModelSelection ??
              platformImageVisionDefault
            }
            onChange={(sel) => {
              const parsed = imageVisionModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "imageVisionModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = imageVisionModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformImageVisionDefault !== undefined &&
                "manualModelId" in platformImageVisionDefault &&
                platformImageVisionDefault.manualModelId ===
                  value.manualModelId;
              form.setValue(
                "imageVisionModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "videoVision" && form ? (
          <ModelSelector
            allowedRoles={["video-vision"]}
            modelSelection={videoVisionModelSelection ?? undefined}
            characterModelSelection={
              characterData?.videoVisionModelSelection ??
              platformVideoVisionDefault
            }
            onChange={(sel) => {
              const parsed = videoVisionModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "videoVisionModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = videoVisionModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformVideoVisionDefault !== undefined &&
                "manualModelId" in platformVideoVisionDefault &&
                platformVideoVisionDefault.manualModelId ===
                  value.manualModelId;
              form.setValue(
                "videoVisionModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "audioVision" && form ? (
          <ModelSelector
            allowedRoles={["audio-vision"]}
            modelSelection={audioVisionModelSelection ?? undefined}
            characterModelSelection={
              characterData?.audioVisionModelSelection ??
              platformAudioVisionDefault
            }
            onChange={(sel) => {
              const parsed = audioVisionModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "audioVisionModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = audioVisionModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformAudioVisionDefault !== undefined &&
                "manualModelId" in platformAudioVisionDefault &&
                platformAudioVisionDefault.manualModelId ===
                  value.manualModelId;
              form.setValue(
                "audioVisionModelSelection",
                isDefault ? null : value,
                { shouldDirty: true },
              );
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : (
          <>
            <FormAlertWidget field={emptyField} />

            <AlertWidget
              fieldName="success"
              field={withValue(children.success, field.value?.success, null)}
            />

            <Div className="flex flex-col gap-4">
              {/* Skill Info Card with Editable Icon integrated */}
              {!isNoSkill && (
                <Div className="flex flex-col gap-3">
                  <Div className="flex items-start gap-4 p-6 rounded-xl border bg-card transition-colors">
                    {/* Editable Icon Field in icon position */}
                    <Div className="flex-shrink-0">
                      <IconFieldWidget fieldName="icon" field={children.icon} />
                    </Div>

                    {/* Skill Content */}
                    <Div className="flex-1 min-w-0 space-y-2">
                      <Div className="flex items-baseline gap-2 flex-wrap">
                        <Span className="text-lg font-semibold text-foreground">
                          {characterData?.name ? (
                            characterData.name
                          ) : (
                            <Skeleton className="h-6 w-48" />
                          )}
                        </Span>
                        <Span className="text-sm text-muted-foreground">
                          {characterData?.tagline ? (
                            characterData.tagline
                          ) : (
                            <Skeleton className="h-4 w-64" />
                          )}
                        </Span>
                      </Div>
                      <Div className="text-sm text-foreground/80">
                        {characterData?.description ? (
                          characterData.description
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
                    {/* Customize Skill Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={handleCustomizeSkill}
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      {t("patch.customizeSkillButton.label")}
                    </Button>
                  </Div>
                </Div>
              )}

              {/* Variant Name */}
              {!isNoSkill && form && (
                <Div className="flex flex-col gap-1">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("patch.customVariantName.label")}
                  </Label>
                  <Input
                    value={form.watch("customVariantName") ?? ""}
                    onChange={(e) =>
                      form.setValue(
                        "customVariantName",
                        e.target.value || null,
                        { shouldDirty: true },
                      )
                    }
                    placeholder={
                      variantId
                        ? (() => {
                            const skill = DEFAULT_SKILLS.find(
                              (s) => s.id === skillId,
                            );
                            const variant = skill?.variants?.find(
                              (v) => v.id === variantId,
                            );
                            if (variant) {
                              return skillsScopedTranslation
                                .scopedT(locale)
                                .t(variant.variantName);
                            }
                            return "";
                          })()
                        : ""
                    }
                    className="h-8 text-sm"
                  />
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
                  ? t("patch.currentlyActiveButton.label")
                  : isNoSkill
                    ? t("patch.useThisModelButton.label")
                    : t("patch.useThisSkillButton.label")}
              </Button>

              {/* Chat Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.chatModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={favoriteModelSelection ?? null}
                    characterModelSelection={
                      isNoSkill
                        ? undefined
                        : (favoriteCharacterModelSelection ??
                          characterModelSelection)
                    }
                    defaultModelSelection={platformChatDefault}
                    placeholder={t("patch.chatModel.placeholder")}
                    onClick={() => setActiveSelector("chat")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Voice Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.voice.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={voiceModelSelection ?? null}
                    characterModelSelection={
                      characterData?.voiceModelSelection ?? platformTtsDefault
                    }
                    allowedRoles={["tts"]}
                    defaultModelSelection={platformTtsDefault}
                    placeholder={t("patch.voice.placeholder")}
                    onClick={() => setActiveSelector("voice")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Image Generation Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.imageGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={imageGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.imageGenModelSelection ??
                      platformImageGenDefault
                    }
                    allowedRoles={["image-gen"]}
                    defaultModelSelection={platformImageGenDefault}
                    placeholder={t("patch.imageGenModel.placeholder")}
                    onClick={() => setActiveSelector("imageGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Music Generation Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.musicGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={musicGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.musicGenModelSelection ??
                      platformMusicGenDefault
                    }
                    allowedRoles={["audio-gen"]}
                    defaultModelSelection={platformMusicGenDefault}
                    placeholder={t("patch.musicGenModel.placeholder")}
                    onClick={() => setActiveSelector("musicGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Video Generation Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.videoGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={videoGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.videoGenModelSelection ??
                      platformVideoGenDefault
                    }
                    allowedRoles={["video-gen"]}
                    defaultModelSelection={platformVideoGenDefault}
                    placeholder={t("patch.videoGenModel.placeholder")}
                    onClick={() => setActiveSelector("videoGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* STT Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.sttModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={sttModelSelection ?? null}
                    characterModelSelection={
                      characterData?.sttModelSelection ?? platformSttDefault
                    }
                    allowedRoles={["stt"]}
                    defaultModelSelection={platformSttDefault}
                    placeholder={t("patch.sttModel.placeholder")}
                    onClick={() => setActiveSelector("stt")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Image Vision Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.imageVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={imageVisionModelSelection ?? null}
                    characterModelSelection={
                      characterData?.imageVisionModelSelection ??
                      platformImageVisionDefault
                    }
                    allowedRoles={["image-vision"]}
                    defaultModelSelection={platformImageVisionDefault}
                    placeholder={t("patch.imageVisionModel.placeholder")}
                    onClick={() => setActiveSelector("imageVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Video Vision Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.videoVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={videoVisionModelSelection ?? null}
                    characterModelSelection={
                      characterData?.videoVisionModelSelection ??
                      platformVideoVisionDefault
                    }
                    allowedRoles={["video-vision"]}
                    defaultModelSelection={platformVideoVisionDefault}
                    placeholder={t("patch.videoVisionModel.placeholder")}
                    onClick={() => setActiveSelector("videoVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Audio Vision Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.audioVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={audioVisionModelSelection ?? null}
                    characterModelSelection={
                      characterData?.audioVisionModelSelection ??
                      platformAudioVisionDefault
                    }
                    allowedRoles={["audio-vision"]}
                    defaultModelSelection={platformAudioVisionDefault}
                    placeholder={t("patch.audioVisionModel.placeholder")}
                    onClick={() => setActiveSelector("audioVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Context Memory Budget - per-slot override */}
              {form && (
                <CompactTriggerEdit
                  value={form.watch("compactTrigger") ?? null}
                  onChange={(v) =>
                    form.setValue("compactTrigger", v, { shouldDirty: true })
                  }
                  modelSelection={favoriteModelSelection ?? null}
                  characterModelSelection={
                    favoriteCharacterModelSelection ??
                    characterModelSelection ??
                    null
                  }
                  label={t("patch.slotOverride.label")}
                  user={user}
                />
              )}

              {/* Tool configuration - per-slot override */}
              {form && (
                <ToolsConfigEdit
                  value={toolsValue}
                  onChange={handleToolsChange}
                  user={user}
                  logger={logger}
                  label={t("patch.slotOverride.label")}
                  skillAvailableTools={characterData?.availableTools ?? null}
                  skillPinnedTools={characterData?.pinnedTools ?? null}
                />
              )}

              {/* Denied tools - block specific tools for this slot */}
              {form && (
                <DeniedToolsEdit
                  value={watchedDeniedTools}
                  onChange={handleDeniedToolsChange}
                  user={user}
                  logger={logger}
                  label={t("patch.deniedTools.label")}
                  description={t("patch.deniedTools.description")}
                  t={t}
                />
              )}

              {/* Prompt append - extra instructions for this slot */}
              {form && (
                <Div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    {t("patch.promptAppend.label")}
                  </Label>
                  <Span className="text-xs text-muted-foreground">
                    {t("patch.promptAppend.description")}
                  </Span>
                  <Textarea
                    value={watchedPromptAppend ?? ""}
                    onChange={(e) => handlePromptAppendChange(e.target.value)}
                    placeholder={t("patch.promptAppend.placeholder")}
                    minRows={3}
                    maxRows={10}
                  />
                </Div>
              )}
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}

// ─── Denied Tools Edit ────────────────────────────────────────────────────────

function DeniedToolsEdit({
  value,
  onChange,
  user,
  logger,
  label,
  description,
  t,
}: {
  value: ToolEntry[] | null;
  onChange: (denied: ToolEntry[] | null) => void;
  user: ReturnType<typeof useWidgetUser>;
  logger: ReturnType<typeof useWidgetLogger>;
  t: ReturnType<typeof useWidgetTranslation>;
  label: string;
  description: string;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const helpEndpoint = useEndpoint(
    helpDefinitions,
    {
      read: {
        queryOptions: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    },
    logger,
    user,
  );

  const availableTools = useMemo(
    () => helpEndpoint.read?.data?.tools ?? [],
    [helpEndpoint.read?.data],
  );

  const deniedSet = useMemo(
    () => new Set((value ?? []).map((entry) => entry.toolId)),
    [value],
  );

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return availableTools;
    }
    const q = searchQuery.toLowerCase();
    return availableTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.aliases?.some((a) => a.toLowerCase().includes(q)),
    );
  }, [availableTools, searchQuery]);

  const handleToggle = (toolId: string): void => {
    if (deniedSet.has(toolId)) {
      const next = (value ?? []).filter((entry) => entry.toolId !== toolId);
      onChange(next.length === 0 ? null : next);
    } else {
      onChange([...(value ?? []), { toolId, requiresConfirmation: false }]);
    }
  };

  const handleReset = (): void => {
    onChange(null);
  };

  const deniedCount = value?.length ?? 0;

  return (
    <Div className="rounded-xl border bg-card flex flex-col">
      <Div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/30 transition-colors rounded-xl"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <X className="h-4 w-4 text-destructive flex-shrink-0" />
        <Div className="flex-1 flex flex-col gap-0.5">
          <Span className="text-sm font-semibold">{label}</Span>
          {!isExpanded && (
            <Span className="text-xs text-muted-foreground">{description}</Span>
          )}
        </Div>
        {deniedCount > 0 && (
          <Span className="text-xs text-destructive font-medium">
            {deniedCount} blocked
          </Span>
        )}
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Div>

      {isExpanded && (
        <Div className="border-t flex flex-col gap-3 p-4">
          <Div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("patch.deniedTools.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            {deniedCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                {t("patch.deniedTools.clearAll")}
              </Button>
            )}
          </Div>

          <Div className="flex flex-col divide-y border rounded-lg overflow-y-auto max-h-[30dvh]">
            {filteredTools.length === 0 ? (
              <Div className="px-3 py-4 text-sm text-muted-foreground text-center">
                {t("patch.deniedTools.noToolsFound")}
              </Div>
            ) : (
              filteredTools.map((tool) => {
                const toolId = tool.id ?? "";
                const isDenied = deniedSet.has(toolId);
                return (
                  <Div
                    key={toolId}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent/20 cursor-pointer transition-colors"
                    onClick={() => handleToggle(toolId)}
                  >
                    <Div className="flex-1 min-w-0">
                      <Span className="text-xs font-medium block truncate">
                        {tool.title || tool.aliases?.[0] || tool.id}
                      </Span>
                      <Span className="text-[10px] text-muted-foreground block truncate">
                        {tool.description}
                      </Span>
                    </Div>
                    {isDenied && (
                      <Span className="text-[10px] text-destructive font-medium shrink-0">
                        {t("patch.deniedTools.blocked")}
                      </Span>
                    )}
                  </Div>
                );
              })
            )}
          </Div>

          <Span className="text-[10px] text-muted-foreground">
            {t("patch.deniedTools.blockedNote")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
/* eslint-enable oxlint-plugin-i18n/no-literal-string */

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
  envAvailability,
  isSubmitting,
  t,
}: {
  form: ReturnType<typeof useWidgetForm>;
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetLogger>;
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetUser>;
  envAvailability: ReturnType<typeof useEnvAvailability>;
  isSubmitting: boolean | undefined;
  t: ReturnType<typeof useWidgetTranslation<typeof definitionPatch.PATCH>>;
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
        let modelId: ChatModelId | null = null;
        if (favoriteData.modelSelection) {
          const bestModel = getBestChatModelForFavorite(
            favoriteData.modelSelection,
            undefined,
            user,
            envAvailability,
          );
          const parsed = chatManualModelSelectionSchema.safeParse({
            selectionType: ModelSelectionType.MANUAL,
            manualModelId: bestModel?.id,
          });
          modelId = parsed.success ? parsed.data.manualModelId : null;
        }

        // Activate this favorite
        await ChatSettingsRepositoryClient.selectFavorite({
          favoriteId,
          modelId,
          skillId: favoriteData.skillId || null,
          voiceId: favoriteData.voiceId ?? null,
          logger,
          locale,
          user,
        });

        // Pop navigation like the regular save button does
        const popCount = navigation?.current?.popNavigationOnSuccess ?? 0;
        for (let i = 0; i < popCount; i++) {
          navigation.pop();
        }
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
          {t("patch.saveAndUseButton.loadingText")}
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          {t("patch.saveAndUseButton.label")}
        </>
      )}
    </Button>
  );
}
