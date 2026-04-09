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
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Film } from "next-vibe-ui/ui/icons/Film";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
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
import { Image } from "next-vibe-ui/ui/image";
import { Input } from "next-vibe-ui/ui/input";
import { Link } from "next-vibe-ui/ui/link";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DEFAULT_AUDIO_VISION_MODEL_SELECTION,
  DEFAULT_CHAT_MODEL_SELECTION,
  DEFAULT_IMAGE_VISION_MODEL_SELECTION,
  DEFAULT_VIDEO_VISION_MODEL_SELECTION,
} from "@/app/api/[locale]/agent/ai-stream/constants";
import {
  chatModelSelectionSchema,
  getBestChatModel,
  type ChatModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  getBestAudioVisionModel,
  getBestImageVisionModel,
  getBestVideoVisionModel,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
  type AudioVisionModelSelection,
  type ImageVisionModelSelection,
  type VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import {
  getBestImageGenModel,
  imageGenModelSelectionSchema,
  type ImageGenModelSelection,
} from "@/app/api/[locale]/agent/image-generation/models";
import { type AnyModelOptionWithVision } from "@/app/api/[locale]/agent/models/all-models";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/music-generation/constants";
import {
  getBestMusicGenModel,
  musicGenModelSelectionSchema,
  type MusicGenModelSelection,
} from "@/app/api/[locale]/agent/music-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import {
  getBestSttModel,
  sttModelSelectionSchema,
  type SttModelSelection,
} from "@/app/api/[locale]/agent/speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import {
  getBestTtsModel,
  ttsModelOptions,
  voiceModelSelectionSchema,
  type VoiceModelSelection,
} from "@/app/api/[locale]/agent/text-to-speech/models";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import {
  getBestVideoGenModel,
  videoGenModelSelectionSchema,
  type VideoGenModelSelection,
} from "@/app/api/[locale]/agent/video-generation/models";
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
                { shouldDirty: true, shouldValidate: true },
              );
            }}
            onSelect={(confirmed) => {
              const parsed = chatModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              form.setValue(
                "modelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true, shouldValidate: true },
              );
              setActiveSelector(null);
            }}
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
                shouldValidate: true,
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
                { shouldDirty: true, shouldValidate: true },
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
                { shouldDirty: true, shouldValidate: true },
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
                { shouldDirty: true, shouldValidate: true },
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
                shouldValidate: true,
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
                { shouldDirty: true, shouldValidate: true },
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
                { shouldDirty: true, shouldValidate: true },
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
                { shouldDirty: true, shouldValidate: true },
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

              {/* ── BRAIN ── */}
              <ModelGroup
                icon={<Brain className="w-3.5 h-3.5" />}
                label={t("get.models.brain")}
              >
                <Div className="flex flex-col gap-1">
                  <ModelSelectorTrigger
                    modelSelection={form.watch("modelSelection") ?? undefined}
                    defaultModelSelection={platformChatDefault}
                    placeholder={t("patch.chatModel.placeholder")}
                    onClick={() => setActiveSelector("chat")}
                    locale={locale}
                    user={user}
                  />
                  {form.formState.errors.modelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.modelSelection.message}
                    </Span>
                  )}
                </Div>
              </ModelGroup>

              {/* ── EYES ── */}
              <ModelGroup
                icon={<Eye className="w-3.5 h-3.5" />}
                label={t("get.models.eyes")}
              >
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.imageVision")}
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
                  {form.formState.errors.imageVisionModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.imageVisionModelSelection.message}
                    </Span>
                  )}
                </Div>
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.videoVision")}
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
                  {form.formState.errors.videoVisionModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.videoVisionModelSelection.message}
                    </Span>
                  )}
                </Div>
              </ModelGroup>

              {/* ── EARS & VOICE ── */}
              <ModelGroup
                icon={<Mic className="w-3.5 h-3.5" />}
                label={t("get.models.ears")}
              >
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.stt")}
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
                  {form.formState.errors.sttModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.sttModelSelection.message}
                    </Span>
                  )}
                </Div>
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.tts")}
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
                  {form.formState.errors.voiceModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.voiceModelSelection.message}
                    </Span>
                  )}
                </Div>
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.audioVision")}
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
                  {form.formState.errors.audioVisionModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.audioVisionModelSelection.message}
                    </Span>
                  )}
                </Div>
              </ModelGroup>

              {/* ── MEDIA ── */}
              <ModelGroup
                icon={<Film className="w-3.5 h-3.5" />}
                label={t("get.models.media")}
              >
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.imageGen")}
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
                  {form.formState.errors.imageGenModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.imageGenModelSelection.message}
                    </Span>
                  )}
                </Div>
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.musicGen")}
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
                  {form.formState.errors.musicGenModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.musicGenModelSelection.message}
                    </Span>
                  )}
                </Div>
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs opacity-40">
                    {t("get.models.slots.videoGen")}
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
                  {form.formState.errors.videoGenModelSelection && (
                    <Span className="text-xs text-destructive">
                      {form.formState.errors.videoGenModelSelection.message}
                    </Span>
                  )}
                </Div>
              </ModelGroup>

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

/** Compact read-only model card - slot label + provider icon + model name + credit cost */
function ModelCard({
  model,
  slot,
  locale,
  nameClassName,
}: {
  model: AnyModelOptionWithVision;
  slot: string;
  locale: CountryLanguage;
  nameClassName?: string;
}): React.JSX.Element {
  const provider = modelProviders[model.provider];
  const providerIcon = provider?.icon as IconKey | undefined;

  return (
    <Div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
        minWidth: 0,
      }}
    >
      <Span style={{ flexShrink: 0, opacity: 0.6 }}>
        {providerIcon ? (
          <Icon icon={providerIcon} className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
      </Span>
      <Div style={{ flex: 1, minWidth: 0 }}>
        <Span
          style={{
            display: "block",
            fontSize: 10,
            fontWeight: 700,
            opacity: 0.4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.2,
            marginBottom: 2,
          }}
        >
          {slot}
        </Span>
        <Span
          className={`block text-[13px] font-semibold leading-snug overflow-hidden text-ellipsis whitespace-nowrap${nameClassName ? ` ${nameClassName}` : ""}`}
        >
          {model.name}
        </Span>
        <Div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            lineHeight: 1.3,
          }}
        >
          <Span style={{ fontSize: 11, opacity: 0.45, flexShrink: 0 }}>
            {provider?.name ?? model.provider}
          </Span>
          <Span
            aria-hidden
            style={{
              fontSize: 11,
              opacity: 0.25,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {
              // oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string
              "·"
            }
          </Span>
          <ModelCreditDisplay
            modelId={model.id}
            variant="text"
            className="text-[11px] opacity-45 leading-none"
            locale={locale}
          />
        </Div>
      </Div>
    </Div>
  );
}

/** Group of ModelCards/selectors with icon heading and responsive grid */
export function ModelGroup({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-2">
      <Div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: 0.45,
        }}
      >
        <Span style={{ display: "flex", alignItems: "center" }}>{icon}</Span>
        <Span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Span>
      </Div>
      <Div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {children}
      </Div>
    </Div>
  );
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
  const form = useWidgetForm<typeof definitionGet.GET>();
  const skillId =
    (navigation?.current?.params?.urlPathParams?.id as string | undefined) ??
    (form?.getValues?.("id") as string | undefined) ??
    undefined;

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
  const isLoading = !field.value;
  const env = useEnvAvailability();

  // Resolve all models once for the view
  const resolvedModels = useMemo(() => {
    const sv = field.value;
    const chatSel =
      sv?.variants?.[0]?.modelSelection ??
      modelSelection ??
      viewDefaults.chat ??
      null;
    const ttsSel = sv?.voiceModelSelection ?? viewDefaults.tts ?? null;
    const sttSel = sv?.sttModelSelection ?? viewDefaults.stt ?? null;
    const imageVisionSel =
      sv?.imageVisionModelSelection ?? viewDefaults.imageVision ?? null;
    const videoVisionSel =
      sv?.videoVisionModelSelection ?? viewDefaults.videoVision ?? null;
    const audioVisionSel =
      sv?.audioVisionModelSelection ?? viewDefaults.audioVision ?? null;
    const imageGenSel =
      sv?.imageGenModelSelection ?? viewDefaults.imageGen ?? null;
    const musicGenSel =
      sv?.musicGenModelSelection ?? viewDefaults.musicGen ?? null;
    const videoGenSel =
      sv?.videoGenModelSelection ?? viewDefaults.videoGen ?? null;
    return {
      chat: chatSel ? getBestChatModel(chatSel, user, env) : null,
      tts: ttsSel ? getBestTtsModel(ttsSel, user, env) : null,
      stt: sttSel ? getBestSttModel(sttSel, user, env) : null,
      imageVision: imageVisionSel
        ? getBestImageVisionModel(imageVisionSel, user, env)
        : null,
      videoVision: videoVisionSel
        ? getBestVideoVisionModel(videoVisionSel, user, env)
        : null,
      audioVision: audioVisionSel
        ? getBestAudioVisionModel(audioVisionSel, user, env)
        : null,
      imageGen: imageGenSel
        ? getBestImageGenModel(imageGenSel, user, env)
        : null,
      musicGen: musicGenSel
        ? getBestMusicGenModel(musicGenSel, user, env)
        : null,
      videoGen: videoGenSel
        ? getBestVideoGenModel(videoGenSel, user, env)
        : null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value, user, env, modelSelection]);

  // Shared content section (system prompt + models)
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

      {/* ── BRAIN ── */}
      {resolvedModels.chat && (
        <ModelGroup
          icon={<Brain className="w-3.5 h-3.5" />}
          label={t("get.models.brain")}
        >
          <ModelCard
            model={resolvedModels.chat}
            slot={t("get.models.slots.chat")}
            locale={locale}
          />
        </ModelGroup>
      )}

      {/* ── EYES ── image + video vision */}
      {(resolvedModels.imageVision ?? resolvedModels.videoVision) && (
        <ModelGroup
          icon={<Eye className="w-3.5 h-3.5" />}
          label={t("get.models.eyes")}
        >
          {resolvedModels.imageVision && (
            <ModelCard
              model={resolvedModels.imageVision}
              slot={t("get.models.slots.imageVision")}
              locale={locale}
            />
          )}
          {resolvedModels.videoVision && (
            <ModelCard
              model={resolvedModels.videoVision}
              slot={t("get.models.slots.videoVision")}
              locale={locale}
            />
          )}
        </ModelGroup>
      )}

      {/* ── EARS & VOICE ── STT + TTS + audio vision */}
      {(resolvedModels.stt ??
        resolvedModels.tts ??
        resolvedModels.audioVision) && (
        <ModelGroup
          icon={<Mic className="w-3.5 h-3.5" />}
          label={t("get.models.ears")}
        >
          {resolvedModels.stt && (
            <ModelCard
              model={resolvedModels.stt}
              slot={t("get.models.slots.stt")}
              locale={locale}
            />
          )}
          {resolvedModels.tts && (
            <ModelCard
              model={resolvedModels.tts}
              slot={t("get.models.slots.tts")}
              locale={locale}
            />
          )}
          {resolvedModels.audioVision && (
            <ModelCard
              model={resolvedModels.audioVision}
              slot={t("get.models.slots.audioVision")}
              locale={locale}
            />
          )}
        </ModelGroup>
      )}

      {/* ── MEDIA ── image + music + video gen */}
      {(resolvedModels.imageGen ??
        resolvedModels.musicGen ??
        resolvedModels.videoGen) && (
        <ModelGroup
          icon={<Film className="w-3.5 h-3.5" />}
          label={t("get.models.media")}
        >
          {resolvedModels.imageGen && (
            <ModelCard
              model={resolvedModels.imageGen}
              slot={t("get.models.slots.imageGen")}
              locale={locale}
            />
          )}
          {resolvedModels.musicGen && (
            <ModelCard
              model={resolvedModels.musicGen}
              slot={t("get.models.slots.musicGen")}
              locale={locale}
            />
          )}
          {resolvedModels.videoGen && (
            <ModelCard
              model={resolvedModels.videoGen}
              slot={t("get.models.slots.videoGen")}
              locale={locale}
            />
          )}
        </ModelGroup>
      )}
    </>
  );

  const creator = field.value?.creatorProfile ?? null;
  const accent = creator?.creatorAccentColor ?? "#8b5cf6";

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-2">
        <NavigateButtonWidget field={children.backButton} />
      </Div>

      <Div className="group flex flex-col">
        {/* ── HERO ── */}
        <Div
          style={{
            position: "relative",
            textAlign: "center",
            padding: "20px 24px 28px",
            overflow: "hidden",
            background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${accent}18 0%, transparent 70%)`,
          }}
        >
          {/* creator row - above skill identity */}
          {creator && <CreatorRow creator={creator} />}

          {/* icon */}
          <Div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: creator ? 20 : 4,
              marginBottom: 16,
            }}
          >
            <Span
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${accent}28, ${accent}0a)`,
                border: `1px solid ${accent}30`,
                boxShadow: `0 0 40px ${accent}20`,
              }}
            >
              {field.value?.icon ? (
                <Span style={{ color: `${accent}cc` }}>
                  <Icon
                    icon={field.value.icon as IconKey}
                    className="w-9 h-9"
                  />
                </Span>
              ) : (
                <Skeleton className="w-9 h-9 rounded-full" />
              )}
            </Span>
          </Div>

          {/* name */}
          {field.value?.name ? (
            <Span
              style={{
                display: "block",
                fontSize: "clamp(32px, 8vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                background: `linear-gradient(150deg, #fff 30%, ${accent}aa 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 10,
              }}
            >
              {field.value.name}
            </Span>
          ) : (
            <Skeleton className="h-12 w-48 mx-auto mb-3" />
          )}

          {/* tagline */}
          {field.value?.tagline ? (
            <Span
              style={{
                display: "block",
                fontSize: 14,
                opacity: 0.7,
                lineHeight: 1.5,
                marginBottom: field.value.description ? 16 : 4,
              }}
            >
              {field.value.tagline}
            </Span>
          ) : (
            <Skeleton className="h-4 w-40 mx-auto mb-2" />
          )}

          {/* description */}
          {field.value?.description && (
            <Span
              style={{
                display: "block",
                fontSize: 13,
                opacity: 0.55,
                lineHeight: 1.6,
                maxWidth: 480,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {field.value.description}
            </Span>
          )}
        </Div>

        {/* ── ACTIONS ── */}
        <Div className="px-4 pb-4 flex flex-col gap-4">
          {!isLoading && (
            <Div className="flex items-center gap-2 flex-wrap">
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
                skillId={skillId ?? ""}
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
                skillId={skillId ?? ""}
                locale={locale}
                t={t}
                user={user}
                logger={logger}
              />
              {isOwner ? (
                <>
                  <Div className="flex-1" />
                  <EditSkillButton
                    skillId={skillId ?? ""}
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
                    skillId={skillId ?? ""}
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

          {/* ── DETAILS ── */}
          <Div className="flex flex-col gap-4">{ContentSection}</Div>
        </Div>
      </Div>
    </Div>
  );
}

const ownershipIcon = {
  [SkillOwnershipType.USER]: User,
  [SkillOwnershipType.SYSTEM]: Sparkles,
  [SkillOwnershipType.PUBLIC]: Users,
};

const CREATOR_SOCIALS = [
  { key: "twitterUrl", label: "X" },
  { key: "youtubeUrl", label: "YouTube" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "githubUrl", label: "GitHub" },
  { key: "discordUrl", label: "Discord" },
  { key: "websiteUrl", label: "Website" },
] as const;

type CreatorProfile = NonNullable<SkillGetResponseOutput["creatorProfile"]>;

/**
 * Compact creator attribution row - shown at the top of skill view when skill is user-owned
 */
function CreatorRow({
  creator,
}: {
  creator: CreatorProfile;
}): React.JSX.Element {
  const accent = creator.creatorAccentColor ?? "#8b5cf6";
  const socialLinks = CREATOR_SOCIALS.flatMap(({ key, label }) => {
    const url = creator[key as keyof CreatorProfile];
    return typeof url === "string" && url ? [{ url, label }] : [];
  });

  return (
    <Div className="flex items-start gap-3 px-1 pb-1">
      {/* avatar */}
      <Span
        style={{
          flexShrink: 0,
          borderRadius: "50%",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          border: `1.5px solid ${accent}44`,
          background: `${accent}12`,
        }}
      >
        {creator.avatarUrl ? (
          <Image
            src={creator.avatarUrl}
            alt={creator.publicName}
            width={36}
            height={36}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Span style={{ color: `${accent}88` }}>
            <User className="w-4 h-4" />
          </Span>
        )}
      </Span>
      {/* name + bio + socials */}
      <Div className="flex flex-col gap-0.5 min-w-0">
        <Span className="text-sm font-semibold leading-tight">
          {creator.publicName}
        </Span>
        {creator.bio && (
          <Span className="text-xs text-muted-foreground line-clamp-1 leading-snug">
            {creator.bio}
          </Span>
        )}
        {socialLinks.length > 0 && (
          <Div className="flex flex-wrap gap-1 mt-0.5">
            {socialLinks.map(({ url, label }) => (
              <Link
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors opacity-65 rounded-full border border-current px-1.5 py-px">
                  {label}
                  <ExternalLink className="w-2 h-2" />
                </Span>
              </Link>
            ))}
          </Div>
        )}
      </Div>
    </Div>
  );
}

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
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);
  const wrapperRef = useRef<DivRefObject>(null);

  useEffect(() => {
    if (open && wrapperRef.current) {
      setPopoverRect(wrapperRef.current.getBoundingClientRect());
    }
  }, [open]);

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

  const popoverContent =
    open && popoverRect
      ? createPortal(
          <Div
            style={{
              position: "fixed",
              zIndex: 9999,
              width: 320,
              top: popoverRect.bottom + 8,
              right: window.innerWidth - popoverRect.right,
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--popover))",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
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
          </Div>,
          document.body,
        )
      : null;

  return (
    <>
      <Div ref={wrapperRef} className="inline-flex">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          onClick={handleOpen}
        >
          <DollarSign className="h-3.5 w-3.5" />
          {t("get.share.button")}
        </Button>
      </Div>
      {popoverContent}
    </>
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
