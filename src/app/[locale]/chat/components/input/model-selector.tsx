"use client";

import type { JSX } from "react";
import React, { useMemo } from "react";

import type { IconValue } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import { MODEL_UTILITIES } from "@/app/api/[locale]/v1/core/agent/chat/model-access/model-utilities";
import {
  ModelId,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { SelectorBase, type SelectorOption } from "./selector-base";
import { useFavorites } from "./use-favorites";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (value: ModelId) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

const STORAGE_KEY = "chat-favorite-models";

const DEFAULT_FAVORITES: ModelId[] = [
  ModelId.UNCENSORED_LM_V1_1,
  ModelId.GPT_5_NANO,
  ModelId.GPT_5_MINI,
  ModelId.GPT_5,
  ModelId.GPT_5_CODEX,
  ModelId.GPT_OSS_120B,
  ModelId.CLAUDE_HAIKU_4_5,
  ModelId.CLAUDE_SONNET_4_5,
  ModelId.GROK_4_FAST,
  ModelId.GROK_4,
  ModelId.DEEPSEEK_V31,
  ModelId.GEMINI_FLASH_2_5_LITE,
];

export function ModelSelector({
  value,
  onChange,
  locale,
  logger,
}: ModelSelectorProps): JSX.Element {
  const { t } = simpleT(locale);
  const [favorites, toggleFavorite] = useFavorites(
    STORAGE_KEY,
    DEFAULT_FAVORITES,
    logger,
  );

  // Convert models to selector options with cost information
  const options: SelectorOption<ModelId>[] = useMemo(() => {
    return modelOptions.map((model) => {
      const provider = modelProviders[model.provider];
      const costText =
        model.creditCost === 0
          ? t("app.chat.modelSelector.costFree")
          : model.creditCost === 1
            ? t("app.chat.modelSelector.costCredits", {
                count: model.creditCost,
              })
            : t("app.chat.modelSelector.costCreditsPlural", {
                count: model.creditCost,
              });

      // Build utility icons for this model - pass icon values directly
      const utilityIconsMap: Record<string, IconValue> = {};
      if (model.utilities) {
        model.utilities.forEach((utilityId) => {
          const utility = MODEL_UTILITIES[utilityId];
          if (utility) {
            utilityIconsMap[utilityId] = utility.icon;
          }
        });
      }

      return {
        id: model.id,
        name: model.name,
        description: costText,
        tooltip: t("app.chat.modelSelector.tooltip", {
          provider: provider.name,
          name: model.name,
          cost: costText,
        }),
        // Pass the original icon values, not resolved components
        icon: model.icon,
        group: provider.name,
        groupIcon: provider.icon,
        utilities: model.utilities,
        utilityIcons: utilityIconsMap,
      };
    });
  }, [t]);

  return (
    <SelectorBase
      value={value}
      onChange={onChange}
      options={options}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      placeholder={t("app.chat.modelSelector.placeholder")}
      locale={locale}
    />
  );
}
