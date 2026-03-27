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
import { ModelSelector } from "@/app/api/[locale]/agent/models/widget/model-selector";
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

import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { ModelSelectionSimple } from "../../../models/types";
import {
  ToolsConfigEdit,
  type ToolEntry,
  type ToolsConfigValue,
} from "../../../tools/widget/tools-config-widget";

import { useChatSettings } from "../../settings/hooks";
import { ChatSettingsRepositoryClient } from "../../settings/repository-client";
import { CompactTriggerEdit } from "../../settings/widget";
import { useSkill } from "../../skills/[id]/hooks";
import definitionPatch from "./definition";
import type { FavoriteUpdateResponseOutput } from "./definition";

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

  const favoriteModelSelection: ModelSelectionSimple | undefined =
    form.watch("modelSelection") ?? undefined;

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
  const favoriteCharacterModelSelection: ModelSelectionSimple | undefined =
    favoriteGetEndpoint.read?.data?.characterModelSelection ?? undefined;

  const characterEndpoint = useSkill(skillId ?? "", user, logger);
  const characterData = characterEndpoint.read?.data;

  // Get settings to check if this favorite is active
  const settingsOps = useChatSettings(user, logger);

  // Check if this favorite is currently active
  const isActiveFavorite =
    settingsOps.settings?.activeFavoriteId === favoriteId;

  // Stable props
  const emptyField = useMemo(() => ({}), []);

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
    const currentVoice = favorite?.voice ?? null;

    await ChatSettingsRepositoryClient.selectFavorite({
      favoriteId: activatingFavoriteId,
      modelId,
      skillId: currentSkillId,
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
        {(form.formState.isDirty || isSubmitting) && (
          <>
            <SubmitButtonWidget<typeof definitionPatch.PATCH>
              field={{
                text: "patch.saveButton.label",
                loadingText: "patch.saveButton.loadingText",
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
                isNoSkill
                  ? undefined
                  : (favoriteCharacterModelSelection ??
                    characterData?.modelSelection)
              }
              locale={locale}
              user={user}
            />
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
                characterData?.modelSelection ??
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
      </Div>
    </Div>
  );
}

// ─── Denied Tools Edit ────────────────────────────────────────────────────────

/* eslint-disable oxlint-plugin-i18n/no-literal-string */
function DeniedToolsEdit({
  value,
  onChange,
  user,
  logger,
  label,
  description,
}: {
  value: ToolEntry[] | null;
  onChange: (denied: ToolEntry[] | null) => void;
  user: ReturnType<typeof useWidgetUser>;
  logger: ReturnType<typeof useWidgetLogger>;
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
    () => new Set((value ?? []).map((t) => t.toolId)),
    [value],
  );

  const filteredTools = useMemo(() => {
    if (!searchQuery) {
      return availableTools;
    }
    const q = searchQuery.toLowerCase();
    return availableTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.aliases?.some((a) => a.toLowerCase().includes(q)),
    );
  }, [availableTools, searchQuery]);

  const handleToggle = (toolId: string): void => {
    if (deniedSet.has(toolId)) {
      const next = (value ?? []).filter((t) => t.toolId !== toolId);
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
              placeholder="Search tools..."
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
                Clear all
              </Button>
            )}
          </Div>

          <Div className="flex flex-col divide-y border rounded-lg overflow-y-auto max-h-[30dvh]">
            {filteredTools.length === 0 ? (
              <Div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No tools found
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
                        blocked
                      </Span>
                    )}
                  </Div>
                );
              })
            )}
          </Div>

          <Span className="text-[10px] text-muted-foreground">
            Blocked tools cannot be called regardless of other settings.
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
  isSubmitting,
  t,
}: {
  form: ReturnType<typeof useWidgetForm>;
  navigation: ReturnType<typeof useWidgetNavigation>;
  logger: ReturnType<typeof useWidgetLogger>;
  locale: ReturnType<typeof useWidgetLocale>;
  user: ReturnType<typeof useWidgetUser>;
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
        let modelId = null;
        if (favoriteData.modelSelection) {
          const { SkillsRepositoryClient } =
            await import("../../skills/repository-client");
          const bestModel = SkillsRepositoryClient.getBestModelForFavorite(
            favoriteData.modelSelection,
            undefined,
            user,
          );
          modelId = bestModel?.id || null;
        }

        // Activate this favorite
        await ChatSettingsRepositoryClient.selectFavorite({
          favoriteId,
          modelId,
          skillId: favoriteData.skillId || null,
          voice: favoriteData.voice || null,
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
