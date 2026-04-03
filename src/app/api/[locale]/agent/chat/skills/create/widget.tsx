/**
 * Custom Widget for Skill Create
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useMemo, useState, type JSX } from "react";

import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/react";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import type { CountryLanguage } from "@/i18n/core/config";

import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import { type AnyModelId } from "@/app/api/[locale]/agent/models/models";
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

import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "../../../models/types";
import {
  audioVisionModelSelectionSchema,
  chatModelSelectionSchema,
  imageGenModelSelectionSchema,
  imageVisionModelSelectionSchema,
  musicGenModelSelectionSchema,
  sttModelSelectionSchema,
  videoGenModelSelectionSchema,
  videoVisionModelSelectionSchema,
  voiceModelSelectionSchema,
} from "../../../models/types";

import { ModelSelectionType } from "../enum";

import type defintion from "./definition";
import type { SkillCreateResponseOutput } from "./definition";

type ActiveSelector =
  | "chat"
  | "voice"
  | "imageGen"
  | "musicGen"
  | "videoGen"
  | "stt"
  | "imageVision"
  | "videoVision"
  | "audioVision"
  | null;

/**
 * Props for custom widget - field with fully typed children
 */
interface CustomWidgetProps {
  field: {
    value: SkillCreateResponseOutput | null | undefined;
  } & (typeof defintion.POST)["fields"];
}

/**
 * Custom container widget for skill creation
 */
export function SkillCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof defintion.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const t = useWidgetTranslation<typeof defintion.POST>();
  const emptyField = useMemo(() => ({}), []);

  const envAvailability = useEnvAvailability();
  const [activeSelector, setActiveSelector] = useState<ActiveSelector>(null);

  // Platform-level default model selections (env-aware)
  const platformChatDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestModelForSkill(
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

  const platformTtsDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestTtsModel(
      DEFAULT_TTS_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    };
  }, [user, envAvailability]);

  const platformImageGenDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestImageGenModel(
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    };
  }, [user, envAvailability]);

  const platformMusicGenDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestMusicGenModel(
      DEFAULT_MUSIC_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    };
  }, [user, envAvailability]);

  const platformVideoGenDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestVideoGenModel(
      DEFAULT_VIDEO_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    };
  }, [user, envAvailability]);

  const platformSttDefault = useMemo(() => {
    const m = SkillsRepositoryClient.getBestSttModel(
      DEFAULT_STT_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    };
  }, [user, envAvailability]);

  const platformImageVisionDefault = useMemo(():
    | ImageVisionModelSelection
    | undefined => {
    const m = SkillsRepositoryClient.getBestImageVisionModel(
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
    const m = SkillsRepositoryClient.getBestVideoVisionModel(
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
    const m = SkillsRepositoryClient.getBestAudioVisionModel(
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

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back Button + Submit Button */}
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

        {/* Submit Button */}
        <SubmitButtonWidget<typeof defintion.POST>
          field={children.submitButton}
        />
      </Div>

      {/* Scrollable content area */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {activeSelector === "chat" ? (
          <ModelSelectorWrapper form={form} locale={locale} user={user} />
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
            allowedRoles={["llm"]}
            requiredInputs={["image"]}
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
            allowedRoles={["llm"]}
            requiredInputs={["video"]}
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
            allowedRoles={["llm"]}
            requiredInputs={["audio"]}
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

            {/* Render form fields */}
            <Div className="flex flex-col gap-4">
              <TextFieldWidget fieldName="name" field={children.name} />
              <TextFieldWidget fieldName="tagline" field={children.tagline} />
              <IconFieldWidget fieldName="icon" field={children.icon} />
              <TextFieldWidget
                fieldName="description"
                field={children.description}
              />
              <SelectFieldWidget
                fieldName="category"
                field={children.category}
              />
              <BooleanFieldWidget
                fieldName="isPublic"
                field={children.isPublic}
              />
              <TextareaFieldWidget
                fieldName="systemPrompt"
                field={children.systemPrompt}
              />

              {/* Chat model trigger */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.chatModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("modelSelection") ?? undefined}
                  defaultModelSelection={platformChatDefault}
                  placeholder={t("post.chatModel.placeholder")}
                  onClick={() => setActiveSelector("chat")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Voice (TTS) model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.voice.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("voiceModelSelection")}
                  allowedRoles={["tts"]}
                  defaultModelSelection={platformTtsDefault}
                  placeholder={t("post.voice.placeholder")}
                  onClick={() => setActiveSelector("voice")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Image Generation model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.imageGenModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("imageGenModelSelection")}
                  allowedRoles={["image-gen"]}
                  defaultModelSelection={platformImageGenDefault}
                  placeholder={t("post.imageGenModel.placeholder")}
                  onClick={() => setActiveSelector("imageGen")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Music Generation model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.musicGenModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("musicGenModelSelection")}
                  allowedRoles={["audio-gen"]}
                  defaultModelSelection={platformMusicGenDefault}
                  placeholder={t("post.musicGenModel.placeholder")}
                  onClick={() => setActiveSelector("musicGen")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Video Generation model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.videoGenModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("videoGenModelSelection")}
                  allowedRoles={["video-gen"]}
                  defaultModelSelection={platformVideoGenDefault}
                  placeholder={t("post.videoGenModel.placeholder")}
                  onClick={() => setActiveSelector("videoGen")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* STT model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.sttModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("sttModelSelection")}
                  allowedRoles={["stt"]}
                  defaultModelSelection={platformSttDefault}
                  placeholder={t("post.sttModel.placeholder")}
                  onClick={() => setActiveSelector("stt")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Image Vision model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.imageVisionModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("imageVisionModelSelection")}
                  allowedRoles={["llm"]}
                  requiredInputs={["image"]}
                  defaultModelSelection={platformImageVisionDefault}
                  placeholder={t("post.imageVisionModel.placeholder")}
                  onClick={() => setActiveSelector("imageVision")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Video Vision model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.videoVisionModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("videoVisionModelSelection")}
                  allowedRoles={["llm"]}
                  requiredInputs={["video"]}
                  defaultModelSelection={platformVideoVisionDefault}
                  placeholder={t("post.videoVisionModel.placeholder")}
                  onClick={() => setActiveSelector("videoVision")}
                  locale={locale}
                  user={user}
                />
              </Div>

              {/* Audio Vision model selector */}
              <Div className="flex flex-col gap-1">
                <Span className="text-xs font-medium text-muted-foreground">
                  {t("post.audioVisionModel.label")}
                </Span>
                <ModelSelectorTrigger
                  modelSelection={form.watch("audioVisionModelSelection")}
                  allowedRoles={["llm"]}
                  requiredInputs={["audio"]}
                  defaultModelSelection={platformAudioVisionDefault}
                  placeholder={t("post.audioVisionModel.placeholder")}
                  onClick={() => setActiveSelector("audioVision")}
                  locale={locale}
                  user={user}
                />
              </Div>
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}

function ModelSelectorWrapper({
  form,
  locale,
  user,
}: {
  form: ReturnType<typeof useWidgetForm<typeof defintion.POST>>;
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
}): JSX.Element {
  const modelSelection = form.watch("modelSelection");
  const error = form.formState.errors.modelSelection;
  const onChange = useCallback(
    (
      selection: { selectionType: string; manualModelId?: AnyModelId } | null,
    ) => {
      const parsed = chatModelSelectionSchema.nullable().safeParse(selection);
      form.setValue("modelSelection", parsed.success ? parsed.data : null);
    },
    [form],
  );
  return (
    <>
      {error && (
        <Div className="text-red-500 text-sm mb-2">{error.message}</Div>
      )}
      <ModelSelector
        modelSelection={modelSelection ?? undefined}
        onChange={onChange}
        locale={locale}
        user={user}
        chatOnly
      />
    </>
  );
}
