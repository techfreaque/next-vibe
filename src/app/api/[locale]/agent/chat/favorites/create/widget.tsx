/**
 * Custom Widget for Favorite Create
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Span } from "next-vibe-ui/ui/span";
import { useMemo, useState } from "react";

import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import {
  getDefaultModelForRole,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import {
  imageGenModelSelectionSchema,
  musicGenModelSelectionSchema,
  sttModelSelectionSchema,
  videoGenModelSelectionSchema,
  visionModelSelectionSchema,
  voiceModelSelectionSchema,
} from "@/app/api/[locale]/agent/models/types";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import {
  useWidgetForm,
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

import { ModelSelectionType } from "../../skills/enum";
import { useSkill } from "../../skills/[id]/hooks";
import { useChatSettings } from "../../settings/hooks";
import type definition from "./definition";
import type { FavoriteCreateResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: FavoriteCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

/**
 * Custom container widget for favorite creation
 */
export function FavoriteCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const form = useWidgetForm<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const navigate = useWidgetNavigation();
  const [isApplying, setIsApplying] = useState(false);
  const [activeSelector, setActiveSelector] = useState<
    | "chat"
    | "voice"
    | "imageGen"
    | "musicGen"
    | "videoGen"
    | "stt"
    | "visionBridge"
    | null
  >(null);

  const emptyField = useMemo(() => ({}), []);
  const envAvailability = useEnvAvailability();

  // Platform-level default model selections (env-aware)
  const platformTtsDefault = useMemo((): ModelSelectionSimple | undefined => {
    const m = getDefaultModelForRole(["tts"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const platformImageGenDefault = useMemo(():
    | ModelSelectionSimple
    | undefined => {
    const m = getDefaultModelForRole(["image-gen"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const platformMusicGenDefault = useMemo(():
    | ModelSelectionSimple
    | undefined => {
    const m = getDefaultModelForRole(["audio-gen"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const platformVideoGenDefault = useMemo(():
    | ModelSelectionSimple
    | undefined => {
    const m = getDefaultModelForRole(["video-gen"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const platformSttDefault = useMemo((): ModelSelectionSimple | undefined => {
    const m = getDefaultModelForRole(["stt"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const platformLlmDefault = useMemo((): ModelSelectionSimple | undefined => {
    const m = getDefaultModelForRole(["llm"], envAvailability, ["image"]);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const skillId = form.watch("skillId");
  const voiceModelSelection = form.watch("voiceModelSelection");
  const imageGenModelSelection = form.watch("imageGenModelSelection");
  const musicGenModelSelection = form.watch("musicGenModelSelection");
  const videoGenModelSelection = form.watch("videoGenModelSelection");
  const sttModelSelection = form.watch("sttModelSelection");
  const visionBridgeModelSelection = form.watch("visionBridgeModelSelection");
  const isNoSkill = skillId === NO_SKILL_ID;

  const favoriteModelSelection: ModelSelectionSimple | undefined =
    form.watch("modelSelection") ?? undefined;
  const variantId = form.watch("variantId");

  const characterEndpoint = useSkill(skillId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;
  const characterVariant = variantId
    ? characterData?.variants?.find((v) => v.id === variantId)
    : characterData?.variants?.[0];
  const characterModelSelection = characterVariant?.modelSelection;

  const { updateSettings } = useChatSettings(user, logger);

  const handleUseWithoutSaving = async (): Promise<void> => {
    if (!form || !skillId) {
      return;
    }

    setIsApplying(true);
    try {
      // Resolve the model to use
      const modelSelection =
        favoriteModelSelection ?? characterModelSelection ?? null;

      let selectedModel: ModelId | undefined = undefined;

      if (modelSelection) {
        // Resolve model selection to actual ModelId
        const bestModel = SkillsRepositoryClient.getBestModelForSkill(
          modelSelection,
          user,
        );
        selectedModel = bestModel?.id;
      }

      // Apply settings without creating a favorite (activeFavoriteId = null)
      await updateSettings({
        activeFavoriteId: null,
        selectedSkill: skillId,
        selectedModel,
        voiceModelSelection:
          voiceModelSelection ??
          characterData?.voiceModelSelection ??
          undefined,
      });

      // Navigate back
      navigate.pop(1);
    } catch (error) {
      logger.error("Failed to apply settings without saving", {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Div className="flex flex-col gap-0">
      {/* Top Actions: Back + Use Without Saving + Save */}
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleUseWithoutSaving}
          disabled={isApplying || !skillId}
          className="ml-auto h-8 text-xs"
        >
          {isApplying
            ? t("post.useWithoutSavingButton.loadingText")
            : t("post.useWithoutSavingButton.label")}
        </Button>
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            ...children.submitButton,
            size: "sm",
            className: "h-8 text-xs",
          }}
        />
      </Div>
      {/* Scrollable Form Container */}
      <Div className="group overflow-y-auto max-h-[min(800px,calc(100dvh-180px))] px-4 pb-4">
        {activeSelector === "chat" && form ? (
          <ModelSelector
            modelSelection={favoriteModelSelection}
            onChange={(sel) => {
              form.setValue("modelSelection", sel);
            }}
            onSelect={(confirmed) => {
              const charSel = isNoSkill ? undefined : characterModelSelection;
              const isMatchingSkill =
                confirmed !== null &&
                confirmed.selectionType === ModelSelectionType.MANUAL &&
                charSel !== null &&
                charSel !== undefined &&
                charSel.selectionType === ModelSelectionType.MANUAL &&
                charSel.manualModelId === confirmed.manualModelId;
              form.setValue(
                "modelSelection",
                isMatchingSkill ? null : confirmed,
              );
              setActiveSelector(null);
            }}
            characterModelSelection={
              isNoSkill ? undefined : characterModelSelection
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
              form.setValue("voiceModelSelection", isDefault ? null : value);
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
              form.setValue("imageGenModelSelection", isDefault ? null : value);
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
              form.setValue("musicGenModelSelection", isDefault ? null : value);
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
              form.setValue("videoGenModelSelection", isDefault ? null : value);
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
              form.setValue("sttModelSelection", isDefault ? null : value);
              setActiveSelector(null);
            }}
            locale={locale}
            user={user}
          />
        ) : activeSelector === "visionBridge" && form ? (
          <ModelSelector
            allowedRoles={["llm"]}
            requiredInputs={["image"]}
            modelSelection={visionBridgeModelSelection ?? undefined}
            characterModelSelection={
              characterData?.visionBridgeModelSelection ?? platformLlmDefault
            }
            onChange={(sel) => {
              const parsed = visionModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "visionBridgeModelSelection",
                parsed.success ? parsed.data : null,
              );
            }}
            onSelect={(confirmed) => {
              const parsed = visionModelSelectionSchema
                .nullable()
                .safeParse(confirmed);
              const value = parsed.success ? parsed.data : null;
              const isDefault =
                value !== null &&
                "manualModelId" in value &&
                platformLlmDefault !== undefined &&
                "manualModelId" in platformLlmDefault &&
                platformLlmDefault.manualModelId === value.manualModelId;
              form.setValue(
                "visionBridgeModelSelection",
                isDefault ? null : value,
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
              {/* Skill Info Card (hidden for default character) */}
              {!isNoSkill && (
                <Div className="flex items-start gap-4 p-4 rounded-lg border">
                  <IconFieldWidget fieldName="icon" field={children.icon} />
                  <Div className="flex-1 flex flex-col gap-2">
                    <Div className="flex flex-col gap-1">
                      {characterData?.name && (
                        <Span className="font-medium">
                          {characterData.name}
                        </Span>
                      )}
                      {characterData?.tagline && (
                        <Span className="text-sm text-muted-foreground">
                          {characterData.tagline}
                        </Span>
                      )}
                    </Div>
                    {characterData?.description && (
                      <Span className="text-sm">
                        {characterData.description}
                      </Span>
                    )}
                  </Div>
                </Div>
              )}

              {/* Chat Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("post.chatModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={favoriteModelSelection ?? null}
                    characterModelSelection={
                      isNoSkill ? undefined : characterModelSelection
                    }
                    placeholder={t("post.chatModel.placeholder")}
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
                    {t("post.voice.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={voiceModelSelection ?? null}
                    characterModelSelection={
                      characterData?.voiceModelSelection ?? platformTtsDefault
                    }
                    allowedRoles={["tts"]}
                    defaultModelSelection={platformTtsDefault}
                    placeholder={t("post.voice.placeholder")}
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
                    {t("post.imageGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={imageGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.imageGenModelSelection ??
                      platformImageGenDefault
                    }
                    allowedRoles={["image-gen"]}
                    defaultModelSelection={platformImageGenDefault}
                    placeholder={t("post.imageGenModel.placeholder")}
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
                    {t("post.musicGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={musicGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.musicGenModelSelection ??
                      platformMusicGenDefault
                    }
                    allowedRoles={["audio-gen"]}
                    defaultModelSelection={platformMusicGenDefault}
                    placeholder={t("post.musicGenModel.placeholder")}
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
                    {t("post.videoGenModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={videoGenModelSelection ?? null}
                    characterModelSelection={
                      characterData?.videoGenModelSelection ??
                      platformVideoGenDefault
                    }
                    allowedRoles={["video-gen"]}
                    defaultModelSelection={platformVideoGenDefault}
                    placeholder={t("post.videoGenModel.placeholder")}
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
                    {t("post.sttModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={sttModelSelection ?? null}
                    characterModelSelection={
                      characterData?.sttModelSelection ?? platformSttDefault
                    }
                    allowedRoles={["stt"]}
                    defaultModelSelection={platformSttDefault}
                    placeholder={t("post.sttModel.placeholder")}
                    onClick={() => setActiveSelector("stt")}
                    locale={locale}
                    user={user}
                  />
                </Div>
              )}

              {/* Vision Bridge Model Selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("post.visionBridgeModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={visionBridgeModelSelection ?? null}
                    characterModelSelection={
                      characterData?.visionBridgeModelSelection ??
                      platformLlmDefault
                    }
                    allowedRoles={["llm"]}
                    requiredInputs={["image"]}
                    defaultModelSelection={platformLlmDefault}
                    placeholder={t("post.visionBridgeModel.placeholder")}
                    onClick={() => setActiveSelector("visionBridge")}
                    locale={locale}
                    user={user}
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
