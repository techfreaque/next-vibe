"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/characters/enum";
import { CharactersRepositoryClient } from "@/app/api/[locale]/agent/chat/characters/repository-client";
import type { FavoriteCreateRequestOutput } from "@/app/api/[locale]/agent/chat/favorites/create/definition";
import { modelProviders } from "@/app/api/[locale]/agent/models/models";
import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Model Display Widget - Shows the auto-selected or manual model
 *
 * Displays the resolved model for a favorite/character with:
 * - Model icon
 * - Selection mode label (Auto/Manual)
 * - Model name
 * - Credit cost badge
 *
 * Used above range sliders in favorites and characters to show which model will be used.
 */
export function ModelDisplayWidget<const TKey extends string>({
  value,
  context,
  className,
  form,
}: ReactWidgetProps<typeof WidgetType.MODEL_DISPLAY, TKey>): JSX.Element {
  // Watch specific modelSelection fields to react to changes (e.g., when range sliders change)
  // eslint-disable-next-line react-compiler/react-compiler
  const formWatchedValue = useWatch({
    control: form?.control,
    name: "modelSelection",
    disabled: !form,
  });

  const watchedModelSelection = form ? formWatchedValue : null;

  // Try to get data from multiple sources:
  // 1. Direct value (if widget field has data)
  // 2. Form values (for edit/PATCH endpoints) - using watched values for reactivity
  // 3. Response data from context (for GET endpoints)
  let data =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? value
      : null;

  // Try to get from form's watched modelSelection if not found in value
  if (!data && watchedModelSelection) {
    if (
      typeof watchedModelSelection === "object" &&
      watchedModelSelection !== null &&
      !Array.isArray(watchedModelSelection)
    ) {
      data =
        watchedModelSelection as FavoriteCreateRequestOutput["modelSelection"];
    }
  }

  // Try to get from response context if not found yet
  if (!data && context.response && context.response.success === true) {
    const responseData = context.response.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      !Array.isArray(responseData)
    ) {
      const responseObj = responseData as Record<
        string,
        FavoriteCreateRequestOutput["modelSelection"]
      >;
      if (
        typeof responseObj.modelSelection === "object" &&
        responseObj.modelSelection !== null &&
        !Array.isArray(responseObj.modelSelection)
      ) {
        data =
          responseObj.modelSelection as FavoriteCreateRequestOutput["modelSelection"];
      }
    }
  }

  if (!data) {
    return <></>;
  }

  // Handle CHARACTER_BASED - show placeholder message
  if (data.selectionType === ModelSelectionType.CHARACTER_BASED) {
    return (
      <Div
        className={cn(
          "flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl",
          className,
        )}
      >
        <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Icon icon="link" className="h-5 w-5 text-primary" />
        </Div>
        <Div className="flex-1 min-w-0">
          <Span className="block text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
            {context.t("app.chat.selector.characterBased" as const)}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {context.t("app.chat.selector.usesCharacterSettings" as const)}
          </Span>
        </Div>
      </Div>
    );
  }

  // Resolve model for MANUAL and FILTERS
  const resolvedModel = CharactersRepositoryClient.getBestModelForCharacter(
    data as Exclude<
      FavoriteCreateRequestOutput["modelSelection"],
      { selectionType: typeof ModelSelectionType.CHARACTER_BASED }
    >,
  );

  const isAutoMode = data.selectionType === ModelSelectionType.FILTERS;

  if (!resolvedModel) {
    // No model matches the filter criteria
    if (isAutoMode) {
      return (
        <Div
          className={cn(
            "flex items-center gap-3 p-3 bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/25 rounded-xl",
            className,
          )}
        >
          <Div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
            <Icon icon="alert-circle" className="h-5 w-5 text-destructive" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Span className="block text-[11px] text-destructive uppercase tracking-wide font-medium">
              {context.t("app.chat.selector.noModelsMatch" as const)}
            </Span>
            <Span className="text-sm text-destructive/80">
              {context.t("app.chat.selector.adjustFiltersMessage" as const)}
            </Span>
          </Div>
        </Div>
      );
    }
    // Manual mode but model doesn't exist
    return <></>;
  }

  const labelKey = isAutoMode
    ? ("app.chat.selector.autoSelectedModel" as const)
    : ("app.chat.selector.manualSelectedModel" as const);

  const providerName =
    resolvedModel.provider && modelProviders[resolvedModel.provider]
      ? modelProviders[resolvedModel.provider].name
      : "Unknown";

  return (
    <Div
      className={cn(
        "flex items-start gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl",
        className,
      )}
    >
      <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <Icon icon={resolvedModel.icon} className="h-5 w-5 text-primary" />
      </Div>
      <Div className="flex-1 min-w-0">
        <Span className="block text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-1">
          {context.t(labelKey)}
        </Span>
        <Div className="flex items-baseline gap-2">
          <Div className="flex-1 min-w-0">
            <Span className="text-sm font-semibold text-primary block">
              {resolvedModel.name}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {providerName}
            </Span>
          </Div>
          <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
            {resolvedModel.creditCost}{" "}
            {context.t("app.api.agent.models.creditCostUnit" as const)}
          </Badge>
        </Div>
      </Div>
    </Div>
  );
}

ModelDisplayWidget.displayName = "ModelDisplayWidget";
