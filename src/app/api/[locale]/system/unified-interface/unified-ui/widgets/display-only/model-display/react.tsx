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
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { ReactWidgetProps } from "../../_shared/react-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { ModelDisplayWidgetConfig } from "./types";

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
export function ModelDisplayWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
>({
  context,
  field,
}: ReactWidgetProps<
  TEndpoint,
  ModelDisplayWidgetConfig<TUsage, TSchemaType>
>): JSX.Element {
  // Watch modelSelection from form to react to changes
  const watchedModelSelection = useWatch("modelSelection");

  // Try to get data from multiple sources:
  // 1. Direct value (if widget field has data)
  // 2. Form watched values (for edit/PATCH endpoints) - watched for reactivity
  // 3. Response data from context (for GET endpoints)
  let data: FavoriteCreateRequestOutput["modelSelection"] | null = null;

  if (field.value) {
    data = field.value;
  }

  // Try to get from form's watched modelSelection if not found in value
  if (!data && watchedModelSelection) {
    data = watchedModelSelection;
  }

  // Try to get from response context if not found yet
  if (!data && context.response && context.response.success === true) {
    const responseData = context.response.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      !Array.isArray(responseData) &&
      "modelSelection" in responseData
    ) {
      const modelSelection = responseData["modelSelection"];
      if (modelSelection) {
        data = modelSelection;
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
        )}
      >
        <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Icon icon="link" className="h-5 w-5 text-primary" />
        </Div>
        <Div className="flex-1 min-w-0">
          <Span className="block text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
            {context.t("app.chat.selector.characterBased")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {context.t("app.chat.selector.usesCharacterSettings")}
          </Span>
        </Div>
      </Div>
    );
  }

  // Resolve model for MANUAL and FILTERS
  // After CHARACTER_BASED check above, data can only be MANUAL or FILTERS
  const resolvedModel =
    CharactersRepositoryClient.getBestModelForCharacter(data);

  const isAutoMode = data.selectionType === ModelSelectionType.FILTERS;

  if (!resolvedModel) {
    // No model matches the filter criteria
    if (isAutoMode) {
      return (
        <Div
          className={cn(
            "flex items-center gap-3 p-3 bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/25 rounded-xl",
          )}
        >
          <Div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
            <Icon icon="alert-circle" className="h-5 w-5 text-destructive" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Span className="block text-[11px] text-destructive uppercase tracking-wide font-medium">
              {context.t("app.chat.selector.noModelsMatch")}
            </Span>
            <Span className="text-sm text-destructive/80">
              {context.t("app.chat.selector.adjustFiltersMessage")}
            </Span>
          </Div>
        </Div>
      );
    }
    // Manual mode but model doesn't exist
    return <></>;
  }

  const labelKey = isAutoMode
    ? "app.chat.selector.autoSelectedModel"
    : "app.chat.selector.manualSelectedModel";

  const providerName =
    resolvedModel.provider && modelProviders[resolvedModel.provider]
      ? modelProviders[resolvedModel.provider].name
      : "Unknown";

  return (
    <Div className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl">
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
            {context.t("app.api.agent.models.creditCostUnit")}
          </Badge>
        </Div>
      </Div>
    </Div>
  );
}

ModelDisplayWidget.displayName = "ModelDisplayWidget";

export default ModelDisplayWidget;
