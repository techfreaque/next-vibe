"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { Icon } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { modelProviders } from "../../../models/models";
import type { CharacterModelSelection } from "../create/definition";
import { ModelSelectionType } from "../enum";
import { CharactersRepositoryClient } from "../repository-client";

/**
 * Model Display Widget - Shows the auto-selected or manual model
 *
 * Displays the resolved model for a favorite/character with:
 * - Model icon
 * - Selection mode label (Auto/Manual/Character-based)
 * - Model name and provider
 * - Credit cost badge
 *
 * Used in favorites edit panel and character settings to show which model will be used.
 */
export function ModelDisplay({
  modelSelection,
  locale,
}: {
  modelSelection: CharacterModelSelection;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);

  // Resolve model for all selection types
  const resolvedModel =
    CharactersRepositoryClient.getBestModelForCharacter(modelSelection);

  // Determine selection mode
  const isAutoMode =
    modelSelection.selectionType === ModelSelectionType.FILTERS;
  const isManualMode =
    modelSelection.selectionType === ModelSelectionType.MANUAL;

  if (!resolvedModel) {
    // No model matches the filter criteria or model doesn't exist
    return (
      <Div className="flex items-center gap-3 p-3 bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/25 rounded-xl">
        <Div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
          <Icon icon="alert-circle" className="h-5 w-5 text-destructive" />
        </Div>
        <Div className="flex-1 min-w-0">
          <Span className="block text-[11px] text-destructive uppercase tracking-wide font-medium mb-0.5">
            {t("app.chat.selector.noModelsMatch" as const)}
          </Span>
          <Span className="text-xs text-destructive/80">
            {isAutoMode
              ? t("app.chat.selector.adjustFiltersMessage" as const)
              : t("app.chat.selector.modelNotFound" as const)}
          </Span>
        </Div>
      </Div>
    );
  }

  // Determine label based on selection type
  const labelKey = isAutoMode
    ? ("app.chat.selector.autoSelectedModel" as const)
    : isManualMode
      ? ("app.chat.selector.manualSelectedModel" as const)
      : ("app.chat.selector.characterSelectedModel" as const);

  const providerName =
    resolvedModel.provider && modelProviders[resolvedModel.provider]
      ? modelProviders[resolvedModel.provider].name
      : "Unknown";

  return (
    <Div className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/25 rounded-xl shadow-sm">
      <Div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <Icon icon={resolvedModel.icon} className="h-5 w-5 text-primary" />
      </Div>
      <Div className="flex-1 min-w-0">
        <Span className="block text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-1">
          {t(labelKey)}
        </Span>
        <Div className="flex items-baseline gap-2 flex-wrap">
          <Div className="flex-1 min-w-0">
            <Span className="text-sm font-semibold text-primary block truncate">
              {resolvedModel.name}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {providerName}
            </Span>
          </Div>
          <Badge variant="secondary" className="text-[10px] h-5 shrink-0">
            {resolvedModel.creditCost === 0
              ? t("app.chat.selector.free")
              : resolvedModel.creditCost === 1
                ? t("app.chat.selector.creditsSingle")
                : t("app.chat.selector.creditsExact", {
                    cost: resolvedModel.creditCost,
                  })}
          </Badge>
        </Div>
      </Div>
    </Div>
  );
}
