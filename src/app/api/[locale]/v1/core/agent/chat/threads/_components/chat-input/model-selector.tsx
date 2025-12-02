"use client";

import type { JSX } from "react";
import React, { useMemo } from "react";

import type { IconValue } from "@/app/api/[locale]/v1/core/agent/chat/model-access/icons";
import { MODEL_UTILITIES } from "@/app/api/[locale]/v1/core/agent/chat/model-access/model-utilities";
import {
  DEFAULT_FAVORITES,
  type ModelId,
  modelOptions,
  modelProviders,
} from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { ModelUtility } from "@/app/api/[locale]/v1/core/agent/chat/model-access/model-utilities";
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
  className?: string;
  buttonClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
  showTextAt?: "always" | "sm" | "md" | "lg" | "never";
}

const STORAGE_KEY = "chat-favorite-models";

export function ModelSelector({
  value,
  onChange,
  locale,
  logger,
  className,
  buttonClassName,
  triggerSize,
  showTextAt,
}: ModelSelectorProps): JSX.Element {
  const { t } = simpleT(locale);
  const [favorites, toggleFavorite] = useFavorites(
    STORAGE_KEY,
    DEFAULT_FAVORITES,
    logger,
  );

  // Convert models to selector options with cost information
  const options: SelectorOption<ModelId>[] = useMemo(() => {
    return Object.values(modelOptions).map((model) => {
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

      // Build utility data for this model
      const utilityIconsMap: Record<string, IconValue> = {};
      const utilityOrdersMap: Record<string, number> = {};
      const utilityTitleKeys: string[] = [];

      if (model.utilities) {
        model.utilities.forEach((utilityId: ModelUtility) => {
          const utility = MODEL_UTILITIES[utilityId];
          if (utility) {
            // Use titleKey for grouping (will be translated by t() in UI)
            utilityTitleKeys.push(utility.titleKey);
            utilityIconsMap[utility.titleKey] = utility.icon;
            utilityOrdersMap[utility.titleKey] = utility.order;
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
        utilities: utilityTitleKeys,
        utilityIcons: utilityIconsMap,
        utilityOrders: utilityOrdersMap,
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
      className={className}
      buttonClassName={buttonClassName}
      triggerSize={triggerSize}
      showTextAt={showTextAt}
    />
  );
}
