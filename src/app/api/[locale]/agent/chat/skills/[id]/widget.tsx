/**
 * Custom Widgets for Skill Edit and View
 */

"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe-ui/ui/collapsible";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { User } from "next-vibe-ui/ui/icons/User";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useMemo, useState } from "react";

import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { getBestChatModel } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  getBestImageVisionModel,
  getBestVideoVisionModel,
  getBestAudioVisionModel,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { getBestImageGenModel } from "@/app/api/[locale]/agent/image-generation/models";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import { getBestSttModel } from "@/app/api/[locale]/agent/speech-to-text/models";
import { getBestTtsModel } from "@/app/api/[locale]/agent/text-to-speech/models";
import { getBestVideoGenModel } from "@/app/api/[locale]/agent/video-generation/models";
import {
  DEFAULT_CHAT_MODEL_SELECTION,
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import {
  chatModelSelectionSchema,
  type ChatModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
  type AudioVisionModelSelection,
  type ImageVisionModelSelection,
  type VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import {
  imageGenModelSelectionSchema,
  type ImageGenModelSelection,
} from "@/app/api/[locale]/agent/image-generation/models";
import {
  musicGenModelSelectionSchema,
  type MusicGenModelSelection,
} from "@/app/api/[locale]/agent/music-generation/models";
import {
  sttModelSelectionSchema,
  type SttModelSelection,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import {
  voiceModelSelectionSchema,
  type VoiceModelSelection,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import {
  videoGenModelSelectionSchema,
  type VideoGenModelSelection,
} from "@/app/api/[locale]/agent/video-generation/models";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import { ttsModelOptions } from "@/app/api/[locale]/agent/text-to-speech/models";
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
import {
  ToolsConfigEdit,
  type ToolsConfigValue,
} from "../../../tools/widget/tools-config-widget";
import { useAddToFavorites } from "../../favorites/create/hooks";
import { useChatFavorites } from "../../favorites/hooks/hooks";
import { CompactTriggerEdit } from "../../settings/widget";
import {
  ModelSelectionType,
  SkillOwnershipType,
  type SkillOwnershipTypeValue,
} from "../../skills/enum";
import type {
  default as definitionGet,
  default as definitionPatch,
  SkillGetResponseOutput,
  SkillUpdateResponseOutput,
} from "./definition";
import { useSkill } from "./hooks";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: {
    value: SkillUpdateResponseOutput | null | undefined;
  } & (typeof definitionPatch.PATCH)["fields"];
}

/**
 * Props for GET custom widget
 */
interface GetWidgetProps {
  field: {
    value: SkillGetResponseOutput | null | undefined;
  } & (typeof definitionGet.GET)["fields"];
}

/**
 * Custom container widget for skill editing
 */
export function SkillEditContainer({
  field,
}: PatchWidgetProps): React.JSX.Element {
  const children = field.children;
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof definitionPatch.PATCH>();
  const form = useWidgetForm<typeof definitionPatch.PATCH>();
  const skillId = form.watch("id");
  const skillHook = useSkill(skillId, user, logger);
  const skillOwnership = skillHook.read?.data?.skillOwnership;

  const envAvailability = useEnvAvailability();

  // Single active selector state replaces 5 separate open/close states
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

  // Stable props
  const emptyField = useMemo(() => ({}), []);

  const watchedAllowedTools = form.watch("availableTools") ?? null;
  const watchedPinnedTools = form.watch("pinnedTools") ?? null;

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

  const handleDelete = async (): Promise<void> => {
    const skillIdToDelete = form.getValues("id");
    if (!skillIdToDelete) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: skillIdToDelete },
      renderInModal: true,
      popNavigationOnSuccess: 2,
    });
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back, Delete, Submit */}
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        {/* Back Button - returns to selector when a model selector is open */}
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

        {/* Delete Button - only show if user owns the skill */}
        {skillOwnership === SkillOwnershipType.USER && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {/* Submit Button */}
        <SubmitButtonWidget<typeof definitionPatch.PATCH>
          field={{
            ...children.submitButton,
            className:
              skillOwnership !== SkillOwnershipType.USER
                ? "ml-auto"
                : undefined,
          }}
        />
      </Div>

      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {activeSelector === "chat" ? (
          <ModelSelector
            modelSelection={form.watch("modelSelection") ?? undefined}
            onChange={(sel) => {
              const parsed = chatModelSelectionSchema.nullable().safeParse(sel);
              form.setValue(
                "modelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
              );
            }}
            onSelect={() => setActiveSelector(null)}
            locale={locale}
            user={user}
            chatOnly
          />
        ) : activeSelector === "voice" ? (
          <ModelSelector
            allowedRoles={["tts"]}
            modelSelection={form.watch("voiceModelSelection") ?? undefined}
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
        ) : activeSelector === "imageGen" ? (
          <ModelSelector
            allowedRoles={["image-gen"]}
            modelSelection={form.watch("imageGenModelSelection") ?? undefined}
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
        ) : activeSelector === "musicGen" ? (
          <ModelSelector
            allowedRoles={["audio-gen"]}
            modelSelection={form.watch("musicGenModelSelection") ?? undefined}
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
        ) : activeSelector === "videoGen" ? (
          <ModelSelector
            allowedRoles={["video-gen"]}
            modelSelection={form.watch("videoGenModelSelection") ?? undefined}
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
        ) : activeSelector === "stt" ? (
          <ModelSelector
            allowedRoles={["stt"]}
            modelSelection={form.watch("sttModelSelection") ?? undefined}
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
        ) : activeSelector === "imageVision" ? (
          <ModelSelector
            allowedRoles={["image-vision"]}
            modelSelection={
              form.watch("imageVisionModelSelection") ?? undefined
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
        ) : activeSelector === "videoVision" ? (
          <ModelSelector
            allowedRoles={["video-vision"]}
            modelSelection={
              form.watch("videoVisionModelSelection") ?? undefined
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
        ) : activeSelector === "audioVision" ? (
          <ModelSelector
            allowedRoles={["audio-vision"]}
            modelSelection={
              form.watch("audioVisionModelSelection") ?? undefined
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
            {/* Form Alert */}
            <FormAlertWidget field={emptyField} />

            {/* Success message (response only) */}
            <AlertWidget
              fieldName="success"
              field={withValue(children.success, field.value?.success, null)}
            />

            <Div className="flex flex-col gap-4">
              {/* Skill Info Card */}
              <IconFieldWidget fieldName="icon" field={children.icon} />
              <TextFieldWidget fieldName="name" field={children.name} />
              <TextFieldWidget fieldName="tagline" field={children.tagline} />
              <TextFieldWidget
                fieldName="description"
                field={children.description}
              />

              {/* Additional Fields */}
              <SelectFieldWidget
                fieldName="category"
                field={children.category}
              />
              <BooleanFieldWidget
                fieldName="isPublic"
                field={children.isPublic}
              />
              {/* voiceModelSelection, imageGenModelSelection, musicGenModelSelection are JSONB fields managed via ModelSelector, not rendered as text inputs */}
              <TextareaFieldWidget
                fieldName="systemPrompt"
                field={children.systemPrompt}
              />

              {/* Chat model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.chatModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("modelSelection") ?? undefined}
                    defaultModelSelection={platformChatDefault}
                    placeholder={t("patch.chatModel.placeholder")}
                    onClick={() => setActiveSelector("chat")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Voice (TTS) model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.voice.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("voiceModelSelection")}
                    allowedRoles={["tts"]}
                    defaultModelSelection={platformTtsDefault}
                    placeholder={t("patch.voice.placeholder")}
                    onClick={() => setActiveSelector("voice")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Image Generation model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.imageGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("imageGenModelSelection")}
                    allowedRoles={["image-gen"]}
                    defaultModelSelection={platformImageGenDefault}
                    placeholder={t("patch.imageGenModel.placeholder")}
                    onClick={() => setActiveSelector("imageGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Music Generation model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.musicGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("musicGenModelSelection")}
                    allowedRoles={["audio-gen"]}
                    defaultModelSelection={platformMusicGenDefault}
                    placeholder={t("patch.musicGenModel.placeholder")}
                    onClick={() => setActiveSelector("musicGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Video Generation model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.videoGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("videoGenModelSelection")}
                    allowedRoles={["video-gen"]}
                    defaultModelSelection={platformVideoGenDefault}
                    placeholder={t("patch.videoGenModel.placeholder")}
                    onClick={() => setActiveSelector("videoGen")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* STT model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.sttModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("sttModelSelection")}
                    allowedRoles={["stt"]}
                    defaultModelSelection={platformSttDefault}
                    placeholder={t("patch.sttModel.placeholder")}
                    onClick={() => setActiveSelector("stt")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Image Vision model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.imageVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("imageVisionModelSelection")}
                    allowedRoles={["image-vision"]}
                    defaultModelSelection={platformImageVisionDefault}
                    placeholder={t("patch.imageVisionModel.placeholder")}
                    onClick={() => setActiveSelector("imageVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Video Vision model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.videoVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("videoVisionModelSelection")}
                    allowedRoles={["video-vision"]}
                    defaultModelSelection={platformVideoVisionDefault}
                    placeholder={t("patch.videoVisionModel.placeholder")}
                    onClick={() => setActiveSelector("videoVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Audio Vision model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.audioVisionModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("audioVisionModelSelection")}
                    allowedRoles={["audio-vision"]}
                    defaultModelSelection={platformAudioVisionDefault}
                    placeholder={t("patch.audioVisionModel.placeholder")}
                    onClick={() => setActiveSelector("audioVision")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Context Memory Budget */}
              {form && (
                <CompactTriggerEdit
                  value={form.watch("compactTrigger") ?? null}
                  onChange={(v) =>
                    form.setValue("compactTrigger", v, { shouldDirty: true })
                  }
                  modelSelection={form.watch("modelSelection") ?? null}
                  user={user}
                />
              )}

              {/* Tool configuration - per-skill override */}
              {form && (
                <ToolsConfigEdit
                  value={toolsValue}
                  onChange={handleToolsChange}
                  user={user}
                  logger={logger}
                />
              )}
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}

function useViewDefaults(): {
  chat: ChatModelSelection | undefined;
  tts: VoiceModelSelection | undefined;
  imageGen: ImageGenModelSelection | undefined;
  musicGen: MusicGenModelSelection | undefined;
  videoGen: VideoGenModelSelection | undefined;
  stt: SttModelSelection | undefined;
  imageVision: ImageVisionModelSelection | undefined;
  videoVision: VideoVisionModelSelection | undefined;
  audioVision: AudioVisionModelSelection | undefined;
} {
  const env = useEnvAvailability();
  const user = useWidgetUser();
  return useMemo(() => {
    const mkChat = (): ChatModelSelection | undefined => {
      const m = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user, env);
      if (!m) {
        return undefined;
      }
      const p = chatModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkVoice = (): VoiceModelSelection | undefined => {
      const m = getBestTtsModel(DEFAULT_TTS_MODEL_SELECTION, user, env);
      if (!m) {
        return undefined;
      }
      const p = voiceModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkImageGen = (): ImageGenModelSelection | undefined => {
      const m = getBestImageGenModel(
        DEFAULT_IMAGE_GEN_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = imageGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkMusicGen = (): MusicGenModelSelection | undefined => {
      const m = getBestMusicGenModel(
        DEFAULT_MUSIC_GEN_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = musicGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkVideoGen = (): VideoGenModelSelection | undefined => {
      const m = getBestVideoGenModel(
        DEFAULT_VIDEO_GEN_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = videoGenModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkStt = (): SttModelSelection | undefined => {
      const m = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, user, env);
      if (!m) {
        return undefined;
      }
      const p = sttModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkImageVision = (): ImageVisionModelSelection | undefined => {
      const m = getBestImageVisionModel(
        DEFAULT_IMAGE_VISION_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = imageVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkVideoVision = (): VideoVisionModelSelection | undefined => {
      const m = getBestVideoVisionModel(
        DEFAULT_VIDEO_VISION_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = videoVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkAudioVision = (): AudioVisionModelSelection | undefined => {
      const m = getBestAudioVisionModel(
        DEFAULT_AUDIO_VISION_MODEL_SELECTION,
        user,
        env,
      );
      if (!m) {
        return undefined;
      }
      const p = audioVisionModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    return {
      chat: mkChat(),
      tts: mkVoice(),
      imageGen: mkImageGen(),
      musicGen: mkMusicGen(),
      videoGen: mkVideoGen(),
      stt: mkStt(),
      imageVision: mkImageVision(),
      videoVision: mkVideoVision(),
      audioVision: mkAudioVision(),
    };
  }, [user, env]);
}

export function SkillViewContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const [systemPromptOpen, setSystemPromptOpen] = useState(false);
  const navigation = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, user } = context;
  const locale = useWidgetLocale();
  const viewDefaults = useViewDefaults();
  const t = useWidgetTranslation<typeof definitionGet.GET>();
  const variants = field.value?.variants;
  const defaultVariant = variants?.find((v) => v.isDefault) ?? variants?.[0];
  const modelSelection = defaultVariant?.modelSelection;
  const skillOwnership = field.value?.skillOwnership;
  const skillId = navigation?.current?.params?.urlPathParams?.id as
    | string
    | undefined;

  const skillData = field.value;
  const { addToFavorites } = useAddToFavorites({
    skillId: skillId ?? "",
    logger,
    user,
    locale,
    characterData:
      skillId && skillData
        ? {
            id: skillId,
            icon: skillData.icon ?? null,
            name: skillData.name ?? null,
            tagline: skillData.tagline ?? null,
            description: skillData.description ?? null,
            voiceModelSelection: skillData.voiceModelSelection ?? null,
            modelSelection: modelSelection ?? null,
          }
        : undefined,
  });

  // Check if skill is in favorites by fetching favorites list
  const { favorites } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });
  const isAddedToFav = favorites.some((fav) => fav.skillId === skillId);

  const handleDelete = async (): Promise<void> => {
    if (!skillId) {
      return;
    }

    const deleteDefinition = await import("./definition");
    navigation.push(deleteDefinition.default.DELETE, {
      urlPathParams: { id: skillId },
      renderInModal: true,
      popNavigationOnSuccess: 2,
    });
  };

  const isOwner = skillOwnership === SkillOwnershipType.USER;

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
                    {t("get.systemPrompt.label")}
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

      {/* Chat Model - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.chatModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={modelSelection ?? undefined}
          defaultModelSelection={viewDefaults.chat}
          placeholder={t("patch.chatModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Voice (TTS) - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.voice.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.voiceModelSelection ?? undefined}
          allowedRoles={["tts"]}
          defaultModelSelection={viewDefaults.tts}
          placeholder={t("patch.voice.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Image Generation - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.imageGenModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.imageGenModelSelection ?? undefined}
          allowedRoles={["image-gen"]}
          defaultModelSelection={viewDefaults.imageGen}
          placeholder={t("patch.imageGenModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Music Generation - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.musicGenModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.musicGenModelSelection ?? undefined}
          allowedRoles={["audio-gen"]}
          defaultModelSelection={viewDefaults.musicGen}
          placeholder={t("patch.musicGenModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Video Generation - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.videoGenModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.videoGenModelSelection ?? undefined}
          allowedRoles={["video-gen"]}
          defaultModelSelection={viewDefaults.videoGen}
          placeholder={t("patch.videoGenModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* STT - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.sttModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.sttModelSelection ?? undefined}
          allowedRoles={["stt"]}
          defaultModelSelection={viewDefaults.stt}
          placeholder={t("patch.sttModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Image Vision - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.imageVisionModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.imageVisionModelSelection ?? undefined}
          allowedRoles={["image-vision"]}
          defaultModelSelection={viewDefaults.imageVision}
          placeholder={t("patch.imageVisionModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Video Vision - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.videoVisionModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.videoVisionModelSelection ?? undefined}
          allowedRoles={["video-vision"]}
          defaultModelSelection={viewDefaults.videoVision}
          placeholder={t("patch.videoVisionModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>

      {/* Audio Vision - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.audioVisionModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.audioVisionModelSelection ?? undefined}
          allowedRoles={["audio-vision"]}
          defaultModelSelection={viewDefaults.audioVision}
          placeholder={t("patch.audioVisionModel.placeholder")}
          locale={locale}
          user={user}
        />
      </Div>
    </>
  );

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-4">
        <NavigateButtonWidget field={children.backButton} />
      </Div>

      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4 flex flex-col gap-4">
        <SkillCard
          icon={field.value?.icon ?? null}
          name={field.value?.name ?? null}
          tagline={field.value?.tagline ?? null}
          description={field.value?.description ?? null}
          voiceModelSelection={field.value?.voiceModelSelection ?? null}
          skillOwnership={skillOwnership ?? SkillOwnershipType.SYSTEM}
          locale={locale}
          isLoading={!field.value}
          isAddedToFav={isAddedToFav}
          addToFavorites={addToFavorites}
          skillId={skillId ?? ""}
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
  [SkillOwnershipType.USER]: User,
  [SkillOwnershipType.SYSTEM]: Sparkles,
  [SkillOwnershipType.PUBLIC]: Users,
};

function VoiceDisplayName({
  voiceModelSelection,
  t,
}: {
  voiceModelSelection: SkillGetResponseOutput["voiceModelSelection"];
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const resolved = useMemo(() => {
    if (!voiceModelSelection) {
      return null;
    }
    if ("manualModelId" in voiceModelSelection) {
      return (
        ttsModelOptions.find(
          (m) => m.id === voiceModelSelection.manualModelId,
        ) ?? null
      );
    }
    return null;
  }, [voiceModelSelection]);
  if (!voiceModelSelection) {
    return (
      <Span className="text-muted-foreground/60">
        {t("get.voiceModelSelection.systemDefault")}
      </Span>
    );
  }
  return (
    <Span>
      {resolved?.name ??
        ("manualModelId" in voiceModelSelection
          ? String(voiceModelSelection.manualModelId)
          : "Custom voice")}
    </Span>
  );
}

interface SkillCardProps {
  icon: IconKey | null;
  name: string | null;
  tagline: string | null;
  description: string | null;
  voiceModelSelection: SkillGetResponseOutput["voiceModelSelection"];
  skillOwnership: typeof SkillOwnershipTypeValue;
  locale: CountryLanguage;
  isLoading?: boolean;
  isAddedToFav?: boolean;
  addToFavorites: (e?: ButtonMouseEvent) => Promise<void>;
  skillId: string;
  field: { value: SkillGetResponseOutput | null | undefined };
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  t: ReturnType<typeof useWidgetTranslation>;
  isOwner: boolean;
  handleDelete: (e?: ButtonMouseEvent) => void;
}

/**
 * Default Skill Card - Standard layout with side icon
 * Used by: current, design A
 */
export function SkillCard({
  icon,
  name,
  tagline,
  description,
  voiceModelSelection,
  skillOwnership,
  locale,
  isLoading = false,
  isAddedToFav = false,
  addToFavorites,
  skillId,
  field,
  navigation,
  logger,
  user,
  t,
  isOwner,
  handleDelete,
}: SkillCardProps): React.JSX.Element {
  const IconComponent =
    ownershipIcon[skillOwnership] ?? ownershipIcon[SkillOwnershipType.SYSTEM];

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
              {name ? name : <Skeleton className="h-7 w-48" />}
            </Span>
            {isAddedToFav && (
              <Star className="h-4 w-4 fill-primary text-primary" />
            )}
          </Div>
          <Div className="text-sm text-muted-foreground mb-2">
            {tagline ? tagline : <Skeleton className="h-5 w-32" />}
          </Div>
          <Div className="text-sm text-muted-foreground/70 line-clamp-2">
            {description ? description : <Skeleton className="h-10 w-full" />}
          </Div>
        </Div>
      </Div>
      <Div className="flex items-center gap-3 pt-3 border-t">
        <Div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Volume2 className="w-3.5 h-3.5" />
          <VoiceDisplayName voiceModelSelection={voiceModelSelection} t={t} />
        </Div>
        {!isLoading && (
          <Div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ml-auto",
              skillOwnership === SkillOwnershipType.USER
                ? "bg-primary/10 text-primary"
                : skillOwnership === SkillOwnershipType.SYSTEM
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            )}
          >
            <IconComponent className="w-3 h-3" />
            <Span>{t(skillOwnership)}</Span>
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
              {t("get.quickAdd")}
            </Button>
          )}
          <CustomizeAndAddButton
            skillId={skillId}
            field={field}
            navigation={navigation}
            logger={logger}
            user={user}
            locale={locale}
            t={t}
            variant={isAddedToFav ? "default" : "outline"}
            size="sm"
          />
          <ShareEarnButton
            skillId={skillId}
            locale={locale}
            t={t}
            user={user}
            logger={logger}
          />
          {isOwner ? (
            <>
              <Div className="flex-1" />
              <EditSkillButton
                skillId={skillId}
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
                {t("get.delete")}
              </Button>
            </>
          ) : (
            <>
              <Div className="flex-1" />
              <EditSkillButton
                skillId={skillId}
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
 * Share & Earn Button - generates referral-linked skill share URL
 * Fetches user's referral codes, lets them pick one (or create one inline),
 * then generates a trackable share link to the skill landing page.
 */
function ShareEarnButton({
  skillId,
  locale,
  t,
  user,
  logger,
}: {
  skillId: string;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation>;
  user: ReturnType<typeof useWidgetContext>["user"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState<Array<{
    code: string;
    label: string | null;
  }> | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [newCode, setNewCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (): Promise<void> => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);

    if (codes !== null) {
      return;
    }

    setLoading(true);
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const codesListDef =
        await import("@/app/api/[locale]/referral/codes/list/definition");
      const result = await apiClient.fetch(
        codesListDef.default.GET,
        logger,
        user,
        {},
        undefined,
        locale,
      );
      if (result.success) {
        const fetchedCodes = result.data.codes.map((c) => ({
          code: c.code,
          label: c.label,
        }));
        setCodes(fetchedCodes);
        if (fetchedCodes.length > 0 && fetchedCodes[0]) {
          setSelectedCode(fetchedCodes[0].code);
        }
      } else {
        setCodes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (): Promise<void> => {
    if (!newCode.trim() || newCode.trim().length < 3) {
      return;
    }
    setCreating(true);
    try {
      const { apiClient } =
        await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
      const referralDef =
        await import("@/app/api/[locale]/referral/definition");
      const result = await apiClient.fetch(
        referralDef.default.POST,
        logger,
        user,
        { fieldsGrid: { code: newCode.trim() } },
        undefined,
        locale,
      );
      if (result.success) {
        const createdCode = newCode.trim();
        setCodes((prev) => [
          { code: createdCode, label: null },
          ...(prev ?? []),
        ]);
        setSelectedCode(createdCode);
        setNewCode("");
      }
    } finally {
      setCreating(false);
    }
  };

  const shareUrl =
    selectedCode && typeof window !== "undefined"
      ? `${window.location.origin}/track?ref=${encodeURIComponent(selectedCode)}&url=${encodeURIComponent(`/${locale}/skill/${skillId}`)}`
      : null;

  const handleCopy = async (): Promise<void> => {
    if (shareUrl && typeof window !== "undefined") {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
        onClick={handleOpen}
      >
        <DollarSign className="h-3.5 w-3.5" />
        {t("get.share.button")}
      </Button>

      {open && (
        <Div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border bg-card shadow-lg p-4 flex flex-col gap-3">
          <Div className="flex items-center justify-between">
            <Div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <Span className="font-semibold text-sm">
                {t("get.share.title")}
              </Span>
            </Div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </Div>

          <Span className="text-xs text-muted-foreground">
            {t("get.share.description")}
          </Span>

          {loading ? (
            <Div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Div>
          ) : codes !== null && codes.length > 0 ? (
            <>
              <Div className="flex flex-col gap-1.5">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("get.share.selectCode")}
                </Span>
                {codes.map((c) => (
                  <Button
                    key={c.code}
                    variant={selectedCode === c.code ? "default" : "outline"}
                    size="sm"
                    className="justify-start gap-2 font-mono text-xs"
                    onClick={() => setSelectedCode(c.code)}
                  >
                    {c.code}
                    {c.label && (
                      <Span className="font-sans text-muted-foreground">
                        {c.label}
                      </Span>
                    )}
                  </Button>
                ))}
              </Div>

              {shareUrl && (
                <Div className="flex flex-col gap-1.5">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("get.share.linkReady")}
                  </Span>
                  <Div className="flex items-center gap-2">
                    <Div className="flex-1 rounded-md border bg-muted/50 px-2.5 py-1.5 text-xs font-mono truncate">
                      {shareUrl}
                    </Div>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1 shrink-0"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          {t("get.share.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          {t("get.share.copyLink")}
                        </>
                      )}
                    </Button>
                  </Div>
                </Div>
              )}
            </>
          ) : (
            <Div className="flex flex-col gap-2">
              <Span className="text-xs text-muted-foreground">
                {t("get.share.noCodesYet")}
              </Span>
              <Div className="flex gap-2">
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder={t("get.share.codePlaceholder")}
                  className="h-8 text-xs font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleCreate();
                    }
                  }}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCreate}
                  disabled={creating || newCode.trim().length < 3}
                  className="shrink-0"
                >
                  {creating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    t("get.share.createCode")
                  )}
                </Button>
              </Div>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

/**
 * Customize & Add Button - navigates to create favorite form with skill data
 * Used for "Customize before add" - goes to create favorite for customization
 * Used by "current" design only
 */
function CustomizeAndAddButton({
  skillId,
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
  skillId: string;
  field: { value: SkillGetResponseOutput | null | undefined };
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
      const skillSingleDefinitions = await import("./definition");
      const createFavoriteDefinitions =
        await import("../../favorites/create/definition");
      const editFavoriteDefinitions =
        await import("../../favorites/[id]/definition");

      // Use field data if available, otherwise fetch
      let fullChar = field.value;

      if (!fullChar) {
        const cachedData = apiClient.getEndpointData(
          skillSingleDefinitions.default.GET,
          logger,
          { urlPathParams: { id: skillId } },
        );
        if (cachedData?.success) {
          fullChar = cachedData.data;
        } else {
          const skillResponse = await apiClient.fetch(
            skillSingleDefinitions.default.GET,
            logger,
            user,
            undefined,
            { id: skillId },
            locale,
          );
          if (!skillResponse.success) {
            return;
          }
          fullChar = skillResponse.data;
        }
      }

      navigation.push(createFavoriteDefinitions.default.POST, {
        data: {
          skillId: skillId,
          icon: fullChar.icon ?? undefined,
          voiceModelSelection: undefined,
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
      {!iconOnly && t("get.tweakAndAdd")}
    </Button>
  );
}

/**
 * Edit Skill Button - navigates to skill edit form (owner only)
 */
function EditSkillButton({
  skillId,
  navigation,
  t,
  isOwner = true,
  variant = "outline",
  className = "",
  size = "sm",
  iconOnly = false,
}: {
  skillId: string;
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
        urlPathParams: { id: skillId },
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
      {!iconOnly && t(isOwner ? "get.edit" : "get.copyAndCustomize")}
    </Button>
  );
}
