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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { ArrowRight } from "next-vibe-ui/ui/icons/ArrowRight";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Film } from "next-vibe-ui/ui/icons/Film";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { LogIn } from "next-vibe-ui/ui/icons/LogIn";
import { Maximize } from "next-vibe-ui/ui/icons/Maximize";
import { Mic } from "next-vibe-ui/ui/icons/Mic";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { User } from "next-vibe-ui/ui/icons/User";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
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
import { usePathname } from "next-vibe-ui/hooks/use-pathname";
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
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/alert/widget";
import { MarkdownWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/display-only/markdown/widget";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { IconFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  ToolsConfigEdit,
  type ToolsConfigValue,
} from "../../../tools/widget/tools-config-widget";
import { formatSkillId, parseSkillId } from "../../slugify";
import {
  useAddToFavorites,
  type SkillDataForFavorite,
} from "../../favorites/create/hooks";
import type { FavoriteCard } from "../../favorites/definition";
import { useChatFavorites } from "../../favorites/hooks/hooks";
import { CompactTriggerEdit } from "../../settings/widget";
import type { SkillVariantData } from "../../skills/db";
import {
  ModelSelectionType,
  SkillOwnershipType,
  type SkillOwnershipTypeValue,
} from "../../skills/enum";
import type {
  default as definitionGet,
  default as definitionPatch,
  SkillGetResponseOutput,
} from "./definition";
import { useSkill } from "./hooks";

/**
 * Props for PATCH custom widget
 */
interface PatchWidgetProps {
  field: (typeof definitionPatch.PATCH)["fields"];
}

/**
 * Props for GET custom widget
 */
interface GetWidgetProps {
  field: (typeof definitionGet.GET)["fields"];
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
  const editResult = useWidgetValue<typeof definitionPatch.PATCH>();
  const skillId = form.watch("id");
  const skillHook = useSkill(skillId, user, logger);
  const skillOwnership = skillHook.read?.data?.skillOwnership;

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
    const m = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = chatModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformTtsDefault = useMemo((): VoiceModelSelection | undefined => {
    const m = getBestTtsModel(DEFAULT_TTS_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = voiceModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformImageGenDefault = useMemo(():
    | ImageGenModelSelection
    | undefined => {
    const m = getBestImageGenModel(DEFAULT_IMAGE_GEN_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = imageGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformMusicGenDefault = useMemo(():
    | MusicGenModelSelection
    | undefined => {
    const m = getBestMusicGenModel(DEFAULT_MUSIC_GEN_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = musicGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformVideoGenDefault = useMemo(():
    | VideoGenModelSelection
    | undefined => {
    const m = getBestVideoGenModel(DEFAULT_VIDEO_GEN_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = videoGenModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformSttDefault = useMemo((): SttModelSelection | undefined => {
    const m = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const parsed = sttModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformImageVisionDefault = useMemo(():
    | ImageVisionModelSelection
    | undefined => {
    const m = getBestImageVisionModel(
      DEFAULT_IMAGE_VISION_MODEL_SELECTION,
      user,
    );
    if (!m) {
      return undefined;
    }
    const parsed = imageVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformVideoVisionDefault = useMemo(():
    | VideoVisionModelSelection
    | undefined => {
    const m = getBestVideoVisionModel(
      DEFAULT_VIDEO_VISION_MODEL_SELECTION,
      user,
    );
    if (!m) {
      return undefined;
    }
    const parsed = videoVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  const platformAudioVisionDefault = useMemo(():
    | AudioVisionModelSelection
    | undefined => {
    const m = getBestAudioVisionModel(
      DEFAULT_AUDIO_VISION_MODEL_SELECTION,
      user,
    );
    if (!m) {
      return undefined;
    }
    const parsed = audioVisionModelSelectionSchema.safeParse({
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: m.id,
    });
    return parsed.success ? parsed.data : undefined;
  }, [user]);

  // Stable props
  const emptyField = useMemo(() => ({}), []);

  // Variant management
  const platformDefaults = useVariantPlatformDefaults(user);
  const watchedVariants = form.watch("variants");
  const localVariants: SkillVariantData[] = useMemo(() => {
    if (watchedVariants && watchedVariants.length > 0) {
      return watchedVariants;
    }
    // Synthesize a single default variant from the skill's model selections if no variants yet
    return [
      {
        id: "default",
        isDefault: true,
        modelSelection:
          form.getValues("modelSelection") ?? DEFAULT_CHAT_MODEL_SELECTION,
        voiceModelSelection: form.getValues("voiceModelSelection") ?? undefined,
        sttModelSelection: form.getValues("sttModelSelection") ?? undefined,
        imageVisionModelSelection:
          form.getValues("imageVisionModelSelection") ?? undefined,
        videoVisionModelSelection:
          form.getValues("videoVisionModelSelection") ?? undefined,
        audioVisionModelSelection:
          form.getValues("audioVisionModelSelection") ?? undefined,
        imageGenModelSelection:
          form.getValues("imageGenModelSelection") ?? undefined,
        musicGenModelSelection:
          form.getValues("musicGenModelSelection") ?? undefined,
      },
    ];
  }, [watchedVariants, form]);

  const handleVariantsChange = useCallback(
    (newVariants: SkillVariantData[]): void => {
      form.setValue("variants", newVariants, { shouldDirty: true });
      // Sync top-level modelSelection with default variant for backward compat
      const defaultVariant =
        newVariants.find((v) => v.isDefault) ?? newVariants[0];
      if (defaultVariant) {
        form.setValue("modelSelection", defaultVariant.modelSelection, {
          shouldDirty: true,
        });
      }
    },
    [form],
  );

  const [skillDefaultsOpen, setSkillDefaultsOpen] = useState(false);

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
              field={withValue(children.success, editResult?.success, null)}
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

              {/* ── VARIANTS ── */}
              <Div className="flex flex-col gap-2">
                <Span className="text-sm font-semibold">
                  {t("patch.variants.label")}
                </Span>
                <VariantList
                  variants={localVariants}
                  onChange={handleVariantsChange}
                  platformDefaults={platformDefaults}
                  locale={locale}
                  user={user}
                  t={t}
                />
              </Div>

              {/* ── SKILL-LEVEL DEFAULTS (collapsed) ── */}
              <Collapsible
                open={skillDefaultsOpen}
                onOpenChange={setSkillDefaultsOpen}
              >
                <Div className="rounded-lg border">
                  <CollapsibleTrigger asChild>
                    <Div className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors">
                      <Div className="flex flex-col gap-0.5">
                        <Span className="text-sm font-medium">
                          {t("patch.variants.skillDefaults")}
                        </Span>
                        <Span className="text-xs text-muted-foreground">
                          {t("patch.variants.skillDefaultsHint")}
                        </Span>
                      </Div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 opacity-40 transition-transform",
                          skillDefaultsOpen && "rotate-180",
                        )}
                      />
                    </Div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Div className="px-3 pb-3 pt-1 flex flex-col gap-3 border-t">
                      {/* ── BRAIN ── */}
                      <ModelGroup
                        icon={<Brain className="w-3.5 h-3.5" />}
                        label={t("get.models.brain")}
                      >
                        <Div className="flex flex-col gap-1">
                          <ModelSelectorTrigger
                            modelSelection={
                              form.watch("modelSelection") ?? undefined
                            }
                            defaultModelSelection={platformChatDefault}
                            placeholder={t("patch.chatModel.placeholder")}
                            onClick={() => setActiveSelector("chat")}
                            locale={locale}
                            user={user}
                          />
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
                            modelSelection={form.watch(
                              "imageVisionModelSelection",
                            )}
                            allowedRoles={["image-vision"]}
                            defaultModelSelection={platformImageVisionDefault}
                            placeholder={t(
                              "patch.imageVisionModel.placeholder",
                            )}
                            onClick={() => setActiveSelector("imageVision")}
                            locale={locale}
                            user={user}
                          />
                        </Div>
                        <Div className="flex flex-col gap-1">
                          <Span className="text-xs opacity-40">
                            {t("get.models.slots.videoVision")}
                          </Span>
                          <ModelSelectorTrigger
                            modelSelection={form.watch(
                              "videoVisionModelSelection",
                            )}
                            allowedRoles={["video-vision"]}
                            defaultModelSelection={platformVideoVisionDefault}
                            placeholder={t(
                              "patch.videoVisionModel.placeholder",
                            )}
                            onClick={() => setActiveSelector("videoVision")}
                            locale={locale}
                            user={user}
                          />
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
                        </Div>
                        <Div className="flex flex-col gap-1">
                          <Span className="text-xs opacity-40">
                            {t("get.models.slots.audioVision")}
                          </Span>
                          <ModelSelectorTrigger
                            modelSelection={form.watch(
                              "audioVisionModelSelection",
                            )}
                            allowedRoles={["audio-vision"]}
                            defaultModelSelection={platformAudioVisionDefault}
                            placeholder={t(
                              "patch.audioVisionModel.placeholder",
                            )}
                            onClick={() => setActiveSelector("audioVision")}
                            locale={locale}
                            user={user}
                          />
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
                            modelSelection={form.watch(
                              "imageGenModelSelection",
                            )}
                            allowedRoles={["image-gen"]}
                            defaultModelSelection={platformImageGenDefault}
                            placeholder={t("patch.imageGenModel.placeholder")}
                            onClick={() => setActiveSelector("imageGen")}
                            locale={locale}
                            user={user}
                          />
                        </Div>
                        <Div className="flex flex-col gap-1">
                          <Span className="text-xs opacity-40">
                            {t("get.models.slots.musicGen")}
                          </Span>
                          <ModelSelectorTrigger
                            modelSelection={form.watch(
                              "musicGenModelSelection",
                            )}
                            allowedRoles={["audio-gen"]}
                            defaultModelSelection={platformMusicGenDefault}
                            placeholder={t("patch.musicGenModel.placeholder")}
                            onClick={() => setActiveSelector("musicGen")}
                            locale={locale}
                            user={user}
                          />
                        </Div>
                        <Div className="flex flex-col gap-1">
                          <Span className="text-xs opacity-40">
                            {t("get.models.slots.videoGen")}
                          </Span>
                          <ModelSelectorTrigger
                            modelSelection={form.watch(
                              "videoGenModelSelection",
                            )}
                            allowedRoles={["video-gen"]}
                            defaultModelSelection={platformVideoGenDefault}
                            placeholder={t("patch.videoGenModel.placeholder")}
                            onClick={() => setActiveSelector("videoGen")}
                            locale={locale}
                            user={user}
                          />
                        </Div>
                      </ModelGroup>
                    </Div>
                  </CollapsibleContent>
                </Div>
              </Collapsible>

              {/* Context Memory Budget */}
              {form && (
                <CompactTriggerEdit
                  value={form.watch("compactTrigger") ?? null}
                  onChange={(v) =>
                    form.setValue("compactTrigger", v, { shouldDirty: true })
                  }
                  modelSelection={form.watch("modelSelection") ?? null}
                  user={user}
                  locale={locale}
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
  const user = useWidgetUser();
  return useMemo(() => {
    const mkChat = (): ChatModelSelection | undefined => {
      const m = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user);
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
      const m = getBestTtsModel(DEFAULT_TTS_MODEL_SELECTION, user);
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
      const m = getBestImageGenModel(DEFAULT_IMAGE_GEN_MODEL_SELECTION, user);
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
      const m = getBestMusicGenModel(DEFAULT_MUSIC_GEN_MODEL_SELECTION, user);
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
      const m = getBestVideoGenModel(DEFAULT_VIDEO_GEN_MODEL_SELECTION, user);
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
      const m = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, user);
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
  }, [user]);
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
  const pathname = usePathname();
  const isLandingPage = pathname?.includes("/skill/") ?? false;
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const navigation = useWidgetNavigation();
  const context = useWidgetContext();
  const { logger, user } = context;
  const locale = useWidgetLocale();
  const viewDefaults = useViewDefaults();
  const t = useWidgetTranslation<typeof definitionGet.GET>();
  const skillData = useWidgetValue<typeof definitionGet.GET>();
  const variants = skillData?.variants;
  const skillOwnership = skillData?.skillOwnership;
  const form = useWidgetForm<typeof definitionGet.GET>();
  const skillId =
    (navigation?.current?.params?.urlPathParams?.id as string | undefined) ??
    (form?.getValues?.("id") as string | undefined) ??
    undefined;

  // Check if skill is in favorites by fetching favorites list
  const { favorites } = useChatFavorites(logger, {
    activeFavoriteId: null,
  });

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
  const isLoading = !skillData;

  const handleCopyPrompt = useCallback((): void => {
    const prompt = skillData?.systemPrompt;
    if (!prompt) {
      return;
    }
    void navigator.clipboard.writeText(prompt).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
      return undefined;
    });
  }, [skillData?.systemPrompt]);

  // System prompt collapsible section (shared across modes)
  const SystemPromptSection = (
    <>
      {(skillData?.systemPrompt || !skillData) && (
        <>
          <Dialog open={promptModalOpen} onOpenChange={setPromptModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-3 pr-8">
                  <Span>{t("get.systemPrompt.label")}</Span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPrompt}
                    className="shrink-0"
                  >
                    {promptCopied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        {t("get.systemPrompt.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        {t("get.systemPrompt.copy")}
                      </>
                    )}
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <Div className="mt-2">
                <MarkdownWidget
                  fieldName="systemPrompt"
                  field={withValue(
                    children.systemPrompt,
                    skillData?.systemPrompt,
                    null,
                  )}
                />
              </Div>
            </DialogContent>
          </Dialog>
          <Collapsible
            open={systemPromptOpen}
            onOpenChange={setSystemPromptOpen}
          >
            <Div className="rounded-lg border">
              <Div className="flex items-center gap-2 p-4">
                <CollapsibleTrigger asChild>
                  <Div className="flex-1 flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
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
                </CollapsibleTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPrompt}
                  title={t("get.systemPrompt.copy")}
                  className="shrink-0 h-7 w-7 p-0"
                >
                  {promptCopied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPromptModalOpen(true)}
                  title={t("get.systemPrompt.view")}
                  className="shrink-0 h-7 w-7 p-0"
                >
                  <Maximize className="h-3.5 w-3.5" />
                </Button>
              </Div>
              <CollapsibleContent>
                <Div className="px-4 pb-4">
                  <MarkdownWidget
                    fieldName="systemPrompt"
                    field={withValue(
                      children.systemPrompt,
                      skillData?.systemPrompt,
                      null,
                    )}
                  />
                </Div>
              </CollapsibleContent>
            </Div>
          </Collapsible>
        </>
      )}
    </>
  );

  // Variants to render — always show at least the single variant
  const variantsToRender = variants ?? [];

  const creator = skillData?.creatorProfile ?? null;
  const accent = creator?.creatorAccentColor ?? "#8b5cf6";

  // ── LANDING PAGE MODE ──────────────────────────────────────────────────────
  // Creator-first layout: the creator is the hero, the skill is a featured
  // creation within their profile. Think MySpace meets skill tree.
  if (isLandingPage) {
    const signupUrl = creator?.referralCode
      ? `/${locale}/user/signup?ref=${creator.referralCode}&skillId=${skillId ?? ""}`
      : `/${locale}/user/signup${skillId ? `?skillId=${skillId}` : ""}`;

    const favCount = skillData?.favoritesCount ?? 0;

    const cardStyle = {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      overflow: "hidden",
    } as const;

    // Build social links list
    const socialLinks = creator
      ? CREATOR_SOCIALS.flatMap(({ key, label }) => {
          const url = creator[key as keyof CreatorProfile];
          return typeof url === "string" && url ? [{ key, url, label }] : [];
        })
      : [];

    const heroBg = creator?.creatorHeaderImageUrl
      ? {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.88)), url(${creator.creatorHeaderImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${accent}18 0%, transparent 70%)`,
        };

    return (
      <Div className="flex flex-col">
        {/* ── NAV ── */}
        <Div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0 24px",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(15,5,32,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Link
            href={`/${locale}`}
            className="text-xs no-underline text-white/60 hover:text-white/90 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("get.landing.backToHome")}
          </Link>
          <Div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user.isPublic ? (
              <>
                <Link
                  href={`/${locale}/user/login`}
                  className="text-xs no-underline px-3 py-1.5 opacity-45 text-white"
                >
                  {t("get.landing.signIn")}
                </Link>
                <Link href={signupUrl} className="no-underline">
                  <Span className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-violet-600 text-white cursor-pointer">
                    {t("get.landing.joinFree")}
                  </Span>
                </Link>
              </>
            ) : (
              <Link
                href={`/${locale}/skills`}
                className="text-xs no-underline px-3 py-1.5 text-white/60 hover:text-white/90 transition-colors flex items-center gap-1.5"
              >
                {t("get.landing.allSkills")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </Div>
        </Div>

        {/* ── HERO ── */}
        <Div
          style={{
            ...heroBg,
            textAlign: "center",
            paddingTop: 88,
            paddingBottom: 40,
            paddingLeft: 24,
            paddingRight: 24,
            overflow: "hidden",
          }}
        >
          {/* Icon */}
          <Div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
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
              {skillData?.icon ? (
                <Span style={{ color: `${accent}cc` }}>
                  <Icon icon={skillData.icon as IconKey} className="w-9 h-9" />
                </Span>
              ) : (
                <Skeleton className="w-9 h-9 rounded-full" />
              )}
            </Span>
          </Div>

          {/* Name */}
          {skillData?.name ? (
            <Span
              style={{
                display: "block",
                fontSize: "clamp(28px, 7vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                background: `linear-gradient(150deg, #fff 30%, ${accent}aa 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 12,
              }}
            >
              {skillData.name}
            </Span>
          ) : (
            <Skeleton className="h-12 w-48 mx-auto mb-3" />
          )}

          {/* Tagline */}
          {skillData?.tagline && (
            <Span
              style={{
                display: "block",
                fontSize: 15,
                opacity: 0.65,
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {skillData.tagline}
            </Span>
          )}

          {/* Meta: favorites */}
          {favCount > 0 && (
            <Span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                opacity: 0.4,
                marginBottom: 8,
              }}
            >
              <Star className="w-3 h-3" />
              {favCount}
            </Span>
          )}

          {/* CTA buttons */}
          {!isLoading && (
            <Div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              {user.isPublic ? (
                <Link href={signupUrl} className="no-underline">
                  <Span className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg bg-violet-600 text-white cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    {t("get.landing.startFree")}
                  </Span>
                </Link>
              ) : (
                <CustomizeAndAddButton
                  skillId={skillId ?? ""}
                  skillData={skillData}
                  navigation={navigation}
                  logger={logger}
                  user={user}
                  locale={locale}
                  t={t}
                />
              )}
              <ShareEarnButton
                skillId={skillId ?? ""}
                user={user}
                logger={logger}
                locale={locale}
                t={t}
                navigation={navigation}
              />
            </Div>
          )}

          {/* Creator attribution */}
          {creator && (
            <>
              <Div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  margin: "28px auto 0",
                  maxWidth: 320,
                }}
              />
              <Link
                href={`/${locale}/creator/${creator.creatorSlug}`}
                className="no-underline"
              >
                <Div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 16,
                    opacity: 0.5,
                  }}
                >
                  <Span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${accent}20`,
                      border: `1px solid ${accent}30`,
                      flexShrink: 0,
                    }}
                  >
                    {creator.avatarUrl ? (
                      <Image
                        src={creator.avatarUrl}
                        alt={creator.publicName}
                        width={24}
                        height={24}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                  </Span>
                  <Span style={{ fontSize: 12 }}>by {creator.publicName}</Span>
                  <ArrowRight className="h-3 w-3" />
                </Div>
              </Link>
            </>
          )}
        </Div>

        {/* ── DETAILS ── */}
        <Div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            width: "100%",
            paddingTop: 24,
            paddingBottom: 32,
            paddingLeft: 16,
            paddingRight: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Description — open prose, no collapse */}
          {skillData?.description && (
            <Span
              style={{
                display: "block",
                fontSize: 14,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.6)",
                padding: "0 4px",
              }}
            >
              {skillData.description}
            </Span>
          )}

          {/* Variants — top-level, VariantCard has own border */}
          {!isLoading && variantsToRender.length > 0 && (
            <Div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {variantsToRender.map((v) => (
                <VariantCard
                  key={v.id}
                  variant={v}
                  skillId={skillId ?? ""}
                  skillData={skillData}
                  isDefault={v.isDefault ?? false}
                  logger={logger}
                  user={user}
                  locale={locale}
                  favorites={favorites}
                  t={t}
                  viewDefaults={viewDefaults}
                  isOwner={isOwner}
                  handleDelete={handleDelete}
                  defaultExpanded={false}
                />
              ))}
            </Div>
          )}

          {/* Creator card — avatar + name + bio + social links */}
          {creator && (
            <Div style={cardStyle}>
              {/* Creator identity row */}
              <Div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 20px",
                }}
              >
                <Span
                  style={{
                    flexShrink: 0,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${accent}40`,
                    background: `${accent}12`,
                  }}
                >
                  {creator.avatarUrl ? (
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.publicName}
                      width={48}
                      height={48}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Span style={{ color: `${accent}88` }}>
                      <User className="w-5 h-5" />
                    </Span>
                  )}
                </Span>
                <Div style={{ flex: 1, minWidth: 0 }}>
                  <Span
                    style={{
                      display: "block",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: creator.bio ? 4 : 0,
                    }}
                  >
                    {creator.publicName}
                  </Span>
                  {creator.bio && (
                    <Span
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {creator.bio}
                    </Span>
                  )}
                </Div>
                <Link
                  href={`/${locale}/creator/${creator.creatorSlug}`}
                  className="no-underline flex-shrink-0"
                >
                  <Span
                    style={{
                      fontSize: 12,
                      color: `${accent}80`,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("get.landing.viewProfile")}
                    <ArrowRight className="h-3 w-3" />
                  </Span>
                </Link>
              </Div>

              {/* Social link rows */}
              {socialLinks.map(({ key, url, label }, idx) => (
                <Link
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 20px",
                      borderTop:
                        idx === 0
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <Span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        width: 72,
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </Span>
                    <Span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.35)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayDomain(url)}
                    </Span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                  </Div>
                </Link>
              ))}
            </Div>
          )}

          {/* System prompt — collapsible, only if present */}
          {skillData?.systemPrompt && (
            <Div style={cardStyle}>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 20px",
                      cursor: "pointer",
                    }}
                  >
                    <Span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                        flex: 1,
                      }}
                    >
                      {t("get.landing.aboutSkill")}
                    </Span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                  </Div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Div
                    style={{
                      padding: "0 20px 16px",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {SystemPromptSection}
                  </Div>
                </CollapsibleContent>
              </Collapsible>
            </Div>
          )}

          {/* Lead capture — inline, always visible when active */}
          {creator?.leadMagnetActive && skillId && (
            <Div style={{ ...cardStyle, padding: "16px 20px" }}>
              <LeadCaptureForm
                skillId={skillId}
                headline={creator.leadMagnetHeadline}
                buttonText={creator.leadMagnetButtonText}
                locale={locale}
                t={t}
              />
            </Div>
          )}

          {/* More from creator */}
          {creator && (
            <CreatorOtherSkills
              creatorUserId={creator.userId}
              creatorSlug={creator.creatorSlug}
              creatorName={creator.publicName}
              currentSkillId={skillId ?? ""}
              locale={locale}
              t={t}
              accent={accent}
            />
          )}

          {/* Bottom CTA (guest only) */}
          <LandingBottomCTA
            skillName={skillData?.name ?? ""}
            locale={locale}
            signupUrl={signupUrl}
            t={t}
            user={user}
            navigation={navigation}
          />

          {/* Footer */}
          <Div style={{ padding: "12px 0", textAlign: "center" }}>
            <Span style={{ fontSize: 12, opacity: 0.2 }}>
              {t("get.landing.copyright")} unbottled.ai
            </Span>
          </Div>
        </Div>
      </Div>
    );
  }

  // ── PANEL MODE (existing layout, unchanged) ────────────────────────────────
  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex flex-row gap-2 px-4 pt-4 pb-2 items-center">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex-1" />
        {skillId && (
          <Link
            href={`/${locale}/skill/${skillId}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
            title={t("get.openFullPage")}
          >
            <Maximize className="h-4 w-4" />
          </Link>
        )}
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
              {skillData?.icon ? (
                <Span style={{ color: `${accent}cc` }}>
                  <Icon icon={skillData.icon as IconKey} className="w-9 h-9" />
                </Span>
              ) : (
                <Skeleton className="w-9 h-9 rounded-full" />
              )}
            </Span>
          </Div>

          {/* name */}
          {skillData?.name ? (
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
              {skillData.name}
            </Span>
          ) : (
            <Skeleton className="h-12 w-48 mx-auto mb-3" />
          )}

          {/* tagline */}
          {skillData?.tagline ? (
            <Span
              style={{
                display: "block",
                fontSize: 14,
                opacity: 0.7,
                lineHeight: 1.5,
                marginBottom: skillData.description ? 16 : 4,
              }}
            >
              {skillData.tagline}
            </Span>
          ) : (
            <Skeleton className="h-4 w-40 mx-auto mb-2" />
          )}

          {/* description */}
          {skillData?.description && (
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
              {skillData.description}
            </Span>
          )}
        </Div>

        {/* ── VARIANTS (with per-variant actions + model details) ── */}
        <Div className="px-4 pb-4 flex flex-col gap-4">
          {!isLoading && variantsToRender.length > 0 && (
            <Div className="flex flex-col gap-2">
              {/* Owner / non-owner header row */}
              <Div className="flex items-center justify-between">
                {variantsToRender.length > 1 && (
                  <Div className="text-sm font-semibold opacity-60">
                    {t("get.variants.title")}
                  </Div>
                )}
                <Div className="flex-1" />
                {isOwner && skillId ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground"
                    onClick={async () => {
                      const patchDef = await import("./definition");
                      navigation.push(patchDef.default.PATCH, {
                        urlPathParams: { id: skillId },
                        popNavigationOnSuccess: 1,
                        prefillFromGet: true,
                        getEndpoint: patchDef.default.GET,
                      });
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    {t("get.edit")}
                  </Button>
                ) : skillId ? (
                  <EditSkillButton
                    skillId={skillId}
                    navigation={navigation}
                    t={t}
                    isOwner={false}
                    variant="ghost"
                    size="sm"
                  />
                ) : null}
              </Div>

              {variantsToRender.map((v) => (
                <VariantCard
                  key={v.id}
                  variant={v}
                  skillId={skillId ?? ""}
                  skillData={skillData}
                  isDefault={v.isDefault ?? false}
                  logger={logger}
                  user={user}
                  locale={locale}
                  favorites={favorites}
                  t={t}
                  viewDefaults={viewDefaults}
                  isOwner={isOwner}
                  handleDelete={handleDelete}
                  defaultExpanded={false}
                />
              ))}

              {/* Owner: Add Variant — styled like a variant card */}
              {isOwner && skillId && (
                <Div
                  className="rounded-lg border border-dashed border-muted-foreground/30 overflow-hidden transition-colors hover:border-primary/40 hover:bg-muted/20 cursor-pointer"
                  onClick={async () => {
                    const patchDef = await import("./definition");
                    navigation.push(patchDef.default.PATCH, {
                      urlPathParams: { id: skillId },
                      popNavigationOnSuccess: 1,
                      prefillFromGet: true,
                      getEndpoint: patchDef.default.GET,
                    });
                  }}
                >
                  <Div className="flex items-center gap-2 px-3 py-2.5">
                    <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <Div className="flex-1 min-w-0">
                      <Span className="text-sm text-muted-foreground">
                        {t("get.addVariant")}
                      </Span>
                      <Span className="text-xs text-muted-foreground/60 ml-2">
                        {t("get.addVariantHint")}
                      </Span>
                    </Div>
                  </Div>
                </Div>
              )}
            </Div>
          )}

          {/* ── SYSTEM PROMPT ── */}
          <Div className="flex flex-col gap-4">{SystemPromptSection}</Div>

          {/* ── LEAD CAPTURE (if creator has active config) ── */}
          {creator?.leadMagnetActive && skillId && (
            <LeadCaptureForm
              skillId={skillId}
              headline={creator.leadMagnetHeadline}
              buttonText={creator.leadMagnetButtonText}
              locale={locale}
              t={t}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Expandable variant card — shows variant name + chat model summary in collapsed state.
 * On expand: per-variant model groups (brain, eyes, ears & voice, media) + action buttons.
 */
function VariantCard({
  variant,
  skillId,
  skillData,
  isDefault,
  logger,
  user,
  locale,
  favorites,
  t,
  viewDefaults,
  isOwner,
  handleDelete,
  defaultExpanded,
}: {
  variant: SkillVariantData;
  skillId: string;
  skillData: SkillGetResponseOutput | null | undefined;
  isDefault: boolean;
  logger: ReturnType<typeof useWidgetContext>["logger"];
  user: ReturnType<typeof useWidgetContext>["user"];
  locale: CountryLanguage;
  favorites: FavoriteCard[];
  t: ReturnType<typeof useWidgetTranslation>;
  viewDefaults: ReturnType<typeof useViewDefaults>;
  isOwner: boolean;
  handleDelete: () => void;
  defaultExpanded: boolean;
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Resolve all models for THIS variant (with skill-level + platform fallbacks)
  const resolved = useMemo(() => {
    const chatSel = variant.modelSelection ?? viewDefaults.chat ?? null;
    const ttsSel =
      variant.voiceModelSelection ??
      skillData?.voiceModelSelection ??
      viewDefaults.tts ??
      null;
    const sttSel =
      variant.sttModelSelection ??
      skillData?.sttModelSelection ??
      viewDefaults.stt ??
      null;
    const imageVisionSel =
      variant.imageVisionModelSelection ??
      skillData?.imageVisionModelSelection ??
      viewDefaults.imageVision ??
      null;
    const videoVisionSel =
      variant.videoVisionModelSelection ??
      skillData?.videoVisionModelSelection ??
      viewDefaults.videoVision ??
      null;
    const audioVisionSel =
      variant.audioVisionModelSelection ??
      skillData?.audioVisionModelSelection ??
      viewDefaults.audioVision ??
      null;
    const imageGenSel =
      variant.imageGenModelSelection ??
      skillData?.imageGenModelSelection ??
      viewDefaults.imageGen ??
      null;
    const musicGenSel =
      variant.musicGenModelSelection ??
      skillData?.musicGenModelSelection ??
      viewDefaults.musicGen ??
      null;
    const videoGenSel =
      variant.videoGenModelSelection ??
      skillData?.videoGenModelSelection ??
      viewDefaults.videoGen ??
      null;
    return {
      chat: chatSel ? getBestChatModel(chatSel, user) : null,
      tts: ttsSel ? getBestTtsModel(ttsSel, user) : null,
      stt: sttSel ? getBestSttModel(sttSel, user) : null,
      imageVision: imageVisionSel
        ? getBestImageVisionModel(imageVisionSel, user)
        : null,
      videoVision: videoVisionSel
        ? getBestVideoVisionModel(videoVisionSel, user)
        : null,
      audioVision: audioVisionSel
        ? getBestAudioVisionModel(audioVisionSel, user)
        : null,
      imageGen: imageGenSel ? getBestImageGenModel(imageGenSel, user) : null,
      musicGen: musicGenSel ? getBestMusicGenModel(musicGenSel, user) : null,
      videoGen: videoGenSel ? getBestVideoGenModel(videoGenSel, user) : null,
    };
  }, [variant, skillData, viewDefaults, user]);

  const provider = resolved.chat
    ? modelProviders[resolved.chat.provider]
    : null;
  const skillReferenceIds = skillData?.internalId
    ? [skillId, skillData.internalId]
    : [skillId];

  // Check if this specific variant is already in favorites
  const matchingFav = favorites.find(
    (fav) =>
      skillReferenceIds.includes(parseSkillId(fav.skillId).skillId) &&
      parseSkillId(fav.skillId).variantId === variant.id,
  );
  const isFavorited = matchingFav !== undefined;
  const isActive = matchingFav?.activeBadge === "active";

  const charData: SkillDataForFavorite | undefined = skillData
    ? {
        id: skillId,
        icon: skillData.icon ?? null,
        name: skillData.name ?? null,
        tagline: skillData.tagline ?? null,
        description: skillData.description ?? null,
        voiceModelSelection:
          variant.voiceModelSelection ?? skillData.voiceModelSelection ?? null,
        modelSelection: variant.modelSelection ?? null,
      }
    : undefined;

  const { addToFavorites, isLoading } = useAddToFavorites({
    skillId: formatSkillId(skillId, variant.id),
    logger,
    user,
    locale,
    characterData: charData,
  });

  const [isActivating, setIsActivating] = useState(false);
  const handleUseNow = useCallback((): void => {
    void (async (): Promise<void> => {
      if (!matchingFav || !user) {
        return;
      }
      setIsActivating(true);
      const { ChatSettingsRepositoryClient } =
        await import("../../settings/repository-client");
      await ChatSettingsRepositoryClient.selectFavorite({
        favoriteId: matchingFav.id,
        modelId: resolved.chat?.id ?? null,
        skillId,
        logger,
        locale,
        user,
      });
      setIsActivating(false);
    })();
  }, [matchingFav, user, resolved.chat, skillId, logger, locale]);

  const handleGoToChat = useCallback((): void => {
    window.location.href = `/${locale}/threads`;
  }, [locale]);

  // displayName is pre-resolved server-side (system skills) or set by the user (custom skills)
  const variantDisplayName = variant.displayName ?? variant.id;

  return (
    <Div
      className={cn(
        "rounded-lg border overflow-hidden transition-colors",
        isDefault && "border-primary/30",
      )}
    >
      {/* Header — always visible, click to expand */}
      <Div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((p) => !p)}
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />

        {/* Variant name + default badge */}
        <Div className="flex-1 min-w-0 flex items-center gap-2">
          <Span className="text-sm font-medium truncate">
            {variantDisplayName}
          </Span>
          {isDefault && (
            <Span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
              {t("patch.variants.defaultBadge")}
            </Span>
          )}
        </Div>

        {/* Model pill */}
        {resolved.chat && (
          <Div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            {provider?.icon && (
              <Icon icon={provider.icon} className="w-3 h-3" />
            )}
            <Span className="truncate max-w-[100px]">{resolved.chat.name}</Span>
          </Div>
        )}

        {/* Primary action — always visible in header */}
        <Div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!isFavorited ? (
            <Button
              variant="default"
              size="sm"
              className="h-7 gap-1 text-xs px-2.5"
              onClick={addToFavorites}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Zap className="h-3 w-3" />
              )}
              {t("get.quickAdd")}
            </Button>
          ) : isActive ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs px-2.5"
              onClick={handleGoToChat}
            >
              <ArrowRight className="h-3 w-3" />
              {t("get.goToChat")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 gap-1 text-xs px-2.5"
              onClick={handleUseNow}
              disabled={isActivating}
            >
              {isActivating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Star className="h-3 w-3" />
              )}
              {t("get.useNow")}
            </Button>
          )}
        </Div>
      </Div>

      {/* Expanded content */}
      {expanded && (
        <Div className="px-3 pb-3 flex flex-col gap-3 border-t pt-3">
          {/* ── BRAIN ── */}
          {resolved.chat && (
            <ModelGroup
              icon={<Brain className="w-3.5 h-3.5" />}
              label={t("get.models.brain")}
            >
              <ModelCard
                model={resolved.chat}
                slot={t("get.models.slots.chat")}
                locale={locale}
              />
            </ModelGroup>
          )}

          {/* ── EYES ── */}
          {(resolved.imageVision ?? resolved.videoVision) && (
            <ModelGroup
              icon={<Eye className="w-3.5 h-3.5" />}
              label={t("get.models.eyes")}
            >
              {resolved.imageVision && (
                <ModelCard
                  model={resolved.imageVision}
                  slot={t("get.models.slots.imageVision")}
                  locale={locale}
                />
              )}
              {resolved.videoVision && (
                <ModelCard
                  model={resolved.videoVision}
                  slot={t("get.models.slots.videoVision")}
                  locale={locale}
                />
              )}
            </ModelGroup>
          )}

          {/* ── EARS & VOICE ── */}
          {(resolved.stt ?? resolved.tts ?? resolved.audioVision) && (
            <ModelGroup
              icon={<Mic className="w-3.5 h-3.5" />}
              label={t("get.models.ears")}
            >
              {resolved.stt && (
                <ModelCard
                  model={resolved.stt}
                  slot={t("get.models.slots.stt")}
                  locale={locale}
                />
              )}
              {resolved.tts && (
                <ModelCard
                  model={resolved.tts}
                  slot={t("get.models.slots.tts")}
                  locale={locale}
                />
              )}
              {resolved.audioVision && (
                <ModelCard
                  model={resolved.audioVision}
                  slot={t("get.models.slots.audioVision")}
                  locale={locale}
                />
              )}
            </ModelGroup>
          )}

          {/* ── MEDIA ── */}
          {(resolved.imageGen ?? resolved.musicGen ?? resolved.videoGen) && (
            <ModelGroup
              icon={<Film className="w-3.5 h-3.5" />}
              label={t("get.models.media")}
            >
              {resolved.imageGen && (
                <ModelCard
                  model={resolved.imageGen}
                  slot={t("get.models.slots.imageGen")}
                  locale={locale}
                />
              )}
              {resolved.musicGen && (
                <ModelCard
                  model={resolved.musicGen}
                  slot={t("get.models.slots.musicGen")}
                  locale={locale}
                />
              )}
              {resolved.videoGen && (
                <ModelCard
                  model={resolved.videoGen}
                  slot={t("get.models.slots.videoGen")}
                  locale={locale}
                />
              )}
            </ModelGroup>
          )}

          {/* ── OWNER ACTIONS ── */}
          {isOwner && (
            <Div className="flex items-center gap-2 pt-1 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-destructive hover:bg-destructive/10 ml-auto"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("get.delete")}
              </Button>
            </Div>
          )}
        </Div>
      )}
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

/** Extract display domain from a URL for social link display */
function displayDomain(url: string): string {
  try {
    const u = new URL(url);
    return (
      u.hostname.replace(/^www\./, "") +
      (u.pathname.length > 1 ? u.pathname : "")
    );
  } catch {
    return url;
  }
}

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

// ── LEAD CAPTURE FORM ────────────────────────────────────────────────────────

type CaptureState = "idle" | "submitting" | "done" | "error";

/**
 * Email capture form — shown when creator has active lead magnet config.
 * Works in both landing page and panel mode.
 */
function LeadCaptureForm({
  skillId,
  headline,
  buttonText,
  locale,
  t,
}: {
  skillId: string;
  headline: string | null;
  buttonText: string | null;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const [state, setState] = useState<CaptureState>("idle");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback((): void => {
    if (!firstName.trim() || !email.trim()) {
      return;
    }
    setState("submitting");
    void (async (): Promise<void> => {
      try {
        const [{ apiClient }, captureDef] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("@/app/api/[locale]/lead-magnet/capture/definition"),
        ]);
        const { createClientLogger } =
          await import("@/app/api/[locale]/system/unified-interface/shared/logger/client-logger");
        const logger = createClientLogger(false, Date.now(), locale);
        const result = await apiClient.mutate(
          captureDef.POST,
          logger,
          { id: "", isPublic: true, roles: [], leadId: "" } as never,
          { skillId, firstName: firstName.trim(), email: email.trim() },
          undefined,
          locale,
        );
        setState(result.success ? "done" : "error");
      } catch {
        setState("error");
      }
    })();
  }, [skillId, firstName, email, locale]);

  const displayHeadline = headline ?? t("get.leadCapture.fallbackHeadline");
  const displayButton = buttonText ?? t("get.leadCapture.fallbackButton");

  if (state === "done") {
    return (
      <Div
        style={{
          padding: "24px 20px",
          borderRadius: 12,
          border: "1px solid rgba(139,92,246,0.25)",
          background: "rgba(139,92,246,0.08)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
        }}
      >
        <Span
          style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}
        >
          {t("get.leadCapture.doneHeading")}
        </Span>
        <Span
          style={{
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            fontSize: 13,
          }}
        >
          {t("get.leadCapture.doneSub")}
        </Span>
      </Div>
    );
  }

  return (
    <Div
      style={{
        padding: "20px 20px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
        {displayHeadline}
      </Span>
      <Div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <Input
          value={firstName}
          onChange={(e): void => setFirstName(e.target.value)}
          placeholder={t("get.leadCapture.namePlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          placeholder={t("get.leadCapture.emailPlaceholder")}
          disabled={state === "submitting"}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500"
        />
        <Button
          onClick={handleSubmit}
          disabled={
            state === "submitting" || !firstName.trim() || !email.trim()
          }
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {state === "submitting"
            ? t("get.leadCapture.sending")
            : displayButton}
        </Button>
        {state === "error" && (
          <Span style={{ fontSize: 12, color: "rgba(255,100,100,0.8)" }}>
            {t("get.leadCapture.error")}
          </Span>
        )}
      </Div>
      <Span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        {t("get.leadCapture.finePrint")}
      </Span>
    </Div>
  );
}

// ── LANDING PAGE COMPONENTS ──────────────────────────────────────────────────

/**
 * Bottom CTA for landing page — signup/login for guests
 */
function LandingBottomCTA({
  skillName,
  locale,
  signupUrl,
  t,
  user,
  navigation,
}: {
  skillName: string;
  locale: CountryLanguage;
  signupUrl: string | null;
  t: ReturnType<typeof useWidgetTranslation>;
  user: ReturnType<typeof useWidgetContext>["user"];
  navigation: ReturnType<typeof useWidgetNavigation>;
}): React.JSX.Element | null {
  if (!user.isPublic) {
    return null;
  }

  const handleLogin = (): void => {
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/login/definition");
      navigation.push(def.default.POST);
    })();
  };

  return (
    <Div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <Span
        style={{
          display: "block",
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          marginBottom: 8,
        }}
      >
        {t("get.landing.tryCta", { name: skillName })}
      </Span>
      <Span
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.4)",
          display: "block",
          marginBottom: 24,
        }}
      >
        {t("get.landing.tryCtaSub")}
      </Span>
      <Div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Link
          href={signupUrl ?? `/${locale}/user/signup`}
          className="no-underline"
        >
          <Span className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-violet-600 text-white cursor-pointer">
            <UserPlus className="w-4 h-4" />
            {t("get.landing.startFree")}
          </Span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/40 hover:text-white/70"
          onClick={handleLogin}
        >
          {t("get.landing.alreadyHaveAccount")}
        </Button>
      </Div>
    </Div>
  );
}

/**
 * Shows other public skills by the same creator — fetched client-side.
 */
function CreatorOtherSkills({
  creatorUserId,
  creatorSlug,
  creatorName,
  currentSkillId,
  locale,
  t,
  accent,
}: {
  creatorUserId: string;
  creatorSlug: string;
  creatorName: string;
  currentSkillId: string;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation>;
  accent: string;
}): React.JSX.Element | null {
  const [skills, setSkills] = useState<
    Array<{
      id: string;
      slug: string | null;
      icon: string | null;
      name: string;
      tagline: string | null;
    }>
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async (): Promise<void> => {
      try {
        const [{ apiClient }, listDef] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("@/app/api/[locale]/agent/chat/skills/definition"),
        ]);
        const { createClientLogger } =
          await import("@/app/api/[locale]/system/unified-interface/shared/logger/client-logger");
        const logger = createClientLogger(false, Date.now(), locale);
        const result = await apiClient.fetch(
          listDef.default.GET,
          logger,
          { id: "", isPublic: true, roles: [], leadId: "" } as never,
          { sourceFilter: "enums.source.community" as const },
          undefined,
          locale,
        );
        if (result.success && Array.isArray(result.data)) {
          const filtered = (
            result.data as Array<{
              id: string;
              slug: string | null;
              icon: string | null;
              name: string;
              tagline: string | null;
              userId?: string;
              ownershipType?: string;
            }>
          ).filter(
            (s) =>
              s.id !== currentSkillId &&
              s.ownershipType !== "enums.ownershipType.system",
          );
          setSkills(filtered.slice(0, 6));
        }
      } catch {
        // Silent fail — optional section
      }
      setLoaded(true);
    })();
  }, [creatorUserId, currentSkillId, locale]);

  if (!loaded || skills.length === 0) {
    return null;
  }

  return (
    <Div
      style={{
        borderTop: `1px solid ${accent}15`,
        padding: "32px 24px",
      }}
    >
      <Span
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: `${accent}70`,
          marginBottom: 16,
        }}
      >
        {t("get.landing.moreFromCreator", { name: creatorName })}
      </Span>

      <Div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {skills.map((s) => (
          <Link
            key={s.id}
            href={`/${locale}/skill/${s.slug ?? s.id}`}
            className="no-underline"
          >
            <Div
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${accent}12`,
                  flexShrink: 0,
                }}
              >
                {s.icon ? (
                  <Span style={{ color: `${accent}aa` }}>
                    <Icon icon={s.icon as IconKey} className="w-4.5 h-4.5" />
                  </Span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </Span>
              <Div className="min-w-0">
                <Span
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.name}
                </Span>
                {s.tagline && (
                  <Span
                    style={{
                      display: "block",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.35)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.tagline}
                  </Span>
                )}
              </Div>
            </Div>
          </Link>
        ))}
      </Div>

      <Div style={{ marginTop: 16, textAlign: "center" }}>
        <Link
          href={`/${locale}/creator/${creatorSlug}`}
          className="no-underline"
        >
          <Span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: `${accent}80`,
            }}
          >
            {t("get.landing.viewProfile")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Span>
        </Link>
      </Div>
    </Div>
  );
}

// ── END LANDING PAGE COMPONENTS ─────────────────────────────────────────────

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
                  ? "bg-blue-500/10 text-info"
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
            skillData={field.value}
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
            navigation={navigation}
          />
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
  navigation,
}: {
  skillId: string;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation>;
  user: ReturnType<typeof useWidgetContext>["user"];
  logger: ReturnType<typeof useWidgetContext>["logger"];
  navigation: ReturnType<typeof useWidgetNavigation>;
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

  const handleSignup = (): void => {
    setOpen(false);
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/signup/definition");
      navigation.push(def.default.POST);
    })();
  };

  const handleLogin = (): void => {
    setOpen(false);
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/user/public/login/definition");
      navigation.push(def.default.POST);
    })();
  };

  const handleOpen = async (): Promise<void> => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);

    // Public users can't create referral codes - show auth prompt
    if (user.isPublic) {
      return;
    }

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

            {user.isPublic ? (
              <Div className="flex flex-col gap-3 pt-1">
                <Span className="text-xs text-muted-foreground">
                  {t("get.share.authRequired")}
                </Span>
                <Div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={handleSignup}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t("get.share.signup")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleLogin}
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    {t("get.share.login")}
                  </Button>
                </Div>
              </Div>
            ) : loading ? (
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
  skillData,
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
  skillData: SkillGetResponseOutput | null | undefined;
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

      // Use skillData if available, otherwise fetch
      let fullChar = skillData;

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

// ── VARIANT EDITOR ────────────────────────────────────────────────────────────

type VariantActiveSelector =
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
 * Platform defaults for all 9 model modalities.
 * Computed once and passed down to avoid re-computing in each VariantEditorPanel.
 */
export interface VariantPlatformDefaults {
  chat: ChatModelSelection | undefined;
  tts: VoiceModelSelection | undefined;
  imageGen: ImageGenModelSelection | undefined;
  musicGen: MusicGenModelSelection | undefined;
  videoGen: VideoGenModelSelection | undefined;
  stt: SttModelSelection | undefined;
  imageVision: ImageVisionModelSelection | undefined;
  videoVision: VideoVisionModelSelection | undefined;
  audioVision: AudioVisionModelSelection | undefined;
}

/**
 * Hook to compute platform-level defaults for all model modalities.
 * Mirrors the logic in SkillEditContainer to avoid duplication.
 */
export function useVariantPlatformDefaults(
  user: ReturnType<typeof useWidgetUser>,
): VariantPlatformDefaults {
  return useMemo(() => {
    const mkChat = (): ChatModelSelection | undefined => {
      const m = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user);
      if (!m) {
        return undefined;
      }
      const p = chatModelSelectionSchema.safeParse({
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: m.id,
      });
      return p.success ? p.data : undefined;
    };
    const mkTts = (): VoiceModelSelection | undefined => {
      const m = getBestTtsModel(DEFAULT_TTS_MODEL_SELECTION, user);
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
      const m = getBestImageGenModel(DEFAULT_IMAGE_GEN_MODEL_SELECTION, user);
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
      const m = getBestMusicGenModel(DEFAULT_MUSIC_GEN_MODEL_SELECTION, user);
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
      const m = getBestVideoGenModel(DEFAULT_VIDEO_GEN_MODEL_SELECTION, user);
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
      const m = getBestSttModel(DEFAULT_STT_MODEL_SELECTION, user);
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
      tts: mkTts(),
      imageGen: mkImageGen(),
      musicGen: mkMusicGen(),
      videoGen: mkVideoGen(),
      stt: mkStt(),
      imageVision: mkImageVision(),
      videoVision: mkVideoVision(),
      audioVision: mkAudioVision(),
    };
  }, [user]);
}

/**
 * Editor for a single SkillVariantData. Renders all 9 model selectors + displayName field.
 * Has its own activeSelector state so expanding one variant's selector doesn't affect others.
 */
export function VariantEditorPanel({
  variant,
  onChange,
  platformDefaults,
  locale,
  user,
  t,
}: {
  variant: SkillVariantData;
  onChange: (updated: SkillVariantData) => void;
  platformDefaults: VariantPlatformDefaults;
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const [activeSelector, setActiveSelector] =
    useState<VariantActiveSelector>(null);

  const update = useCallback(
    (patch: Partial<SkillVariantData>): void => {
      onChange({ ...variant, ...patch });
    },
    [variant, onChange],
  );

  if (activeSelector === "chat") {
    return (
      <ModelSelector
        modelSelection={variant.modelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = chatModelSelectionSchema.nullable().safeParse(sel);
          if (parsed.success && parsed.data) {
            update({ modelSelection: parsed.data });
          }
        }}
        onSelect={(confirmed) => {
          const parsed = chatModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          if (parsed.success && parsed.data) {
            update({ modelSelection: parsed.data });
          }
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
        chatOnly
      />
    );
  }

  if (activeSelector === "voice") {
    return (
      <ModelSelector
        allowedRoles={["tts"]}
        modelSelection={variant.voiceModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = voiceModelSelectionSchema.nullable().safeParse(sel);
          update({
            voiceModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = voiceModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.tts !== undefined &&
            "manualModelId" in platformDefaults.tts &&
            platformDefaults.tts.manualModelId === value.manualModelId;
          update({
            voiceModelSelection: isDefault ? undefined : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "imageGen") {
    return (
      <ModelSelector
        allowedRoles={["image-gen"]}
        modelSelection={variant.imageGenModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = imageGenModelSelectionSchema.nullable().safeParse(sel);
          update({
            imageGenModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = imageGenModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.imageGen !== undefined &&
            "manualModelId" in platformDefaults.imageGen &&
            platformDefaults.imageGen.manualModelId === value.manualModelId;
          update({
            imageGenModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "musicGen") {
    return (
      <ModelSelector
        allowedRoles={["audio-gen"]}
        modelSelection={variant.musicGenModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = musicGenModelSelectionSchema.nullable().safeParse(sel);
          update({
            musicGenModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = musicGenModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.musicGen !== undefined &&
            "manualModelId" in platformDefaults.musicGen &&
            platformDefaults.musicGen.manualModelId === value.manualModelId;
          update({
            musicGenModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "videoGen") {
    return (
      <ModelSelector
        allowedRoles={["video-gen"]}
        modelSelection={variant.videoGenModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = videoGenModelSelectionSchema.nullable().safeParse(sel);
          update({
            videoGenModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = videoGenModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.videoGen !== undefined &&
            "manualModelId" in platformDefaults.videoGen &&
            platformDefaults.videoGen.manualModelId === value.manualModelId;
          update({
            videoGenModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "stt") {
    return (
      <ModelSelector
        allowedRoles={["stt"]}
        modelSelection={variant.sttModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = sttModelSelectionSchema.nullable().safeParse(sel);
          update({
            sttModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = sttModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.stt !== undefined &&
            "manualModelId" in platformDefaults.stt &&
            platformDefaults.stt.manualModelId === value.manualModelId;
          update({
            sttModelSelection: isDefault ? undefined : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "imageVision") {
    return (
      <ModelSelector
        allowedRoles={["image-vision"]}
        modelSelection={variant.imageVisionModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = imageVisionModelSelectionSchema
            .nullable()
            .safeParse(sel);
          update({
            imageVisionModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = imageVisionModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.imageVision !== undefined &&
            "manualModelId" in platformDefaults.imageVision &&
            platformDefaults.imageVision.manualModelId === value.manualModelId;
          update({
            imageVisionModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "videoVision") {
    return (
      <ModelSelector
        allowedRoles={["video-vision"]}
        modelSelection={variant.videoVisionModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = videoVisionModelSelectionSchema
            .nullable()
            .safeParse(sel);
          update({
            videoVisionModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = videoVisionModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.videoVision !== undefined &&
            "manualModelId" in platformDefaults.videoVision &&
            platformDefaults.videoVision.manualModelId === value.manualModelId;
          update({
            videoVisionModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  if (activeSelector === "audioVision") {
    return (
      <ModelSelector
        allowedRoles={["audio-vision"]}
        modelSelection={variant.audioVisionModelSelection ?? undefined}
        onChange={(sel) => {
          const parsed = audioVisionModelSelectionSchema
            .nullable()
            .safeParse(sel);
          update({
            audioVisionModelSelection: parsed.success
              ? (parsed.data ?? undefined)
              : undefined,
          });
        }}
        onSelect={(confirmed) => {
          const parsed = audioVisionModelSelectionSchema
            .nullable()
            .safeParse(confirmed);
          const value = parsed.success ? parsed.data : null;
          const isDefault =
            value !== null &&
            "manualModelId" in value &&
            platformDefaults.audioVision !== undefined &&
            "manualModelId" in platformDefaults.audioVision &&
            platformDefaults.audioVision.manualModelId === value.manualModelId;
          update({
            audioVisionModelSelection: isDefault
              ? undefined
              : (value ?? undefined),
          });
          setActiveSelector(null);
        }}
        locale={locale}
        user={user}
      />
    );
  }

  return (
    <Div className="flex flex-col gap-3">
      {/* Back button when a selector was open and user navigated back */}

      {/* Display name */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium opacity-60">
          {t("patch.variants.namePlaceholder")}
        </Span>
        <Input
          value={variant.displayName ?? ""}
          onChange={(e) => {
            const val = e.target.value.slice(0, 50);
            update({ displayName: val || undefined });
          }}
          placeholder={t("patch.variants.namePlaceholder")}
          className="h-8 text-sm"
        />
      </Div>

      {/* ── BRAIN ── */}
      <ModelGroup
        icon={<Brain className="w-3.5 h-3.5" />}
        label={t("get.models.brain")}
      >
        <ModelSelectorTrigger
          modelSelection={variant.modelSelection ?? undefined}
          defaultModelSelection={platformDefaults.chat}
          placeholder={t("patch.chatModel.placeholder")}
          onClick={() => setActiveSelector("chat")}
          locale={locale}
          user={user}
        />
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
            modelSelection={variant.imageVisionModelSelection ?? undefined}
            allowedRoles={["image-vision"]}
            defaultModelSelection={platformDefaults.imageVision}
            placeholder={t("patch.imageVisionModel.placeholder")}
            onClick={() => setActiveSelector("imageVision")}
            locale={locale}
            user={user}
          />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {t("get.models.slots.videoVision")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={variant.videoVisionModelSelection ?? undefined}
            allowedRoles={["video-vision"]}
            defaultModelSelection={platformDefaults.videoVision}
            placeholder={t("patch.videoVisionModel.placeholder")}
            onClick={() => setActiveSelector("videoVision")}
            locale={locale}
            user={user}
          />
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
            modelSelection={variant.sttModelSelection ?? undefined}
            allowedRoles={["stt"]}
            defaultModelSelection={platformDefaults.stt}
            placeholder={t("patch.sttModel.placeholder")}
            onClick={() => setActiveSelector("stt")}
            locale={locale}
            user={user}
          />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {t("get.models.slots.tts")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={variant.voiceModelSelection ?? undefined}
            allowedRoles={["tts"]}
            defaultModelSelection={platformDefaults.tts}
            placeholder={t("patch.voice.placeholder")}
            onClick={() => setActiveSelector("voice")}
            locale={locale}
            user={user}
          />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {t("get.models.slots.audioVision")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={variant.audioVisionModelSelection ?? undefined}
            allowedRoles={["audio-vision"]}
            defaultModelSelection={platformDefaults.audioVision}
            placeholder={t("patch.audioVisionModel.placeholder")}
            onClick={() => setActiveSelector("audioVision")}
            locale={locale}
            user={user}
          />
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
            modelSelection={variant.imageGenModelSelection ?? undefined}
            allowedRoles={["image-gen"]}
            defaultModelSelection={platformDefaults.imageGen}
            placeholder={t("patch.imageGenModel.placeholder")}
            onClick={() => setActiveSelector("imageGen")}
            locale={locale}
            user={user}
          />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {t("get.models.slots.musicGen")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={variant.musicGenModelSelection ?? undefined}
            allowedRoles={["audio-gen"]}
            defaultModelSelection={platformDefaults.musicGen}
            placeholder={t("patch.musicGenModel.placeholder")}
            onClick={() => setActiveSelector("musicGen")}
            locale={locale}
            user={user}
          />
        </Div>
        <Div className="flex flex-col gap-1">
          <Span className="text-xs opacity-40">
            {t("get.models.slots.videoGen")}
          </Span>
          <ModelSelectorTrigger
            modelSelection={variant.videoGenModelSelection ?? undefined}
            allowedRoles={["video-gen"]}
            defaultModelSelection={platformDefaults.videoGen}
            placeholder={t("patch.videoGenModel.placeholder")}
            onClick={() => setActiveSelector("videoGen")}
            locale={locale}
            user={user}
          />
        </Div>
      </ModelGroup>
    </Div>
  );
}

/**
 * Manages the full variants array: add, remove, set-default, edit each variant.
 * Uses VariantEditorPanel for each variant's model selectors.
 */
export function VariantList({
  variants,
  onChange,
  platformDefaults,
  locale,
  user,
  t,
}: {
  variants: SkillVariantData[];
  onChange: (variants: SkillVariantData[]) => void;
  platformDefaults: VariantPlatformDefaults;
  locale: CountryLanguage;
  user: ReturnType<typeof useWidgetUser>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUpdate = useCallback(
    (updated: SkillVariantData): void => {
      onChange(variants.map((v) => (v.id === updated.id ? updated : v)));
    },
    [variants, onChange],
  );

  const handleSetDefault = useCallback(
    (id: string): void => {
      onChange(
        variants.map((v) => ({
          ...v,
          isDefault: v.id === id,
        })),
      );
    },
    [variants, onChange],
  );

  const handleRemove = useCallback(
    (id: string): void => {
      const next = variants.filter((v) => v.id !== id);
      // If we removed the default, promote the first remaining variant
      if (!next.some((v) => v.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true };
      }
      onChange(next);
      if (expandedId === id) {
        setExpandedId(next[0]?.id ?? null);
      }
    },
    [variants, onChange, expandedId],
  );

  const handleAddVariant = useCallback((): void => {
    const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
    const fallbackModel = getBestChatModel(DEFAULT_CHAT_MODEL_SELECTION, user);
    const fallbackModelSelection: ChatModelSelection | undefined = fallbackModel
      ? chatModelSelectionSchema.safeParse({
          selectionType: ModelSelectionType.MANUAL,
          manualModelId: fallbackModel.id,
        }).data
      : undefined;
    const newVariant: SkillVariantData = {
      id: crypto.randomUUID(),
      isDefault: false,
      modelSelection:
        defaultVariant?.modelSelection ??
        fallbackModelSelection ??
        DEFAULT_CHAT_MODEL_SELECTION,
    };
    const next = [...variants, newVariant];
    onChange(next);
    setExpandedId(newVariant.id);
  }, [variants, onChange, user]);

  return (
    <Div className="flex flex-col gap-2">
      {variants.map((variant) => {
        const isExpanded = expandedId === variant.id;
        const isDefault = variant.isDefault ?? false;
        const canRemove = variants.length > 1;

        return (
          <Div
            key={variant.id}
            className={cn(
              "rounded-lg border overflow-hidden transition-colors",
              isDefault && "border-primary/30",
            )}
          >
            {/* Header row — always visible */}
            <Div className="flex items-center gap-2 px-3 py-2.5">
              {/* Expand toggle */}
              <Div
                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:bg-muted/20 -mx-1 px-1 rounded transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : variant.id)}
              >
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
                <Span className="text-sm font-medium truncate">
                  {variant.displayName ?? variant.id}
                </Span>
              </Div>

              {/* Badges + actions — always in header */}
              <Div className="flex items-center gap-1.5 shrink-0">
                {isDefault ? (
                  <Span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {t("patch.variants.defaultBadge")}
                  </Span>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                    title={t("patch.variants.setDefault")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(variant.id);
                    }}
                  >
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                )}
                {canRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    title={t("patch.variants.remove")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(variant.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </Div>
            </Div>

            {/* Expanded editor */}
            {isExpanded && (
              <Div className="px-3 pb-3 border-t pt-3">
                <VariantEditorPanel
                  variant={variant}
                  onChange={handleUpdate}
                  platformDefaults={platformDefaults}
                  locale={locale}
                  user={user}
                  t={t}
                />
              </Div>
            )}
          </Div>
        );
      })}

      {/* Add Variant button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 w-full border-dashed h-9"
        onClick={handleAddVariant}
      >
        <Plus className="h-3.5 w-3.5" />
        {t("patch.variants.addButton")}
      </Button>
    </Div>
  );
}
