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
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { User } from "next-vibe-ui/ui/icons/User";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { Span } from "next-vibe-ui/ui/span";
import { useCallback, useMemo, useState } from "react";

import {
  imageGenModelSelectionSchema,
  musicGenModelSelectionSchema,
  sttModelSelectionSchema,
  videoGenModelSelectionSchema,
  visionModelSelectionSchema,
  voiceModelSelectionSchema,
} from "@/app/api/[locale]/agent/models/types";
import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
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
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import {
  getAllModelOptions,
  getDefaultModelForRole,
} from "@/app/api/[locale]/agent/models/models";
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
    | "visionBridge"
    | null
  >(null);

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
              form.setValue("modelSelection", sel);
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
        ) : activeSelector === "visionBridge" ? (
          <ModelSelector
            allowedRoles={["llm"]}
            requiredInputs={["image"]}
            modelSelection={
              form.watch("visionBridgeModelSelection") ?? undefined
            }
            onChange={(sel) => {
              const parsed = visionModelSelectionSchema
                .nullable()
                .safeParse(sel);
              form.setValue(
                "visionBridgeModelSelection",
                parsed.success ? parsed.data : null,
                { shouldDirty: true },
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

              {/* Vision Bridge model selector */}
              {form && (
                <Div className="flex flex-col gap-1">
                  <Span className="text-xs font-medium text-muted-foreground">
                    {t("patch.visionBridgeModel.label")}
                  </Span>
                  <ModelSelectorTrigger
                    modelSelection={form.watch("visionBridgeModelSelection")}
                    allowedRoles={["llm"]}
                    requiredInputs={["image"]}
                    defaultModelSelection={platformLlmDefault}
                    placeholder={t("patch.visionBridgeModel.placeholder")}
                    onClick={() => setActiveSelector("visionBridge")}
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
  tts: ModelSelectionSimple | undefined;
  imageGen: ModelSelectionSimple | undefined;
  musicGen: ModelSelectionSimple | undefined;
  videoGen: ModelSelectionSimple | undefined;
  stt: ModelSelectionSimple | undefined;
  llm: ModelSelectionSimple | undefined;
} {
  const env = useEnvAvailability();
  return useMemo(() => {
    const mk = (
      roles: Parameters<typeof getDefaultModelForRole>[0],
    ): ModelSelectionSimple | undefined => {
      const m = getDefaultModelForRole(roles, env);
      if (!m) {
        return undefined;
      }
      return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
    };
    return {
      tts: mk(["tts"]),
      imageGen: mk(["image-gen"]),
      musicGen: mk(["audio-gen"]),
      videoGen: mk(["video-gen"]),
      stt: mk(["stt"]),
      llm: mk(["llm"]),
    };
  }, [env]);
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

  const { addToFavorites } = useAddToFavorites({
    skillId: skillId ?? "",
    logger,
    user,
    locale,
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

      {/* Model Selection - View Only */}
      <ModelSelector
        modelSelection={modelSelection}
        readOnly={true}
        locale={locale}
        user={user}
        chatOnly
      />

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

      {/* Vision Bridge - View Only */}
      <Div className="flex flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {t("patch.visionBridgeModel.label")}
        </Span>
        <ModelSelectorTrigger
          modelSelection={field.value?.visionBridgeModelSelection ?? undefined}
          allowedRoles={["llm"]}
          requiredInputs={["image"]}
          defaultModelSelection={viewDefaults.llm}
          placeholder={t("patch.visionBridgeModel.placeholder")}
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
      const all = getAllModelOptions();
      return (
        all.find((m) => m.id === voiceModelSelection.manualModelId) ?? null
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
